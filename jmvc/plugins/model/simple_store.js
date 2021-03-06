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
        return id ? this._data[id] : null;
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
	},
    /**
     * Finds instances using a test function.  If no test function is provided returns all instances.
     * @param {Function} f
     * @return {Array}
     */
    find : function(f){
        var instances = [];
        for(var id in this._data){
            var inst = this._data[id];
            if(!f || f(inst))
                instances.push(inst);
        }
        return instances;
    },
    /**
     * Clears instances
     */
    clear : function(){
        this._data = {};
    },
    /**
     * Returns if there is no instances
     * @return {Boolean}
     */
    is_empty: function() {
		return !this.find().length;
	}
});