console.log('app init')

$.include.engines('testing');
$.include.plugins('io/ajax/fixtures','controller','view',
    'dom/element','dom/position','dom/synthetic',
    'model','lang/timer','view/translation');




$.include(function(){ //runs after prior includes are loaded
  $.include.models('todo');
  $.include.controllers('render');
  //include.views();
});