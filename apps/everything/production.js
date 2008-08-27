include.set_path('../../apps');
include.resources();
include.plugins("core","controller/comet","controller/dragdrop","dom/query","io/comet","io/jsonp","io/window_name","io/xdoc","lang/date","lang/json","model","model/ajax","model/cookie","model/jsonp","model/rest_json","model/rest_xml","model/view_helper");
include("../jmvc/rhino/doc");
MVC.Initializer(function(){
include.models();
include.views();
resp=new Ajax("../../jmvc/plugins/dom/event/standard.js?"+Math.random(),{asynchronous:false,method:"get"});
var _1=new MVCObject.DFile({text:resp.responseText,path:"call.js"});
resp=new Ajax("../../jmvc/plugins/dom/element/vector.js?"+Math.random(),{asynchronous:false,method:"get"});
var _1=new MVCObject.DFile({text:resp.responseText,path:"call.js"});
document.getElementById("CLASSIN").innerHTML=MVCObject.DConstructor.listing[0].toHTML();
});
;
include.set_path('../../jmvc/plugins/core');
if(typeof Prototype=="undefined"){
include({path:"../lang/standard_helpers.js",shrink_variables:false},"../lang/inflector/inflector","../dom/event/standard","../io/ajax/ajax","../lang/class/setup");
MVC.Included.plugins.push("lang","lang/inflector","io/ajax","dom/event","lang/class");
}else{
MVC.Event=Event;
include({path:"../lang/prototype_helpers.js",shrink_variables:false},"../lang/inflector/inflector","../io/ajax/prototype_ajax");
MVC.Included.plugins.push("lang","lang/inflector","io/ajax");
}
if(include.get_env()=="test"){
include("test");
}
MVC.Included.plugins.push("view","controller","controller/view");
include("../view/view","../controller/controller","../controller/delegator","../controller/view/controller_view");
MVC.Included.plugins.push("view","controller","controller/view");
include.plugins("dom/element","controller/scaffold","model/view_helper","view/helpers");
if(include.get_env()=="development"){
include("../view/fulljslint");
}
;
include.set_path('../../jmvc/plugins/lang');
MVC.String={};
MVC.String.strip=function(_1){
return _1.replace(/^\s+/,"").replace(/\s+$/,"");
};
MVC.Function={};
MVC.Function.params=function(_2){
var ps=_2.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",");
if(ps.length==1&&!ps[0]){
return [];
}
for(var i=0;i<ps.length;i++){
ps[i]=MVC.String.strip(ps[i]);
}
return ps;
};
MVC.Native={};
MVC.Native.extend=function(_5,_6){
if(!MVC[_5]){
MVC[_5]={};
}
var _7=MVC[_5];
for(var _8 in _6){
_7[_8]=_6[_8];
if(!MVC._no_conflict){
window[_5][_8]=_6[_8];
if(typeof _6[_8]=="function"){
var _9=MVC.Function.params(_6[_8]);
if(_9.length==0){
continue;
}
var _a=_9[0];
if(_a.match(_5.toLowerCase())||(_a=="func"&&_5=="Function")){
MVC.Native.set_prototype(_5,_8,_6[_8]);
}
}
}
}
};
MVC.Native.set_prototype=function(_b,_c,_d){
if(!_d){
_d=MVC[_b][_c];
}
window[_b].prototype[_c]=function(){
var _e=[this];
for(var i=0,_10=arguments.length;i<_10;i++){
_e.push(arguments[i]);
}
return _d.apply(this,_e);
};
};
MVC.Object={};
MVC.Object.extend=function(_11,_12){
for(var _13 in _12){
_11[_13]=_12[_13];
}
return _11;
};
MVC.Object.to_query_string=function(_14,_15){
if(typeof _14!="object"){
return _14;
}
return MVC.Object.to_query_string.worker(_14,_15).join("&");
};
MVC.Object.to_query_string.worker=function(obj,_17){
var _18=[];
for(var _19 in obj){
if(obj.hasOwnProperty(_19)){
var _1a=obj[_19];
if(_1a&&_1a.constructor===Date){
_1a=_1a.getUTCFullYear()+"-"+MVC.Number.to_padded_string(_1a.getUTCMonth()+1,2)+"-"+MVC.Number.to_padded_string(_1a.getUTCDate(),2)+" "+MVC.Number.to_padded_string(_1a.getUTCHours(),2)+":"+MVC.Number.to_padded_string(_1a.getUTCMinutes(),2)+":"+MVC.Number.to_padded_string(_1a.getUTCSeconds(),2);
}
if(typeof _1a!="object"){
var _1b=encodeURIComponent(_1a.toString());
var _1c=encodeURIComponent(_17?_17+"["+_19+"]":_19);
_18.push(_1c+"="+_1b);
}else{
_18=_18.concat(MVC.Object.to_query_string.worker(_1a,_17?_17+"["+_19+"]":_19));
}
}
}
return _18;
};
MVC.Native.extend("String",{capitalize:function(_1d){
return _1d.charAt(0).toUpperCase()+_1d.substr(1).toLowerCase();
},include:function(_1e,_1f){
return _1e.indexOf(_1f)>-1;
},ends_with:function(_20,_21){
var d=_20.length-_21.length;
return d>=0&&_20.lastIndexOf(_21)===d;
},camelize:function(_23){
var _24=_23.split(/_|-/);
for(var i=1;i<_24.length;i++){
_24[i]=MVC.String.capitalize(_24[i]);
}
return _24.join("");
},classize:function(_26){
var _27=_26.split(/_|-/);
for(var i=0;i<_27.length;i++){
_27[i]=MVC.String.capitalize(_27[i]);
}
return _27.join("");
},strip:MVC.String.strip});
MVC.Native.extend("Array",{include:function(_29,_2a){
for(var i=0;i<_29.length;i++){
if(_29[i]==_2a){
return true;
}
}
return false;
},from:function(_2c){
if(!_2c){
return [];
}
var _2d=[];
for(var i=0,_2f=_2c.length;i<_2f;i++){
_2d.push(_2c[i]);
}
return _2d;
}});
MVC.Native.extend("Function",{bind:function(_30){
var _31=MVC.Array.from(arguments);
_31.shift();
_31.shift();
var _32=_30,_33=arguments[1];
return function(){
return _32.apply(_33,_31.concat(MVC.Array.from(arguments)));
};
},params:MVC.Function.params});
MVC.Native.extend("Number",{to_padded_string:function(_34,_35,_36){
var _37=_34.toString(_36||10);
var ret="";
for(var i=0;i<_35-_37.length;i++){
ret=+"0";
}
return ret+_37;
}});
;
include.set_path('../../jmvc/plugins/lang/inflector');
MVC.Inflector={Inflections:{plural:[[/(quiz)$/i,"$1zes"],[/^(ox)$/i,"$1en"],[/([m|l])ouse$/i,"$1ice"],[/(matr|vert|ind)ix|ex$/i,"$1ices"],[/(x|ch|ss|sh)$/i,"$1es"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/(hive)$/i,"$1s"],[/(?:([^f])fe|([lr])f)$/i,"$1$2ves"],[/sis$/i,"ses"],[/([ti])um$/i,"$1a"],[/(buffal|tomat)o$/i,"$1oes"],[/(bu)s$/i,"$1ses"],[/(alias|status)$/i,"$1es"],[/(octop|vir)us$/i,"$1i"],[/(ax|test)is$/i,"$1es"],[/s$/i,"s"],[/$/,"s"]],singular:[[/(quiz)zes$/i,"$1"],[/(matr)ices$/i,"$1ix"],[/(vert|ind)ices$/i,"$1ex"],[/^(ox)en/i,"$1"],[/(alias|status)es$/i,"$1"],[/(octop|vir)i$/i,"$1us"],[/(cris|ax|test)es$/i,"$1is"],[/(shoe)s$/i,"$1"],[/(o)es$/i,"$1"],[/(bus)es$/i,"$1"],[/([m|l])ice$/i,"$1ouse"],[/(x|ch|ss|sh)es$/i,"$1"],[/(m)ovies$/i,"$1ovie"],[/(s)eries$/i,"$1eries"],[/([^aeiouy]|qu)ies$/i,"$1y"],[/([lr])ves$/i,"$1f"],[/(tive)s$/i,"$1"],[/(hive)s$/i,"$1"],[/([^f])ves$/i,"$1fe"],[/(^analy)ses$/i,"$1sis"],[/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i,"$1$2sis"],[/([ti])a$/i,"$1um"],[/(n)ews$/i,"$1ews"],[/s$/i,""]],irregular:[["move","moves"],["sex","sexes"],["child","children"],["man","men"],["foreman","foremen"],["person","people"]],uncountable:["sheep","fish","series","species","money","rice","information","equipment"]},pluralize:function(_1){
for(var i=0;i<MVC.Inflector.Inflections.uncountable.length;i++){
var _3=MVC.Inflector.Inflections.uncountable[i];
if(_1.toLowerCase()==_3){
return _3;
}
}
for(var i=0;i<MVC.Inflector.Inflections.irregular.length;i++){
var _4=MVC.Inflector.Inflections.irregular[i][0];
var _5=MVC.Inflector.Inflections.irregular[i][1];
if((_1.toLowerCase()==_4)||(_1==_5)){
return _1.substring(0,1)+_5.substring(1);
}
}
for(var i=0;i<MVC.Inflector.Inflections.plural.length;i++){
var _6=MVC.Inflector.Inflections.plural[i][0];
var _7=MVC.Inflector.Inflections.plural[i][1];
if(_6.test(_1)){
return _1.replace(_6,_7);
}
}
},singularize:function(_8){
for(var i=0;i<MVC.Inflector.Inflections.uncountable.length;i++){
var _a=MVC.Inflector.Inflections.uncountable[i];
if(_8.toLowerCase()==_a){
return _a;
}
}
for(var i=0;i<MVC.Inflector.Inflections.irregular.length;i++){
var _b=MVC.Inflector.Inflections.irregular[i][0];
var _c=MVC.Inflector.Inflections.irregular[i][1];
if((_8.toLowerCase()==_b)||(_8.toLowerCase()==_c)){
return _8.substring(0,1)+_b.substring(1);
}
}
for(var i=0;i<MVC.Inflector.Inflections.singular.length;i++){
var _d=MVC.Inflector.Inflections.singular[i][0];
var _e=MVC.Inflector.Inflections.singular[i][1];
if(_d.test(_8)){
return _8.replace(_d,_e);
}
}
}};
MVC.Native.extend("String",{pluralize:function(_f,_10,_11){
if(typeof _10=="undefined"){
return MVC.Inflector.pluralize(_f);
}else{
return _10+" "+(1==parseInt(_10)?_f:_11||MVC.Inflector.pluralize(_f));
}
},singularize:function(_12,_13){
if(typeof _13=="undefined"){
return MVC.Inflector.singularize(_12);
}else{
return _13+" "+MVC.Inflector.singularize(_12);
}
},is_singular:function(_14){
if(MVC.String.singularize(_14)==null&&_14){
return true;
}
return false;
}});
;
include.set_path('../../jmvc/plugins/dom/event');
if(document.addEventListener){
MVC.Event={observe:function(el,_2,_3,_4){
if(_4==null){
_4=false;
}
el.addEventListener(_2,_3,_4);
},stop_observing:function(el,_6,_7){
if(capture==null){
capture=false;
}
el.removeEventListener(_6,_7,false);
}};
}else{
if(document.attachEvent){
MVC.Event={observe:function(_8,_9,_a){
if(MVC.Event._find(_8,_9,_a)!=-1){
return;
}
var _b=function(e){
if(!e){
e=window.event;
}
var _d={_event:e,type:e.type,target:e.srcElement,currentTarget:_8,relatedTarget:_9=="mouseover"?e.fromElement:e.toElement,eventPhase:(e.srcElement==_8)?2:3,clientX:e.clientX,clientY:e.clientY,screenX:e.screenX,screenY:e.screenY,altKey:e.altKey,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,charCode:e.keyCode,stopPropagation:function(){
this._event.cancelBubble=true;
},preventDefault:function(){
this._event.returnValue=false;
}};
if(Function.prototype.call){
_a.call(_8,_d);
}else{
_8._currentHandler=_a;
_8._currentHandler(_d);
_8._currentHandler=null;
}
};
_8.attachEvent("on"+_9,_b);
var h={element:_8,eventType:_9,handler:_a,wrappedHandler:_b};
var d=_8.document||_8,w=d.parentWindow,id=MVC.Event._uid();
if(!w._allHandlers){
w._allHandlers={};
}
w._allHandlers[id]=h;
if(!_8._handlers){
_8._handlers=[];
}
_8._handlers.push(id);
if(!w._onunloadHandlerRegistered){
w._onunloadHandlerRegistered=true;
w.attachEvent("onunload",MVC.Event._removeAllHandlers);
}
},stop_observing:function(_12,_13,_14){
var i=MVC.Event._find(_12,_13,_14);
if(i==-1){
return;
}
var d=_12.document||_12,w=d.parentWindow,_18=_12._handlers[i],h=w._allHandlers[_18];
_12.detachEvent("on"+_13,h.wrappedHandler);
_12._handlers.splice(i,1);
delete w._allHandlers[_18];
},_find:function(_1a,_1b,_1c){
var _1d=_1a._handlers;
if(!_1d){
return -1;
}
var d=_1a.document||_1a,w=d.parentWindow;
for(var i=_1d.length-1;i>=0;i--){
var h=w._allHandlers[_1d[i]];
if(h.eventType==_1b&&h.handler==_1c){
return i;
}
}
return -1;
},_removeAllHandlers:function(){
var w=this;
for(var id in w._allHandlers){
if(!w._allHandlers.hasOwnProperty(id)){
continue;
}
var h=w._allHandlers[id];
if(h.element){
h.element.detachEvent("on"+h.eventType,h.wrappedHandler);
}
delete w._allHandlers[id];
}
},_counter:0,_uid:function(){
return "h"+MVC.Event._counter++;
}};
}
}
if(!MVC._no_conflict&&typeof Event=="undefined"){
Event=MVC.Event;
}
;
include.set_path('../../jmvc/plugins/io/ajax');
(function(){
var _1=MVC.Ajax.factory;
MVC.Ajax=function(_2,_3){
this.options={method:"post",asynchronous:true,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:""};
this.url=_2;
MVC.Object.extend(this.options,_3||{});
this.options.method=this.options.method.toLowerCase();
if(!MVC.Array.include(["get","post"],this.options.method)){
if(this.options.parameters==""){
this.options.parameters={_method:this.options.method};
}else{
this.options.parameters["_method"]=this.options.method;
}
this.options.method="post";
}
if(this.options.method=="get"&&this.options.parameters!=""){
this.url+=(MVC.String.include(this.url,"?")?"&":"?")+MVC.Object.to_query_string(this.options.parameters);
delete this.options.parameters;
}
if(!this.options.parameters){
var _4=null;
}else{
if(_3.json_string){
var _4=MVC.Object.to_json(this.options.parameters);
}else{
var _4=MVC.Object.to_query_string(this.options.parameters);
}
}
this.transport=MVC.Ajax.factory();
if(this.options.asynchronous==false){
this.transport.open(this.options.method,this.url,this.options.asynchronous);
this.set_request_headers(_3.headers);
try{
this.transport.send(_4);
}
catch(e){
return null;
}
return this.transport;
}else{
this.transport.onreadystatechange=MVC.Function.bind(function(){
var _5=MVC.Ajax.Events[this.transport.readyState];
if(_5=="Complete"){
if(!this.options.onSuccess){
}else{
if(this.success()){
this.options.onSuccess(this.transport);
}else{
if(this.options.onFailure){
this.options.onFailure(this.transport);
}
}
}
}
if(this.options["on"+_5]){
this.options["on"+_5](this.transport);
}
},this);
this.transport.open(this.options.method,this.url,true);
this.set_request_headers(_3.headers);
this.transport.send(_4);
}
};
MVC.Ajax.factory=_1;
})();
MVC.Ajax.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
MVC.Ajax.prototype={success:function(){
var _6=this.getStatus();
return !_6||(_6>=200&&_6<300);
},getStatus:function(){
try{
return this.transport.status||0;
}
catch(e){
return 0;
}
},set_request_headers:function(_7){
var _8={};
if(this.options.method=="post"){
_8["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:"");
if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005){
_8["Connection"]="close";
}
}
for(var _9 in _8){
if(_8.hasOwnProperty(_9)){
this.transport.setRequestHeader(_9,_8[_9]);
}
}
if(_7){
for(var _a in _7){
this.transport.setRequestHeader(_a,_7[_a]);
}
}
}};
if(!MVC._no_conflict){
Ajax=MVC.Ajax;
}
;
include.set_path('../../jmvc/plugins/lang/class');
(function(){
var _1=false,_2=/xyz/.test(function(){
xyz;
})?/\b_super\b/:/.*/;
MVC.Class=function(){
};
MVC.Class.extend=function(_3,_4,_5){
if(typeof _3!="string"){
_5=_4;
_4=_3;
_3=null;
}
if(!_5){
_5=_4;
_4=null;
}
var _6=this;
var _7=this.prototype;
_1=true;
var _8=new this();
_1=false;
for(var _9 in _5){
_8[_9]=typeof _5[_9]=="function"&&typeof _7[_9]=="function"&&_2.test(_5[_9])?(function(_a,fn){
return function(){
var _c=this._super;
this._super=_7[_a];
var _d=fn.apply(this,arguments);
this._super=_c;
return _d;
};
})(_9,_5[_9]):_5[_9];
}
function Class(){
if(!_1&&this.init){
this.init.apply(this,arguments);
}
};
Class.prototype=_8;
Class.prototype.Class=Class;
Class.constructor=Class;
for(var _9 in this){
if(this.hasOwnProperty(_9)&&_9!="prototype"){
Class[_9]=this[_9];
}
}
for(var _9 in _4){
Class[_9]=typeof _4[_9]=="function"&&typeof Class[_9]=="function"&&_2.test(_4[_9])?(function(_e,fn){
return function(){
var tmp=this._super;
this._super=_6[_e];
var ret=fn.apply(this,arguments);
this._super=tmp;
return ret;
};
})(_9,_4[_9]):_4[_9];
}
Class.extend=arguments.callee;
if(_3){
Class.className=_3;
}
if(Class.init){
Class.init(Class);
}
if(_6.extended){
_6.extended(Class);
}
return Class;
};
})();
if(!MVC._no_conflict&&typeof Class=="undefined"){
Class=MVC.Class;
}
;
include.set_path('../../jmvc/plugins/view');
MVC.View=function(_1){
this.set_options(_1);
if(_1.precompiled){
this.template={};
this.template.process=_1.precompiled;
MVC.View.update(this.name,this);
return;
}
if(_1.url||_1.absolute_url){
var _2=_1.absolute_url||MVC.root.join(_1.url+(_1.url.match(/\.ejs/)?"":".ejs"));
_1.url=_1.absolute_url||_1.url;
var _3=MVC.View.get(_1.url,this.cache);
if(_3){
return _3;
}
if(_3==MVC.View.INVALID_PATH){
return null;
}
this.text=include.request(_2+(this.cache||window._rhino?"":"?"+Math.random()));
if(this.text==null){
throw ({type:"JMVC",message:"There is no template at "+_2});
}
this.name=_1.url;
}else{
if(_1.hasOwnProperty("element")){
if(typeof _1.element=="string"){
var _4=_1.element;
_1.element=MVC.$E(_1.element);
if(_1.element==null){
throw _4+"does not exist!";
}
}
if(_1.element.value){
this.text=_1.element.value;
}else{
this.text=_1.element.innerHTML;
}
this.name=_1.element.id;
this.type="[";
}
}
var _3=new MVC.View.Compiler(this.text,this.type);
_3.compile(_1);
MVC.View.update(this.name,this);
this.template=_3;
};
MVC.View.prototype={render:function(_5,_6){
_5=_5||{};
var v=new MVC.View.Helpers(_5);
MVC.Object.extend(v,_6||{});
return this.template.process.call(_5,_5,v);
},out:function(){
return this.template.out;
},set_options:function(_8){
this.type=_8.type!=null?_8.type:MVC.View.type;
this.cache=_8.cache!=null?_8.cache:MVC.View.cache;
this.text=_8.text!=null?_8.text:null;
this.name=_8.name!=null?_8.name:null;
},update:function(_9,_a){
if(typeof _9=="string"){
_9=MVC.$E(_9);
}
if(_a==null){
_template=this;
return function(_b){
MVC.View.prototype.update.call(_template,_9,_b);
};
}
if(typeof _a=="string"){
params={};
params.url=_a;
_template=this;
params.onComplete=function(_c){
var _d=eval("("+_c.responseText+")");
MVC.View.prototype.update.call(_template,_9,_d);
};
if(!MVC.Ajax){
alert("You must include the Ajax plugin to use this feature");
}
new MVC.Ajax(params.url,params);
}else{
_9.innerHTML=this.render(_a);
}
}};
MVC.View.Scanner=function(_e,_f,_10){
this.left_delimiter=_f+"%";
this.right_delimiter="%"+_10;
this.double_left=_f+"%%";
this.double_right="%%"+_10;
this.left_equal=_f+"%=";
this.left_comment=_f+"%#";
if(_f=="["){
this.SplitRegexp=/(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/;
}else{
this.SplitRegexp=new RegExp("("+this.double_left+")|(%%"+this.double_right+")|("+this.left_equal+")|("+this.left_comment+")|("+this.left_delimiter+")|("+this.right_delimiter+"\n)|("+this.right_delimiter+")|(\n)");
}
this.source=_e;
this.stag=null;
this.lines=0;
};
MVC.View.Scanner.to_text=function(_11){
if(_11==null||_11===undefined){
return "";
}
if(_11 instanceof Date){
return _11.toDateString();
}
if(_11.toString){
return _11.toString();
}
return "";
};
MVC.View.Scanner.prototype={scan:function(_12){
scanline=this.scanline;
regex=this.SplitRegexp;
if(!this.source==""){
var _13=MVC.String.rsplit(this.source,/\n/);
for(var i=0;i<_13.length;i++){
var _15=_13[i];
this.scanline(_15,regex,_12);
}
}
},scanline:function(_16,_17,_18){
this.lines++;
var _19=MVC.String.rsplit(_16,_17);
for(var i=0;i<_19.length;i++){
var _1b=_19[i];
if(_1b!=null){
try{
_18(_1b,this);
}
catch(e){
throw {type:"MVC.View.Scanner",line:this.lines};
}
}
}
}};
MVC.View.Buffer=function(_1c,_1d){
this.line=new Array();
this.script="";
this.pre_cmd=_1c;
this.post_cmd=_1d;
for(var i=0;i<this.pre_cmd.length;i++){
this.push(_1c[i]);
}
};
MVC.View.Buffer.prototype={push:function(cmd){
this.line.push(cmd);
},cr:function(){
this.script=this.script+this.line.join("; ");
this.line=new Array();
this.script=this.script+"\n";
},close:function(){
if(this.line.length>0){
for(var i=0;i<this.post_cmd.length;i++){
this.push(pre_cmd[i]);
}
this.script=this.script+this.line.join("; ");
line=null;
}
}};
MVC.View.Compiler=function(_21,_22){
this.pre_cmd=["var ___ViewO = \"\";"];
this.post_cmd=new Array();
this.source=" ";
if(_21!=null){
if(typeof _21=="string"){
_21=_21.replace(/\r\n/g,"\n");
_21=_21.replace(/\r/g,"\n");
this.source=_21;
}else{
if(_21.innerHTML){
this.source=_21.innerHTML;
}
}
if(typeof this.source!="string"){
this.source="";
}
}
_22=_22||"<";
var _23=">";
switch(_22){
case "[":
_23="]";
break;
case "<":
break;
default:
throw _22+" is not a supported deliminator";
break;
}
this.scanner=new MVC.View.Scanner(this.source,_22,_23);
this.out="";
};
MVC.View.Compiler.prototype={compile:function(_24){
_24=_24||{};
this.out="";
var _25="___ViewO += ";
var _26=_25;
var _27=new MVC.View.Buffer(this.pre_cmd,this.post_cmd);
var _28="";
var _29=function(_2a){
_2a=_2a.replace(/\\/g,"\\\\");
_2a=_2a.replace(/\n/g,"\\n");
_2a=_2a.replace(/"/g,"\\\"");
return _2a;
};
this.scanner.scan(function(_2b,_2c){
if(_2c.stag==null){
switch(_2b){
case "\n":
_28=_28+"\n";
_27.push(_25+"\""+_29(_28)+"\";");
_27.cr();
_28="";
break;
case _2c.left_delimiter:
case _2c.left_equal:
case _2c.left_comment:
_2c.stag=_2b;
if(_28.length>0){
_27.push(_25+"\""+_29(_28)+"\"");
}
_28="";
break;
case _2c.double_left:
_28=_28+_2c.left_delimiter;
break;
default:
_28=_28+_2b;
break;
}
}else{
switch(_2b){
case _2c.right_delimiter:
switch(_2c.stag){
case _2c.left_delimiter:
if(_28[_28.length-1]=="\n"){
_28=MVC.String.chop(_28);
_27.push(_28);
_27.cr();
}else{
_27.push(_28);
}
break;
case _2c.left_equal:
_27.push(_26+"(MVC.View.Scanner.to_text("+_28+"))");
break;
}
_2c.stag=null;
_28="";
break;
case _2c.double_right:
_28=_28+_2c.right_delimiter;
break;
default:
_28=_28+_2b;
break;
}
}
});
if(_28.length>0){
_27.push(_25+"\""+_29(_28)+"\"");
}
_27.close();
this.out=_27.script+";";
var _2d="this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {"+this.out+" return ___ViewO;}}}catch(e){e.lineNumber=null;throw e;}};";
try{
eval(_2d);
}
catch(e){
if(typeof JSLINT!="undefined"){
JSLINT(this.out);
for(var i=0;i<JSLINT.errors.length;i++){
var _30=JSLINT.errors[i];
if(_30.reason!="Unnecessary semicolon."){
_30.line++;
var e=new Error();
e.lineNumber=_30.line;
e.message=_30.reason;
if(_24.url){
e.fileName=_24.url;
}
throw e;
}
}
}else{
throw e;
}
}
}};
MVC.View.config=function(_31){
MVC.View.cache=_31.cache!=null?_31.cache:MVC.View.cache;
MVC.View.type=_31.type!=null?_31.type:MVC.View.type;
var _32={};
MVC.View.get=function(_33,_34){
if(_34==false){
return null;
}
if(_32[_33]){
return _32[_33];
}
return null;
};
MVC.View.update=function(_35,_36){
if(_35==null){
return;
}
_32[_35]=_36;
};
MVC.View.INVALID_PATH=-1;
};
MVC.View.config({cache:include.get_env()=="production",type:"<"});
MVC.View.PreCompiledFunction=function(_37,f){
new MVC.View({name:_37,precompiled:f});
};
MVC.View.Helpers=function(_39){
this.data=_39;
};
MVC.View.Helpers.prototype={partial:function(_3a,_3b){
if(!_3b){
_3b=this.data;
}
return new MVC.View(_3a).render(_3b);
},to_text:function(_3c,_3d){
if(_3c==null||_3c===undefined){
return _3d||"";
}
if(_3c instanceof Date){
return _3c.toDateString();
}
if(_3c.toString){
return _3c.toString().replace(/\n/g,"<br />").replace(/''/g,"'");
}
return "";
}};
MVC.Included.views=[];
include.view=function(_3e){
MVC.Included.views.push(_3e.replace(/\.ejs/,""));
if(include.get_env()=="development"){
new MVC.View({url:_3e});
}else{
if(include.get_env()=="compress"){
var _3f=include.get_path();
include.set_path(MVC.root.path);
include({path:_3e,process:MVC.View.process_include,ignore:true});
include.set_path(_3f);
new MVC.View({url:_3e});
}else{
}
}
};
include.views=function(){
for(var i=0;i<arguments.length;i++){
include.view(arguments[i]+".ejs");
}
};
MVC.View.process_include=function(_41){
var _42=new MVC.View({text:_41.text});
return "MVC.View.PreCompiledFunction(\""+_41.original_path+"\", function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {"+_42.out()+" return ___ViewO;}}}catch(e){e.lineNumber=null;throw e;}})";
};
if(!MVC._no_conflict){
View=MVC.View;
}
MVC.Native.extend("String",{rsplit:function(_43,_44){
var _45=_44.exec(_43);
var _46=new Array();
while(_45!=null){
var _47=_45.index;
var _48=_44.lastIndex;
if((_47)!=0){
var _49=_43.substring(0,_47);
_46.push(_43.substring(0,_47));
_43=_43.slice(_47);
}
_46.push(_45[0]);
_43=_43.slice(_45[0].length);
_45=_44.exec(_43);
}
if(!_43==""){
_46.push(_43);
}
return _46;
},chop:function(_4a){
return this.substr(0,this.length-1);
}});
;
include.set_path('../../jmvc/plugins/controller');
MVC.Object.is_number=function(o){
return o&&(typeof o=="number"||(typeof o=="string"&&!isNaN(o)));
};
MVC.Controller=MVC.Class.extend({init:function(){
if(!this.className){
return;
}
this.singularName=MVC.String.singularize(this.className);
MVC.Controller.controllers.push(this);
var _2,_3;
this.actions={};
for(var _4 in this.prototype){
_2=this.prototype[_4];
if(typeof _2=="function"&&_4!="Class"){
for(var a=0;a<MVC.Controller.actions.length;a++){
_3=MVC.Controller.actions[a];
if(_3.matches(_4)){
this.actions[_4]=new _3(_4,_2,this);
}
}
}
}
this.modelName=MVC.String.classize(MVC.String.is_singular(this.className)?this.className:MVC.String.singularize(this.className));
if(include.get_env()=="test"){
var _6=MVC.root.join("test/functional/"+this.className+"_controller_test.js");
var _7=include.check_exists(_6);
if(_7){
MVC.Console.log("Loading: \"test/functional/"+this.className+"_controller_test.js\"");
}else{
MVC.Console.log("Test Controller not found at \"test/functional/"+this.className+"_controller_test.js\"");
return;
}
var p=include.get_path();
include.set_path(MVC.root.path);
include("test/functional/"+this.className+"_controller_test.js");
include.set_path(p);
}
},add_kill_event:function(_9){
if(!_9.kill){
var _a=false;
_9.kill=function(){
_a=true;
if(!_9){
_9=window.event;
}
try{
_9.cancelBubble=true;
if(_9.stopPropagation){
_9.stopPropagation();
}
if(_9.preventDefault){
_9.preventDefault();
}
}
catch(e){
}
};
_9.is_killed=function(){
return _a;
};
}
},event_closure:function(_b,_c,_d){
return function(_e){
MVC.Controller.add_kill_event(_e);
var _f=new MVC.Controller.Params({event:_e,element:_d,action:_c,controller:_b});
return MVC.Controller.dispatch(_b,_c,_f);
};
},dispatch_closure:function(_10,_11){
return function(_12){
MVC.Controller.add_kill_event(_12.event);
_12.action=_11;
_12.controller=_10;
return MVC.Controller.dispatch(_10,_11,new MVC.Controller.Params(_12));
};
},dispatch:function(_13,_14,_15){
var _16=_13;
if(typeof _13=="string"){
_13=window[MVC.String.classize(_13)+"Controller"];
}
if(!_13){
throw "No controller named "+_16+" was found for MVC.Controller.dispatch.";
}
if(!_14){
_14="index";
}
if(typeof _14=="string"){
if(!(_14 in _13.prototype)){
throw "No action named "+_14+" was found for "+_16+".";
}
}else{
_14=_14.name;
}
var _17=new _13();
_17.params=_15;
_17.action_name=_14;
_17.controller_name=_13.className;
return MVC.Controller._dispatch_action(_17,_14,_15);
},_dispatch_action:function(_18,_19,_1a){
return _18[_19](_1a);
},controllers:[],actions:[]},{continue_to:function(_1b){
if(!_1b){
_1b=this.action.name+"ing";
}
if(typeof this[_1b]!="function"){
throw "There is no action named "+_1b+". ";
}
return MVC.Function.bind(function(){
this.action_name=_1b;
this[_1b].apply(this,arguments);
},this);
},delay:function(_1c,_1d){
if(typeof this[_1d]!="function"){
throw "There is no action named "+actaction_nameion+". ";
}
return setTimeout(MVC.Function.bind(function(){
this.action_name=_1d;
this[_1d].apply(this,arguments);
},this),_1c);
},dispatch_delay:function(_1e,_1f,_20){
var _21=_1f.controller?_1f.controller:this.Class.className;
_1f=typeof _1f=="string"?_1f:_1f.action;
return setTimeout(function(){
MVC.Controller.dispatch(_21,_1f,_20);
},_1e);
}});
MVC.Controller.Action=MVC.Class.extend({init:function(){
if(this.matches){
MVC.Controller.actions.push(this);
}
}},{init:function(_22,f,_24){
this.action=_22;
this.func=f;
this.controller=_24;
}});
MVC.Controller.DelegateAction=MVC.Controller.Action.extend({match:new RegExp("(.*?)\\s?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|resize|scroll|select|submit|dblclick|focus|blur|load|unload)$"),matches:function(_25){
return this.match.exec(_25);
}},{init:function(_26,f,_28){
this._super(_26,f,_28);
this.css_and_event();
var _29=this.selector();
if(_29!=null){
new MVC.Delegator(_29,this.event_type,this.controller.dispatch_closure(_28.className,_26));
}
},css_and_event:function(){
this.parts=this.action.match(this.Class.match);
this.css=this.parts[1];
this.event_type=this.parts[2];
},main_controller:function(){
if(!this.css&&MVC.Array.include(["blur","focus"],this.event_type)){
MVC.Event.observe(window,this.event_type,MVC.Controller.event_closure(this.controller,this.event_type,window));
return;
}
return this.css;
},plural_selector:function(){
if(this.css=="#"||this.css.substring(0,2)=="# "){
var _2a=this.css.substring(2,this.css.length);
return "#"+this.controller.className+(_2a?" "+_2a:"");
}else{
return "."+MVC.String.singularize(this.controller.className)+(this.css?" "+this.css:"");
}
},singular_selector:function(){
return "#"+this.controller.className+(this.css?" "+this.css:"");
},selector:function(){
if(MVC.Array.include(["load","unload","resize","scroll"],this.event_type)){
MVC.Event.observe(window,this.event_type,MVC.Controller.event_closure(this.controller,this.event_type,window));
return;
}
if(this.controller.className=="main"){
this.css_selector=this.main_controller();
}else{
this.css_selector=MVC.String.is_singular(this.controller.className)?this.singular_selector():this.plural_selector();
}
return this.css_selector;
}});
MVC.Controller.Params=function(_2b){
for(var _2c in _2b){
if(_2b.hasOwnProperty(_2c)){
this[_2c]=_2b[_2c];
}
}
};
MVC.Controller.Params.prototype={form_params:function(){
var _2d={};
if(this.element.nodeName.toLowerCase()!="form"){
return _2d;
}
var els=this.element.elements,_2f=[];
for(var i=0;i<els.length;i++){
var el=els[i];
if(el.type.toLowerCase()=="submit"){
continue;
}
var key=el.name||el.id,_33=key.match(/(\w+)/g),_34;
if(!key){
continue;
}
switch(el.type.toLowerCase()){
case "checkbox":
case "radio":
_34=!!el.checked;
break;
default:
_34=el.value;
break;
}
if(_33.length>1){
var _35=_33.length-1;
var _36=_33[0].toString();
if(!_2d[_36]){
_2d[_36]={};
}
var _37=_2d[_36];
for(var k=1;k<_35;k++){
_36=_33[k];
if(!_37[_36]){
_37[_36]={};
}
_37=_37[_36];
}
_37[_33[_35]]=_34;
}else{
if(key in _2d){
if(typeof _2d[key]=="string"){
_2d[key]=[_2d[key]];
}
_2d[key].push(_34);
}else{
_2d[key]=_34;
}
}
}
return _2d;
},class_element:function(){
var _39=this.element,_3a=this.controller;
var _3b=MVC.String.is_singular(_3a)?_3a:MVC.String.singularize(_3a);
while(_39&&_39.className.indexOf(_3b)==-1){
_39=_39.parentNode;
if(_39==document){
return null;
}
}
return _39;
},is_event_on_element:function(){
return this.event.target==this.element;
},object_data:function(){
return MVC.View.Helpers.get_data(this.class_element());
}};
;
include.set_path('../../jmvc/plugins/controller');
MVC.Delegator=function(_1,_2,f){
this._event=_2;
this._selector=_1;
this._func=f;
if(_2=="contextmenu"&&MVC.Browser.Opera){
return this.context_for_opera();
}
if(_2=="submit"&&MVC.Browser.IE){
return this.submit_for_ie();
}
if(_2=="change"&&MVC.Browser.IE){
return this.change_for_ie();
}
if(_2=="change"&&MVC.Browser.WebKit){
return this.change_for_webkit();
}
this.add_to_delegator();
};
MVC.Object.extend(MVC.Delegator,{node_path:function(el){
var _5=document.documentElement,_6=[],_7=el;
while(_7!=_5){
_6.unshift({tag:_7.nodeName,className:_7.className,id:_7.id,element:_7});
_7=_7.parentNode;
if(_7==null){
return [];
}
}
_6.push(_5);
return _6;
},dispatch_event:function(_8){
var _9=_8.target,_a=false,_b=true,_c=[];
var _d=MVC.Delegator.events[_8.type];
var _e=MVC.Delegator.node_path(_9);
for(var i=0;i<_d.length;i++){
var _10=_d[i];
var _11=_10.match(_9,_8,_e);
if(_11){
_c.push(_11);
}
}
if(_c.length==0){
return true;
}
MVC.Controller.add_kill_event(_8);
_c.sort(MVC.Delegator.sort_by_order);
var _12;
for(var m=0;m<_c.length;m++){
_12=_c[m];
_b=_12.delegation_event._func({event:_8,element:_12.node})&&_b;
if(_8.is_killed()){
return false;
}
}
},sort_by_order:function(a,b){
if(a.order<b.order){
return 1;
}
if(b.order<a.order){
return -1;
}
var ae=a._event,be=b._event;
if(ae=="click"&&be=="change"){
return 1;
}
if(be=="click"&&ae=="change"){
return -1;
}
return 0;
},events:{}});
MVC.Delegator.prototype={event:function(){
if(MVC.Browser.IE){
if(this._event=="focus"){
return "activate";
}else{
if(this._event=="blur"){
return "deactivate";
}
}
}
return this._event;
},capture:function(){
return MVC.Array.include(["focus","blur"],this._event);
},add_to_delegator:function(_18,_19,_1a){
var s=_18||this._selector;
var e=_19||this.event();
var f=_1a||this._func;
if(!MVC.Delegator.events[e]){
MVC.Event.observe(document.documentElement,e,MVC.Delegator.dispatch_event,this.capture());
MVC.Delegator.events[e]=[];
}
MVC.Delegator.events[e].push(this);
},submit_for_ie:function(){
this.add_to_delegator(null,"click");
this.add_to_delegator(null,"keypress");
this.filters={click:function(el,_1f){
return el.nodeName.toUpperCase()=="INPUT"&&el.type.toLowerCase()=="submit";
},keypress:function(el,_21){
if(el.nodeName.toUpperCase()!="INPUT"){
return false;
}
if(typeof Prototype!="undefined"){
return _21.keyCode==13;
}
return _21.charCode==13;
}};
},change_for_ie:function(){
this.add_to_delegator(null,"click");
this.end_filters={click:function(el,_23){
if(typeof el.selectedIndex=="undefined"||el.nodeName.toUpperCase()!="SELECT"){
return false;
}
var old=el.getAttribute("_old_value");
if(old==null){
el.setAttribute("_old_value",el.selectedIndex);
return false;
}else{
if(old==el.selectedIndex.toString()){
return false;
}
el.setAttribute("_old_value",null);
return true;
}
}};
},change_for_webkit:function(){
this.controller.add_register_action(this,document.documentElement,"change");
this.end_filters={change:function(el,_26){
if(typeof el.value=="undefined"){
return false;
}
var old=el.getAttribute("_old_value");
el.setAttribute("_old_value",el.value);
return el.value!=old;
}};
},context_for_opera:function(){
this.add_to_delegator(null,"click");
this.end_filters={click:function(el,_29){
return _29.shiftKey;
}};
},regexp_patterns:{tag:/^\s*(\*|[\w\-]+)(\b|$)?/,id:/^#([\w\-\*]+)(\b|$)/,className:/^\.([\w\-\*]+)(\b|$)/},selector_order:function(){
if(this.order){
return this.order;
}
var _2a=this._selector.split(/\s+/);
var _2b=this.regexp_patterns;
var _2c=[];
for(var i=0;i<_2a.length;i++){
var v={},r,p=_2a[i];
for(var _31 in _2b){
if(_2b.hasOwnProperty(_31)){
if((r=p.match(_2b[_31]))){
if(_31=="tag"){
v[_31]=r[1].toUpperCase();
}else{
v[_31]=r[1];
}
p=p.replace(r[0],"");
}
}
}
_2c.push(v);
}
this.order=_2c;
return this.order;
},match:function(el,_33,_34){
if(this.filters&&!this.filters[_33.type](el,_33)){
return null;
}
var _35=0;
for(var n=0;n<_34.length;n++){
var _37=_34[n],_38=this.selector_order()[_35],_39=true;
for(var _3a in _38){
if(!_38.hasOwnProperty(_3a)||_3a=="element"){
continue;
}
if(_38[_3a]&&_3a=="className"){
if(!MVC.Array.include(_37.className.split(" "),_38[_3a])){
_39=false;
}
}else{
if(_38[_3a]&&_37[_3a]!=_38[_3a]){
_39=false;
}
}
}
if(_39){
_35++;
if(_35>=this.selector_order().length){
if(this.end_filters&&!this.end_filters[_33.type](el,_33)){
return null;
}
return {node:_37.element,order:n,delegation_event:this};
}
}
}
return null;
}};
;
include.set_path('../../jmvc/plugins/controller/view');
MVC.Controller.prototype.render=function(_1){
var _2,_3=MVC.RENDER_TO,_4;
var _5=this.Class.className;
var _6=this.action_name;
if(!_1){
_1={};
}
var _7={};
if(_1.helpers){
for(var h=0;h<_1.helpers.length;h++){
var n=MVC.String.classize(_1.helpers[h]);
MVC.Object.extend(_7,window[n]?window[n].View().helpers:{});
}
}
if(typeof _1=="string"){
_2=new MVC.View({url:_1}).render(this,_7);
}else{
if(_1.text){
_2=_1.text;
}else{
var _a=function(_b){
var _b=MVC.String.include(_b,"/")?_b.split("/").join("/_"):_5+"/"+_b;
var _b=_b+".ejs";
return _b;
};
if(_1.plugin){
_4="jmvc/plugins/"+_1.plugin;
}
if(_1.action){
var _c="views/"+_a(_1.action);
}else{
if(_1.partial){
var _c="views/"+_a(_1.partial);
}else{
var _c="views/"+_5+"/"+_6.replace(/\.|#/g,"").replace(/ /g,"_")+".ejs";
}
}
var _d=this;
if(_1.locals){
for(var _e in _1.locals){
_d[_e]=_1.locals[_e];
}
}
var _f;
if(!_4){
_f=new MVC.View({url:_c});
}else{
try{
var _f=new MVC.View({url:MVC.View.get(_4)?_4:_c});
}
catch(e){
if(e.type!="JMVC"){
throw e;
}
var _f=new MVC.View({url:_4});
}
}
_2=_f.render(_d,_7);
}
}
var _10=["to","before","after","top","bottom"];
var _11=null;
for(var l=0;l<_10.length;l++){
if(typeof _1[_10[l]]=="string"){
var id=_1[_10[l]];
_1[_10[l]]=MVC.$E(id);
if(!_1[_10[l]]){
throw {message:"Can't find element with id: "+id,name:"ControllerView: Missing Element"};
}
}
if(_1[_10[l]]){
_11=_1[_10[l]];
if(_10[l]=="to"){
if(MVC.$E.update){
MVC.$E.update(_1.to,_2);
}else{
_1.to.innerHTML=_2;
}
}else{
if(!MVC.$E.insert){
throw {message:"Include can't insert "+_10[l]+" without the element plugin.",name:"ControllerView: Missing Plugin"};
}
var opt={};
opt[_10[l]]=_2;
MVC.$E.insert(_11,opt);
}
}
}
return _2;
};
;
include.set_path('../../jmvc/plugins/dom/element');
include("vector","position");
if(typeof Prototype!="undefined"){
MVC.$E=$;
MVC.$E.insert=Element.insert;
}else{
if(typeof jQuery!="undefined"){
include("jquery_element");
}else{
include("element");
}
}
;
include.set_path('../../jmvc/plugins/dom/element');
MVC.Vector=function(){
this.update(MVC.Array.from(arguments));
};
MVC.Vector.prototype={app:function(f){
var _2=[];
for(var i=0;i<this.array.length;i++){
_2.push(f(this.array[i]));
}
var _4=new MVC.Vector();
return _4.update(_2);
},plus:function(){
var _5=arguments[0] instanceof MVC.Vector?arguments[0].array:MVC.Array.from(arguments),_6=this.array.slice(0),_7=new MVC.Vector();
for(var i=0;i<_5.length;i++){
_6[i]=(_6[i]?_6[i]:0)+_5[i];
}
return _7.update(_6);
},minus:function(){
var _9=arguments[0] instanceof MVC.Vector?arguments[0].array:MVC.Array.from(arguments),_a=this.array.slice(0),_b=new MVC.Vector();
for(var i=0;i<_9.length;i++){
_a[i]=(_a[i]?_a[i]:0)-_9[i];
}
return _b.update(_a);
},x:function(){
return this.array[1];
},y:function(){
return this.array[0];
},top:function(){
return this.array[1];
},left:function(){
return this.array[0];
},toString:function(){
return "("+this.array[0]+","+this.array[1]+")";
},update:function(_d){
if(this.array){
for(var i=0;i<this.array.length;i++){
delete this.array[i];
}
}
this.array=_d;
for(var i=0;i<_d.length;i++){
this[i]=this.array[i];
}
return this;
}};
MVC.Event.pointer=function(_f){
return new MVC.Vector(_f.pageX||(_f.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft)),_f.pageY||(_f.clientY+(document.documentElement.scrollTop||document.body.scrollTop)));
};
;
include.set_path('../../jmvc/plugins/dom/element');
MVC.Position={prepare:function(){
this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;
this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
},within:function(_1,x,y){
if(this.includeScrollOffsets){
return this.withinIncludingScrolloffsets(_1,x,y);
}
this.xcomp=x;
this.ycomp=y;
this.offset=MVC.Element.cumulativeOffset(_1);
return (y>=this.offset[1]&&y<this.offset[1]+_1.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+_1.offsetWidth);
},withinIncludingScrolloffsets:function(_4,x,y){
var _7=MVC.Element.cumulativeScrollOffset(_4);
this.xcomp=x+_7[0]-this.deltaX;
this.ycomp=y+_7[1]-this.deltaY;
this.offset=MVC.Element.cumulativeOffset(_4);
return (this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+_4.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+_4.offsetWidth);
}};
;
include.set_path('../../jmvc/plugins/dom/element');
MVC.Element=function(_1){
if(typeof _1=="string"){
_1=document.getElementById(_1);
}
if(!_1){
return _1;
}
return _1._mvcextend?_1:MVC.Element.extend(_1);
};
MVC.Object.extend(MVC.Element,{insert:function(_2,_3){
_2=MVC.$E(_2);
if(typeof _3=="string"){
_3={bottom:_3};
}
var _4,_5,_6,_7;
for(position in _3){
if(!_3.hasOwnProperty(position)){
continue;
}
_4=_3[position];
position=position.toLowerCase();
_5=MVC.$E._insertionTranslations[position];
if(_4&&_4.nodeType==1){
_5(_2,_4);
continue;
}
_6=((position=="before"||position=="after")?_2.parentNode:_2).tagName.toUpperCase();
_7=MVC.$E._getContentFromAnonymousElement(_6,_4);
if(position=="top"||position=="after"){
_7.reverse();
}
for(var c=0;c<_7.length;c++){
_5(_2,_7[c]);
}
}
return _2;
},_insertionTranslations:{before:function(_9,_a){
_9.parentNode.insertBefore(_a,_9);
},top:function(_b,_c){
_b.insertBefore(_c,_b.firstChild);
},bottom:function(_d,_e){
_d.appendChild(_e);
},after:function(_f,_10){
_f.parentNode.insertBefore(_10,_f.nextSibling);
},tags:{TABLE:["<table>","</table>",1],TBODY:["<table><tbody>","</tbody></table>",2],TR:["<table><tbody><tr>","</tr></tbody></table>",3],TD:["<table><tbody><tr><td>","</td></tr></tbody></table>",4],SELECT:["<select>","</select>",1]}},_getContentFromAnonymousElement:function(_11,_12){
var div=document.createElement("div"),t=MVC.$E._insertionTranslations.tags[_11];
if(t){
div.innerHTML=t[0]+_12+t[1];
for(var i=0;i<t[2];i++){
div=div.firstChild;
}
}else{
div.innerHTML=_12;
}
return MVC.Array.from(div.childNodes);
},get_children:function(_16){
var els=[];
var el=_16.first();
while(el){
el=els.push(el).next();
}
return els;
},first:function(_19,_1a){
_1a=_1a||function(){
return true;
};
var _1b=_19.firstChild;
while(_1b&&_1b.nodeType!=1||(_1b&&!_1a(_1b))){
_1b=_1b.nextSibling;
}
return MVC.$E(_1b);
},last:function(_1c,_1d){
_1d=_1d||function(){
return true;
};
var _1e=_1c.lastChild;
while(_1e&&_1e.nodeType!=1||(_1e&&!_1d(_1e))){
_1e=_1e.previousSibling;
}
return MVC.$E(_1e);
},next:function(_1f,_20,_21){
_21=_21||function(){
return true;
};
var _22=_1f.nextSibling;
while(_22&&_22.nodeType!=1||(_22&&!_21(_22))){
_22=_22.nextSibling;
}
if(!_22&&_20){
return MVC.$E(_1f.parentNode).first(_21);
}
return MVC.$E(_22);
},previous:function(_23,_24,_25){
_25=_25||function(){
return true;
};
var _26=_23.previousSibling;
while(_26&&_26.nodeType!=1||(_26&&!_25(_26))){
_26=_26.previousSibling;
}
if(!_26&&_24){
return MVC.$E(_23.parentNode).last(_25);
}
return MVC.$E(_26);
},toggle:function(_27){
return _27.style.display=="none"?_27.style.display="":_27.style.display="none";
},makePositioned:function(_28){
_28=MVC.$E(_28);
var pos=MVC.Element.getStyle(_28,"position");
if(pos=="static"||!pos){
_28._madePositioned=true;
_28.style.position="relative";
if(window.opera){
_28.style.top=0;
_28.style.left=0;
}
}
return _28;
},getStyle:function(_2a,_2b){
_2a=MVC.$E(_2a);
_2b=_2b=="float"?"cssFloat":MVC.String.camelize(_2b);
var _2c;
if(_2a.currentStyle){
var _2c=_2a.currentStyle[_2b];
}else{
var css=document.defaultView.getComputedStyle(_2a,null);
_2c=css?css[_2b]:null;
}
if(_2b=="opacity"){
return _2c?parseFloat(_2c):1;
}
return _2c=="auto"?null:_2c;
},cumulativeOffset:function(_2e){
var _2f=0,_30=0;
do{
_2f+=_2e.offsetTop||0;
_30+=_2e.offsetLeft||0;
_2e=_2e.offsetParent;
}while(_2e);
return new MVC.Vector(_30,_2f);
},cumulativeScrollOffset:function(_31){
var _32=0,_33=0;
do{
_32+=_31.scrollTop||0;
_33+=_31.scrollLeft||0;
_31=_31.parentNode;
}while(_31);
return new MVC.Vector(_33,_32);
},isParent:function(_34,_35){
if(!_35.parentNode||_35==_34){
return false;
}
if(_35.parentNode==_34){
return true;
}
return MVC.Element.isParent(_35.parentNode,_34);
},has:function(_36,b){
return _36.contains?_36!=b&&_36.contains(b):!!(_36.compareDocumentPosition(b)&16);
},update:function(_38,_39){
_38=MVC.$E(_38);
var _3a=_38.tagName.toUpperCase();
if((!MVC.Browser.IE&&!MVC.Browser.Opera)||!(_3a in MVC.$E._insertionTranslations.tags)){
_38.innerHTML=_39;
}else{
var _3b;
while((_3b=_38.childNodes[0])){
_38.removeChild(_3b);
}
var _3c=MVC.$E._getContentFromAnonymousElement(_3a,_39);
for(var c=0;c<_3c.length;c++){
_38.appendChild(_3c[c]);
}
}
return _38;
},remove:function(_3e){
return _3e.parentNode.removeChild(_3e);
},dimensions:function(_3f){
var _40=_3f.style.display;
if(_40!="none"&&_40!=null){
return new MVC.Vector(_3f.offsetWidth,_3f.offsetHeight);
}
var els=_3f.style;
var _42=els.visibility;
var _43=els.position;
var _44=els.display;
els.visibility="hidden";
els.position="absolute";
els.display="block";
var _45=_3f.clientWidth;
var _46=_3f.clientHeight;
els.display=_44;
els.position=_43;
els.visibility=_42;
return new MVC.Vector(_45,_46);
}});
MVC.Element.extend=function(el){
for(var f in MVC.Element){
if(!MVC.Element.hasOwnProperty(f)){
continue;
}
var _49=MVC.Element[f];
if(typeof _49=="function"){
if(f[0]!="_"){
MVC.Element._extend(_49,f,el);
}
}
}
el._mvcextend=true;
return el;
};
MVC.Element._extend=function(f,_4b,el){
el[_4b]=function(){
var arg=MVC.Array.from(arguments);
arg.unshift(el);
return f.apply(el,arg);
};
};
MVC.$E=MVC.Element;
if(!MVC._no_conflict){
$E=MVC.$E;
}
;
include.set_path('../../jmvc/plugins/controller/scaffold');
MVC.Controller.scaffold=function(){
if(!this.className){
return;
}
var _1=MVC.String.singularize(MVC.String.classize(this.className));
this.scaffold_model=window[_1];
this.singular_name=MVC.String.singularize(this.className);
for(var _2 in MVC.Controller.scaffold.functions){
if(this.prototype[_2]){
continue;
}
this.prototype[_2]=MVC.Controller.scaffold.functions[_2];
}
if(!window[_1+"ViewHelper"]){
this.scaffold_view_helper=window[_1+"ViewHelper"]=MVC.ModelViewHelper.extend(this.singular_name);
}else{
this.scaffold_view_helper=window[_1+"ViewHelper"];
}
};
MVC.Controller.scaffold.functions={load:function(_3){
if(!MVC.$E(this.controller_name)){
var _4=document.createElement("div");
_4.id=this.controller_name;
document.body.appendChild(_4);
}
this.Class.scaffold_model.find("all",{},this.continue_to("list"));
},list:function(_5){
this.singular_name=this.Class.singular_name;
this[this.controller_name]=_5;
this.objects=_5;
this.render({to:this.controller_name,plugin:"controller_scaffold/display",action:this.controller_name});
},"# form submit":function(_6){
_6.event.kill();
this.Class.scaffold_model.create(_6.form_params()[this.Class.singular_name],this.continue_to("created"));
},created:function(_7){
if(_7.errors.length>0){
_7.View().show_errors();
}else{
this.Class.scaffold_model.View().clear();
_7.View().clear_errors();
this[this.controller_name]=[_7];
this.objects=[_7];
this.singular_name=this.Class.singular_name;
this.render({bottom:"recipe_list",plugin:"controller_scaffold/list",action:"list"});
}
},".delete click":function(_8){
this[this.Class.singular_name]=_8.object_data();
if(confirm("Are you sure you want to delete")){
this[this.Class.singular_name].destroy(this.continue_to("destroyed"));
}
},".edit click":function(_9){
this[this.Class.singular_name]=_9.object_data();
this.singular_name=this.Class.singular_name;
this.render({to:this[this.Class.singular_name].View().element_id(),action:"edit",plugin:"controller_scaffold/edit"});
},".cancel click":function(_a){
this.show(_a.object_data());
},".save click":function(_b){
this[this.Class.singular_name]=_b.object_data();
var _c=this[this.Class.singular_name].View().edit_values();
this[this.Class.singular_name].update_attributes(_c,this.continue_to("show"));
},show:function(_d){
this[this.Class.singular_name]=_d;
this.singular_name=this.Class.singular_name;
this.render({to:this[this.Class.singular_name].View().element_id(),action:"show",plugin:"controller_scaffold/show"});
},destroyed:function(_e){
if(_e){
this[this.Class.singular_name].View().destroy();
}
}};
;
include.set_path('../../jmvc/plugins/view/helpers');
include.plugins("view");
include("view_helpers");
;
include.set_path('../../jmvc/plugins/view');
include.plugins("lang");
include("view");
if(include.get_env()=="development"){
include("fulljslint");
}
if(MVC.Controller){
include.plugins("controller/view");
}
;
include.set_path('../../jmvc/plugins/lang');
if(typeof Prototype!="undefined"){
include({path:"prototype_helpers.js",shrink_variables:false});
}else{
if(typeof jQuery!="undefined"){
include({path:"jquery_helpers.js",shrink_variables:false});
}else{
include({path:"standard_helpers.js",shrink_variables:false});
}
}
;
include.set_path('../../jmvc/plugins/controller/view');
include.plugins("view","controller");
include("controller_view");
;
include.set_path('../../jmvc/plugins/controller');
include.plugins("lang","lang/inflector","dom/event","lang/class");
include("delegator","controller");
if(MVC.View){
include.plugins("controller/view");
}
;
include.set_path('../../jmvc/plugins/lang/inflector');
include("inflector");
;
include.set_path('../../jmvc/plugins/dom/event');
if(typeof Prototype=="undefined"){
include("standard");
}else{
include("prototype_event");
}
;
include.set_path('../../jmvc/plugins/view/helpers');
MVC.Object.extend(MVC.View.Helpers.prototype,{check_box_tag:function(_1,_2,_3,_4){
_3=_3||{};
if(_4){
_3.checked="checked";
}
return this.input_field_tag(_1,_2,"checkbox",_3);
},date_tag:function(_5,_6,_7){
if(!(_6 instanceof Date)){
_6=new Date();
}
var _8=[],_9=[],_a=[];
var _b=_6.getFullYear(),_c=_6.getMonth(),_d=_6.getDate();
for(var y=_b-15;y<_b+15;y++){
_8.push({value:y,text:y});
}
for(var m=0;m<12;m++){
_9.push({value:(m),text:MVC.Date.month_names[m]});
}
for(var d=0;d<31;d++){
_a.push({value:(d+1),text:(d+1)});
}
var _11=this.select_tag(_5+"[year]",_b,_8,{id:_5+"[year]"});
var _12=this.select_tag(_5+"[month]",_c,_9,{id:_5+"[month]"});
var _13=this.select_tag(_5+"[day]",_d,_a,{id:_5+"[day]"});
return _11+_12+_13;
},file_tag:function(_14,_15,_16){
return this.input_field_tag(_14+"[file]",_15,"file",_16);
},form_tag:function(_17,_18){
_18=_18||{};
if(_18.multipart==true){
_18.method="post";
_18.enctype="multipart/form-data";
}
_18.action=_17;
return this.start_tag_for("form",_18);
},form_tag_end:function(){
return this.tag_end("form");
},hidden_field_tag:function(_19,_1a,_1b){
return this.input_field_tag(_19,_1a,"hidden",_1b);
},input_field_tag:function(_1c,_1d,_1e,_1f){
_1f=_1f||{};
_1f.id=_1f.id||_1c;
_1f.value=_1d||"";
_1f.type=_1e||"text";
_1f.name=_1c;
return this.single_tag_for("input",_1f);
},link_to:function(_20,url,_22){
if(!_20){
var _20="null";
}
if(!_22){
var _22={};
}
this.set_confirm(_22);
_22.href=url;
return this.start_tag_for("a",_22)+_20+this.tag_end("a");
},link_to_if:function(_23,_24,url,_26){
return this.link_to_unless((!_23),_24,url,_26);
},link_to_unless:function(_27,_28,url,_2a){
if(_27){
return _28;
}
return this.link_to(_28,url,_2a);
},set_confirm:function(_2b){
if(_2b.confirm){
_2b.onclick=_2b.onclick||"";
_2b.onclick=_2b.onclick+"; var ret_confirm = confirm(\""+_2b.confirm+"\"); if(!ret_confirm){ return false;} ";
_2b.confirm=null;
}
},submit_link_to:function(_2c,_2d,_2e,_2f){
if(!_2c){
var _2c="null";
}
if(!_2e){
_2e={};
}
_2e.type="submit";
_2e.value=_2c;
this.set_confirm(_2e);
_2e.onclick=_2e.onclick+";window.location=\""+_2d+"\"; return false;";
return this.single_tag_for("input",_2e);
},password_field_tag:function(_30,_31,_32){
return this.input_field_tag(_30,_31,"password",_32);
},select_tag:function(_33,_34,_35,_36){
_36=_36||{};
_36.id=_36.id||_33;
_36.name=_33;
var txt="";
txt+=this.start_tag_for("select",_36);
for(var i=0;i<_35.length;i++){
var _39=_35[i];
if(typeof _39=="string"){
_39={value:_39};
}
if(!_39.text){
_39.text=_39.value;
}
if(!_39.value){
_39.text=_39.text;
}
var _3a={value:_39.value};
if(_39.value==_34){
_3a.selected="selected";
}
txt+=this.start_tag_for("option",_3a)+_39.text+this.tag_end("option");
}
txt+=this.tag_end("select");
return txt;
},single_tag_for:function(tag,_3c){
return this.tag(tag,_3c,"/>");
},start_tag_for:function(tag,_3e){
return this.tag(tag,_3e);
},submit_tag:function(_3f,_40){
_40=_40||{};
_40.type=_40.type||"submit";
_40.value=_3f||"Submit";
return this.single_tag_for("input",_40);
},tag:function(tag,_42,end){
end=end||">";
var txt=" ";
for(var _45 in _42){
if(_42.hasOwnProperty(_45)){
value=_42[_45]!=null?_42[_45].toString():"";
if(_45=="Class"||_45=="klass"){
_45="class";
}
if(value.indexOf("'")!=-1){
txt+=_45+"=\""+value+"\" ";
}else{
txt+=_45+"='"+value+"' ";
}
}
}
return "<"+tag+txt+end;
},tag_end:function(tag){
return "</"+tag+">";
},text_area_tag:function(_47,_48,_49){
_49=_49||{};
_49.id=_49.id||_47;
_49.name=_49.name||_47;
_48=_48||"";
if(_49.size){
_49.cols=_49.size.split("x")[0];
_49.rows=_49.size.split("x")[1];
delete _49.size;
}
_49.cols=_49.cols||50;
_49.rows=_49.rows||4;
return this.start_tag_for("textarea",_49)+_48+this.tag_end("textarea");
},text_field_tag:function(_4a,_4b,_4c){
return this.input_field_tag(_4a,_4b,"text",_4c);
},img_tag:function(_4d,_4e){
_4e=_4e||{};
_4e.src="resources/images/"+_4d;
return this.single_tag_for("img",_4e);
}});
MVC.View.Helpers.prototype.text_tag=MVC.View.Helpers.prototype.text_area_tag;
(function(){
var _4f={};
var _50=0;
MVC.View.Helpers.link_data=function(_51){
var _52=_50++;
_4f[_52]=_51;
return "_data='"+_52+"'";
};
MVC.View.Helpers.get_data=function(el){
if(!el){
return null;
}
var _54=el.getAttribute("_data");
if(!_54){
return null;
}
return _4f[parseInt(_54)];
};
MVC.View.Helpers.prototype.link_data=function(_55){
return MVC.View.Helpers.link_data(_55);
};
MVC.View.Helpers.prototype.get_data=function(el){
return MVC.View.Helpers.get_data(el);
};
})();
;
include.set_path('../../jmvc/plugins/controller/comet');
include.plugins("io/comet");
include("comet_controller");
;
include.set_path('../../jmvc/plugins/controller/comet');
MVC.CometController=MVC.Controller.extend({init:function(){
},run:function(){
var _1=new this();
_1.run();
},kill:function(){
var _2=new this();
_2.kill();
},convert:function(_3){
return _3;
},set_wait_time:function(_4){
this._wait_time=_4*1000;
if(this._comet){
this._comet.poll_now();
}
},_wait_time:0,wait_time:function(){
return this._wait_time;
},dispatch:function(_5){
var _6=this.convert(_5);
for(var _7 in _5){
if(_7=="responseText"){
continue;
}
var _8=_5[_7];
for(var _9 in _8){
var _a=_8[_9];
if(this.models_map[_7]!=null){
if(this.models_map[_7]!=false){
_a=this.models_map[_7].create_many_as_existing(_a);
}
}else{
if(window[_7]){
_a=window[_7].create_many_as_existing(_a);
}
}
var _b=this.controller_map[_7]?this.controller_map[_7]:MVC.String.pluralize(_7);
MVC.Controller.dispatch(_b,_9,_a);
}
}
},controller_map:{},error_mode:false},{run:function(){
this.start_polling();
},start_polling:function(){
this.Class._comet=new MVC.Comet(this.Class.domain+"/"+this.Class.className,{method:"get",onComplete:this.continue_to("complete"),onSuccess:this.continue_to("success"),onFailure:this.continue_to("failure"),parameters:this.Class.parameters||null,session:this.Class.session||null,transport:this.Class.transport,wait_time:MVC.Function.bind(this.Class.wait_time,this.Class)});
},failure:function(){
this.error_mode=true;
this.run();
},success:function(_c){
this.Class.dispatch(_c);
},complete:function(){
if(this.error_mode&&this.restore_from_failure){
this.restore_from_failure();
}
this.error_mode=false;
},kill:function(){
if(this.Class._comet){
this.Class._comet.kill();
}
}});
;
include.set_path('../../jmvc/plugins/controller/dragdrop');
include.plugins("controller","dom/element","dom/query");
include("drag","drop");
;
include.set_path('../../jmvc/plugins/controller/dragdrop');
MVC.Controller.DragAction=MVC.Controller.DelegateAction.extend({match:new RegExp("(.*?)\\s?(dragstart|dragend|dragging)$")},{init:function(_1,f,_3){
this.action=_1;
this.func=f;
this.controller=_3;
this.css_and_event();
var _4=this.selector();
if(MVC.Draggable.selectors[_4]){
MVC.Draggable.selectors[_4].events[this.event_type]=_1;
return;
}
MVC.Draggable.selectors[_4]=new MVC.Delegator(this.selector(),"mousedown",function(_5){
for(var _6 in MVC.Draggable.selectors[_4].events){
if(MVC.Draggable.selectors[_4].events.hasOwnProperty(_6)){
_5[_6]=MVC.Controller.dispatch_closure(_3.className,MVC.Draggable.selectors[_4].events[_6]);
}
}
MVC.Draggable.current=new MVC.Draggable(_5);
});
MVC.Draggable.selectors[_4].events={};
MVC.Draggable.selectors[_4].events[this.event_type]=_1;
}});
MVC.Draggable=function(_7){
this.element=_7.element;
this.moved=false;
this.mouse_position_on_element=MVC.Event.pointer(_7.event).minus(MVC.Element.cumulativeOffset(_7.element));
this.dragstart=_7.dragstart||function(){
};
this.dragend=_7.dragend||function(){
};
this.dragging=_7.dragging||function(){
};
};
MVC.Draggable.prototype={start:function(_8){
MVC.Element.makePositioned(this.element);
this.element.style.zIndex=1000;
this.moved=true;
this.dragstart({element:this.element,event:_8});
MVC.Droppables.compile();
},currentDelta:function(){
return new MVC.Vector(parseInt(MVC.Element.getStyle(this.element,"left")||"0"),parseInt(MVC.Element.getStyle(this.element,"top")||"0"));
},draw:function(_9,_a){
if(!this.moved){
this.start(_a);
}
MVC.Position.prepare();
var _b=MVC.Element.cumulativeOffset(this.element).minus(this.currentDelta());
var p=_9.minus(_b).minus(this.mouse_position_on_element);
var s=this.element.style;
s.top=p.top()+"px";
s.left=p.left()+"px";
MVC.Droppables.show(_9,this.element,_a);
this.dragging({element:this.element,event:_a});
}};
MVC.Draggable.selectors={};
MVC.Draggable.current=null;
MVC.Event.observe(document,"mousemove",function(_e){
if(!MVC.Draggable.current){
return;
}
MVC.Draggable.current.draw(MVC.Event.pointer(_e),_e);
});
MVC.Event.observe(document,"mouseup",function(_f){
if(MVC.Draggable.current){
MVC.Draggable.current.dragend({element:MVC.Draggable.current.element,event:_f});
MVC.Droppables.fire(_f,MVC.Draggable.current.element);
}
MVC.Draggable.current=null;
});
;
include.set_path('../../jmvc/plugins/controller/dragdrop');
MVC.Controller.DropAction=MVC.Controller.DelegateAction.extend({match:new RegExp("(.*?)\\s?(dragover|dropped|dragout)$")},{init:function(_1,f,_3){
this.action=_1;
this.func=f;
this.controller=_3;
this.css_and_event();
var _4=this.selector();
if(MVC.Droppables.selectors[_4]){
MVC.Droppables.selectors[_4][this.event_type]=MVC.Controller.dispatch_closure(_3.className,_1);
return;
}
MVC.Droppables.selectors[_4]={};
MVC.Droppables.selectors[_4][this.event_type]=MVC.Controller.dispatch_closure(_3.className,_1);
}});
MVC.Droppables={drops:[],selectors:{},remove:function(_5){
this.drops=this.drops.reject(function(d){
return d.element==$(_5);
});
},add:function(_7){
_7=MVC.$E(_7);
var _8=MVC.Object.extend({},arguments[1]||{});
MVC.Element.makePositioned(_7);
_8.element=_7;
this.drops.push(_8);
},findDeepestChild:function(_9){
var _a=_9[0];
for(i=1;i<_9.length;++i){
if(MVC.Element.isParent(_9[i].element,_a.element)){
_a=_9[i];
}
}
return _a;
},isContained:function(_b,_c){
var _d=_b.parentNode;
for(var c=0;i<_c._containers.length;i++){
if(_d==_c._containers[c]){
return _c._containers[c];
}
}
},isAffected:function(_f,_10,_11){
return ((_11.element!=_10)&&((!_11._containers)||this.isContained(_10,_11))&&MVC.Position.withinIncludingScrolloffsets(_11.element,_f[0],_f[1]));
},deactivate:function(_12,_13,_14){
this.last_active=null;
if(_12.dragout){
_12.dragout({element:_12.element,drag_element:_13,event:_14});
}
},activate:function(_15,_16,_17){
this.last_active=_15;
if(_15.dragover){
_15.dragover({element:_15.element,drag_element:_16,event:_17});
}
},show:function(_18,_19,_1a){
if(!this.drops.length){
return;
}
var _1b,_1c=[];
for(var d=0;d<this.drops.length;d++){
if(MVC.Droppables.isAffected(_18,_19,this.drops[d])){
_1c.push(this.drops[d]);
}
}
if(_1c.length>0){
_1b=MVC.Droppables.findDeepestChild(_1c);
}
if(this.last_active&&this.last_active!=_1b){
this.deactivate(this.last_active,_19,_1a);
}
if(_1b){
MVC.Position.within(_1b.element,_18[0],_18[1]);
if(_1b!=this.last_active){
MVC.Droppables.activate(_1b,_19,_1a);
}
}
},fire:function(_1e,_1f){
if(!this.last_active){
return;
}
MVC.Position.prepare();
if(this.isAffected(MVC.Event.pointer(_1e),_1f,this.last_active)){
if(this.last_active.dropped){
this.last_active.dropped({dropped_element:_1f,event:_1e,element:this.last_active.element});
return true;
}
}
},reset:function(){
if(this.last_active){
this.deactivate(this.last_active);
}
},compile:function(){
var _20=[];
for(var _21 in MVC.Droppables.selectors){
var _22=_20.concat(MVC.Query(_21));
for(var e=0;e<_22.length;e++){
MVC.Droppables.add(_22[e],MVC.Droppables.selectors[_21]);
}
}
}};
;
include.set_path('../../jmvc/plugins/dom/query');
if(typeof Prototype!="undefined"){
MVC.Query=$$;
MVC.Query.descendant=function(_1,_2){
return _1.getElementsBySelector(_2);
};
}else{
include("standard");
}
;
include.set_path('../../jmvc/plugins/dom/query');
MVC.Query=function(){
var _1="2.0.3";
cssQuery.uniqueIds=true;
cssQuery.caching=false;
var _2=/\s*,\s*/;
function cssQuery(_3,_4){
try{
var _5=[];
var _6=cssQuery.caching&&!_4;
var _7=_4?(_4.constructor==Array)?_4:[_4]:[document];
var _8=_9(_3).split(_2),i;
for(i=0;i<_8.length;i++){
_3=_toStream(_8[i]);
_4=_7;
if(_3.slice(0,3).join("")==" *#"){
var id=_3[3];
if(cssQuery.uniqueIds&&_7.length==1&&_7[0].getElementById){
_4=[_7[0].getElementById(id)];
_3=_3.slice(4);
}else{
if(_c){
_4=_msie_selectById([],_7,id);
_3=_3.slice(4);
}
}
}
var j=0,_e,_f,_10,_11="";
while(j<_3.length){
_e=_3[j++];
_f=_3[j++];
_11+=_e+_f;
_10="";
if(_3[j]=="("){
while(_3[j++]!=")"&&j<_3.length){
_10+=_3[j];
}
_10=_10.slice(0,-1);
_11+="("+_10+")";
}
_4=(_6&&_12[_11])?_12[_11]:select(_4,_e,_f,_10);
if(_6){
_12[_11]=_4;
}
}
_5=_5.concat(_4);
}
delete cssQuery.error;
return _5;
}
catch($error){
cssQuery.error=$error;
return [];
}
};
cssQuery.toString=function(){
return "function cssQuery() {\n  [version "+_1+"]\n}";
};
var _12={};
cssQuery.clearCache=function(_13){
if(_13){
_13=_toStream(_13).join("");
delete _12[_13];
}else{
_12={};
}
};
var _14={};
var _15=false;
cssQuery.addModule=function(_16,_17){
if(_15){
eval("$script="+String(_17));
}
_14[_16]=new _17();
};
cssQuery.valueOf=function(_18){
return _18?eval(_18):this;
};
var _19={};
var _1a={};
var _1b={match:/\[([\w-]+(\|[\w-]+)?)\s*(\W?=)?\s*([^\]]*)\]/};
var _1c=[];
_19[" "]=function(_1d,_1e,_1f,_20){
var _21,i,j;
for(i=0;i<_1e.length;i++){
var _24=_25(_1e[i],_1f,_20);
for(j=0;(_21=_24[j]);j++){
if(_26(_21)&&_27(_21,_20)){
_1d.push(_21);
}
}
}
};
_19["#"]=function(_28,_29,$id){
var _2b,j;
for(j=0;(_2b=_29[j]);j++){
if(_2b.id==$id){
_28.push(_2b);
}
}
};
_19["."]=function(_2d,_2e,_2f){
_2f=new RegExp("(^|\\s)"+_2f+"(\\s|$)");
var _30,i;
for(i=0;(_30=_2e[i]);i++){
if(_2f.test(_30.className)){
_2d.push(_30);
}
}
};
_19[":"]=function(_32,_33,_34,_35){
var _36=_1a[_34],_37,i;
if(_36){
for(i=0;(_37=_33[i]);i++){
if(_36(_37,_35)){
_32.push(_37);
}
}
}
};
_1a["link"]=function(_39){
var _3a=_3b(_39).links;
if(_3a){
for(var i=0;i<_3a.length;i++){
if(_3a[i]==_39){
return true;
}
}
}
};
_1a["visited"]=function(_3d){
};
var _26=function(_3e){
return (_3e&&_3e.nodeType==1&&_3e.tagName!="!")?_3e:null;
};
var _3f=function(_40){
while(_40&&(_40=_40.previousSibling)&&!_26(_40)){
continue;
}
return _40;
};
var _41=function(_42){
while(_42&&(_42=_42.nextSibling)&&!_26(_42)){
continue;
}
return _42;
};
var _43=function(_44){
return _26(_44.firstChild)||_41(_44.firstChild);
};
var _45=function(_46){
return _26(_46.lastChild)||_3f(_46.lastChild);
};
var _47=function(_48){
var _49=[];
_48=_43(_48);
while(_48){
_49.push(_48);
_48=_41(_48);
}
return _49;
};
var _c=true;
var _4a=function(_4b){
return !_3b(_4b).write;
};
var _3b=function(_4c){
return _4c.ownerDocument||_4c.document||_4c;
};
var _25=function(_4d,_4e,_4f){
if(_4a(_4d)&&_4f){
_4e=_4f+":"+_4e;
}
return (_4e=="*"&&_4d.all)?_4d.all:_4d.getElementsByTagName(_4e);
};
var _50=function(_51,_52,_53){
if(_52=="*"){
return _26(_51);
}
if(!_27(_51,_53)){
return false;
}
if(!_4a(_51)){
_52=_52.toUpperCase();
}
return _51.tagName==_52;
};
var _27=function(_54,_55){
if(_4a(_54)){
return true;
}
return !_55||(_55=="*")||(_54.scopeName==_55);
};
var _56=function(_57){
return _57.innerText;
};
function _msie_selectById(_58,_59,id){
var _5b,i,j;
for(i=0;i<_59.length;i++){
_5b=_59[i].all.item(id);
if(_5b){
if(_5b.id==id){
_58.push(_5b);
}else{
if(_5b.length!=null){
for(j=0;j<_5b.length;j++){
if(_5b[j].id==id){
_58.push(_5b[j]);
}
}
}
}
}
}
return _58;
};
if(![].push){
Array.prototype.push=function(){
for(var i=0;i<arguments.length;i++){
this[this.length]=arguments[i];
}
return this.length;
};
}
var _5f=/\|/;
function select(_60,_61,_62,_63){
if(_5f.test(_62)){
_62=_62.split(_5f);
_63=_62[0];
_62=_62[1];
}
var _64=[];
if(_19[_61]){
_19[_61](_64,_60,_62,_63);
}
return _64;
};
var _65=/^[^\s>+~]/;
var _66=/[\s#.:>+~()@]|[^\s#.:>+~()@]+/g;
function _toStream(_67){
if(_65.test(_67)){
_67=" "+_67;
}
return _67.match(_66)||[];
};
var _68=/\s*([\s>+~(),]|^|$)\s*/g;
var _69=/([\s>+~,]|[^(]\+|^)([#.:@])/g;
var _9=function(_6a){
return _6a.replace(_68,"$1").replace(_69,"$1*$2");
};
var _6b={toString:function(){
return "'";
},match:/^('[^']*')|("[^"]*")$/,test:function(_6c){
return this.match.test(_6c);
},add:function(_6d){
return this.test(_6d)?_6d:this+_6d+this;
},remove:function(_6e){
return this.test(_6e)?_6e.slice(1,-1):_6e;
}};
var _6f=function(_70){
return _6b.remove(_70);
};
var _71=/([\/()[\]?{}|*+-])/g;
function regEscape(_72){
return _72.replace(_71,"\\$1");
};
_15=true;
var _73=(typeof Document=="function")?Document.prototype:document;
_73.matchAll=function(_74){
return cssQuery(_74,[this]);
};
_73.match=function(_75){
return this.matchAll(_75)[0];
};
return cssQuery;
}();
MVC.Query.descendant=function(_76,_77){
return MVC.Query(_77,_76);
};
if(!MVC._no_conflict){
Query=MVC.Query;
}
;
include.set_path('../../jmvc/plugins/io/comet');
include.plugins("dom/event");
include("comet");
;
include.set_path('../../jmvc/plugins/io/comet');
MVC.Comet=function(_1,_2){
this.url=_1;
this.options=_2||{};
this.options.wait_time=this.options.wait_time||0;
this.onSuccess=_2.onSuccess;
this.onComplete=_2.onComplete;
this.onFailure=_2.onFailure;
delete this.options.onSuccess;
delete this.options.onComplete;
this.options.onComplete=MVC.Function.bind(this.callback,this);
var _3=false;
var _4=true;
this.kill=function(){
_3=true;
};
this.poll_now=function(){
if(this.is_polling()){
return;
}
clearTimeout(this.timeout);
this.options.polling();
new this.transport(this.url,this.options);
};
this.options.is_killed=function(){
return _3;
};
this.options.waiting_to_poll=function(){
_4=false;
};
this.options.polling=function(){
_4=true;
};
this.is_polling=function(){
return _4;
};
this.transport=this.options.transport||MVC.Comet.transport;
new this.transport(_1,this.options);
};
MVC.Comet.transport=MVC.Ajax;
MVC.Comet.prototype={callback:function(_5){
this.options.waiting_to_poll();
if(this.options.is_killed()){
return;
}
if(this.onSuccess&&_5.responseText!=""&&this.onSuccess(_5)==false){
return false;
}
if(this.onComplete){
if(this.onComplete(_5)==false){
return false;
}
}
var _6=this.url;
var _7=this.options;
var _5=this.transport;
var _8=typeof _7.wait_time=="function"?_7.wait_time():_7.wait_time;
this.timeout=setTimeout(function(){
_7.polling();
new _5(_6,_7);
},_8);
}};
MVC.Event.observe(window,"unload",function(){
MVC.Comet.send=false;
});
if(!MVC._no_conflict&&typeof Comet=="undefined"){
Comet=MVC.Comet;
}
;
include.set_path('../../jmvc/plugins/io/jsonp');
include.plugins("lang");
include("jsonp");
;
include.set_path('../../jmvc/plugins/io/jsonp');
MVC.JsonP=function(_1,_2){
this.url=_1;
this.options=_2||{};
this.remove_script=this.options.remove_script==false?false:true;
this.options.parameters=this.options.parameters||{};
this.error_timeout=this.options.error_timeout*1000||1000*70;
this.send();
};
MVC.JsonP.prototype={send:function(){
var n="c"+MVC.get_random(5);
if(this.options.session){
var _4=typeof this.options.session=="function"?this.options.session():this.options.session;
this.url+=(MVC.String.include(this.url,";")?"&":";")+MVC.Object.to_query_string(_4);
}
var _5=typeof this.options.parameters=="function"?this.options.parameters():this.options.parameters;
this.url+=(MVC.String.include(this.url,"?")?"&":"?")+MVC.Object.to_query_string(_5);
this.add_method();
var _6=this.callback_and_random(n);
var _7=this.check_error(this.url,this.options.onFailure);
MVC.JsonP._cbs[_6]=MVC.Function.bind(function(_8){
clearTimeout(_7);
this.remove_scripts();
var _9={};
if(_8==null){
_9.responseText="";
}else{
if(typeof _8=="string"){
_9.responseText=_8;
}else{
_9=_8;
_9.responseText=_8.toString();
}
}
var _a=true;
if(this.options.onSuccess){
_a=this.options.onSuccess(_9);
}
if(this.options.onComplete&&_a){
this.options.onComplete(_9);
}
delete MVC.JsonP._cbs[_6];
},this);
include({path:this.url});
},add_method:function(){
if(this.options.method&&this.options.method!="get"){
this.url+="&_method="+this.options.method;
}
},callback_and_random:function(n){
this.options.callback="MVC.JsonP._cbs."+n;
this.url+="&callback="+this.options.callback;
return n;
},check_error:function(_c,_d){
return setTimeout(function(){
if(_d){
_d(_c);
}else{
throw "URL:"+_c+" timedout!";
}
},this.error_timeout);
},remove_scripts:function(){
if(this.remove_script){
setTimeout(MVC.Function.bind(this._remove_scripts,this),2000);
}
},_remove_scripts:function(){
var _e=document.getElementsByTagName("script");
var _f=new RegExp(this.url);
for(var s=0;s<_e.length;s++){
var _11=_e[s];
if(_11.src.match(_f)){
_11.parentNode.removeChild(_11);
}
}
}};
MVC.JsonP._cbs={};
;
include.set_path('../../jmvc/plugins/io/window_name');
include.plugins("lang");
include("window_name");
;
include.set_path('../../jmvc/plugins/io/window_name');
MVC.WindowName=function(_1,_2){
this.url=_1;
this.params=_2||{};
this.params.method=this.params.method||"post";
this.frameNum=MVC.WindowName.frameNum++;
this.send();
};
MVC.WindowName.frameNum=0;
MVC.WindowName.prototype={cleanup:function(){
try{
var _3=this.frame.contentWindow.document;
_3.write(" ");
_3.close();
}
catch(e){
}
document.body.removeChild(this.outerFrame);
},get_data:function(){
var _4=this.frame.contentWindow.name;
if(typeof _4=="string"){
if(_4!=this.frameName){
this.state=2;
this.cleanup();
if(_4=="null\n"){
_4="";
}
this.params.onComplete(_4);
}
}
},onload:function(){
try{
if(!MVC.Browser.Gecko&&this.frame.contentWindow.location=="about:blank"){
return;
}
}
catch(e){
}
if(!this.state){
this.state=1;
this.frame.contentWindow.location=this.domain_page;
}
try{
if(this.state<2){
this.get_data();
}
}
catch(e){
}
},send:function(){
this.domain=window.location.protocol+"//"+window.location.hostname;
this.domain_page=this.domain+"/blank.html"+"#"+this.frameNum;
this.frameName=window.location+this.domain_page;
this.frame_container=document.body;
if(MVC.Browser.Gecko&&![].reduce){
this.protectFF2();
}
var _5=this.frame=document.createElement(MVC.Browser.IE?"<iframe name=\""+frameName+"\" onload=\"MVC.WindowName["+this.frameNum+"]()\">":"iframe");
MVC.WindowName.styleFrame(this.frame);
this.outerFrame=this.outerFrame||this.frame;
this.outerFrame.style.display="none";
this.state=0;
var _6=this;
MVC.WindowName[this.frameName]=this.frame.onload=MVC.Function.bind(this.onload,this);
_5.name=this.frameName;
if(this.params.method.match(/GET/i)){
this.url+=(MVC.String.include(this.url,"?")?"&":"?")+MVC.Object.to_query_string(this.params.parameters);
_5.src=this.url;
this.frame_container.appendChild(_5);
if(_5.contentWindow){
_5.contentWindow.location.replace(this.url);
}
}else{
if(this.params.method.match(/POST|PUT|DELETE/i)){
this.frame_container.appendChild(_5);
var _7=document.createElement("form");
document.body.appendChild(_7);
if(this.params.method.match(/PUT|DELETE/i)){
this.params.parameters._method=this.params.method;
}
for(var _8 in this.params.parameters){
var _9=this.params.parameters[_8];
_9=_9 instanceof Array?_9:[_9];
for(j=0;j<_9.length;j++){
var _a=doc.createElement("input");
_a.type="hidden";
_a.name=_8;
_a.value=_9[j];
_7.appendChild(_a);
}
}
_7.method="POST";
_7.action=this.url;
_7.target=this.frameName;
_7.submit();
_7.parentNode.removeChild(_7);
}else{
throw new Error("Method "+this.params.method+" not supported with the WindowName transport");
}
}
if(_5.contentWindow){
_5.contentWindow.name=this.frameName;
}
},protectFF2:function(){
this.outerFrame=document.createElement("iframe");
MVC.WindowName.styleFrame(this.outerFrame);
this.outerFrame.style.display="none";
this.frame_container.appendChild(this.outerFrame);
var _b=this.outerFrame.contentWindow;
doc=_b.document;
doc.write("<html><body margin='0px'><iframe style='width:100%;height:100%;border:0px' name='protectedFrame'></iframe></body></html>");
doc.close();
var _c=_b[0];
_b.__defineGetter__(0,function(){
});
_b.__defineGetter__("protectedFrame",function(){
});
doc=_c.document;
doc.write("<html><body margin='0px'></body></html>");
doc.close();
this.frame_container=doc.body;
}};
MVC.WindowName.styleFrame=function(_d){
_d.style.width="100%";
_d.style.height="100%";
_d.style.border="0px";
};
if(!MVC._no_conflict&&typeof WindowName=="undefined"){
WindowName=MVC.WindowName;
}
;
include.set_path('../../jmvc/plugins/io/xdoc');
include("xdoc");
;
include.set_path('../../jmvc/plugins/io/xdoc');
if(MVC.Browser.Opera){
MVC.XDoc=function(_1,_2){
this.url=_1;
this.options=_2||{};
this.options.method=this.options.method||"post";
this.options.parameters=this.options.parameters||{};
if(MVC.XDoc._can_request){
this.send();
}else{
MVC.XDoc.waiting_requests.push(this);
}
};
MVC.XDoc.requesting=null;
MVC.XDoc.waiting_requests=[];
MVC.XDoc.prototype={send:function(){
if(this.options.session){
var _3=typeof this.options.session=="function"?this.options.session():this.options.session;
this.url+=(MVC.String.include(this.url,";")?"&":";")+MVC.Object.to_query_string(_3);
}
var _4=typeof this.options.parameters=="function"?this.options.parameters():this.options.parameters;
this.url+=(MVC.String.include(this.url,"?")?"&":"?")+MVC.Object.to_query_string(_4);
var _5=MVC.XDoc._frame;
var _6=_5.contentDocument;
MVC.XDoc.requesting=this;
_6.postMessage(this.url);
},handle:function(_7){
if(_7.data!="null"){
eval("var data = "+_7.data);
data.responseText=_7.data;
}else{
data={responseText:""};
}
this.options.onComplete(data);
}};
MVC.XDoc.next=function(){
var _8=MVC.XDoc.waiting_requests.shift();
if(_8){
_8.send();
}
};
MVC.XDoc.observing=false;
MVC.XDoc.styleFrame=function(_9){
_9.style.width="100%";
_9.style.height="100%";
_9.style.border="0px";
_9.style.display="none";
};
MVC.XDoc._can_request=false;
MVC.XDoc.frame_loaded=function(){
MVC.XDoc._can_request=true;
MVC.XDoc.next();
};
(function(){
var _a=document.createElement(MVC.Browser.IE?"<iframe name=\"Jabbify\" onload=\"MVC.XDoc.frame_loaded()\">":"iframe");
MVC.XDoc.styleFrame(_a);
document.body.appendChild(_a);
_a.onload=MVC.Function.bind(MVC.XDoc.frame_loaded,MVC.XDoc);
_a.contentWindow.location=Jabbify.comet_domain+"/crossdomain.html";
MVC.XDoc._frame=_a;
})();
MVC.Event.observe(document,"message",function(_b){
MVC.XDoc.requesting.handle(_b);
MVC.XDoc.next();
});
}else{
MVC.XDoc=function(){
alert("XDoc should not be called");
};
}
;
include.set_path('../../jmvc/plugins/lang/date');
(function(){
var _1=Date.parse;
MVC.Native.extend("Date",{month_name:function(_2){
return MVC.Date.month_names[_2.getMonth()-1];
},number_of_days_in_month:function(_3){
var _4=_3.getFullYear(),_5=_3.getMonth(),m=[31,28,31,30,31,30,31,31,30,31,30,31];
if(_5!=1){
return m[_5];
}
if(_4%4!=0||(_4%100==0&&_4%400!=0)){
return m[1];
}
return m[1]+1;
},month_names:["January","February","March","April","May","June","July","August","September","October","November","December"],parse:function(_7){
if(typeof _7!="string"){
return null;
}
var f1=/\d{4}-\d{1,2}-\d{1,2}/,f2=/\d{4}\/\d{1,2}\/\d{1,2}/,f3=/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/;
var _b;
if((_b=_7.match(f3))){
return new Date(Date.UTC(parseInt(_b[1],10),(parseInt(_b[2],10)-1),parseInt(_b[3],10),parseInt(_b[4],10),parseInt(_b[5],10),parseInt(_b[6],10)));
}
if(_7.match(f1)){
var _c=_7.match(f1)[0].split("-");
return new Date(Date.UTC(parseInt(_c[0],10),(parseInt(_c[1],10)-1),parseInt(_c[2],10)));
}
if(_7.match(f2)){
var _c=_7.match(f2)[0].split("/");
return new Date(Date.UTC(parseInt(_c[0],10),(parseInt(_c[1],10)-1),parseInt(_c[2],10)));
}
return _1(_7);
}});
})();
;
include.set_path('../../jmvc/plugins/lang/json');
MVC.Object.extend(MVC.Number,{to_json:function(_1){
return isFinite(_1)?_1.toString():"null";
}});
if(!MVC.Date){
MVC.Date={};
}
MVC.Object.extend(MVC.Date,{to_json:function(_2){
return "\""+_2.getUTCFullYear()+"-"+MVC.Number.to_padded_string(_2.getUTCMonth()+1,2)+"-"+MVC.Number.to_padded_string(_2.getUTCDate(),2)+"T"+MVC.Number.to_padded_string(_2.getUTCHours(),2)+":"+MVC.Number.to_padded_string(_2.getUTCMinutes(),2)+":"+MVC.Number.to_padded_string(_2.getUTCSeconds(),2)+"Z\"";
}});
MVC.Object.extend(MVC.String,{to_json:function(_3){
var _4={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\\":"\\\\"};
var _5=_3.replace(/[\x00-\x1f\\]/g,function(_6){
var _7=_4[_6[0]];
return _7?_7:"\\u00"+MVC.Number.to_padded_string(_6[0].charCodeAt(),2,16);
});
return "\""+_5.replace(/"/g,"\\\"")+"\"";
}});
MVC.Object.extend(MVC.Array,{to_json:function(_8,_9){
var _a=[];
for(var i=0;i<_8.length;i++){
var _c=MVC.Object.to_json(_8[i],true);
if(typeof _c!="undefined"){
_a.push(_c);
}
}
return "["+_a.join(", ")+"]";
}});
MVC.Object.to_json=function(_d,_e){
var _f=typeof _d;
switch(_f){
case "undefined":
case "function":
case "unknown":
return;
case "boolean":
return _d.toString();
case "string":
return MVC.String.to_json(_d);
case "number":
return MVC.Number.to_json(_d);
}
if(_d===null){
return "null";
}
switch(_d.constructor){
case Array:
return MVC.Array.to_json(_d);
case Date:
return MVC.Array.to_json(_d);
}
if(_d.to_json){
return _d.to_json();
}
if(_d.nodeType==1){
return;
}
var _10=[];
for(var _11 in _d){
var _12=MVC.Object.to_json(_d[_11],true);
if(typeof _12!="undefined"){
_10.push(MVC.String.to_json(_11)+": "+_12);
}
}
return "{"+_10.join(", ")+"}";
};
;
include.set_path('../../jmvc/plugins/model');
include.plugins("lang/class");
include("model");
;
include.set_path('../../jmvc/plugins/model');
MVC.Model=MVC.Class.extend({find:function(id,_2,_3){
if(!_2){
_2={};
}
if(typeof _2=="function"){
callback=_2;
_2={};
}
if(id=="all"){
return this.create_many_as_existing(this.find_all(_2,_3));
}else{
if(!_2[this.id]&&id!="first"){
_2[this.id]=id;
}
return this.create_as_existing(this.find_one(id=="first"?null:_2,_3));
}
},create_as_existing:function(_4){
if(!_4){
return null;
}
if(_4.attributes){
_4=_4.attributes;
}
var _5=new this(_4);
_5.is_new_record=this.new_record_func;
return _5;
},create_many_as_existing:function(_6){
if(!_6){
return null;
}
var _7=[];
for(var i=0;i<_6.length;i++){
_7.push(this.create_as_existing(_6[i]));
}
return _7;
},id:"id",new_record_func:function(){
return false;
},validations:[],has_many:function(){
for(var i=0;i<arguments.length;i++){
this._associations.push(arguments[i]);
}
},belong_to:function(){
for(var i=0;i<arguments.length;i++){
this._associations.push(arguments[i]);
}
},_associations:[],from_html:function(_b){
var el=MVC.$E(_b);
var _d=window[MVC.String.classize(el.getAttribute("type"))];
if(!_d){
return null;
}
var _e={};
_e[_d.id]=this.element_id_to_id(el.id);
return _d.create_as_existing(_e);
},element_id_to_id:function(_f){
var re=new RegExp(this.className+"_","");
return _f.replace(re,"");
},add_attribute:function(_11,_12){
if(!this.attributes[_11]){
this.attributes[_11]=_12;
}
},attributes:{},_clean_callbacks:function(_13){
if(!_13){
throw "You must supply a callback!";
}
if(typeof _13=="function"){
return {onSuccess:_13,onError:_13};
}
if(!_13.onSuccess&&!_13.onComplete){
throw "You must supply a positive callback!";
}
if(!_13.onSuccess){
_13.onSuccess=_13.onComplete;
}
if(!_13.onError&&_13.onComplete){
_13.onError=_13.onComplete;
}
}},{init:function(_14){
this.errors=[];
this.set_attributes(this.Class._attributes||{});
this.set_attributes(_14);
},setup:function(){
},set_attributes:function(_15){
for(var key in _15){
if(_15.hasOwnProperty(key)){
this._setAttribute(key,_15[key]);
}
}
return _15;
},update_attributes:function(_17,_18){
this.set_attributes(_17);
return this.save(_18);
},valid:function(){
return this.errors.length==0;
},validate:function(){
},_setAttribute:function(_19,_1a){
if(_1a&&typeof (_1a)=="object"&&_1a.constructor!=Date){
this._setAssociation(_19,_1a);
}else{
this._setProperty(_19,_1a);
}
},_setProperty:function(_1b,_1c){
this[_1b]=MVC.Array.include(["created_at","updated_at"],_1b)?MVC.Date.parse(_1c):_1c;
this.Class.add_attribute(_1b,MVC.Object.guess_type(_1c));
},_setAssociation:function(_1d,_1e){
this[_1d]=function(){
if(!MVC.String.is_singular(_1d)){
_1d=MVC.String.singularize(_1d);
}
var _1f=window[MVC.String.capitalize(_1d)];
if(!_1f){
return _1e;
}
return _1f.create_many_as_existing(_1e);
};
},attributes:function(){
var _20={};
var cas=this.Class.attributes;
for(var _22 in cas){
if(cas.hasOwnProperty(_22)){
_20[_22]=this[_22];
}
}
return _20;
},is_new_record:function(){
return true;
},save:function(_23){
var _24;
this.errors=[];
this.validate();
if(!this.valid()){
return false;
}
if(this.is_new_record()){
_24=this.Class.create(this.attributes(),_23);
}else{
_24=this.Class.update(this[this.Class.id],this.attributes(),_23);
}
this.is_new_record=this.Class.new_record_func;
return true;
},destroy:function(_25){
this.Class.destroy(this[this.Class.id],_25);
},add_errors:function(_26){
if(_26){
this.errors=this.errors.concat(_26);
}
},_resetAttributes:function(_27){
this._clear();
},_clear:function(){
var cas=this.Class.attributes;
for(var _29 in cas){
if(cas.hasOwnProperty(_29)){
this[_29]=null;
}
}
}});
MVC.Object.guess_type=function(_2a){
if(typeof _2a!="string"){
if(_2a==null){
return typeof _2a;
}
if(_2a.constructor==Date){
return "date";
}
if(_2a.constructor==Array){
return "array";
}
return typeof _2a;
}
if(_2a=="true"||_2a=="false"){
return "boolean";
}
if(!isNaN(_2a)){
return "number";
}
return typeof _2a;
};
;
include.set_path('../../jmvc/plugins/model/ajax');
include.plugins("model","io/ajax");
include("ajax_model");
;
include.set_path('../../jmvc/plugins/io/ajax');
include.plugins("lang");
if(typeof jQuery!="undefined"){
include("jquery_ajax");
}else{
if(typeof Prototype!="undefined"){
include("prototype_ajax");
}else{
include("ajax");
}
}
if(MVC.Console){
include("debug");
}
;
include.set_path('../../jmvc/plugins/model/ajax');
MVC.AjaxModel=MVC.Model.extend({transport:MVC.Ajax,request:function(){
},_matching:/(\w+?)_?(get|post|delete|update|)_success$/,init:function(){
if(!this.className){
return;
}
var _1,_2,_3;
this.actions={};
for(var _4 in this){
_1=this[_4];
if(typeof _1=="function"&&_4!="Class"&&(_3=_4.match(this._matching))){
this.add_req(_3,_1);
}
}
},_default_options:function(_5,_6,_7,_8){
var _9={};
this._add_default_callback(_9,"success",_6,_5,_7,_8);
this._add_default_callback(_9,"error",_6,_5,_7,_8);
return _9;
},_add_default_callback:function(_a,_b,_c,_d,_e,_f){
var _10="on"+MVC.String.capitalize(_b);
var _11=_d+"_"+_c+"_"+_b;
var _12=_d+"_"+_b;
var _13=this[_11]?_11:(this[_12]?_12:null);
if(_13){
_a[_10]=MVC.Function.bind(function(_14){
var _15=false;
var cb=function(){
_15=true;
_f[_10].apply(arguments);
};
_e.unshift(_14,cb);
var _17=this[_13].apply(this,_e);
if(!_15){
_f[_10](_17);
}
},this);
}
},_make_public:function(_18,_19){
var _1a=this.base_url+"/"+_18;
if(this[_18+"_"+_19+"_url"]){
_1a=typeof this[_18+"_"+_19+"_url"]=="function"?this[_18+"_"+_19+"_url"]():this[_18+"_"+_19+"_url"];
}
return function(_1b){
var _1c=MVC.Array.from(arguments);
var _1d=this._clean_callbacks(_1c[_1c.length-1]);
_1b=_1c.length>1?_1b:{};
var _1e=this.request;
var _1f={method:_19};
var _20=false;
this.request=function(url,_22,_23){
_20=true;
_22=_22||_1b;
_23=_23||_1f;
var _24=MVC.Array.from(arguments).splice(2,arguments.length-2);
if(typeof url!="string"){
_23=_1b;
_1b=url;
url=this.base_url+"/"+_18;
}else{
_24.shift();
}
var _25=this._default_options(_18,_19,_24,_1d);
_23=MVC.Object.extend(_25,_23);
_23.parameters=MVC.Object.extend(_22,_23.parameters);
new this.transport(url,_23);
};
var _26;
if(this[_18+"_"+_19]){
_26=this[_18+"_"+_19].apply(this,arguments);
}else{
if(this[_18+"_request"]){
_26=this[_18+"_request"].apply(this,arguments);
}
}
if(!_20){
this.request(_1a,_1b,_1f);
}
return _26;
};
},add_req:function(_27,_28){
var _29=_27[0];
var _2a=_27[1];
var _2b=_27[2]||"post";
this[_2a]=this._make_public(_2a,_2b);
},get_id:function(_2c){
var loc=_2c.responseText;
try{
loc=_2c.getResponseHeader("location");
}
catch(e){
}
if(loc){
var _2e=loc.match(/\/[^\/]*?(\w+)?$/);
if(_2e){
return parseInt(_2e[1]);
}
}
return null;
}},{});
if(!MVC._no_conflict&&typeof AjaxModel=="undefined"){
AjaxModel=MVC.AjaxModel;
}
;
include.set_path('../../jmvc/plugins/model/cookie');
include.plugins("model","lang/json");
include("cookie_model");
;
include.set_path('../../jmvc/plugins/model/cookie');
MVC.CookieModel=MVC.Model.extend({init:function(){
this._working=null;
},days:null,find_one:function(_1){
var _2=this.find_class_data().instances;
if(!_1){
for(var id in _2){
return _2[id];
}
return null;
}
if(_1.id){
return _2[id];
}
for(var id in _2){
var _4=_2[id];
for(var _5 in _1){
if(_1[_5]==_4[_5]){
return _4;
}
}
}
return null;
},find_all:function(){
var _6=this.find_class_data().instances;
var _7=[];
for(var i in _6){
_7.push(_6[i]);
}
return _7;
},find_class_data:function(){
if(this._working){
return this._working;
}
var cd=this.find_cookie(this.className);
if(!cd){
this._working={instances:{}};
}else{
eval("this._working = "+cd);
}
this._count=0;
for(var i in this._working.instances){
this._count++;
}
return this._working;
},create_cookie:function(_b,_c,_d){
if(_d){
var _e=new Date();
_e.setTime(_e.getTime()+(_d*24*60*60*1000));
var _f="; expires="+_e.toGMTString();
}else{
var _f="";
}
document.cookie=_b+"="+encodeURIComponent(_c)+_f+"; path=/";
},find_cookie:function(_10){
var _11=_10+"=";
var ca=document.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_11)==0){
return decodeURIComponent(c.substring(_11.length,c.length));
}
}
return null;
},destroy_cookie:function(_15){
this.create_cookie(_15,"",-1);
},create:function(_16){
var cd=this.find_class_data();
var _18=cd.instances;
_18[_16[this.id]]=_16;
this.create_cookie(this.className,MVC.Object.to_json(cd),this.days);
},update:function(id,_1a){
var cd=this.find_class_data();
var _1c=cd.instances;
_1c[id]=_1a;
this.create_cookie(this.className,MVC.Object.to_json(cd),this.days);
},destroy:function(id){
var cd=this.find_class_data();
var _1f=cd.instances;
var _20=_1f[id];
delete _1f[id];
this.create_cookie(this.className,MVC.Object.to_json(cd),this.days);
return _20;
},destroy_cookie:function(_21){
this.create_cookie(_21,"",-1);
},destroy_all:function(){
this.destroy_cookie(this.className);
return true;
}},{});
;
include.set_path('../../jmvc/plugins/model/jsonp');
include.plugins("model","lang/date","io/jsonp");
include("remote_model");
;
include.set_path('../../jmvc/plugins/model/jsonp');
MVC.RemoteModel=MVC.Model.extend({error_timeout:4000,init:function(){
if(!this.className){
return;
}
if(!this.domain){
throw ("a domain must be provided for remote model");
}
this.controller_name=this.className;
this.plural_controller_name=MVC.String.pluralize(this.controller_name);
},find_all:function(_1,_2){
var _3=this._clean_callbacks(_2);
var _4=_3.onSuccess;
var _5=_3.onError;
var n=parseInt(Math.random()*100000);
var _7=this.find_url?this.find_url+"?":this.domain+"/"+this.plural_controller_name+".json?";
if(!_4){
_4=(function(){
});
}
new MVC.JsonP(_7,{parameters:_1,onFailure:_2.onFailure,onSuccess:MVC.Function.bind(function(_8){
var _9=this.create_many_as_existing(_8);
_4(_9);
},this),method:"get"});
},create:function(_a,_b){
var _c=this._clean_callbacks(_b);
var _d=_c.onSuccess;
this.add_standard_params(_a,"create");
var _e=this,_f=this.className,url=this.create_url?this.create_url+"?":this.domain+"/"+this.plural_controller_name+".json?";
var tll=this.top_level_length(_a,url);
var _12=this.seperate(_a[this.controller_name],tll,this.controller_name);
var _13=_12.postpone,_14=_12.send;
if(!_d){
_d=(function(){
});
}
_a["_method"]="POST";
if(_12.send_in_parts){
_a[this.controller_name]=_14;
_a["_mutlirequest"]="true";
new MVC.JsonP(url,{parameters:_a,onComplete:MVC.Function.bind(this.parts_create_callback(_a,_d,_13),this),onFailure:_d.onFailure,method:"post"});
}else{
_a["_mutlirequest"]=null;
new MVC.JsonP(url,{parameters:_a,onComplete:MVC.Function.bind(this.single_create_callback(_d),this),onFailure:_d.onFailure,method:"post"});
}
},parts_create_callback:function(_15,_16,_17){
return function(_18){
if(!_18.id){
throw "Your server must callback with the id of the object.  It is used for the next request";
}
_15[this.controller_name]=_17;
_15.id=_18.id;
this.create(_15,_16);
};
},single_create_callback:function(_19){
return function(_1a){
if(_1a[this.className]){
var _1b=new this(_1a[this.className]);
_1b.add_errors(_1a.errors);
_19(_1b);
}else{
_19(new this(_1a));
}
};
},add_standard_params:function(_1c,_1d){
if(!_1c.referer){
_1c.referer=window.location.href;
}
},callback_name:"callback",domain:null,top_level_length:function(_1e,url){
var p=MVC.Object.extend({},_1e);
delete p[this.className];
return url.length+MVC.Object.to_query_string(p).length;
},seperate:function(_21,_22,_23){
var _24=2000-9-_22;
var _25={};
var _26={};
var _27=false;
for(var _28 in _21){
if(!_21.hasOwnProperty(_28)){
continue;
}
var _29=_21[_28],_2a;
var _2b=encodeURIComponent(_23+"["+_28+"]").length;
if(typeof _29=="string"){
_2a=encodeURIComponent(_29).length;
}else{
_2a=_29.toString().length;
}
if(_24-_2b<=30){
_26[_28]=_29;
_27=true;
continue;
}
_24=_24-_2b-2;
if(_24>_2a){
_25[_28]=_29;
_24-=_2a;
}else{
if(typeof _29=="string"){
var _2c=_24;
while(encodeURIComponent(_29.substr(0,_2c)).length>_24){
_2c=parseInt(_2c*0.75)-1;
}
_25[_28]=_29.substr(0,_2c);
_26[_28]=_29.substr(_2c);
_27=true;
_24=0;
}else{
_26[_28]=_29;
}
}
}
return {send:_25,postpone:_26,send_in_parts:_27};
},random:parseInt(Math.random()*1000000)},{});
;
include.set_path('../../jmvc/plugins/model/rest_json');
include.plugins("model/ajax","lang/date");
include("json_rest_model");
;
include.set_path('../../jmvc/plugins/model/rest_json');
MVC.JSONRestModel=MVC.AjaxModel.extend({init:function(){
if(!this.className){
return;
}
this.plural_name=MVC.String.pluralize(this.className);
this.singular_name=this.className;
this._super();
},json_from_string:function(_1){
return eval(_1);
},find_all_get_url:function(){
return "/"+this.plural_name+".json";
},find_all_get_success:function(_2){
var _3=this.json_from_string(_2.responseText);
var _4=[];
for(var i=0;i<_3.length;i++){
var _6=_3[i];
var _7=this.create_as_existing(_6.attributes);
if(_6.errors){
_7.add_errors(_6.errors);
}
_4.push(_7);
}
return _4;
},create_request:function(_8){
var _9=new this(_8);
_9.validate();
if(!_9.valid()){
return _9;
}
var _a={};
_a[this.singular_name]=_8;
this.request("/"+this.plural_name+".json",_a,{method:"post"},_9);
return _9;
},create_success:function(_b,_c,_d){
if(/\w+/.test(_b.responseText)){
var _e=this.json_from_string(_b.responseText);
if(_e){
_d.add_errors(_e);
}
}
if(_d.is_new_record()&&_b.status==201){
var id=this.get_id(_b);
if(!isNaN(id)){
_d._setProperty("id",id);
}
}
return _d;
},update_request:function(id,_11){
delete _11.id;
var _12={};
_12[this.singular_name]=_11;
var _13=this.create_as_existing(_11);
_13.id=id;
_13.validate();
if(!_13.valid()){
return _13;
}
this.request("/"+this.plural_name+"/"+id+".json",_12,{method:"put"},_13);
},update_success:function(_14,_15,_16){
if(/\w+/.test(_14.responseText)){
var _17=this.json_from_string(_14.responseText);
if(_17){
_16.add_errors(_17);
}
}
return _16;
},destroy_request:function(id){
this.request("/"+this.plural_name+"/"+id+".json",{},{method:"delete"});
},destroy_error:function(){
return false;
},destroy_success:function(_19){
return _19.status==200;
}},{});
;
include.set_path('../../jmvc/plugins/model/rest_xml');
include.plugins("model/ajax","lang/date");
include("ObjTree","xml_rest_model");
;
include.set_path('../../jmvc/plugins/model/rest_xml');
if(typeof (XML)=="undefined"){
XML=function(){
};
}
XML.ObjTree=function(){
return this;
};
XML.ObjTree.VERSION="0.24";
XML.ObjTree.prototype.xmlDecl="<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
XML.ObjTree.prototype.attr_prefix="-";
XML.ObjTree.prototype.overrideMimeType="text/xml";
XML.ObjTree.prototype.parseXML=function(_1){
var _2;
if(window.DOMParser){
var _3=new DOMParser();
var _4=_3.parseFromString(_1,"application/xml");
if(!_4){
return;
}
_2=_4.documentElement;
}else{
if(window.ActiveXObject){
_3=new ActiveXObject("Microsoft.XMLDOM");
_3.async=false;
_3.loadXML(_1);
_2=_3.documentElement;
}
}
if(!_2){
return;
}
return this.parseDOM(_2);
};
XML.ObjTree.prototype.parseHTTP=function(_5,_6,_7){
var _8={};
for(var _9 in _6){
_8[_9]=_6[_9];
}
if(!_8.method){
if(typeof (_8.postBody)=="undefined"&&typeof (_8.postbody)=="undefined"&&typeof (_8.parameters)=="undefined"){
_8.method="get";
}else{
_8.method="post";
}
}
if(_7){
_8.asynchronous=true;
var _a=this;
var _b=_7;
var _c=_8.onComplete;
_8.onComplete=function(_d){
var _e;
if(_d&&_d.responseXML&&_d.responseXML.documentElement){
_e=_a.parseDOM(_d.responseXML.documentElement);
}else{
if(_d&&_d.responseText){
_e=_a.parseXML(_d.responseText);
}
}
_b(_e,_d);
if(_c){
_c(_d);
}
};
}else{
_8.asynchronous=false;
}
var _f;
if(typeof (HTTP)!="undefined"&&HTTP.Request){
_8.uri=_5;
var req=new HTTP.Request(_8);
if(req){
_f=req.transport;
}
}else{
if(typeof (Ajax)!="undefined"&&Ajax.Request){
var req=new Ajax.Request(_5,_8);
if(req){
_f=req.transport;
}
}
}
if(_7){
return _f;
}
if(_f&&_f.responseXML&&_f.responseXML.documentElement){
return this.parseDOM(_f.responseXML.documentElement);
}else{
if(_f&&_f.responseText){
return this.parseXML(_f.responseText);
}
}
};
XML.ObjTree.prototype.parseDOM=function(_11){
if(!_11){
return;
}
this.__force_array={};
if(this.force_array){
for(var i=0;i<this.force_array.length;i++){
this.__force_array[this.force_array[i]]=1;
}
}
var _13=this.parseElement(_11);
if(this.__force_array[_11.nodeName]){
_13=[_13];
}
if(_11.nodeType!=11){
var tmp={};
tmp[_11.nodeName]=_13;
_13=tmp;
}
return _13;
};
XML.ObjTree.prototype.parseElement=function(_15){
if(_15.nodeType==7){
return;
}
if(_15.nodeType==3||_15.nodeType==4){
var _16=_15.nodeValue.match(/[^\x00-\x20]/);
if(_16==null){
return;
}
return _15.nodeValue;
}
var _17;
var cnt={};
if(_15.attributes&&_15.attributes.length){
_17={};
for(var i=0;i<_15.attributes.length;i++){
var key=_15.attributes[i].nodeName;
if(typeof (key)!="string"){
continue;
}
var val=_15.attributes[i].nodeValue;
if(!val){
continue;
}
key=this.attr_prefix+key;
if(typeof (cnt[key])=="undefined"){
cnt[key]=0;
}
cnt[key]++;
this.addNode(_17,key,cnt[key],val);
}
}
if(_15.childNodes&&_15.childNodes.length){
var _1c=true;
if(_17){
_1c=false;
}
for(var i=0;i<_15.childNodes.length&&_1c;i++){
var _1d=_15.childNodes[i].nodeType;
if(_1d==3||_1d==4){
continue;
}
_1c=false;
}
if(_1c){
if(!_17){
_17="";
}
for(var i=0;i<_15.childNodes.length;i++){
_17+=_15.childNodes[i].nodeValue;
}
}else{
if(!_17){
_17={};
}
for(var i=0;i<_15.childNodes.length;i++){
var key=_15.childNodes[i].nodeName;
if(typeof (key)!="string"){
continue;
}
var val=this.parseElement(_15.childNodes[i]);
if(!val){
continue;
}
if(typeof (cnt[key])=="undefined"){
cnt[key]=0;
}
cnt[key]++;
this.addNode(_17,key,cnt[key],val);
}
}
}
return _17;
};
XML.ObjTree.prototype.addNode=function(_1e,key,_20,val){
if(this.__force_array[key]){
if(_20==1){
_1e[key]=[];
}
_1e[key][_1e[key].length]=val;
}else{
if(_20==1){
_1e[key]=val;
}else{
if(_20==2){
_1e[key]=[_1e[key],val];
}else{
_1e[key][_1e[key].length]=val;
}
}
}
};
XML.ObjTree.prototype.writeXML=function(_22){
var xml=this.hash_to_xml(null,_22);
return this.xmlDecl+xml;
};
XML.ObjTree.prototype.hash_to_xml=function(_24,_25){
var _26=[];
var _27=[];
for(var key in _25){
if(!_25.hasOwnProperty(key)){
continue;
}
var val=_25[key];
if(key.charAt(0)!=this.attr_prefix){
if(typeof (val)=="undefined"||val==null){
_26[_26.length]="<"+key+" />";
}else{
if(typeof (val)=="object"&&val.constructor==Array){
_26[_26.length]=this.array_to_xml(key,val);
}else{
if(typeof (val)=="object"){
_26[_26.length]=this.hash_to_xml(key,val);
}else{
_26[_26.length]=this.scalar_to_xml(key,val);
}
}
}
}else{
_27[_27.length]=" "+(key.substring(1))+"=\""+(this.xml_escape(val))+"\"";
}
}
var _2a=_27.join("");
var _2b=_26.join("");
if(typeof (_24)=="undefined"||_24==null){
}else{
if(_26.length>0){
if(_2b.match(/\n/)){
_2b="<"+_24+_2a+">\n"+_2b+"</"+_24+">\n";
}else{
_2b="<"+_24+_2a+">"+_2b+"</"+_24+">\n";
}
}else{
_2b="<"+_24+_2a+" />\n";
}
}
return _2b;
};
XML.ObjTree.prototype.array_to_xml=function(_2c,_2d){
var out=[];
for(var i=0;i<_2d.length;i++){
var val=_2d[i];
if(typeof (val)=="undefined"||val==null){
out[out.length]="<"+_2c+" />";
}else{
if(typeof (val)=="object"&&val.constructor==Array){
out[out.length]=this.array_to_xml(_2c,val);
}else{
if(typeof (val)=="object"){
out[out.length]=this.hash_to_xml(_2c,val);
}else{
out[out.length]=this.scalar_to_xml(_2c,val);
}
}
}
}
return out.join("");
};
XML.ObjTree.prototype.scalar_to_xml=function(_31,_32){
if(_31=="#text"){
return this.xml_escape(_32);
}else{
return "<"+_31+">"+this.xml_escape(_32)+"</"+_31+">\n";
}
};
XML.ObjTree.prototype.xml_escape=function(_33){
return String(_33).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
};
;
include.set_path('../../jmvc/plugins/model/rest_xml');
MVC.Tree=new XML.ObjTree();
MVC.Tree.attr_prefix="@";
MVC.XMLRestModel=MVC.AjaxModel.extend({init:function(){
if(!this.className){
return;
}
this.plural_name=MVC.String.pluralize(this.className);
this.singular_name=this.className;
this._super();
},find_all_get_url:function(){
return "/"+this.plural_name+".xml";
},find_all_get_success:function(_1){
var _2=MVC.Tree.parseXML(_1.responseText);
for(var _3 in _2){
if(_3.match(/-/)&&typeof _2[_3]=="object"){
_2[_3.replace(/-/,"_")]=_2[_3];
delete _2[_3];
}
}
for(var _3 in _2){
if(typeof _2[_3]=="object"){
for(var _4 in _2[_3]){
if(_4.match(/-/)&&typeof _2[_3][_4]=="object"){
_2[_3][_4.replace(/-/,"_")]=_2[_3][_4];
delete _2[_3][_4];
}
}
}
}
if(!_2[this.plural_name]){
return [];
}
if(!(_2[this.plural_name][this.singular_name] instanceof Array)){
_2[this.plural_name][this.singular_name]=[_2[this.plural_name][this.singular_name]];
}
collection=[];
var _5=_2[this.plural_name][this.singular_name];
for(var i=0;i<_5.length;i++){
collection.push(this.create_as_existing(this._attributesFromTree(_5[i])));
}
return collection;
},create_request:function(_7){
var _8=new this(_7);
_8.validate();
if(!_8.valid()){
return _8;
}
var _9={};
_9[this.singular_name]=_7;
this.request("/"+this.plural_name+".xml",_9,{method:"post"},_8);
return _8;
},create_success:function(_a,_b,_c){
if(/\w+/.test(_a.responseText)){
var _d=_c._errorsFromXML(_a.responseText);
if(_d){
_c.add_errors(_d);
}else{
var _e;
var _f=MVC.Tree.parseXML(_a.responseText);
if(_f&&_f[this.singular_name]){
_e=this._attributesFromTree(_f[this.singular_name]);
}
if(_e){
_c._resetAttributes(_e);
}
}
}
if(_c.is_new_record()&&_a.status==201){
var id=this.get_id(_a);
if(!isNaN(id)){
_c._setProperty("id",id);
}
}
return _c;
},update_request:function(id,_12){
delete _12.id;
var _13={};
_13[this.singular_name]=_12;
var _14=this.create_as_existing(_12);
_14.id=id;
_14.validate();
if(!_14.valid()){
return _14;
}
this.request("/"+this.plural_name+"/"+id+".xml",_13,{method:"put"},_14);
},update_success:function(_15,_16,_17){
if(/\w+/.test(_15.responseText)){
var _18=_17._errorsFromXML(_15.responseText);
if(_18){
_17.add_errors(_18);
}else{
var _19;
var doc=MVC.Tree.parseXML(_15.responseText);
if(doc&&doc[this.singular_name]){
_19=this._attributesFromTree(doc[this.singular_name]);
}
if(_19){
_17._resetAttributes(_19);
}
}
}
return _17;
},destroy_request:function(id){
this.request("/"+this.plural_name+"/"+id+".xml",{},{method:"delete"});
},destroy_error:function(){
return false;
},destroy_success:function(_1c){
return _1c.status==200;
},elementHasMany:function(_1d){
if(!_1d){
return false;
}
var i=0;
var _1f=null;
var _20=false;
for(var val in _1d){
if(_1d.hasOwnProperty(val)){
if(i==0){
_1f=val;
}
i+=1;
}
}
return (_1d[_1f]&&typeof (_1d[_1f])=="object"&&_1d[_1f].length!=null&&i==1);
},_attributesFromTree:function(_22){
var _23={};
for(var _24 in _22){
if(!_22.hasOwnProperty(_24)){
continue;
}
var _25=_22[_24];
if(_22[_24]&&_22[_24]["@type"]){
if(_22[_24]["#text"]){
_25=_22[_24]["#text"];
}else{
_25=undefined;
}
}
if(!_25){
var a={};
}else{
if(typeof (_25)=="string"){
if(_22[_24]["@type"]=="integer"){
var num=parseInt(_25);
if(!isNaN(num)){
_25=num;
}
}else{
if(_22[_24]["@type"]=="boolean"){
_25=(_25=="true");
}else{
if(_22[_24]["@type"]=="datetime"){
var _28=MVC.Date.parse(_25);
if(!isNaN(_28)){
_25=_28;
}
}
}
}
}else{
var _29=_25;
var i=0;
var _2b=null;
var _2c=false;
for(var val in _29){
if(_29.hasOwnProperty(val)){
if(i==0){
_2b=val;
}
i+=1;
}
}
if(_29[_2b]&&typeof (_29[_2b])=="object"&&i==1){
alert("has_many");
var _25=[];
var _2e=_24;
var _2f=MVC.String.classize(_2b);
if(!(_22[_2e][_2b].length>0)){
_22[_2e][_2b]=[_22[_2e][_2b]];
}
_22[_2e][_2b].each(MVC.Function.bind(function(_30){
if(eval("typeof("+_2f+")")=="undefined"){
MVC.Resource.model(_2f,{prefix:this._prefix,singular:_2b,plural:_2e,format:this._format});
}
var _31=eval(_2f+".create_as_existing(this._attributesFromTree(single))");
_25.push(_31);
},this));
}else{
_2b=_24;
var _2f=MVC.String.classize(_2b);
if(eval("typeof("+_2f+")")!="undefined"){
_25=eval(_2f+".create_as_existing(this._attributesFromTree(value))");
}else{
_25=null;
}
}
}
}
attribute=_24.replace(/-/g,"_");
_23[attribute]=_25;
}
return _23;
}},{_errorsFromXML:function(xml){
if(!xml){
return false;
}
var doc=MVC.Tree.parseXML(xml);
if(doc&&doc.errors){
var _34=[];
if(typeof (doc.errors.error)=="string"){
doc.errors.error=[doc.errors.error];
}
for(var i=0;i<doc.errors.error.length;i++){
var _36=doc.errors.error[i];
var _37=_36.match(/(\w+) (.*)/);
_34.push([_37[1].toLowerCase(),_37[2].toLowerCase()]);
}
return _34;
}else{
return false;
}
}});
;
include.set_path('../../jmvc/plugins/model/view_helper');
include("model_view_helper");
;
include.set_path('../../jmvc/plugins/model/view_helper');
MVC.ModelViewHelper=MVC.Class.extend({init:function(){
if(!this.className){
return;
}
var _1;
if(!this.className){
return;
}
if(!(_1=this.modelClass=window[MVC.String.classize(this.className)])){
throw "ModelViewHelpers can't find class "+this.className;
}
var _2=this;
this.modelClass.View=function(){
return _2;
};
this.modelClass.prototype.View=function(){
return new _2(this);
};
if(this.modelClass.attributes){
this._view=new MVC.View.Helpers({});
var _3;
for(var _4 in this.modelClass.attributes){
if(!this.modelClass.attributes.hasOwnProperty(_4)||typeof this.modelClass.attributes[_4]!="string"){
continue;
}
this.add_helper(_4);
}
}
},form_helper:function(_5){
if(!this.helpers[_5]+"_field"){
this.add_helper(_5);
}
var f=this.helpers[_5+"_field"];
var _7=MVC.Array.from(arguments);
_7.shift();
return f.apply(this._view,_7);
},add_helper:function(_8){
var h=this._helper(_8);
this.helpers[_8+"_field"]=h;
},helpers:{},_helper:function(_a){
var _b=this._view_helper(_a);
var _c=this;
var _d=this.modelClass.className+"["+_a+"]";
var id=this.modelClass.className+"_"+_a;
return function(){
var _f=MVC.Array.from(arguments);
_f.unshift(_d);
_f[2]=_f[2]||{};
_f[2].id=id;
return _b.apply(_c._view,_f);
};
},_view_helper:function(_10){
switch(this.modelClass.attributes[_10].toLowerCase()){
case "boolean":
return this._view.check_box_tag;
case "text":
return this._view.text_area_tag;
default:
return this._view.text_field_tag;
}
},clear:function(){
var _11=this.modelClass.className,el;
for(var _13 in this.modelClass.attributes){
if((el=MVC.$E(_11+"_"+_13))){
el.value="";
}
}
},from_html:function(_14){
var el=MVC.$E(_14);
var _16=this.modelClass?this.modelClass:window[MVC.String.classize(el.getAttribute("type"))];
if(!_16){
return null;
}
var _17={};
_17[_16.id]=this.element_id_to_id(el.id);
return _16.create_as_existing(_17);
},element_id_to_id:function(_18){
var re=new RegExp(this.className+"_","");
return _18.replace(re,"");
}},{init:function(_1a){
this._inst=_1a;
this._className=this._inst.Class.className;
this._Class=this._inst.Class;
},id:function(){
return this._inst[this._inst.Class.id];
},element:function(){
if(this._element){
return this._element;
}
this._element=MVC.$E(this.element_id());
if(this._element){
return this._element;
}
this._element=document.createElement("div");
this._element.id=this.element_id();
this._element.className=this._className;
this._element.setAttribute("type",this._className);
return this._element;
},element_id:function(){
return this._className+"_"+this._inst[this._inst.Class.id];
},show_errors:function(){
var err=MVC.$E(this._className+"_error");
var err=err||MVC.$E(this._className+"_error");
var _1c=[];
for(var i=0;i<this._inst.errors.length;i++){
var _1e=this._inst.errors[i];
var el=MVC.$E(this._className+"_"+_1e[0]);
if(el){
el.className="error";
var _20=MVC.$E(this._className+"_"+_1e[0]+"_error");
if(_20){
_20.innerHTML=_1e[1];
}
}else{
_1c.push(_1e[0]+" is "+_1e[1]);
}
}
if(_1c.length>0){
if(err){
err.innerHTML=_1c.join(", ");
}else{
alert(_1c.join(", "));
}
}
},clear_errors:function(){
var p;
var cn=this._className;
for(var _23 in this._Class.attributes){
if(this._Class.attributes.hasOwnProperty(_23)){
var el=MVC.$E(cn+"_"+p);
if(el){
el.className=el.className.replace(/(^|\\s+)error(\\s+|$)/," ");
}
var _25=MVC.$E(cn+"_"+_23+"_error");
if(_25){
_25.innerHTML="&nbsp;";
}
}
}
var _26=MVC.$E(cn+"_error");
if(_26){
_26.innerHTML="";
}
},edit:function(_27){
var _28=MVC.Array.from(arguments);
var _29=this._className+"["+_27+"]";
_28.shift();
_28.unshift({id:this.edit_id(_27)});
_28.unshift(this._inst[_27]);
_28.unshift(_29);
var _2a=this.Class._view_helper(_27);
return _2a.apply(this.Class._view,_28);
},edit_values:function(){
var _2b={};
var cn=this._className,p,el;
for(var _2f in this._Class.attributes){
if(this._Class.attributes.hasOwnProperty(_2f)){
el=MVC.$E(this.edit_id(_2f));
}
if(el){
_2b[_2f]=el.value;
}
}
return _2b;
},edit_id:function(_30){
return this._className+"_"+this._inst.id+"_"+_30+"_edit";
},destroy:function(){
var el=this.element();
el.parentNode.removeChild(el);
}});
;
include.set_path('../../jmvc/rhino');
if(typeof load!="undefined"){
load("jmvc/rhino/doc/class.js");
load("jmvc/rhino/doc/d_pair.js");
load("jmvc/rhino/doc/d_function.js");
load("jmvc/rhino/doc/d_class.js");
load("jmvc/rhino/doc/d_constructor.js");
load("jmvc/rhino/doc/d_file.js");
load("jmvc/rhino/doc/d_application.js");
load("jmvc/rhino/doc/d_other.js");
}else{
include("doc/class","doc/d_pair","doc/d_function","doc/d_class","doc/d_constructor","doc/d_other","doc/d_file","doc/d_application");
}
;
include.set_path('../../jmvc');
include.set_path(MVC.apps_root);
MVC.user_initialize_function();
;
include.end_of_production();