MVC.Timer = function(options){
    options = options || {};
    this.time = options.time || 500;
    this.from = options.from || 0;
    this.to = options.to || 1;
    this.interval = options.interval||1;
    this.update_callback = options.onUpdate || function(){};
    this.complete_callback = options.onComplete || function(){};
    this.distance = this.to - this.from;
    if(options.easing){
        this.easing = typeof options.easing == 'string' ? MVC.Timer.easings[options.easing] : options.easing;
    }else{
        this.easing = MVC.Timer.easings.swing
    }
}

MVC.Timer.prototype = {
    start: function(){
        this.start_time = new Date();

        this.timer = setInterval(  MVC.Function.bind(this.next_step, this)  ,this.interval);
    },
    kill: function(){
        clearInterval(this.timer);
    },
    next_step : function(){
        var now = new Date();
        var time_passed = now - this.start_time ;
        var current;
        if(time_passed >= this.time){
            current = this.to;
            this.update_callback(current);
            this.kill();
            this.complete_callback(current);
        }else{
            var percentage = time_passed / this.time;
            current = this.easing(percentage, time_passed, this.from, this.distance  );
            //current = this.from + (how_far * this.distance);
            this.update_callback(current);
        }
        
    }
}

MVC.Timer.easings = {
	linear: function( p, n, firstNum, diff ) {
		return firstNum + diff * p;
	},
	swing: function( p, n, firstNum, diff ) {
		return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
	}
}