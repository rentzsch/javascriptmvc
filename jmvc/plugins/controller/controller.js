/**
 * Controller.Stateful provides state for controller instances.  Controller.Stateful is  useful for
 * creating self-contained widgets or when there are many instances of an object that has complex state.  
 * Read the <a href="http://docs.javascriptmvc.com/demos/fixedbox.html">fixedbox demo</a>
 * for good an example of using Controller.Stateful.
 * <h2>Example</h2>
 * The following is a a small piece of the SliderController.
 * @code_start
 * SliderController = jQuery.Controller.Stateful('slider',{
 *   init : function(element, options){
 *     this.options = options ||{}
 *     this._super(jQuery.$E(element))
 *   },
 *   '.slider dragstart' : function(params){
 *       params.horizontal()
 *   },
 *   '.slider dragging' : function(params){
 *     //check pos
 *     this.options.sliding(pos, params) //callback with position
 *   }
 * })
 * @code_end
 * You would create a new Slider like:
 * @code_start
 * new SliderController('element_id',{sliding: function(pos){console.log(pos)});
 * @code_end
 * <h2>Naming</h2>
 * Naming works just similar to regular controllers.  If the Controller's className is plural, it will insert an implicit
 * <i>.singular_name</i> before this controller's [jQuery.Controller.Action.Event|event actions].  If the controller is a singular name
 * nothing is added to the delegation class name.
 * <h2>How Stateful works</h2>
 * New stateful instances create a new delegation listening point on the element passed into the base 
 * [jQuery.Controller.Stateful.prototype.init|init] function.  As events happen on the element or child elements
 * of the instance, they call back to the controller instance.
 */
jQuery.Controller = jQuery.Class.extend(
/* @Static*/
{
    init : function(){
        if(!this.className) return;
        this.underscoreName = jQuery.String.underscore(this.className.replace(/controller/i,""))
        this.singularName =  jQuery.String.singularize(this.underscoreName);
        this.underscoreControllerName = jQuery.String.underscore(this.fullName.replace('.','_'));
        //Don't need these b/c history will uses openAjax
		//if(!jQuery.Controller.controllers[this.underscoreName]) jQuery.Controller.controllers[this.underscoreName] = [];
        //jQuery.Controller.controllers[this.underscoreName].unshift(this);
        var val, act;
        if(!this.modelName)
            this.modelName = jQuery.String.is_singular(this.underscoreName) ? this.underscoreName : jQuery.String.singularize(this.underscoreName)

        //load tests (will implement later)

        //this._path =  jQuery.include.get_path().match(/(.*?)controllers/)[1]+"controllers";
        var controller = this;
        jQuery.fn[jQuery.String.underscore(this.fullName)] = function(){
            var instances = [];
            var args = jQuery.makeArray(arguments);
            for(var i =0; i < this.length; i++){
                args.unshift(this[i]);
                var inst = jQuery.data(this[i], controller.fullName);
                instances.push( inst ? 
                                inst :
                                controller.newInstance.apply(controller, args)
                )
                args.shift();
            }
            return instances;
        }
        //add a helper for jQuery
    },
	actions : []
},
/* @Prototype */
{
    /**
     * Called when aa new instance is created.  you must provide 
     * @param {HTMLElement} element the element this instance operates on.
     */
    init: function(element){
        //needs to go through prototype, and attach events to this instance
        jQuery.className.add(element,  this.Class.underscoreControllerName );
        this._actions = [];
        for(var action_name in this){
    		var val = this[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < jQuery.Controller.actions.length; a++){
                    var act = jQuery.Controller.actions[a];
                    if(act.matches(action_name)){
                        var callback = this.dispatch_closure(action_name);
                        this._actions.push(new act(action_name, callback, this.Class.underscoreName,element, this ));
                    }
                }
            }
	    }
        this.action_name = "init";
        this.element = jQuery(element);
        jQuery.data(element, this.Class.fullName, this);
    },

    /**
     * Removes all actions on this instance.
     */
    destroy: function(){
        if(this._destroyed) throw this.Class.className+" controller instance has already been deleted";
        for(var i = 0; i < this._actions.length; i++){
            this._actions[i].destroy();
        }
		delete this._actions;
		this._destroyed = true;
		//clear element
        this.element.removeData( this.Class.fullName);
		this.element = null;
    },
    /**
     * Used to call back to this instance
     * @param {Object} f_name
     */
    dispatch_closure: function(f_name){
        var self = this;
        return jQuery.Function.bind(function(){
            self.args = arguments;
    		self.called = f_name;
            return self[f_name].apply(self, arguments);
        })

    },
    /**
     * Queries from the current element.
     * @param {Object} selector
     */
    find: function(selector){
        return this.element.find(selector);
    }
});


