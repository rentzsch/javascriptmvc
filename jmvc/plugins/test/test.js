
MVC.Tests = {};


/**
 * The Test class is the super class of other test classes including: 
 * Test.Unit, Test.Functional, and Test.Controller. 
 * Typically Test is not used directly but its functions are available in inheriting classes.
 */
MVC.Test = MVC.Class.extend(
/*@Prototype*/
{
    /**
     * Creates a new test case. A test case is a collection of test functions and helpers.
     * 
     * <pre><code>new MVC.Test('TestCaseName',{
  test_some_asserts : function(){
    var value = this.my_helper('hello world')
    this.assert(value)      //passes
  },
  my_helper : function(value){
    return value == 'hello world'
  }
}, 'unit')</code></pre>
     * @param {Object} name the unique name of the test. Make sure no two tests have the same name.
     * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. Functions that don't begin with test are converted to helper functions. Do not name helper functions the same name as the test provided helpers and assertions such as assert or assertEqual as your functions will override these functions.
     * @param {Object} type The type of test ('unit', 'functional').
     */
	init: function( name, tests, type  ){
		this.type = type || 'unit';
		this.tests = tests;
		this.test_names = [];
		this.test_array = [];
		for(var t in this.tests) {
			if(! this.tests.hasOwnProperty(t) ) continue;
			if(t.indexOf('test') == 0) this.test_names.push(t);
			this.test_array.push(t);
		}
		this.name = name;
		this.Assertions = MVC.Test.Assertions.extend(this.helpers()); //overwrite helpers
		this.passes = 0;
		this.failures = 0;
		
		MVC.Tests[this.name] = this;
		this.updateElements(this);
	},
    /**
     * Adds to the test case's failure count.
     */
	fail : function(){
		this.failures++;
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
     * Adds to the test case's pass count.
     */
	pass : function(){
		this.passes++;
	},
    /**
     * Runs all the testcase's tests and when complete calls an optional callback if provided.
     * @param {optional:Function} callback optional callback for when the test is complete
     */
	run: function(callback){
		this.working_test = 0;
		this.callback = callback;
		this.passes = 0;
		this.failures = 0;
		this.run_next();
	},
    /**
     * Runs a helper function.
     * @param {String} helper_name
     */
	run_helper: function(helper_name){
		var a = new this.Assertions(this);
		a[helper_name](0);
	},
    /**
     * Runs the next function
     */
	run_next: function(){
		if(this.working_test != null && this.working_test < this.test_names.length){
			this.working_test++;
			this.run_test(this.test_names[this.working_test-1]);
		}else if(this.working_test != null){
			MVC.Console.window.update_test(this)
			this.working_test = null;
			if(this.callback){
				this.callback();
				this.callback = null;
			}
		}
	},
	run_test: function(test_id){
		var saved_this = this;
		// setTimeout with delay of 0 is necessary for Opera and Safari to trick them into thinking
		// the calling window was the application and not the console
		setTimeout(function(){ this.assertions = new saved_this.Assertions(saved_this, test_id); },0);
	},
	prepare_page : function(type) {
		MVC.Console.window.document.getElementById(type+'_explanation').style.display = 'none';
		MVC.Console.window.document.getElementById(type+'_test_runner').style.display = 'block';
	},
	updateElements : function(test){
		
		if(test.type == 'unit')
			this.prepare_page('unit');
		else
			this.prepare_page('functional');
		var insert_into = MVC.Console.window.document.getElementById(test.type+'_tests');
		var txt = "<h3><img alt='run' src='playwhite.png' onclick='find_and_run(\""+test.name+"\")'/>"+test.name+" <span id='"+test.name+"_results'></span></h3>";
		txt += "<div class='table_container'><table cellspacing='0px'><thead><tr><th>tests</th><th>result</th></tr></thead><tbody>";
		for(var t in test.tests ){
			if(! test.tests.hasOwnProperty(t) ) continue;
			if(t.indexOf('test') != 0 ) continue;
			var name = t.substring(5)
			txt+= '<tr class="step" id="step_'+test.name+'_'+t+'">'+
			"<td class='name'>"+
			"<a href='javascript: void(0);' onclick='find_and_run(\""+test.name+"\",\""+t+"\")'>"+name+'</a></td>'+
			'<td class="result">&nbsp;</td></tr>'
		}
		txt+= "</tbody></table></div>";
		if(this.added_helpers){
			txt+= "<div class='helpers'>Helpers: "
			var helpers = [];
			for(var h in test.added_helpers)
				if( test.added_helpers.hasOwnProperty(h) ) 
					helpers.push( "<a href='javascript: void(0)' onclick='run_helper(\""+test.name+"\",\""+h+"\")'>"+h+"</a>")
			txt+= helpers.join(', ')+"</div>";
		}
		//var t = document.getElementById('functional_tests');
		var t = MVC.Console.window.document.createElement('div');
		t.className = 'test'
		t.innerHTML  = txt;
		insert_into.appendChild(t);
	}
});

/**
 * @constructor
 * Adds run and run next functions to a Test Class
 * @init Adds
 * @param {Object} object
 * @param {Function} iterator_name - "Tests"
 * @param {Object} params
 */
MVC.Test.Runner = function(object, iterator_name,params){
	var iterator_num;
	object.run = function(callback){
		object._callback = callback;
		iterator_num = 0;
		params.start.call(object);
		object.run_next();
	}
	object.run_next = function(){
		if(iterator_num != null && iterator_num < object[iterator_name].length){
			if(iterator_num > 0) params.after.call(object, iterator_num-1);
			iterator_num++;
			object[iterator_name][iterator_num-1].run(object.run_next)
		}else if(iterator_num != null){
			if(iterator_num > 0) params.after.call(object, iterator_num-1);
			params.done.call(object);
			if(object._callback){
				object._callback();
				object._callback = null;
			}else{
				//if(MVC.Browser.Gecko) window.blur();
				//else MVC.Console.window.focus();
			}
		}
	}
};


/**
 * Assertions run test functions, provide helpers, and record the results of the tests.
 * <h3>Example</h3>
 * <pre><code>this.assert_equal("Tiger", this.name, "Tiger was expected");
this.assert_not_null(this.title, "Title was null");
this.assert_null(this.obj, "Expected to be null");
this.assert(x_value > 200);</code></pre>
 */
MVC.Test.Assertions =  MVC.Class.extend(
/*@Prototype*/
{
	/**
	 * Creates a new Assertion with the given test for the test that matches test_name.
	 * @param {MVC.Test} test An instance of a MVC.Test class.
	 * @param {Function} test_name A function name.
	 */
    init: function( test, test_name){
		this.assertions = 0;
		this.failures = 0;
		this.errors= 0;
		this.messages = [];
		this._test = test;
		
		if(!test_name) return;
		this._delays = 0;
		this._test_name = test_name;
		this._last_called = test_name;
		MVC.Console.window.running(this._test, this._test_name);
		if(this.setup) 
			this._setup();
		else{
			this._start();
		}
	},
	_start : function(){
		try{
			this._test.tests[this._test_name].call(this);
		}catch(e){ this.error(e); this._delays = 0;}
		this._update();
	},
	_setup : function(){
		var next = this.next;
		var time;
		this.next = function(t){ time = t ? t*1000 : 500;}
		this.setup();
		this.next = next;
		if(time){
			var t = this;
			var _start = this._start;
			setTimeout( function(){ _start.call(t); }, time);
		}else{
			this._start();
		}
	},
    /**
     * Asserts the expression exists in the same way that if(expression) does. If the expression doesn't exist reports the error.
     * <pre><code>new MVC.Test.Unit('TestCase Name',{
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
)</code></pre>
     * @param {Object} expression expression to be evaluated
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert: function(expression, message) {
		var message = message || 'assert: got "' + MVC.Test.inspect(expression) + '"';
		try { expression ? this.pass() : 
			this.fail(message); }
		catch(e) { this.error(e); }
	},
    /**
     * Uses the double equals (==) to determine if two values are equal. This means that type coercion may occur. For example 5 == '5'.
     * <pre><code>new MVC.Test.Unit('TestCase Name',{
  test_some_asserts : function(){
    this.assert_equal(7,7)      //passes
	this.assert_equal(7,'7')    //passes
    this.assert_equal('s','s')  //passes
    this.assert_equal(0,false)  //passes
    this.assert_equal("Tiger", this.name, "Tiger was expected");
    this.assert_equal(6,7)      //fails
  }
)</code></pre>
     * @param {Object} expected the expected value
     * @param {Object} actual The variable to check for or the value being checked
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
  	assert_equal: function(expected, actual, message) {
		var message = message || "assertEqual";
		try { (expected == actual) ? this.pass() :
			this.fail(message + ': expected "' + MVC.Test.inspect(expected) + 
			'", actual "' + MVC.Test.inspect(actual) + '"'); }
		catch(e) { this.error(e); }
  	},
    /**
     * Passes if the given object == null. Fails otherwise.
     * <pre><code>this.assert_null(this.obj, "Expected to be null");</code></pre>
     * @param {Object} obj The object to check for null
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_null: function(obj, message) {
	    var message = message || 'assertNull'
	    try { (obj==null) ? this.pass() : 
	      this.fail(message + ': got "' + MVC.Test.inspect(obj) + '"'); }
	    catch(e) { this.error(e); }
	},
    /**
     * Passes if the expression is false, fails if it is true
     * <pre><code>this.assert_not(x_value == 200);</code></pre>
     * @param {Object} expression An expression
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_not: function(expression,message) {
	   var message = arguments[1] || 'assert: got "' + MVC.Test.inspect(expression) + '"';
		try {! expression ? this.pass() : 
			this.fail(message); }
		catch(e) { this.error(e); }
	},
    /**
     * Passes if object is != null, fails otherwise
     * <pre><code>this.assert_not_null(obj);</code></pre>
     * @param {Object} object The object to check for null
     * param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_not_null: function(object,message) {
	    var message = message || 'assertNotNull';
	    this.assert(object != null, message);
	},
    /**
     * Asserts each value in the actual array equals the same value in the expected array
     * @param {Object} expected
     * @param {Object} actual
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_each: function(expected, actual, message) {
	    var message = message || "assert_each";
	    try { 
			var e = MVC.Array.from(expected);
			var a = MVC.Array.from(actual);
			if(e.length != a.length){
				return this.fail(message + ': expected ' + MVC.Test.inspect(expected)+', actual ' + MVC.Test.inspect(actual));
				
			}else{
				for(var i =0; i< e.length; i++){
					if(e[i] != a[i]){
						return this.fail(message + ': expected '+MVC.Test.inspect(expected)+', actual ' + MVC.Test.inspect(actual));
					}
				}
			}
			this.pass();
	    }catch(e) { this.error(e); }
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
	    this.messages.push(error.name + ": "+ error.message + "(" + MVC.Test.inspect(error) +")");
	 },
	_get_next_name :function(){
		for(var i = 0; i < this._test.test_array.length; i++){
			if(this._test.test_array[i] == this._last_called){
				if(i+1 >= this._test.test_array.length){
					alert("There is no function following '"+this._last_called+ "'.  Please make sure you have no duplicate function names in your tests.")
				}
				return this._test.test_array[i+1];
			}
		}
	},
	_call_next_callback : function(fname, params){
		if(!fname) fname = this._get_next_name();
		var assert = this;
		var  func = this._test.tests[fname];
		return function(){
			assert._last_called = fname;
			var args = MVC.Array.from(arguments);
			if(params) args.unshift(params)
			try{
				func.apply(assert, args);
			}catch(e){ assert.error(e); }
			assert._delays--;
			assert._update();
		};
	},
    /**
     * Calls the next function in the array after a certain delay. Used at the end 
     * of a test function after an asynchronous 
     * event has been initiated, such as an Ajax call or an animation.
     * <pre><code><span class="attribute">test_open_directory</span>: <span class="key">function</span>(){
   <span class="comment">// call the next function after a delay of 2 seconds</span>
   <span class="this">this</span>.next(<span class="this">this</span>.DirectoryDblclick(2), 2, 'verify_open');
},
<span class="attribute">verify_open</span>: <span class="key">function</span>(){
   <span class="this">this</span>.assert_equal(5, params.element.childNodes.length);
}</code></pre>
     * @param {optional:Object} params Optional parameters. If provided, this is passed into the function specified by fname as its parameter.
     * @param {optional:Number} delay An optional delay, after which the specified function is called. The default is 0.5 seconds.
     * @param {optional:String} fname An optional function name. If none is give, defaults to the name of the function sequentially next in the array of test functions.
     */
	next: function(params,delay, fname){
		this._delays ++;
		delay = delay ? delay*1000 : 500;
		setTimeout(this._call_next_callback(fname, params), delay)
	},
    /**
     * Calls the next function in the array after a certain delay. Used in conjunction with asynchronous functions that use callback functions, 
     * such as an Ajax call or the Drag event.
     * <pre><code><span class="attribute">test_drag</span>: <span class="key">function</span>(){
    <span class="this">this</span>.Drag($E(<span class="string">'draggable'</span>),{<span class="attribute">from</span>: <span class="string">'pointA'</span>, <span class="attribute">to</span>: <span class="string">'pointB'</span>, 
        <span class="attribute">duration</span>: 2, <span class="attribute">callback</span>: <span class="key">this</span>.next_callback(<span class="string">'done_dragging', 3</span>)})
}, 
<span class="attribute">done_dragging</span> : <span class="key">function</span>(){
    <span class="this">this</span>.assert_equal(1, $E(<span class="string">'pointB'</span>).next().childNodes.length);
}</code></pre>
     * @param {Object} fname An optional function name. If none is give, defaults to the name of the function sequentially next in the array of test functions.
     * @param {Object} delay An optional delay, after which the specified function is called. The default is 0.5 seconds.
     * @return {Function} the function used for callbacks
     */
	next_callback: function(fname,delay){
		this._delays++;
		var f = this._call_next_callback(fname)
		if(!delay) return f;
		return function(){
			setTimeout(f, delay*1000)
		};
	},
	_update : function(){
		if(this._delays == 0){
			if(this.teardown) this.teardown()
			if(this._do_blur_back)
				this._blur_back();
			MVC.Console.window.update(this._test, this._test_name, this);
			this.failures == 0 && this.errors == 0?  this._test.pass(): this._test.fail();
			this._test.run_next();
		}
	},
	_blur_back: function(){
		MVC.Browser.Gecko ? window.blur() : MVC.Console.window.focus();
	}
});


Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
	  return fn.apply(this, args.concat(
	    Array.prototype.slice.call(arguments)));
	};
};



