
/* 
 * Controllers respond to events. If something happens in your application, be it a click, or
 * a [MVC.Model Model] being updated, a controller should respond to it.
 * <h3>Example</h3>
@code_start
//Instead of:
$('.tasks').click(function(e){ ... })
//do this
TasksController = MVC.Controller.extend('tasks',{
  click: function(params){...}
})
@code_end
 * <h2>Actions</h2>
 * To respond to events, controllers simply name their event handling functions to match
 * an [MVC.Controller.Action Action].  
 *
 * In the previous example, TasksController's click action is matched by the [MVC.Controller.Action.Event Event] Action. 
 * Event matches functions that are combination of CSS selector and event name.  Here's another example:
@code_start
TasksController = MVC.Controller.extend('tasks',{
  ".delete mouseover": function(params){ ... }
})
@code_end
 * <h3>Types of Actions</h3>
 * There are many types of Actions.  By default, Controller will match [MVC.Controller.Action.Event Event] and
 * [MVC.Controller.Action.Subscribe Subscribe] actions.  To match other actions, include their plugins.
 * 
<table>
	<tr>
        <th>Action</th><th>Format</th><th>Description</th>
    </tr>
    <tbody  style="font-size: 10px;">
    <tr>
        <td>[MVC.Controller.Action.Event Event]</td>
        <td>[CSS] [change|click|...]</td>
        <td>Matches standard DOM events</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Subscribe Subscribe]</td>
        <td>[OpenAjax.hub event] subscribe</td>
        <td>Subscribes this action to OpenAjax hub.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Drag Drag]</td>
        <td>[CSS] [dragstart|dragging|...]</td>
        <td>Matches events on a dragged object</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Drop Drop]</td>
        <td>[CSS] [dropadd|dropover|...]</td>
        <td>Matches events on a droppable object</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.EnterLeave EnterLeave]</td>
        <td>[CSS] [mouseenter|mouseleave.]</td>
        <td>Similar to mouseover, mouseout, but handles nested elements.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Hover Hover]</td>
        <td>[CSS] [hoverenter|hoverleave.]</td>
        <td>Similar to mouseenter, but only gets called if the user stops on an element.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Lasso Lasso]</td>
        <td>[CSS] [lassostart|...]</td>
        <td>Allows you to lasso elements.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Selectable Selectable]</td>
        <td>[CSS] [selectadd|...]</td>
        <td>Matches events on elements that can be selected by the lasso.</td>
    </tr>
    </tbody>
</table>
 * 
 * <h2>Naming Controllers</h2>
 * Controllers use their name to limit the DOM they act upon.  Depending if the controller name is 
 * plural, singular or main, it changes which elements it responds to.
 * <h3>Singular Controllers</h3>
 * Singluar controllers respond to events in or on an element with an id that matches the controller name.
@code_start
//matches &lt;div id="file_manager"&gt;&lt;/div&gt;
FileManagerController = MVC.Controller.extend('file_manager')
@code_end
 * <h3>Plural Controllers</h3>
 * Plural controllers respond to events in or on elements with classNames that match the singular 
 * controller name.
@code_start
//matches &lt;div class="task"&gt;&lt;/div&gt;
TasksController = MVC.Controller.extend('tasks')
@code_end
 * If you want to match events on an element with the id, add '#' to the start of your action.  For example:
@code_start
TasksController = MVC.Controller.extend('tasks',{
  click : function(){ .. }     //matches &lt;div class="task"&gt;&lt;/div&gt;
  "# click" : function(){ .. } //matches &lt;div id="tasks"&gt;&lt;/div&gt;
})
@code_end
 * <h3>Main Controllers</h3>
 * Controllers with the name 'main' can match events anywhere in the DOM.  
 * 
 * <h2>Params</h2>
 * Controller actions get called with an instance of [MVC.Controller.Params].  Params
 * provide aditional functionality based on the param data.  Killing events is a good example.
 * Some actions get called with classes that inherit from MVC.Controller.Params.
 * Check your action's params for the data that gets passed to your event handling functions.
 */
