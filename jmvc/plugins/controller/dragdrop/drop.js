jQuery.Controller.Action.Respond.extend("jQuery.Controller.Action.Drop",
/* @static */
{
    /**
     * Matches "(.*?)\\s?(dragstart|dragend|dragmove)$"
     */
    match: new RegExp("(.*?)\\s?(dropover|dropped|dropout|dropadd|dropmove)$")
},
/* @prototype */
{});

jQuery.Respond.extend("jQuery.Drop",{
	init : function(){
		this._super();
		jQuery.Drag.responder = this;  
		this.endName = 'dropped';
	}
},{})
