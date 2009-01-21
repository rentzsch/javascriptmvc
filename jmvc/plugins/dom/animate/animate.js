/**
 * @constructor
 * Provides simple animation functionality for JavaScriptMVC.
 * @init
 * Starts a new animation.
 * @param {HTMLElement|String} element the element to animation
 * @param {Object} params css properties to change and their value
 * @param {Nuber} duration how long the animation should take place in milliseconds
 * @param {optional:Object} easing function for the object's motion.
 * @param {optional:Function} callback calls when animation has completed
 */
MVC.Animate = function(element, params, duration, easing, callback){
    element = MVC.$E(element);
    callback = callback || function(){}
    //get starting values.
    var starting_values = {};
    var val;
    for(var param in params){
        val = params[param];
        starting_values[param] = new MVC.Animate.Value(element,param, val);
        //this.get_starting_value( MVC.Element.get_style( element, param ) );
    }
    
    this.timer = new MVC.Timer({from: 0, to: 1, time: duration,
        onUpdate : function(percentage){
            for(var param in starting_values){
                element.style[param] = starting_values[param].get(percentage);
            }
        },
        onComplete : function(){
            for(var param in starting_values){
                element.style[param] = starting_values[param].last();
            }
            callback(element);
        }
    });
    this.timer.start();
    
}
MVC.Animate.exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i
MVC.Animate.Value = function(element, style, end){
    this.style = style;
    this.start = parseFloat( MVC.Element.get_style( element, style )) || 0;
    var parts = end.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/);
    
    if ( parts ) {
        this.end = parseFloat(parts[2]);
        this.unit = parts[3] || (MVC.Animate.exclude.test(style) ? "" : "px");
        if ( this.unit != "px" ) {
				element.style[ style ] = (end || 1) + this.unit;
				this.start = ((end || 1) / MVC.Element.get_style( element, style )) * start;
				element.style[ style ] = start + this.unit;
		}
        if ( parts[1] )
			this.end = ((parts[1] == "-=" ? -1 : 1) * this.end) + this.start;
        
    }else{
        this.end = end;
        this.unit =  MVC.Animate.exclude.test(style) ? "" : "px";
    }
    this.distance = this.end - this.start;
}

MVC.Animate.Value.prototype = {
    get: function(percent){
        return (this.start+percent*this.distance)+this.unit;
    },
    last: function(){
        return (this.end)+this.unit;
    }
}