MVC.Controller = MVC.Class.extend(
/* @Static*/
{
    /*
     * Looks for controller actions and hooks them up to delegator
     */
    init: function(){
        if(!this.className) return;
        this.underscoreName = MVC.String.underscore(this.className.replace(/controller/i,""))
        this.singularName =  MVC.String.singularize(this.underscoreName);
        if(!MVC.Controller.controllers[this.underscoreName]) MVC.Controller.controllers[this.underscoreName] = [];
        MVC.Controller.controllers[this.underscoreName].unshift(this);
        var val, act;
        if(!this.modelName)
            this.modelName = MVC.String.is_singular(this.underscoreName) ? this.underscoreName : MVC.String.singularize(this.underscoreName)
        
        if(this._should_attach_actions)
            this._create_actions();
        //load tests
        if(include.get_env() == 'test'){
            var path = MVC.root.join('test/functional/'+this.underscoreName+'_controller_test.js');
    		var exists = include.check_exists(path);
    		if (exists) {
				MVC.Console.log('Loading: "test/functional/' + this.underscoreName + '_controller_test.js"');
                include('../test/functional/'+this.underscoreName+'_controller_test.js');
			}
			else {
				MVC.Console.log('Test Controller not found at "test/functional/' + this.underscoreName + '_controller_test.js"');
			}
        }
        this._path =  include.get_path().match(/(.*?)controllers/)[1]+"controllers";
    },
    _should_attach_actions : true,
    _create_actions : function(){
        this.actions = {};
        for(var action_name in this.prototype){
    		val = this.prototype[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        var callback = this.dispatch_closure(action_name);
                        this.actions[action_name] =new act(action_name, callback, this.underscoreName, this._element, this);
                        continue; // no need to check others
                    }
                }
            }
	    }
    },
    dispatch_closure: function(f_name){
        var self = this;
        return function(){
            var args = jQuery.makeArray(arguments);
            args.unshift(f_name);
			return self.dispatch.apply(self,args);
		};
    },
    /**
     * Calls the Controller prototype function specified by action_name with the given params.
     * @param {String} action_name The name of the action to be called.
     * @param {Controller.Params} params The params the action will be called with.
     */
    dispatch: function(){
		var args = jQuery.makeArray(arguments);
        var action_name = args.shift();

		if(!(action_name in this.prototype) ) throw 'No action named '+action_name+' was found for '+this.Class.underscoreName+' controller.';

        var instance = this._get_instance(action_name , args);
		return this._dispatch_action(instance,action_name, args );
	},
    _get_instance : function(action_name,  args){
          return new this(action_name, args);
    },
	_dispatch_action: function(instance, action_name, args){
        if(!this._listening) return;
        instance.args = args;
		instance.action_name = action_name;
        return instance[action_name].apply(instance, args);
	},
    controllers : {},
    actions: [],
    publish: function(){
        OpenAjax.hub.publish.apply(OpenAjax.hub, arguments);
    },
    get_controller_with_name_and_action: function(controller_name, action) {
        var controllers = MVC.Controller.controllers[controller_name];
        if(!controllers) return null;
		for(var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];
            if (controller.prototype[action]) return controller;
        }
        return null;
     },
     /**
      * The name of the model this controller can uses for param functions like element_instance
      */
     modelName: null,
     /**
      * A flag if controllers can respond to events.
      */
     _listening : true,
     _events : MVC.Delegator.events,
     _element : document.documentElement
},
/* @Prototype*/
{
    /*
     * Returns a function that when called, calls the action with parameters passed to the function. 
     * This is very useful for creating callbacks for Ajax functionality. 
     * The callback is called on the same controller instance that created the callback. 
     * This allows you to easily pass objects between request and response without resorting to closures. 
     * Example:
@code_start
Controller('todos',{
   "a click" : function(params){ 
      this.element = params.element;
	  this.element.innerHTML = 'deleting ...';
	  new Ajax('delete', {onComplete: this.continue_to('deleted')}
   },
   deleted : function(response){
      this.element.parentNode.removeChild(this.element);
   }
});
@code_end
     * @param {String} action Name of prototype function you want called
     * @return {Function} function that when called, directs to another controller function
     */
    callback :function(action){
		var args = MVC.Array.from(arguments)
        var action = args.shift();
		if(typeof this[action] != 'function'){ throw 'There is no action named '+action+'. ';}
		return MVC.Function.bind(function(){
			this.action_name = action;
			this[action].apply(this, args.concat(MVC.Array.from(arguments)));
		}, this);
	},
    /**
     * Calls an action after some delay
     * @param {Object} delay
     * @param {Object} action_name
     */
    delay: function(action_name, delay){
        var args = MVC.Array.from(arguments)
        var action_name = args.shift();
        var delay = args.shift() || 1000;
		if(typeof this[action_name] != 'function'){ throw 'There is no action named '+action_name+'. ';}
		
        return setTimeout(MVC.Function.bind(function(){
			this.Class._dispatch_action(this, action_name ,  args )
		}, this), delay );
    },
    /**
     * Publishes a message to OpenAjax.hub.  Other controllers 
     * @param {String} message
     * @param {Object} data
     */
    publish: function(){
        OpenAjax.hub.publish.apply(OpenAjax.hub, arguments);
    }
});



