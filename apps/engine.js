include.resources();
include.engines('modalmvc');

include(function(){ //runs after prior includes are loaded
  include.models();
  include.controllers();
  include.views("views/tests/after");
});