/**
 * Controller.Stateful provides state for controller instances.  
 * Read the <a href="http://javascriptmvc.com/wiki/index.php?title=Controller.Stateful_Overview">overview page</a> 
 * and <a href="http://docs.javascriptmvc.com/demos/fixedbox.html">fixedbox demo</a>
 * for good descriptions of how to use Controller.Stateful.
 * 
 */
MVC.Controller.Stateful = MVC.Controller.extend(
/* @Static*/
{
    /*
     * Only allows plural class names.
     */
    init: function(){
        this._super();
        if(!this.className) return;
        if( MVC.String.is_singular(this.className)) throw "Only plural names for stateful controller!";
    },
    /**
     * Returns a function that calls each instance in instances.  
     * The function is called on Load, Unload, Resize and Scroll.
     * @param {String} f_name 
     * @param {HTMLElement} element
     */
    event_closure: function( f_name, element){
		return MVC.Function.bind(function(event){
			var params = new MVC.Controller.Params({event: event, action: f_name   });
			for(var element_id in this.instances){
                var instance = this.instances[element_id];
                instance.params = params;
        		instance.action_name = f_name;
                this._dispatch_action(instance,f_name, params);
            }
		},this);
	},
    subscribe_closure: function(f_name){
        return MVC.Function.bind(function(event){
			var params = new MVC.Controller.Params({action: f_name   });
			for(var element_id in this.instances){
                var instance = this.instances[element_id];
                instance.params = params;
        		instance.action_name = f_name;
                this._dispatch_action(instance,f_name, params);
            }
		},this);
    },
    /**
     * For an event, gets the class_element from the params.  It sees if it has an id that 
     * is in instances.  If it does, it returns that instance; otherwise, it creates a new instance
     * and puts that instance in instances by id.
     * @param {String} action_name The action that will be called on the instance.
     * @param {MVC.Params} params The params the action will be called with.
     */
    _get_instance: function(action_name, params){
        var ce = params.class_element();
        var instance = this.instances[ce.id];
        if(!instance){
            //get id from ce.id
            var re = new RegExp(this.className+'_', "");
            params.id = ce.id.replace(re, '');
            instance = new this(params);
        }
        return instance;
    },
    /**
     * A collection of instances of this Controller.
     */
    instances : {},
    /**
     * Removes the instance associated with an element.  This assumes the destroy
     * function handles clearing the element.
     * @param {Object} element
     */
    destroy_by_element : function(element){
        if(!element.id) throw "element must have an id to remove the instance"
        this.instances[element.id].destroy();
        
    }
},
/* @Prototype */
{
    /**
     * Called when a new instance is created.  This looks in params for a suitable id.  If one isn't found,
     * it creates one.  It saves the instance to the hash of instances.  It is highly suggested that
     * inheriting classes that overwrite init call _super.
     * @param {optional:Object} params A hash that might contain params.element.id or params.id to be used as the instance's id.
     */
    init: function(params){
        params = params || {};
        this.id = (params.id || MVC.get_random(10))
        this.element_id = this.Class.className + "_" +this.id;
        this.Class.instances[this.element_id] = this;
        
        this.action_name = "init";
    },
    /**
     * Creates an html element that represents this instance.  This creates a new element then sets
     * its className to the Controller's single name and the element's id to the id of the controller instance.
     * It also adds the element as this.element to the instance.  But, it is important to note that 
     * this does not insert the element into the page, it assumes you do that on your own.
     * 
     * @param {optional:String} tag type type of html element to create.  Defaults to "div".
     * @return {HTMLElement} The element to be inserted in the page.
     */
    create_element: function(tag){
        var element = document.createElement(tag || "div");
        element.id = this.element_id;
        element.className = this.Class.singularName;
        return element;
    },
    /**
     * Removes this instance from the list of instances.  It also removes it from the page.
     */
    destroy: function(){
        //delete element and instance from list
        delete this.Class.instances[this.element_id];
        var element = MVC.$E(this.element_id);
        
        if(element && element.parentNode){ element.parentNode.removeChild(element);}
        delete this;
    }
});