$.Controller.extend("TestingController",{
    init : function(el){
        this._super(el);
        this.orderCount = 0;  
    },
    click : function(element, event){
        this.clicked = true;
        this.clickElement = element;
        this.clickEvent = event;
        this.clickOrder = this.orderCount++;
    },
    "a click" : function(){
        this.tagClicked = true;
    },
    "#id click" : function(){
        this.idClicked = true;
        this.idClickOrder = this.orderCount++;
    },
    ".render click" : function(){
        this.classNameClicked = true;
    },
    "message.publish subscribe" : function(first, second, third){
        this.sub1 = first;
        this.sub2 = second;
    }
});

$.Test.Unit.extend('Tests.Controller',{
   init: function(){
          $('#testarea').html({view: 'views/render/controller'});
          //$('#testing_area').testing_controller();
   },
   destroy : function(){
          //$('#testing_area').testing_controller()
          $('#testarea').html("")
   },
   test_method_exists : function(){
       this.assert($.fn.testing_controller)
   },
   test_setup_and_destroy : function(){
       var instances = $('#testing_area').testing_controller();
       this.assertEqual('TestingController',instances[0].Class.className);
       this.assert(instances[0].destroy); //very likely a controller if these both pass
       //make sure its there
       this.assertEqual(instances[0], $('#testing_area').data("TestingController"));
       this.assertEqual(instances[0], $('#testing_area').testing_controller()[0]);
       this.assertEqual(1, $('#testing_area').testing_controller().length);
       //now remove and make sure it is gone
       instances[0].destroy();
       this.assertNull($('#testing_area').data("TestingController") );
   },
   test_click : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area').synthetic('click');
       this.assert( inst.clicked  );
       inst.destroy();
   },
   test_tag_click : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area a').synthetic('click');
       this.assert( inst.tagClicked  );
       inst.destroy();
   },
   test_id_click : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area #id').synthetic('click');
       this.assert( inst.idClicked  );
       inst.destroy();
   },
   test_className_click : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area .render').synthetic('click');
       this.assert( inst.classNameClicked  );
       inst.destroy();
   },
   test_multiple_matches : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area #id').synthetic('click');
       this.assert( inst.idClicked  );
       this.assert( inst.clicked  );
       inst.destroy();
   },
   test_order : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area #id').synthetic('click');
       this.assertEqual(0, inst.idClickOrder  );
       this.assertEqual(1, inst.clickOrder  );
       inst.destroy();
   },
   test_arguments : function(){
       var inst = $('#testing_area').testing_controller()[0];
       $('#testing_area').synthetic('click');
       this.assertEqual("testing_area", inst.clickElement[0].id  );
       this.assertEqual("click", inst.clickEvent.type  );
       inst.destroy();
   },
   test_className : function(){
       var inst = $('#testing_area').testing_controller()[0];
       this.assert( $('#testing_area').hasClass("testing_controller") );
       inst.destroy();
   },
   test_open_ajax : function(){
       var inst = $('#testing_area').testing_controller()[0];
       OpenAjax.hub.publish("message.publish", 5);
       
       this.assertEqual("message.publish", inst.sub1);
       this.assertEqual(5, inst.sub2);
       inst.destroy();
   }
   /*,
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
   }*/
});