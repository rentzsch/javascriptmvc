// Idea, and very small amonts of code taken from 
// http://cherne.net/brian/resources/jquery.hoverIntent.js
// @author    Brian Cherne <brian@cherne.net>

MVC.Controller.HoverAction = MVC.Controller.DelegateAction.extend({
    match: new RegExp("(.*?)\\s?(hoverover|hoverout)$"),
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
    hoverover : function(){
        new MVC.Delegator(this.selector(), 'mouseover', MVC.Function.bind( function(params){
            //set a timeout and compare position
            this.called = false;
            this.starting_position = MVC.Event.pointer(params.event);
            this.element = params.element;
            this.mousemove = MVC.Function.bind( function(event){
                this.current_position = MVC.Event.pointer(event);
            }, this);
            MVC.Event.observe(params.element, "mousemove", this.mousemove);
            
            //MVC.Controller.HoverAction.running_actions[this.selector()] = this;
            
            this.timer = setTimeout(MVC.Function.bind(this.check, this), MVC.Controller.HoverAction.interval);
            
        }, this));
        
        new MVC.Delegator(this.selector(), 'mouseout', MVC.Function.bind( function(params){
            //the other mouse out, if there is one, will be handled
            //check if hoverover has been called, if it has fire hoverout, otherwise, do nothing
            //cancel timeout
            //unbind mousemove
            
            clearTimeout(this.timer);
            MVC.Event.stop_observing(params.element, "mousemove", this.mousemove);
            if(this.called){ //call hoverout
                var hoverout = MVC.Controller.HoverAction.hoverouts[this.selector()];
                if(hoverout)
                    hoverout.func({element: this.element});
            }
        }, this));
        
    },
    check :function(){
        var diff = this.starting_position.minus(this.current_position);
        var size = Math.abs( diff.x() ) + Math.abs( diff.y() );
        if(size < MVC.Controller.HoverAction.sensitivity){
            //fire hover and set as called
            this.called = true;
            this.func({element: this.element});
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