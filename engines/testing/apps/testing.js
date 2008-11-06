TESTING_APP_LOADED = true;
include.resources('testing');
include.plugins('controller','view');

include(function(){ //runs after prior includes are loaded
  include.models('testing');
  include.controllers('testing');
  include.views('views/testing');
});