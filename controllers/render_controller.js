RenderController = $.Controller.extend('render',{
	"render_to subscribe" : function(params){
		this.data = 'HelloWorld'
		this.render({to: 'render_here'});
	},
	to_element : function(params){
		this.data = 'HelloWorld'
		this.render({to: document.getElementById('render_here')});
	},
	after : function(params){
		this.data = 'HelloWorld'
		this.render({after: 'render_here'});
	},
    click : function(){
        RENDER_CONTROLLER_CLICKED = true
    },
    "a click" : function(){
        RENDER_TAG_CLICKED = true
    },
    ".render click" : function(){
        RENDER_CLASS_CLICKED = true
    },
    "#id click" : function(){
        RENDER_ID_CLICKED = true
    }
});
ThingsController = MVC.Controller.extend('things',{
    click : function(){
        THING_CLICKED= true;
    },
    "# click" : function(){
        THINGS_CLICKED= true;
    }
})