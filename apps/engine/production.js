include.set_path('../../apps');
include.resources();
include.plugins('core');
include.engines('modalmvc');
include(function(){ //runs after prior includes are loaded
  include.models();
  include.controllers();
  include.views();
});;
include.set_path('../../jmvc/plugins/core');

if(typeof Prototype == 'undefined') {
	include({path: '../lang/standard_helpers.js', shrink_variables: false},
			"../lang/inflector/inflector",
			"../dom/event/standard",
			"../io/ajax/ajax",
			"../lang/class/setup");
	MVC.Included.plugins.push('lang','lang/inflector','io/ajax','dom/event','lang/class');
}else{
	MVC.Event = Event;
	include({path: '../lang/prototype_helpers.js', shrink_variables: false},
			"../lang/inflector/inflector",
			"../io/ajax/prototype_ajax");
	MVC.Included.plugins.push('lang','lang/inflector','io/ajax');
}

if(MVC.Console)
	include("../io/ajax/debug")

MVC.Included.plugins.push('view','controller','controller/view');

include('../view/view', 
		'../controller/controller',
		'../controller/delegator',
		'../controller/view/controller_view');

MVC.Included.plugins.push('view','controller','controller/view');
	
    
include.plugins('dom/element', 'controller/scaffold','model/view_helper','view/helpers')
    
if(include.get_env() == 'development')	include('../view/fulljslint');


;
include.set_path('../../jmvc/plugins/lang');
// Several of the methods in this plugin use code adapated from Prototype
//  Prototype JavaScript framework, version 1.6.0.1
//  (c) 2005-2007 Sam Stephenson

MVC.String = {};
MVC.String.strip = function(string){
	return string.replace(/^\s+/, '').replace(/\s+$/, '');
};


MVC.Function = {};
MVC.Function.params = function(func){
	var ps = func.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",");
	if( ps.length == 1 && !ps[0]) return [];
	for(var i = 0; i < ps.length; i++) ps[i] = MVC.String.strip(ps[i]);
	return ps;
};


MVC.Native ={};
MVC.Native.extend = function(class_name, source){
	if(!MVC[class_name]) MVC[class_name] = {};
	var dest = MVC[class_name];
	for (var property in source){
		dest[property] = source[property];
		if(!MVC._no_conflict){
			window[class_name][property] = source[property];
			if(typeof source[property] == 'function'){
				var names = MVC.Function.params(source[property]);
    			if( names.length == 0) continue;
				var first_arg = names[0];
				if( first_arg.match(class_name.substr(0,1).toLowerCase()  ) || (first_arg == 'func' && class_name == 'Function' )  ){
					MVC.Native.set_prototype(class_name, property, source[property]);
				}
			}
		}
	}
};
MVC.Native.set_prototype = function(class_name, property_name, func){
	if(!func) func = MVC[class_name][property_name];
    window[class_name].prototype[property_name] = function(){
		var args = [this];
		for (var i = 0, length = arguments.length; i < length; i++) args.push(arguments[i]);
		return func.apply(this,args  );
	};
};

//Object helpers
MVC.Object = {};
MVC.Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};
//these are really only for forms
MVC.Object.to_query_string = function(object,name){
	if(typeof object != 'object') return object;
	return MVC.Object.to_query_string.worker(object,name).join('&');
};
MVC.Object.to_query_string.worker = function(obj,name){
	var parts2 = [];
	for(var thing in obj){
		if(obj.hasOwnProperty(thing)) {
			var value = obj[thing];
            if(value && value.constructor === Date){
                
                value =  value.getUTCFullYear()+'-'+
                    MVC.Number.to_padded_string(value.getUTCMonth() + 1,2) + '-' +
                    MVC.Number.to_padded_string(value.getUTCDate(),2) + ' ' +
                    MVC.Number.to_padded_string(value.getUTCHours(),2) + ':' +
                    MVC.Number.to_padded_string(value.getUTCMinutes(),2) + ':' +
                    MVC.Number.to_padded_string(value.getUTCSeconds(),2);
            }
			if(typeof value != 'object'){
				var nice_val = encodeURIComponent(value.toString());
				var newer_name = encodeURIComponent(name ? name+'['+thing+']' : thing) ;
				parts2.push( newer_name+'='+nice_val )  ;
			}else{
				parts2 = parts2.concat( MVC.Object.to_query_string.worker(value,  name ? name+'['+thing+']' : thing ))
			}
		}
	}
	return parts2;
};

/* 
 * @class MVC.String
 * When not in no-conflict mode, JMVC adds the following helpers to string
 */
MVC.Native.extend('String', 
/* @Static*/
{
    /*
     * Capitalizes a string
     * @param {String} string the string to be lowercased.
     * @return {String} a string with the first character capitalized, and everything else lowercased
     */
	capitalize : function(s) {
		return s.charAt(0).toUpperCase()+s.substr(1).toLowerCase();
	},
    /**
     * Returns if a string has another string inside it.
     * @param {String} string String that is being scanned
     * @param {String} pattern String that we are looking for
     * @return {Boolean} true if the string has pattern, false if otherwise
     */
	include : function(s, pattern){
		return s.indexOf(pattern) > -1;
	},
    /**
     * Returns if string ends with another string
     * @param {String} string String that is being scanned
     * @param {String} pattern What the string might end with
     * @return {Boolean} true if the string ends wtih pattern, false if otherwise
     */
	ends_with : function(s, pattern) {
	    var d = s.length - pattern.length;
	    return d >= 0 && s.lastIndexOf(pattern) === d;
	},
    /**
     * Capitalizes a string from something undercored. Examples:
     * <pre>
     *     MVC.String.camelize("one_two") -> "oneTwo"
     *     "three-four".camelize() -> threeFour</pre>
     * @param {String} string
     * @return {String} a the camelized string
     */
	camelize: function(s){
		var parts = s.split(/_|-/);
		for(var i = 1; i < parts.length; i++)
			parts[i] = MVC.String.capitalize(parts[i]);
		return parts.join('');
	},
    /**
     * Like camelize, but the first part is also capitalized
     * @param {Object} s
     * @return {String}
     */
	classize: function(s){
		var parts = s.split(/_|-/);
		for(var i = 0; i < parts.length; i++)
			parts[i] = MVC.String.capitalize(parts[i]);
		return parts.join('');
	},
    /*
     * @function strip
     * @param {String} string returns a string with leading and trailing whitespace removed.
     */
	strip : MVC.String.strip
});

//Date Helpers, probably should be moved into its own class

/* 
 * @class MVC.Array
 * When not in no-conflict mode, JMVC adds the following helpers to array
 */
MVC.Native.extend('Array',
/* @static*/
{ 
	/**
	 * Searchs an array for item.  Returns if item is in it.
	 * @param {Object} array
	 * @param {Object} item an item that is matched with ==
	 * @return {Boolean}
	 */
    include: function(a, item){
		for(var i=0; i< a.length; i++){
			if(a[i] == item) return true;
		}
		return false;
	},
    /**
     * Creates an array from another object.  Typically, this is used to give arguments array like properties.
     * @param {Object} iterable an array like object with a length property.
     * @return {Array}
     */
	from: function(iterable){
		 if (!iterable) return [];
		var results = [];
	    for (var i = 0, length = iterable.length; i < length; i++)
	      results.push(iterable[i]);
	    return results;
	}
});
/* 
 * @class MVC.Function
 * When not in no-conflict mode, JMVC adds the following helpers to function
 */
MVC.Native.extend('Function', 
/* @static*/
{
	/**
	 * Binds a function to another object.  The object the function is binding
	 * to is the second argument.
	 * @param {Object} func The function that is being bound.
	 * @return {Function} 
	 */
    bind: function(f) {
	  var args = MVC.Array.from(arguments);
	  args.shift();args.shift();
	  var __method = f, object = arguments[1];
	  return function() {
	    return __method.apply(object, args.concat(MVC.Array.from(arguments) )  );
	  }
	},
	params: MVC.Function.params
});
/* 
 * @class MVC.Number
 * When not in no-conflict mode, JMVC adds the following helpers to number
 */
MVC.Native.extend('Number', 
/* @static*/
{
    /**
     * Changes a number to a string, but includes preceeding zeros.
     * @param {Object} number the number to be converted
     * @param {Object} length the number of zeros
     * @param {optional:Object} radix the numeric base (defaults to base 10);
     * @return {String} 
     */
    to_padded_string: function(n, len, radix) {
        var string = n.toString(radix || 10);
        var ret = '', needed = len - string.length;
        
        for(var i = 0 ; i < needed; i++) 
            ret += '0';
        return ret + string;
    }
})

;
include.set_path('../../jmvc/plugins/lang/inflector');
// based on the Inflector class found on a DZone snippet contributed by Todd Sayre
// http://snippets.dzone.com/posts/show/3205