jQuery.fn.controller = function(){
    var controllerNames = jQuery.Array.from(arguments);
    //check if arguments
    var instances = [];
    var instance_data = jQuery.data(this[0], "instances");
    for(var i =0; i < controllerNames.length; i++){
        //check if there is an instance
        if(!instance_data[ controllerNames[i] ])
            instance_data[ controllerNames[i] ]
    }
};





/*
 * jQuery.Controller.Action is and abstract base class.
 * Controller Action classes are used to match controller prototype functions. 
 * Inheriting classes must provide a static matches function.
 * 
 * When a new controller is created, it iterates through its prototype functions and tests
 * each action if it matches.  If there is a match, the controller creates a new action.
 * 
 * The action is responsible to callback the function when appropriate.  It typically uses
 * dispatch_closure to call functions appropriately.  
 */
jQuery.Class.extend("jQuery.Controller.Action",
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
        if(this.matches) jQuery.Controller.actions.push(this);
    }
},
/* @Prototype */
{
    /**
     * Called with prototype functions that match this action.
     * @param {String} action_name
     * @param {Function} f
     * @param {jQuery.Controller} controller
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
            if(jQuery.String.is_singular(this.underscoreName)){
                
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
    			    return '.'+jQuery.String.singularize(this.underscoreName)+(this.css? ' '+this.css : '' );
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
TasksController = jQuery.Controller.extend('tasks',
{
  "task.create subscribe" : function(params){
     var published_data = params.data; //published data always in params.data
  }
});
@code_end
 */
jQuery.Controller.Action.extend("jQuery.Controller.Action.Subscribe",
/* @Static*/
{
    
    match: new RegExp("(opener|parent|window)?(~)?(.*?)\\s?(subscribe)$")
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
        this.subscription = this.who.OpenAjax.hub.subscribe(this.message_name, callback );
    },
    /**
     * Gets the message name from the action name.
     */
    message: function(){
        var parts = this.action.match(this.Class.match);
        this.message_name = parts[3];
		this.who = parts[1] ? window[parts[1]] : window;
    },
    destroy : function(){
        OpenAjax.hub.unsubscribe(this.subscription)
        this._super();
    }
});
/*
 * Default event delegation based actions
 */
jQuery.Controller.Action.extend("jQuery.Controller.Action.Event",
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
            this.delegator = new jQuery.Delegator(selector, this.event_type, this.get_callback(), element );
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
	    if(!this.css && jQuery.Array.include(['blur','focus'],this.event_type)){
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
		//if someone has a plural selector, allow them to get the core element
		if(this.css == "#" || this.css.substring(0,2) == "# "){
			var newer_action_name = this.css.substring(2,this.css.length)
            return (newer_action_name ?  ' '+newer_action_name : '') ;

		}else{
            //if(this.element == document.documentElement){
			    return '.'+jQuery.String.singularize(this.underscoreName)+(this.css? ' '+this.css : '' );
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
        if(jQuery.Array.include(['load','unload','resize','scroll'],this.event_type)){
            var self = this;
            jQuery.event.add( window , this.event_type , 
                function(event){
                    self.callback($(window), event  )
                }
            );
            return;
        }
        //if(!this.underscoreName){
        //    this.css_selector = this.css
        //}else 
        if(this.underscoreName.toLowerCase() == 'main') 
            this.css_selector = this.main_controller();
        else
            this.css_selector = jQuery.String.is_singular(this.underscoreName) ? 
                this.singular_selector() : this.plural_selector();
        return this.css_selector;
    },
    destroy : function(){
        if(this.delegator) this.delegator.destroy();
        this._super();
    }
});



jQuery.fn.controllerElement = function(){
    return this.parents("."+this.controller.Class.singularName)
}
jQuery.fn.instance = function(){
    var el = this[0];
    var model, modelName = this.controller.modelName; 
    if(! (model=jQuery.Model.models[this.controller.modelName])  ) throw "No model for "+ this.controller.fullName+ "!";
    return Model._find_by_element(el, modelName, model)
}