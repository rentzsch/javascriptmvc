/**
 * Lasso and [MVC.Controller.Action.Selectable Selectables] let users select elements by dragging a box across 
 * an element.  To use the lasso, you must have a lasso action on the element you want to drag in.
 * 
 * You can use one of the following event names to start a lasso:
<table class='options'>
    <tr><th>Event</th><th>Description</th></tr>
    <tr>
        <td>lassostart</td>
        <td>Called when a lasso drag starts.</td>
    </tr>
    <tr>
        <td>lassomove</td>
        <td>Called with every lasso move.</td>
    </tr>
    <tr>
        <td>lassoend</td>
        <td>Called when the lasso is released.</td>
    </tr>
</table>
 * 
 * For more information on how Lasso works read [MVC.Lasso]
 * <h3>Install</h3>
@code_start
include.plugins('controller/lasso')
@code_end
 * <h3>Potential Issues</h3>
 * If IE lasso area isn't responding, try setting its position to relative.
 */
MVC.Controller.Action.Lasso = MVC.Controller.Action.extend(
/* @static */
{
    /**
     * Matches "(.*?)\\s?(lassostart|lassoend|lassomove)$"
     */
    match: new RegExp("(.*?)\\s?(lassostart|lassoend|lassomove)$"),
    mousemove : function(event){
        if(!MVC.Lasso.current ) return;  //do nothing if nothing is being dragged.
        var current = MVC.Lasso.current;
        
        var pointer = event.pointer();
        if(current._start_position && current._start_position.equals(pointer)) return;

        event.preventDefault();
        MVC.Lasso.current.draw(pointer, event); //update draw
        return false;
    },
    mouseup : function(event){
        //if there is a current, we should call its dragstop
        if(MVC.Lasso.current && MVC.Lasso.current.moved){
            MVC.Lasso.current.end(event);
    		MVC.Droppable.clear();
        }
    
        MVC.Lasso.current = null;
        jQuery(document).unbind('mousemove', MVC.Controller.Action.Drag.mousemove);
        jQuery(document).unbind('mouseup', MVC.Controller.Action.Drag.mouseup);
    }
},
/* @prototype */
{    
    /**
     * Creates the Lasso action
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element){
		this._super(action_name, callback, className, element)
        this.css_and_event();
        var selector = this.selector();
        var delegates = this.delegates();
        if(!delegates.lasso) delegates.lasso = {};
        var lasso = delegates.lasso;
        
        if(lasso[selector]) {
            lasso[selector].callbacks[this.event_type] = callback;
            return;
        }
		//create a new mousedown event for selectors that match our mouse event
        var self  = this;
        lasso[selector] = new MVC.Delegator(selector, 'mousedown', 
           function(event){
                self.mousedown.call(self,element, this, event)
           }, element);
        lasso[selector].callbacks = {};
        lasso[selector].callbacks[this.event_type] = callback;
    },
	/**
	 * Called when someone mouses down on a draggable object.
	 * Gathers all callback functions and creates a new Lasso.
	 */
	mousedown : function(element, el, event){
       var isLeftButton = event.which == 1;
       //var jmvc= jQuery.data(this.element,"jmvc");
       var callbacks = this.delegates().lasso[this.selector()].callbacks;

       if(MVC.Lasso.current || !isLeftButton) return;
	   
  
       MVC.Lasso.current = new MVC.Lasso(callbacks, el, event);
       event.preventDefault();
       jQuery(document).bind('mousemove', MVC.Controller.Action.Lasso.mousemove);
       jQuery(document).bind('mouseup', MVC.Controller.Action.Lasso.mouseup);
	   return false;
	}
});
/**
 * @constructor MVC.Lasso
 * Blah
 * @hide 
 * @init abc
 */
MVC.Lasso = function(callbacks, element, event){
    this.element = jQuery(element); 		//the element that has been clicked on
    this.moved = false;					//if a mousemove has come after the click
    this._cancelled = false;			//if the drag has been cancelled
	
	//Add default functions to be called.
    this.lassostart = callbacks.dragstart || MVC.K;
    this.lassoend = callbacks.dragend || MVC.K;
    this.lassomove = callbacks.dragmove || MVC.K;
    
};


MVC.Lasso.prototype = 
/* @prototype */
{
    /**
     * 
     */
    style_element : function(){
		this.lasso_element.css("position",'absolute').
            css("border","dotted 1px Gray").
            css("zIndex",1000)
	},
    /**
     * 
     * @param {Object} event
     */
	position_lasso : function(event){
		console.log("position")
        
        var current = event.pointer();
		//find the top left event
		this.top = current.top() < this.start_position.top() ? current.top() : this.start_position.top();
		this.left = current.left() < this.start_position.left() ? current.left() : this.start_position.left();
		this.height = Math.abs( current.top() - this.start_position.top()  );
		this.width = Math.abs( current.left() - this.start_position.left()  );
        
        this.lasso_element.css("top",this.top+"px").
                           css("left",this.left+"px").
                           css("width",this.width+"px").
                           css("height",this.height+"px")
        

	},
	/**
     * Called the first time we start dragging.
     * This will call drag start with MVC.Controller.LassoParams
     * @param {Object} event
     */
	start: function(event){
		this.moved = true;					//we have been moved
        this.lasso_element = jQuery(document.createElement('div'));
		jQuery(document.body).append(this.lasso_element)

		this.style_element();

		this.start_position = event.pointer();

		
		//Call the Controller's drag start if they have one.
		var params = {
            event: event,
            element: this.element,
            lasso_element: this.lasso_element,
            lasso_action: this
        };
        this.lassostart(params);
        
		//Check what they have set and respond accordingly
       
        
        
        
		//Get the list of Droppables.  
        MVC.Selectables.compile(); 
    },
    /**
     * Returns the position of the drag_element by taking its top and left.
     * @return {Vector}
     */
    currentDelta: function() {
        return new jQuery.Vector( parseInt(MVC.Element.get_style(this.lasso_element,'left') || '0'), 
                            parseInt(MVC.Element.get_style(this.lasso_element,'top') || '0'))   ;
    },
    //draws the position of the dragging object
    draw: function(pointer, event){
        //on first move, call start
		if (!this.moved) this.start(event) 
		
		// only drag if we haven't been cancelled;
		if(this._cancelled) return;
		

		//Calculate where we should move the drag element to

		this.position_lasso(event);
        
		//Call back to dragging
        var params = 
				{ event: event, 
				  element: this.element, 
				  lasso_action: this, 
				  lasso_element: this.lasso_element};
        this.lassomove(params);
		
		//Tell dropables where mouse is
		MVC.Selectables.show(pointer, this, event);  
    },
	/**
	 * Called on drag up
	 * @param {Event} event a mouseup event signalling drag/drop has completed
	 */
    end : function(event){
        //Call drag end
		var drag_data = { 	element: this.element, 
							event: event, 
							lasso_element: this.lasso_element, 
							lasso_action: this };
        this.lassoend(drag_data);
        this.lasso_element.remove();
		//tell droppables a drop has happened
		//MVC.Droppables.fire(event, this);
		
		//Handle closing animations if necessary
        
    },
	contains: function(selectable){
		return MVC.Position.withinBoxIncludingScrollingOffsets(selectable.element, 
			this.left, this.top, this.width, this.height, selectable);
	}
}
MVC.Lasso.selectors = {};

//==============================================================================

MVC.Lasso.current = null;


//Observe all mousemoves and mouseups.



