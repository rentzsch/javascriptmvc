jQuery.Controller.extend("ParentFillController",{
},{
	init : function(element, parent){
		this._super(element)
		this.parent = parent ? jQuery(parent) : null;
		//this.resize();
	},
	/**
	 * on window resize, calculates hieght ... this should take into account having
	 * more than one parent fill controller
	 */
	resize : function(){
		
		var ph = this.parent ? this.parent.height() : this.element.parent().innerHeight();
		if(!ph) return;
		var others = 0;
		var el = this[0];
		//console.log(this.Class.underscoreName)
		this.element.siblings(":not(."+this.Class.underscoreControllerName+")").each(function(){
			//console.log(ph, this)
			//if(this != el)
				others = others + jQuery.fn.outerHeight.apply([this])
		})
		var margin = this.element.outerHeight(true) - this.element.innerHeight();
		//this.element.
		//console.log(this.parent,"hieght", ph,"margin",margin, "others", others)
		this.element.height(ph- margin- others);
	}
})