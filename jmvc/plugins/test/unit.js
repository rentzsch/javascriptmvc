
MVC.Test.extend("MVC.Test.Unit",
{
    tests: [],
    /**
     * Called when a new unit test case is created. A test case is a collection of test functions and helpers.
     * 
     * @param {String} name The className of your test.
     * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. 
     * Functions that don't begin with test are converted to helper functions. Do not name helper 
     * functions the same name as the test provided helpers and assertions 
     * such as assert or assertEqual as your functions will override these functions.
     */
    init : function(){
        if(jQuery.String.include(this.fullName,"MVC.Test"  )) return;
        
        MVC.Test.Unit.tests.push(this);
        this._super();
    }  
},
/* @Prototype*/
{
    
});


MVC.Test.Unit.tests = [];
