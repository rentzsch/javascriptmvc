
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







Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
	  return fn.apply(this, args.concat(
	    Array.prototype.slice.call(arguments)));
	};
};







if(MVC.Console && MVC.Console.window) MVC.Console.window.get_tests = function(){return MVC.Tests; } 

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
	for(var i=0; i< arguments.length; i++){
        if(MVC.Console)
            MVC.Console.log('Trying to load: test/unit/'+arguments[i]+'_test.js');
        else
            print('Trying to load: test/unit/'+arguments[i]+'_test.js')
    }
		
	include.app(function(i){ return '../test/unit/'+i+'_test'}, MVC.Included.unit_tests).apply(null, arguments);
}
include.functional_tests = function(){
	for(var i=0; i< arguments.length; i++){
        if(MVC.Console)
            MVC.Console.log('Trying to load: test/functional/'+arguments[i]+'_test.js');
        else
            print('Trying to load: test/unit/'+arguments[i]+'_test.js');
    }
	include.app(function(i){ return '../test/functional/'+i+'_test'}, MVC.Included.functional_tests).apply(null, arguments);
}

if(!MVC._no_conflict) Test = MVC.Test;





