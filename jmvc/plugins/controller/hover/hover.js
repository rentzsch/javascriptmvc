MVC.Controller.CompoundAction = MVC.Controller.EventAction.extend({
    match: new RegExp("(.*?)\\s?(mouseenter|mouseleave)$")
},
//Prototype functions
{    
    init: function(action, f, controller){
        this.action = action;
        this.func = f;
        this.controller = controller;
        this.css_and_event();
        var selector = this.selector();
        this[this.event_type]()
    },
    mouseenter : function(){
        new MVC.Delegator(this.selector(), 'mouseover', MVC.Function.bind( function(params){
            //set a timeout and compare position
			var related_target = params.event.relatedTarget;
			if(params.element == related_target || MVC.$E(params.element).has(related_target)) return true;
			this.func(params);
            
        }, this));
    },
    mouseleave : function(){
        //add myself to hover outs to be called on the mouseout
        new MVC.Delegator(this.selector(), 'mouseout', MVC.Function.bind( function(params){
            //set a timeout and compare position
			var related_target = params.event.relatedTarget;
			if(params.element == related_target || MVC.$E(params.element).has(related_target)) return true;
			this.func(params);
        }, this));
    }
});


// Idea, and very small amonts of code taken from Brian Cherne <brian@cherne.net>
// http://cherne.net/brian/resources/jquery.hoverIntent.js  
/**
 * provides hoverover,hoverout,hoverenter,hoverleave
 */
MVC.Controller.Hover = MVC.Controller.EventAction.extend({
    match: new RegExp("(.*?)\\s?(hoverenter|hoverleave)$"),
    /**
     * 
     */
    sensitivity: 6,
    /**
     * 
     */
    interval: 100,
    /**
     * Stores hover actions by CSS
     */
    hovers : {}
},
/* @prototype */
{    
    /**
     * If the first called, attaches mouseover, mouseout events
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action, f, controller){
        this.action = action;
        this.func = controller.dispatch_closure(action );
        this.controller = controller;
        this.css_and_event();
        var selector = this.selector();
        if(! this.Class.hovers[this.selector()]){
            this.Class.hovers[this.selector()] = {};
            new MVC.Delegator(this.selector(), 'mouseover', MVC.Function.bind(this.mouseover , this));
            new MVC.Delegator(this.selector(), 'mouseout', MVC.Function.bind( this.mouseout, this));
        }
        this.Class.hovers[this.selector()][this.event_type] = this;
    },
	hoverenter : function(params){
		 var hoverenter = this.Class.hovers[this.selector()]["hoverenter"];
         if(hoverenter)
            hoverenter.func(params);
	},
	hoverleave : function(params){
		var hoverleave = this.Class.hovers[this.selector()]["hoverleave"];
        if(hoverleave)
            hoverleave.func(params);
	},
    check :function(){
        var diff = this.starting_position.minus(this.current_position);
        var size = Math.abs( diff.x() ) + Math.abs( diff.y() );
        if(size < this.Class.sensitivity){
            //fire hover and set as called
            this.called = true;
            this.hoverenter({element: this.element, mouseover_event: this.mouseover_event}) 
            MVC.Event.stop_observing(this.element, "mousemove", this.mousemove);
        }else{
            this.current_position = this.starting_position;
            this.timer = setTimeout(MVC.Function.bind(this.check, this), this.Class.interval);
        }
    },
    mouseover : function(params){
        //set a timeout and compare position
        //if(this.event_type == "hoverenter"){
		var related_target = params.event.relatedTarget;
		if(params.element == related_target || MVC.$E(params.element).has(related_target))
			return true;
		//}
		
		
		this.called = false;
        this.starting_position = MVC.Event.pointer(params.event);
        this.element = params.element;
        this.mouseover_event = params.event;
        this.mousemove = MVC.Function.bind( function(event){
            this.mousemove_event = event;
            this.current_position = MVC.Event.pointer(event);
        }, this);
        MVC.Event.observe(params.element, "mousemove", this.mousemove);

        this.timer = setTimeout(MVC.Function.bind(this.check, this), this.Class.interval);
        
    },
    mouseout : function(params){
        //the other mouse out, if there is one, will be handled
        //check if hoverover has been called, if it has fire hoverout, otherwise, do nothing
        //cancel timeout
        //unbind mousemove
        //run if only where you are going is right
		//if(this.event_type == "hoverenter"){
		var related_target = params.event.relatedTarget;
        if(params.element == related_target || MVC.$E(params.element).has(related_target))
			return true;
		//}
        clearTimeout(this.timer);
        MVC.Event.stop_observing(params.element, "mousemove", this.mousemove);
        if(this.called){ //call hoverleave
            this.hoverleave({element: this.element, event: params.event})
        }
    }
});



