

jQuery.Controller.Action.Move.extend("jQuery.Controller.Action.Drag",
/* @static */
{
    /**
     * Matches "(.*?)\\s?(dragstart|dragend|dragmove)$"
     */
    match: new RegExp("(.*?)\\s?(dragstart|dragend|dragmove)$")
},
/* @prototype */
{});


jQuery.Move.extend("jQuery.Drag",
{

},
{
    draw : function(pointer, event){
		if (!this.moved) this.start(event) 
		
		// only drag if we haven't been cancelled;
		if(this._cancelled) return;
		
		//Calculate where we should move the drag element to
        var vec = this.element.offsetv();

		var pos = 													//Drag element's starting coords on the page if it had top=0, left=0
				vec	//Drag element's actual coords on the page
				.minus(this.currentDelta());						//How far Drag has moved from its starting coords
        
        var p = 													//Drag element's Top/Left that will move the element to be under the mouse in the right spot
				pointer.											//Where the mouse is
				minus(pos)											//Drag element's starting coords.
				.minus( this.mouse_position_on_element ); 			//the position relative to the container

        this.move( event );
        	
        
		//Call back to dragmove
        if(!this._horizontal)    this.element.css( "top", p.top()+"px" );
        if(!this._vertical)      this.element.css("left", p.left()+ "px" );
		
		//Tell dropables where mouse is
		this.Class.responder.show(pointer, this, event);  
    }
}
);

