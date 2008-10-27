/*
 * TODOS:
 * - Need to remove droppables after something has been dropped, or just keep adding new ones
 * - Need a method for removing droppables
 * 
 */
/**
 * Allows actions to handle being dropped on.  Adds the following actions:<br/>
 * dropadd    -> Called when drops are added, when a drag starts
 * dropover -> Called when a drag is over a drop
 * dropout    -> Called when a drag is moved out of a drop area
 * dropped    -> Called when a drag is dropped on the drop
 */
MVC.Controller.DropAction = MVC.Controller.DelegateAction.extend({
    match: new RegExp("(.*?)\\s?(dropover|dropped|dropout|dropadd)$")
},
/* @prototype */
{    
    init: function(action, f, controller){
        this.action = action;
        this.func = f;
        this.controller = controller;
        this.css_and_event();
        var selector = this.selector();
        
		// add selector to list of selectors:
        if(! MVC.Droppables.selectors[selector]) MVC.Droppables.selectors[selector] = {};
        MVC.Droppables.selectors[selector][this.event_type] = controller.dispatch_closure(action); 
    }
});
MVC.Droppable = MVC.Controller.Params

MVC.Droppable.prototype = new MVC.Controller.Params();
MVC.Object.extend(MVC.Droppable.prototype, {
    /**
     * Caches positions of draggable elements.  Call in dropadd
     */
	cache_position: function(){
        this._cache = true;
    },
	/**
	 * cancels this drop
	 */
    cancel : function(){
        this._cancel = true;
    }
})

MVC.Droppables = {
	drops: [],
	selectors: {},
	/**
	 * Creates a new droppable and adds it to the list.
	 * @param {Object} element
	 * @param {Object} functions - callback functions for drop events
	 */
	add: function(element, functions) {
		element = MVC.$E(element);
		
		functions.element = element;
		var droppable = new MVC.Droppable(functions);
		if(droppable.dropadd) droppable.dropadd(droppable);
		if(!droppable._canceled){
		    MVC.Element.make_positioned(element);
		    this.drops.push(droppable);
		}
	    
	},
	/**
	* For a list of affected drops, finds the one that is deepest in
	* the dom.
	* @param {Object} drops
	* @return {MVC.Droppable} deepest
	*/
	findDeepestChild: function(drops) {
		//return right away if there are no drops
		if(drops.length == 0) return null;
		var deepest = drops[0];
		  
		for (i = 1; i < drops.length; ++i)
		  if (MVC.Element.has(drops[i].element, deepest.element))
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
		  (drop.element!=element) && 
		  MVC.Position.withinIncludingScrolloffsets(drop.element, point[0], point[1], drop ) ) ;
	},
	/**
	 * Calls dropout and sets last active to null
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	deactivate: function(drop, drag, event) {
		this.last_active = null;
		if(drop.dropout) drop.dropout( {element: drop.element, drag: drag, event: event });
	}, 
	/**
	 * Calls dropover
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	activate: function(drop, drag, event) { //this is where we should call over
		this.last_active = drop;
		if(drop.dropover) drop.dropover( {element: drop.element, drag: drag, event: event });
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
		    if(MVC.Droppables.isAffected(point, element, this.drops[d])) 
				affected.push(this.drops[d]);   
		}

		drop = MVC.Droppables.findDeepestChild(affected);
		
		//if we've activated something, but it is not this drop, deactivate (dropout)
		if(this.last_active && this.last_active != drop) 
		    this.deactivate(this.last_active, drag, event);
		
		//if we have something, dropover it
		if (drop && drop != this.last_active) 
		  this.activate(drop, drag, event);
		
	},
	/**
	 * Called on mouse up of a dragged element.
	 * @param {Object} event
	 * @param {Object} element
	 */
	fire: function(event, element) {
		if(!this.last_active) return;
		MVC.Position.prepare();
		
		if( this.isAffected(MVC.Event.pointer(event), element, this.last_active) && //last is still activated
			this.last_active.dropped	){ 											//drop was ok
			this.last_active.dropped({drag_element: element, event: event, element: this.last_active.element}); 
		    return true; 
		}
	},
	/**
	* Called when the user first starts to drag.  Uses query to get
	* all possible droppable elements and adds them.
	*/
	compile : function(){
	  var elements = [];
	  for(var selector in MVC.Droppables.selectors){
	      var sels = elements.concat( MVC.Query(selector) )
	      for(var e= 0; e < sels.length; e++){
	          MVC.Droppables.add(sels[e], MVC.Droppables.selectors[selector])
	      }
	  }
	},
	/**
	* Called after dragging has stopped.
	*/
	clear : function(){
	  this.drops = [];
	}
};


