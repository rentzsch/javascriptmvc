jQuery.Test.Unit.extend("Tests.View",{
	test_html : function(){
		$('#testarea').html({view: 'views/simple'});
        this.assertEqual('<h1>helloworld</h1>', $('#testarea').html().toLowerCase() );
        $('#testarea').html("");

	},
    test_append : function(){
		$('#testarea').html("");
        $('#testarea').append({view: 'views/simple'});
        this.assertEqual('<h1>helloworld</h1>', $('#testarea').html().toLowerCase() );
        $('#testarea').html("");

	},
    test_appendTo_in_multiple_element_context : function(){
		$('#testarea').html("");
		
		var content = $('<h1>helloworld</h1>');
		var content2 = $('<h2>helloworld 2</h2>');
        $([content, content2]).appendTo('#testarea');
		
		this.assertEqual(1, $('#testarea h1').length, 'h1 not found');
		this.assertEqual(1, $('#testarea h2').length, 'h2 not found');
		
		//$('#testarea').html("");
	}
    /*,
	test_render : function(){
		this.assert_equal("<h1>yes</h1>\n\n<p>1</p>\n\n<p>2</p>\n\n<p>3</p>\n", new MVC.View({url: 'views/no_helpers'}).render( {data: {title: 'yes', info: [1,2,3]}}) );
	},
    test_nested : function(){
        secondTemplate = new MVC.View({url: 'views/second'});
        this.assert_equal('<div><p>1</p>2</div>', new MVC.View({url: 'views/first'}).render({x: 1, y: 2})  )
    }*/
})