MVC.Inflector = {
  Inflections: {
    plural: [
    [/(quiz)$/i,               "$1zes"  ],
    [/^(ox)$/i,                "$1en"   ],
    [/([m|l])ouse$/i,          "$1ice"  ],
    [/(matr|vert|ind)ix|ex$/i, "$1ices" ],
    [/(x|ch|ss|sh)$/i,         "$1es"   ],
    [/([^aeiouy]|qu)y$/i,      "$1ies"  ],
    [/(hive)$/i,               "$1s"    ],
    [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
    [/sis$/i,                  "ses"    ],
    [/([ti])um$/i,             "$1a"    ],
    [/(buffal|tomat)o$/i,      "$1oes"  ],
    [/(bu)s$/i,                "$1ses"  ],
    [/(alias|status)$/i,       "$1es"   ],
    [/(octop|vir)us$/i,        "$1i"    ],
    [/(ax|test)is$/i,          "$1es"   ],
    [/s$/i,                    "s"      ],
    [/$/,                      "s"      ]
    ],
    singular: [
    [/(quiz)zes$/i,                                                    "$1"     ],
    [/(matr)ices$/i,                                                   "$1ix"   ],
    [/(vert|ind)ices$/i,                                               "$1ex"   ],
    [/^(ox)en/i,                                                       "$1"     ],
    [/(alias|status)es$/i,                                             "$1"     ],
    [/(octop|vir)i$/i,                                                 "$1us"   ],
    [/(cris|ax|test)es$/i,                                             "$1is"   ],
    [/(shoe)s$/i,                                                      "$1"     ],
    [/(o)es$/i,                                                        "$1"     ],
    [/(bus)es$/i,                                                      "$1"     ],
    [/([m|l])ice$/i,                                                   "$1ouse" ],
    [/(x|ch|ss|sh)es$/i,                                               "$1"     ],
    [/(m)ovies$/i,                                                     "$1ovie" ],
    [/(s)eries$/i,                                                     "$1eries"],
    [/([^aeiouy]|qu)ies$/i,                                            "$1y"    ],
    [/([lr])ves$/i,                                                    "$1f"    ],
    [/(tive)s$/i,                                                      "$1"     ],
    [/(hive)s$/i,                                                      "$1"     ],
    [/([^f])ves$/i,                                                    "$1fe"   ],
    [/(^analy)ses$/i,                                                  "$1sis"  ],
    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis"],
    [/([ti])a$/i,                                                      "$1um"   ],
    [/(n)ews$/i,                                                       "$1ews"  ],
    [/s$/i,                                                            ""       ]
    ],
    irregular: [
    ['move',   'moves'   ],
    ['sex',    'sexes'   ],
    ['child',  'children'],
    ['man',    'men'     ],
    ['foreman', 'foremen'],
    ['person', 'people'  ]
    ],
    uncountable: [
    "sheep",
    "fish",
    "series",
    "species",
    "money",
    "rice",
    "information",
    "equipment"
    ]
  },
  pluralize: function(word) {
    for (var i = 0; i < MVC.Inflector.Inflections.uncountable.length; i++) {
      var uncountable = MVC.Inflector.Inflections.uncountable[i];
      if (word.toLowerCase() == uncountable) {
        return uncountable;
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.irregular.length; i++) {
      var singular = MVC.Inflector.Inflections.irregular[i][0];
      var plural   = MVC.Inflector.Inflections.irregular[i][1];
      if ((word.toLowerCase() == singular) || (word == plural)) {
        return word.substring(0,1)+plural.substring(1);
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.plural.length; i++) {
      var regex          = MVC.Inflector.Inflections.plural[i][0];
      var replace_string = MVC.Inflector.Inflections.plural[i][1];
      if (regex.test(word)) {
        return word.replace(regex, replace_string);
      }
    }
  },
  singularize: function(word) {
    for (var i = 0; i < MVC.Inflector.Inflections.uncountable.length; i++) {
      var uncountable = MVC.Inflector.Inflections.uncountable[i];
      if (word.toLowerCase() == uncountable) {
        return uncountable;
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.irregular.length; i++) {
      var singular = MVC.Inflector.Inflections.irregular[i][0];
      var plural   = MVC.Inflector.Inflections.irregular[i][1];
      if ((word.toLowerCase() == singular) || (word.toLowerCase() == plural)) {
        return word.substring(0,1)+singular.substring(1);
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.singular.length; i++) {
      var regex          = MVC.Inflector.Inflections.singular[i][0];
      var replace_string = MVC.Inflector.Inflections.singular[i][1];
      if (regex.test(word)) {
        return word.replace(regex, replace_string);
      }
    }
  }
};
/**
 * @add class MVC.String Static
 */
MVC.Native.extend('String', {
  /**
   * Pluralizes a string
   * @plugin lang/inflector
   * @param {String} string string to be pluralized
   * @param {optional:Number} count
   * @param {optional:String} plural
   * @return {String}
   */
  pluralize: function(string, count, plural) {
    if (typeof count == 'undefined') {
      return MVC.Inflector.pluralize(string);
    } else {
      return count + ' ' + (1 == parseInt(count) ? string : plural || MVC.Inflector.pluralize(string));
    }
  },
  /**
   * Returns the singular version of a string
   * @plugin lang/inflector
   * @param {String} string the string to be singularized
   * @param {optional:Number} count
   * @return {String}
   */
  singularize: function(string, count) {
    if (typeof count == 'undefined') {
      return MVC.Inflector.singularize(string);
    } else {
      return count + " " + MVC.Inflector.singularize(string);
    }
  },
  /**
   * Returns if the string is singular
   * @plugin lang/inflector
   * @param {String} string
   * @return {Boolean}
   */
  is_singular: function(string){
    if(MVC.String.singularize(string) == null && string)
        return true;
    return false;
  }
});;
include.set_path('../../jmvc/plugins/dom/event');
// The code from the event plugin comes from 
// JavaScript: the Definitive Guide by David Flanagan
// Copyright 2006 O'Reilly Media

if(document.addEventListener) {
	MVC.Event = {
		observe: function(el, eventType, handler, capture) {
			if(capture == null) capture = false; 
			el.addEventListener(eventType, handler, capture);
    	},
		stop_observing : function(el, eventType, handler) {
	        if(capture == null) capture = false;
	        el.removeEventListener(eventType, handler, false);
	    }
	};
}else if(document.attachEvent) {
/*
 * @class MVC.Event
 * JavaScriptMVC's default Event functionality. This functionality should rarely be used. 
 * In place of registering event handlers directly, you are HIGHLY encouraged to 
 * create Controllers to handle event registration and callback in a very dry fassion. 
 * If you use other libraries like prototype or jQuery, their functionailty will be mapped to these functions.
 * 
 * 
 * <h3>Example</h3>

The following calls checkForm on the form element with id 'signinForm' being submitted.

<pre class='top'>Event.observe($('signinForm'), 'submit', checkForm);</pre>
 * 
 */
  MVC.Event=
 /* @Static*/ 
  {
	/**
	 * Registers an event handler on a DOM element.
	 * @param {Object} element
	 * @param {Object} eventType
	 * @param {optional:Object} handler defaults to false.
	 */
    observe: function(element, eventType, handler) {
        if (MVC.Event._find(element, eventType, handler) != -1) return;
        var wrappedHandler = function(e) {
            if (!e) e = window.event;
            
            
            
            var event = {
                _event: e, 
                type: e.type, 
                target: e.srcElement,  
                currentTarget: element, 
                relatedTarget: eventType == 'mouseover' ?e.fromElement : e.toElement, //mouseout gets toElement
                eventPhase: (e.srcElement==element)?2:3,
                clientX: e.clientX, clientY: e.clientY,
                screenX: e.screenX, screenY: e.screenY,
                altKey: e.altKey, ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey, charCode: e.keyCode,
                stopPropagation: function() {this._event.cancelBubble = true;},
                preventDefault: function() {this._event.returnValue = false;}
            };

            
            
            if (Function.prototype.call) 
                handler.call(element, event);
            else {
                element._currentHandler = handler;
                element._currentHandler(event);
                element._currentHandler = null;
            }
        };
        element.attachEvent("on" + eventType, wrappedHandler);
        var h = {
            element: element,
            eventType: eventType,
            handler: handler,
            wrappedHandler: wrappedHandler
        };
        var d = element.document || element, w = d.parentWindow, id = MVC.Event._uid(); 
        if (!w._allHandlers) w._allHandlers = {}; 
        w._allHandlers[id] = h;
        if (!element._handlers) element._handlers = [];
        element._handlers.push(id);
        if (!w._onunloadHandlerRegistered) {
            w._onunloadHandlerRegistered = true;
            w.attachEvent("onunload", MVC.Event._removeAllHandlers);
        }
    },
    /**
     * Unregisters an event handler.
     * @param {Object} element
     * @param {Object} eventType
     * @param {Object} handler
     */
	stop_observing: function(element, eventType, handler) {
        var i = MVC.Event._find(element, eventType, handler);
        if (i == -1) return; 
        var d = element.document || element, w = d.parentWindow, handlerId = element._handlers[i], h = w._allHandlers[handlerId];
        element.detachEvent("on" + eventType, h.wrappedHandler);
        element._handlers.splice(i, 1);
        delete w._allHandlers[handlerId];
    },
	_find: function(element, eventType, handler) {
        var handlers = element._handlers;
        if (!handlers) return -1;
        var d = element.document || element, w = d.parentWindow;
        for(var i = handlers.length-1; i >= 0; i--) {
            var h = w._allHandlers[handlers[i]];
            if(h.eventType == eventType && h.handler == handler)  return i;
        }
        return -1;
    },
	_removeAllHandlers: function() {
        var w = this;
        for(var id in w._allHandlers) {
            if(! w._allHandlers.hasOwnProperty(id) ) continue;
			var h = w._allHandlers[id]; 
            if(h.element) h.element.detachEvent("on" + h.eventType, h.wrappedHandler);
            delete w._allHandlers[id];
        }
    },
	_counter : 0,
	_uid : function() { return "h" + MVC.Event._counter++; }
  };
};

if(!MVC._no_conflict && typeof Event == 'undefined'){
	Event = MVC.Event;
};
include.set_path('../../jmvc/plugins/io/ajax');
// Modified version of Ajax.Request from prototype
//  Prototype JavaScript framework, version 1.6.0.1
//  (c) 2005-2007 Sam Stephenson
(function(){
	var factory = MVC.Ajax.factory;
	
    /**
     * @constructor
     * Ajax is used to perform Ajax requests. It mimics the Prototype library's Ajax functionality.
     * @init Initiates and processes an AJAX request.
     * @param {String} url the url where the request is directed
     * @param {Object} options a hash of optiosn with the following attributes:
     * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>asynchronous</td>
						<td>true</td>
						<td>Determines whether XMLHttpRequest is used asynchronously or not. 
						</td>
					</tr>
					<tr>
						<td>contentType</td>
						<td>'application/x-www-form-urlencoded'</td>
						<td>The Content-Type header for your request. 
						You might want to send XML instead of the regular URL-encoded format, 
						in which case you would have to change this.
						</td>
					</tr>
					<tr>
						<td>method</td>
						<td>'post'</td>
						<td>The HTTP method to use for the request. The other widespread possibility is 'get'.
						</td>
					</tr>
					<tr>
						<td>parameters</td>
						<td>''</td>
						<td>The parameters for the request, which will be encoded into the URL for a 'get' method, or into the request body for the other methods. This can be provided either as a URL-encoded string or as any Hash-compatible object (basically anything), with properties representing parameters.
						</td>
					</tr>
					<tr>
						<td>requestHeaders</td>
						<td>See text</td>
						<td>Request headers are passed as an object, with properties representing headers.
						</td>
					</tr>
					<tr>
						<td>cache</td>
						<td>true </td>
						<td>true to cache template.
						</td>
					</tr>
					
				</tbody></table>
		    <h4>Option callbacks</h4>
		    <p style="margin-bottom: 0px;">Callbacks are called at various points in the life-cycle of a request, and always feature the same list of arguments. 
		    They are passed to requesters right along with their other options.</p>
		    <table class="options">
					<tbody><tr><th>Callback</th><th>Description</th></tr>
					<tr>
						<td>onComplete</td>
						<td>Triggered at the very end of a request's life-cycle, 
						once the request completed, status-specific callbacks were called, 
						and possible automatic behaviors were processed.
						</td>
					</tr>
			</tbody></table>
     */
    MVC.Ajax = function(url,options){
		this.options = {
	      method:       'post',
	      asynchronous: true,
	      contentType:  'application/x-www-form-urlencoded',
	      encoding:     'UTF-8',
	      parameters:   ''
	    };
		this.url = url;
	    MVC.Object.extend(this.options, options || { });
		
		this.options.method = this.options.method.toLowerCase();
		
		if (!MVC.Array.include(['get', 'post'],this.options.method)) {
	      // simulate other verbs over post
	      if(this.options.parameters == ''){
		  	this.options.parameters = {_method : this.options.method};
		  }else if(typeof this.options.parameters == "string" || typeof this.options.parameters == "number")
            this.options.parameters = ""+this.options.parameters+"&_method="+this.options.method;
          else
		  	this.options.parameters['_method'] = this.options.method;
	      this.options.method = 'post';
	    }
	
		if (this.options.method == 'get' && this.options.parameters != '' ){
            this.url += (MVC.String.include(this.url,'?') ? '&' : '?') + MVC.Object.to_query_string(this.options.parameters);
            delete this.options.parameters;
        }
		//else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
		//   params += '&_=';
	    
		if(!this.options.parameters)
			var parameters = null;
		else if(options.json_string)
			var parameters = MVC.Object.to_json(this.options.parameters);
		else
			var parameters = MVC.Object.to_query_string(this.options.parameters)
		
		this.transport = MVC.Ajax.factory();
		
		if(this.options.asynchronous == false){
		   this.transport.open(this.options.method, this.url, this.options.asynchronous);
		   this.set_request_headers(options.headers);
		   try{this.transport.send(parameters);}
		   catch(e){return null;}
		   return this.transport;
		}else{
		   this.transport.onreadystatechange = MVC.Function.bind(function(){
				var state = MVC.Ajax.Events[this.transport.readyState];
				
				if(state == 'Complete'){
					if(!this.options.onSuccess) ; // do nothing
					else if(this.success()) this.options.onSuccess(this.transport);
					else if(this.options.onFailure) this.options.onFailure(this.transport);
				}
				if(this.options['on'+state]){
					this.options['on'+state](this.transport);
				}
			},this);
			
			this.transport.open(this.options.method, this.url, true);
		    this.set_request_headers(options.headers);
			
			this.transport.send(parameters);
		}
	};
	MVC.Ajax.factory = factory;
})();

MVC.Ajax.className = 'Ajax'
MVC.Ajax.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
/* @Prototype*/
MVC.Ajax.prototype = {
  
  /**
   * Returns true if the function returned succesfully.
   * @return {Boolean}
   */
  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },
  /**
   * This function is used by Ajax to set the transport's request headers if possible.
   * @param {Object} user_headers headers supplied by the user in options.headers
   * 
   */
  set_request_headers: function(user_headers) {
    var headers = {};//{'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'};

    if (this.options.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    for (var name in headers){
		if(headers.hasOwnProperty(name)){
			this.transport.setRequestHeader(name, headers[name]);
		}
	}
	
	if(user_headers) {
		for(var header in user_headers) 
			this.transport.setRequestHeader(header, user_headers[header]);
		}
	}
};

if(!MVC._no_conflict) Ajax = MVC.Ajax;;
include.set_path('../../jmvc/plugins/lang/class');
//MVC.Class 
// This is a modified version of John Resig's class
// It provides class level inheritence and callbacks.

(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  
  /**
   * @constructor MVC.Class
   * Class provides simple simulated inheritance in JavaScript. 
   * It is based off John Resig's  Simple JavaScript Inheritance  library.
   * @init Creating a new instance of an object that has extended MVC.Class 
        calls the init prototype function and returns a new instance of the class.
   * 
   */
  
  MVC.Class = function(){};
  // Create a new Class that inherits from the current class.
  /* @Static*/
  MVC.Class.
    /**
     * Extends a class with new static and prototype functions.
     * @param {optional:Object} className - the classes name (used for classes w/ introspection)
     * @param {optional:Object} klass - the new classes static/class functions
     * @param {Object} proto - the new classes prototype functions
     * @return {Class} returns the new class
     */
    extend = function(className, klass, proto) {
    if(typeof className != 'string'){
        proto = klass;
        klass = className;
        className = null;
    }
    if(!proto){
        proto = klass;
        klass = null;
    }
    var _super_class = this;
    var _super = this.prototype;
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    // Copy the properties over onto the new prototype
    for (var name in proto) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof proto[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(proto[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, proto[name]) :
        proto[name];
    }
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    // Populate our constructed prototype object
    Class.prototype = prototype;
    Class.prototype.Class = Class;
    // Enforce the constructor to be what we expect
    Class.constructor = Class;
    // And make this class extendable
    
    for(var name in this){
        if(this.hasOwnProperty(name) && name != 'prototype'){
            Class[name] = this[name];
        }
    }
    
    for (var name in klass) {
      Class[name] = typeof klass[name] == "function" &&
        typeof Class[name] == "function" && fnTest.test(klass[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super_class[name];
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
            return ret;
          };
        })(name, klass[name]) :
        klass[name];
	};
    Class.extend = arguments.callee;
    if(className) Class.className = className;
    /*
     * @function init
     * Called when a new Class is created
     * @param {Class} class the new class
     */
    if(Class.init) Class.init(Class);
    /*
     * @function extended
     * Called on the base class when extend
     */
    if(_super_class.extended) _super_class.extended(Class);
    /* @Prototype*/
    return Class;
    /* @function init
     * Called with the same arguments as new Class(arguments ...) when a new class is created.
     */
  };
})();

if(!MVC._no_conflict && typeof Class == 'undefined'){
	Class = MVC.Class;
};
include.set_path('../../jmvc/plugins/view');
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
        var url = options.absolute_url || options.url+ (options.url.match(/\.ejs/) ? '' : '.ejs' ) ;
        options.url = options.absolute_url || options.url;
		var template = MVC.View.get(options.url, this.cache);
		if (template) return template;
	    if (template == MVC.View.INVALID_PATH) return null;
        this.text = include.request(url+(this.cache || window._rhino ? '' : '?'+Math.random() ));
		
		if(this.text == null){
			print("Exception: "+'There is no template at '+url)
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
/* @Prototype*/
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





/* @Static*/
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
    this.pre_cmd = ['var ___ViewO = [];'];
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
	var put_cmd = "___ViewO.push(";
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
					buff.push(put_cmd + '"' + clean(content) + '");');
					buff.cr();
					content = '';
					break;
				case scanner.left_delimiter:
				case scanner.left_equal:
				case scanner.left_comment:
					scanner.stag = token;
					if (content.length > 0)
					{
						buff.push(put_cmd + '"' + clean(content) + '")');
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
							buff.push(insert_cmd + "(MVC.View.Scanner.to_text(" + content + ")))");
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
		buff.push(put_cmd + '"' + clean(content) + '")');
	}
	buff.close();
	this.out = buff.script + ";";
	var to_be_evaled = 'this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {'+this.out+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";
	
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
	MVC.View.templates_directory = templates_directory;
	MVC.View.get = function(path, cache){
		if(cache == false) return null;
		if(templates_directory[path]) return templates_directory[path];
  		return null;
	};
	
	MVC.View.update = function(path, template) { 
		if(path == null) return;
		templates_directory[path] = template ;
	};
	
	MVC.View.INVALID_PATH =  -1;
};
MVC.View.config( {cache: include.get_env() == 'production', type: '<' } );

MVC.View.PreCompiledFunction = function(name, f){
    
	new MVC.View({name: new MVC.File("../"+name).join_current(), precompiled: f});
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
/* @prototype*/
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
        //should convert path
        
		new MVC.View({url: new MVC.File("../"+path).join_current()});
	}else if(include.get_env() == 'compress'){
		//var oldp = include.get_path();
        //include.set_path(MVC.root.path);
        include({path: "../"+path, process: MVC.View.process_include, ignore: true});
		//include.set_path(oldp);
		new MVC.View({url: new MVC.File("../"+path).join_current()});
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
				'", function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {'+view.out()+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}})";
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
        return string.substr(0, string.length - 1);
    }
});
include.set_path('../../jmvc/plugins/controller');
// submitted by kangax
MVC.Object.is_number = function(o){
    return o &&(  typeof o == 'number' || ( typeof o == 'string' && !isNaN(o) ) );
};

