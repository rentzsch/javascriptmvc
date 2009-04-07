(function(){
	var c = MVC.Controller;
	
	MVC.Controller = function(model, actions){
		c(model, actions);
		var path = MVC.root.join('test/functional/'+model+'_controller_test.js');
		var exists = include.checkExists(path);
		if(exists)
			$.Console.log('Loading: "test/functional/'+model+'_controller_test.js"');
		else {
			$.Console.log('Test Controller not found at "test/functional/'+model+'_controller_test.js"');
			return;
		}
		var p = include.get_path();
		include.set_path(MVC.root.path);
		include('test/functional/'+ model+'_controller_test.js');
		include.set_path(p);
	};
	jQuery.extend(MVC.Controller, c);
	
	if(!MVC._no_conflict) Controller = MVC.Controller;
})();
