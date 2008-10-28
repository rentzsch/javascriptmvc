
/*
 * JavaScriptMVC - include
 * (c) 2008 Jupiter ITS
 */

(function(){
	
// Check if include has already been loaded, if it has call end.
if(typeof include != 'undefined' && typeof include.end != 'undefined'){
    return include.end();
}else if(typeof include != 'undefined' && typeof include.end == 'undefined')
	throw("Include is defined as function or an element's id!");

//Default things JMVC Has
MVC = {
	OPTIONS: {},
	Test: {},
	//Included: {controllers: [], resources: [], models: [], plugins: [], views: [], functional_tests: [], unit_tests: []},
	_no_conflict: false,
	no_conflict: function(){ MVC._no_conflict = true  },
	File: function(path){ this.path = path; },
	/* Ignores code in rhino */
    Runner: function(f){
		if(!window.in_command_window && !window._rhino) f();
	},
	Ajax: {},
	Browser: {
	    IE:     !!(window.attachEvent && !window.opera),
	    Opera:  !!window.opera,
	    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
	    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
	    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
	},
	mvc_root: null,
	include_path: null,
	root: null,
	Object:  { extend: function(d, s) { for (var p in s) d[p] = s[p]; return d;} },
	$E: function(id){ return typeof id == 'string' ? document.getElementById(id): id },
	app_name: 'app',
    get_random: function(length){
    	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    	var randomstring = '';
    	for (var i=0; i<length; i++) {
    		var rnum = Math.floor(Math.random() * chars.length);
    		randomstring += chars.substring(rnum,rnum+1);
    	}
        return randomstring;
    }
};
	
var File = MVC.File;
/**
 * Used for getting information out of a path
 */
MVC.File.prototype = {
	/**
	 * Removes hash and params
	 */
    clean: function(){
		return this.path.match(/([^\?#]*)/)[1];
	},
    /**
     * Returns everything before the last /
     */
	dir: function(){
		var last = this.clean().lastIndexOf('/');
		return last != -1 ? this.clean().substring(0,last) : ''; //this.clean();
	},
    /**
     * Returns the domain for the current path.
     * Returns null if the domain is a file.
     */
	domain: function(){ 
		if(this.path.indexOf('file:') == 0 ) return null;
		var http = this.path.match(/^(?:https?:\/\/)([^\/]*)/);
		return http ? http[1] : null;
	},
    /**
     * Joins url onto path
     * @param {Object} url
     */
	join: function(url){
		return new File(url).join_from(this.path);
	},
    /**
     * 
     * @param {Object} url
     * @param {Object} expand
     */
	join_from: function( url, expand){
		if(this.is_domain_absolute()){
			var u = new File(url);
			if(this.domain() && this.domain() == u.domain() ) 
				return this.after_domain();
			else if(this.domain() == u.domain()) { // we are from a file
				return this.to_reference_from_same_domain(url);
			}else
				return this.path;
		}else if(url == MVC.page_dir && !expand){
			return this.path;
		}else{
			if(url == '') return this.path.replace(/\/$/,'');
			var urls = url.split('/'), paths = this.path.split('/'), path = paths[0];
			if(url.match(/\/$/) ) urls.pop();
			while(path == '..' && paths.length > 0){
				paths.shift();
				urls.pop();
				path =paths[0];
			}
			return urls.concat(paths).join('/');
		}
	},
    /**
     * Joins the file to the current working directory.
     */
    join_current: function(){
        return this.join_from(include.get_path());
    },
    /**
     * Returns true if the file is relative
     */
	relative: function(){		return this.path.match(/^(https?:|file:|\/)/) == null;},
    /**
     * Returns the part of the path that is after the domain part
     */
	after_domain: function(){	return this.path.match(/(?:https?:\/\/[^\/]*)(.*)/)[1];},
	/**
	 * 
	 * @param {Object} url
	 */
    to_reference_from_same_domain: function(url){
		var parts = this.path.split('/'), other_parts = url.split('/'), result = '';
		while(parts.length > 0 && other_parts.length >0 && parts[0] == other_parts[0]){
			parts.shift(); other_parts.shift();
		}
		for(var i = 0; i< other_parts.length; i++) result += '../';
		return result+ parts.join('/');
	},
    /**
     * Is the file on the same domain as our page.
     */
	is_cross_domain : function(){
		if(this.is_local_absolute()) return false;
		return this.domain() != new File(location.href).domain();
	},
	is_local_absolute : function(){	return this.path.indexOf('/') === 0},
	is_domain_absolute : function(){return this.path.match(/^(https?:|file:)/) != null},
    /*
     * For a given path, a given working directory, and file location, update the path so 
     * it points to the right location.
     */
	normalize: function(){
		var current_path = include.get_path();
		//if you are cross domain from the page, and providing a path that doesn't have an domain
		var path = this.path;
        if(new File(include.get_absolute_path()).is_cross_domain() && !this.is_domain_absolute() ){
			//if the path starts with /
			if( this.is_local_absolute() ){
				var domain_part = current_path.split('/').slice(0,3).join('/');
				path = domain_part+path;
			}else{ //otherwise
				path = this.join_from(current_path);
			}
		}else if(current_path != '' && this.relative()){
			path = this.join_from( current_path+(current_path.lastIndexOf('/') === current_path.length - 1 ? '' : '/')  );
		}else if(current_path != '' && options.remote && ! this.is_domain_absolute()){
			var domain_part = current_path.split('/').slice(0,3).join('/');
			path = domain_part+path;
		}
		return path;
	}
};



MVC.page_dir = new File(window.location.href).dir(); //here, everything must adjust to this				  

//find include and get its absolute path
var scripts = document.getElementsByTagName("script");
for(var i=0; i<scripts.length; i++) {
	var src = scripts[i].src;
	if(src.match(/include\.js/)){
		MVC.include_path = src;
		MVC.mvc_root = new File( new File(src).join_from( MVC.page_dir ) ).dir();
		// added this to check for html files that are deeper inside the jmvc directory
		if(MVC.mvc_root.match(/\.\.$/)) var tmp = MVC.mvc_root+'/..';
		else var tmp = MVC.mvc_root.replace(/jmvc$/,'');
		if(tmp.match(/.+\/$/)) tmp = tmp.replace(/\/$/, '');
		MVC.root = new File(tmp);
		if(src.indexOf('?') != -1) MVC.script_options = src.split('?')[1].split(',');
	}
}


//configurable options
var options = {	remote: typeof MVCOptions == 'object' && MVCOptions.remote, 
				env: 'development', 
				production: '/javascripts/production.js',
				base62: false, shrink_variables: true};

// variables used while including
var first = true , 
	first_wave_done = false, 
	included_paths = [],
	cwd = '', 
	includes=[], 
	current_includes=[],
	total = [];



var is_included = function(path){
	for(var i = 0; i < includes.length; i++) if(includes[i].absolute == path) return true;
	for(var i = 0; i < current_includes.length; i++) if(current_includes[i].absolute == path) return true;
	for(var i = 0; i < total.length; i++) if(total[i].absolute == path) return true;
	return false;
};

var add_with_defaults = function(inc, force){
	if(typeof inc == 'string') inc = {path: inc.indexOf('.js') == -1  ? inc+'.js' : inc};
	if(typeof inc != 'function'){
        inc.original_path = inc.path;
        inc = MVC.Object.extend( MVC.Object.extend({},options), inc);
        if(force)
            inc.compress = false
    }
	include.add(inc);
};
var head = function(){
	var d = document, de = d.documentElement;
	var heads = d.getElementsByTagName("head");
	if(heads.length > 0 ) return heads[0];
	var head = d.createElement('head');
	de.insertBefore(head, de.firstChild);
	return head;
};


include = function(){
	if(include.get_env().match(/development|compress|test/)){
		for(var i=0; i < arguments.length; i++) add_with_defaults(arguments[i]);
	}else{
		if(!first_wave_done) return; 
		for(var i=0; i < arguments.length; i++){
            add_with_defaults(arguments[i]);
        }
		return;
	}
	if(first && !MVC.Browser.Opera){
		first = false;
        insert();
	}
};
	
MVC.Object.extend(include,{
	setup: function(o){
        MVC.Object.extend(options, o || {});

		options.production = options.production+(options.production.indexOf('.js') == -1 ? '.js' : '' );

		if(options.env == 'compress' && !window._rhino) 
            include.compress_window = window.open(MVC.mvc_root+'/compress.html', null, "width=600,height=680,scrollbars=no,resizable=yes");
		if(options.env == 'test') 
            include.plugins('test');
		if(options.env == 'production' && ! MVC.Browser.Opera && ! options.remote)
			return document.write('<script type="text/javascript" src="'+include.get_production_name()+'"></script>');
	},
	get_env: function() { return options.env;},
	get_production_name: function() { return options.production;},
	/**
	 * Sets the current directory.
	 * @param {Object} p
	 */
    set_path: function(p) {
        cwd = p;
    },
	get_path: function() { 
		return options.remote ? include.get_absolute_path() : cwd;
	},
	get_absolute_path: function(){
		var fwd = new File(cwd);
		return fwd.relative() ? fwd.join_from(MVC.root.path, true) : cwd;
	},
    /**
     * Adds the include to the list of includes remaining to be included.
     * If the include is a function, adjusts the function to run from the current
     * path, adds the include to the list of functions to be run.  Then adds it to the current includes.
     * If it is a normal file, it normalizes the file to the current path.
     * @param {Object} newInclude
     */
	add: function(newInclude){
		if(typeof newInclude == 'function'){
            var path = include.get_path();
            var adjusted = function(){
                include.set_path(path);
                newInclude();
            }
            include.functions.push(adjusted);
            current_includes.unshift(  adjusted ); //add to the front
            return;
        }
        
        var path = newInclude.path;
        if(first_wave_done) return insert_head(path);
        
        
        
		var pf = new File(newInclude.path);
		newInclude.path = pf.normalize();
        
        //include.normalize(  path  );
		
		newInclude.absolute = pf.relative() ? pf.join_from(include.get_absolute_path(), true) : newInclude.path;
		if(is_included(newInclude.absolute)) return;
		var ar = newInclude.path.split('/');
		ar.pop();
		newInclude.start = ar.join('/');
		current_includes.unshift(  newInclude );
	},
    force : function(){
        for(var i=0; i < arguments.length; i++){
            //basically convert from jmvc
            insert_head(MVC.root.join(arguments[i]));
        }
    },
    
    close_time : function(){
        setTimeout(function(){ document.close(); },10)
    },
    close : function(){
        if(include.get_env()=='production') include.close_time();
        else    include._close= true;
    },
    /*
     * Called after every file is loaded.  Gets the next file and includes it.
     */
	end: function(src){
        includes = includes.concat(current_includes);
		var latest = includes.pop();
		if(!latest) {
			first_wave_done = true;
			if(include.get_env()=='compress') setTimeout( include.compress, 10 );
            if(typeof MVCOptions != 'undefined' && MVCOptions.done_loading) MVCOptions.done_loading();
            
            if(include._close){ 
                this.close_time();
            }
			return;
		};
		total.push( latest);
		current_includes = [];
        if(typeof latest == 'function'){
            latest();
            
            //if(include.get_env()=='compress'){
            //    latest.text = "include.next_function();"
            //}
            
            insert();
        }else{
            include.set_path(latest.start);
    		include.current = latest.path;
    		if(include.get_env()=='compress'){
                if( typeof print != 'undefined'){
                     
                     var parts = latest.path.split("/")
                     if(parts.length > 4) parts = parts.slice(parts.length - 4);
                     
                     print("   "+parts.join("/"));
                }
                latest.text = include.request(MVC.root.join(latest.path));
            }
    		latest.ignore ? insert() : insert(latest.path);
        }
	},
	end_of_production: function(){ first_wave_done = true; },
	compress: function(){
		if(typeof MVCOptions == 'undefined' || !MVCOptions.compress_callback){
            include.compress_window  ? 
			include.compress_window.compress(total, include.srcs, include.get_production_name()) :
			alert("Your popup blocker is keeping the compressor from running.\nPlease allow popups and refresh this page.");
        }else{
            MVCOptions.compress_callback(total)
        }
	},
	opera: function(){
		include.opera_called = true;
		if(MVC.Browser.Opera && ! options.remote){
			options.env == 'production' ? document.write('<script type="text/javascript" src="'+include.get_production_name()+'"></script>') : include.end();
		}
	},
	opera_called : false,
	srcs: [],
	plugin: function(plugin_name) {
		var current_path = include.get_path();
		include.set_path("");
		include('jmvc/plugins/'+ plugin_name+'/setup');
		include.set_path(current_path);
	},
	plugins: function(){
		for(var i=0; i < arguments.length; i++) include.plugin(arguments[i]);
	},
	app: function(f){
		return function(){
            for (var i = 0; i < arguments.length; i++) {
				arguments[i] = f(arguments[i]);
			}
			include.apply(null, arguments);
		}
	},
    functions: [],
    next_function : function(){
        var func = include.functions.pop();
        if(func) func();
    },
    css: function(){
        var arg;
        for(var i=0; i < arguments.length; i++){
            arg = arguments[i];
            var current = new MVC.File("../stylesheets/"+arg+".css").join_current();
            include.create_link( MVC.root.join(current)  );
        }
        
        
    },
    create_link: function(location){
        var link = document.createElement('link');
    	link.rel = "stylesheet";
    	link.href =  location;
    	link.type = 'text/css';
        head().appendChild(link);
    }
});
	

var insert_head = function(src, encode){
	encode = encode || "UTF-8";
    var script= script_tag();
	script.src= src;
	script.charset= encode;
	head().appendChild(script);
};
include.insert_head = insert_head;
var script_tag = function(){
	var start = document.createElement('script');
	start.type = 'text/javascript';
	return start;
};
var insert = function(src){
    // source we need to know how to get to jmvc, then load 
    // relative to path to jmvc
    if(src){
        var src_file = new MVC.File(src);
		if(!src_file.is_local_absolute() && !src_file.is_domain_absolute())
	        src = MVC.root.join(src);
	}
    if(! document.write){
        if(src){
            load(new MVC.File( src ).clean());
        }
        load( new MVC.File( MVC.include_path ).clean()  )
    }else if(MVC.Browser.Opera||MVC.Browser.Webkit){
		if(src) {
			var script = script_tag();
			script.src=src+'?'+MVC.random;
			document.body.appendChild(script);
		}
		var start = script_tag();
		start.src = MVC.include_path+'?'+MVC.random;
		document.body.appendChild(start);
	}else{
        document.write(
			(src? '<script type="text/javascript" src="'+src+(true ? '': '?'+MVC.random )+'"></script>':'')+
			call_end()
		);
	}
};

var call_end = function(src){
    return MVC.Browser.Gecko ? '<script type="text/javascript">include.end()</script>' : 
    '<script type="text/javascript" src="'+MVC.include_path+'?'+MVC.random+'"></script>'
}

MVC.random = MVC.get_random(6);

MVC.Ajax.factory = function(){ return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();};
include.request = function(path){
   var request = MVC.Ajax.factory();
   request.open("GET", path, false);
   try{request.send(null);}
   catch(e){return null;}
   if ( request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
   return request.responseText;
};
include.check_exists = function(path){		
	var xhr=MVC.Ajax.factory();
	try{ 
		xhr.open("HEAD", path, false);
		xhr.send(null); 
	} catch(e) { return false; }
	if ( xhr.status > 505 || xhr.status == 404 || xhr.status == 2 || 
		xhr.status == 3 ||(xhr.status == 0 && xhr.responseText == '') ) 
			return false;
    return true;
}

include.controllers = include.app(function(i){return '../controllers/'+i+'_controller'});
include.models = include.app(function(i){return '../models/'+i});
include.resources = include.app(function(i){return '../resources/'+i});
include.engines = include.app(function(i){ return '../engines/'+i+"/apps/"+i+".js"} );

if(MVC.script_options){
	first = false;
    MVC.apps_root =  MVC.root.join('apps')
	MVC.app_name = MVC.script_options[0];
    if(window._rhino)
        MVC.script_options[1] = MVCOptions.env
	if(MVC.script_options.length > 1)	
        include.setup(
            {env: MVC.script_options[1], 
             production: MVC.apps_root+'/'+MVC.script_options[0]+'/production'});
	
    include('apps/'+MVC.app_name);
	
    if(MVC.script_options[1] == 'test'){
		var load_test = function(){
			include('apps/'+MVC.app_name+'/test');
		}
		// check exists doesn't block other scripts from loading in FF3, so this causes problems
		if (navigator.userAgent.match(/Firefox\/3/)) { // FF 3
			load_test();
		} else {
			if(include.check_exists(MVC.apps_root+'/'+MVC.app_name+'/test.js')){
				load_test();
	    	}else{
	    		setTimeout(function(){
	                MVC.Console.log("There is no application test file at:\n    \"apps/"+MVC.app_name+"/test.js\"\nUse it to include your test files.\n\nTest includes:\n    include.unit_tests('product')\n    include.functional_tests('widget')")
	            },1000)
	    	}
		}
    }
    insert();
    include.opera();
}
if(MVC.Browser.Opera) 
    setTimeout(function(){ if(!include.opera_called && !options.remote){ alert("You forgot include.opera().")}}, 10000);
})();