/* Controllers respond to events such as mouseovers, clicks, and form submits. 
 * They do this by naming functions, 
 * also called actions, with combination css selector and event handlers.
 */
MVC.Controller = MVC.Class.extend(
/* @Static*/
{
    /*
     * Looks for controller actions and hooks them up to delegator
     */
    init: function(){
        if(!this.className) return;
        this.singularName =  MVC.String.singularize(this.className);
        if(!MVC.Controller.controllers[this.className]) MVC.Controller.controllers[this.className] = [];
        MVC.Controller.controllers[this.className].push(this);
        var val, act;
        this.actions = {};
        for(var action_name in this.prototype){
    		val = this.prototype[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        this.actions[action_name] =new act(action_name, val, this);
                    }
                }
            }
	    }
        this.modelName = MVC.String.classize(
            MVC.String.is_singular(this.className) ? this.className : MVC.String.singularize(this.className)
        );
        //load tests
        if(include.get_env() == 'test'){
            var path = MVC.root.join('test/functional/'+this.className+'_controller_test.js');
    		var exists = include.check_exists(path);
    		if(exists)
    			MVC.Console.log('Loading: "test/functional/'+this.className+'_controller_test.js"');
    		else {
    			MVC.Console.log('Test Controller not found at "test/functional/'+this.className+'_controller_test.js"');
    			return;
    		}
    		var p = include.get_path();
    		include.set_path(MVC.root.path);
    		include('test/functional/'+ this.className+'_controller_test.js');
    		include.set_path(p);
        }
        this._path =  include.get_path().match(/(.*?)\/controllers/)[1]+"/controllers";
    },
    add_kill_event: function(event){ //this should really be in event
		if(!event.kill){
			var killed = false;
			event.kill = function(){
				killed = true;
				if(!event) event = window.event;
			    try{
				    event.cancelBubble = true;
				    if (event.stopPropagation)  event.stopPropagation(); 
				    if (event.preventDefault)  event.preventDefault();
			    }catch(e){}
			};
			event.is_killed = function(){return killed;};
		}	
	},
    event_closure: function(controller_name, f_name, element){
		return function(event){
			MVC.Controller.add_kill_event(event);
			var params = new MVC.Controller.Params({event: event, element: element, action: f_name, controller: controller_name   });
			return MVC.Controller.dispatch(controller_name, f_name, params);
		};
	},
    dispatch_closure: function(controller_name, f_name){
        return function(params){
            MVC.Controller.add_kill_event(params.event);
            params.action = f_name;
            params.controller = controller_name;
			return MVC.Controller.dispatch(controller_name, f_name, 
                new MVC.Controller.Params(params)
            );
		};
    },
    publish_closure: function(controller_name, f_name){
        return function(params){
            params.action = f_name;
            params.controller = controller_name;
			return MVC.Controller.dispatch(controller_name, f_name, 
                new MVC.Controller.Params(params)
            );
		};
    },
    /**
     * Calls the Controller prototype function specified by controller and action_name with the given params.
     * @param {Controller/String} controller The controller class or its className (i.e. 'todos').
     * @param {String} action_name The name of the action to be called.
     * @param {Controller.Params} params The params the action will be called with.
     */
    dispatch: function(controller, action_name, params){
		var c_name = controller;
		if(typeof controller == 'string'){
            controller = MVC.Controller.controllers[c_name][0];
        }
		if(!controller) throw 'No controller named '+c_name+' was found for MVC.Controller.dispatch.';
		if(!action_name) action_name = 'index';
		
		if(typeof action_name == 'string'){
			if(!(action_name in controller.prototype) ) throw 'No action named '+action_name+' was found for '+c_name+'.';
		}else{ //action passed
			action_name = action_name.name;
		}
		var instance = new controller();
		instance.params = params;
		instance.action_name = action_name;
        instance.controller_name = controller.className;
		return MVC.Controller._dispatch_action(instance,action_name, params );
	},
	_dispatch_action: function(instance, action_name, params){
		return instance[action_name](params);
	},
    controllers : [],
    actions: [],
    publish: function(message, params){
        var subscribers = MVC.Controller.SubscribeAction.events[message];
        if(!subscribers) return;
        for(var i =0 ; i < subscribers.length; i++){
            subscribers[i](params);
        }
    }
},
/* @Prototype*/
{
    /*
     * Returns a function that when called, calls the action with parameters passed to the function. 
     * This is very useful for creating callbacks for Ajax functionality. 
     * The callback is called on the same controller instance that created the callback. 
     * This allows you to easily pass objects between request and response without resorting to closures. 
     * Example:
<pre><code>Controller('todos',{
   "a click" : function(params){ 
      this.element = params.element;
	  this.element.innerHTML = 'deleting ...';
	  new Ajax.Request('delete', {onComplete: <span class="magic">this.continue_to('deleted')</span>}
   },
   deleted : function(response){
      this.element.parentNode.removeChild(this.element);
   }
});</code></pre>
     * @param {String} action Name of prototype function you want called
     * @return {Function} function that when called, directs to another controller function
     */
    continue_to :function(action){
		if(!action) action = this.action.name+'ing';
		if(typeof this[action] != 'function'){ throw 'There is no action named '+action+'. ';}
		return MVC.Function.bind(function(){
			this.action_name = action;
			this[action].apply(this, arguments);
		}, this);
	},
    delay: function(delay, action_name){
		if(typeof this[action_name] != 'function'){ throw 'There is no action named '+actaction_nameion+'. ';}
		
        return setTimeout(MVC.Function.bind(function(){
			this.action_name = action_name;
			this[action_name].apply(this, arguments);
		}, this), delay );
    },
    dispatch_delay: function(delay, action_name, params){
        var controller_name = action_name.controller ? action_name.controller : this.Class.className;
        action_name = typeof action_name == 'string' ? action_name : action_name.action;
        return setTimeout(function(){
            MVC.Controller.dispatch(controller_name,action_name, params );
        }, delay );
    },
    publish: function(message, params){
        this.Class.publish(message,params);
    }
});



/*
 * Genaric base action.  This must provide a matches base function.
 */
