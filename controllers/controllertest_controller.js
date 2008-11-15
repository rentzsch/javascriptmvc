MainController = MVC.Controller.extend('main',{
	load : function(){
		MainController.loaded = true;
        success('load')
	},
	resize : function(){
		success('resize')
	},
	scroll : function(){
		success('scroll')
	},
	unload : function(){
		success('unload')
	},
	click: function(){
		success('mainclick')
	}
});

TestsController = MVC.Controller.extend('tests',{
	change: function(){
		success('change')
	},
	click : function(params){
		success('click')
	},
	focus : function(params){
		success('focus')
	},
	blur : function(){
		success('blur')
	},
	'# submit' :function(params){
		success('submit')
        
		params.event.kill();
	},
	mousedown : function(params){
		success('mousedown')
	},
	mousemove : function(params){
		success('mousemove')
	},
	mouseup : function(params){
		success('mouseup')
	},
	mouseover : function(params){
		success('mouseover')
	},
	mouseout : function(params){
		success('mouseout')
	},
	contextmenu : function(params){
		success('contextmenu')
	}
});


