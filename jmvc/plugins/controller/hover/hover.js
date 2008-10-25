MVC.Controller.CompoundAction = MVC.Controller.DelegateAction.extend({
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


// Idea, and very small amonts of code taken from 
// http://cherne.net/brian/resources/jquery.hoverIntent.js
// @author    Brian Cherne <brian@cherne.net>

MVC.Controller.HoverAction = MVC.Controller.DelegateAction.extend({
    match: new RegExp("(.*?)\\s?(hoverover|hoverout|hoverenter|hoverleave)$"),
    sensitivity: 6,
    interval: 100,
    timeout: 0
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
	hoverenter : function(){
		this.hoverover()
	},
	hoverleave : function(){
		this.hoverout();
	},
    hoverover : function(){
        new MVC.Delegator(this.selector(), 'mouseover', MVC.Function.bind( function(params){
            //set a timeout and compare position
            if(this.event_type == "hoverenter"){
				var related_target = params.event.relatedTarget;
				if(params.element == related_target || MVC.$E(params.element).has(related_target))
					return true;
			}
			
			
			this.called = false;
            this.starting_position = MVC.Event.pointer(params.event);
            this.element = params.element;
            this.mouseover_event = params.event;
            this.mousemove = MVC.Function.bind( function(event){
                this.mousemove_event = event;
                this.current_position = MVC.Event.pointer(event);
            }, this);
            MVC.Event.observe(params.element, "mousemove", this.mousemove);

            this.timer = setTimeout(MVC.Function.bind(this.check, this), MVC.Controller.HoverAction.interval);
            
        }, this));
        
        new MVC.Delegator(this.selector(), 'mouseout', MVC.Function.bind( function(params){
            //the other mouse out, if there is one, will be handled
            //check if hoverover has been called, if it has fire hoverout, otherwise, do nothing
            //cancel timeout
            //unbind mousemove
            //run if only where you are going is right
			if(this.event_type == "hoverenter"){
				var related_target = params.event.relatedTarget;
				if(params.element == related_target || MVC.$E(params.element).has(related_target))
					return true;
			}
            clearTimeout(this.timer);
            MVC.Event.stop_observing(params.element, "mousemove", this.mousemove);
            if(this.called){ //call hoverout
                var hoverout = MVC.Controller.HoverAction.hoverouts[this.selector()];
                if(hoverout)
                    hoverout.func({element: this.element, event: params.event});
            }
        }, this));
        
    },
    check :function(){
        var diff = this.starting_position.minus(this.current_position);
        var size = Math.abs( diff.x() ) + Math.abs( diff.y() );
        if(size < MVC.Controller.HoverAction.sensitivity){
            //fire hover and set as called
            this.called = true;
            this.func({element: this.element, mousemove_event: this.mousemove_event, mouseover_event: this.mouseover_event});
            MVC.Event.stop_observing(this.element, "mousemove", this.mousemove);
        }else{
            this.current_position = this.starting_position;
            this.timer = setTimeout(MVC.Function.bind(this.check, this), MVC.Controller.HoverAction.interval);
        }
    },
    hoverout : function(){
        //add myself to hover outs to be called on the mouseout
        MVC.Controller.HoverAction.hoverouts[this.selector()] = this;
    }
});

MVC.Controller.HoverAction.hoverouts = {};



