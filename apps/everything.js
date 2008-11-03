include.resources();
include.plugins(

    'core','controller/comet','controller/dragdrop','dom/query','io/comet','io/jsonp','io/window_name',
    'io/xdoc','lang/date','lang/json','model','model/ajax','model/cookie','model/jsonp','model/rest_json',
    'model/rest_xml','model/view_helper', 'test','controller/stateful'
    );

//dom/history

MVC.load_doc = true;

//include('../jmvc/rhino/documentation/setup');

include(function(){
  //include.models();
  //include.views();
  
  //resp = new Ajax('../../jmvc/plugins/dom/event/standard.js?'+Math.random(),  {asynchronous: false, method: 'get'});
  //var file = new MVC.Doc.File({text:resp.responseText, path: "call.js" } );
  
  //resp = new Ajax('../../jmvc/plugins/dom/element/vector.js?'+Math.random(),  {asynchronous: false, method: 'get'});
  //var file = new MVC.Doc.File({text:resp.responseText, path: "call.js" } );
  //file.generate()
  //document.getElementById('CLASSIN').innerHTML = MVC.Doc.Constructor.listing[0].toHTML();
  
  
});