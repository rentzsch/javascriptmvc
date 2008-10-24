Todo = MVC.Model.extend('todo', 
{
    find_one : function(params){
        return {name: "trash", description: "take it out"  };
    },
    find_all : function(params, callbacks){
         return [
            {name: "dishes", description: "clean them"  },
            {name: "shovel snow", description: "clear all the snow"}] ;
    },
    create : function(attributes, callbacks){
        var inst = new this(attributes);
        return inst;
    },
    update : function(id, attributes, callbacks){
        
        var inst = this.store.find_one(id);
        inst.set_attributes(attributes);
        return inst;
    }
},
{
    
})