/*
 * MVC.Controller.Action is and abstract base class.
 * Controller Action classes are used to match controller prototype functions. 
 * Inheriting classes must provide a static matches function.
 * 
 * When a new controller is created, it iterates through its prototype functions and tests
 * each action if it matches.  If there is a match, the controller creates a new action.
 * 
 * The action is responsible to callback the function when appropriate.  It typically uses
 * dispatch_closure to call functions appropriately.  
 */
MVC.Class.extend("MVC.Controller.Action",
/* @Static */
{
    matches: function(action_name){
        if(!this.match) return null;
        return this.match.exec(action_name);
    },
    /**
     * If the class has provided a matches function, adds this class to the list of 
     * controller actions.
     */
    init: function(){
        if(this.matches) MVC.Controller.actions.push(this);
    }
},
/* @Prototype */
{
    /**
     * Called with prototype functions that match this action.
     * @param {String} action_name
     * @param {Function} f
     * @param {MVC.Controller} controller
     */
    init: function(action_name, callback, className, element, controller){
        this.action = action_name;
        this.callback = callback;
        this.underscoreName = className;
        this.element = element;
        this.controller = controller;
        
    },
    /**
     * Disables an action.
     */
    destroy: function(){
        
    },
    /*
     * Splits the action name into its css and event parts.
     */
    css_and_event: function(){
        this.parts = this.action.match(this.Class.match);
        this.css = this.parts[1] || "";
        this.event_type = this.parts[2];
    },
    selector : function(){
        if(this.underscoreName.toLowerCase() == 'main') 
            return this.css;
        else{
            if(MVC.String.is_singular(this.underscoreName)){
                
                if(this.element == document.documentElement)
                    return '#'+this.underscoreName+(this.css ? ' '+this.css : '' );
                else
                    return this.css;
            }else{
                if(this.css == "#" || this.css.substring(0,2) == "# "){
        			var newer_action_name = this.css.substring(2,this.css.length)
                    if(this.element == document.documentElement){
                        return '#'+this.underscoreName + (newer_action_name ?  ' '+newer_action_name : '') ;
                    }else{
                        return (newer_action_name ?  ' '+newer_action_name : '') ;
                    }
        		}else{
    			    return '.'+MVC.String.singularize(this.underscoreName)+(this.css? ' '+this.css : '' );
        		}
            }
        }
    },
    delegates : function(){
        return jQuery.data(this.element, "delegates") || jQuery.data(this.element, "delegates",{});
    }
});
/**
 * Subscribes to an OpenAjax.hub event.
 * <h3>Example</h3>
@code_start javascript
TasksController = MVC.Controller.extend('tasks',
{
  "task.create subscribe" : function(params){
     var published_data = params.data; //published data always in params.data
  }
});
@code_end
 */
