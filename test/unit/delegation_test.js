new MVC.Test.Unit('delegation',{
   setup: function(){
          MVC.$E('testarea').innerHTML = new MVC.View({url: 'views/delegation'}).render( )
   },
   teardown : function(){
          MVC.$E('testarea').innerHTML = "";
   },
   test_document_click: function() {
      var self = this;
      var delegate = new MVC.Delegator('','click',
          function(params){
              self.assert_equal("html", params.element.tagName.toLowerCase())
              self.assert(params.event.target, MVC.$E('first'));
          }
      );
      new MVC.SyntheticEvent('click').send(MVC.$E('first')); //synchronous@
      delegate.destroy();
   },
   test_id_matching : function(){
       var self = this;
       var delegate = new MVC.Delegator('#first','click',function(params){
              self.assert_equal("first", params.element.id)
              self.assert(params.event.target, MVC.$E('first'));
       });
       new MVC.SyntheticEvent('click').send(MVC.$E('first'))
       delegate.destroy();
   },
   test_delegating_internal : function(){
       var self = this;
       
       delegate = new MVC.Delegator('.todo','click',function(params){
              self.assert_equal("second_todo", params.element.id)
       }, MVC.$E('nested') , {} );
       new MVC.SyntheticEvent('click').send(MVC.$E('second_todo'))
       delegate.destroy();
   }
});