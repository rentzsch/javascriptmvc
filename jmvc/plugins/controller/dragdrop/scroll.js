MVC.Scrollable = MVC.Class.extend({
	init : function(element){
		this.element = element;
	},
	dropover: function(params){
		
	},
	dropped: function(params){
		if(this.interval){
			clearInterval(this.interval)
			this.interval = null;
		}
	}, 
	dropout : function(params){
		
	},
	dropadd: function(params){
		
	},
	dropmove: function(params){
		if(this.interval){
			clearInterval(this.interval)
			this.interval = null;
		}
			
		//see if drag position is over bottom of guy
		if(params.element  = document.documentElement){
			var mouse = MVC.Event.pointer(params.event)
			var window_dimensions = MVC.Position.window_dimensions();
			var diff = window_dimensions.window_bottom - mouse.y()
			if(diff < 10){
				document.documentElement.scrollTop = mouse.y()+10- window_dimensions.window_height;
				this.interval =  setInterval( MVC.Function.bind(this.check, this), 100);
			}else if(mouse.y() - window_dimensions.scroll_top < 10){
				document.documentElement.scrollTop = mouse.y() - 10;
				//setInterval( MVC.Function.bind(MVC.Scrollables.check, params), 100);
			}

		}else{
			var drag_pos = params.drag.current_position.y();
			var height = params.element.clientHeight;
			console.log(height - drag_pos);
		}
		
		
	},
	check : function(){
		//document.documentElement.scrollTop = document.documentElement.scrollTop + 10;
		//need to re-adjust position
		//send a mouse move?
		
	}
})
