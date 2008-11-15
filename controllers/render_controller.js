RenderController = MVC.Controller.extend('render',{
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
	}
});