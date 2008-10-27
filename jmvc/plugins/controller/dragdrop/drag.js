/**
 * Alows actions with the following events:<br/>
 * 	dragstart -> called when the drag is first moved<br/>
 *  dragging -> called everytime someone moves the drag<br/>
 *  dragend -> when someone lets go of a dragable object
 */
MVC.Controller.DragAction = MVC.Controller.DelegateAction.extend({
    match: new RegExp("(.*?)\\s?(dragstart|dragend|dragging)$")
},
//Prototype functions
{    
    init: function(action, f, controller){
		//can't use init, so set default members
        this.action = action;
        this.func = f;
        this.controller = controller;
        this.css_and_event();
        var selector = this.selector();
		
        //If the selector has already been added, just add this action to its list of possible action callbacks
		if(MVC.Draggable.selectors[selector]) {
            MVC.Draggable.selectors[selector].callbacks[this.event_type] = controller.dispatch_closure(action);
            return;
        }
		//create a new mousedown event for selectors that match our mouse event
        MVC.Draggable.selectors[selector] = 
			new MVC.Delegator(selector, 'mousedown', MVC.Function.bind(this.mousedown, this));
        MVC.Draggable.selectors[selector].callbacks = {};
        MVC.Draggable.selectors[selector].callbacks[this.event_type] = controller.dispatch_closure(action);
    },
	/**
	 * Called when someone mouses down on a draggable object.
	 * Gathers all callback functions and creates a new Draggable.
	 */
	mousedown : function(params){
       //extend params with callbacks
	   MVC.Object.extend(params, MVC.Draggable.selectors[this.selector()].callbacks)
	   MVC.Draggable.current = new MVC.Draggable(params);
       params.event.kill();
	   return false;
	}
});
/**
 * A draggable object, created on mouse down.  This basically preps a possible drag.
 * Start is called on the first mouse move after the mouse down.  This is to prevent drag from
 * being called on a normal click.
 * This function should do as little as possible.  Start should do more work because we are actually
 * dragging at that point.
 * @param {Object} params a mousedown event, the element it is on, and dragstart, dragend, and dragging
 */
MVC.Draggable = function(params){
    this.element = params.element; 		//the element that has been clicked on
    this.moved = false;					//if a mousemove has come after the click
    this._cancelled = false;			//if the drag has been cancelled
	
	//used to know where to position element relative to the mouse.
	this.mouse_position_on_element = 
		MVC.Event.pointer(params.event).
			minus( MVC.Element.cumulative_offset(params.element) );
	
	//Add default functions to be called.
    this.dragstart = params.dragstart || MVC.Draggable.k;
    this.dragend = params.dragend || MVC.Draggable.k;
    this.dragging = params.dragging || MVC.Draggable.k;
};

MVC.Draggable.k = function(){};

