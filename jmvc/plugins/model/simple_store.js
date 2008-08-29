// provides very simple storage
// var store = new MVC.SimpleStore();
// when its being extended, it should make a new simplestore
MVC.SimpleStore = MVC.Class.extend({
	init: function(){
		this._data = {};
	},
	find_one: function(params){
		var id = params.id;
		return this._data[id];
	},
	create: function(obj){
		var id = obj.id;
		this._data[id] = obj;
	},
	update: function(id, attributes){
		for(var attr in attributes){
			this._data[id][attr] = attributes[attr];
		}
		return this._data[id][attr];
	},
	destroy: function(id){
		delete this._data[id];
	}
});