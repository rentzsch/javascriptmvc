/*
 * TODOS:
 * - Delegation events need to be turned canceled.
 * - Would there even be a way to cancel controller actions?  Eventually.
 * - Clean up callback parameter passing system for drags.  
 *     Issue is that multiple drag actions only need 1 DelegationEvent
 * - Event should be extended with pointer
 * - How can we add options, like return, or cancel the drag or drop.
 *     Most of that can happen in the actions, we can just write in extra helper actions
 */

//DragAction
//  Alows actions with the following events:
//    dragstart -> called when the drag is first moved
//    dragend -> when someone lets go of a dragable object
//    dragging -> called everytime someone moves the drag

MVC.Controller.DragAction = MVC.Controller.DelegateAction.extend({
    match: new RegExp("(.*?)\\s?(dragstart|dragend|dragging)$")
},
//Prototype functions
{    
    init: function(action, f, controller){
        this.action = action;
        this.func = f;
        this.controller = controller;
        this.css_and_event();
        var selector = this.selector();
        //here we are going to create a new mousedown event for selectors that match our mouse event
        
        //if one has already been created, lets add it to the list of callbacks we want to give our
        //draggable
        if(MVC.Draggable.selectors[selector]) {
            MVC.Draggable.selectors[selector].events[this.event_type] = action;
            return;
        }
        
        
        MVC.Draggable.selectors[selector] = 
            new MVC.Delegator(this.selector(), 'mousedown', function(params){
               //go through list of events, add as parameters for
               for(var event_type in MVC.Draggable.selectors[selector].events){
                   if(MVC.Draggable.selectors[selector].events.hasOwnProperty(event_type) )
                       params[event_type] = MVC.Controller.controllers[controller.className][0].dispatch_closure(MVC.Draggable.selectors[selector].events[event_type]);
               }
               // create the dragable with the callbacks in place;
               // these callbacks should be prepared above, so they aren't created everytime you start dragging.
               //set to start
               MVC.Draggable.current = new MVC.Draggable(params);
               params.event.kill();
               //return false;
            });
        MVC.Draggable.selectors[selector].events = {};
        MVC.Draggable.selectors[selector].events[this.event_type] = action;
    }
});
//drag controller name, for each selector and event, 
//Dragable takes the element and initial mousedown event as parameters.
MVC.Draggable = function(params){
    this.element = params.element;
    this.moved = false;
    this.keep_dragging = true;
    //this.originalz = MVC.Element.get_style(this.element,'z-Index');
    //this.originallyAbsolute = MVC.Element.get_style(this.element,'position')  == 'absolute';

    this.mouse_position_on_element = 
            MVC.Event.pointer(params.event).minus( MVC.Element.cumulative_offset(params.element) )
    
    this.dragstart = params.dragstart || function(){};
    this.dragend = params.dragend || function(){};
    this.dragging = params.dragging || function(){};
};


MVC.Draggable.prototype = {
    start: function(event){
        this.moved = true;
        this.keep_dragging = true;
        this.drag_element = this.element;
        
        var params = new MVC.Controller.DragParams({
            event: event,
            element: this.element,
            drag_element: this.drag_element,
            drag_action: this
        })
        
        this.dragstart(params);
        
        if(this.keep_dragging == false) return;
        
        this.drag_element = params.drag_element;
        
        MVC.Element.make_positioned(this.drag_element);
        this.start_position =MVC.Element.cumulative_offset(this.drag_element);
        this.drag_element.style.zIndex = 1000;
        
        MVC.Droppables.compile(); //Get the list of Droppables.
    },
    //returns the current relative offset
    currentDelta: function() {
        return new MVC.Vector( parseInt(MVC.Element.get_style(this.drag_element,'left') || '0'), 
                            parseInt(MVC.Element.get_style(this.drag_element,'top') || '0'))   ;
    },
    //draws the position of the dragging object
    draw: function(pointer, event){
        if (!this.moved || !this.keep_dragging)
			this.start(event) //on first move, call start
		// only drag if dragstart doesn't return false
		if(!this.keep_dragging) return;
        MVC.Position.prepare();
        var pos = MVC.Element.cumulative_offset(this.drag_element).minus(this.currentDelta());//current position, minus offset = where element should be
        
        var p = pointer.minus(pos);  //from mouse position
        if(this.element == this.drag_element)
            p = p.minus( this.mouse_position_on_element );
            
        var s = this.drag_element.style;
        s.top =  p.top()+"px";
        s.left =  p.left()+"px";
        MVC.Droppables.show(pointer, this, event);  //Tell dropables where mouse is
        
         var params = new MVC.Controller.DragParams({ event: event, element: this.element, drag_action: this, drag_element: this.drag_element});
        
        this.dragging(params); //Callback to controller dragging action
    },
    end : function(event){
        var drag_data = { element: this.element, event: event, drag_element: this.drag_element, drag_action: this };

        this.dragend(new MVC.Controller.DragParams(drag_data));
        
        if(this._revert){
            new MVC.Animate(this.drag_element, 
                {top: this.start_position.top(), 
                 left: this.start_position.left()},
                 null, null, MVC.Function.bind(this.cleanup, this));
        }else{
            if (this.ghosted_element && this.element.parentNode) {
                MVC.Element.remove(this.element);
            }
            if(this.drag_element != this.element)
                this.drag_element.style.display = 'none';
        }
        
        
        MVC.Droppables.fire(event, this.element);
        
        // ensure that the ghost (if it still exists in the dom) is removed
        
    },
    cleanup : function(){
        if(this.drag_element != this.element)
                this.drag_element.style.display = 'none';
    }
}
MVC.Draggable.selectors = {};

//==============================================================================

MVC.Draggable.current = null;


//Observe all mousemoves and mouseups.
MVC.Event.observe(document, 'mousemove', function(event){
    if(!MVC.Draggable.current ) return;  //do nothing if nothing is being dragged.
    MVC.Delegator.add_kill_event(event);
    event.kill();
    MVC.Draggable.current.draw(MVC.Event.pointer(event), event); //update draw
    return false;
});

MVC.Event.observe(document, 'mouseup', function(event){
    MVC.Delegator.add_kill_event(event);
    //if there is a current, we should call its dragstop
    if(MVC.Draggable.current && MVC.Draggable.current.moved){
        MVC.Draggable.current.end(event);
    }

    MVC.Draggable.current = null;
});

//Assume passed, element, event, and drag_action
MVC.Controller.DragParams = MVC.Controller.Params

MVC.Controller.DragParams.prototype = new MVC.Controller.Params();
MVC.Object.extend(MVC.Controller.DragParams.prototype, {
    cancel_drag: function() {
        this.drag_action.keep_dragging = false;
    },
    ghost: function(callback) {
        // create a ghost by cloning the source element and attach the clone to the dom after the source element
        var ghost = this.element.cloneNode(true);
        MVC.Element.insert(this.element, { after: ghost });
        
        // store the original element and make the ghost the dragged element
        this.drag_element = ghost;
    },
    representitive : function( element ){
        MVC.Position.prepare();
        var p = MVC.Event.pointer(this.event);
        
        this.drag_element = MVC.$E(element);
        
        var s = this.drag_element.style;
        s.top =  p.top()+"px";
        s.left =  p.left()+"px";
        this.drag_element.style.display = '';
    },
    revert : function(){
        this.drag_action._revert = true;
    }
})
