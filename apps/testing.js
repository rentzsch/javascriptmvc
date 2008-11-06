include.resources();

//no conflict
if(location.href.indexOf('no_conflict') != -1){
	MVC.no_conflict();
	document.getElementById('no_conflict_el').style.backgroundColor = '#ddffdd';
}else{
	document.getElementById('normal_el').style.backgroundColor = '#ddffdd';
}
//jquery
if(location.href.indexOf('jquery') != -1){
	include.resources('jquery-1.2.3')
    document.getElementById('jq_el').style.backgroundColor = '#ddffdd';
}else{
	document.getElementById('nojq_el').style.backgroundColor = '#ddffdd';
}
//prototype
if(location.href.indexOf('prototype') != -1){
	include.resources('prototype');
	document.getElementById('proto_el').style.backgroundColor = '#ddffdd';
}else{
	document.getElementById('noproto_el').style.backgroundColor = '#ddffdd';
}

include.engines('testing');
include.plugins('io/ajax','controller','view','dom/element','model','lang/timer');




include(function(){ //runs after prior includes are loaded
  include.models('todo');
  include.controllers('controllertest');
  //include.views();
});