/**
 * Unit tests are Used for testing lower level functionality, like a method or class.
 * 
 */
MVC.Test.Unit = MVC.Test.extend(
/*@Prototype*/
{
    /**
     * Called when a new unit test case is created. A test case is a collection of test functions and helpers.
     * 
     * @param {String} name The className of your test.
     * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. 
     * Functions that don't begin with test are converted to helper functions. Do not name helper 
     * functions the same name as the test provided helpers and assertions 
     * such as assert or assertEqual as your functions will override these functions.
     */
	init: function(name , tests ){
		this._super(  name, tests, 'unit');
		MVC.Test.Unit.tests.push(this)
	}
});


MVC.Test.Unit.tests = [];


MVC.Test.Runner(MVC.Test.Unit, "tests", {
	start : function(){
		this.passes = 0;
	},
	after : function(number ){
		if(this.tests[number].failures == 0 ) this.passes++;
	},
	done: function(){
		MVC.Console.window.document.getElementById('unit_result').innerHTML = 
			'('+this.passes+'/'+this.tests.length+')' + (this.passes == this.tests.length ? ' Wow!' : '')
	}
})



/**
 * Functional tests are used to mimic user events.
 */
MVC.Test.Functional = MVC.Test.extend(
/*@Prototype*/
{
	/**
	 * Creates a new functional test case. A test case is a collection of test functions and helpers.
	 * <pre><code>new MVC.Test.Functional('TestCaseName',{
  test_some_clicks : function(){
    this.Click('#button')
  }
})</code></pre>
	 * @param {String} name The unique name of the test. Make sure no two tests have the same name.
	 * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. Functions that don't begin with test are converted to helper functions. Do not name helper functions the same name as the test provided helpers and assertions such as assert or assertEqual as your functions will override these functions.
	 */
    init: function(name , tests ){
		this._super(  name, tests, 'functional');
		MVC.Test.Functional.tests.push(this)
	},
	helpers : function(){
		var helpers = this._super();
		/**
		 * @function Action
		 * Creates a syntetic event on a HTMLElement.
		 * <pre><code>this.Action('click','.todo',3) <span class="comment">//calls a click on the third element with class '.todo'</span></code></pre>
		 * @param {String} event_type A lowercase event type. One of ['change', 'click', 'contextmenu', 'dblclick', 'keyup', 'keydown', 'keypress','mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'submit', 'focus', 'blur','drag', 'write'].
		 * @param {String/HTMLElement} selector An HTMLElement or a CSS selector.
		 * @param {Number/Object} options If a number is provided, it uses it to select that number from the array of elements returned by doing a CSSQuery with selector. If an object is provided, it passes those options to the SyntheticEvent for creation. If nothing is provided, the number defaults to 0.
		 */
        helpers.Action =   function(event_type, selector, options){
			options = options || {};
			options.type = event_type;
			var number = 0;

			if(typeof options == 'number') 		 number = options || 0;
			else if (typeof options == 'object') number = options.number || 0;
			
			var element = typeof selector == 'string' ? MVC.Query(selector)[number] : selector; //if not a selector assume element
			
			if((event_type == 'focus' || event_type == 'write' || event_type == 'click') && !this._do_blur_back){
				MVC.Browser.Gecko ? MVC.Console.window.blur() : window.focus();
				this._do_blur_back =true;
			}
			

			var event = new MVC.SyntheticEvent(event_type, options).send(element);
			return {event: event, element: element, options: options};
		}
		for(var e = 0; e < MVC.Test.Functional.events.length; e++){
			var event_name = MVC.Test.Functional.events[e];
			helpers[MVC.String.capitalize(event_name)] = helpers.Action.curry(event_name)
		}
		return helpers;
	}
});
MVC.Test.Functional.events = [
/* @function Blur
 * Calls Action using 'blur' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'blur',
/*
 * @function Change
 * Calls Action using 'change' as the first parameter.
 */
'change',
/**
 * @function Click
 * Calls Action using 'click' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'click',
/**
 * @function Contextmenu
 * Calls Action using 'contextmenu' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'contextmenu',
/**
 * @function Dblclick
 * Calls Action using 'dblclick' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'dblclick',
/**
 * @function Keyup
 * Calls Action using 'keyup' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'keyup',
/**
 * @function Keydown
 * Calls Action using 'keydown' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'keydown',
/**
 * @function Keypress
 * Calls Action using 'keypress' as the first parameter. In browsers other that Firefox, keypress support built into the browser doesn't actually write text into the input element. To make up for this shortcoming, this method manually inserts text into the input element's value attribute.
 * @param {String/HTMLElement} selector_or_element
 * @param {String} The character to be written to the passed element, '\b' causes a character to be deleted, '\n' simulates pressing enter
 * @param {Object} options a hash with the following properties:
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>character</td>
						<td>false</td>
						<td>
							True to simulate pressing the alt key.
						</td>
					</tr>
					<tr>
						<td>ctrlKey</td>
						<td>false</td>
						<td>
							True to simulate pressing the control key.
						</td>
					</tr>
					<tr>
						<td>altKey</td>
						<td>false</td>
						<td>True to simulate pressing the alt key.</td>
					</tr>
					<tr>
						<td>shiftKey</td>
						<td>false</td>
						<td>True to simulate pressing the shift key.</td>
					</tr>
					<tr>
						<td>metaKey</td>
						<td>false</td>
						<td>True to simulate pressing the meta key.</td>
					</tr>
					<tr>
						<td>keyCode</td>
						<td>0</td>
						<td>Used to simulate pressing other keys, this <a href="http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx">reference</a> shows a list of keyCodes you can use.</td>
					</tr>
				</tbody></table>
 */
'keypress',
/**
 * @function Mousedown
 * Calls Action using 'mousedown' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mousedown',
/**
 * @function Mousemove
 * Calls Action using 'mousemove' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mousemove',
/**
 * @function Mouseout
 * Calls Action using 'mouseout' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mouseout',
/**
 * @function Mouseover
 * Calls Action using 'mouseover' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mouseover',
/**
 * @function Mouseup
 * Calls Action using 'mouseup' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mouseup',
/**
 * @function Reset
 * Calls Action using 'reset' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'reset',
/**
 * @function Resize
 * Calls Action using 'resize' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'resize',
/**
 * @function Scroll
 * Calls Action using 'scroll' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'scroll',
/**
 * @function Select
 * Calls Action using 'select' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'select',
/**
 * @function Submit
 * Calls Action using 'submit' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'submit',
/**
 * @function Dblclick
 * Calls Action using 'dblclick' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'dblclick',
/**
 * @function Focus
 * Calls Action using 'focus' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'focus',
/**
 * @function Load
 * Calls Action using 'load' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'load',
/**
 * @function Unload
 * Calls Action using 'unload' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'unload',
/**
 * @function Drag
 * Creates events that simulate a drag motion across the browser. The drag events are comprised of a mousedown from the from location, equal spaced mousemoves to the to location, and a mouseup at the to location. Drag is by default syncronous, but can be made asyncronous by providing a duration option.
 * <pre><code>test_drag_to_trash : function(){
  this.Drag('#/drag_handle', 
    {
      from: '/drag_handle',
      to: '/trash', 
      duration: 2, 
      callback: this.next_callback()
    })
},
make_sure_drag_worked : function(){
  this.assertNull(document.getElementById('/drag_handle'));
}</code></pre>
 * @param {String/HTMLElement} selector_or_element
 * @param {Object} options A hash with the following properties:
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>callback</td>
						<td>null</td>
						<td>
							A callback that gets called when the drag motion has completed.  This is only
							necessary with asyncronous drags.  Typically, the callback can be provided by
							next_callback();
						</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>null</td>
						<td>
							The length of time in seconds the drag takes place.  By setting this
							option, the events are dispatched in intervals, letting the browser update the 
							screen.  Typically, you want to provide a <i>callback</i> to test the results of the
							drag after completion.
						</td>
					</tr>
					
					<tr>
						<td>from</td>
						<td>null</td>
						<td>
							The starting coordinates of the drag.  This can be specified in three ways: first, as an
							object like {x: 123, y: 321}; second, as a HTMLElement; third, as the string ID of 
							a HTMLElement.  Providing an element or the id of an element, Drag will use the 
							center of the element as is starting position.
						</td>
					</tr>
					<tr>
						<td>steps</td>
						<td>100</td>
						<td>
							The number of mousemoves called to represent the drag.  This parameter is void if
							duration is provided.
						</td>
					</tr>
					<tr>
						<td>to</td>
						<td>null</td>
						<td>
							The ending coordinates of the drag.  Use the <i>to</i> option the same
							way as the <i>from</i> option.
						</td>
					</tr>
				</tbody></table>
 */
'drag',
/**
 * @function Write
 * Creates events that simulate writing into an input element. If a callback option is used in the second parameter, the event is asynchronous. Otherwise, it is synchronous.
 * <pre><code><span class="comment">// syntax 1: synchronous version</span>
<span class="this">this</span>.Write(input_params.element, <span class="string">'Brian'</span>);
<span class="comment">// syntax 2: asynchronous version</span>
<span class="this">this</span>.Write(input_params.element, {<span class="attribute">text</span>: <span class="string">'Brian'</span>, <span class="attribute">callback</span>: this.next_callback()});</code></pre>
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/String} options_or_string If a string is passed, it is the text written in the passed input element. If a hash is passed it, it expects the following parameters:
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>callback</td>
						<td>null</td>
						<td>
							A callback that gets called when the write has completed.  This is only
							necessary with asyncronous writes.  Typically, the callback can be provided by
							next_callback();
						</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>null</td>
						<td>
							The length of time in seconds the write takes place.  By setting this
							option, the events are dispatched in intervals, letting the browser update the 
							screen.  Typically, you want to provide a <i>callback</i> to test the results of the
							drag after completion.
						</td>
					</tr>
					<tr>
						<td>text</td>
						<td>null</td>
						<td>
							The text to be written into the given input element.
                            <br/>'\b' - the backspace character is used to delete one character of text
                            <br/>'\n' - the newline character is used to simulate pressing enter
						</td>
					</tr>
					

					
				</tbody></table>
 */
'write'
];
MVC.Test.Functional.tests = [];


