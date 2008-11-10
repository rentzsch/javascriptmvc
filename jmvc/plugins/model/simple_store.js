// provides very simple storage
// var store = new MVC.Store();
// when its being extended, it should make a new simplestore

/**
 * Provides simple storage for elements.  Replace this store with Gears!
 */
MVC.Store = MVC.Class.extend(
/* @prototype */
{
	/**
	 * 
	 * @param {Object} klass
	 */
    init: function(klass){
		this._data = {};
        this.storing_class = klass;
	},
	/**
	 * 
	 * @param {Object} id
	 */
    find_one: function(id){
		return this._data[id];
	},
	/**
	 * 
	 * @param {Object} obj
	 */
    create: function(obj){
		var id = obj[obj.Class.id];
		this._data[id] = obj;
	},
	/**
	 * 
	 * @param {Object} id
	 */
    destroy: function(id){
		delete this._data[id];
	}
});