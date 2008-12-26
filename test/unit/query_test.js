new MVC.Test.Unit('query',{
    setup: function(){
          MVC.$E('testarea').innerHTML = new MVC.View({url: 'views/render/controller'}).render( )
    },
    teardown : function(){
          MVC.$E('testarea').innerHTML = "";
    },
    test_query : function() {
        this.assert( MVC.Query("#render")  )
    }
});