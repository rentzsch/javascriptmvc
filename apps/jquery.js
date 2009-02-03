include.resources();
include.engines();
include.plugins(
    'controller');

include(function(){ //runs after prior includes are loaded
  include.models();
  include.controllers('jquery');
});