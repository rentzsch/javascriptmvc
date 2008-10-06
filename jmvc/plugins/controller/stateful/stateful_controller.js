MVC.StatefulController = MVC.Class.extend(
/*@Static*/
{
    /*
     * Looks for controller actions and hooks them up to delegator
     */
    init: function(){
        if(!this.className) return;
        if( MVC.String.is_singular(this.className)) throw "Only plural names for stateful controller!";
        this.singularName =  MVC.String.singularize(this.className);
        
        MVC.Controller.controllers[this.className] = [this];

        var val, act;
        this.actions = {};
        for(var action_name in this.prototype){
    		val = this.prototype[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        this.actions[action_name] =new act(action_name, val, this);
                    }
                }
            }
	    }
        this.modelName = MVC.String.classize(MVC.String.singularize(this.className));
        //load tests
        if(include.get_env() == 'test'){
            var path = MVC.root.join('test/functional/'+this.className+'_controller_test.js');
    		var exists = include.check_exists(path);
    		if(exists)
    			MVC.Console.log('Loading: "test/functional/'+this.className+'_controller_test.js"');
    		else {
    			MVC.Console.log('Test Controller not found at "test/functional/'+this.className+'_controller_test.js"');
    			return;
    		}
    		var p = include.get_path();
    		include.set_path(MVC.root.path);
    		include('test/functional/'+ this.className+'_controller_test.js');
    		include.set_path(p);
        }
        this._path =  include.get_path().match(/(.*?)controllers/)[1]+"controllers";
    },
    add_kill_event: function(event){ //this should really be in event
		if(!event.kill){
			var killed = false;
			event.kill = function(){
				killed = true;
				if(!event) event = window.event;
			    try{
				    event.cancelBubble = true;
				    if (event.stopPropagation)  event.stopPropagation(); 
				    if (event.preventDefault)  event.preventDefault();
			    }catch(e){}
			};
			event.is_killed = function(){return killed;};
		}	
	},
    /**
     * Returns a function that calls each instance.  This is used to call an event closure.
     * @param {Object} controller_name
     * @param {Object} f_name
     * @param {Object} element
     */
    event_closure: function(controller_name, f_name, element){
		return MVC.Function.bind(function(event){
			MVC.Controller.add_kill_event(event);
			var params = new MVC.Controller.Params({event: event, action: f_name, controller: controller_name   });
			for(var id in this.instances){
                var instance = this.instances[id];
                instance.params = params;
        		instance.action_name = f_name;
                MVC.Controller._dispatch_action(instance,f_name, params);
            }
		},this);
	},
    dispatch_closure: function(controller_name, f_name){
        return function(params){
            MVC.Controller.add_kill_event(params.event);
            params.action = f_name;
            params.controller = controller_name;
			return MVC.Controller.dispatch(controller_name, f_name, 
                new MVC.Controller.Params(params)
            );
		};
    },
    publish_closure: function(controller_name, f_name){
        return function(params){
            params.action = f_name;
            params.controller = controller_name;
			return MVC.Controller.dispatch(controller_name, f_name, 
                new MVC.Controller.Params(params)
            );
		};
    },
    /**
     * Calls the Controller prototype function specified by controller and action_name with the given params.
     * @param {Controller/String} controller The controller class or its className (i.e. 'todos').
     * @param {String} action_name The name of the action to be called.
     * @param {Controller.Params} params The params the action will be called with.
     */
    dispatch: function(controller, action_name, params){
		var c_name = controller;
		if(typeof controller == 'string'){
            controller = MVC.Controller.controllers[c_name][0];
        }
		if(!controller) throw 'No controller named '+c_name+' was found for MVC.Controller.dispatch.';
		if(!action_name) action_name = 'index';
		
		if(typeof action_name == 'string'){
			if(!(action_name in controller.prototype) ) throw 'No action named '+action_name+' was found for '+c_name+'.';
		}else{ //action passed
			action_name = action_name.name;
		}
        //we need to 'go up' until we find the class, check the id, and return the instance
        var ce = params.class_element();
        //now if never created, create?
        
        var instance = this.instances[ce.id];
        if(!instance){
            instance = new controller();
            this.instances[instance.id] = instance;
        }
		//var instance = new controller();
		instance.params = params;
		instance.action_name = action_name;
		return MVC.Controller._dispatch_action(instance,action_name, params );
	},
	_dispatch_action: function(instance, action_name, params){
		return instance[action_name](params);
	},
    controllers : [],
    actions: [],
    publish: function(message, params){
        var subscribers = MVC.Controller.SubscribeAction.events[message];
        if(!subscribers) return;
        for(var i =0 ; i < subscribers.length; i++){
            subscribers[i](params);
        }
    },
    instances : {}
},
/*@Prototype*/
{
    /*
     * Returns a function that when called, calls the action with parameters passed to the function. 
     * This is very useful for creating callbacks for Ajax functionality. 
     * The callback is called on the same controller instance that created the callback. 
     * This allows you to easily pass objects between request and response without resorting to closures. 
     * Example:
<pre><code>Controller('todos',{
   "a click" : function(params){ 
      this.element = params.element;
	  this.element.innerHTML = 'deleting ...';
	  new Ajax.Request('delete', {onComplete: <span class="magic">this.continue_to('deleted')</span>}
   },
   deleted : function(response){
      this.element.parentNode.removeChild(this.element);
   }
});</code></pre>
     * @param {String} action Name of prototype function you want called
     * @return {Function} function that when called, directs to another controller function
     */
    continue_to :function(action){
		if(!action) action = this.action.name+'ing';
		if(typeof this[action] != 'function'){ throw 'There is no action named '+action+'. ';}
		return MVC.Function.bind(function(){
			this.action_name = action;
			this[action].apply(this, arguments);
		}, this);
	},
    delay: function(delay, action_name){
		if(typeof this[action_name] != 'function'){ throw 'There is no action named '+action_name+'. ';}
		
        return setTimeout(MVC.Function.bind(function(){
			this.action_name = action_name;
			this[action_name].apply(this, arguments);
		}, this), delay );
    },
    dispatch_delay: function(delay, action_name, params){
        var controller_name = action_name.controller ? action_name.controller : this.Class.className;
        action_name = typeof action_name == 'string' ? action_name : action_name.action;
        return setTimeout(function(){
            MVC.Controller.dispatch(controller_name,action_name, params );
        }, delay );
    },
    publish: function(message, params){
        this.Class.publish(message,params);
    },
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