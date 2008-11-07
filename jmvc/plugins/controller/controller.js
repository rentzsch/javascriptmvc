// submitted by kangax
MVC.Object.is_number = function(o){
    return o &&(  typeof o == 'number' || ( typeof o == 'string' && !isNaN(o) ) );
};

/* Controllers respond to events such as mouseovers, clicks, and form submits. 
 * They do this by naming functions, 
 * also called actions, with combination css selector and event handlers.
 */
MVC.Controller = MVC.Class.extend(
/* @Static*/
{
    /*
     * Looks for controller actions and hooks them up to delegator
     */
    init: function(){
        if(!this.className) return;
        this.singularName =  MVC.String.singularize(this.className);
        if(!MVC.Controller.controllers[this.className]) MVC.Controller.controllers[this.className] = [];
        MVC.Controller.controllers[this.className].unshift(this);
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
        this.modelName = MVC.String.classize(
            MVC.String.is_singular(this.className) ? this.className : MVC.String.singularize(this.className)
        );
        //load tests
        if(include.get_env() == 'test'){
            var path = MVC.root.join('test/functional/'+this.className+'_controller_test.js');
    		
    		var exists = include.check_exists(path);
    		if (exists) {
				MVC.Console.log('Loading: "test/functional/' + this.className + '_controller_test.js"');
                include('../test/functional/'+this.className+'_controller_test.js');
			}
			else {
				MVC.Console.log('Test Controller not found at "test/functional/' + this.className + '_controller_test.js"');
				return;
			}
        }
        this._path =  include.get_path().match(/(.*?)controllers/)[1]+"controllers";
    },
    event_closure: function(f_name, element){
		return MVC.Function.bind(function(event){
			var params = new MVC.Controller.Params({event: event, element: element, action: f_name, controller: this  });
			return this.dispatch(f_name, params);
		}, this);
	},
    subscribe_closure : function(f_name){
        return  MVC.Function.bind(function(event_name, data){
            var params = data || {};
            params.action = f_name;
            params.controller = this;
            params.event_name = event_name;
			return this.dispatch(f_name,  new MVC.Controller.Params( params)  );
		},this);
    },
    dispatch_closure: function(f_name){
        return MVC.Function.bind(function(params){
            params = params || {};
            params.action = f_name;
            params.controller = this;
            params = params.constructor == MVC.Controller.Params ? params : new MVC.Controller.Params(params)
			return this.dispatch(f_name,  params );
		},this);
    },
    /**
     * Calls the Controller prototype function specified by controller and action_name with the given params.
     * @param {Controller/String} controller The controller class or its className (i.e. 'todos').
     * @param {String} action_name The name of the action to be called.
     * @param {Controller.Params} params The params the action will be called with.
     */
    dispatch: function(action_name, params){
		if(!action_name) action_name = 'index';
		
		if(typeof action_name == 'string'){
			if(!(action_name in this.prototype) ) throw 'No action named '+action_name+' was found for '+this.Class.className+' controller.';
		}else{ //action passed TODO:  WHERE IS THIS USED?
			action_name = action_name.name;
		}
        var instance = this._get_instance(action_name , params);
		return this._dispatch_action(instance,action_name, params );
	},
    _get_instance : function(action_name,  params){
          return new this(action_name, params);
    },
	_dispatch_action: function(instance, action_name, params){
        instance.params = params;
		instance.action_name = action_name;
		return instance[action_name](params);
	},
    controllers : {},
    actions: [],
    publish: function(message, params){
        //var subscribers = MVC.Controller.SubscribeAction.events[message];
        //if(!subscribers) return;
        //for(var i =0 ; i < subscribers.length; i++){
        //    subscribers[i](params);
        //}
        OpenAjax.hub.publish(message, params);
    },
    get_controller_with_name_and_action: function(controller_name, action) {
        var controllers = MVC.Controller.controllers[controller_name];
        if(!controllers) return null;
		for(var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];
            if (controller.prototype[action]) return controller;
        }
        return null;
     }
},
/* @Prototype*/
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
		if(!action) action = this.action_name+'ing';
		if(typeof this[action] != 'function'){ throw 'There is no action named '+action+'. ';}
		return MVC.Function.bind(function(){
			this.action_name = action;
			this[action].apply(this, arguments);
		}, this);
	},
    delay: function(delay, action_name, params){
		if(typeof this[action_name] != 'function'){ throw 'There is no action named '+action_name+'. ';}
		
        return setTimeout(MVC.Function.bind(function(){
			this.Class._dispatch_action(this, action_name ,  params )
		}, this), delay );
    },
    publish: function(message, params){
        this.Class.publish(message,params);
    }
});



