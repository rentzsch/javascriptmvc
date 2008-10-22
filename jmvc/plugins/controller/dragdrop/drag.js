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
               MVC.Draggable.current = new MVC.Draggable(params);
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
        
        
        
        var drag_data = {
            element: this.element, 
            event: event, 
            cancel_drag: MVC.Function.bind(function() {
                this.keep_dragging = false;
            }, this),
            use_ghost: MVC.Function.bind( function(callback) {
                // create a ghost by cloning the source element and attach the clone to the dom after the source element
                var ghost = this.element.cloneNode(true);
                MVC.Element.insert(this.element, { after: ghost });

                if (callback && typeof callback == 'function')
                    // the user supplied a callback to the function, because they want to style the ghost themselves
                    callback(this.element, ghost);
                else
                    // at the very least, pull the ghost out of the document flow so it doesn't mess up the existing layout
                    ghost.style.position = 'absolute';

                // store the original element and make the ghost the dragged element
                this.ghosted_element = this.element;
                this.element = ghost;
            },this),
            revert : MVC.Function.bind( function(){
                this._revert = true;
            }, this)
        }

        
        
        
        this.dragstart(drag_data);
        
        MVC.Element.make_positioned(this.element);
        this.start_position =MVC.Element.cumulative_offset(this.element);
        this.element.style.zIndex = 1000;
        
        MVC.Droppables.compile(); //Get the list of Droppables.
    },
    //returns the current relative offset
    currentDelta: function() {
        return new MVC.Vector( parseInt(MVC.Element.get_style(this.element,'left') || '0'), 
                            parseInt(MVC.Element.get_style(this.element,'top') || '0'))   ;
    },
    //draws the position of the dragging object
    draw: function(pointer, event){
        if (!this.moved || !this.keep_dragging)
			this.start(event) //on first move, call start
		// only drag if dragstart doesn't return false
		if(!this.keep_dragging) return;
        MVC.Position.prepare();
        var pos = MVC.Element.cumulative_offset(this.element).minus(this.currentDelta());//current position, minus offset = where element should be
        
        var p = pointer.minus(pos).minus( this.mouse_position_on_element );  //from mouse position
        
        var s = this.element.style;
        s.top =  p.top()+"px";
        s.left =  p.left()+"px";
        MVC.Droppables.show(pointer, this.element, event);  //Tell dropables where mouse is
        this.dragging({element: this.element, event: event}); //Callback to controller dragging action
    }
}
MVC.Draggable.selectors = {};

//==============================================================================

MVC.Draggable.current = null;


//Observe all mousemoves and mouseups.
MVC.Event.observe(document, 'mousemove', function(event){
    if(!MVC.Draggable.current ) return;  //do nothing if nothing is being dragged.
    MVC.Draggable.current.draw(MVC.Event.pointer(event), event); //update draw
});

MVC.Event.observe(document, 'mouseup', function(event){
    //if there is a current, we should call its dragstop
    if(MVC.Draggable.current){
        var current = MVC.Draggable.current;
        var drag_data = { element: current.element, event: event };

        // if there is a ghost, pass it and the source element in the drag data
        if (current.ghosted_element) {
            drag_data.ghost = drag_data.element;
            drag_data.element = current.ghosted_element;
        }

        current.dragend(drag_data);
        if(current._revert){
            new MVC.Animate(current.element, {top: "0px", left: "0px"});
        }
        
        
        MVC.Droppables.fire(event, current.element);
        
        // ensure that the ghost (if it still exists in the dom) is removed
        if (current.ghosted_element && current.element.parentNode) {
            MVC.Element.remove(current.element);
        }
    }

    MVC.Draggable.current = null;
});




