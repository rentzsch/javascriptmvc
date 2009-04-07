JMVCTest = {
	APPLICATION_NAME : 'simple',
	TEST_DESCRIPTION : 'This tests including other files.',
	perform_test : function() {
	  new Test.Unit.Runner({
	  	
		setup: function() {
		},
		teardown: function() {
		},
	    test_startup: function() { with(this) {
			assert(JjQuery.Test.environment_run, 'The environment file was not loaded')
			assert(JjQuery.Test.initializer_run, 'The initializer function was not called') 
			assert(JjQuery.Test.action_run, 'The first action wasnt run')
			assertEqual("Hello World", JjQuery.Test.rendered   )
			
	    }}
		/*,
		test_include_plugins: function() { with(this) {
			// the simple app loads Jester and LocalStorage
			assert(Jester)
			assert(LocalStorage)
	    }}*/
	    
	  }, "testlog");
	}
}