if(jQuery.include.get_env() != 'test' && typeof console != 'undefined'){
	jQuery.console.log = function(message){
			console.log(message)
	};
}else{
	
	jQuery.console = {};
	jQuery.console._logged = [];
	jQuery.console.log = function(){
		jQuery.console._logged.push(arguments);
	};
	
	jQuery.console.window = window.open($.MVC.mvcRoot+'/plugins/console/console.html', 'test', "width=600,height=400,resizable=yes,scrollbars=yes");
	
	
}






