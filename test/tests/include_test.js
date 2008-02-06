JMVCTest = {
	TEST_DESCRIPTION : 'This tests include by itself.',
	TEST_MODE : 'development',
	perform_test : function() {
	  new Test.Unit.Runner({
	  	
		setup: function() {
		},
		teardown: function() {
		},
	    test_start_path: function() { with(this) {
			include.opera()
			assertEqual("test_apps/include/",include.get_path())

	    }},
	    test_include_relative: function() { with(this) {
			include.opera()
			assert(TEST.Local)
			assert(TEST.Local2)
	    }},
		test_include_remote: function() { with(this) {
			include.opera()
			assert(TEST.Remote1)
			assert(TEST.Remote2)
	    }},
		test_absolute_cwd : function(){with(this) {
			include.opera()
			include.set_path('folder/another')
			assertEqual( "file:///C:/Development/jmvc/test/folder/another", include.get_absolute_path() )
			include.set_path('../another')
			assertEqual( "file:///C:/Development/jmvc/another", include.get_absolute_path() )
			
		}},
		test_get_path : function(){with(this) {
			include.opera()
			assertEqual( "http://javascriptmvc.com/test/", TEST.Remote2cwd )
			assertEqual( "http://javascriptmvc.com/test/", TEST.Remote2abs )
			assertEqual( "file:///C:/Development/jmvc/test/test_apps/include/", TEST.Local2abs )
		}}
	    
	  }, "testlog");
	}
}