include.plugins('lang');
if(typeof jQuery != 'undefined'){
	include('jquery_ajax')	
}else if( typeof Prototype != 'undefined' ){
	include('prototype_ajax')	
	
}else{
	include('ajax')
}

if(include.get_env() == "test" || MVC.use_fixtures)
	include('debug')