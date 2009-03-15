/**
 * Adds droppable element to controller actions by adding the following events:
<table class='options'>
    <tr><th>Event</th><th>Description</th></tr>
    <tr>
        <td>dropadd</td>
        <td>Called when drops are added to the list of drops.  This happens when a drag starts.</td>
    </tr>
    <tr>
        <td>dropover</td>
        <td>Called when a drag moves over a drop element</td>
    </tr>
    <tr>
        <td>dropout</td>
        <td>Called when a drag is moved out of a drop element</td>
    </tr>
    <tr>
        <td>dropmove</td>
        <td>Called as an element moves over a drop element</td>
    </tr>
    <tr>
        <td>dropped</td>
        <td>Called when a drag is dropped on the drop element</td>
    </tr>
</table>

Drop actions are called with [MVC.Controller.Params.Drop].  Use Params.Drop to adjust drop functionality
 * and cache drop points.  For more information on how Drops work read [MVC.Droppables]
 * <h3>Install</h3>
@code_start
include.plugins('controller/dragdrop')
@code_end
 */
MVC.Controller.Action.Drop = MVC.Controller.Action.extend(
/* @static */
{
    /**
     * matches "(.*?)\\s?(dropover|dropped|dropout|dropadd|dropmove)$"
     */
    match: new RegExp("(.*?)\\s?(dropover|dropped|dropout|dropadd|dropmove)$")
},
/* @prototype */
{    
    /**
     * 
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element){
        this._super(action_name, callback, className, element)
        this.css_and_event();
        var selector = this.selector();
        
        var delegates = this.delegates();
        if(!delegates.drops) delegates.drops = {};
        var drops = delegates.drops;
        
        MVC.Droppable.addElement(element);
        
		// add selector to list of selectors:
        if(! drops[selector]) drops[selector] = {};
        drops[selector][this.event_type] = callback; 
    }
});
/**
 * @constructor MVC.Controller.Params.Drop
 * [MVC.Controller.Action.Drop Drop actions] are called with Params.Drop.  
 * The most important param function is cache_position.  If your drop elements are not
 * changing position after dragstart, use cache_position for large performance improvements.
 * 
   <h3>Passing data from drag events to drop events</h3>
   
 * Drop params include a drag attribute, which contains the contents of the MVC.Draggable object 
 * that represented the drag.  If you want to pass data to a drop event from your drag, you 
 * can save it in MVC.Controller.Params.Drag's drag_action attribute, and recover it from 
 * MVC.Controller.Params.Drop's drag attribute.  For example:
 * 
 * <h3>Drag Controller</h3>
@code_start
    dragstart: function(params){
		params.drag_action.data = {some: "data"};
    }
@code_end
 * 
 * <h3>Drop Controller</h3>
@code_start
    dropped: function(params){
		var data = params.drag.data;
    }
@code_end
 * 
 * @init
 * Same functionality as [MVC.Controller.Params]
 */


/**
 * @class MVC.Droppable
 * @hide
 * A collection of all the drop elements.
 */
MVC.Class.extend('MVC.Droppable',
/* @Class */
{
    init : function(){
        MVC.Drag.responder = this;  
    },
    drops: [],
	_elements: [],
    addElement : function(el){
        //check other elements
        for(var i =0; i < this._elements.length ; i++  ){
            if(el ==this._elements[i]) return;
        }
        this._elements.push(el);
    },
    removeElement : function(el){
         for(var i =0; i < this._elements.length ; i++  ){
            if(el == this._elements[i]){
                this._elements.splice(i,1)
                return;
            }
        }
    },
	/**
	 * Creates a new droppable and adds it to the list.
	 * @param {Object} element
	 * @param {Object} callbacks - callback functions for drop events
	 */
	add: function(element, callbacks, event) {
		element = jQuery(element);
        
		var droppable = new MVC.Droppable(callbacks, element);
		
        if(droppable.dropadd) droppable.dropadd(element, event, droppable);
		
        if(!droppable._canceled){
		    element.makePositioned();
		    this.drops.push(droppable);
		}
	    
	},
	/**
	* For a list of affected drops, finds the one that is deepest in
	* the dom.
	* @param {Object} drops
	* @return {MVC.Controller.Params.Drop} deepest
	*/
	findDeepestChild: function(drops) {
		//return right away if there are no drops
		
        if(drops.length == 0) return null;
		var deepest = drops[0];

		for (i = 1; i < drops.length; ++i)
		  if (drops[i].element.compare( deepest.element) & 16 )
		    deepest = drops[i];
		
		return deepest;
	},
	/**
	 * Tests if a drop is within the point.
	 * @param {Object} point
	 * @param {Object} element
	 * @param {Object} drop
	 */
	isAffected: function(point, element, drop) {
        return (
		  (drop.element!=element) && drop.element.within(point[0], point[1], drop).length == 1 ) ;
	},
	/**
	 * Calls dropout and sets last active to null
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	deactivate: function(drop, drag, event) {
		this.last_active = null;
		if(drop.dropout) drop.dropout(drop.element, event, drop, drag);
	}, 
	/**
	 * Calls dropover
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	activate: function(drop, drag, event) { //this is where we should call over
        this.last_active = drop;
        if(drop.dropover) drop.dropover( drop.element, event, drop, drag);
	},
    dropmove : function(drop, drag, event){
        if(drop.dropmove) drop.dropmove( drop.element, event, drop, drag);
    },
	/**
	* Gives a point, the object being dragged, and the latest mousemove event.
	* Go through each droppable and see if it is affected.  Called on every mousemove.
	* @param {Object} point
	* @param {Object} drag
	* @param {Object} event
	*/
	show: function(point, drag, event) {
		
		var element = drag.drag_element;
		if(!this.drops.length) return;
		
		var drop, affected = [];
		
		for(var d =0 ; d < this.drops.length; d++ ){
		    if(MVC.Droppable.isAffected(point, element, this.drops[d])) 
				affected.push(this.drops[d]);   
		}

		drop = MVC.Droppable.findDeepestChild(affected);
		
        
		//if we've activated something, but it is not this drop, deactivate (dropout)
		if(this.last_active && this.last_active != drop) 
		    this.deactivate(this.last_active, drag, event);
		
		//if we have something, dropover it
		if (drop && drop != this.last_active) 
		  this.activate(drop, drag, event);
		
        if(drop && this.last_active){
          this.dropmove(drop, drag, event);
        }
	},
	/**
	 * Called on mouse up of a dragged element.
	 * @param {Object} event
	 * @param {Object} element
	 */
	end: function(event, drag) {
		if(!this.last_active) return;
        var pointer = new MVC.Vector(event.pageX, event.pageY);
		if( this.isAffected(pointer, drag.drag_element, this.last_active) && //last is still activated
			this.last_active.dropped	){ 											//drop was ok
			
            this.last_active.dropped({drag: drag, event: event, element: this.last_active.element}); 
		    return true; 
		}
	},
	/**
	* Called when the user first starts to drag.  Uses query to get
	* all possible droppable elements and adds them.
	*/
	compile : function(event){
      for(var i=0; i < MVC.Droppable._elements.length; i++){
          var drops = jQuery.data(MVC.Droppable._elements[i], "delegates").drops;
          for(var selector in drops){
    	      var sels = jQuery(selector)
    	      for(var e= 0; e < sels.length; e++){
    	          MVC.Droppable.add(sels[e], drops[selector], event)
    	      }
    	  }
	  }

	},
	/**
	* Called after dragging has stopped.
	*/
	clear : function(){
	  this.drops = [];
	}
},
/* @Prototype */
{
    init : function(callbacks, element){
        MVC.Object.extend(this,callbacks);
        this.element = element;
    },
    
    /**
     * Caches positions of draggable elements.  This should be called in dropadd.  For example:
     * @code_start
     * dropadd : function(params){ params.cache_position() }
     * @code_end
     */
	cache_position: function(value){
        this._cache = value != null ? value : true;
    },
	/**
	 * cancels this drop
	 */
    cancel : function(){
        this._cancel = true;
    }
})


