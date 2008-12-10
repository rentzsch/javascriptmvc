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
    
    find : function(f){
        var instances = [];
        for(var id in this._data){
            var inst = this._data[id];
            if(f(inst))
                instances.push(inst);
        }
        return instances;
    },
    clear : function(){
        this._data = {};
    }
});