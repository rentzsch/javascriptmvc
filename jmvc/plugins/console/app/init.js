$.include.plugins('controller','view','console/app');
$.include('parent_fill_controller','tab_controller','tests_controller','console_controller');

$(window).load(function(){
	var pfc = $("#console").parent_fill_controller(window)[0];
	
	var unit = new TestsController(document.createElement('div'),"unit");
	var func = new TestsController(document.createElement('div'),"functional");
    var console = new ConsoleController(document.createElement('div'));
	$("#console").tab_controller({tabs: [
		{controller: console, title: "console"},
		{controller: unit, title: "unit" },
		{controller: func, title: "funtional"}
	]})
	
	pfc.resize();
	unit.resize();
	func.resize();
	//console.log('page loaded')
	unit.add_tests();
})