MVC.Controller.Action.extend("MVC.Controller.Action.Subscribe",
/* @Static*/
{
    
    match: new RegExp("(.*?)\\s?(subscribe)$")
},
/* @Prototype*/
{
    /**
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element, controller){
        this._super(action_name, callback, className, element, controller);
        this.message();
        this.subscription = OpenAjax.hub.subscribe(this.message_name, MVC.Function.bind(this.subscribe, this) );
    },
    /**
     * Gets the message name from the action name.
     */
    message: function(){
        this.parts = this.action.match(this.Class.match);
        this.message_name = this.parts[1];
    },
    subscribe : function(event_name, data){
        var params = data || {};
        params.event_name = event_name
        this.callback(params)
    },
    destroy : function(){
        OpenAjax.hub.unsubscribe(this.subscription)
        this._super();
    }
});
/*
 * Default event delegation based actions
 */
MVC.Controller.Action.extend("MVC.Controller.Action.Event",
/* @Static*/
{
    /**
     * Matches change, click, contextmenu, dblclick, keydown, keyup, keypress, mousedown, mousemove, mouseout, mouseover, mouseup, reset, resize, scroll, select, submit, dblclick, focus, blur, load, unload
     * @param {Object} action_name
     */
    match: new RegExp("^(?:(.*?)\\s)?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|resize|scroll|select|submit|dblclick|focus|blur|load|unload)$")
},
/* @Prototype*/
{    
    init: function(action_name, callback, className, element, controller){
        this._super(action_name, callback, className, element, controller);
        this.css_and_event();
        
        var selector = this.selector();
        if(selector != null){
            this.delegator = new MVC.Delegator(selector, this.event_type, this.get_callback(), element );
        }
    },
    get_callback : function(){
        var controller = this.controller;
        var cb = this.callback;
        var jquery_element = this.jquery_element;
        return function(event){
            cb.call(null, jquery_element(this, controller), event);
        }
       },

	jquery_element: function(element, controller) {
		var jq = jQuery(element);
		jq.controller = controller;
		return jq;
    },
    
    /*
     * Deals with main controller specific delegation (blur and focus)
     */
    main_controller: function(){
	    if(!this.css && MVC.Array.include(['blur','focus'],this.event_type)){
            //todo
            var self = this;
            jQuery.event.add( window , this.event_type , 
                function(event){
                    self.callback($(window), event  )
                }
            );
            
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
			var newer_action_name = this.css.substring(2,this.css.length)
            if(this.element == document.documentElement){
                return '#'+this.underscoreName + (newer_action_name ?  ' '+newer_action_name : '') ;
            }else{
                return (newer_action_name ?  ' '+newer_action_name : '') ;
            }
		}else{
            //if(this.element == document.documentElement){
			    return '.'+MVC.String.singularize(this.underscoreName)+(this.css? ' '+this.css : '' );
            //}else{
            //    return this.css;
            //}
		}
	},
    /*
     * Handles a singular controller name
     * @return {String} the css with the controller name included
     */
    singular_selector : function(){
        if(this.element == document.documentElement)
            return '#'+this.underscoreName+(this.css? ' '+this.css : '' );
        else
            return this.css;
    },
    /*
     * Gets the full css selector for this action
     * @return {String/null} returns a string css if Delegator should be used, null if otherwise.
     */
    selector : function(){
        if(MVC.Array.include(['load','unload','resize','scroll'],this.event_type)){
            this.attach_window_event_handler(this.event_type);
            return;
        }
        //if(!this.underscoreName){
        //    this.css_selector = this.css
        //}else 
        if(this.underscoreName.toLowerCase() == 'main') 
            this.css_selector = this.main_controller();
        else
            this.css_selector = MVC.String.is_singular(this.underscoreName) ? 
                this.singular_selector() : this.plural_selector();
        return this.css_selector;
    },
    
    attach_window_event_handler: function(event_type) {
        var self = this;
        
        jQuery.event.add(window, event_type,
            function(event) {
                self.callback($(window), event);
            }
        );
    },
    
    destroy : function(){
        if(this.delegator) this.delegator.destroy();
        this._super();
    }
});



jQuery.fn.controllerParent = function(){
    return this.parent("."+this.controller.singularName)
}
jQuery.fn.instance = function(){
    var el = this[0];
    var model, modelName = this.controller.modelName; 
    if(! (model=MVC.Model.models[this.controller.modelName])  ) throw "No model for "+ this.controller.fullName+ "!";
    return Model._find_by_element(el, modelName, model)
}

