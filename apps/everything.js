include.resources();
include.plugins('core','controller/comet','controller/dragdrop','dom/query','io/comet','io/jsonp','io/window_name',
    'io/xdoc','lang/date','lang/json','model','model/ajax','model/cookie','model/jsonp','model/rest_json',
    'model/rest_xml','model/view_helper', 'test');

//dom/history


include('../jmvc/rhino/doc');

MVC.Initializer(function(){
  include.models();
  include.views();
  
  resp = new Ajax('../../jmvc/plugins/dom/event/standard.js?'+Math.random(),  {asynchronous: false, method: 'get'});
  var file = new MVCObject.DFile({text:resp.responseText, path: "call.js" } );
  
  resp = new Ajax('../../jmvc/plugins/dom/element/vector.js?'+Math.random(),  {asynchronous: false, method: 'get'});
  var file = new MVCObject.DFile({text:resp.responseText, path: "call.js" } );
  //file.generate()
  document.getElementById('CLASSIN').innerHTML = MVCObject.DConstructor.listing[0].toHTML();
  
  
});