MVC.Controller.Action = MVC.Class.extend(
{
    init: function(){
        if(this.matches) MVC.Controller.actions.push(this);
    }
},{
    init: function(action, f, controller){
        this.action = action;
        this.func = f;
        this.controller = controller;
    }
});
MVC.Controller.SubscribeAction = MVC.Controller.Action.extend(
/* @Static*/
{
    match: new RegExp("(.*?)\\s?(subscribe)$"),
    matches: function(action_name){
        return this.match.exec(action_name);
    },
    events: {}
},
/* @Prototype*/
{
    init: function(action, f, controller){
        this._super(action, f, controller);
        this.message();
        if(!this.Class.events[this.message_name]) this.Class.events[this.message_name] = [];
        var cb = this.controller.publish_closure(controller.className, action );
        this.Class.events[this.message_name].push(cb);
    },
    message: function(){
        this.parts = this.action.match(this.Class.match);
        this.message_name = this.parts[1];
    }
})
/*
 * Default EventDelegation based actions
 */
MVC.Controller.DelegateAction = MVC.Controller.Action.extend({
/* @Static*/
    match: new RegExp("(.*?)\\s?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|resize|scroll|select|submit|dblclick|focus|blur|load|unload)$"),
    /*
     * Matches change, click, contextmenu, dblclick, keydown, keyup, keypress, mousedown, mousemove, 
     * mouseout, mouseover, mouseup, reset, resize, scroll, select, submit, dblclick, 
     * focus, blur, load, unload
     * @return {Boolean} true if a prototype function name matches an action.
     */
    matches: function(action_name){
        return this.match.exec(action_name);
    }
},
/* @Prototype*/
{    
    init: function(action, f, controller){
        this._super(action, f, controller);
        this.css_and_event();
        
        var selector = this.selector();
        if(selector != null){
            new MVC.Delegator(selector, this.event_type, 
                this.controller.dispatch_closure(controller.className, action ) );
        }
    },
    /*
     * Splits the action name into its css and event parts.
     */
    css_and_event: function(){
        this.parts = this.action.match(this.Class.match);
        this.css = this.parts[1];
        this.event_type = this.parts[2];
    },
    /*
     * Deals with main controller specific delegation (blur and focus)
     */
    main_controller: function(){
	    if(!this.css && MVC.Array.include(['blur','focus'],this.event_type)){
            MVC.Event.observe(window, this.event_type, MVC.Controller.event_closure(this.controller, this.event_type, window) );
            return;
        }
        return this.css;
    },
    /*
     * Handles a plural controller name
     * @return {String} the css with the controller name included
     */
    plural_selector : function(){
		if(this.css == "#" || this.css.substring(0,2) == "# "){
			var newer_action_name = this.css.substring(2,this.css.length);
            return '#'+this.controller.className + (newer_action_name ?  ' '+newer_action_name : '') ;
		}else{
			return '.'+MVC.String.singularize(this.controller.className)+(this.css? ' '+this.css : '' );
		}
	},
    /*
     * Handles a singular controller name
     * @return {String} the css with the controller name included
     */
    singular_selector : function(){
        return '#'+this.controller.className+(this.css? ' '+this.css : '' );
    },
    /*
     * Gets the full css selector for this action
     * @return {String/null} returns a string css if Delegator should be used, null if otherwise.
     */
    selector : function(){
        if(MVC.Array.include(['load','unload','resize','scroll'],this.event_type)){
            MVC.Event.observe(window, this.event_type, MVC.Controller.event_closure(this.controller, this.event_type, window) );
            return;
        }
        
        
        if(this.controller.className == 'main') 
            this.css_selector = this.main_controller();
        else
            this.css_selector = MVC.String.is_singular(this.controller.className) ? 
                this.singular_selector() : this.plural_selector();
        return this.css_selector;
    }
});

/* @Constructor
 * Instances of Controller.Params are passed to Event based actions.
 * 
 * <h3>Example</h3>
 * <pre><code>MVC.Controller.extend('todos', {
   mouseover : function(params){ 
      <span class="magic">params</span>.element.style.backgroundColor = 'Red';
   },
   mouseout : function(params){
      <span class="magic">params</span>.element.style.backgroundColor = '';
      <span class="magic">params</span>.event.stop();
   },
   "img click" : function(params){
   	  <span class="magic">params</span>.class_element().parentNode.removeSibiling(params.class_element());
   }
})</code></pre>
 * @init Creates a new Controller.Params object.
 * @param {Object} params An object you want to pass to a controller
 */
MVC.Controller.Params = function(params){
	for(var thing in params){
		if( params.hasOwnProperty(thing) ) this[thing] = params[thing];
	}
};
/* @Prototype*/
MVC.Controller.Params.prototype = {
	/*
	 * Returns data in a hash for a form.
	 * @return {Object} Nested form data.
	 */
    form_params : function(){
		var data = {};
		if(this.element.nodeName.toLowerCase() != 'form') return data;
		var els = this.element.elements, uri_params = [];
		for(var i=0; i < els.length; i++){
			var el = els[i];
			if(el.type.toLowerCase()=='submit') continue;
			var key = el.name || el.id, key_components = key.match(/(\w+)/g), value;
            if(!key) continue;     
			/* Check for checkbox and radio buttons */
			switch(el.type.toLowerCase()) {
				case 'checkbox':
				case 'radio':
					value = !!el.checked;
					break;
				default:
					value = el.value;
					break;
			}
			//if( MVC.Object.is_number(value) ) value = parseFloat(value);
			if( key_components.length > 1 ) {
				var last = key_components.length - 1;
				var nested_key = key_components[0].toString();
				if(! data[nested_key] ) data[nested_key] = {};
				var nested_hash = data[nested_key];
				for(var k = 1; k < last; k++){
					nested_key = key_components[k];
					if( ! nested_hash[nested_key] ) nested_hash[nested_key] ={};
					nested_hash = nested_hash[nested_key];
				}
				nested_hash[ key_components[last] ] = value;
			} else {
		        if (key in data) {
		        	if (typeof data[key] == 'string' ) data[key] = [data[key]];
		         	data[key].push(value);
		        }
		        else data[key] = value;
			}
		}
		return data;
	},
    /*
     * Returns the class element for the element selected
     * @return {HTMLElement} the element that shares the controller's id or classname
     */
	class_element : function(){
		var start = this.element;
		var className = this._className();
		while(start && start.className.indexOf(className) == -1 ){
			start = start.parentNode;
			if(start == document) return null;
		}
		return start;
	},
    /*
     * Returns if the event happened directly on the element in the params.
     * @return {Boolean} true if the event's target is the element, false if otherwise.
     */
	is_event_on_element : function(){ return this.event.target == this.element; },
	_className : function(){
		controller = this.controller;
		var className = MVC.String.is_singular(controller) ? controller : MVC.String.singularize(controller);
		return className;
	}
};

if(!MVC._no_conflict && typeof Controller == 'undefined'){
	Controller = MVC.Controller
};
include.set_path('../../jmvc/plugins/controller');
/**
 * @constructor
 * Attaches listeners for delegated events.
 * @init Creates a new delegator listener
 * @param {String} selector a css selector
 * @param {String} event a dom event
 * @param {Function} f a function to call
 */
MVC.Delegator = function(selector, event, f){
    this._event = event;
    this._selector = selector;
    this._func = f;
    if(event == 'contextmenu' && MVC.Browser.Opera) return this.context_for_opera();
    if(event == 'submit' && MVC.Browser.IE) return this.submit_for_ie();
	if(event == 'change' && MVC.Browser.IE) return this.change_for_ie();
	if(event == 'change' && MVC.Browser.WebKit) return this.change_for_webkit();
	
    this.add_to_delegator();
};

MVC.Object.extend(MVC.Delegator,
/* @Static*/
{
    /**
     * Returns an array of objects that represent the path of the node to documentElement.  Each item in the array
     * has a tag, className, id, and element attribute.
     * @param {Object} el element in the dom that is nested under the documentElement
     * @return {Array} representation of the path between the element and the DocumentElement
     */
    node_path: function(el){
		var body = document.documentElement,parents = [],iterator =el;
		while(iterator != body){
			parents.unshift({tag: iterator.nodeName, className: iterator.className, id: iterator.id, element: iterator});
			iterator = iterator.parentNode;
			if(iterator == null) return [];
		}
		parents.push(body);
		return parents;
	},
    /**
     * Goes through the delegated events for the given event type (e.g. Click).  Orders the matches
     * by how nested they are in the dom.  Adds the kill function on the event, then dispatches each
     * event.  If kill is called, it will stop dispatching other events.
     * @param {Event} event the DOM event returned by a normal event handler.
     */
	dispatch_event: function(event){
		var target = event.target, matched = false, ret_value = true,matches = [];
		var delegation_events = MVC.Delegator.events[event.type];
        var parents_path = MVC.Delegator.node_path(target);
        
		for(var i =0; i < delegation_events.length;  i++){
			var delegation_event = delegation_events[i];
			var match_result = delegation_event.match(target, event, parents_path);
			if(match_result){
				matches.push(match_result);
			}
		}

		if(matches.length == 0) return true;
		MVC.Controller.add_kill_event(event);
		matches.sort(MVC.Delegator.sort_by_order);
        var match;
		for(var m = 0; m < matches.length; m++){
            match = matches[m];
            ret_value = match.delegation_event._func( {event: event, element: match.node} ) && ret_value;
			if(event.is_killed()) return false;
		}
	},
    /**
     * Used for sorting events on an object
     * @param {Object} a
     * @param {Object} b
     * @return {Number} -1,0,1 depending on how a and b should be sorted.
     */
    sort_by_order: function(a,b){
    	if(a.order < b.order) return 1;
    	if(b.order < a.order) return -1;
    	var ae = a._event, be = b._event;
    	if(ae == 'click' &&  be == 'change') return 1;
    	if(be == 'click' &&  ae == 'change') return -1;
    	return 0;
    },
    /**
     * Stores all delegated events
     */
    events: {}
})

