/**
 * The Test class is the super class of other test classes including: 
 * Test.Unit, Test.Functional, and Test.Controller. 
 * Typically Test is not used directly but its functions are available in inheriting classes.
 */
jQuery.Class.extend("jQuery.Test",
{
    init : function(){
        
        this.clear();
        if(jQuery.String.include(this.fullName,"jQuery.Test"  )) return;
        this.testNames = []
        
		for(var test_name in this.prototype) {
			if(! this.prototype.hasOwnProperty(test_name) ) continue;
			if(test_name.indexOf('test') == 0) {
                this.testNames.push(test_name)
            }
		}
        OpenAjax.hub.publish("jmvc.test.created", this)
    },
    run : function(callback){
        this.clear();
        this.working_test = 0;
        this.callback = callback;
        OpenAjax.hub.publish("jmvc.test.test.start", this);
        //get list of tests
        
        this.run_next();
    },
    run_all : function(number, completedTest){
        number = number || 0;
        if(number < this.tests.length)
            this.tests[number].run( jQuery.Function.bind(this.run_all, this, number+1)  )
        else
            OpenAjax.hub.publish(this.fullName.toLowerCase()+".complete", this)
    },
    clear : function(){
        this.working_test = null;
		this.passes = 0;
		this.failures = 0;
    },
    run_next: function(){
		if(this.working_test != null && this.working_test < this.testNames.length){
			this.working_test++;
			this.run_test(this.testNames[this.working_test-1]);
		}else if(this.working_test != null){
			OpenAjax.hub.publish("jmvc.test.test.complete", this);

			this.working_test = null;
			if(this.callback){
				this.callback(this);
				this.callback = null;
			}
		}
	},
	run_test: function(test_name){
        var test = this;
        setTimeout( function(){
            
            var inst = new test();
            inst._delays = 0;
            inst.assertions = 0;
    		inst.failures = 0;
    		inst.errors= 0;
    		inst.messages = [];
            inst._testName = test_name;
            inst._last_called = test_name;
            try{
                inst[test_name]();
            }catch(e){ inst.error(e); inst._delays = 0;}
            inst._update();
            
            
        },0  );
        
	},
    /**
     * Adds to the test's failure count.
     */
	fail : function(){
		this.failures++;
	},
    /**
     * Adds to the test's pass count.
     */
	pass : function(){
		this.passes++;
	},
    type: "unit"
},
/* @Prototype*/
{
    /**
     * Creates a new test case. A test case is a collection of test functions and helpers.
     * 
     * @code_start new jQuery.Test('TestCaseName',{
  test_some_asserts : function(){
    var value = this.my_helper('hello world')
    this.assert(value)      //passes
  },
  my_helper : function(value){
    return value == 'hello world'
  }
}, 'unit')
@code_end
     * @param {Object} name the unique name of the test. Make sure no two tests have the same name.
     * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. Functions that don't begin with test are converted to helper functions. Do not name helper functions the same name as the test provided helpers and assertions such as assert or assertEqual as your functions will override these functions.
     * @param {Object} type The type of test ('unit', 'functional').
     */
	init: function(){

	},

    /**
     * Returns an object of helper functions that will be used to generate a 
     * new Assertion class for the TestCase. The base implementation returns all functions provided to tests in the constructor that do not start with test. 
     * Functional and Controller tests overwrite this function.
     */
	helpers : function(){
		var helpers = {}; 
		for(var t in this.tests) if(this.tests.hasOwnProperty(t) && t.indexOf('test') != 0) helpers[t] = this.tests[t];
		return helpers;
	},

	/**
     * Asserts the expression exists in the same way that if(expression) does. If the expression doesn't exist reports the error.
@code_start
new jQuery.Test.Unit('TestCase Name',{
  test_some_asserts : function(){
    this.assert(true)      //passes
    this.assert({})        //passes
    this.assert([])        //passes
    this.assert(7)         //passes
    this.assert(0)         //fails
    this.assert(false)     //fails
    this.assert('')        //fails
    this.assert(null)      //fails
    this.assert(undefined, 
         "Something was expected.") //fails
  }
)
@code_end
     * @param {Object} expression expression to be evaluated
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert: function(expression, message) {
		var message = message || 'assert: got "' + jQuery.Test.inspect(expression) + '"';
		try { expression ? this.pass() : 
			this.fail(message); }
		catch(e) { this.error(e); }
	},
    /**
     * Uses the double equals (==) to determine if two values are equal. This means that type coercion may occur. For example 5 == '5'.
@code_start
new jQuery.Test.Unit('TestCase Name',{
  test_some_asserts : function(){
    this.assert_equal(7,7)      //passes
	this.assert_equal(7,'7')    //passes
    this.assert_equal('s','s')  //passes
    this.assert_equal(0,false)  //passes
    this.assert_equal("Tiger", this.name, "Tiger was expected");
    this.assert_equal(6,7)      //fails
  }
)
@code_end
     * @param {Object} expected the expected value
     * @param {Object} actual The variable to check for or the value being checked
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
  	assertEqual: function(expected, actual, message) {
		var message = message || "assertEqual";
		try { (expected == actual) ? this.pass() :
			this.fail(message + ': expected "' + jQuery.Test.inspect(expected) + 
			'", actual "' + jQuery.Test.inspect(actual) + '"'); }
		catch(e) { this.error(e); }
  	},
    /**
     * Passes if the given object == null. Fails otherwise.
     * @code_start
     * this.assert_null(this.obj, "Expected to be null");
     * @code_end
     * @param {Object} obj The object to check for null
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assertNull: function(obj, message) {
	    var message = message || 'assertNull'
	    try { (obj==null) ? this.pass() : 
	      this.fail(message + ': got "' + jQuery.Test.inspect(obj) + '"'); }
	    catch(e) { this.error(e); }
	},
    /**
     * Passes if the expression is false, fails if it is true
     * @code_start
     * this.assert_not(x_value == 200);
     * @code_end
     * @param {Object} expression An expression
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assertNot: function(expression,message) {
	   var message = arguments[1] || 'assert: got "' + jQuery.Test.inspect(expression) + '"';
		try {! expression ? this.pass() : 
			this.fail(message); }
		catch(e) { this.error(e); }
	},
    /**
     * Passes if object is != null, fails otherwise
     * @code_start
     * this.assert_not_null(obj);
     * @code_end
     * @param {Object} object The object to check for null
     * param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assertNotNull: function(object,message) {
	    var message = message || 'assertNotNull';
	    this.assert(object != null, message);
	},
    /**
     * Asserts each value in the actual array equals the same value in the expected array
     * @param {Object} expected
     * @param {Object} actual
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assertEach: function(expected, actual, message) {
	    var message = message || "assert_each";
	    try { 
			var e = jQuery.Array.from(expected);
			var a = jQuery.Array.from(actual);
			if(e.length != a.length){
				return this.fail(message + ': expected ' + jQuery.Test.inspect(expected)+', actual ' + jQuery.Test.inspect(actual));
				
			}else{
				for(var i =0; i< e.length; i++){
					if(e[i] != a[i]){
						return this.fail(message + ': expected '+jQuery.Test.inspect(expected)+', actual ' + jQuery.Test.inspect(actual));
					}
				}
			}
			this.pass();
	    }catch(e) { this.error(e); }
  	},
    assertError : function(fn, message){
        var message = message || "assertError";
        try {
            fn.call(this);
            this.fail( message + ': no error!');
        }catch(e){
            this.pass()
        }
    },
    /**
     * Adds to the assertions pass count.
     */
	pass: function() {
    	this.assertions++;
	},
    /**
     * Adds to the assertions failure count with a message.
     * @param {String} message error message
     */
	fail: function(message) {
		this.failures++;
		this.messages.push("Failure: " + message);
	},
    /**
     * Adds to the error count and adds the message to the assertions messages array.
     * @param {Object} error Error message object that includes a name and message.
     */
	error: function(error) {
	    this.errors++;
	    this.messages.push(error.name + ": "+ error.message + "(" + jQuery.Test.inspect(error) +")");
	},
    destroy : function(){
        
    },
    callback: function(){
        var args = jQuery.Array.from(arguments);
        var fname = args.shift();
		this._delays++;
		return this._call_next_callback(fname, args);
	},
    timeout : function(fname, delay){
          var args = jQuery.Array.from(arguments);
          var fname = args.shift();
          var delay = args.shift();
          this._delays++;
          setTimeout(this._call_next_callback(fname, args), delay*1000)
    },
    _call_next_callback : function(fname, curried){
		var inst = this;
		var  func = this[fname];
		return function(){
			curried = curried || []
            inst._last_called = fname;
			var args = curried.concat( jQuery.Array.from(arguments) );
			try{
				func.apply(inst, args);
			}catch(e){ inst.error(e); }
			inst._delays--;
			inst._update();
		};
	},
    _update : function(){
        if(this._delays == 0){
			this.destroy()
			if(this._do_blur_back) this._blur_back();
			
            OpenAjax.hub.publish("jmvc.test.case.complete", this);
            
			this.failures == 0 && this.errors == 0?  this.Class.pass(): this.Class.fail();
			this.Class.run_next();
		}
	}
});












if(jQuery.Console && jQuery.Console.window) jQuery.Console.window.get_tests = function(){return jQuery.Tests; } 

//This function returns what something looks like
jQuery.Test.inspect =  function(object) {
	try {
		if (object === undefined) return 'undefined';
		if (object === null) return 'null';
		if(object.length !=  null && typeof object != 'string'){
			return "[ ... ]";
		}
		return object.inspect ? object.inspect() : object.toString();
	} catch (e) {
		if (e instanceof RangeError) return '...';
		throw e;
	}
};
jQuery.Test.loaded_files = {};

jQuery.include.unit_tests = function(){
	for(var i=0; i< arguments.length; i++){
        $.Console.log('Trying to load: test/unit/'+arguments[i]+'_test.js');
    }
		
	jQuery.include.app(function(i){ return '../../test/unit/'+i+'_test'}).apply(null, arguments);
}
jQuery.include.functional_tests = function(){
	for(var i=0; i< arguments.length; i++){
        $.Console.log('Trying to load: test/functional/'+arguments[i]+'_test.js');
    }
	jQuery.include.app(function(i){ return '../../test/functional/'+i+'_test'}).apply(null, arguments);
}