MVC.Draggable.prototype = {
    /**
     * Called the first time we start dragging.
     * This will call drag start with MVC.Controller.DragParams
     * @param {Object} event
     */
	start: function(event){
		this.moved = true;					//we have been moved
        this.drag_element = this.element;	//drag_element is what people should use to referrer to 
        									//what has been dragged
		
		//Call the Controller's drag start if they have one.
		var params = new MVC.Controller.DragParams({
            event: event,
            element: this.element,
            drag_element: this.drag_element,
            drag_action: this
        });
        this.dragstart(params);
        
		//Check what they have set and respond accordingly
        if(this._cancelled == true) return;
        
        this.drag_element = params.drag_element;  //if they have set the drag element, update it
        
		//style the drag element for dragging
        MVC.Element.make_positioned(this.drag_element);
        this.start_position =MVC.Element.cumulative_offset(this.drag_element);
        this.drag_element.style.zIndex = 1000;
        
		//Get the list of Droppables.  
        MVC.Droppables.compile(); 
    },
    /**
     * Returns the position of the drag_element by taking its top and left.
     * @return {Vector}
     */
    currentDelta: function() {
        return new MVC.Vector( parseInt(MVC.Element.get_style(this.drag_element,'left') || '0'), 
                            parseInt(MVC.Element.get_style(this.drag_element,'top') || '0'))   ;
    },
    //draws the position of the dragging object
    draw: function(pointer, event){
        //on first move, call start
		if (!this.moved) this.start(event) 
		
		// only drag if we haven't been cancelled;
		if(this._cancelled) return;
		
		//Adjust for scrolling
        MVC.Position.prepare();
		
		//Calculate where we should move the drag element to

		var pos = 													//Drag element's starting coords on the page if it had top=0, left=0
				MVC.Element.cumulative_offset(this.drag_element)	//Drag element's actual coords on the page
				.minus(this.currentDelta());						//How far Drag has moved from its starting coords
        
        var p = 													//Drag element's Top/Left that will move the element to be under the mouse in the right spot
				pointer.											//Where the mouse is
				minus(pos)											//Drag element's starting coords.
				.minus( this.mouse_position_on_element ); 			//the position relative to the container

        var s = this.drag_element.style;
        s.top =  p.top()+"px";
        s.left =  p.left()+"px";		
        
		//Call back to dragging
        var params = new MVC.Controller.DragParams(
				{ event: event, 
				  element: this.element, 
				  drag_action: this, 
				  drag_element: this.drag_element});
        this.dragging(params);
		
		//Tell dropables where mouse is
		MVC.Droppables.show(pointer, this, event);  
    },
	/**
	 * Called on drag up
	 * @param {Event} event a mouseup event signalling drag/drop has completed
	 */
    end : function(event){
        //Call drag end
		var drag_data = { 	element: this.element, 
							event: event, 
							drag_element: this.drag_element, 
							drag_action: this };
        this.dragend(new MVC.Controller.DragParams(drag_data));
        
		//tell droppables a drop has happened
		MVC.Droppables.fire(event, this.element);
		
		//Handle closing animations if necessary
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
    },
	/**
	 * Cleans up drag element after drag drop.
	 */
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
		MVC.Droppables.clear();
    }

    MVC.Draggable.current = null;
});

//Assume passed, element, event, and drag_action
MVC.Controller.DragParams = MVC.Controller.Params

MVC.Controller.DragParams.prototype = new MVC.Controller.Params();
MVC.Object.extend(MVC.Controller.DragParams.prototype, {
	/**
	 * Stops drag from running.
	 */
	cancel_drag: function() {
        this.drag_action._cancelled = true;
		this.drag_action.end(this.event);
		MVC.Droppables.clear();
		MVC.Draggable.current = null;
    },
	/**
	 * Clones an element and uses it as the representitive element.
	 * @param {Object} callback
	 */
    ghost: function(callback) {
        // create a ghost by cloning the source element and attach the clone to the dom after the source element
        var ghost = this.element.cloneNode(true);
        MVC.Element.insert(this.element, { after: ghost });
        
        // store the original element and make the ghost the dragged element
        this.drag_element = ghost;
    },
	/**
	 * Use a representitive element, instead of the drag_element.
	 * @param {HTMLElement} element
	 * @param {Number} offsetX
	 * @param {Number} offsetY
	 */
    representitive : function( element, offsetX, offsetY ){
        MVC.Position.prepare();
        this._offsetX = offsetX || 0;
		this._offsetY = offsetY || 0;
		
		var p = MVC.Event.pointer(this.event);
        
        this.drag_element = MVC.$E(element);
        var s = this.drag_element.style;
        s.top =  (p.top()-offsetY)+"px";
        s.left =  (p.left()-offsetX)+"px";
        s.display = '';
		this.drag_action.mouse_position_on_element = new MVC.Vector(offsetX, offsetY)
    },
	/**
	 * Makes the drag_element go back to its original position after drop.
	 */
    revert : function(){
        this.drag_action._revert = true;
    }
})
