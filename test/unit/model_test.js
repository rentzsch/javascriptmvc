new MVC.Test.Unit('model',{
   test_find_all_no_params: function() {
      Todo.find('all', this.next_callback());
   },
   found_all : function(instances){
       this.assert_equal(2, instances.length);
       this.assert_equal(2, instances.length)
       this.assert_equal("string", Todo.attributes.name);
       this.assert_equal("string", Todo.attributes.description);
   },
   test_find_all_params: function(){
       Todo.find('all', {},this.next_callback());
   },
   found_all_params : function(instances){
       this.assert_equal(2, instances.length);
   },
   test_find_one : function(){
       Todo.find('first', this.next_callback());
   },
   found_one : function(instance){
       this.assert_equal("trash", instance.name);
       this.assert_equal("take it out", instance.description);
       this.assert_not(instance.is_new_record());
   },
   test_element_id_to_id : function(){
       this.assert_equal("5", Todo.element_id_to_id("todo_5")  );
       this.assert_equal("/5", Todo.element_id_to_id("TODO_/5")  );
   },
   test_models : function(){
       this.assert( MVC.Model.models['todo'] );
   },
   test_init : function(){
       var todo = new Todo({ description: "er"});

       this.assert_equal("er", todo.description  );
       this.assert_equal(0, todo.errors  );
       this.assert( todo.hasOwnProperty("name") )
   },
   test_set_attributes : function(){
       var todo = new Todo({ description: "er"});
       todo.set_attributes({name: "thing"});
       this.assert_equal("thing", todo.name  );
   },
   test_update_attributes : function(){
        var todo = new Todo({ description: "er"});
        todo.update_attributes({name: "thing"}, this.next_callback())
   },
   updated_attributes : function(todo){
       this.assert_equal("thing", todo.name  );
       this.assert(todo.is_new_record());
   },
   test_guess_type : function(){
       this.assert_equal("array", MVC.Object.guess_type( [] )  );
       this.assert_equal("date", MVC.Object.guess_type( new Date() )  );
       this.assert_equal("boolean", MVC.Object.guess_type( true )  );
       this.assert_equal("number", MVC.Object.guess_type( "1" )  );
       this.assert_equal("string", MVC.Object.guess_type( "a" )  );
   }
});

