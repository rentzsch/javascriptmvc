jQuery.Test.Unit.extend("Tests.View",{
	test_simple : function(){
		$('#testarea').html({view: 'views/simple'})
        this.assertEqual('<h1>HelloWorld</h1>', $('#testarea').html()
         /*new MVC.View({url: 'views/simple'}).render( )*/  
         );
	}/*,
	test_render : function(){
		this.assert_equal("<h1>yes</h1>\n\n<p>1</p>\n\n<p>2</p>\n\n<p>3</p>\n", new MVC.View({url: 'views/no_helpers'}).render( {data: {title: 'yes', info: [1,2,3]}}) );
	},
    test_nested : function(){
        secondTemplate = new MVC.View({url: 'views/second'});
        this.assert_equal('<div><p>1</p>2</div>', new MVC.View({url: 'views/first'}).render({x: 1, y: 2})  )
    }*/
})