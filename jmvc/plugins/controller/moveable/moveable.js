jQuery.Controller.Action.extend("jQuery.Controller.Action.Move",
/* @static */
{},
/* @prototype */
{    
    /**
     * Attaches a delegated mousedown function to the css selector for this action.  Saves additional actions
     * in callbacks.
     * @param {String} action_name the name of the function
     * @param {Function} f the function itself
     * @param {jQuery.Controller} controller the controller this action belongs to
     */
    init: function(action_name, callback, className, element){
		this._super(action_name, callback, className, element)
        this.css_and_event();
        var selector = this.selector();
        var delegates = this.delegates();
        var cn = this.Class.className.toLowerCase();
        if(!delegates[cn]) delegates[cn] = {};
        var data = delegates[cn];

        //If the selector has already been added, just add this action to its list of possible action callbacks
		if(data[selector]) {
            data[selector].callbacks[this.event_type] = callback;
            return;
        }
		//create a new mousedown event for selectors that match our mouse event
        var self  = this;
        data[selector] = new jQuery.Delegator(selector, 'mousedown', 
           function(event){
                self.mousedown.call(self,element, this, event)
           }, element);
        data[selector].callbacks = {};
        data[selector].callbacks[this.event_type] = callback;
    },
	/**
	 * Called when someone mouses down on a draggable object.
	 * Gathers all callback functions and creates a new Draggable.
	 */
	mousedown : function(element, el, event){
       var isLeftButton = event.which == 1;
       //var jmvc= jQuery.data(this.element,"jmvc");
       var cn = this.Class.className.toLowerCase()
       var callbacks = this.delegates()[cn][this.selector()].callbacks;
       var mover = jQuery[this.Class.className]
       if(mover.current || !isLeftButton) return;
	   
  
       mover.current = new mover(callbacks, el, event);
       event.preventDefault();
       
       this._mousemove = jQuery.Function.bind(this.mousemove, this);
       this._mouseup = jQuery.Function.bind(this.mouseup, this);
       
       jQuery(document).bind('mousemove', this._mousemove);
       jQuery(document).bind('mouseup', this._mouseup);
	   return false;
	},
    mousemove : function(event){
        var current = jQuery[this.Class.className].current;
        var pointer = event.pointer();
        if(current._start_position && current._start_position.equals(pointer)) return;
        event.preventDefault();
        current.draw(pointer, event); //update draw
        return false;
    },
    mouseup : function(event){
        //if there is a current, we should call its dragstop
        var mover = jQuery[this.Class.className];
        var current = mover.current;
        
        if(current && current.moved){
            current.end(event);
    		//mover.clear();
        }
        mover.current = null;
        jQuery(document).unbind('mousemove', this._mousemove);
        jQuery(document).unbind('mouseup', this._mouseup);
    }
});




/**
 * @constructor
 * @hide
 * A draggable object, created on mouse down.  This basically preps a possible drag.
 * Start is called on the first mouse move after the mouse down.  This is to prevent drag from
 * being called on a normal click.
 * This function should do as little as possible.  Start should do more work because we are actually
 * dragging at that point.
 * @init
 * Takes a mousedown even params
 * @param {jQuery.Controller.Params} params a mousedown event, the element it is on, and dragstart, dragend, and dragmove
 */
