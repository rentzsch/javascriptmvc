Todo = MVC.Model.extend('todo', 
{
    find_one : function(params, callbacks){
        var cbs = this._clean_callbacks(callbacks);
        var instances = this.create_as_existing( {name: "trash", description: "take it out"  });
        cbs.onSuccess( instances  );
    },
    find_all : function(params, callbacks){
        var cbs = this._clean_callbacks(callbacks);
        var instances = this.create_many_as_existing( [
            {name: "dishes", description: "clean them"  },
            {name: "shovel snow", description: "clear all the snow"}] );
        cbs.onSuccess( instances  );
    },
    create : function(attributes, callbacks){
        var inst = new this(attributes);
        var cbs = this._clean_callbacks(callbacks);
        cbs.onSuccess( inst  );
    },
    update : function(id, attributes, callbacks){
        
        var inst = this.store.find_one(id);
        inst.set_attributes(attributes);
        var cbs = this._clean_callbacks(callbacks);
        cbs.onSuccess( inst  );
    }
},
{
    
})