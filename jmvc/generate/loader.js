//load('jmvc/generate/loader.js')
discribe_el = function(el){
    if(!el) return undefined;
    if(el.id) return "#"+el.id;
    if(el.className) return "."+el.className
    return el.nodeName;
}


load('jmvc/rhino/compression/env.js');
__env__.scriptTypes["text/javascript"] = true;

load_stuff = function(){
    $.include.plugins('view')
}

window.location = 'jmvc/generate/empty.html';




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
    
    //try {
		MVCOptions.save(file, new $.View({ absolute_url : ejs }).render(data));
	//} catch(e) {
	//	print("  ERROR! Unable to render to " + file + ". Make sure the folder exists!");
	//}
};

render_text_to = function(file, text) {
	print_generating_message(file);
	
	///try {
		MVCOptions.save(file, text);
	//} catch(e) {
	//	print("  ERROR! Unable to render to " + file + ". Make sure the folder exists!");
	//}
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