/* @Prototype*/
MVC.Delegator.prototype = {
    /*
     * returns the event that should actually be used.  In practice, this is just used to switch focus/blur
     * to activate/deactivate for ie.
     * @return {String} the adjusted event name.
     */
    event: function(){
    	if(MVC.Browser.IE){
            if(this._event == 'focus')
    			return 'activate';
    		else if(this._event == 'blur')
    			return 'deactivate';
    	}
    	return this._event;
    },
    /*
     * Returns if capture should be used (blur and focus)
     * @return {Boolean} true for focus / blur, false if otherwise
     */
    capture: function(){
        return MVC.Array.include(['focus','blur'],this._event);
    },
    /**
     * If there are no special cases, this is called to add to the delegator.
     * @param {String} selector - css selector
     * @param {String} event - event selector
     * @param {Function} func - a function that will be called
     */
    add_to_delegator: function(selector, event, func){
        var s = selector || this._selector;
        var e = event || this.event();
        var f = func || this._func;
        
        if(!MVC.Delegator.events[e]){
            MVC.Event.observe(document.documentElement, e, MVC.Delegator.dispatch_event, this.capture() );
            MVC.Delegator.events[e] = [];
		}
		MVC.Delegator.events[e].push(this);
    },
    /*
     * Handles the submit case for IE.  It checks if a keypress return happens in an
     * input area or a submit button is clicked.
     */
    submit_for_ie : function(){
		this.add_to_delegator(null, 'click');
        this.add_to_delegator(null, 'keypress');
        
        this.filters= {
			click : function(el, event, parents){
				//check you are in a form
                if(el.nodeName.toUpperCase() == 'INPUT' && el.type.toLowerCase() == 'submit'){
                    for(var e = 0; e< parents.length ; e++) if(parents[e].tag == 'FORM') return true;
                }
                return false;
                
			},
			keypress : function(el, event, parents){
				if(el.nodeName.toUpperCase()!= 'INPUT') return false;
				var res = typeof Prototype != 'undefined' ? (event.keyCode == 13) : (event.charCode == 13)
                if(res){
                    for(var e = 0; e< parents.length ; e++) if(parents[e].tag == 'FORM') return true;
                }
                return false;
			}
		};
	},
    /*
     * Handles change events for IE.
     */
	change_for_ie : function(){
		this.add_to_delegator(null, 'click');
        this.end_filters= {
			click : function(el, event){
				if(typeof el.selectedIndex == 'undefined' || el.nodeName.toUpperCase() != 'SELECT') return false; //sometimes it won't exist yet
				var old = el.getAttribute('_old_value');
				if( old == null){
					el.setAttribute('_old_value', el.selectedIndex);
					return false;
				}else{
					if(old == el.selectedIndex.toString()) return false;
					el.setAttribute('_old_value', null);
					return true;
				}
			}
		};
	},
    /*
     * Handles a change event for Safari.
     */
	change_for_webkit : function(){
		this.add_to_delegator(null, 'change');
		this.end_filters= {
			change : function(el, event){
				if(typeof el.value == 'undefined') return false; //sometimes it won't exist yet
				var old = el.getAttribute('_old_value');
				el.setAttribute('_old_value', el.value);
				return el.value != old;
			}
		};
	},
    /**
     * Handles a right click for Opera.  It looks for clicks with shiftkey pressed.
     */
    context_for_opera : function(){
        this.add_to_delegator(null, 'click');
        this.end_filters= {
			click : function(el, event){
				return event.shiftKey;
			}
        }
    },
    regexp_patterns:  {tag :    		/^\s*(\*|[\w\-]+)(\b|$)?/,
        				id :            /^#([\w\-\*]+)(\b|$)/,
    					className :     /^\.([\w\-\*]+)(\b|$)/},
    /*
     * returns and caches the select order for the css patern.
     * @retun {Array} array of objects that are used to match with the node_path
     */
    selector_order : function(){
		if(this.order) return this.order;
		var selector_parts = this._selector.split(/\s+/);
		var patterns = this.regexp_patterns;
		var order = [];
		for(var i =0; i< selector_parts.length; i++){
			var v = {}, r, p =selector_parts[i];
			for(var attr in patterns){
				if( patterns.hasOwnProperty(attr) ){
					if( (r = p.match(patterns[attr]))  ) {
						if(attr == 'tag')
							v[attr] = r[1].toUpperCase();
						else
							v[attr] = r[1];
						p = p.replace(r[0],'');
					}
				}
			}
			order.push(v);
		}
		this.order = order;
		return this.order;
	},
    /**
     * Tests if an event matches an element.
     * @param {Object} el the element we are testing
     * @param {Object} event the event
     * @param {Object} parents an array of node order objects for the element
     * @return {Object} returns an object with node, order, and delegation_event attributes.
     */
    match: function(el, event, parents){
        if(this.filters && !this.filters[event.type](el, event, parents)) return null;
		//if(this.controller.className != 'main' &&  (el == document.documentElement || el==document.body) ) return false;
		var matching = 0;
		for(var n=0; n < parents.length; n++){
			var node = parents[n], match = this.selector_order()[matching], matched = true;
			for(var attr in match){
				if(!match.hasOwnProperty(attr) || attr == 'element') continue;
				if(match[attr] && attr == 'className'){
					if(! MVC.Array.include(node.className.split(' '),match[attr])) matched = false;
				}else if(match[attr] && node[attr] != match[attr]){
					matched = false;
				}
			}
			if(matched){
				matching++;
                if(matching >= this.selector_order().length) {
                    if(this.end_filters && !this.end_filters[event.type](el, event)) return null;
                    return {node: node.element, order: n, delegation_event: this};
                }
			}
		}
		return null;
    }
};;
include.set_path('../../jmvc/plugins/controller/view');
/**
 * @add class MVC.Controller Prototype
 */

MVC.Controller.prototype.
/**
 * Renders a View template with the controller instance. If action or partial 
 * are not supplied in the options, 
 * it looks for a view in app/views/controller_name/action_name.ejs
 * @plugin controller/view
 * @param {Object} options A hash with the following properties
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>action</td>
						<td>null</td>
						<td>If present, looks for a template in app/views/<i>controller_name</i>/<i>action</i>.ejs
						</td>
					</tr>
					<tr>
						<td>partial</td>
						<td>null</td>
						<td>A string value that looks like: 'folder/template' or 'template'.  If a folder is present,
						    it looks for a template in app/views/<i>folder</i>/_<i>template</i>.ejs; otherwise,
							it looks for a template in app/views/<i>controller_name</i>/_<i>template</i>.ejs.
						</td>
					</tr>
					<tr>
						<td>to</td>
						<td>null</td>
						<td>If present, a HTMLElement or element ID whose text will be replaced by the render.
						</td>
					</tr>
					
				</tbody></table>
 */