//add mouseover and mouseout when something is being dragged.
//  be good if mouseover and mouseout can only be called when appropriate

MVC.Controller.DropAction = MVC.Controller.DelegateAction.extend({
    match: new RegExp("(.*?)\\s?(dragover|dropped|dragout)$")
},
//Prototype functions
{    
    init: function(action, f, controller){
        this.action = action;
        this.func = f;
        this.controller = controller;
        this.css_and_event();
        var selector = this.selector();
        // basically add selector to list of selectors:
        if(MVC.Droppables.selectors[selector]) {
            MVC.Droppables.selectors[selector][this.event_type] = MVC.Controller.controllers[controller.className][0].dispatch_closure(action);
            return;
        }
        MVC.Droppables.selectors[selector] = {};
        MVC.Droppables.selectors[selector][this.event_type] =
            MVC.Controller.controllers[controller.className][0].dispatch_closure(action); 
    }
});


MVC.Droppables = {
  drops: [],
  selectors: {},
  remove: function(element) {
    this.drops = this.drops.reject(function(d) { return d.element==$(element) });
  },

  add: function(element) {
    element = MVC.$E(element);
    var options = MVC.Object.extend({}, arguments[1] || { });

    // cache containers
    /*if(options.containment) {
      options._containers = [];
      var containment = options.containment;
      if(Object.isArray(containment)) {
        containment.each( function(c) { options._containers.push($(c)) });
      } else {
        options._containers.push($(containment));
      }
    }
    
    if(options.accept) options.accept = [options.accept].flatten();*/

    MVC.Element.make_positioned(element); // fix IE
    options.element = element;

    this.drops.push(options);
  },
  
  findDeepestChild: function(drops) {
    var deepest = drops[0];
      
    for (i = 1; i < drops.length; ++i)
      if (MVC.Element.has(drops[i].element, deepest.element))
        deepest = drops[i];
    
    return deepest;
  },

  isContained: function(element, drop) {
    var containmentNode = element.parentNode;
    for(var c = 0; i < drop._containers.length; i++ ){
        if(containmentNode == drop._containers[c]) return drop._containers[c]
    }
  },
  
  isAffected: function(point, element, drop) {
    return (
      (drop.element!=element) &&
      ( (!drop._containers) || this.isContained(element, drop) ) && 
      MVC.Position.withinIncludingScrolloffsets(drop.element, point[0], point[1]) );
  },

  deactivate: function(drop, drag, event) {
    this.last_active = null;
    if(drop.dragout) drop.dragout( {element: drop.element, drag: drag, event: event });
  }, //this is where we should call out

  activate: function(drop, drag, event) { //this is where we should call over
    this.last_active = drop;
    if(drop.dragover) drop.dragover( {element: drop.element, drag: drag, event: event });
      
  },

  show: function(point, drag, event) {
    var element = drag.drag_element;
    if(!this.drops.length) return;
    var drop, affected = [];
    
    for(var d =0 ; d < this.drops.length; d++ ){
        if(MVC.Droppables.isAffected(point, element, this.drops[d])) affected.push(this.drops[d]);
    }

    if(affected.length>0)
      drop = MVC.Droppables.findDeepestChild(affected);

    if(this.last_active && this.last_active != drop) this.deactivate(this.last_active, drag, event);
    if (drop) {
      MVC.Position.within(drop.element, point[0], point[1]);  
      if (drop != this.last_active) MVC.Droppables.activate(drop, drag, event);
    }
  },

  fire: function(event, element) {
    if(!this.last_active) return;
    MVC.Position.prepare();

    if (this.isAffected(MVC.Event.pointer(event), element, this.last_active))
      
      if (this.last_active.dropped) {
        this.last_active.dropped({drag_element: element, event: event, element: this.last_active.element}); 
        return true; 
      }
  },

  reset: function() {
    if(this.last_active)
      this.deactivate(this.last_active);
  },
  compile : function(){
      var elements = [];
      for(var selector in MVC.Droppables.selectors){
          var sels = elements.concat( MVC.Query(selector) )
          for(var e= 0; e < sels.length; e++){
              MVC.Droppables.add(sels[e], MVC.Droppables.selectors[selector])
          }
      }
   
  }
};
