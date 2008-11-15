new MVC.Test.Unit('controller_view',{
	setup: function(){
          MVC.$E('testarea').innerHTML = "<div id='render_here' style='width: 100px; height:100px;background-color: Green'></div>"
    },
    teardown : function(){
          MVC.$E('testarea').innerHTML = "";
    },
    test_render_to : function(){
		MVC.Controller.publish('render_to', {});
		var el = document.getElementById('render_here');
		this.assert_equal("H1", el.firstChild.nodeName);
		this.assert_equal("HelloWorld", el.firstChild.innerHTML);
	},
	test_render_to_with_element : function(){
		RenderController.dispatch('to_element',{} );
		var el = document.getElementById('render_here');
		this.assert_equal("H1", el.firstChild.nodeName);
		this.assert_equal("HelloWorld", el.firstChild.innerHTML);
	},
	// fails with no_element
	test_render_after: function(){
		RenderController.dispatch( 'after', {});
		this.assert_equal("HelloWorld", document.getElementById('after').innerHTML );
		var part = document.getElementById('render_here');
		this.assert_equal("after",  part.nextSibling.id);
	}
});

