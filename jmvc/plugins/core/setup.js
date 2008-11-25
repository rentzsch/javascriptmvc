
if(typeof Prototype != 'undefined') {
	MVC.Event = Event;
	include({path: '../lang/prototype_helpers.js', shrink_variables: false},
			"../lang/inflector/inflector",
			"../io/ajax/prototype_ajax",
			"../lang/class/setup");
    
    
}else if(typeof jQuery != 'undefined'){
    include({path: '../lang/jquery_helpers.js', shrink_variables: false},
		"../lang/inflector/inflector",
		"../dom/event/standard",
		"../io/ajax/ajax",
		"../lang/class/setup");
    
    
}else{
	include({path: '../lang/standard_helpers.js', shrink_variables: false},
		"../lang/inflector/inflector",
		"../dom/event/standard",
		"../io/ajax/ajax",
		"../lang/class/setup");
}

if(MVC.Console)
	include("../io/ajax/debug")


include('../view/view', 
		'../controller/delegator',
		'../controller/controller',
		
		'../controller/view/controller_view');
    
include.plugins('dom/element', 'controller/scaffold','model/view_helper','view/helpers')
    
if(include.get_env() == 'development')	include('../view/fulljslint');