render = function(options) {
		var result, render_to_id = MVC.RENDER_TO, plugin_url;
		var controller_name = this.Class.className;
		var action_name = this.action_name;
        if(!options) options = {};
        
        var helpers = {};
        if(options.helpers){
            for(var h =0; h < options.helpers.length; h++){
                var n = MVC.String.classize( options.helpers[h] );
                MVC.Object.extend(helpers, window[n] ? window[n].View().helpers : {} );
            }
        }
        
		if(typeof options == 'string'){
			result = new MVC.View({url:  options  }).render(this, helpers);
		}
		else if(options.text) {
            result = options.text;
        }
        else {
            var convert = function(url){
				var url =  MVC.String.include(url,'/') ? url.split('/').join('/_') : controller_name+'/'+url;
				var url = url + '.ejs';
				return url;
			};
			if(options.plugin){
                plugin_url = '../jmvc/plugins/'+options.plugin;
            }
            
			if(options.action) {
				var url = '../views/'+convert(options.action);
            }
			else if(options.partial) {
                var url = '../views/'+convert(options.partial);
			}else
            {
                var url = '../views/'+controller_name+'/'+action_name.replace(/\.|#/g, '').replace(/ /g,'_')+'.ejs';
            }
			var data_to_render = this;
			if(options.locals) {
				for(var local_var in options.locals) {
					data_to_render[local_var] = options.locals[local_var];
				}
			}
            var view;
            if(!plugin_url){
                view = new MVC.View({url:  new MVC.File(url).join_from(this.Class._path)  }); //what about controllers in other folders?
            }else{
                //load plugin if it has been included
                try{
                    var view = new MVC.View({url:  MVC.View.get(plugin_url) ? plugin_url :  url  });
                }catch(e){
                    if(e.type !='JMVC') throw e;
                    var view = new MVC.View({url:  plugin_url  });
                }
            }
            result = view.render(data_to_render, helpers);
		}
		//return result;
		var locations = ['to', 'before', 'after', 'top', 'bottom'];
		var element = null;
		for(var l =0; l < locations.length; l++){
			if(typeof  options[locations[l]] == 'string'){
				var id = options[locations[l]];
				options[locations[l]] = MVC.$E(id);
				if(!options[locations[l]]) 
					throw {message: "Can't find element with id: "+id, name: 'ControllerView: Missing Element'};
			}
			
			if(options[locations[l]]){
				element = options[locations[l]];
				if(locations[l] == 'to'){
                    if(MVC.$E.update)
                        MVC.$E.update(options.to , result);
                    else
					    options.to.innerHTML = result;
				}else{
					if(!MVC.$E.insert ) throw {message: "Include can't insert "+locations[l]+" without the element plugin.", name: 'ControllerView: Missing Plugin'};
					var opt = {};
					opt[locations[l]] = result;
					MVC.$E.insert(element, opt );
				}
			} 
		}
		return result;

};
;
include.set_path('../../jmvc/plugins/dom/element');
include('vector');


	include('element');;
include.set_path('../../jmvc/plugins/dom/element');
/**
 * @constructor
 * A vector class
 * @init creates a new vector instance from the arguments.  Example:
 * <pre>new MVC.Vector(1,2)</pre>
 * 
 */

MVC.Vector = function(){
    this.update( MVC.Array.from(arguments) );
};
MVC.Vector.prototype = 
/* @Prototype*/
{
    /**
     * Applys the function to every item in the vector.  Returns the new vector.
     * @param {Function} f
     * @return {MVC.Vector} new vector class.
     */
    app: function(f){
          var newArr = [];
          
          for(var i=0; i < this.array.length; i++)
              newArr.push( f(  this.array[i] ) );
          var vec = new MVC.Vector();
          return vec.update(newArr);
    },
    /**
     * Adds two vectors together.  Example:
     * <pre>new Vector(1,2).plus(2,3) -> &lt;3,5>
     * new Vector(3,5).plus(new Vector(4,5)) -> &lt;7,10>
     * @return {MVC.Vector}
     */
    plus: function(){
        var args = arguments[0] instanceof MVC.Vector ? 
                 arguments[0].array : 
                 MVC.Array.from(arguments), 
            arr=this.array.slice(0), 
            vec = new MVC.Vector();
        for(var i=0; i < args.length; i++)
            arr[i] = (arr[i] ? arr[i] : 0) + args[i];
        return vec.update(arr);
    },
    /**
     * Like plus but subtracts 2 vectors
     * @return {MVC.Vector}
     */
    minus: function(){
         var args = arguments[0] instanceof MVC.Vector ? 
                 arguments[0].array : 
                 MVC.Array.from(arguments), 
             arr=this.array.slice(0), vec = new MVC.Vector();
         for(var i=0; i < args.length; i++)
            arr[i] = (arr[i] ? arr[i] : 0) - args[i];
         return vec.update(arr);
    },
    /*
     * Returns the 2nd value of the vector
     * @return {Number}
     */
    x : function(){ return this.array[0] },
    /**
     * Returns the first value of the vector
     * @return {Number}
     */
    y : function(){ return this.array[1] },
    /**
     * Same as x()
     * @return {Number}
     */
    top : function(){ return this.array[1] },
    /**
     * same as y()
     * @return {Number}
     */
    left : function(){ return this.array[0] },
    /**
     * returns (x,y)
     * @return {String}
     */
    toString: function(){
        return "("+this.array[0]+","+this.array[1]+")";
    },
    /**
     * Replaces the vectors contents
     * @param {Object} array
     */
    update: function(array){
        if(this.array){
            for(var i =0; i < this.array.length; i++) delete this.array[i];
        }
        this.array = array;
        for(var i =0; i < array.length; i++) this[i]= this.array[i];
        return this;
    }
};

/**
 * @add class MVC.Event Static
 */
MVC.Event.
/**
 * Returns the position of the event
 * @plugin dom/element
 * @param {Event} event
 * @return {MVC.Vector}
 */
pointer = function(event){
	return new MVC.Vector( 
        event.pageX || (event.clientX +
          (document.documentElement.scrollLeft || document.body.scrollLeft)),
          event.pageY || (event.clientY +
          (document.documentElement.scrollTop || document.body.scrollTop)
         )
    );
};;
include.set_path('../../jmvc/plugins/dom/element');
//Much of the code in this plugin is adapated from Prototype
// Prototype JavaScript framework, version 1.6.0.1
// (c) 2005-2007 Sam Stephenson


/* @constructor
 * The Element API provides useful functions for manipulating and traversing the DOM. 
 * All of these elements are classed under $E. When using the Element or $E function, 
 * all Element functions that have their first argument as element are added to the element.
 * 
 * <h3>Examples</h3>
 * <pre><code>Element('element_id') -> HTMLElement
$E('element_id') -> HTMLElement

$E('element_id').next() -> HTMLElement
Element.next('element_id') -> HTMLElement

$E('element_id').insert({after: '&lt;p&gt;inserted text&lt;/p&gt;'})</code></pre>
 * @init the HTML Element for the given id with functions in Element.
 * @param {String/HTMLElement} element Either an HTMLElement or a string describing the element's id.
 * @return {HTMLElement} the HTML Element for the given id with functions in Element.
 */
MVC.Element = function(element){
	if(typeof element == 'string')
		element = document.getElementById(element);
    if (!element) return element;
	return element._mvcextend ? element : MVC.Element.extend(element);
};
/* @Static*/
MVC.Object.extend(MVC.Element, {
    /**
     * Inserts HTML into the page relative to the given element.
     * @param {String/HTMLElement} element Either an HTML Element or a string describing the element's id. 
     * @param {Object} insertions Is an object with one of the following attributes:
     *     <table class="options">
					<tbody><tr><th>Option</th><th>Description</th></tr>
					<tr>
						<td>after</td>
						<td>Inserts the given HTML after the given element.</td>
					</tr>
					<tr>
						<td>before</td>
						<td>Inserts the given HTML before the given element.</td>
					</tr>
					<tr>
						<td>bottom</td>
						<td>Inserts the given HTML at the bottom of the given element's children.</td>
					</tr>
					<tr>
						<td>top</td>
						<td>Inserts the given HTML at the top of the given element's children.</td>
					</tr>
				</tbody>
			</table>
     * 
     */
	insert: function(element, insertions) {
		element = MVC.$E(element);
		if(typeof insertions == 'string'){insertions = {bottom: insertions};};

		var content, insert, tagName, childNodes;
		for (position in insertions) {
		  if(! insertions.hasOwnProperty(position)) continue;
		  content  = insertions[position];
		  position = position.toLowerCase();
		  insert = MVC.$E._insertionTranslations[position];
		  if (content && content.nodeType == 1) {
		    insert(element, content);
		    continue;
		  }
		  tagName = ((position == 'before' || position == 'after') ? element.parentNode : element).tagName.toUpperCase();
		  childNodes = MVC.$E._getContentFromAnonymousElement(tagName, content);
		  if (position == 'top' || position == 'after') childNodes.reverse();
		  for(var c = 0; c < childNodes.length; c++){
		  	insert(element, childNodes[c]);
		  }
		}
		return element;
	},
	_insertionTranslations: {
	  before: function(element, node) { element.parentNode.insertBefore(node, element);},
	  top: function(element, node) { element.insertBefore(node, element.firstChild);},
	  bottom: function(element, node) { element.appendChild(node);},
	  after: function(element, node) { element.parentNode.insertBefore(node, element.nextSibling);},
	  tags: {
	    TABLE:  ['<table>',                '</table>',                   1],
	    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
	    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
	    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
	    SELECT: ['<select>',               '</select>',                  1]
	  }
	},
	_getContentFromAnonymousElement: function(tagName, html) {
	  var div = document.createElement('div'), t = MVC.$E._insertionTranslations.tags[tagName];
	  if (t) {
	    div.innerHTML = t[0] + html + t[1];
		for(var i=0; i < t[2]; i++){
			div = div.firstChild;
		}
	  }else div.innerHTML = html;
	  return MVC.Array.from(div.childNodes);
	},
    /*
     * Returns children with nodeType = 1
     */
    get_children : function(element){
        var els = [];
        var el = element.first();
        while(el){ els.push(el);el = el.next(); }
        return els;
    },
    /*
     * Returns the first child with nodeType = 1
     */
    first : function(element, check){
        check = check || function(){return true;}
        var next = element.firstChild;
		while(next && next.nodeType != 1 || (next && !check(next)) )
			next = next.nextSibling;
        return MVC.$E(next);
    },
    /*
     * returns the last child element with nodeType = 1
     */
    last : function(element, check){
        check = check || function(){return true;}
        var previous = element.lastChild;
		while(previous && previous.nodeType != 1  || (previous && ! check(previous))  )
			previous = previous.previousSibling;
        return MVC.$E(previous);
    },
    /*
     * Returns the next sibling with nodeType = 1
     */
	next : function(element, wrap, check){
		check = check || function(){return true;}
        var next = element.nextSibling;
		while(next && next.nodeType != 1 || (next && ! check(next)  ) )
			next = next.nextSibling;
        if(!next && wrap) return MVC.$E( element.parentNode ).first(check);
		return MVC.$E(next);
	},
    /*
     * Returns the previous sibling with nodeType = 1
     */
    previous : function(element, wrap, check){
		check = check || function(){return true;}
        var previous = element.previousSibling;
		while(previous && previous.nodeType != 1 || (previous && ! check(previous))  )
			previous = previous.previousSibling;
        if(!previous && wrap) return MVC.$E( element.parentNode ).last(check);
        return MVC.$E(previous);
	},
    /*
     * Toggles the style display.  It is assumed that no css is already being used to 
     * hide the element.  If you want to have the element hidden to start, write
     * style="display:none" in your html.
     */
	toggle : function(element){
		return element.style.display == 'none' ? element.style.display = '' : element.style.display = 'none';
	},
    /*
     * Makes an element position ('relative', 'absolute', or 'static')
     */
    make_positioned: function(element) {
        element = MVC.$E(element);
        var pos = MVC.Element.get_style(element, 'position');
        if (pos == 'static' || !pos) {
          element._madePositioned = true;
          element.style.position = 'relative';
          // Opera returns the offset relative to the positioning context, when an
          // element is position relative but top and left have not been defined
          if (window.opera) {
            element.style.top = 0;
            element.style.left = 0;
          }
        }
        return element;
    },
    /*
     * Returns the style for a given element.
     */
    get_style:  function(element, style) {
        element = MVC.$E(element);
        style = style == 'float' ? 'cssFloat' : MVC.String.camelize(style);
        var value;
        if(element.currentStyle){
            var value = element.currentStyle[style];
        }else{
             var css = document.defaultView.getComputedStyle(element, null);
             value = css ? css[style] : null;
        }
        if (style == 'opacity') return value ? parseFloat(value) : 1.0;
        return value == 'auto' ? null : value;
    },
    /*
     * Returns the vector
     * @return {Vector} a vector
     */
    cumulative_offset: function(element) {
        var valueT = 0, valueL = 0;
        do {
          valueT += element.offsetTop  || 0;
          valueL += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);
        return new MVC.Vector( valueL, valueT );
    },
    cumulative_scroll_offset: function(element) {
        var valueT = 0, valueL = 0;
        do {
          valueT += element.scrollTop  || 0;
          valueL += element.scrollLeft || 0;
          element = element.parentNode;
        } while (element);
        return new MVC.Vector( valueL, valueT );
    },
    is_parent: function(element,child ) {
      if(typeof child == 'string') child = MVC.$E(child);
      if (!child.parentNode || child == element) return false;
      if (child.parentNode == element) return true;
      return MVC.Element.is_parent(child.parentNode, element);
    },
    /*
     * Returns true or false if one element is inside another element.
     */
    has: function(element, b){
      if(typeof b == 'string') b = MVC.$E(b);
      return element.contains ?
        element != b && element.contains(b) :
        !!(element.compareDocumentPosition(b) & 16);
    },
    /*
     * Updates an element with content.  This works for IE's table elements.
     */
    update: function(element, content){
        element = MVC.$E(element);
        var tagName = element.tagName.toUpperCase();
        if ( ( !MVC.Browser.IE && !MVC.Browser.Opera  )|| !( tagName in MVC.$E._insertionTranslations.tags) ){
            element.innerHTML = content;
        }else{
          //remove children
          var node;
          while( (node =  element.childNodes[0]) ){ element.removeChild(node) }
          
          var children = MVC.$E._getContentFromAnonymousElement(tagName, content);
          for(var c=0; c < children.length; c++){
              element.appendChild(children[c]);
          }
        }
        return element;
   },
   /*
    * Removes an element
    */
   remove: function(element){
   		return element.parentNode.removeChild(element);
   },
   /*
    * Returns a vector with the dimensions of the element
    */
   dimensions: function(element){
        var display = element.style.display;
        if (display != 'none' && display != null) // Safari bug
          return new MVC.Vector( element.offsetWidth, element.offsetHeight );
        // All *Width and *Height properties give 0 on elements with display none,
        // so enable the element temporarily
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition = els.position;
        var originalDisplay = els.display;
        els.visibility = 'hidden';
        els.position = 'absolute';
        els.display = 'block';
        var originalWidth = element.clientWidth;
        var originalHeight = element.clientHeight;
        els.display = originalDisplay;
        els.position = originalPosition;
        els.visibility = originalVisibility;
        return new MVC.Vector( originalWidth, originalHeight);
    }
});






MVC.Element.extend = function(el){
	for(var f in MVC.Element){
		if(!MVC.Element.hasOwnProperty(f)) continue;
		var func = MVC.Element[f];
		if(typeof func == 'function'){
			//var names = MVC.Function.params(func);
			//if( names.length == 0) continue;
			//var first_arg = names[0];
			if( f[0] != "_" ) MVC.Element._extend(func, f, el);
		}
	}
	el._mvcextend = true;
	return el;
};
MVC.Element._extend = function(f,name,el){
	el[name] = function(){
		var arg = MVC.Array.from(arguments);
		arg.unshift(el);
		return f.apply(el, arg); 
	};
};
MVC.$E = MVC.Element;
if(!MVC._no_conflict){
	$E = MVC.$E;
};
include.set_path('../../jmvc/plugins/controller/scaffold');
/*include.views(
	include.get_path()+'/list',
	include.get_path()+'/edit',
	include.get_path()+'/display',
	include.get_path()+'/show'
);*/

MVC.Controller.scaffold = function(){
    //go through list of prototype functions, if one doesn't exist copy
    if(!this.className) return;
    
    var class_name = MVC.String.singularize( MVC.String.classize(this.className)  );
    this.scaffold_model = window[class_name];
    this.singular_name = MVC.String.singularize(this.className);
    for(var action_name in MVC.Controller.scaffold.functions){
        if(this.prototype[action_name]) continue;
        this.prototype[action_name] = MVC.Controller.scaffold.functions[action_name]
    }
    if(! window[class_name+'ViewHelper']   )
        this.scaffold_view_helper = window[class_name+'ViewHelper'] = MVC.ModelViewHelper.extend(this.singular_name);
    else{
        this.scaffold_view_helper = window[class_name+'ViewHelper']
    }
};


MVC.Controller.scaffold.functions = {
    load: function(params){
        //we should make sure the element exists
        if(!MVC.$E(this.controller_name)){
            var div = document.createElement('div')
            div.id = this.controller_name;
            document.body.appendChild(div);
        };
        this.Class.scaffold_model.find('all', {} , this.continue_to('list'))
    },
    list: function(objects){
        this.singular_name = this.Class.singular_name;
        this[this.controller_name] = objects;
        this.objects = objects;
        this.render({to: this.controller_name, plugin: 'controller/scaffold/display', action: this.controller_name});
    },
    '# form submit' : function(params){
        params.event.kill();
        this.Class.scaffold_model.create( params.form_params()[this.Class.singular_name], this.continue_to('created') );
    },
    created: function(object){
		if(object.errors.length > 0){
            
            object.View().show_errors();
            
		}else{
            
            this.Class.scaffold_model.View().clear();
            object.View().clear_errors();
            this[this.controller_name] = [object];
            this.objects = [object];
            this.singular_name = this.Class.singular_name;
            this.render({bottom: 'recipe_list', plugin: 'controller/scaffold/list', action: 'list'});//?
            
		}
    },
    '.delete click' : function(params){
        this[this.Class.singular_name] = params.object_data();
        if(confirm("Are you sure you want to delete"))
            this[this.Class.singular_name].destroy(this.continue_to('destroyed'));
    },
    '.edit click' : function(params){
        this[this.Class.singular_name] = params.object_data();
        this.singular_name = this.Class.singular_name;
        this.render({to: this[this.Class.singular_name].View().element_id(), action: 'edit', plugin: 'controller/scaffold/edit'}); //!
    },
    '.cancel click': function(params){
        this.show(params.object_data());
    },
    '.save click': function(params){
        this[this.Class.singular_name] = params.object_data();
        var attrs = this[this.Class.singular_name].View().edit_values(); 
        this[this.Class.singular_name].update_attributes( attrs, this.continue_to('show') );
    },
    show: function(object){
        this[this.Class.singular_name] = object;
        this.singular_name = this.Class.singular_name;
        this.render({to: this[this.Class.singular_name].View().element_id(), action: 'show', plugin: 'controller/scaffold/show'} );
    },
    destroyed: function(destroyed){
        if(destroyed)
            this[this.Class.singular_name].View().destroy();   
    }
};
include.set_path('../../jmvc/plugins/model/view_helper');
include('model_view_helper');
include.set_path('../../jmvc/plugins/model/view_helper');
MVC.ModelViewHelper = MVC.Class.extend(
{
    init: function(){
        if(!this.className) return;
        //add yourself to your model
        var modelClass;
        if(!this.className) return;
        
        if(!(modelClass = this.modelClass = window[MVC.String.classize(this.className)]) ) 
            throw "ModelViewHelpers can't find class "+this.className;
        var viewClass = this;
        this.modelClass.View = function(){ 
            return viewClass;
        };
        
        
        this.modelClass.prototype.View = function(){
            return new viewClass(this);
        };
        if(this.modelClass.attributes){
            this._view = new MVC.View.Helpers({});
            var type;
            for(var attr in this.modelClass.attributes){
                if(! this.modelClass.attributes.hasOwnProperty(attr) || typeof this.modelClass.attributes[attr] != 'string') continue;
                this.add_helper(attr);
            }
        }
    },
    form_helper: function(attr){
        if(! this.helpers[attr]+"_field" ){
            this.add_helper(attr);
        }
        var f = this.helpers[attr+"_field"];
        var args = MVC.Array.from(arguments);
        args.shift();
        return f.apply(this._view, args);
    },
    add_helper : function(attr){
        var h = this._helper(attr);
        this.helpers[attr+"_field"] = h;
    },
    helpers : {},
    _helper: function(attr){
        var helper = this._view_helper(attr);
        var modelh = this;
        var name = this.modelClass.className+'['+attr+']';
        var id = this.modelClass.className+'_'+attr;
        return function(){
            var args = MVC.Array.from(arguments);
            args.unshift(name);
            args[2] = args[2] || {};
            args[2].id = id;
            return helper.apply(modelh._view, args);
        }
    },
    _view_helper: function(attr){
         switch(this.modelClass.attributes[attr].toLowerCase()) {
				case 'boolean': 
                    return this._view.check_box_tag;
                case 'text':
                    return this._view.text_area_tag;
				default:
					return this._view.text_field_tag;
	    }
    },
    clear: function(){
        var mname = this.modelClass.className, el;
        for(var attr in this.modelClass.attributes){
            if( (el = MVC.$E(mname+"_"+attr)) ){
                el.value = '';
            }
        }
    },
    from_html: function(element_or_id){
        var el =MVC.$E(element_or_id);
        
        var el_class = this.modelClass ? this.modelClass : window[ MVC.String.classize(el.getAttribute('type')) ];
        
        if(! el_class) return null;
        //get data here
        var attributes = {};
        attributes[el_class.id] = this.element_id_to_id(el.id);
        //for(var attr in modelClass.attributes){
        //    if(MVC.$E(  ) )
        //}
        
        return el_class.create_as_existing(attributes);
    },
    element_id_to_id: function(element_id){
        var re = new RegExp(this.className+'_', "");
        return element_id.replace(re, '');
    }
},
{
    init: function(model_instance){
        this._inst = model_instance;
        this._className = this._inst.Class.className;
        this._Class = this._inst.Class;
    },
    id : function(){
        return this._inst[this._inst.Class.id];
    },
    element : function(){
        if(this._element) return this._element;
        this._element = MVC.$E(this.element_id());
        if(this._element) return this._element;
    },
	create_element: function(){
        this._element = document.createElement('div');
        this._element.id = this.element_id();
        this._element.className = this._className;
        this._element.setAttribute('type', this._className);
        return this._element;
	},
    element_id : function(){
        return this._className+'_'+this._inst[this._inst.Class.id];
    },
    show_errors : function(){
        var err = MVC.$E(this._className+"_error");
        var err = err || MVC.$E(this._className+"_error");
        var errs = [];
        for(var i=0; i< this._inst.errors.length; i++){
			var error = this._inst.errors[i];
			var el = MVC.$E(this._className+"_"+error[0]);
			if(el){
				el.className="error";
                var er_el = MVC.$E(this._className+"_"+error[0]+"_error" );
				if(er_el) er_el.innerHTML = error[1];
			}
			else
                errs.push(error[0]+' is '+error[1]);
            
		}
        if(errs.length > 0){
             if(err) err.innerHTML = errs.join(", "); 
             else alert(errs.join(", "));
        }
    },
    clear_errors: function(){
        var p;
        var cn = this._className;
        for(var attribute in this._Class.attributes){
            if(this._Class.attributes.hasOwnProperty(attribute)){
                var el = MVC.$E(cn+"_"+p);
                if(el) el.className = el.className.replace(/(^|\\s+)error(\\s+|$)/, ' '); //from prototype
                var er_el = MVC.$E(cn+"_"+attribute+"_error" );
    		    if(er_el) er_el.innerHTML = '&nbsp;';
            }
        }
        
        var bigel = MVC.$E(cn+"_error");
        if(bigel) bigel.innerHTML = '';
    },
    edit: function(attr){
        //get the helper function, add args, return
         var args = MVC.Array.from(arguments);
         var name = this._className+'['+attr+']'
         args.shift();
         args.unshift( {id: this.edit_id(attr)} ); //change to ID
         args.unshift(this._inst[attr]); //value
         args.unshift(name); //name
         var helper =this.Class._view_helper(attr)
         return helper.apply(this.Class._view, args);
    },
    edit_values: function(){
        var values = {};
        var cn = this._className, p, el;
        for(var attr in this._Class.attributes){
            if(this._Class.attributes.hasOwnProperty( attr ) )
            el = MVC.$E(this.edit_id(attr));
            if(el) values[attr] = el.value;
            
        }
        return values;
    },
    edit_id: function(attr){
        return this._className+'_'+this._inst.id+'_'+attr+'_edit';
    },
    destroy: function(){
        var el = this.element();
        el.parentNode.removeChild(el);
    }
}
);

/**
 * @add class MVC.Controller.Params Prototype
 */
MVC.Controller.Params.prototype.
/*
 * If the element (or one of its parents) has an id like "todo_5" this will return the instance that the 
 * element represents.
 * @return {Object} the instance object the form represents.
 */
object_data = function(){
	// use the class name of the controller
	var className = this._className(), 
        model, 
        element = this.element, 
        matcher = new RegExp("^"+className+"_(.*)$");
    if(! (model=MVC.Model.models[className])  ) return;

	// loop through parents, this element, or one of its parents should have "todo_4" as its' id
	// this allows more complex html structures, such as <div id='todo_4'><div class='todo'></div></div>

    while(element && element.parentNode && !element.id.match(matcher) ) { 
        element = element.parentNode;
    }
    
	if(!element) return null;
	var id = element.id.match(matcher)[1];
	return model.store.find_one(id);
};
include.set_path('../../jmvc/plugins/view/helpers');
include.plugins('view');
include('view_helpers');
include.set_path('../../jmvc/plugins/view');
include.plugins('lang');
include('view');
if(include.get_env() == 'development')	include('fulljslint');

if(MVC.Controller) include.plugins('controller/view');;
include.set_path('../../jmvc/plugins/lang');
/* -------------
	Helpers defines the following:

	Object
	* extend
	* to_query_string
	
	
	String
	* capitalize
	* include
	* ends_with
	* camelize
	
	Array
	* include
	* from
	
	Function
	* bind
 ------------  */

if(typeof Prototype != 'undefined'){
	include({path: 'prototype_helpers.js', shrink_variables: false});
}else if(typeof jQuery != 'undefined'){
	include({path: 'jquery_helpers.js', shrink_variables: false});
}else{
	include({path: 'standard_helpers.js', shrink_variables: false});
}
	;
include.set_path('../../jmvc/plugins/controller/view');
include.plugins('view', 'controller');
include('controller_view');;
include.set_path('../../jmvc/plugins/controller');
include.plugins('lang','lang/inflector','dom/event','lang/class');
include('delegator','controller');
if(MVC.View) include.plugins('controller/view');
//if(include.get_env() == 'test') include('test');
include.set_path('../../jmvc/plugins/lang/inflector');
include.plugins('lang');
include('inflector');;
include.set_path('../../jmvc/plugins/dom/event');
/**
 * Event describes 2 functions
 * 	Event.observe
 * 	Event.stopObserving
 */

if(typeof Prototype == 'undefined') 
	include("standard");
else{
	include("prototype_event");
}
	
//jQuery's wont work for controllers because it doesn't allow capture;
include.set_path('../../jmvc/plugins/view/helpers');
// JavaScriptMVC framework and server, 1.1.22
//  - built on 2008/05/07 19:44
/**
 * @add constructor MVC.View.Helpers Prototype
 */
MVC.Object.extend(MVC.View.Helpers.prototype, {
    /**
     * Creates a check box tag
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} options
     * @param {Object} checked
     */
	check_box_tag: function(name, value, options, checked){
        options = options || {};
        if(checked) options.checked = "checked";
        return this.input_field_tag(name, value, 'checkbox', options);
    },
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} html_options
     */
    date_tag: function(name, value , html_options) {
	    if(! (value instanceof Date)) value = new Date();
		
		var years = [], months = [], days =[];
		var year = value.getFullYear(), month = value.getMonth(), day = value.getDate();
		for(var y = year - 15; y < year+15 ; y++) years.push({value: y, text: y});
		for(var m = 0; m < 12; m++) months.push({value: (m), text: MVC.Date.month_names[m]});
		for(var d = 0; d < 31; d++) days.push({value: (d+1), text: (d+1)});
		
		var year_select = this.select_tag(name+'[year]', year, years, {id: name+'[year]'} );
		var month_select = this.select_tag(name+'[month]', month, months, {id: name+'[month]'});
		var day_select = this.select_tag(name+'[day]', day, days, {id: name+'[day]'});
		
	    return year_select+month_select+day_select;
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} html_options
     */
	file_tag: function(name, value, html_options) {
	    return this.input_field_tag(name+'[file]', value , 'file', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} url_for_options
     * @param {Object} html_options
     */
	form_tag: function(url_for_options, html_options) {
	    html_options = html_options  || {};
		if(html_options.multipart == true) {
	        html_options.method = 'post';
	        html_options.enctype = 'multipart/form-data';
	    }
		html_options.action = url_for_options;
	    return this.start_tag_for('form', html_options);
	},
    /**
     * @plugin view/helpers
     */
	form_tag_end: function() { return this.tag_end('form'); },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} html_options
	 */
    hidden_field_tag: function(name, value, html_options) { 
	    return this.input_field_tag(name, value, 'hidden', html_options); 
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} inputType
     * @param {Object} html_options
     */
	input_field_tag: function(name, value , inputType, html_options) {
	    html_options = html_options || {};
	    html_options.id  = html_options.id  || name;
	    html_options.value = value || '';
	    html_options.type = inputType || 'text';
	    html_options.name = name;
	    return this.single_tag_for('input', html_options);
	},
    /**
	 * @plugin view/helpers
	 * @param {Object} text
	 * @param {Object} html_options
	 */
	label_tag: function(text, html_options) {
		html_options = html_options || {};
		return this.start_tag_for('label', html_options) + text + this.tag_end('label');
	},
	/**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} url
     * @param {Object} html_options
     */
	link_to: function(name, url, html_options) {
	    if(!name) var name = 'null';
	    if(!html_options) var html_options = {};
		this.set_confirm(html_options);
		html_options.href=url;
		return this.start_tag_for('a', html_options)+name+ this.tag_end('a');
	},
    /**
     * @plugin view/helpers
     * @param {Object} condition
     * @param {Object} name
     * @param {Object} url
     * @param {Object} html_options
     */
    link_to_if: function(condition, name, url, html_options) {
		return this.link_to_unless((!condition), name, url, html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} condition
     * @param {Object} name
     * @param {Object} url
     * @param {Object} html_options
     */
    link_to_unless: function(condition, name, url, html_options){
        if(condition) return name;
        return this.link_to(name, url, html_options);
    },
    /**
     * @plugin view/helpers
     * @param {Object} html_options
     */
	set_confirm: function(html_options){
		if(html_options.confirm){
			html_options.onclick = html_options.onclick || '';
			html_options.onclick = html_options.onclick+
			"; var ret_confirm = confirm(\""+html_options.confirm+"\"); if(!ret_confirm){ return false;} ";
			html_options.confirm = null;
		}
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} options
     * @param {Object} html_options
     * @param {Object} post
     */
	submit_link_to: function(name, options, html_options, post){
		if(!name) var name = 'null';
	    if(!html_options) html_options = {};
		html_options.type = 'submit';
	    html_options.value = name;
		this.set_confirm(html_options);
		html_options.onclick=html_options.onclick+';window.location="'+options+'"; return false;';
		return this.single_tag_for('input', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} html_options
     */
	password_field_tag: function(name, value, html_options) { return this.input_field_tag(name, value, 'password', html_options); },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} choices
	 * @param {Object} html_options
	 */
    select_tag: function(name, value, choices, html_options) {     
	    html_options = html_options || {};
	    html_options.id  = html_options.id  || name;
	    //html_options.value = value;
		html_options.name = name;
	    var txt = '';
	    txt += this.start_tag_for('select', html_options);
	    for(var i = 0; i < choices.length; i++)
	    {
	        var choice = choices[i];
	        if(typeof choice == 'string') choice = {value: choice};
			if(!choice.text) choice.text = choice.value;
			if(!choice.value) choice.text = choice.text;
			
			var optionOptions = {value: choice.value};
	        if(choice.value == value)
	            optionOptions.selected ='selected';
	        txt += this.start_tag_for('option', optionOptions )+choice.text+this.tag_end('option');
	    }
	    txt += this.tag_end('select');
	    return txt;
	},
    /**
     * @plugin view/helpers
     * @param {Object} tag
     * @param {Object} html_options
     */
	single_tag_for: function(tag, html_options) { return this.tag(tag, html_options, '/>');},
	/**
	 * @plugin view/helpers
	 * @param {Object} tag
	 * @param {Object} html_options
	 */
    start_tag_for: function(tag, html_options)  { return this.tag(tag, html_options); },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} html_options
	 */
    submit_tag: function(name, html_options) {  
	    html_options = html_options || {};
	    html_options.type = html_options.type  || 'submit';
	    html_options.value = name || 'Submit';
	    return this.single_tag_for('input', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} tag
     * @param {Object} html_options
     * @param {Object} end
     */
	tag: function(tag, html_options, end) {
	    end = end || '>';
	    var txt = ' ';
	    for(var attr in html_options) { 
	       if(html_options.hasOwnProperty(attr)){
			   value = html_options[attr] != null ? html_options[attr].toString() : '';

		       if(attr == "Class" || attr == "klass") attr = "class";
		       if( value.indexOf("'") != -1 )
		            txt += attr+'=\"'+value+'\" ' ;
		       else
		            txt += attr+"='"+value+"' " ;
		   }
	    }
	    return '<'+tag+txt+end;
	},
    /**
     * @plugin view/helpers
     * @param {Object} tag
     */
	tag_end: function(tag)             { return '</'+tag+'>'; },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} html_options
	 */
    text_area_tag: function(name, value, html_options) { 
	    html_options = html_options || {};
	    html_options.id  = html_options.id  || name;
	    html_options.name  = html_options.name  || name;
		value = value || '';
	    if(html_options.size) {
	        html_options.cols = html_options.size.split('x')[0];
	        html_options.rows = html_options.size.split('x')[1];
	        delete html_options.size;
	    }
	    html_options.cols = html_options.cols  || 50;
	    html_options.rows = html_options.rows  || 4;
	    return  this.start_tag_for('textarea', html_options)+value+this.tag_end('textarea');
	},
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} html_options
	 */
    text_field_tag: function(name, value, html_options) { return this.input_field_tag(name, value, 'text', html_options); },
	/**
	 * @plugin view/helpers
	 * @param {Object} image_location
	 * @param {Object} options
	 */
    img_tag: function(image_location, options){
		options = options || {};
		options.src = "resources/images/"+image_location;
		return this.single_tag_for('img', options);
	}
	
});