/*
 * Genaric base action.  This must provide a matches base function.
 */
MVC.Controller.Action = MVC.Class.extend(
{
    init: function(){
        if(this.matches) MVC.Controller.actions.push(this);
    }
},{
    init: function(action, f, controller){
        this.action = action;
        this.func = f;
        this.controller = controller;
    }
});
MVC.Controller.SubscribeAction = MVC.Controller.Action.extend(
/* @Static*/
{
    match: new RegExp("(.*?)\\s?(subscribe)$"),
    matches: function(action_name){
        return this.match.exec(action_name);
    }
},
/* @Prototype*/
{
    init: function(action, f, controller){
        this._super(action, f, controller);
        this.message();
        OpenAjax.hub.subscribe(this.message_name, this.controller.subscribe_closure(action ) );
        //if(!this.Class.events[this.message_name]) this.Class.events[this.message_name] = [];
        //var cb = this.controller.subscribe_closure(action );
        //this.Class.events[this.message_name].push(cb);
    },
    message: function(){
        this.parts = this.action.match(this.Class.match);
        this.message_name = this.parts[1];
    }
})
/*
 * Default EventDelegation based actions
 */
MVC.Controller.DelegateAction = MVC.Controller.Action.extend({
/* @Static*/
    match: new RegExp("^(?:(.*?)\\s)?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|resize|scroll|select|submit|dblclick|focus|blur|load|unload)$"),
    /*
     * Matches change, click, contextmenu, dblclick, keydown, keyup, keypress, mousedown, mousemove, 
     * mouseout, mouseover, mouseup, reset, resize, scroll, select, submit, dblclick, 
     * focus, blur, load, unload
     * @return {Boolean} true if a prototype function name matches an action.
     */
    matches: function(action_name){
        return this.match.exec(action_name);
    }
},
/* @Prototype*/
{    
    init: function(action, f, controller){
        this._super(action, f, controller);
        this.css_and_event();
        
        var selector = this.selector();
        if(selector != null){
            new MVC.Delegator(selector, this.event_type, 
                this.controller.dispatch_closure(action ) );
        }
    },
    /*
     * Splits the action name into its css and event parts.
     */
    css_and_event: function(){
        this.parts = this.action.match(this.Class.match);
        this.css = this.parts[1] || "";
        this.event_type = this.parts[2];
    },
    /*
     * Deals with main controller specific delegation (blur and focus)
     */
    main_controller: function(){
	    if(!this.css && MVC.Array.include(['blur','focus'],this.event_type)){
            MVC.Event.observe(window, this.event_type, this.controller.event_closure( this.event_type, window) );
            return;
        }
        return this.css;
    },
    /*
     * Handles a plural controller name
     * @return {String} the css with the controller name included
     */
    plural_selector : function(){
		if(this.css == "#" || this.css.substring(0,2) == "# "){
			var newer_action_name = this.css.substring(2,this.css.length);
            return '#'+this.controller.className + (newer_action_name ?  ' '+newer_action_name : '') ;
		}else{
			return '.'+MVC.String.singularize(this.controller.className)+(this.css? ' '+this.css : '' );
		}
	},
    /*
     * Handles a singular controller name
     * @return {String} the css with the controller name included
     */
    singular_selector : function(){
        return '#'+this.controller.className+(this.css? ' '+this.css : '' );
    },
    /*
     * Gets the full css selector for this action
     * @return {String/null} returns a string css if Delegator should be used, null if otherwise.
     */
    selector : function(){
        if(MVC.Array.include(['load','unload','resize','scroll'],this.event_type)){
            MVC.Event.observe(window, this.event_type, this.controller.event_closure(this.event_type, window) );
            return;
        }
        
        
        if(this.controller.className == 'main') 
            this.css_selector = this.main_controller();
        else
            this.css_selector = MVC.String.is_singular(this.controller.className) ? 
                this.singular_selector() : this.plural_selector();
        return this.css_selector;
    }
});

