// provides very simple storage
// var store = new MVC.SimpleStore();
// when its being extended, it should make a new simplestore
MVC.SimpleStore = MVC.Class.extend({
	init: function(klass){
		this._data = {};
        this.storing_class = klass;
	},
	find_one: function(id){
		return this._data[id];
	},
	create: function(obj){
		var id = obj[obj.Class.id];
		this._data[id] = obj;
	},
	destroy: function(id){
		delete this._data[id];
	}
});