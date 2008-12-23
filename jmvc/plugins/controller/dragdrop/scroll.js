MVC.Scrollable = MVC.Class.extend({
	init : function(element){
		this.element = element;
	},
	dropover: function(params){
		
	},
	dropped: function(params){
		if(this.interval){
            //MVC.$E('part').innerHTML = "d "+MVC.$E('part').innerHTML
			clearTimeout(this.interval)
			this.interval = null;
		}
	}, 
	dropout : function(params){
        //console.log("out!!!!!")
		if(this.interval){
            //MVC.$E('part').innerHTML = "o "+MVC.$E('part').innerHTML
			clearTimeout(this.interval)
			this.interval = null;
		}
	},
	dropadd: function(params){
		
	},
	dropmove: function(params){
        //console.log("dropmove")
        if(this.interval){
            //MVC.$E('part').innerHTML = "c "+MVC.$E('part').innerHTML
			//console.log("moved")
            clearTimeout(this.interval)
			this.interval = null;
		}
		
		//see if drag position is over bottom of guy
		if( params.element  == document.documentElement){
			var mouse = MVC.Event.pointer(params.event)
			var window_dimensions = MVC.Element.window_dimensions();
			var diff = window_dimensions.window_bottom - mouse.y();
			this.check_dimension("y", params);

		}else{
			var drag_pos = params.drag.current_position.y();
			var height = params.element.clientHeight;
			//console.log(height - drag_pos);
		}
		
		
	},
    check_dimension : function(dimension, params){
        
        var mouse = MVC.Event.pointer(params.event)
        
		var window_dimensions = MVC.Element.window_dimensions();

        var diff =20 - (window_dimensions.window_bottom - mouse.y());
        //console.log("difference = "+ (mouse.minus( params.drag.drag_element.offset() )) )
        //console.log("checking mouse="+ mouse+", offset="+params.drag.drag_element.offset()+", scrollTop="+document.documentElement.scrollTop+", distance ="+(window_dimensions.window_bottom - mouse.y()) )
        
        if(diff > 0 ){
            var scrollset =  mouse.y()+diff - window_dimensions.window_height;
			//console.log("calling with",params.event.clientX, params.event.clientY)
			this.interval =  setTimeout( MVC.Function.bind(this.check, this, diff, params.drag.drag_element,params.event.clientX, params.event.clientY),20);
		}else if(mouse.y() - window_dimensions.scroll_top < 10){
			//diff = 10 - (window_dimensions.scroll_top - mouse.y());
            //document.documentElement.scrollTop = mouse.y() - diff;
            //this.interval =  setTimeout( MVC.Function.bind(this.check, this, dimension, diff, params.drag.drag_element, "minus"), 1000);
            //this.event = MVC.Object.extend({}, event);
		}
        
    },
	check : function(diff,el, x,y){
        var ds = MVC.Element.window_dimensions();
		//var top = parseInt( params.drag.drag_element.get_style("top"))
        if(ds.window_bottom +diff <= ds.document_height ){
            //params.drag.drag_element.style.top = (top+diff)+"px"
            document.documentElement.scrollTop = document.documentElement.scrollTop + 2;
            //console.log("Synthetic Event before "+diff,x,y );
            new MVC.Synthetic("mousemove",{clientX: x, clientY: y} ).send(el); //don't need to change position as it is screen
            //console.log("Synthetic Event after" )
        }
        else{
            //how far to remainder
            /*var remaining = ds.document_height - ds.window_height - document.documentElement.scrollTop;
            params.drag.drag_element.style.top = (top+remaining)+"px";
            document.documentElement.scrollTop = ds.document_height + ds.window_height;*/
            //new Synthetic("mousemove",loc).send(params.drag.drag_element);
            clearTimeout(this.interval)
			this.interval = null;
        }
            
        //MVC.$E('part').innerHTML = "c<br/>"+MVC.$E('part').innerHTML
        //MVC.Draggable.current.draw( MVC.Event.pointer(this.event) , this.event)
        //MVC.Controller.Action.Drag.mousemove(this.event);
        
	}
})
