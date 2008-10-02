include.resources();
include.plugins('core');
include.engines('modal')
include(function(){ //runs after prior includes are loaded
  include.models();
  include.controllers();
  include.views();
});