/**
 * Controller.Stateful provides state for controller instances.  Controller.Stateful is  useful for
 * creating self-contained widgets or when there are many instances of an object that has complex state.  
 * Read the <a href="http://docs.javascriptmvc.com/demos/fixedbox.html">fixedbox demo</a>
 * for good an example of using Controller.Stateful.
 * <h2>Example</h2>
 * The following is a a small piece of the SliderController.
 * @code_start
 * SliderController = MVC.Controller.Stateful('slider',{
 *   init : function(element, options){
 *     this.options = options ||{}
 *     this._super(MVC.$E(element))
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
 * <i>.singular_name</i> before this controller's [MVC.Controller.Action.Event|event actions].  If the controller is a singular name
 * nothing is added to the delegation class name.
 * <h2>How Stateful works</h2>
 * New stateful instances create a new delegation listening point on the element passed into the base 
 * [MVC.Controller.Stateful.prototype.init|init] function.  As events happen on the element or child elements
 * of the instance, they call back to the controller instance.
 */
jQuery.Controller = MVC.Class.extend(
/* @Static*/
{
    init : function(){
        if(!this.className) return;
        this.underscoreName = MVC.String.underscore(this.className.replace(/controller/i,""))
        this.singularName =  MVC.String.singularize(this.underscoreName);
        if(!MVC.Controller.controllers[this.underscoreName]) MVC.Controller.controllers[this.underscoreName] = [];
        MVC.Controller.controllers[this.underscoreName].unshift(this);
        var val, act;
        if(!this.modelName)
            this.modelName = MVC.String.is_singular(this.underscoreName) ? this.underscoreName : MVC.String.singularize(this.underscoreName)

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
        var controller = this;
        jQuery.fn[MVC.String.underscore(this.fullName)] = function(){
            var instances = [];
            var args = jQuery.makeArray(arguments);
            for(var i =0; i < this.length; i++){
                args.unshift(this[i]);
                var inst = jQuery.data(this[i], self.fullName);
                instances.push( isNaN(inst) ? 
                                inst :
                                controller.createInstance.apply(controller, args)
                )
                args.shift();
            }
            return instances;
        }
        //add a helper for jQuery
    }
},
/* @Prototype */
{
    /**
     * Called when aa new instance is created.  you must provide 
     * @param {HTMLElement} element the element this instance operates on.
     */
    init: function(element){
        //needs to go through prototype, and attach events to this instance

        this._actions = [];
        for(var action_name in this){
    		var val = this[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    var act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        var callback = this.dispatch_closure(action_name);
                        this._actions.push(new act(action_name, callback, this.Class.className,element ));
                    }
                }
            }
	    }
        this.action_name = "init";
        this.element = element;
        jQuery.data(this.element, this.Class.fullName, this);
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
        jQuery.removeData(this.element, this.Class.fullName);
		this.element = null;
    },
    /**
     * Used to call back to this instance
     * @param {Object} f_name
     */
    dispatch_closure: function(f_name){
        var self = this;
        return MVC.Function.bind(function(){
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
        return $(this.element).find(selector);
    }
});


jQuery.fn.controller = function(){
    var controllerNames = MVC.Array.from(arguments);
    //check if arguments
    var instances = [];
    var instance_data = jQuery.data(this[0], "instances");
    for(var i =0; i < controllerNames.length; i++){
        //check if there is an instance
        if(!instance_data[ controllerNames[i] ])
            instance_data[ controllerNames[i] ]
    }
};