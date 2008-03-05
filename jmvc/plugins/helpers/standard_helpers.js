//Object helpers
Object.extend = function(destination, source) {
  for (var property in source) 
    destination[property] = source[property];
  return destination;
};
Object.toQueryString = function(object,name){
	if(!object) return null;
	if(typeof object == 'string') return object;
	return Object.toQueryString.worker(object,name).join('&');
};

Object.toQueryString.worker = function(obj,name){
	var parts2 = [];
	for(var thing in obj){
		if(obj.hasOwnProperty(thing)) {
			var value = obj[thing];
			if(typeof value != 'object'){
				var nice_val = encodeURIComponent(value.toString());
				var newer_name = encodeURIComponent(name ? name+'['+thing+']' : thing) ;
				parts2.push( newer_name+'='+nice_val )  ;
			}else{
				if(name){
					parts2 = parts2.concat( Object.toQueryString.worker(value, name+'['+thing+']')   );
				}else{
					parts2 = parts2.concat( Object.toQueryString.worker(value, thing)  );
				}
			}
		}
	}
	return parts2;
};

//String Helpers
Object.extend(String.prototype, {
	capitalize : function() {
    	return this.slice(0,1).toUpperCase()+this.slice(1);
	},
	uncapitalize : function() {
    	return this.slice(0,1).toLowerCase()+this.slice(1);
	},
	include : function(pattern){
		return this.indexOf(pattern) > -1;
	},
	chomp : function(str){
	    var index = this.lastIndexOf(str);
	    return (index != -1 ? this.slice(0, index): this);
	},
	ends_with : function(pattern) {
	    var d = this.length - pattern.length;
	    return d >= 0 && this.lastIndexOf(pattern) === d;
	}
});
$MVC.String.camelize = function(string){
	var parts = string.split(/_|-/);
		for(var i = 0; i < parts.length; i++){
			parts[i] = parts[i].capitalize();
		}
		return parts.join('');
};

/* Cross-Browser Split v0.1; MIT-style license
By Steven Levithan <http://stevenlevithan.com>
An ECMA-compliant, uniform cross-browser split method */
( function(){
var nativeSplit = nativeSplit || String.prototype.split;
String.prototype.split = function (s /* separator */, limit) {
	// If separator is not a regex, use the native split method
	if (!(s instanceof RegExp))
		return nativeSplit.apply(this, arguments);
	if (limit === undefined || +limit < 0) {
		limit = false;
	} else {
		limit = Math.floor(+limit);
		if (!limit) return [];
	}
	var	flags = (s.global ? "g" : "") + (s.ignoreCase ? "i" : "") + (s.multiline ? "m" : ""),
		s2 = new RegExp("^" + s.source + "$", flags),
		output = [],
		lastLastIndex = 0,
		i = 0,
		match;

	if (!s.global) s = new RegExp(s.source, "g" + flags);

	while ((!limit || i++ <= limit) && (match = s.exec(this))) {
		var zeroLengthMatch = !match[0].length;

		// Fix IE's infinite-loop-resistant but incorrect lastIndex
		if (zeroLengthMatch && s.lastIndex > match.index)
			s.lastIndex = match.index; // The same as s.lastIndex--

		if (s.lastIndex > lastLastIndex) {
			// Fix browsers whose exec methods don't consistently return undefined for non-participating capturing groups
			if (match.length > 1) {
				match[0].replace(s2, function () {
					for (var j = 1; j < arguments.length - 2; j++) {
						if (arguments[j] === undefined)
							match[j] = undefined;
					}
				});
			}

			output = output.concat(this.slice(lastLastIndex, match.index), (match.index === this.length ? [] : match.slice(1)));
			lastLastIndex = s.lastIndex;
		}

		if (zeroLengthMatch)
			s.lastIndex++;
	}

	return (lastLastIndex === this.length) ?
		(s.test("") ? output : output.concat("")) :
		(limit      ? output : output.concat(this.slice(lastLastIndex)));
};
})();




//Date Helpers
Date.month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Object.extend(Date.prototype, {
	month_name: function() {
		return Date.month_names[this.getMonth()-1];
	},
	number_of_days_in_month : function() {
	    var year = this.getFullYear();
	    var month = this.getMonth();
	    var m = [31,28,31,30,31,30,31,31,30,31,30,31];
	    if (month != 1) return m[month];
	    if (year%4 != 0) return m[1];
	    if (year%100 == 0 && year%400 != 0) return m[1];
	    return m[1] + 1;
	}
});

