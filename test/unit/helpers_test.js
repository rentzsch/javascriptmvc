new jQuery.Test.Unit('helpers',{
	test_object_extend : function(){
	   var a = {one: 'two', two: 'three'}
	   var b = {three: 'four'};
	   jQuery.extend(b,a)
	   this.assert_equal('two', b.one)
	   this.assert_equal('three', b.two)
	   this.assert_equal('four', b.three)
	},
	test_to_query_string : function(){
	   this.assert_equal('two=three', MVC.Object.to_query_string({two: 'three'}))
       this.assert_equal(null, MVC.Object.to_query_string());
       
       var d1 = MVC.Path.get_data( MVC.Object.to_query_string({one: 'two', two: 'three'}) ) ;
       
       this.assert_equal('two',d1.one )
       this.assert_equal('three',d1.two )
       
       var d2 = MVC.Path.get_data( MVC.Object.to_query_string({one: 'two', two: 'three', object: {hello: 'world'} }) ) ;
       
       this.assert_equal('two',d2.one )
       this.assert_equal('three',d2.two )
       this.assert_equal('world',d2.object.hello )
	},
	test_string_capitalize : function(){
		this.assert_equal('Yes', jQuery.String.capitalize('yes'));
		this.assert_equal('Y', jQuery.String.capitalize('Y'));
		this.assert_equal('Yes', jQuery.String.capitalize('YES'))
	},
	test_string_include : function(){
		this.assert_not(jQuery.String.include('Yes','bear') )
		this.assert( jQuery.String.include('Justin','in') )
		this.assert( jQuery.String.include('Justin','Just') )
		this.assert( jQuery.String.include('Justin','Justin') )
		this.assert_not( jQuery.String.include('Justin','nJ') )
	},
	test_string_ends_with : function(){
		this.assert( jQuery.String.ends_with('Justin','in')   );
		this.assert_not( jQuery.String.ends_with('Justin','is awesome')   );
	},
	test_string_camelize : function(){
		this.assert_equal('oneTwo', jQuery.String.camelize('one_two'))
	},
	test_string_classize : function(){
		this.assert_equal('OneTwo', jQuery.String.classize('one_two'))
	},
	test_string_strip : function(){
		this.assert_equal('word', jQuery.String.strip(' word  '))
	},
	test_array_include : function(){
		this.assert(jQuery.Array.include([1,2,3], 2) );
		this.assert_not(jQuery.Array.include([1,2,3], 4) )
	},
	test_array_from : function(){
		var f = function( ){
			var arr = jQuery.Array.from(arguments);
			this.assert(arr.join)
			this.assert_equal(arr[0], 1)
			this.assert_equal(arr[1], 2)
		}
		f.call(this, 1, 2)
	},
	test_function_bind : function(){
		var b = MVC.Function.bind(function(){
			this.assert(true);
		}, this)
		b();
	},
	test_function_params : function(){
		this.assert_each(['one','two','three'], MVC.Function.params(function( one, two ,three){ return 'yes'})  )
	}
});

new jQuery.Test.Unit('conflict_helpers',{
	test_string_capitalize : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert_equal('Yes', 'yes'.capitalize());
		this.assert_equal('Y', 'Y'.capitalize());
		this.assert_equal('Yes', 'YES'.capitalize())
	},
	test_string_include : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert_not('Yes'.include('bear') )
		this.assert( 'Justin'.include('in') )
		this.assert( 'Justin'.include('Just') )
		this.assert( 'Justin'.include('Justin') )
		this.assert_not( 'Justin'.include('nJ') )
	},
	test_string_ends_with : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert( 'Justin'.ends_with('in')   );
		this.assert_not( 'Justin'.ends_with('is awesome')   );
	},
	test_string_camelize : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert_equal('oneTwo', 'one_two'.camelize(), "OK if Prototype"  )
	},
	test_string_classize : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert_equal('OneTwo', 'one_two'.classize() )
	},
	test_string_strip : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert_equal('word', ' word  '.strip())
	},
	test_array_include : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert([1,2,3].include(2) );
		this.assert_not([1,2,3].include( 4) )
	},
	test_array_from : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		var f = function( ){
			var arr = Array.from(arguments);
			this.assert(arr.join)
			this.assert_equal(arr[0], 1)
			this.assert_equal(arr[1], 2)
		}
		f.call(this, 1, 2)
	},
	test_function_bind : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		var b = function(){
			this.assert(true);
		}.bind(this)
		b();
	},
	test_function_params : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assert_each(['one','two','three'], function( one, two ,three){ return 'yes'}.params()  )
	}
});

MVC.Path = {};

//used to get the object
MVC.Path.get_data = function(path) {
	var search = path;
	if(! search || ! search.match(/([^?#]*)(#.*)?$/) ) return {};
	var data = {};
	var parts = search.split('&');
	for(var i=0; i < parts.length; i++){
		var pair = parts[i].split('=');
		if(pair.length != 2) continue;
		var key = decodeURIComponent(pair[0]), value = decodeURIComponent(pair[1]);
		var key_components = jQuery.String.rsplit(key,/\[[^\]]*\]/);
		
		if( key_components.length > 1 ) {
			var last = key_components.length - 1;
			var nested_key = key_components[0].toString();
			if(! data[nested_key] ) data[nested_key] = {};
			var nested_hash = data[nested_key];
			
			for(var k = 1; k < last; k++){
				nested_key = key_components[k].substring(1, key_components[k].length - 1);
				if( ! nested_hash[nested_key] ) nested_hash[nested_key] ={};
				nested_hash = nested_hash[nested_key];
			}
			nested_hash[ key_components[last].substring(1, key_components[last].length - 1) ] = value;
		} else {
	        if (key in data) {
	        	if (typeof data[key] == 'string' ) data[key] = [data[key]];
	         	data[key].push(value);
	        }
	        else data[key] = value;
		}
		
	}
	return data;
}