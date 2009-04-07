new jQuery.Test.Unit('engine',{
   test_application_loaded: function() {
      this.assert(TESTING_APP_LOADED);
   },
   test_resource_loaded: function(){
       this.assert(TESTING_RESOURCE_LOADED);
   },
   test_controller_loaded: function(){
       this.assert(TESTING_CONTROLLER_LOADED);
   }, 
   test_model_loaded: function(){
       this.assert(TESTING_MODEL_LOADED);
   }
});