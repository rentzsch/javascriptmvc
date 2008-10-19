include.plugins('lang');
if(typeof jQuery != 'undefined'){
	include('jquery_ajax')	
}else if( typeof Prototype != 'undefined' ){
	include('prototype_ajax')	
	
}else{
	include('ajax')
}

if(MVC.Console || MVC.use_fixtures)
	include('debug')