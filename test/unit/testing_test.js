
jQuery.Test.Unit.extend("Tests.Testing",{
       test_asserts : function(){
           this.assert(true);
		   this.assert({});
		   this.assert([]);
		   this.assert(7);
		   this.assertNotNull('');
		   this.assertNotNull(false);
		   this.assertNotNull(0);
		   this.assertNull(null);
		   this.assertNull(undefined);
		   this.assertEqual(1,1);
		   this.assertEqual(5, '5');
		   this.assertEqual(0, false)
		   this.assertEqual(null, null);
		   this.assertEqual('s', 's');
		   this.assertEach([1,2,3],[1,2,3]  )
           this.assertEach([],[], "OK");
       },
	   // expected: 10 failures
	   test_assert_fails : function(){
	   		/*this.assert('', "OK");
			this.assert(false, "OK");
			this.assert(0, "OK");
			this.assertNotNull(null, "OK");
			this.assertNotNull(undefined, "OK");
			this.assertNull('', "OK");
			this.assertNull(false, "OK");
			
			this.assertEach([1,2,3],[1,2,3,4], "OK"  );
			this.assertEach([1,2,3],[1,2,4], "OK"  );*/
	   },
	   // expected: 3 assertions pass, 2 failures
	   test_callback : function(){
	   		this.assert(true);
			//this.next();
            this.callback('next_function')();
	   },
	   next_function : function(){
	   		this.assert(true)
			this.callback('again', 'hello')();
	   },
	   again : function(param){
	   		this.assertEqual('hello', param)
	   },
	   // expected: 1 error
	   test_error : function(){
           this.assertError( function(){
               x.y.z();
           } )
	   },
	   // expected: 1 assertion, 1 error
	   test_error_in_callback : function(){
	   		this.assert(true);
			this.callback("next_function_two")();
	   },
	   next_function_two: function(){
	   		this.assertError( function(){
               x.y.z();
           } )
	   },
	   test_console : function(){
	   		/*for(var i = 0; i < 50 ; i++){
				$.Console.log(i)
			}*/
			
	   }
});