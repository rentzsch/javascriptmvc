include.resources();
include.engines();
include.plugins(
    'core'
    );

include(function(){ //runs after prior includes are loaded
  include.models();
  include.controllers('hello_world');
  include.views();
});