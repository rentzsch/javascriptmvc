// Copyright (c) 2007 Edward Benson http://www.edwardbenson.com/projects/ejs

/**
 * @constructor
 * View cleans the HTML out of your JavaScript with client side templates. After View gets its rubber gloves on dirty code, 
 * you'll feel organized and uncluttered.
 * @init Creates a new view
 * @param {Object} options A hash with the following options
 * <table class="options">
				<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
				<tr>
					<td>url</td>
					<td>&nbsp;</td>
					<td>loads the template from a file
					</td>
				</tr>
				<tr>
					<td>text</td>
					<td>&nbsp;</td>
					<td>uses the provided text as the template. Example:<br/><code>new View({text: '&lt;%=user%>'})</code>
					</td>
				</tr>
				<tr>
					<td>element</td>
					<td>&nbsp;</td>
					<td>loads a template from the innerHTML or value of the element.
					</td>
				</tr>
				<tr>
					<td>type</td>
					<td>'<'</td>
					<td>type of magic tags.  Options are '&lt;' or '['
					</td>
				</tr>
				<tr>
					<td>name</td>
					<td>the element ID or url </td>
					<td>an optional name that is used for caching.
					</td>
				</tr>
				<tr>
					<td>cache</td>
					<td>true in production mode, false in other modes</td>
					<td>true to cache template.
					</td>
				</tr>
				
			</tbody></table>
 */
MVC.View = function( options ){
    this.set_options(options);
	if(options.precompiled){
		this.template = {};
		this.template.process = options.precompiled;
		MVC.View.update(this.name, this);
		return;
	}
	if(options.url || options.absolute_url){
        options.url = MVC.View.get_absolute_path(options.url);
		var template = MVC.View.get(options.url, this.cache);
		if (template) return template;
	    if (template == MVC.View.INVALID_PATH) return null;
        this.text = include.request(options.url+(this.cache || window._rhino ? '' : '?'+Math.random() ));
		
		if(this.text == null){
			throw( {type: 'JMVC', message: 'There is no template at '+url}  );
		}
		this.name = options.url;
	}else if(options.hasOwnProperty('element'))
	{
        if(typeof options.element == 'string'){
			var name = options.element;
			options.element = MVC.$E(  options.element );
			if(options.element == null) throw name+'does not exist!';
		}
		if(options.element.value){
			this.text = options.element.value;
		}else{
			this.text = options.element.innerHTML;
		}
		this.name = options.element.id;
		this.type = '[';
	}
	var template = new MVC.View.Compiler(this.text, this.type);

	template.compile(options);

	
	MVC.View.update(this.name, this);
	this.template = template;
};
/*@Prototype*/
MVC.View.prototype = {
	/**
	 * Renders an object with extra view helpers attached to the view.
	 * @param {Object} object data to be rendered
	 * @param {Object} extra_helpers an object with additonal view helpers
	 * @return {String} returns the result of the string
	 */
    render : function(object, extra_helpers){
		object = object || {};
		var v = new MVC.View.Helpers(object);
        MVC.Object.extend(v, extra_helpers || {} );
		return this.template.process.call(object, object,v);
	},
	out : function(){
		return this.template.out;
	},
    /**
     * Sets options on this view to be rendered with.
     * @param {Object} options
     */
	set_options : function(options){
		this.type = options.type != null ? options.type : MVC.View.type;
		this.cache = options.cache != null ? options.cache : MVC.View.cache;
		this.text = options.text != null ? options.text : null;
		this.name = options.name != null ? options.name : null;
	},
	// called without options, returns a function that takes the object
	// called with options being a string, uses that as a url
	// called with options as an object
    /**
     * Updates an element's innerHTML with the rendered view.
     * @param {HTMLElement/String} element or id of the element to update
     * @param {null/String/Object} options is one of the following
     * <table class="options">
     *     <tbody>
     *         <tr><th>Type</th><th>Result</th></tr>
     *         <tr>null<td><td>returns a function that takes an object and renders with it to the view</td>
     *         <tr>string<td><td>uses the string as a url to perform a get request for JSON data.</td>
     *         <tr>object<td><td>uses the object to render</td>
     *     </tbody></table>
     *         
     * @return {null/Function}
     */
	update : function(element, options){
        if(typeof element == 'string'){
			element = MVC.$E(element);
		}
		if(options == null){
			_template = this;
			return function(object){
				MVC.View.prototype.update.call(_template, element, object);
			};
		}
		if(typeof options == 'string'){
			params = {};
			params.url = options;
			_template = this;
			params.onComplete = function(request){
				var object = eval( "("+ request.responseText+")" );
				MVC.View.prototype.update.call(_template, element, object);
			};
            if(!MVC.Ajax) alert('You must include the Ajax plugin to use this feature');
			new MVC.Ajax(params.url, params);
		}else
		{
			element.innerHTML = this.render(options);
		}
	}
};