MVC.View.Helpers.prototype.text_tag = MVC.View.Helpers.prototype.text_area_tag;


(function(){
	var data = {};
	var name = 0;
	MVC.View.Helpers.link_data = function(store){
		var functionName = name++;
		data[functionName] = store;	
		return "_data='"+functionName+"'";
	};
	MVC.View.Helpers.get_data = function(el){
		if(!el) return null;
		var dataAt = el.getAttribute('_data');
		if(!dataAt) return null;
		return data[parseInt(dataAt)];
	};
	MVC.View.Helpers.prototype.link_data = function(store){
		return MVC.View.Helpers.link_data(store)
	};
	MVC.View.Helpers.prototype.get_data = function(el){
		return MVC.View.Helpers.get_data(el)
	};
})();

;
include.set_path('../../engines/modalmvc/apps');
include.resources();
include.plugins('controller','view');
include.css("style");
include(function(){ //runs after prior includes are loaded
  include.models();
  include.controllers('modal');
  include.views('views/modal/alert_subscribe',
		'views/modal/prompt_subscribe');
});
;
include.next_function();
include.set_path('../../engines/modalmvc/controllers');

/**
 * Used for Modal alert and prompts
 *<pre>ModalController.alert("hi", callback)
ModalController.prompt("question?", callback)
</pre>
 */

