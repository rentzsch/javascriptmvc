//no conflict
if(location.href.indexOf('no_conflict') != -1){
	MVC.no_conflict();
	document.getElementById('no_conflict_el').style.backgroundColor = '#ddffdd';
}else{
	document.getElementById('normal_el').style.backgroundColor = '#ddffdd';
}
//jquery
if(location.href.indexOf('jquery') != -1){
	include.plugins('jquery')
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


var match = location.href.match(/#(.*)/)
current = match && match[1] ? match[1] : ''
var base = '?'+Math.random()+'#';



noconflict = function(){
	if(location.href.indexOf('no_conflict') == -1){
		location.href=base+current+'no_conflict'
	}
}
normal = function(){
	if(location.href.indexOf('no_conflict') != -1){
		location.href=base+current.replace(/no_conflict/, '')
	}
}

proto = function(){
	if(location.href.indexOf('prototype') == -1){
		location.href=base+current+'prototype'
	}
}
noproto = function(){
	if(location.href.indexOf('prototype') != -1){
		location.href=base+current.replace(/prototype/, '')
	}
}

jq = function(){
	if(location.href.indexOf('jquery') == -1){
		location.href=base+current+'jquery'
	}
}
nojq = function(){
	if(location.href.indexOf('jquery') != -1){
		location.href=base+current.replace(/jquery/, '')
	}
}
element = function(){
	if(location.href.indexOf('element') == -1){
		location.href=base+current+'element'
	}
}
noelement = function(){
	if(location.href.indexOf('element') != -1){
		location.href=base+current.replace(/element/, '')
	}
}

include.engines('testing');
include.plugins('io/ajax/fixtures','controller','view',
    'dom/element','dom/position','dom/synthetic',
    'model','lang/timer','view/translation');




include(function(){ //runs after prior includes are loaded
  include.models('todo');
  include.controllers('render');
  include.translation("spanish");
  //include.views();
});