/*@Static*/
MVC.View.Scanner = function(source, left, right) {
	this.left_delimiter = 	left +'%';	//<%
	this.right_delimiter = 	'%'+right;	//>
	this.double_left = 		left+'%%';
	this.double_right = 	'%%'+right;
	this.left_equal = 		left+'%=';
	this.left_comment = 	left+'%#';
	if(left=='[')
		this.SplitRegexp = /(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/;
	else
		this.SplitRegexp = new RegExp('('+this.double_left+')|(%%'+this.double_right+')|('+this.left_equal+')|('+this.left_comment+')|('+this.left_delimiter+')|('+this.right_delimiter+'\n)|('+this.right_delimiter+')|(\n)') ;
	
	this.source = source;
	this.stag = null;
	this.lines = 0;
};

MVC.View.Scanner.to_text = function(input){
	if(input == null || input === undefined)
        return '';
    if(input instanceof Date)
		return input.toDateString();
	if(input.toString) 
        return input.toString();
	return '';
};

MVC.View.Scanner.prototype = {
  scan: function(block) {
     scanline = this.scanline;
	 regex = this.SplitRegexp;
	 if (! this.source == '')
	 {
	 	 var source_split = MVC.String.rsplit(this.source, /\n/);
	 	 for(var i=0; i<source_split.length; i++) {
		 	 var item = source_split[i];
			 this.scanline(item, regex, block);
		 }
	 }
  },
  scanline: function(line, regex, block) {
	 this.lines++;
	 var line_split = MVC.String.rsplit(line, regex);
 	 for(var i=0; i<line_split.length; i++) {
	   var token = line_split[i];
       if (token != null) {
		   	try{
	         	block(token, this);
		 	}catch(e){
				throw {type: 'MVC.View.Scanner', line: this.lines};
			}
       }
	 }
  }
};


MVC.View.Buffer = function(pre_cmd, post_cmd) {
	this.line = new Array();
	this.script = "";
	this.pre_cmd = pre_cmd;
	this.post_cmd = post_cmd;
	for (var i=0; i<this.pre_cmd.length; i++)
	{
		this.push(pre_cmd[i]);
	}
};
MVC.View.Buffer.prototype = {
	
  push: function(cmd) {
	this.line.push(cmd);
  },

  cr: function() {
	this.script = this.script + this.line.join('; ');
	this.line = new Array();
	this.script = this.script + "\n";
  },

  close: function() {
	if (this.line.length > 0)
	{
		for (var i=0; i<this.post_cmd.length; i++)
		{
			this.push(pre_cmd[i]);
		}
		this.script = this.script + this.line.join('; ');
		line = null;
	}
  }
 	
};


MVC.View.Compiler = function(source, left) {
    this.pre_cmd = ['var ___ViewO = "";'];
	this.post_cmd = new Array();
	this.source = ' ';	
	if (source != null)
	{
		if (typeof source == 'string')
		{
		    source = source.replace(/\r\n/g, "\n");
            source = source.replace(/\r/g,   "\n");
			this.source = source;
		}else if (source.innerHTML){
			this.source = source.innerHTML;
		} 
		if (typeof this.source != 'string'){
			this.source = "";
		}
	}
	left = left || '<';
	var right = '>';
	switch(left) {
		case '[':
			right = ']';
			break;
		case '<':
			break;
		default:
			throw left+' is not a supported deliminator';
			break;
	}
	this.scanner = new MVC.View.Scanner(this.source, left, right);
	this.out = '';
};
MVC.View.Compiler.prototype = {
  compile: function(options) {
  	options = options || {};
	this.out = '';
	var put_cmd = "___ViewO += ";
	var insert_cmd = put_cmd;
	var buff = new MVC.View.Buffer(this.pre_cmd, this.post_cmd);		
	var content = '';
	var clean = function(content)
	{
	    content = content.replace(/\\/g, '\\\\');
        content = content.replace(/\n/g, '\\n');
        content = content.replace(/"/g,  '\\"'); //' Fixes Emacs syntax highlighting
        return content;
	};
	this.scanner.scan(function(token, scanner) {
		if (scanner.stag == null)
		{
			switch(token) {
				case '\n':
					content = content + "\n";
					buff.push(put_cmd + '"' + clean(content) + '";');
					buff.cr();
					content = '';
					break;
				case scanner.left_delimiter:
				case scanner.left_equal:
				case scanner.left_comment:
					scanner.stag = token;
					if (content.length > 0)
					{
						buff.push(put_cmd + '"' + clean(content) + '"');
					}
					content = '';
					break;
				case scanner.double_left:
					content = content + scanner.left_delimiter;
					break;
				default:
					content = content + token;
					break;
			}
		}
		else {
			switch(token) {
				case scanner.right_delimiter:
					switch(scanner.stag) {
						case scanner.left_delimiter:
							if (content[content.length - 1] == '\n')
							{
								content = MVC.String.chop(content);
								buff.push(content);
								buff.cr();
							}
							else {
								buff.push(content);
							}
							break;
						case scanner.left_equal:
							buff.push(insert_cmd + "(MVC.View.Scanner.to_text(" + content + "))");
							break;
					}
					scanner.stag = null;
					content = '';
					break;
				case scanner.double_right:
					content = content + scanner.right_delimiter;
					break;
				default:
					content = content + token;
					break;
			}
		}
	});
	if (content.length > 0)
	{
		// Chould be content.dump in Ruby
		buff.push(put_cmd + '"' + clean(content) + '"');
	}
	buff.close();
	this.out = buff.script + ";";
	var to_be_evaled = 'this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {'+this.out+" return ___ViewO;}}}catch(e){e.lineNumber=null;throw e;}};";
	
	try{
		eval(to_be_evaled);
	}catch(e){
		if(typeof JSLINT != 'undefined'){
			JSLINT(this.out);
			for(var i = 0; i < JSLINT.errors.length; i++){
				var error = JSLINT.errors[i];
				if(error.reason != "Unnecessary semicolon."){
					error.line++;
					var e = new Error();
					e.lineNumber = error.line;
					e.message = error.reason;
					if(options.url)
						e.fileName = options.url;
					throw e;
				}
			}
		}else{
			throw e;
		}
	}
  }
};

MVC.View.get_absolute_path = function(path){
	if(path.match(/^\//))
		var is_absolute = true;
	return (is_absolute? path: MVC.root.join(path+ (path.match(/\.ejs/) ? '' : '.ejs' )) );
}

//type, cache, folder
/**
 * Sets default options for all views
 * @param {Object} options Set view with the following options
 * <table class="options">
				<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
				<tr>
					<td>type</td>
					<td>'<'</td>
					<td>type of magic tags.  Options are '&lt;' or '['
					</td>
				</tr>
				<tr>
					<td>cache</td>
					<td>true in production mode, false in other modes</td>
					<td>true to cache template.
					</td>
				</tr>
	</tbody></table>
 * 
 */
MVC.View.config = function(options){
	MVC.View.cache = options.cache != null ? options.cache : MVC.View.cache;
	MVC.View.type = options.type != null ? options.type : MVC.View.type;
	var templates_directory = {}; //nice and private container
	
	MVC.View.get = function(path, cache){
		path = MVC.View.get_absolute_path(path);
		if(cache == false) return null;
		if(templates_directory[path]) return templates_directory[path];
  		return null;
	};
	
	MVC.View.update = function(path, template) { 
		path = MVC.View.get_absolute_path(path);
		if(path == null) return;
		templates_directory[path] = template ;
	};
	
	MVC.View.INVALID_PATH =  -1;
};
MVC.View.config( {cache: include.get_env() == 'production', type: '<' } );

MVC.View.PreCompiledFunction = function(name, f){
	new MVC.View({name: name, precompiled: f});
};

/**
 * @constructor
 * By adding functions to MVC.View.Helpers.prototype, those functions will be available in the 
 * views.
 * @init Creates a view helper.  This function is called internally.  You should never call it.
 * @param {Object} data The data passed to the view.  Helpers have access to it through this.data
 */
MVC.View.Helpers = function(data){
	this.data = data;
};
/*@prototype*/
MVC.View.Helpers.prototype = {
    /**
     * Renders a new view.  If data is passed in, uses that to render the view.
     * @param {Object} options standard options passed to a new view.
     * @param {optional:Object} data
     * @return {String}
     */
	partial: function(options, data){
		if(!data) data = this.data;
		return new MVC.View(options).render(data);
	},
    /**
     * For a given value, tries to create a human representation.
     * @param {Object} input the value being converted.
     * @param {Object} null_text what text should be present if input == null or undefined, defaults to ''
     * @return {String} 
     */
	to_text: function(input, null_text) {
	    if(input == null || input === undefined) return null_text || '';
	    if(input instanceof Date) return input.toDateString();
		if(input.toString) return input.toString().replace(/\n/g, '<br />').replace(/''/g, "'");
		return '';
	}
};



MVC.Included.views = [];
include.view = function(path){
	MVC.Included.views.push(path.replace(/\.ejs/,''));
	if(include.get_env() == 'development'){
		new MVC.View({url: path});
	}else if(include.get_env() == 'compress'){
		var oldp = include.get_path();
        include.set_path(MVC.root.path);
        include({path: path, process: MVC.View.process_include, ignore: true});
		include.set_path(oldp);
		new MVC.View({url: path});
	}else{
		//production, do nothing!
	}
};

include.views = function(){
	for(var i=0; i< arguments.length; i++){
		include.view(arguments[i]+'.ejs');
	}
};

MVC.View.process_include = function(script){
    var view = new MVC.View({text: script.text});
	return 'MVC.View.PreCompiledFunction("'+script.original_path+
				'", function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {'+view.out()+" return ___ViewO;}}}catch(e){e.lineNumber=null;throw e;}})";
};

if(!MVC._no_conflict){
	View = MVC.View;
}


/**
 * @add class MVC.String Static
 */
MVC.Native.extend('String', {
    /**
     * Can split a string nicely cross browser.
     * @plugin view
     * @param {Object} item
     * @param {Object} regex
     */
    rsplit : function(string, regex) {
    	var result = regex.exec(string);
    	var retArr = new Array();
    	while (result != null)
    	{
    		var first_idx = result.index;
    		var last_idx = regex.lastIndex;
    		if ((first_idx) != 0)
    		{
    			var first_bit = string.substring(0,first_idx);
    			retArr.push(string.substring(0,first_idx));
    			string = string.slice(first_idx);
    		}		
    		retArr.push(result[0]);
    		string = string.slice(result[0].length);
    		result = regex.exec(string);	
    	}
    	if (! string == '')
    	{
    		retArr.push(string);
    	}
    	return retArr;
    },
    /**
     * Removes the last character from a string.
     * @plugin view
     * @param {Object} string
     */
    chop: function(string){
        return this.substr(0, this.length - 1);
    }
})
