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
        //if( MVC.String.is_singular(this.className)) throw "Only plural names for stateful controller!";
    },
    _should_attach_actions: false,
    /**
     * Removes the instance associated with an element.  This assumes the destroy
     * function handles clearing the element.
     * @param {Object} element
     */
    destroy_by_element : function(element){
        if(!element.id) throw "element must have an id to remove the instance"
        this.instances[element.id].destroy();
        
    },
    _events : null,
    _element : null
},
/* @Prototype */
{
    /**
     * Called when a new instance is created.  This looks in params for a suitable id.  If one isn't found,
     * it creates one.  It saves the instance to the hash of instances.  It is highly suggested that
     * inheriting classes that overwrite init call _super.
     * @param {optional:Object} params A hash that might contain params.element.id or params.id to be used as the instance's id.
     */
    init: function(element){
        //needs to go through prototype, and attach events to this instance
        this._actions = [];
        for(var action_name in this){
    		val = this[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        var callback = this.dispatch_closure(action_name);
                        this._actions.push(new act(action_name, callback, this.Class.className,element ));
                    }
                }
            }
	    }
        this.action_name = "init";
        this.element = element;
    },

    /**
     * It also removes this.element from the page.
     */
    destroy: function(){
        //destroy actions
        for(var i = 0; i < this._actions.length; i++){
            this._actions[i].destroy();
            delete this._actions[i];
        }
        
        if(this.element){
            //take out any listeners on this guy
            for(var event_type in this.element.__devents){
                var events = this.element.__devents[event_type]
                for(var i = 0; i < events.length; i++){
                    events[i].destroy();
                    delete events[i];
                }
            }
        }
        if(this.element && this.element.parentNode){ this.element.parentNode.removeChild(this.element);}
        delete this;
    },
    dispatch_closure: function(f_name){
        return MVC.Function.bind(function(params){
            params = params || {};
            params.action = f_name;
            params.controller = this;
            params = params.constructor == MVC.Controller.Params ? params : new MVC.Controller.Params(params)
			
            this.params = params;
    		this.action_name = f_name;
            return this[f_name](params);
		},this);
    },
    /**
     * Queries from the current element.
     * @param {Object} selector
     */
    query: function(selector){
        MVC.Query.descendant(this.element, selector)
    }
});