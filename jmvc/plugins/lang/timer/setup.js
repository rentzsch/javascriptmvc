MVC.Timer = function(options){
    options = options || {};
    this.time = options.time || 1000;
    this.from = options.from || 0;
    this.to = options.to || 1;
    this.interval = options.interval||1;
    this.update_callback = options.onUpdate || function(){};
    this.complete_callback = options.onCompete || function(){};
    this.distance = this.to - this.from;
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
            var how_far = time_passed / this.time;
            current = this.from + (how_far * this.distance);
            this.update_callback(current);
        }
        
    }
}