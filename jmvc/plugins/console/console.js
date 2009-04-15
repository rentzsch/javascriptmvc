if(jQuery.include.get_env() != 'test' && typeof console != 'undefined'){
	jQuery.Console.log = function(message){
			console.log(message)
	};
}else{
	
	jQuery.Console = {};
	jQuery.Console._logged = [];
	jQuery.Console.window = window.open($.MVC.mvcRoot+'/plugins/console/console.html', 'test', "width=600,height=400,resizable=yes,scrollbars=yes");
	
	jQuery.Console.log = function(){
		jQuery.Console._logged.push(arguments);
	};
}