//steal old date parse
(function(){
	var parse = Date.parse;
	Date.parse = function(data) {
		if(typeof data != "string") return null;
		var f1 = /\d{4}-\d{1,2}-\d{1,2}/, 
		    f2 = /\d{4}\/\d{1,2}\/\d{1,2}/, 
			f3 = /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/;
		
		if(data.match(f3)) {
			var timeArr = data.match(f3)[0].split(' ')[1].split(':');
			var dateArr = data.match(f3)[0].split(' ')[0].split('-');

			return new Date( Date.UTC(parseInt(dateArr[0], 10), (parseInt(dateArr[1], 10)-1), parseInt(dateArr[2], 10),
				parseInt(timeArr[0], 10), parseInt(timeArr[1], 10), parseInt(timeArr[2], 10)) );
		}
		if(data.match(f1)) {
			var dateArr = data.match(date_format_1)[0].split('-');
			return new Date( Date.UTC(parseInt(dateArr[0], 10), (parseInt(dateArr[1], 10)-1), parseInt(dateArr[2], 10)) );
		}
		if(data.match(f2)) {
			var dateArr = data.match(date_format_2)[0].split('/');
			return new Date( Date.UTC(parseInt(dateArr[0], 10), (parseInt(dateArr[1], 10)-1), parseInt(dateArr[2], 10)) );
		}
		return parse(data);
	};
})();



//Array helpers
Array.from = function(iterable){
	 if (!iterable) return [];
	var results = [];
    for (var i = 0, length = iterable.length; i < length; i++)
      results.push(iterable[i]);
    return results;
};
Array.prototype.include = function(thing){
	for(var i=0; i< this.length; i++){
		if(this[i] == thing) return true;
	}
	return false;
};


//Function Helpers
if(typeof Function.prototype.bind == 'undefined'){
	Function.prototype.bind = function() {
	  var args = Array.from(arguments);
	  args.shift();
	  var __method = this, object = arguments[0];
	  return function() {
	    return __method.apply(object, args.concat(Array.from(arguments) )  );
	  }
	};
}
//Utility Helpers
$E = function(id){
	if(typeof id == 'string')
		return document.getElementById(id);
	return id;
};
$MVC.Element = {};
$MVC.Element.insert =  function(element, insertions) {
    element = $E(element);

    if(typeof insertions == 'string'){
		insertions = {bottom: insertions};
	};

    var content, insert, tagName, childNodes;

    for (position in insertions) {
      if(! insertions.hasOwnProperty(position)) continue;
	  content  = insertions[position];
      position = position.toLowerCase();
      insert = $MVC.Element._insertionTranslations[position];


      if (content && content.nodeType == 1) {
        insert(element, content);
        continue;
      }


      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = $MVC.Element._getContentFromAnonymousElement(tagName, content);

      if (position == 'top' || position == 'after') childNodes.reverse();
      for(var c = 0; c < childNodes.length; c++){
	  	insert(element, childNodes[c]);
	  }
	  //childNodes.each(insert.curry(element));

      //content.evalScripts.bind(content).defer();
    }

    return element;
  };

$MVC.Element._insertionTranslations = {
			  before: function(element, node) {
			    element.parentNode.insertBefore(node, element);
			  },
			  top: function(element, node) {
			    element.insertBefore(node, element.firstChild);
			  },
			  bottom: function(element, node) {
			    element.appendChild(node);
			  },
			  after: function(element, node) {
			    element.parentNode.insertBefore(node, element.nextSibling);
			  },
			  tags: {
			    TABLE:  ['<table>',                '</table>',                   1],
			    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
			    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
			    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
			    SELECT: ['<select>',               '</select>',                  1]
			  }
			};
			
$MVC.Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = document.createElement('div'), t = $MVC.Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
	for(var i=0; i < t[2]; i++){
		div = div.firstChild;
	}
  } else div.innerHTML = html;
  return Array.from(div.childNodes);
};


$MVC.Browser = {
    IE:     !!(window.attachEvent && !window.opera),
    Opera:  !!window.opera,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
};