ModalController = Controller.extend('modal',{
    size : function(){
        var d = MVC.Dimensions();
        var el = document.getElementById(this.className);
        el.style.height = ""+d.window_height+"px";
        el.style.top = d.scroll_top;
        
        return el;
    }
},{
    resize : function(){
          var el = document.getElementById(this.Class.className);
          if(el.style.display != "none") setTimeout( MVC.Function.bind(this.Class.size, this.Class) , 1  );
    },
    scroll : function(){
        var el = document.getElementById(this.Class.className);
        if(el.style.display != "none") setTimeout( MVC.Function.bind(this.Class.size, this.Class) , 1  );
    },    
    load : function(){
        var el = document.createElement('div');
        el.id = this.Class.className;
        el.style.display = 'none';
        document.body.appendChild(el);
    },
    "alert subscribe" : function(params){
        this.text = params.text
        this.Class.callback = params.callback;
        this.render({to: this.Class.className});
        this.Class.size().style.display = "block";
        MVC.$E('MODAL_OK').focus();
        
    },
    "confirm subscribe" : function(params){
        this.text = params.text
        this.Class.callback = params.callback;
        this.render({to: this.Class.className});
        this.Class.size().style.display = "block";
        MVC.$E('MODAL_PROMPT').focus();
    },
    "prompt subscribe" : function(params){ 
        this.Class.callback = params.callback;
        this.text = params.text
        this.render({to: this.Class.className});
        this.Class.size().style.display = "block";
        MVC.$E('MODAL_PROMPT').focus();
    },
    "#MODAL_OK click" : function(){
        this.close_and_callback(null);
    },
    ".close click" : function(){
        this.close_and_callback(null);
    },
    "#modalBody submit" : function(params){
        var p = params;
        params.event.kill();
        var on = params.event.explicitOriginalTarget ?  params.event.explicitOriginalTarget : params.event.target
        
        if(on.id == "MODAL_CANCEL")
            this.close_and_callback(null);
        else{
            this.close_and_callback( MVC.$E('MODAL_PROMPT').value);
        }
    },
    close_and_callback : function(data){
        document.getElementById(this.Class.className).style.display = "";

        if(this.Class.callback)
            this.Class.callback(data);
    }
});




MVC.Dimensions = function(){
     var de = document.documentElement, 
         st = window.pageYOffset ? window.pageYOffset : de.scrollTop,
         sl = window.pageXOffset ? window.pageXOffset : de.scrollLeft;
     
     var wh = window.innerHeight ? window.innerHeight : de.clientHeight, 
         ww = window.innerWidth ? window.innerWidth :de.clientWidth;
     if(wh == 0){
         wh = document.body.clientHeight;
         ww = document.body.clientWidth;
     }
     
     return {
         window_height: wh,
         window_width: ww,
         document_height: MVC.Browser.IE ? document.body.offsetHeight : de.offsetHeight,
         document_width: MVC.Browser.IE ? document.body.offsetWidth :de.offsetWidth,
         scroll_left: sl,
         scroll_top: st,
         window_right: sl+ ww,
         window_bottom: st+ wh
     }
};
include.set_path('../../engines/modalmvc/views/modal');
MVC.View.PreCompiledFunction("../views/modal/alert_subscribe.ejs", function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {var ___ViewO = [];; ___ViewO.push("<div class=\"modalBackground\">\n");
___ViewO.push("</div>\n");
___ViewO.push("<div class=\"modalContainer\">\n");
___ViewO.push("    <div class=\"modal\">\n");
___ViewO.push("        <div class=\"modalTop\">\n");
___ViewO.push("            <a href=\"javascript:void(0)\" class=\"close\"></a>\n");
___ViewO.push("            Alert:\n");
___ViewO.push("        </div>\n");
___ViewO.push("        <div id=\"modalBody\">\n");
___ViewO.push("            <p>"); ___ViewO.push((MVC.View.Scanner.to_text( text))); ___ViewO.push("</p>\n");
___ViewO.push("            <center>\n");
___ViewO.push("                <input type=\"submit\" value=\"OK\" class=\"OK\" id=\"MODAL_OK\" class=\"modal_button\">\n");
___ViewO.push("            </center>\n");
___ViewO.push("            \n");
___ViewO.push("        </div>\n");
___ViewO.push("    </div>\n");
___ViewO.push("</div>"); return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}});
include.set_path('../../engines/modalmvc/views/modal');
MVC.View.PreCompiledFunction("../views/modal/prompt_subscribe.ejs", function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {var ___ViewO = [];; ___ViewO.push("<div class=\"modalBackground\">\n");
___ViewO.push("</div>\n");
___ViewO.push("<div class=\"modalContainer\">\n");
___ViewO.push("    <div class=\"modal\">\n");
___ViewO.push("        <div class=\"modalTop\">\n");
___ViewO.push("            <a href=\"javascript:void(0)\" class=\"close\" title=\"close\"></a>\n");
___ViewO.push("            Prompt:\n");
___ViewO.push("        </div>\n");
___ViewO.push("        <form id=\"modalBody\">\n");
___ViewO.push("            <p>"); ___ViewO.push((MVC.View.Scanner.to_text( text))); ___ViewO.push("</p>\n");
___ViewO.push("            <p><input type=\"text\" id=\"MODAL_PROMPT\"/></p>\n");
___ViewO.push("            <center>\n");
___ViewO.push("                <input type=\"submit\" value=\"OK\" class=\"modal_button\">\n");
___ViewO.push("                <input type=\"submit\" value=\"Cancel\"   class=\"modal_button\" id=\"MODAL_CANCEL\">\n");
___ViewO.push("            </center>\n");
___ViewO.push("            \n");
___ViewO.push("        </form>\n");
___ViewO.push("    </div>\n");
___ViewO.push("</div>"); return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}});
include.next_function();
include.end_of_production();