jQuery.Class.extend("jQuery.Move",{
    init : function(){
        this.actName = this.className.toLowerCase();
    },
    current : null
},
{
    init :  function(callbacks, element, event){
        this.element = jQuery(element); 		//the element that has been clicked on
        this.moved = false;					//if a mousemove has come after the click
        this._cancelled = false;			//if the drag has been cancelled
    	
        this._start_position = new jQuery.Vector(event.pageX, event.pageY)
    	//used to know where to position element relative to the mouse.
        this.mouse_position_on_element = this._start_position.minus( this.element.offsetv() );
    	
        
        this.callbacks = callbacks;
    },
	start: function(event){
		this._start_position = null;        //we no longer care about this
        this.moved = true;					//we have been moved
        var startElement = this.element;
        
        
		//Call the Controller's drag start if they have one.
        if(this[this.Class.actName+"start"])
            this[this.Class.actName+"start"](this.element, event, this  );
        
		//Check what they have set and respond accordingly
        if(this._cancelled == true) return;
        

        //if it is something else (absolutely positioned on the page)
        //this should probably get it's offset minus its left top
        if(startElement != this.element){
            this.start_position = this.element.offsetv();
        }
        else
            this.start_position = this.currentDelta(); //if it is us
            
        this.element.css('zIndex',1000);
        this.Class.responder.compile(event, this);
    },
    /**
     * Returns the position of the drag_element by taking its top and left.
     * @return {Vector}
     */
    currentDelta: function() {
        return new jQuery.Vector( parseInt( this.element.css('left') ) || 0 , 
                            parseInt( this.element.css('top') )  || 0 )  ;
    },
    //draws the position of the dragmove object
    draw: function(pointer, event){
        //on first move, call start
		if (!this.moved) this.start(event) 
		
		// only drag if we haven't been cancelled;
		if(this._cancelled) return;
		
		//Calculate where we should move the drag element to
        var vec = this.element.offsetv();

		var pos = 													//Drag element's starting coords on the page if it had top=0, left=0
				vec	//Drag element's actual coords on the page
				.minus(this.currentDelta());						//How far Drag has moved from its starting coords
        
        var p = 													//Drag element's Top/Left that will move the element to be under the mouse in the right spot
				pointer.											//Where the mouse is
				minus(pos)											//Drag element's starting coords.
				.minus( this.mouse_position_on_element ); 			//the position relative to the container

        this.move( event );
        	
        
		//Call back to dragmove
        
		
		//Tell dropables where mouse is
		this.Class.responder.show(pointer, this, event);  
    },
    move : function(event){
        if(this[this.Class.actName+"move"])
            this[this.Class.actName+"move"](this.element, event, this  );
    },
	/**
	 * Called on drag up
	 * @param {Event} event a mouseup event signalling drag/drop has completed
	 */
    end : function(event){

		this.Class.responder.end(event, this);
        
        if(this[this.Class.actName+"end"])
            this[this.Class.actName+"end"](this.element, event, this  );
        
    },
	/**
	 * Cleans up drag element after drag drop.
	 */
    cleanup : function(){
        if(this.drag_element != this.element)
                this.drag_element.style.display = 'none';
    },
    /**
	 * Stops drag from running.
	 */
	cancel_drag: function() {
        this.drag_action._cancelled = true;
		this.drag_action.end(this.event);
		jQuery.Droppable.clear();
		jQuery.Draggable.current = null;
    },
    /**
	 * Clones an element and uses it as the representitive element.
	 * @param {Function} callback
	 */
    ghost: function(callback) {
        // create a ghost by cloning the source element and attach the clone to the dom after the source element
        var ghost = this.element.cloneNode(true);
        jQuery.Element.insert(this.element, { after: ghost });
        
        // store the original element and make the ghost the dragged element
        this.drag_element = ghost;
    },
	/**
	 * Use a representitive element, instead of the drag_element.
	 * @param {HTMLElement} element the element you want to actually drag
	 * @param {Number} offsetX the x position where you want your mouse on the object
	 * @param {Number} offsetY the y position where you want your mouse on the object
	 */
    representitive : function( element, offsetX, offsetY ){

        this._offsetX = offsetX || 0;
		this._offsetY = offsetY || 0;
		
		var p = jQuery.Event.pointer(this.event);
        
        this.drag_element = jQuery.$E(element);
        var s = this.drag_element.style;
        s.top =  (p.top()-offsetY)+"px";
        s.left =  (p.left()-offsetX)+"px";
        s.display = '';
		this.drag_action.mouse_position_on_element = new jQuery.Vector(offsetX, offsetY)
    },
	/**
	 * Makes the drag_element go back to its original position after drop.
	 */
    revert : function(){
        //this.drag_action._revert = true;
    },
    /**
     * Isolates the drag to vertical movement.
     */
    vertical : function(){
        this.drag_action._vertical = true;
    },
    /**
     * Isolates the drag to horizontal movement.
     */
    horizontal : function(){
        this.drag_action._horizontal = true;
    },
    /**
     * Gets or sets the new position
     * @param {jQuery.Vector} newposition
     * @param {jQuery.Vector} the position the page will be updated to
     */
    position: function(newposition){
        if(newposition)
            this._position = newposition;
        return this._position;
    }
});