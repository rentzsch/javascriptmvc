MVC.StatefulController = MVC.Controller.extend(
/* @Static*/
{
    /*
     * Looks for controller actions and hooks them up to delegator
     */
    init: function(){
        this._super();
        if(!this.className) return;
        if( MVC.String.is_singular(this.className)) throw "Only plural names for stateful controller!";
    },
    /**
     * Returns a function that calls each instance.  This is used to call an event closure.
     * @param {Object} controller_name
     * @param {Object} f_name
     * @param {Object} element
     */
    event_closure: function( f_name, element){
		return MVC.Function.bind(function(event){
			var params = new MVC.Controller.Params({event: event, action: f_name   });
			for(var id in this.instances){
                var instance = this.instances[id];
                instance.params = params;
        		instance.action_name = f_name;
                this._dispatch_action(instance,f_name, params);
            }
		},this);
	},
    _get_instance: function(action_name, params){
        var ce = params.class_element();
        var instance = this.instances[ce.id];
        if(!instance){
            instance = new controller();
            this.instances[instance.id] = instance;
        }
        return instance;
    },
    instances : {}
},
{
    init: function(id){
        this.id =this.Class.className + (id || this.Class.className +"_"+MVC.get_random(10));
        this.Class.instances[this.id] = this;
        this.action_name = "init"
    },
    destroy: function(){
        //delete element and instance from list
        delete this.Class.instances[this.id];
        delete this;
    }
});