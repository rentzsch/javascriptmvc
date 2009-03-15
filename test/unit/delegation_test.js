MVC.Test.Unit.extend("Test.Delegate",{
   init: function(){
          $('#testarea').html({view: 'views/delegation'});
   },
   destroy : function(){
          $('#testarea').html("");
   },
   test_document_click: function() {
      var self = this;
      var fn = function(event){
              self.assertEqual(9, this.nodeType)
              self.assert(event.target, $('#first')[0] );
      }
      $().delegate('','click', fn );

      $("#first").synthetic('click')
      $().kill('','click', fn );
   },
   test_id_matching : function(){
       var self = this;
       var fn = function(event){
              self.assertEqual("first", this.id)
              self.assert(event.target, $('#first')[0]);
       }
       var delegate = new MVC.Delegator('#first','click',fn);
       $("#first").synthetic('click')
       $().kill('#first','click', fn );
   },
   test_delegating_internal : function(){
       var self = this;
       var fn = function(params){
              self.assertEqual("second_todo", this.id)
       }
       $('#nested').delegate(".todo",'click', fn);
       $("#second_todo").synthetic('click')
       $('#nested').kill(".todo",'click', fn);
   }
});