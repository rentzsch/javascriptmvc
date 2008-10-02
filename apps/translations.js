include.resources();
include.plugins('core','view/translation');
include.engines('modal');
include(function(){
  include.models();
  include.controllers('translations');
  include.views();
  
  include.translation("spanish");
  
});