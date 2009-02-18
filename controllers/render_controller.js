RenderController = MVC.Controller.extend('render',{
	"render_to subscribe" : function(params){
		this.data = 'HelloWorld'
		this.render({to: 'testarea'});
	},
	to_element : function(params){
		this.data = 'HelloWorld'
		this.render({to: document.getElementById('testarea')});
	},
	after : function(params){
		this.data = 'HelloWorld'
		this.render({after: 'testarea'});
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
    },
    render_partial : function(){
        this.render({to: 'testarea', action: "outer"});
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