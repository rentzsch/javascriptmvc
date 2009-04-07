new jQuery.Test.Unit('file',{
   setup: function(){
       this.local_absolute = new MVC.File('/this/was/great');
	   this.relative_1 = new MVC.File('so/was/this');
	   this.empty = new MVC.File('');
	   this.relative_2 = new MVC.File('../something/else')
   },
   test_file_domain: function() { 
      this.assert_equal(null,new MVC.File("file://C:/Development").domain() )
   },
   test_http_domain: function() {
	   this.assert_equal('something.com',new MVC.File('http://something.com/asfdkl;a').domain() )
   },
   test_https_domain: function() { 
	   this.assert_equal('127.0.0.1:3006',new MVC.File('https://127.0.0.1:3006/asdf').domain() )
   }
});