new MVC.Test.Unit('controller',{
    setup: function(){
          MVC.$E('testarea').innerHTML = new MVC.View({url: 'views/render/controller'}).render( )
   },
   teardown : function(){
          MVC.$E('testarea').innerHTML = "";
   },
   test_click_on_id: function() {
      new MVC.SyntheticEvent('click').send(MVC.$E('render'));
      this.assert(RENDER_CONTROLLER_CLICKED);
   },
   test_click_on_tag_inside_id : function(){
       new MVC.SyntheticEvent('click').send(MVC.$E('link'));
       this.assert(RENDER_TAG_CLICKED)
   },
   test_click_on_class_inside_id : function(){
       new MVC.SyntheticEvent('click').send(MVC.$E('class'));
       this.assert(RENDER_CLASS_CLICKED)
   },
   test_click_on_id_inside_id : function(){
       new MVC.SyntheticEvent('click').send(MVC.$E('id'));
       this.assert(RENDER_ID_CLICKED)
   },
   test_thing_click : function(){
       new MVC.SyntheticEvent('click').send(MVC.$E('thing'));
       this.assert(THING_CLICKED)
   },
   test_things_click : function(){
       new MVC.SyntheticEvent('click').send(MVC.$E('things'));
       this.assert(THINGS_CLICKED)
   }
});