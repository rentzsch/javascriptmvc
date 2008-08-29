include.resources();
include.plugins('core','view/translation');

MVC.Initializer(function(){
  include.models();
  include.controllers('translations');
  include.views();
  
  include.translation("spanish");
  
});