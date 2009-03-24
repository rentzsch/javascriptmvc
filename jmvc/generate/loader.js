load('jmvc/rhino/compression/env.js');

if(typeof MVC == 'undefined')
    MVC ={ Included: {} };
else
    MVC.Included = {};

var window = this;
var self = window;

include = function(){}
include.get_env = function(){
	return 'development'
}

window._rhino = __env__.platform == 'Rhino ';
window.location = 'jmvc/generate/empty.html';

MVC.Object = { 
	extend: function(d, s) { for (var p in s) d[p] = s[p]; return d;} 
}

load('jmvc/plugins/jquery/setup.js');
load('jmvc/plugins/lang/setup.js');
load('jmvc/plugins/lang/inflector/inflector.js')
load('jmvc/plugins/view/view.js');

MVC.Ajax = {factory: function(){ return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();}}
include.request = function(path){
   var request = MVC.Ajax.factory();
   request.open("GET", path, false);
   try{request.send(null);}
   catch(e){return null;}
   if ( request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
   return request.responseText;
};

MVCOptions = {};
load('jmvc/rhino/compression/helpers.js');

var generation_message_state = {
	first: true,
	indent: "             "
};

var print_generating_message = function(path) {
	if (generation_message_state.first)
		print("Generating...\n");
	
	print(generation_message_state.indent + path);
	generation_message_state.first = false;
};

render_to = function(file, ejs, data) {
    print_generating_message(file);
    
    try {
		MVCOptions.save(file, new View({ absolute_url : ejs }).render(data));
	} catch(e) {
		print("  ERROR! Unable to render to " + file + ". Make sure the folder exists!");
	}
};

render_text_to = function(file, text) {
	print_generating_message(file);
	
	try {
		MVCOptions.save(file, text);
	} catch(e) {
		print("  ERROR! Unable to render to " + file + ". Make sure the folder exists!");
	}
};

create_folder = function(path) {
	print_generating_message(path);
	
	try {
		MVCOptions.create_folder(path);
	} catch(e) {
		print("  ERROR! Unable to create folder: " + path);
	}
};

print_post_generation_message = function() {
	print("\n" + generation_message_state.indent + "Make sure to add new files to your application and test file!\n");
};