/* @Constructor
 * Instances of Controller.Params are passed to Event based actions.
 * 
 * <h3>Example</h3>
 * <pre><code>MVC.Controller.extend('todos', {
   mouseover : function(params){ 
      <span class="magic">params</span>.element.style.backgroundColor = 'Red';
   },
   mouseout : function(params){
      <span class="magic">params</span>.element.style.backgroundColor = '';
      <span class="magic">params</span>.event.stop();
   },
   "img click" : function(params){
   	  <span class="magic">params</span>.class_element().parentNode.removeSibiling(params.class_element());
   }
})</code></pre>
 * @init Creates a new Controller.Params object.
 * @param {Object} params An object you want to pass to a controller
 */

MVC.Controller.Params = function(params){
	var params = params || {};
    var killed = false;
	this.kill = function(){
		killed = true;
        if(params.event && params.event.kill) params.event.kill();
	};
	this.is_killed = function(){return params.event.is_killed ?  params.event.is_killed() :  killed ;};
    
    for(var thing in params){
		if( params.hasOwnProperty(thing) ) this[thing] = params[thing];
	}
    this.constructor = MVC.Controller.Params;
};

/* @Prototype*/
MVC.Controller.Params.prototype = {
	/*
	 * Returns data in a hash for a form.
	 * @return {Object} Nested form data.
	 */
    form_params : function(){
		var data = {};
		if(this.element.nodeName.toLowerCase() != 'form') return data;
		var els = this.element.elements, uri_params = [];
		for(var i=0; i < els.length; i++){
			var el = els[i];
			if(el.type.toLowerCase()=='submit') continue;
			var key = el.name || el.id, key_components = key.match(/(\w+)/g), value;
            if(!key) continue;     
			/* Check for checkbox and radio buttons */
			switch(el.type.toLowerCase()) {
				case 'checkbox':
				case 'radio':
					value = !!el.checked;
					break;
				default:
					value = el.value;
					break;
			}
			//if( MVC.Object.is_number(value) ) value = parseFloat(value);
			if( key_components.length > 1 ) {
				var last = key_components.length - 1;
				var nested_key = key_components[0].toString();
				if(! data[nested_key] ) data[nested_key] = {};
				var nested_hash = data[nested_key];
				for(var k = 1; k < last; k++){
					nested_key = key_components[k];
					if( ! nested_hash[nested_key] ) nested_hash[nested_key] ={};
					nested_hash = nested_hash[nested_key];
				}
				nested_hash[ key_components[last] ] = value;
			} else {
		        if (key in data) {
		        	if (typeof data[key] == 'string' ) data[key] = [data[key]];
		         	data[key].push(value);
		        }
		        else data[key] = value;
			}
		}
		return data;
	},
    /*
     * Returns the class element for the element selected
     * @return {HTMLElement} the element that shares the controller's id or classname
     */
	class_element : function(){
		var start = this.element;
		var className = this._className();
		while(start && start.className.indexOf(className) == -1 ){
			start = start.parentNode;
			if(start == document) return null;
		}
		return MVC.$E(start);
	},
    /*
     * Returns if the event happened directly on the element in the params.
     * @return {Boolean} true if the event's target is the element, false if otherwise.
     */
	is_event_on_element : function(){ return this.event.target == this.element; },
	_className : function(){
		return this.controller.singularName;
	},
    element_instance : function(){
        var model, matcher, modelName = this.controller.modelName || this._className();
        if(! (model=MVC.Model.models[modelName])  ) throw "No model for the "+ modelName+ " controller!";
        matcher = new RegExp("^"+modelName+"_(.*)$");
        var id = this.class_element().id.match(matcher)[1];
	    return model.store.find_one(id);
    }
};

if(!MVC._no_conflict && typeof Controller == 'undefined'){
	Controller = MVC.Controller
}