MVC.Test.Runner(MVC.Test.Functional, "tests", {
	start : function(){
		this.passes = 0;
	},
	after : function(number ){
		if(this.tests[number].failures == 0 ) this.passes++;
	},
	done: function(){
		MVC.Console.window.document.getElementById('functional_result').innerHTML = 
			'('+this.passes+'/'+this.tests.length+')' + (this.passes == this.tests.length ? ' Wow!' : '')
	}
})

/**
 * Creates helpers from your controller actions.  For example, if your todos controller has an action
 * named click, a TodosClick helper wil be created.
 */
MVC.Test.Controller = MVC.Test.Functional.extend({
	init: function(name , tests ){
		var part = MVC.String.classize(name);
		var controller_name = part+'Controller';
		this.controller = window[controller_name];
		if(!this.controller) alert('There is no controller named '+controller_name);
		this.unit = name;
		this._super(part+'TestController', tests);
	},
	helpers : function(){
		var helpers = this._super();
		var actions = MVC.Object.extend({}, this.controller.actions) ;
		this.added_helpers = {};
		for(var action_name in actions){
			if(!actions.hasOwnProperty(action_name) || 
				!actions[action_name].event_type || 
				!actions[action_name].css_selector) 
					continue;
			var event_type = actions[action_name].event_type;
			var cleaned_name = actions[action_name].css_selector.replace(/\.|#/g, '')+' '+event_type;
			var helper_name = cleaned_name.replace(/(\w*)/g, function(m,part){ return MVC.String.capitalize(part)}).replace(/ /g, '');
			helpers[helper_name] = helpers[MVC.String.capitalize(event_type)].curry(actions[action_name].css_selector);
			this.added_helpers[helper_name] = helpers[helper_name];
		}
		return helpers;
	}
});



if(MVC.Console && MVC.Console.window)
    MVC.Console.window.get_tests = function(){return MVC.Tests; } 

//This function returns what something looks like
MVC.Test.inspect =  function(object) {
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
MVC.Test.loaded_files = {};

MVC.Included.unit_tests = [];
MVC.Included.functional_tests = [];
include.unit_tests = function(){
	for(var i=0; i< arguments.length; i++)
		MVC.Console.log('Trying to load: test/unit/'+arguments[i]+'_test.js');
	include.app(function(i){ return '../test/unit/'+i+'_test'}, MVC.Included.unit_tests).apply(null, arguments);
}
include.functional_tests = function(){
	for(var i=0; i< arguments.length; i++)
		MVC.Console.log('Trying to load: test/functional/'+arguments[i]+'_test.js');
	include.app(function(i){ return '../test/functional/'+i+'_test'}, MVC.Included.functional_tests).apply(null, arguments);
}

if(!MVC._no_conflict) Test = MVC.Test;