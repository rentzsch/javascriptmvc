MVC.Scrollable = MVC.Class.extend({
	init : function(element){
		this.element = element;
	},
	dropover: function(params){
		
	},
	dropped: function(params){
		this.clear_timeout();
	}, 
	dropout : function(params){
		console.log("out")
		this.clear_timeout();
	},
	dropadd: function(params){
		
	},
	clear_timeout : function(){
		if(this.interval){
            clearTimeout(this.interval)
			this.interval = null;
		}
	},
	distance : function(diff){
		return (30 - diff) / 2;
	},
	dropmove: function(params){
        this.clear_timeout();
		
		//see if drag position is over bottom of guy
		if( params.element  == document.documentElement){
			var mouse = MVC.Event.pointer(params.event)
			var window_dimensions = MVC.Element.window_dimensions();
			var diff = window_dimensions.window_bottom - mouse.y();
			var dx =0, dy =0;
			if(window_dimensions.window_bottom - mouse.y() < 30){
				dy = this.distance(window_dimensions.window_bottom - mouse.y()) 
			}else if(mouse.y() - window_dimensions.scroll_top < 30){
				dy = -this.distance(mouse.y() - window_dimensions.scroll_top)
			}
			if(window_dimensions.window_right - mouse.x() <30){
				dx = this.distance(window_dimensions.window_right - mouse.x());
			}else if(mouse.x() - window_dimensions.scroll_left < 30){
				dx = -this.distance(mouse.x() - window_dimensions.scroll_left);
			}
			if(dx || dy){
				
				this.interval =  setTimeout( 
					MVC.Function.bind(this.check, 
									  this,  
									  params.drag.drag_element, 
									  dx, dy, 
									  params.event.clientX, params.event.clientY),20);
			}

		}else{
			var drag_pos = params.drag.current_position.y();
			var height = params.element.clientHeight;
		}
		
		
	},
	check : function(el, dx, dy, x,y){
        var ds = MVC.Element.window_dimensions();
        document.documentElement.scrollTop  = document.documentElement.scrollTop + dy;
		document.documentElement.scrollLeft = document.documentElement.scrollLeft + dx;
        new MVC.Synthetic("mousemove",{clientX: x, clientY: y} ).send(el); //don't need to change position as it is screen
	}
})

show = function(){
	console.log(document.width, document.documentElement.clientWidth, document.documentElement.offsetWidth)
}
