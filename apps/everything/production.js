include.set_path('apps');
include.resources();
include.plugins("controller/comet","controller/dragdrop","controller/stateful","controller/hover","controller/lasso","dom/query","io/comet","io/jsonp","io/window_name","io/xdoc","lang/date","lang/json","model","model/ajax","model/cookie","model/jsonp","model/json_rest","model/window_name","model/xml_rest","test","view","view/helpers","dom/history","lang/date","lang/json");
MVC.load_doc=true;
include("../jmvc/rhino/documentation/setup");
include(function(){
});
;
include.set_path('jmvc/plugins/controller/comet');
include.plugins("io/comet","controller");
include("comet_controller");
;
include.set_path('jmvc/plugins/io/comet');
include.plugins("dom/event");
include("comet");
if(MVC.Console){
include("debug");
}
;
include.set_path('jmvc/plugins/dom/event');
if(typeof Prototype=="undefined"){
include("standard");
}else{
include("prototype_event");
}
;
include.set_path('jmvc/plugins/dom/event');
if(document.addEventListener){
MVC.Event={observe:function(el,_2,_3,_4){
if(_4==null){
_4=false;
}
el.addEventListener(_2,_3,_4);
},stop_observing:function(el,_6,_7,_8){
if(_8==null){
_8=false;
}
el.removeEventListener(_6,_7,false);
}};
}else{
if(document.attachEvent){
MVC.Event={observe:function(_9,_a,_b){
if(MVC.Event._find(_9,_a,_b)!=-1){
return;
}
var _c=function(e){
if(!e){
e=window.event;
}
var _e={_event:e,type:e.type,target:e.srcElement,currentTarget:_9,relatedTarget:_a=="mouseover"?e.fromElement:e.toElement,eventPhase:(e.srcElement==_9)?2:3,clientX:e.clientX,clientY:e.clientY,screenX:e.screenX,screenY:e.screenY,altKey:e.altKey,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,charCode:e.keyCode,stopPropagation:function(){
this._event.cancelBubble=true;
},preventDefault:function(){
this._event.returnValue=false;
},which:e.which||(e.button&1?1:(e.button&2?3:(e.button&4?2:0)))};
if(Function.prototype.call){
_b.call(_9,_e);
}else{
_9._currentHandler=_b;
_9._currentHandler(_e);
_9._currentHandler=null;
}
};
_9.attachEvent("on"+_a,_c);
var h={element:_9,eventType:_a,handler:_b,wrappedHandler:_c};
var d=_9.document||_9,w=d.parentWindow,id=MVC.Event._uid();
if(!w._allHandlers){
w._allHandlers={};
}
w._allHandlers[id]=h;
if(!_9._handlers){
_9._handlers=[];
}
_9._handlers.push(id);
if(!w._onunloadHandlerRegistered){
w._onunloadHandlerRegistered=true;
w.attachEvent("onunload",MVC.Event._removeAllHandlers);
}
},stop_observing:function(_13,_14,_15){
var i=MVC.Event._find(_13,_14,_15);
if(i==-1){
return;
}
var d=_13.document||_13,w=d.parentWindow,_19=_13._handlers[i],h=w._allHandlers[_19];
_13.detachEvent("on"+_14,h.wrappedHandler);
_13._handlers.splice(i,1);
delete w._allHandlers[_19];
},_find:function(_1b,_1c,_1d){
var _1e=_1b._handlers;
if(!_1e){
return -1;
}
var d=_1b.document||_1b,w=d.parentWindow;
for(var i=_1e.length-1;i>=0;i--){
var h=w._allHandlers[_1e[i]];
if(h.eventType==_1c&&h.handler==_1d){
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
include.set_path('jmvc/plugins/io/comet');
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
this.poll_now=MVC.Function.bind(function(){
if(this.is_polling()){
return;
}
clearTimeout(this.timeout);
this.options.polling();
MVC.Comet.connection=new this.transport(this.url,this.options);
},this);
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
MVC.Comet.connection=new this.transport(_1,this.options);
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
this.timeout=setTimeout(MVC.Function.bind(function(){
_7.polling();
MVC.Comet.connection=new _5(_6,_7);
},this),_8);
}};
MVC.Event.observe(window,"unload",function(){
MVC.Comet.send=false;
if(MVC.Comet.connection&&MVC.Comet.connection.transport&&MVC.Comet.transport.className&&MVC.Comet.transport.className=="Ajax"){
MVC.Comet.connection.transport.abort();
}
});
MVC.IO.Comet=MVC.Comet;
if(!MVC._no_conflict&&typeof Comet=="undefined"){
Comet=MVC.Comet;
}
;
include.set_path('jmvc/plugins/controller');
include.plugins("lang","lang/inflector","dom/event","lang/class","lang/openajax","dom/data");
include("delegator","controller");
if(MVC.View){
include.plugins("controller/view");
}
;
include.set_path('jmvc/plugins/lang');
include({path:"standard_helpers.js",shrink_variables:false});
;
include.set_path('jmvc/plugins/lang');
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
MVC.Native.set_prototype(_5,_8,_6[_8]);
}
}
}
};
MVC.Native.set_prototype=function(_a,_b,_c){
if(!_c){
_c=MVC[_a][_b];
}
window[_a].prototype[_b]=function(){
var _d=[this];
for(var i=0,_f=arguments.length;i<_f;i++){
_d.push(arguments[i]);
}
return _c.apply(this,_d);
};
};
MVC.Native.Object={};
MVC.Native.Object.extend=function(_10,_11){
for(var _12 in _11){
_10[_12]=_11[_12];
}
return _10;
};
MVC.Native.Object.to_query_string=function(_13,_14){
if(typeof _13!="object"){
return _13;
}
return MVC.Native.Object.to_query_string.worker(_13,_14).join("&");
};
MVC.Native.Object.to_query_string.worker=function(obj,_16){
var _17=[];
for(var _18 in obj){
if(obj.hasOwnProperty(_18)){
var _19=obj[_18];
if(_19&&_19.constructor===Date){
_19=_19.getUTCFullYear()+"-"+MVC.Number.to_padded_string(_19.getUTCMonth()+1,2)+"-"+MVC.Number.to_padded_string(_19.getUTCDate(),2)+" "+MVC.Number.to_padded_string(_19.getUTCHours(),2)+":"+MVC.Number.to_padded_string(_19.getUTCMinutes(),2)+":"+MVC.Number.to_padded_string(_19.getUTCSeconds(),2);
}
if(_19 instanceof Array&&_19.length){
var _1a=encodeURIComponent(_16?_16+"["+_18+"]":_18);
for(var i=0;i<_19.length;i++){
var _1c=encodeURIComponent(_19[i].toString());
_17.push(_1a+"="+_1c);
}
}else{
if(typeof _19!="object"){
var _1c=encodeURIComponent(_19.toString());
var _1a=encodeURIComponent(_16?_16+"["+_18+"]":_18);
_17.push(_1a+"="+_1c);
}else{
_17=_17.concat(MVC.Native.Object.to_query_string.worker(_19,_16?_16+"["+_18+"]":_18));
}
}
}
}
return _17;
};
MVC.Native.extend("String",{capitalize:function(s){
return s.charAt(0).toUpperCase()+s.substr(1).toLowerCase();
},include:function(s,_1f){
return s.indexOf(_1f)>-1;
},ends_with:function(s,_21){
var d=s.length-_21.length;
return d>=0&&s.lastIndexOf(_21)===d;
},camelize:function(s){
var _24=s.split(/_|-/);
for(var i=1;i<_24.length;i++){
_24[i]=MVC.String.capitalize(_24[i]);
}
return _24.join("");
},classize:function(s){
var _27=s.split(/_|-/);
for(var i=0;i<_27.length;i++){
_27[i]=MVC.String.capitalize(_27[i]);
}
return _27.join("");
},strip:MVC.String.strip});
MVC.Native.extend("Array",{include:function(a,_2a){
for(var i=0;i<a.length;i++){
if(a[i]==_2a){
return true;
}
}
return false;
}});
MVC.Array.from=function(_2c){
if(!_2c){
return [];
}
var _2d=[];
for(var i=0,_2f=_2c.length;i<_2f;i++){
_2d.push(_2c[i]);
}
return _2d;
};
MVC.Array.is=function(_30){
return Object.prototype.toString.call(a)==="[object Array]";
};
MVC.Native.extend("Function",{bind:function(f,obj){
var _33=MVC.Array.from(arguments);
_33.shift();
_33.shift();
var _34=f,_35=arguments[1];
return function(){
return _34.apply(_35,_33.concat(MVC.Array.from(arguments)));
};
},params:MVC.Function.params});
MVC.Native.extend("Number",{to_padded_string:function(n,len,_38){
var _39=n.toString(_38||10);
var ret="",_3b=len-_39.length;
for(var i=0;i<_3b;i++){
ret+="0";
}
return ret+_39;
}});
MVC.Native.Array=MVC.Array;
MVC.Native.Function=MVC.Function;
MVC.Native.Number=MVC.Number;
MVC.Native.String=MVC.String;
MVC.Object=MVC.Native.Object;
if(!MVC._no_conflict){
Array.from=MVC.Array.from;
}
;
include.set_path('jmvc/plugins/lang/inflector');
include.plugins("lang");
include("inflector");
;
include.set_path('jmvc/plugins/lang/inflector');
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
include.set_path('jmvc/plugins/lang/class');
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
_5=_5||{};
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
function _e(){
if(!_1&&this.init){
this.init.apply(this,arguments);
}
};
_e.prototype=_8;
_e.prototype.Class=_e;
_e.constructor=_e;
for(var _9 in this){
if(this.hasOwnProperty(_9)&&_9!="prototype"){
_e[_9]=this[_9];
}
}
for(var _9 in _4){
_e[_9]=typeof _4[_9]=="function"&&typeof _e[_9]=="function"&&_2.test(_4[_9])?(function(_f,fn){
return function(){
var tmp=this._super;
this._super=_6[_f];
var ret=fn.apply(this,arguments);
this._super=tmp;
return ret;
};
})(_9,_4[_9]):_4[_9];
}
_e.extend=arguments.callee;
if(_3){
_e.className=_3;
}
if(_e.init){
_e.init(_e);
}
if(_6.extended){
_6.extended(_e);
}
return _e;
};
})();
if(!MVC._no_conflict&&typeof Class=="undefined"){
Class=MVC.Class;
}
;
include.set_path('jmvc/plugins/lang/openajax');
if(!window["OpenAjax"]){
OpenAjax=new function(){
var t=true;
var f=false;
var g=window;
var _4="org.openajax.hub.";
var h={};
this.hub=h;
h.implementer="http://openajax.org";
h.implVersion="1.0";
h.specVersion="1.0";
h.implExtraData={};
var _6={};
h.libraries=_6;
h.registerLibrary=function(_7,_8,_9,_a){
_6[_7]={prefix:_7,namespaceURI:_8,version:_9,extraData:_a};
this.publish(_4+"registerLibrary",_6[_7]);
};
h.unregisterLibrary=function(_b){
this.publish(_4+"unregisterLibrary",_6[_b]);
delete _6[_b];
};
h._subscriptions={c:{},s:[]};
h._cleanup=[];
h._subIndex=0;
h._pubDepth=0;
h.subscribe=function(_c,_d,_e,_f,_10){
if(!_e){
_e=window;
}
var _11=_c+"."+this._subIndex;
var sub={scope:_e,cb:_d,fcb:_10,data:_f,sid:this._subIndex++,hdl:_11};
var _13=_c.split(".");
this._subscribe(this._subscriptions,_13,0,sub);
return _11;
};
h.publish=function(_14,_15){
var _16=_14.split(".");
this._pubDepth++;
this._publish(this._subscriptions,_16,0,_14,_15);
this._pubDepth--;
if((this._cleanup.length>0)&&(this._pubDepth==0)){
for(var i=0;i<this._cleanup.length;i++){
this.unsubscribe(this._cleanup[i].hdl);
}
delete (this._cleanup);
this._cleanup=[];
}
};
h.unsubscribe=function(sub){
var _19=sub.split(".");
var sid=_19.pop();
this._unsubscribe(this._subscriptions,_19,0,sid);
};
h._subscribe=function(_1b,_1c,_1d,sub){
var _1f=_1c[_1d];
if(_1d==_1c.length){
_1b.s.push(sub);
}else{
if(typeof _1b.c=="undefined"){
_1b.c={};
}
if(typeof _1b.c[_1f]=="undefined"){
_1b.c[_1f]={c:{},s:[]};
this._subscribe(_1b.c[_1f],_1c,_1d+1,sub);
}else{
this._subscribe(_1b.c[_1f],_1c,_1d+1,sub);
}
}
};
h._publish=function(_20,_21,_22,_23,msg,pcb,_26){
if(typeof _20!="undefined"){
var _27;
if(_22==_21.length){
_27=_20;
}else{
this._publish(_20.c[_21[_22]],_21,_22+1,_23,msg,pcb,_26);
this._publish(_20.c["*"],_21,_22+1,_23,msg,pcb,_26);
_27=_20.c["**"];
}
if(typeof _27!="undefined"){
var _28=_27.s;
var max=_28.length;
for(var i=0;i<max;i++){
if(_28[i].cb){
var sc=_28[i].scope;
var cb=_28[i].cb;
var fcb=_28[i].fcb;
var d=_28[i].data;
var sid=_28[i].sid;
var _30=_28[i].cid;
if(typeof cb=="string"){
cb=sc[cb];
}
if(typeof fcb=="string"){
fcb=sc[fcb];
}
if((!fcb)||(fcb.call(sc,_23,msg,d))){
if((!pcb)||(pcb(_23,msg,_26,_30))){
cb.call(sc,_23,msg,d,sid);
}
}
}
}
}
}
};
h._unsubscribe=function(_31,_32,_33,sid){
if(typeof _31!="undefined"){
if(_33<_32.length){
var _35=_31.c[_32[_33]];
this._unsubscribe(_35,_32,_33+1,sid);
if(_35.s.length==0){
for(var x in _35.c){
return;
}
delete _31.c[_32[_33]];
}
return;
}else{
var _37=_31.s;
var max=_37.length;
for(var i=0;i<max;i++){
if(sid==_37[i].sid){
if(this._pubDepth>0){
_37[i].cb=null;
this._cleanup.push(_37[i]);
}else{
_37.splice(i,1);
}
return;
}
}
}
}
};
h.reinit=function(){
for(var lib in OpenAjax.hub.libraries){
delete OpenAjax.hub.libraries[lib];
}
OpenAjax.hub.registerLibrary("OpenAjax","http://openajax.org/hub","1.0",{});
delete OpenAjax._subscriptions;
OpenAjax._subscriptions={c:{},s:[]};
delete OpenAjax._cleanup;
OpenAjax._cleanup=[];
OpenAjax._subIndex=0;
OpenAjax._pubDepth=0;
};
};
OpenAjax.hub.registerLibrary("OpenAjax","http://openajax.org/hub","1.0",{});
}
OpenAjax.hub.registerLibrary("JavaScriptMVC","http://JavaScriptMVC.com","1.5",{});
;
include.set_path('jmvc/plugins/dom/data');
MVC.Dom={data:function(_1,_2,_3){
_1=_1==window?windowData:_1;
var _4=_1.__mvc;
if(!_4){
_1.__mvc={};
}
if(_3!==undefined){
_1.__mvc[_2]=_3;
}
return _2?_1.__mvc[_2]:_1.__mvc;
},remove_data:function(_5,_6){
_5=_5==window?windowData:_5;
var _7=_5.__mvc;
if(_6){
if(_7){
delete _7[_6];
_6="";
for(_6 in _7){
break;
}
if(!_6){
MVC.Dom.remove_data(_5);
}
}
}else{
try{
delete _5.__mvc;
}
catch(e){
if(_5.removeAttribute){
_5.removeAttribute("__jmvc");
}
}
}
}};
;
include.set_path('jmvc/plugins/controller');
MVC.Delegator=function(_1,_2,f,_4){
this._event=_2;
this._selector=_1;
this._func=f;
this.element=_4||document.documentElement;
MVC.Delegator.jmvc(this.element);
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
MVC.Object.extend(MVC.Delegator,{jmvc:function(_5){
var _6=MVC.Dom.data(_5);
if(!_6.delegation_events){
_6.delegation_events={};
}
if(_6.responding==null){
_6.responding=true;
}
return _6;
},add_kill_event:function(_7){
if(!_7.kill){
if(!_7){
_7=window.event;
}
var _8=false;
_7.kill=function(){
_8=true;
try{
if(_7.stopPropagation){
_7.stopPropagation();
}
if(_7.preventDefault){
_7.preventDefault();
}
}
catch(e){
}
};
_7.is_killed=function(){
return _8;
};
_7.stop_propagation=function(){
_8=true;
try{
if(_7.stopPropagation){
_7.stopPropagation();
}
}
catch(e){
}
};
_7.prevent_default=function(){
try{
if(_7.preventDefault){
_7.preventDefault();
}
}
catch(e){
}
};
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
},events:{},onload_called:false});
MVC.Event.observe(window,"load",function(){
MVC.Delegator.onload_called=true;
});
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
},add_to_delegator:function(_d,_e,_f){
var s=_d||this._selector;
var e=_e||this.event();
var f=_f||this._func;
var _13=MVC.Dom.data(this.element,"delegation_events");
if(!_13[e]||_13[e].length==0){
var _14=MVC.Function.bind(this.dispatch_event,this);
MVC.Event.observe(this.element,e,_14,this.capture());
_13[e]=[];
_13[e]._bind_function=_14;
}
_13[e].push(this);
},_remove_from_delegator:function(_15){
var _16=_15||this.event();
var _17=MVC.Dom.data(this.element,"delegation_events")[_16];
for(var i=0;i<_17.length;i++){
if(_17[i]==this){
_17.splice(i,1);
break;
}
}
if(_17.length==0){
MVC.Event.stop_observing(this.element,_16,_17._bind_function,this.capture());
}
},submit_for_ie:function(){
this.add_to_delegator(null,"click");
this.add_to_delegator(null,"keypress");
this.filters={click:function(el,_1a,_1b){
if(el.nodeName.toUpperCase()=="INPUT"&&el.type.toLowerCase()=="submit"){
for(var e=0;e<_1b.length;e++){
if(_1b[e].tag=="FORM"){
return true;
}
}
}
return false;
},keypress:function(el,_1e,_1f){
if(el.nodeName.toUpperCase()!="INPUT"){
return false;
}
var res=typeof Prototype!="undefined"?(_1e.keyCode==13):(_1e.charCode==13);
if(res){
for(var e=0;e<_1f.length;e++){
if(_1f[e].tag=="FORM"){
return true;
}
}
}
return false;
}};
},change_for_ie:function(){
this.add_to_delegator(null,"click");
this.add_to_delegator(null,"keyup");
this.add_to_delegator(null,"beforeactivate");
this.end_filters={click:function(el,_23){
switch(el.nodeName.toLowerCase()){
case "select":
if(typeof el.selectedIndex=="undefined"){
return false;
}
var _24=MVC.Dom.data(el);
if(_24._change_old_value==null){
_24._change_old_value=el.selectedIndex.toString();
return false;
}else{
if(_24._change_old_value==el.selectedIndex.toString()){
return false;
}
_24._change_old_value=el.selectedIndex.toString();
return true;
}
break;
case "input":
if(el.type.toLowerCase()=="checkbox"){
return true;
}
return false;
}
return false;
},keyup:function(el,_26){
if(el.nodeName.toLowerCase()!="select"){
return false;
}
if(typeof el.selectedIndex=="undefined"){
return false;
}
var _27=MVC.Dom.data(el);
if(_27._change_old_value==null){
_27._change_old_value=el.selectedIndex.toString();
return false;
}else{
if(_27._change_old_value==el.selectedIndex.toString()){
return false;
}
_27._change_old_value=el.selectedIndex.toString();
return true;
}
},beforeactivate:function(el,_29){
return el.nodeName.toLowerCase()=="input"&&el.type.toLowerCase()=="radio"&&!el.checked&&MVC.Delegator.onload_called;
}};
},change_for_webkit:function(){
this.add_to_delegator(null,"change");
this.end_filters={change:function(el,_2b){
if(el.nodeName.toLowerCase()=="input"){
return true;
}
if(typeof el.value=="undefined"){
return false;
}
var old=el.getAttribute("_old_value");
el.setAttribute("_old_value",el.value);
return el.value!=old;
}};
},context_for_opera:function(){
this.add_to_delegator(null,"click");
this.end_filters={click:function(el,_2e){
return _2e.shiftKey;
}};
},regexp_patterns:{tag:/^\s*(\*|[\w\-]+)(\b|$)?/,id:/^#([\w\-\*]+)(\b|$)/,className:/^\.([\w\-\*]+)(\b|$)/},selector_order:function(){
if(this.order){
return this.order;
}
var _2f=this._selector.split(/\s+/);
var _30=this.regexp_patterns;
var _31=[];
if(this._selector){
for(var i=0;i<_2f.length;i++){
var v={},r,p=_2f[i];
for(var _36 in _30){
if(_30.hasOwnProperty(_36)){
if((r=p.match(_30[_36]))){
if(_36=="tag"){
v[_36]=r[1].toUpperCase();
}else{
v[_36]=r[1];
}
p=p.replace(r[0],"");
}
}
}
_31.push(v);
}
}
this.order=_31;
return this.order;
},match:function(el,_38,_39){
if(this.filters&&!this.filters[_38.type](el,_38,_39)){
return null;
}
var _3a=0;
var _3b=this.selector_order();
if(_3b.length==0){
return {node:_39[0].element,order:0,delegation_event:this};
}
for(var n=0;n<_39.length;n++){
var _3d=_39[n],_3e=_3b[_3a],_3f=true;
for(var _40 in _3e){
if(!_3e.hasOwnProperty(_40)||_40=="element"){
continue;
}
if(_3e[_40]&&_40=="className"){
if(!MVC.Array.include(_3d.className.split(" "),_3e[_40])){
_3f=false;
}
}else{
if(_3e[_40]&&_3d[_40]!=_3e[_40]){
_3f=false;
}
}
}
if(_3f){
_3a++;
if(_3a>=_3b.length){
if(this.end_filters&&!this.end_filters[_38.type](el,_38)){
return null;
}
return {node:_3d.element,order:n,delegation_event:this};
}
}
}
return null;
},dispatch_event:function(_41){
var _42=_41.target,_43=false,_44=true,_45=[];
var _46=MVC.Dom.data(this.element,"delegation_events")[_41.type];
var _47=this.node_path(_42);
for(var i=0;i<_46.length;i++){
var _49=_46[i];
var _4a=_49.match(_42,_41,_47);
if(_4a){
_45.push(_4a);
}
}
if(_45.length==0){
return true;
}
MVC.Delegator.add_kill_event(_41);
_45.sort(MVC.Delegator.sort_by_order);
var _4b;
for(var m=0;m<_45.length;m++){
_4b=_45[m];
_44=_4b.delegation_event._func({event:_41,element:MVC.$E(_4b.node),delegate:this.element})&&_44;
if(_41.is_killed()){
return false;
}
}
},node_path:function(el){
var _4e=this.element,_4f=[],_50=el;
if(_50==_4e){
return [{tag:_50.nodeName,className:_50.className,id:_50.id,element:_50}];
}
do{
_4f.unshift({tag:_50.nodeName,className:_50.className,id:_50.id,element:_50});
}while(((_50=_50.parentNode)!=_4e)&&_50);
if(_50){
_4f.unshift({tag:_50.nodeName,className:_50.className,id:_50.id,element:_50});
}
return _4f;
},destroy:function(){
if(this._event=="contextmenu"&&MVC.Browser.Opera){
return this._remove_from_delegator("click");
}
if(this._event=="submit"&&MVC.Browser.IE){
this._remove_from_delegator("keypress");
return this._remove_from_delegator("click");
}
if(this._event=="change"&&MVC.Browser.IE){
this._remove_from_delegator("keyup");
this._remove_from_delegator("beforeactivate");
return this._remove_from_delegator("click");
}
this._remove_from_delegator();
}};
;
include.set_path('jmvc/plugins/controller');
MVC.Object.is_number=function(o){
return o&&(typeof o=="number"||(typeof o=="string"&&!isNaN(o)));
};
MVC.Controller=MVC.Class.extend({init:function(){
if(!this.className){
return;
}
this.singularName=MVC.String.singularize(this.className);
if(!MVC.Controller.controllers[this.className]){
MVC.Controller.controllers[this.className]=[];
}
MVC.Controller.controllers[this.className].unshift(this);
var _2,_3;
if(!this.modelName){
this.modelName=MVC.String.is_singular(this.className)?this.className:MVC.String.singularize(this.className);
}
if(this._should_attach_actions){
this._create_actions();
}
if(include.get_env()=="test"){
var _4=MVC.root.join("test/functional/"+this.className+"_controller_test.js");
var _5=include.check_exists(_4);
if(_5){
MVC.Console.log("Loading: \"test/functional/"+this.className+"_controller_test.js\"");
include("../test/functional/"+this.className+"_controller_test.js");
}else{
MVC.Console.log("Test Controller not found at \"test/functional/"+this.className+"_controller_test.js\"");
}
}
this._path=include.get_path().match(/(.*?)controllers/)[1]+"controllers";
},_should_attach_actions:true,_create_actions:function(){
this.actions={};
for(var _6 in this.prototype){
val=this.prototype[_6];
if(typeof val=="function"&&_6!="Class"){
for(var a=0;a<MVC.Controller.actions.length;a++){
act=MVC.Controller.actions[a];
if(act.matches(_6)){
var _8=this.dispatch_closure(_6);
this.actions[_6]=new act(_6,_8,this.className,this._element,this._events);
}
}
}
}
},dispatch_closure:function(_9){
return MVC.Function.bind(function(_a){
_a=_a||{};
_a.action=_9;
_a.controller=this;
_a=_a.constructor==MVC.Controller.Params?_a:new MVC.Controller.Params(_a);
return this.dispatch(_9,_a);
},this);
},dispatch:function(_b,_c){
if(!_b){
_b="index";
}
if(typeof _b=="string"){
if(!(_b in this.prototype)){
throw "No action named "+_b+" was found for "+this.Class.className+" controller.";
}
}else{
_b=_b.name;
}
var _d=this._get_instance(_b,_c);
return this._dispatch_action(_d,_b,_c);
},_get_instance:function(_e,_f){
return new this(_e,_f);
},_dispatch_action:function(_10,_11,_12){
if(!this._listening){
return;
}
_10.params=_12;
_10.action_name=_11;
return _10[_11](_12);
},controllers:{},actions:[],publish:function(_13,_14){
OpenAjax.hub.publish(_13,_14);
},get_controller_with_name_and_action:function(_15,_16){
var _17=MVC.Controller.controllers[_15];
if(!_17){
return null;
}
for(var i=0;i<_17.length;i++){
var _19=_17[i];
if(_19.prototype[_16]){
return _19;
}
}
return null;
},modelName:null,_listening:true,_events:MVC.Delegator.events,_element:document.documentElement},{continue_to:function(_1a){
var _1b=MVC.Array.from(arguments);
var _1a=_1b.shift();
if(typeof this[_1a]!="function"){
throw "There is no action named "+_1a+". ";
}
return MVC.Function.bind(function(){
this.action_name=_1a;
this[_1a].apply(this,_1b.concat(MVC.Array.from(arguments)));
},this);
},delay:function(_1c,_1d,_1e){
if(typeof this[_1d]!="function"){
throw "There is no action named "+_1d+". ";
}
return setTimeout(MVC.Function.bind(function(){
this.Class._dispatch_action(this,_1d,_1e);
},this),_1c);
},publish:function(_1f,_20){
this.Class.publish(_1f,_20);
}});
MVC.Controller.Action=MVC.Class.extend({init:function(){
if(this.matches){
MVC.Controller.actions.push(this);
}
}},{init:function(_21,_22,_23,_24){
this.action=_21;
this.callback=_22;
this.className=_23;
this.element=_24;
},destroy:function(){
}});
MVC.Controller.Action.Subscribe=MVC.Controller.Action.extend({match:new RegExp("(.*?)\\s?(subscribe)$"),matches:function(_25){
return this.match.exec(_25);
}},{init:function(_26,_27,_28,_29){
this._super(_26,_27,_28,_29);
this.message();
this.subscription=OpenAjax.hub.subscribe(this.message_name,MVC.Function.bind(this.subscribe,this));
},message:function(){
this.parts=this.action.match(this.Class.match);
this.message_name=this.parts[1];
},subscribe:function(_2a,_2b){
var _2c=_2b||{};
_2c.event_name=_2a;
this.callback(_2c);
},destroy:function(){
OpenAjax.hub.unsubscribe(this.subscription);
this._super();
}});
MVC.Controller.Action.Event=MVC.Controller.Action.extend({match:new RegExp("^(?:(.*?)\\s)?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|resize|scroll|select|submit|dblclick|focus|blur|load|unload)$"),matches:function(_2d){
return this.match.exec(_2d);
}},{init:function(_2e,_2f,_30,_31){
this._super(_2e,_2f,_30,_31);
this.css_and_event();
var _32=this.selector();
if(_32!=null){
this.delegator=new MVC.Delegator(_32,this.event_type,_2f,_31);
}
},css_and_event:function(){
this.parts=this.action.match(this.Class.match);
this.css=this.parts[1]||"";
this.event_type=this.parts[2];
},main_controller:function(){
if(!this.css&&MVC.Array.include(["blur","focus"],this.event_type)){
MVC.Event.observe(window,this.event_type,MVC.Function.bind(function(_33){
this.callback({event:_33,element:window});
},this));
return;
}
return this.css;
},plural_selector:function(){
if(this.css=="#"||this.css.substring(0,2)=="# "){
var _34=this.css.substring(2,this.css.length);
if(this.element==document.documentElement){
return "#"+this.className+(_34?" "+_34:"");
}else{
return (_34?" "+_34:"");
}
}else{
return "."+MVC.String.singularize(this.className)+(this.css?" "+this.css:"");
}
},singular_selector:function(){
if(this.element==document.documentElement){
return "#"+this.className+(this.css?" "+this.css:"");
}else{
return this.css;
}
},selector:function(){
if(MVC.Array.include(["load","unload","resize","scroll"],this.event_type)){
MVC.Event.observe(window,this.event_type,MVC.Function.bind(function(_35){
this.callback({event:_35,element:window});
},this));
return;
}
if(this.className=="main"){
this.css_selector=this.main_controller();
}else{
this.css_selector=MVC.String.is_singular(this.className)?this.singular_selector():this.plural_selector();
}
return this.css_selector;
},destroy:function(){
if(this.delegator){
this.delegator.destroy();
}
this._super();
}});
MVC.Controller.Params=function(_36){
var _36=_36||{};
var _37=false;
this.kill=function(){
_37=true;
if(_36.event&&_36.event.kill){
_36.event.kill();
}
};
this.is_killed=function(){
return _36.event.is_killed?_36.event.is_killed():_37;
};
for(var _38 in _36){
if(_36.hasOwnProperty(_38)){
this[_38]=_36[_38];
}
}
this.constructor=MVC.Controller.Params;
};
MVC.Controller.Params.prototype={form_params:function(){
var _39={};
if(this.element.nodeName.toLowerCase()!="form"){
return _39;
}
var els=this.element.elements,_3b=[];
for(var i=0;i<els.length;i++){
var el=els[i];
if(el.type.toLowerCase()=="submit"){
continue;
}
var key=el.name||el.id,_3f=key.match(/(\w+)/g),_40;
if(!key){
continue;
}
switch(el.type.toLowerCase()){
case "checkbox":
case "radio":
_40=!!el.checked;
break;
default:
_40=el.value;
break;
}
if(_3f.length>1){
var _41=_3f.length-1;
var _42=_3f[0].toString();
if(!_39[_42]){
_39[_42]={};
}
var _43=_39[_42];
for(var k=1;k<_41;k++){
_42=_3f[k];
if(!_43[_42]){
_43[_42]={};
}
_43=_43[_42];
}
_43[_3f[_41]]=_40;
}else{
if(key in _39){
if(typeof _39[key]=="string"){
_39[key]=[_39[key]];
}
_39[key].push(_40);
}else{
_39[key]=_40;
}
}
}
return _39;
},class_element:function(){
var _45=this.element;
var _46=this._className();
var _47=function(el){
var _49=el.className.split(" ");
for(var i=0;i<_49.length;i++){
if(_49[i]==_46){
return true;
}
}
return false;
};
while(_45&&!_47(_45)){
_45=_45.parentNode;
if(_45==document){
return null;
}
}
return MVC.$E(_45);
},is_event_on_element:function(){
return this.event.target==this.element;
},_className:function(){
return this.controller.singularName;
},element_instance:function(){
var ce,_4c,_4d,_4e=this.controller.modelName,id,_50=new RegExp("^"+_4e+"_(.*)$");
if(!(_4d=MVC.Model.models[_4e])){
throw "No model for the "+this.controller.className+" controller!";
}
ce=this.class_element();
return Model._find_by_element(ce,_4e,_4d);
}};
if(!MVC._no_conflict&&typeof Controller=="undefined"){
Controller=MVC.Controller;
}
;
include.set_path('jmvc/plugins/controller/comet');
MVC.Controller.Comet=MVC.Controller.extend({init:function(){
},run:function(_1){
var _2=new this();
_2.run(_1);
},kill:function(){
var _3=new this();
_3.kill();
},convert:function(_4){
return _4;
},set_wait_time:function(_5){
this._wait_time=_5*1000;
if(this._comet){
this._comet.poll_now();
}
},_wait_time:0,wait_time:function(){
return this._wait_time;
},dispatch:function(_6){
var _7=this.convert(_6);
for(var _8 in _6){
if(_8=="responseText"){
continue;
}
var _9=_6[_8];
for(var _a in _9){
var _b=_9[_a];
if(this.models_map&&this.models_map[_8]!=null){
if(this.models_map[_8]!=false){
_b=this.models_map[_8].create_many_as_existing(_b);
}
}else{
if(MVC.Model&&MVC.Model.models[_8.toLowerCase()]){
_b=MVC.Model.models[_8.toLowerCase()].create_many_as_existing(_b);
}
}
var _c=this.controller_map[_8]?this.controller_map[_8]:MVC.String.pluralize(_8).toLowerCase();
MVC.Controller.publish(_c+"."+_a,{data:_b});
}
}
},controller_map:{},error_mode:false},{run:function(){
this.start_polling();
},start_polling:function(){
this.Class._comet=new MVC.Comet((this.Class.domain?this.Class.domain:"")+"/"+this.Class.className,{method:"get",onComplete:this.continue_to("complete"),onSuccess:this.continue_to("success"),onFailure:this.continue_to("failure"),parameters:this.Class.parameters||null,session:this.Class.session||null,transport:this.Class.transport,wait_time:MVC.Function.bind(this.Class.wait_time,this.Class)});
},failure:function(){
this.error_mode=true;
this.run();
},success:function(_d){
this.Class.dispatch(_d);
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
include.set_path('jmvc/plugins/controller/dragdrop');
include.plugins("controller","dom/element","dom/query","dom/position","dom/animate");
include("drag","drop");
;
include.set_path('jmvc/plugins/dom/element');
include.plugins("lang/vector");
include("element");
;
include.set_path('jmvc/plugins/lang/vector');
include.plugins("lang","dom/event");
include("vector");
;
include.set_path('jmvc/plugins/lang/vector');
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
},equals:function(){
var _d=arguments[0] instanceof MVC.Vector?arguments[0].array:MVC.Array.from(arguments),_e=this.array.slice(0),_f=new MVC.Vector();
for(var i=0;i<_d.length;i++){
if(_e[i]!=_d[i]){
return null;
}
}
return _f.update(_e);
},x:function(){
return this.array[0];
},width:function(){
return this.array[0];
},y:function(){
return this.array[1];
},height:function(){
return this.array[1];
},top:function(){
return this.array[1];
},left:function(){
return this.array[0];
},toString:function(){
return "("+this.array[0]+","+this.array[1]+")";
},update:function(_11){
if(this.array){
for(var i=0;i<this.array.length;i++){
delete this.array[i];
}
}
this.array=_11;
for(var i=0;i<_11.length;i++){
this[i]=this.array[i];
}
return this;
}};
MVC.Event.pointer=function(_13){
return new MVC.Vector((_13.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft)),(_13.clientY+(document.documentElement.scrollTop||document.body.scrollTop)));
};
;
include.set_path('jmvc/plugins/dom/element');
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
},tags:{TABLE:["<table>","</table>",1],TBODY:["<table><tbody>","</tbody></table>",2],TR:["<table><tbody><tr>","</tr></tbody></table>",3],TD:["<table><tbody><tr><td>","</td></tr></tbody></table>",4],SELECT:["<select>","</select>",1]}},replace:function(_11,_12){
var _11=MVC.$E(_11);
if(_12.nodeType==1){
_11.parentNode.replaceChild(_12,_11);
return _11;
}
if(_11.outerHTML){
var _13=_11.parentNode,_14=_13.tagName.toUpperCase();
if(MVC.Element._insertionTranslations.tags[_14]){
var _15=_11.next();
var _16=MVC.Element._getContentFromAnonymousElement(_14,_12);
_13.removeChild(_11);
if(_15){
for(var i=0;i<_16.length;i++){
_13.insertBefore(_16[i],_15);
}
}else{
for(var i=0;i<_16.length;i++){
_13.appendChild(_16[i]);
}
}
}else{
_11.outerHTML=_12;
}
return _11;
}else{
if(_12.nodeType!=1){
var _18=_11.ownerDocument.createRange();
_18.selectNode(_11);
_12=_18.createContextualFragment(_12);
}
_11.parentNode.replaceChild(_12,_11);
return _11;
}
},_getContentFromAnonymousElement:function(_19,_1a){
var div=document.createElement("div"),t=MVC.$E._insertionTranslations.tags[_19];
if(t){
div.innerHTML=t[0]+_1a+t[1];
for(var i=0;i<t[2];i++){
div=div.firstChild;
}
}else{
div.innerHTML=_1a;
}
return MVC.Array.from(div.childNodes);
},get_children:function(_1e){
var els=[];
var el=_1e.first();
while(el){
els.push(el);
el=el.next();
}
return els;
},first:function(_21,_22){
_22=_22||function(){
return true;
};
var _23=_21.firstChild;
while(_23&&_23.nodeType!=1||(_23&&!_22(_23))){
_23=_23.nextSibling;
}
return MVC.$E(_23);
},last:function(_24,_25){
_25=_25||function(){
return true;
};
var _26=_24.lastChild;
while(_26&&_26.nodeType!=1||(_26&&!_25(_26))){
_26=_26.previousSibling;
}
return MVC.$E(_26);
},next:function(_27,_28,_29){
_29=_29||function(){
return true;
};
var _2a=_27.nextSibling;
while(_2a&&_2a.nodeType!=1||(_2a&&!_29(_2a))){
_2a=_2a.nextSibling;
}
if(!_2a&&_28){
return MVC.$E(_27.parentNode).first(_29);
}
return MVC.$E(_2a);
},previous:function(_2b,_2c,_2d){
_2d=_2d||function(){
return true;
};
var _2e=_2b.previousSibling;
while(_2e&&_2e.nodeType!=1||(_2e&&!_2d(_2e))){
_2e=_2e.previousSibling;
}
if(!_2e&&_2c){
return MVC.$E(_2b.parentNode).last(_2d);
}
return MVC.$E(_2e);
},toggle:function(_2f){
return _2f.style.display=="none"?_2f.style.display="":_2f.style.display="none";
},make_positioned:function(_30){
_30=MVC.$E(_30);
var pos=MVC.Element.get_style(_30,"position");
if(pos=="static"||!pos){
_30._madePositioned=true;
_30.style.position="relative";
if(window.opera){
_30.style.top=0;
_30.style.left=0;
}
}
return _30;
},get_style:function(_32,_33){
_32=MVC.$E(_32);
_33=_33=="float"?"cssFloat":MVC.String.camelize(_33);
var _34;
if(_32.currentStyle){
var _34=_32.currentStyle[_33];
}else{
var css=document.defaultView.getComputedStyle(_32,null);
_34=css?css[_33]:null;
}
if(_33=="opacity"){
return _34?parseFloat(_34):1;
}
return _34=="auto"?null:_34;
},has:function(_36,b){
if(!b){
return false;
}
if(typeof b=="string"){
b=MVC.$E(b);
}
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
if(_3f===window){
return new MVC.Vector(window.innerWidth?window.innerWidth:document.documentElement.clientWidth,window.innerHeight?window.innerHeight:document.documentElement.clientHeight);
}
if(!MVC.Element.has(document.body,_3f)){
return new MVC.Vector(parseInt(_3f.get_style("width")),parseInt(_3f.get_style("height")));
}
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
},add_class:function(_47,_48){
var cns=this.class_names(_47);
if(MVC.Array.include(cns,_48)){
return;
}
cns.push(_48);
_47.className=cns.join(" ");
return _47;
},remove_class:function(_4a,_4b){
var cns=this.class_names(_4a);
var _4d=[];
for(var i=0;i<cns.length;i++){
if(cns[i]!=_4b){
_4d.push(cns[i]);
}
}
_4a.className=_4d.join(" ");
return _4a;
},class_names:function(_4f){
return _4f.className.split(MVC.Element._class_name_split);
},_class_name_split:/\s+/,has_class:function(_50,_51){
var cns=this.class_names(_50);
var _53;
for(var i=0;i<cns.length;i++){
if((_53=cns[i].match(_51))){
return _53;
}
}
}});
MVC.Element.extend=function(el){
for(var f in MVC.Element){
if(!MVC.Element.hasOwnProperty(f)){
continue;
}
var _57=MVC.Element[f];
if(typeof _57=="function"){
if(f[0]!="_"){
MVC.Element._extend(_57,f,el);
}
}
}
el._mvcextend=true;
return el;
};
MVC.Element._extend=function(f,_59,el){
el[_59]=function(){
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
include.set_path('jmvc/plugins/dom/query');
if(typeof Prototype!="undefined"){
MVC.Query=$$;
MVC.Query.descendant=function(_1,_2){
return _1.getElementsBySelector(_2);
};
}else{
if(typeof jQuery!="undefined"){
MVC.Query=$;
MVC.Query.descendant=function(_3,_4){
return $(_3).find(_4);
};
}else{
include("standard");
}
}
;
include.set_path('jmvc/plugins/dom/query');
(function(){
var _1=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]+\]|[^[\]]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g;
var _2=0;
var _3=function(_4,_5,_6,_7){
var _8=!_6;
_6=_6||[];
_5=_5||document;
if(_5.nodeType!==1&&_5.nodeType!==9){
return [];
}
if(!_4||typeof _4!=="string"){
return _6;
}
var _9=[],m,_b,_c,_d,_e,_f;
_1.lastIndex=0;
while((m=_1.exec(_4))!==null){
_9.push(m[1]);
if(m[2]){
_f=RegExp.rightContext;
break;
}
}
if(_9.length>1&&_10.match.POS.exec(_4)){
if(_9.length===2&&_10.relative[_9[0]]){
var _11="",_12;
while((_12=_10.match.POS.exec(_4))){
_11+=_12[0];
_4=_4.replace(_10.match.POS,"");
}
_b=_3.filter(_11,_3(_4,_5));
}else{
_b=_10.relative[_9[0]]?[_5]:_3(_9.shift(),_5);
while(_9.length){
var _13=[];
_4=_9.shift();
if(_10.relative[_4]){
_4+=_9.shift();
}
for(var i=0,l=_b.length;i<l;i++){
_3(_4,_b[i],_13);
}
_b=_13;
}
}
}else{
var ret=_7?{expr:_9.pop(),set:_17(_7)}:_3.find(_9.pop(),_9.length===1&&_5.parentNode?_5.parentNode:_5);
_b=_3.filter(ret.expr,ret.set);
if(_9.length>0){
_c=_17(_b);
}
while(_9.length){
var cur=_9.pop(),pop=cur;
if(!_10.relative[cur]){
cur="";
}else{
pop=_9.pop();
}
if(pop==null){
pop=_5;
}
_10.relative[cur](_c,pop);
}
}
if(!_c){
_c=_b;
}
if(!_c){
throw "Syntax error, unrecognized expression: "+(cur||_4);
}
if(_c instanceof Array){
if(_5.nodeType===1){
for(var i=0;_c[i]!=null;i++){
if(_c[i]&&(_c[i]===true||_c[i].nodeType===1&&_1a(_5,_c[i]))){
_6.push(_b[i]);
}
}
}else{
for(var i=0;_c[i]!=null;i++){
if(_c[i]&&_c[i].nodeType===1){
_6.push(_b[i]);
}
}
}
}else{
_17(_c,_6);
}
if(_f){
_3(_f,_5,_6);
}
return _6;
};
_3.matches=function(_1b,set){
return _3(_1b,null,null,set);
};
_3.find=function(_1d,_1e){
var set,_20;
if(!_1d){
return [];
}
var _21="",_20;
while((_20=_10.match.PSEUDO.exec(_1d))){
var _22=RegExp.leftContext;
if(_22.substr(_22.length-1)!=="\\"){
_21+=_20[0];
_1d=_1d.replace(_10.match.PSEUDO,"");
}else{
break;
}
}
for(var i=0,l=_10.order.length;i<l;i++){
var _25=_10.order[i];
if((_20=_10.match[_25].exec(_1d))){
var _22=RegExp.leftContext;
if(_22.substr(_22.length-1)!=="\\"){
_20[1]=(_20[1]||"").replace(/\\/g,"");
set=_10.find[_25](_20,_1e);
if(set!=null){
_1d=_1d.replace(_10.match[_25],"");
break;
}
}
}
}
if(!set){
set=_1e.getElementsByTagName("*");
}
_1d+=_21;
return {set:set,expr:_1d};
};
_3.filter=function(_26,set,_28){
var old=_26,_2a=[],_2b=set,_2c;
while(_26&&set.length){
for(var _2d in _10.filter){
if((_2c=_10.match[_2d].exec(_26))!=null){
var _2e=false,_2f=_10.filter[_2d],_30=null;
if(_2b==_2a){
_2a=[];
}
if(_10.preFilter[_2d]){
_2c=_10.preFilter[_2d](_2c,_2b);
if(_2c[0]===true){
_30=[];
var _31=null,_32;
for(var i=0;(_32=_2b[i])!==undefined;i++){
if(_32&&_31!==_32){
_30.push(_32);
_31=_32;
}
}
}
}
var _34=0,_35,_36;
for(var i=0;(_36=_2b[i])!==undefined;i++){
if(_36){
if(_30&&_36!=_30[_34]){
_34++;
}
_35=_2f(_36,_2c,_34,_30);
if(_28&&_35!=null){
_2b[i]=_35?_2b[i]:false;
if(_35){
_2e=true;
}
}else{
if(_35){
_2a.push(_36);
_2e=true;
}
}
}
}
if(_35!==undefined){
if(!_28){
_2b=_2a;
}
_26=_26.replace(_10.match[_2d],"");
if(!_2e){
return [];
}
break;
}
}
}
_26=_26.replace(/\s*,\s*/,"");
if(_26==old){
throw "Syntax error, unrecognized expression: "+_26;
}
old=_26;
}
return _2b;
};
var _10=_3.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u0128-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u0128-\uFFFF_-]|\\.)+)/,NAME:/\[name=((?:[\w\u0128-\uFFFF_-]|\\.)+)\]/,ATTR:/\[((?:[\w\u0128-\uFFFF_-]|\\.)+)\s*(?:(\S{0,1}=)\s*(['"]*)(.*?)\3|)\]/,TAG:/^((?:[\w\u0128-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child\(?(even|odd|[\dn+-]*)\)?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)\(?(\d*)\)?(?:[^-]|$)/,PSEUDO:/:((?:[\w\u0128-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className"},relative:{"+":function(_37,_38){
for(var i=0,l=_37.length;i<l;i++){
var _3b=_37[i];
if(_3b){
var cur=_3b.previousSibling;
while(cur&&cur.nodeType!==1){
cur=cur.previousSibling;
}
_37[i]=typeof _38==="string"?cur||false:cur===_38;
}
}
if(typeof _38==="string"){
_3.filter(_38,_37,true);
}
},">":function(_3d,_3e){
if(typeof _3e==="string"&&!/\W/.test(_3e)){
_3e=_3e.toUpperCase();
for(var i=0,l=_3d.length;i<l;i++){
var _41=_3d[i];
if(_41){
var _42=_41.parentNode;
_3d[i]=_42.nodeName===_3e?_42:false;
}
}
}else{
for(var i=0,l=_3d.length;i<l;i++){
var _41=_3d[i];
if(_41){
_3d[i]=typeof _3e==="string"?_41.parentNode:_41.parentNode===_3e;
}
}
if(typeof _3e==="string"){
_3.filter(_3e,_3d,true);
}
}
},"":function(_43,_44){
var _45="done"+(_2++),_46=_47;
if(!_44.match(/\W/)){
var _48=_44=_44.toUpperCase();
_46=_49;
}
_46("parentNode",_44,_45,_43,_48);
},"~":function(_4a,_4b){
var _4c="done"+(_2++),_4d=_47;
if(typeof _4b==="string"&&!_4b.match(/\W/)){
var _4e=_4b=_4b.toUpperCase();
_4d=_49;
}
_4d("previousSibling",_4b,_4c,_4a,_4e);
}},find:{ID:function(_4f,_50){
if(_50.getElementById){
var m=_50.getElementById(_4f[1]);
return m?[m]:[];
}
},NAME:function(_52,_53){
return _53.getElementsByName(_52[1]);
},TAG:function(_54,_55){
return _55.getElementsByTagName(_54[1]);
}},preFilter:{CLASS:function(_56){
return new RegExp("(?:^|\\s)"+_56[1]+"(?:\\s|$)");
},ID:function(_57){
return _57[1];
},TAG:function(_58){
return _58[1].toUpperCase();
},CHILD:function(_59){
if(_59[1]=="nth"){
var _5a=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(_59[2]=="even"&&"2n"||_59[2]=="odd"&&"2n+1"||!/\D/.test(_59[2])&&"0n+"+_59[2]||_59[2]);
_59[2]=(_5a[1]+(_5a[2]||1))-0;
_59[3]=_5a[3]-0;
}
_59[0]="done"+(_2++);
return _59;
},ATTR:function(_5b){
var _5c=_5b[1];
if(_10.attrMap[_5c]){
_5b[1]=_10.attrMap[_5c];
}
if(_5b[2]==="~="){
_5b[4]=" "+_5b[4]+" ";
}
return _5b;
},PSEUDO:function(_5d){
if(_5d[1]==="not"){
_5d[3]=_5d[3].split(/\s*,\s*/);
}
return _5d;
},POS:function(_5e){
_5e.unshift(true);
return _5e;
}},filters:{enabled:function(_5f){
return _5f.disabled===false&&_5f.type!=="hidden";
},disabled:function(_60){
return _60.disabled===true;
},checked:function(_61){
return _61.checked===true;
},selected:function(_62){
_62.parentNode.selectedIndex;
return _62.selected===true;
},parent:function(_63){
return !!_63.firstChild;
},empty:function(_64){
return !_64.firstChild;
},has:function(_65,i,_67){
return !!_3(_67[3],_65).length;
},header:function(_68){
return /h\d/i.test(_68.nodeName);
},text:function(_69){
return "text"===_69.type;
},radio:function(_6a){
return "radio"===_6a.type;
},checkbox:function(_6b){
return "checkbox"===_6b.type;
},file:function(_6c){
return "file"===_6c.type;
},password:function(_6d){
return "password"===_6d.type;
},submit:function(_6e){
return "submit"===_6e.type;
},image:function(_6f){
return "image"===_6f.type;
},reset:function(_70){
return "reset"===_70.type;
},button:function(_71){
return "button"===_71.type||_71.nodeName.toUpperCase()==="BUTTON";
},input:function(_72){
return /input|select|textarea|button/i.test(_72.nodeName);
}},setFilters:{first:function(_73,i){
return i===0;
},last:function(_75,i,_77,_78){
return i===_78.length-1;
},even:function(_79,i){
return i%2===0;
},odd:function(_7b,i){
return i%2===1;
},lt:function(_7d,i,_7f){
return i<_7f[3]-0;
},gt:function(_80,i,_82){
return i>_82[3]-0;
},nth:function(_83,i,_85){
return _85[3]-0==i;
},eq:function(_86,i,_88){
return _88[3]-0==i;
}},filter:{CHILD:function(_89,_8a){
var _8b=_8a[1],_8c=_89.parentNode;
var _8d=_8a[0];
if(_8c&&!_8c[_8d]){
var _8e=1;
for(var _8f=_8c.firstChild;_8f;_8f=_8f.nextSibling){
if(_8f.nodeType==1){
_8f.nodeIndex=_8e++;
}
}
_8c[_8d]=_8e-1;
}
if(_8b=="first"){
return _89.nodeIndex==1;
}else{
if(_8b=="last"){
return _89.nodeIndex==_8c[_8d];
}else{
if(_8b=="only"){
return _8c[_8d]==1;
}else{
if(_8b=="nth"){
var add=false,_91=_8a[2],_92=_8a[3];
if(_91==1&&_92==0){
return true;
}
if(_91==0){
if(_89.nodeIndex==_92){
add=true;
}
}else{
if((_89.nodeIndex-_92)%_91==0&&(_89.nodeIndex-_92)/_91>=0){
add=true;
}
}
return add;
}
}
}
}
},PSEUDO:function(_93,_94,i,_96){
var _97=_94[1],_98=_10.filters[_97];
if(_98){
return _98(_93,i,_94,_96);
}else{
if(_97==="contains"){
return (_93.textContent||_93.innerText||"").indexOf(_94[3])>=0;
}else{
if(_97==="not"){
var not=_94[3];
for(var i=0,l=not.length;i<l;i++){
if(_3.filter(not[i],[_93]).length>0){
return false;
}
}
return true;
}
}
}
},ID:function(_9b,_9c){
return _9b.nodeType===1&&_9b.getAttribute("id")===_9c;
},TAG:function(_9d,_9e){
return (_9e==="*"&&_9d.nodeType===1)||_9d.nodeName===_9e;
},CLASS:function(_9f,_a0){
return _a0.test(_9f.className);
},ATTR:function(_a1,_a2){
var _a3=_a1[_a2[1]]||_a1.getAttribute(_a2[1]),_a4=_a3+"",_a5=_a2[2],_a6=_a2[4];
return _a3==null?false:_a5==="="?_a4===_a6:_a5==="*="?_a4.indexOf(_a6)>=0:_a5==="~="?(" "+_a4+" ").indexOf(_a6)>=0:!_a2[4]?_a3:_a5==="!="?_a4!=_a6:_a5==="^="?_a4.indexOf(_a6)===0:_a5==="$="?_a4.substr(_a4.length-_a6.length)===_a6:_a5==="|="?_a4===_a6||_a4.substr(0,_a6.length+1)===_a6+"-":false;
},POS:function(_a7,_a8,i,_aa){
var _ab=_a8[2],_ac=_10.setFilters[_ab];
if(_ac){
return _ac(_a7,i,_a8,_aa);
}
}}};
var _17=function(_ad,_ae){
_ad=Array.prototype.slice.call(_ad);
if(_ae){
_ae.push.apply(_ae,_ad);
return _ae;
}
return _ad;
};
try{
Array.prototype.slice.call(document.documentElement.childNodes);
}
catch(e){
_17=function(_af,_b0){
var ret=_b0||[];
if(_af instanceof Array){
Array.prototype.push.apply(ret,_af);
}else{
if(typeof _af.length==="number"){
for(var i=0,l=_af.length;i<l;i++){
ret.push(_af[i]);
}
}else{
for(var i=0;_af[i];i++){
ret.push(_af[i]);
}
}
}
return ret;
};
}
(function(){
var _b4=document.createElement("form"),id="script"+(new Date).getTime();
_b4.innerHTML="<input name='"+id+"'/>";
var _b6=document.documentElement;
_b6.insertBefore(_b4,_b6.firstChild);
if(!!document.getElementById(id)){
_10.find.ID=function(_b7,_b8){
if(_b8.getElementById){
var m=_b8.getElementById(_b7[1]);
return m?m.id===_b7[1]||m.getAttributeNode&&m.getAttributeNode("id").nodeValue===_b7[1]?[m]:undefined:[];
}
};
_10.filter.ID=function(_ba,_bb){
var _bc=_ba.getAttributeNode&&_ba.getAttributeNode("id");
return _ba.nodeType===1&&_bc&&_bc.nodeValue===_bb;
};
}
_b6.removeChild(_b4);
})();
(function(){
var div=document.createElement("div");
div.appendChild(document.createComment(""));
if(div.getElementsByTagName("*").length>0){
_10.find.TAG=function(_be,_bf){
var _c0=_bf.getElementsByTagName(_be[1]);
if(_be[1]==="*"){
var tmp=[];
for(var i=0;_c0[i];i++){
if(_c0[i].nodeType===1){
tmp.push(_c0[i]);
}
}
_c0=tmp;
}
return _c0;
};
}
})();
if(document.querySelectorAll){
(function(){
var _c3=_3;
_3=function(_c4,_c5,_c6){
_c5=_c5||document;
if(_c5.nodeType===9){
try{
return _17(_c5.querySelectorAll(_c4));
}
catch(e){
}
}
return _c3(_c4,_c5,_c6);
};
_3.find=_c3.find;
_3.filter=_c3.filter;
_3.selectors=_c3.selectors;
})();
}
if(document.documentElement.getElementsByClassName){
_10.order.splice(1,0,"CLASS");
_10.find.CLASS=function(_c7,_c8){
return _c8.getElementsByClassName(_c7[1]);
};
}
function _49(dir,cur,_cb,_cc,_cd){
for(var i=0,l=_cc.length;i<l;i++){
var _d0=_cc[i];
if(_d0){
_d0=_d0[dir];
var _d1=false;
while(_d0&&_d0.nodeType){
var _d2=_d0[_cb];
if(_d2){
_d1=_cc[_d2];
break;
}
if(_d0.nodeType===1){
_d0[_cb]=i;
}
if(_d0.nodeName===cur){
_d1=_d0;
break;
}
_d0=_d0[dir];
}
_cc[i]=_d1;
}
}
};
function _47(dir,cur,_d5,_d6,_d7){
for(var i=0,l=_d6.length;i<l;i++){
var _da=_d6[i];
if(_da){
_da=_da[dir];
var _db=false;
while(_da&&_da.nodeType){
if(_da[_d5]){
_db=_d6[_da[_d5]];
break;
}
if(_da.nodeType===1){
_da[_d5]=i;
if(typeof cur!=="string"){
if(_da===cur){
_db=true;
break;
}
}else{
if(_3.filter(cur,[_da]).length>0){
_db=_da;
break;
}
}
}
_da=_da[dir];
}
_d6[i]=_db;
}
}
};
var _1a=document.compareDocumentPosition?function(a,b){
return a.compareDocumentPosition(b)&16;
}:function(a,b){
return a!==b&&a.contains(b);
};
window.MVC.Query=_3;
})();
MVC.Query.descendant=function(_e0,_e1){
return MVC.Query(_e1,_e0);
};
if(!MVC._no_conflict){
Query=MVC.Query;
}
;
include.set_path('jmvc/plugins/dom/position');
include.plugins("dom/element");
include("position");
;
include.set_path('jmvc/plugins/dom/position');
if(document.documentElement["getBoundingClientRect"]){
MVC.Element.offset=function(_1){
if(!_1){
return {top:0,left:0};
}
if(_1==window){
return MVC.Element._offset.window_offset();
}
if(_1===_1.ownerDocument.body){
return MVC.Element._offset.bodyOffset(_1);
}
var _2=_1.getBoundingClientRect(),_3=_1.ownerDocument,_4=_3.body,_5=_3.documentElement,_6=_5.clientTop||_4.clientTop||0,_7=_5.clientLeft||_4.clientLeft||0,_8=_2.top+(self.pageYOffset||MVC.Element._offset.box_model&&_5.scrollTop||_4.scrollTop)-_6,_9=_2.left+(self.pageXOffset||MVC.Element._offset.box_model&&_5.scrollLeft||_4.scrollLeft)-_7;
return new MVC.Vector(_9,_8);
};
}else{
MVC.Element.offset=function(_a){
if(!_a){
return {top:0,left:0};
}
if(_a==window){
return MVC.Element._offset.window_offset();
}
if(_a===_a.ownerDocument.body){
return MVC.Element._offset.bodyOffset(_a);
}
MVC.Element._offset.initialized||MVC.Element._offset.initialize();
var _b=_a,_c=_b.offsetParent,_d=_b,_e=_b.ownerDocument,_f,_10=_e.documentElement,_11=_e.body,_12=_e.defaultView,_13=_12.getComputedStyle(_b,null),top=_b.offsetTop,_15=_b.offsetLeft;
while((_b=_b.parentNode)&&_b!==_11&&_b!==_10&&_b!==_e){
_f=_12.getComputedStyle(_b,null);
top-=_b.scrollTop;
_15-=_b.scrollLeft;
if(_b===_c){
top+=_b.offsetTop;
_15+=_b.offsetLeft;
if(MVC.Element._offset.doesNotAddBorder&&!(MVC.Element._offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(_b.tagName))){
top+=parseInt(_f.borderTopWidth,10)||0;
}
_15+=parseInt(_f.borderLeftWidth,10)||0;
_d=_c;
_c=_b.offsetParent;
}
if(MVC.Element._offset.subtractsBorderForOverflowNotVisible&&_f.overflow!=="visible"){
top+=parseInt(_f.borderTopWidth,10)||0;
}
_15+=parseInt(_f.borderLeftWidth,10)||0;
_13=_f;
}
if(_13.position==="relative"||_13.position==="static"){
top+=_11.offsetTop;
_15+=_11.offsetLeft;
}
if(_13.position==="fixed"){
top+=Math.max(_10.scrollTop,_11.scrollTop);
_15+=Math.max(_10.scrollLeft,_11.scrollLeft);
}
return new MVC.Vector(_15,top);
};
}
MVC.Element._offset={initialize:function(){
if(this.initialized){
return;
}
var _16=document.body,_17=document.createElement("div"),_18,_19,_1a,_1b,_1c,_1d=_16.style.marginTop,_1e="<div style=\"position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;\"><div></div></div><table style=\"position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;\"cellpadding=\"0\"cellspacing=\"0\"><tr><td></td></tr></table>";
_1b={position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"};
for(_1c in _1b){
_17.style[_1c]=_1b[_1c];
}
_17.innerHTML=_1e;
_16.insertBefore(_17,_16.firstChild);
_18=_17.firstChild;
_19=_18.firstChild;
td=_18.nextSibling.firstChild.firstChild;
this.doesNotAddBorder=(_19.offsetTop!==5);
this.doesAddBorderForTableAndCells=(td.offsetTop===5);
_18.style.overflow="hidden";
_18.style.position="relative";
this.subtractsBorderForOverflowNotVisible=(_19.offsetTop===-5);
_16.style.marginTop="1px";
this.doesNotIncludeMarginInBodyOffset=(_16.offsetTop===0);
_16.style.marginTop=_1d;
_16.removeChild(_17);
this.initialized=true;
},bodyOffset:function(_1f){
MVC.Element._offset.initialized||MVC.Element._offset.initialize();
var top=_1f.offsetTop,_21=_1f.offsetLeft;
if(MVC.Element._offset.doesNotIncludeMarginInBodyOffset){
top+=parseInt(MVC.Element.get_style(_1f,"marginTop"),10)||0;
}
_21+=parseInt(MVC.Element.get_style(_1f,"marginLeft"),10)||0;
return new MVC.Vector(_21,top);
},box_model:!MVC.Browser.IE||document.compatMode=="CSS1Compat",window_offset:function(){
return new MVC.Vector(window.pageXOffset?window.pageXOffset:document.documentElement.scrollLeft,window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop);
}};
MVC.Object.extend(MVC.Element,{within:function(_22,x,y,_25){
if(_22==document.documentElement){
return true;
}
var _26=_25?MVC.Dom.data(_22,"offset")||MVC.Dom.data(_22,"offset",MVC.Element.offset(_22)):MVC.Element.offset(_22);
if(_22==document.documentElement){
return true;
}
var res=this._within_box(x,y,_26[0],_26[1],_22.offsetWidth,_22.offsetHeight);
return res;
},within_box:function(_28,_29,top,_2b,_2c,_2d){
var _2e=_2d?MVC.Dom.data(_28,"offset")||MVC.Dom.data(_28,"offset",MVC.Element.offset(_28)):MVC.Element.offset(_28);
var ew=_28.clientWidth,eh=_28.clientHeight;
return !((_2e.y()>top+_2c)||(_2e.y()+eh<top)||(_2e.x()>_29+_2b)||(_2e.x()+ew<_29));
},_within_box:function(x,y,_33,top,_35,_36){
return (y>=top&&y<top+_36&&x>=_33&&x<_33+_35);
},event_position_relative_to_element:function(_37,_38,_39){
var _3a=_39?MVC.Dom.data(_37,"offset")||MVC.Dom.data(_37,"offset",MVC.Element.offset(_37)):MVC.Element.offset(_37);
var _3b=MVC.Event.pointer(_38);
var _3c=_3b.x();
var _3d=_3b.y();
return new MVC.Vector(_3c-_3a[0],_3d-_3a[1]);
},window_dimensions:function(){
var de=document.documentElement,st=window.pageYOffset?window.pageYOffset:de.scrollTop,sl=window.pageXOffset?window.pageXOffset:de.scrollLeft;
var wh=window.innerHeight?window.innerHeight:de.clientHeight,ww=window.innerWidth?window.innerWidth:de.clientWidth;
if(wh==0){
wh=document.body.clientHeight;
ww=document.body.clientWidth;
}
return {window_height:wh,window_width:ww,document_height:MVC.Browser.IE?document.body.offsetHeight:de.offsetHeight,document_width:MVC.Browser.IE?document.body.offsetWidth:de.offsetWidth,scroll_left:sl,scroll_top:st,scroll_height:document.documentElement.scrollHeight,scroll_width:document.documentElement.scrollWidth,window_right:sl+ww,window_bottom:st+wh};
},compare:function(a,b){
if(a.compareDocumentPosition){
return a.compareDocumentPosition(b);
}else{
if(a.contains){
}
}
var _45=(a!=b&&a.contains(b)&&16)+(a!=b&&b.contains(a)&&8);
if(a.sourceIndex){
_45+=(a.sourceIndex<b.sourceIndex&&4);
_45+=(a.sourceIndex>b.sourceIndex&&2);
}else{
range=document.createRange();
range.selectNode(a);
sourceRange=document.createRange();
sourceRange.selectNode(b);
compare=range.compareBoundaryPoints(Range.START_TO_START,sourceRange);
_45+=(compare==-1&&4);
_45+=(compare==1&&2);
}
return _45;
}});
;
include.set_path('jmvc/plugins/dom/animate');
include.plugins("dom/element","lang/timer");
include("animate");
;
include.set_path('jmvc/plugins/lang/timer');
MVC.Timer=function(_1){
_1=_1||{};
this.time=_1.time||500;
this.from=_1.from||0;
this.to=_1.to||1;
this.interval=_1.interval||1;
this.update_callback=_1.onUpdate||function(){
};
this.complete_callback=_1.onComplete||function(){
};
this.distance=this.to-this.from;
if(_1.easing){
this.easing=typeof _1.easing=="string"?MVC.Timer.Easings[_1.easing]:_1.easing;
}else{
this.easing=MVC.Timer.Easings.swing;
}
};
MVC.Timer.prototype={start:function(){
this.start_time=new Date();
this.timer=setInterval(MVC.Function.bind(this.next_step,this),this.interval);
},kill:function(){
clearInterval(this.timer);
},next_step:function(){
var _2=new Date();
var _3=_2-this.start_time;
var _4;
if(_3>=this.time){
_4=this.to;
this.update_callback(_4);
this.complete_callback(_4);
this.kill();
}else{
var _5=_3/this.time;
_4=this.easing(_5,_3,this.from,this.distance);
this.update_callback(_4);
}
}};
MVC.Timer.Easings={linear:function(p,n,_8,_9){
return _8+_9*p;
},swing:function(p,n,_c,_d){
return ((-Math.cos(p*Math.PI)/2)+0.5)*_d+_c;
}};
;
include.set_path('jmvc/plugins/dom/animate');
MVC.Animate=function(_1,_2,_3,_4,_5){
_1=MVC.$E(_1);
_5=_5||function(){
};
var _6={};
var _7;
for(var _8 in _2){
_7=_2[_8];
_6[_8]=new MVC.Animate.Value(_1,_8,_7);
}
this.timer=new MVC.Timer({from:0,to:1,time:_3,onUpdate:function(_9){
for(var _a in _6){
_1.style[_a]=_6[_a].get(_9);
}
},onComplete:function(){
for(var _b in _6){
_1.style[_b]=_6[_b].last();
}
_5(_1);
}});
this.timer.start();
};
MVC.Animate.is_color=function(_c){
var _d;
if((_d=_c.toString().match(/#(\w\w)(\w\w)(\w\w)/))){
return new MVC.Vector(parseInt(_d[1],16),parseInt(_d[2],16),parseInt(_d[3],16));
}else{
if((_d=_c.toString().match(/rgb\(\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*\)/i))){
return new MVC.Vector(parseInt(_d[1],10),parseInt(_d[2],10),parseInt(_d[3],10));
}
}
return null;
};
MVC.Animate.get_vector=function(_e){
var _f=MVC.Animate.is_color(_e);
return _f?_f:new MVC.Vector(parseFloat(_e)||0);
};
MVC.Animate.exclude=/z-?index|font-?weight|opacity|zoom|line-?height/i;
MVC.Animate.Value=function(_10,_11,end){
this.style=_11;
this.start_style=MVC.Element.get_style(_10,_11);
this.vector_start=MVC.Animate.is_color(this.start_style);
this.start=parseFloat(this.start_style)||0;
var _13=end.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/);
if(_13){
this.end=parseFloat(_13[2]);
this.unit=_13[3]||(MVC.Animate.exclude.test(_11)?"":"px");
if(this.unit!="px"){
_10.style[_11]=(end||1)+this.unit;
this.start=((end||1)/MVC.Element.get_style(_10,_11))*this.start;
_10.style[_11]=this.start+this.unit;
}
if(_13[1]){
this.end=((_13[1]=="-="?-1:1)*this.end)+this.start;
}
}else{
this.vector_end=MVC.Animate.is_color(end);
this.end=end;
this.unit=MVC.Animate.exclude.test(_11)?"":"px";
}
if(this.vector_start){
this.vector_distance=this.vector_end.minus(this.vector_start);
}
this.distance=this.end-this.start;
};
MVC.Animate.Value.prototype={get:function(_14){
if(this.vector_start){
var nv=this.vector_start.plus(this.vector_distance.app(function(d){
return _14*d;
}));
return "rgb("+parseInt(nv[0])+","+parseInt(nv[1])+","+parseInt(nv[2])+")";
}else{
return (this.start+_14*this.distance)+this.unit;
}
},last:function(){
return this.vector_start?"rgb("+parseInt(this.vector_end[0])+","+parseInt(this.vector_end[1])+","+parseInt(this.vector_end[2])+")":(this.end)+this.unit;
}};
;
include.set_path('jmvc/plugins/controller/dragdrop');
MVC.Controller.Action.Drag=MVC.Controller.Action.Event.extend({match:new RegExp("(.*?)\\s?(dragstart|dragend|dragging)$"),mousemove:function(_1){
if(!MVC.Draggable.current){
return;
}
var _2=MVC.Draggable.current;
var _3=MVC.Event.pointer(_1);
if(_2._start_position&&_2._start_position.equals(_3)){
return;
}
MVC.Delegator.add_kill_event(_1);
_1.kill();
MVC.Draggable.current.draw(_3,_1);
return false;
},mouseup:function(_4){
MVC.Delegator.add_kill_event(_4);
if(MVC.Draggable.current&&MVC.Draggable.current.moved){
MVC.Draggable.current.end(_4);
MVC.Droppables.clear();
}
MVC.Draggable.current=null;
MVC.Event.observe(document,"mousemove",MVC.Controller.Action.Drag.mousemove);
MVC.Event.observe(document,"mouseup",MVC.Controller.Action.Drag.mouseup);
}},{init:function(_5,_6,_7,_8){
this.action=_5;
this.callback=_6;
this.className=_7;
this.element=_8;
this.css_and_event();
var _9=this.selector();
var _a=MVC.Delegator.jmvc(this.element);
if(!_a.custom){
_a.custom={};
}
if(!_a.custom.drag){
_a.custom.drag={};
}
var _b=_a.custom.drag;
if(_b[_9]){
_b[_9].callbacks[this.event_type]=_6;
return;
}
_b[_9]=new MVC.Delegator(_9,"mousedown",MVC.Function.bind(this.mousedown,this,_8),_8);
_b[_9].callbacks={};
_b[_9].callbacks[this.event_type]=_6;
},mousedown:function(_c,_d){
var _e=_d.event.which==1;
var _f=MVC.Delegator.jmvc(_c);
if(_f.responding==false||!_e){
return;
}
var _10=_f.custom.drag;
MVC.Object.extend(_d,_10[this.selector()].callbacks);
if(MVC.Draggable.current){
return;
}
MVC.Draggable.current=new MVC.Draggable(_d);
_d.event.prevent_default();
MVC.Event.observe(document,"mousemove",MVC.Controller.Action.Drag.mousemove);
MVC.Event.observe(document,"mouseup",MVC.Controller.Action.Drag.mouseup);
return false;
}});
MVC.Draggable=function(_11){
this.element=_11.element;
this.moved=false;
this._cancelled=false;
this._start_position=MVC.Event.pointer(_11.event);
this._compile=true;
this.mouse_position_on_element=MVC.Event.pointer(_11.event).minus(MVC.Element.offset(_11.element));
this.dragstart=_11.dragstart||MVC.Draggable.k;
this.dragend=_11.dragend||MVC.Draggable.k;
this.dragging=_11.dragging||MVC.Draggable.k;
this.scroll_window=true;
};
MVC.Draggable.k=function(){
};
MVC.Draggable.prototype={start:function(_12){
this._start_position=null;
this.moved=true;
this.drag_element=this.element;
var _13=new MVC.Controller.Params.Drag({event:_12,element:this.element,drag_element:this.drag_element,drag_action:this});
this.dragstart(_13);
if(this._cancelled==true){
return;
}
this.drag_element=_13.drag_element;
MVC.Element.make_positioned(this.drag_element);
if(this.drag_element!=this.element){
this.start_position=MVC.Element.offset(this.drag_element);
}else{
this.start_position=this.currentDelta();
}
this.drag_element.style.zIndex=1000;
if(this._compile){
MVC.Droppables.compile();
}
},currentDelta:function(){
return new MVC.Vector(parseInt(MVC.Element.get_style(this.drag_element,"left")||"0"),parseInt(MVC.Element.get_style(this.drag_element,"top")||"0"));
},draw:function(_14,_15){
if(!this.moved){
this.start(_15);
}
if(this._cancelled){
return;
}
this.current_position=MVC.Element.offset(this.drag_element);
var pos=this.current_position.minus(this.currentDelta());
var p=_14.minus(pos).minus(this.mouse_position_on_element);
var s=this.drag_element.style;
var _19=new MVC.Controller.Params.Drag({event:_15,element:this.element,drag_action:this,drag_element:this.drag_element,_position:p});
this.dragging(_19);
if(!this._horizontal){
s.top=_19._position.top()+"px";
}
if(!this._vertical){
s.left=_19._position.left()+"px";
}
MVC.Droppables.show(_14,this,_15);
},end:function(_1a){
MVC.Droppables.fire(_1a,this);
var _1b={element:this.element,event:_1a,drag_element:this.drag_element,drag_action:this};
this.dragend(new MVC.Controller.Params.Drag(_1b));
if(this._revert){
new MVC.Animate(this.drag_element,{top:this.start_position.top(),left:this.start_position.left()},null,null,MVC.Function.bind(this.cleanup,this));
}else{
if(this.ghosted_element&&this.element.parentNode){
MVC.Element.remove(this.element);
}
if(this.drag_element!=this.element){
this.drag_element.style.display="none";
}
}
},cleanup:function(){
if(this.drag_element!=this.element){
this.drag_element.style.display="none";
}
}};
MVC.Draggable.selectors={};
MVC.Draggable.current=null;
MVC.Controller.Params.Drag=MVC.Controller.Params;
MVC.Controller.Params.Drag.prototype=new MVC.Controller.Params();
MVC.Object.extend(MVC.Controller.Params.Drag.prototype,{cancel_drag:function(){
this.drag_action._cancelled=true;
this.drag_action.end(this.event);
MVC.Droppables.clear();
MVC.Draggable.current=null;
},ghost:function(_1c){
var _1d=this.element.cloneNode(true);
MVC.Element.insert(this.element,{after:_1d});
this.drag_element=_1d;
},representitive:function(_1e,_1f,_20){
this._offsetX=_1f||0;
this._offsetY=_20||0;
var p=MVC.Event.pointer(this.event);
this.drag_element=MVC.$E(_1e);
var s=this.drag_element.style;
s.top=(p.top()-_20)+"px";
s.left=(p.left()-_1f)+"px";
s.display="";
this.drag_action.mouse_position_on_element=new MVC.Vector(_1f,_20);
},revert:function(){
this.drag_action._revert=true;
},vertical:function(){
this.drag_action._vertical=true;
},horizontal:function(){
this.drag_action._horizontal=true;
},position:function(_23){
if(_23){
this._position=_23;
}
return this._position;
},scrolls:function(_24){
for(var i=0;i<_24.length;i++){
MVC.Droppables.add(_24[i],new MVC.Scrollable(_24[i]));
}
},drag_only:function(){
this.drag_action._compile=false;
}});
;
include.set_path('jmvc/plugins/controller/dragdrop');
MVC.Controller.Action.Drop=MVC.Controller.Action.Event.extend({match:new RegExp("(.*?)\\s?(dropover|dropped|dropout|dropadd|dropmove)$")},{init:function(_1,_2,_3,_4){
this.action=_1;
this.callback=_2;
this.className=_3;
this.element=_4;
this.css_and_event();
var _5=this.selector();
if(!MVC.Droppables.selectors[_5]){
MVC.Droppables.selectors[_5]={};
}
MVC.Droppables.selectors[_5][this.event_type]=_2;
}});
MVC.Controller.Params.Drop=MVC.Controller.Params;
MVC.Controller.Params.Drop.prototype=new MVC.Controller.Params();
MVC.Object.extend(MVC.Controller.Params.Drop.prototype,{cache_position:function(_6){
this._cache=_6!=null?_6:true;
},cancel:function(){
this._cancel=true;
}});
MVC.Droppables=MVC.Class.extend("drop",{drops:[],selectors:{},add:function(_7,_8){
_7=MVC.$E(_7);
_8.element=_7;
var _9=_8;
if(_9.dropadd){
_9.dropadd(_9);
}
if(!_9._canceled){
MVC.Element.make_positioned(_7);
this.drops.push(_9);
}
},findDeepestChild:function(_a){
if(_a.length==0){
return null;
}
var _b=_a[0];
for(i=1;i<_a.length;++i){
if(MVC.Element.has(_b.element,_a[i].element)){
_b=_a[i];
}
}
return _b;
},isAffected:function(_c,_d,_e){
return ((_e.element!=_d)&&MVC.Element.within(_e.element,_c[0],_c[1],_e._cache));
},deactivate:function(_f,_10,_11){
this.last_active=null;
if(_f.dropout){
_f.dropout({element:_f.element,drag:_10,event:_11});
}
},activate:function(_12,_13,_14){
this.last_active=_12;
if(_12.dropover){
_12.dropover({element:_12.element,drag:_13,event:_14});
}
},dropmove:function(_15,_16,_17){
if(_15.dropmove){
_15.dropmove({element:_15.element,drag:_16,event:_17,position:_15.position_on_element});
}
},show:function(_18,_19,_1a){
var _1b=_19.drag_element;
if(!this.drops.length){
return;
}
var _1c,_1d=[],_1e;
for(var d=0;d<this.drops.length;d++){
if((_1e=MVC.Droppables.isAffected(_18,_1b,this.drops[d]))){
this.drops[d].position_on_element=_1e;
_1d.push(this.drops[d]);
}
}
_1c=MVC.Droppables.findDeepestChild(_1d);
if(this.last_active&&this.last_active!=_1c){
this.deactivate(this.last_active,_19,_1a);
}
if(_1c&&_1c!=this.last_active){
this.activate(_1c,_19,_1a);
}
for(var i=0;i<_1d.length;i++){
this.dropmove(_1d[i],_19,_1a);
}
},fire:function(_21,_22){
if(!this.last_active){
return;
}
if(this.isAffected(MVC.Event.pointer(_21),_22.drag_element,this.last_active)&&this.last_active.dropped){
this.last_active.dropped({drag:_22,event:_21,element:this.last_active.element});
return true;
}
},compile:function(){
for(var _23 in MVC.Droppables.selectors){
var _24=MVC.Query(_23);
for(var e=0;e<_24.length;e++){
MVC.Dom.remove_data(_24[e],"offset");
MVC.Droppables.add(_24[e],new MVC.Controller.Params.Drop(MVC.Droppables.selectors[_23]));
}
}
},clear:function(){
this.drops=[];
}},{});
;
include.set_path('jmvc/plugins/controller/stateful');
include.plugins("controller");
include("stateful_controller");
;
include.set_path('jmvc/plugins/controller/stateful');
MVC.Controller.Stateful=MVC.Controller.extend({_should_attach_actions:false,_events:null,_element:null},{init:function(_1){
MVC.Delegator.jmvc(_1);
this._actions=[];
for(var _2 in this){
val=this[_2];
if(typeof val=="function"&&_2!="Class"){
for(var a=0;a<MVC.Controller.actions.length;a++){
act=MVC.Controller.actions[a];
if(act.matches(_2)){
var _4=this.dispatch_closure(_2);
this._actions.push(new act(_2,_4,this.Class.className,_1));
}
}
}
}
this._children=[];
this.action_name="init";
this.element=_1;
},destroy:function(){
if(this._destroyed){
throw this.Class.className+" controller instance has already been deleted";
}
for(var i=0;i<this._actions.length;i++){
this._actions[i].destroy();
}
var _6=MVC.Dom.data(this.element).delegation_events;
if(this.element&&_6){
for(var _7 in _6){
var _8=_6[_7];
for(var i=0;i<_8.length;i++){
_8[i].destroy();
}
}
}
if(this._parent){
this._parent.remove(this);
}
if(this.element&&this.element.parentNode){
this.element.parentNode.removeChild(this.element);
}
this._destroyed=true;
},dispatch_closure:function(_9){
return MVC.Function.bind(function(_a){
if(!MVC.Dom.data(this.element).responding){
return;
}
_a=_a||{};
_a.action=_9;
_a.controller=this.Class;
_a=_a.constructor==MVC.Controller.Params?_a:new MVC.Controller.Params(_a);
this.action_name=_9;
return this[_9](_a);
},this);
},query:function(_b){
return MVC.Query.descendant(this.element,_b);
},respond:function(_c){
MVC.Dom.data(this.element).responding=_c;
},add_child:function(_d){
_d._parent=this;
this._children.push(_d);
return _d;
},remove_child:function(_e){
for(var i=0;i<this._children.length;i++){
if(this._children[i]===_e){
this._children[i].splice(i,1);
break;
}
}
}});
;
include.set_path('jmvc/plugins/controller/hover');
include.plugins("controller","lang/vector","dom/element");
include("hover");
;
include.set_path('jmvc/plugins/controller/hover');
MVC.Controller.Action.EnterLeave=MVC.Controller.Action.Event.extend({match:new RegExp("(.*?)\\s?(mouseenter|mouseleave)$")},{init:function(_1,_2,_3,_4){
this.action=_1;
this.callback=_2;
this.className=_3;
this.element=_4;
this.css_and_event();
var _5=this.selector();
this[this.event_type]();
},mouseenter:function(){
new MVC.Delegator(this.selector(),"mouseover",MVC.Function.bind(function(_6){
var _7=_6.event.relatedTarget;
if(_6.element==_7||MVC.$E(_6.element).has(_7)){
return true;
}
this.callback(_6);
},this));
},mouseleave:function(){
new MVC.Delegator(this.selector(),"mouseout",MVC.Function.bind(function(_8){
var _9=_8.event.relatedTarget;
if(_8.element==_9||MVC.$E(_8.element).has(_9)){
return true;
}
this.callback(_8);
},this));
}});
MVC.Controller.Action.Hover=MVC.Controller.Action.Event.extend({match:new RegExp("(.*?)\\s?(hoverenter|hoverleave|hovermove)$"),sensitivity:4,interval:110,hovers:{}},{init:function(_a,_b,_c,_d){
this.action=_a;
this.callback=_b;
this.className=_c;
this.element=_d;
this.css_and_event();
var _e=this.selector();
var _f=MVC.Dom.data(_d);
if(!_f.custom){
_f.custom={};
}
if(!_f.custom.hovers){
_f.custom.hovers={};
}
if(!_f.custom.hovers[this.selector()]){
_f.custom.hovers[this.selector()]={};
new MVC.Delegator(this.selector(),"mouseover",MVC.Function.bind(this.mouseover,this),_d);
new MVC.Delegator(this.selector(),"mouseout",MVC.Function.bind(this.mouseout,this),_d);
}
_f.custom.hovers[this.selector()][this.event_type]=this;
},hoverenter:function(_10){
var _11=MVC.Dom.data(_10.delegate).custom.hovers[this.selector()]["hoverenter"];
if(_11){
_11.callback(_10);
}
},hoverleave:function(_12){
var _13=MVC.Dom.data(_12.delegate).custom.hovers[this.selector()]["hoverleave"];
if(_13){
_13.callback(_12);
}
},hovermove:function(_14){
var _15=MVC.Dom.data(_14.delegate).custom.hovers[this.selector()]["hovermove"];
if(_15){
_15.callback(_14);
}
},check:function(){
this.called=true;
this.hoverenter({element:this.save_element,event:this.mousemove_event,delegate:this.delegate});
MVC.Event.stop_observing(this.save_element,"mousemove",this.mousemove);
},mouseover:function(_16){
var _17=_16.event.relatedTarget;
if(_16.element==_17||MVC.$E(_16.element).has(_17)){
return true;
}
this.called=false;
this.starting_position=MVC.Event.pointer(_16.event);
this.save_element=_16.element;
this.delegate=_16.delegate;
this.mousemove_event=_16.event;
this.mousemove_function=MVC.Function.bind(this.mousemove,this);
MVC.Event.observe(_16.element,"mousemove",this.mousemove_function);
this.timer=setTimeout(MVC.Function.bind(this.check,this),this.Class.interval);
},mousemove:function(_18){
if(this.called){
this.hovermove({element:this.save_element,event:_18,delegate:this.delegate});
}else{
clearTimeout(this.timer);
this.mousemove_event=_18;
this.current_position=MVC.Event.pointer(_18);
this.timer=setTimeout(MVC.Function.bind(this.check,this),this.Class.interval);
}
},mouseout:function(_19){
var _1a=_19.event.relatedTarget;
if(_19.element==_1a||MVC.$E(_19.element).has(_1a)){
return true;
}
clearTimeout(this.timer);
MVC.Event.stop_observing(_19.element,"mousemove",this.mousemove_function);
if(this.called){
this.hoverleave({element:this.save_element,event:_19.event,delegate:_19.delegate});
}
}});
;
include.set_path('jmvc/plugins/controller/lasso');
include.plugins("controller","dom/element","dom/query","dom/position");
include("lasso","selectable");
;
include.set_path('jmvc/plugins/controller/lasso');
MVC.Controller.Action.Lasso=MVC.Controller.Action.Event.extend({match:new RegExp("(.*?)\\s?(lassostart|lassoend|lassomove)$"),mousemove:function(_1){
if(!MVC.Lasso.current){
return;
}
var _2=MVC.Lasso.current;
var _3=MVC.Event.pointer(_1);
if(_2._start_position&&_2._start_position.equals(_3)){
return;
}
MVC.Delegator.add_kill_event(_1);
_1.kill();
MVC.Lasso.current.draw(_3,_1);
return false;
},mouseup:function(_4){
MVC.Delegator.add_kill_event(_4);
if(MVC.Lasso.current&&MVC.Lasso.current.moved){
MVC.Lasso.current.end(_4);
MVC.Droppables.clear();
}
MVC.Lasso.current=null;
MVC.Event.observe(document,"mousemove",MVC.Controller.Action.Lasso.mousemove);
MVC.Event.observe(document,"mouseup",MVC.Controller.Action.Lasso.mouseup);
}},{init:function(_5,_6,_7,_8){
this.action=_5;
this.callback=_6;
this.className=_7;
this.element=_8;
this.css_and_event();
var _9=this.selector();
var _a=MVC.Delegator.jmvc(this.element);
if(!_a.custom){
_a.custom={};
}
if(!_a.custom.lasso){
_a.custom.lasso={};
}
var _b=_a.custom.lasso;
if(_b[_9]){
_b[_9].callbacks[this.event_type]=_6;
return;
}
_b[_9]=new MVC.Delegator(_9,"mousedown",MVC.Function.bind(this.mousedown,this,_8),_8);
_b[_9].callbacks={};
_b[_9].callbacks[this.event_type]=_6;
},mousedown:function(_c,_d){
var _e=MVC.Delegator.jmvc(_c);
if(_e.responding==false){
return;
}
var _f=_e.custom.lasso;
MVC.Object.extend(_d,_f[this.selector()].callbacks);
MVC.Lasso.current=new MVC.Lasso(_d);
_d.event.prevent_default();
MVC.Event.observe(document,"mousemove",MVC.Controller.Action.Lasso.mousemove);
MVC.Event.observe(document,"mouseup",MVC.Controller.Action.Lasso.mouseup);
return false;
}});
MVC.Lasso=function(_10){
this.element=_10.element;
this.moved=false;
this._cancelled=false;
this.lassostart=_10.lassostart||MVC.Lasso.k;
this.lassoend=_10.lassoend||MVC.Lasso.k;
this.lassomove=_10.lassomove||MVC.Lasso.k;
};
MVC.Lasso.k=function(){
};
MVC.Lasso.prototype={style_element:function(){
var s=this.lasso_element.style;
s.position="absolute";
s.border="dotted 1px Gray";
s.zIndex=1000;
},position_lasso:function(_12){
var _13=MVC.Event.pointer(_12);
this.top=_13.top()<this.start_position.top()?_13.top():this.start_position.top();
this.left=_13.left()<this.start_position.left()?_13.left():this.start_position.left();
this.height=Math.abs(_13.top()-this.start_position.top());
this.width=Math.abs(_13.left()-this.start_position.left());
var s=this.lasso_element.style;
s.top=this.top+"px";
s.left=this.left+"px";
s.width=this.width+"px";
s.height=this.height+"px";
},start:function(_15){
this.moved=true;
this.lasso_element=document.createElement("div");
document.body.appendChild(this.lasso_element);
this.style_element();
MVC.Element.make_positioned(this.lasso_element);
this.start_position=MVC.Event.pointer(_15);
var _16={event:_15,element:this.element,lasso_element:this.lasso_element,lasso_action:this};
this.lassostart(_16);
MVC.Selectables.compile();
},currentDelta:function(){
return new MVC.Vector(parseInt(MVC.Element.get_style(this.lasso_element,"left")||"0"),parseInt(MVC.Element.get_style(this.lasso_element,"top")||"0"));
},draw:function(_17,_18){
if(!this.moved){
this.start(_18);
}
if(this._cancelled){
return;
}
this.position_lasso(_18);
var _19={event:_18,element:this.element,lasso_action:this,lasso_element:this.lasso_element};
this.lassomove(_19);
MVC.Selectables.show(_17,this,_18);
},end:function(_1a){
var _1b={element:this.element,event:_1a,lasso_element:this.lasso_element,lasso_action:this};
this.lassoend(_1b);
document.body.removeChild(this.lasso_element);
},cleanup:function(){
if(this.drag_element!=this.element){
this.drag_element.style.display="none";
}
},contains:function(_1c){
return MVC.Element.within_box(_1c.element,this.left,this.top,this.width,this.height,_1c);
}};
MVC.Lasso.selectors={};
MVC.Lasso.current=null;
MVC.Event.observe(document,"mousemove",function(_1d){
if(!MVC.Lasso.current){
return;
}
MVC.Delegator.add_kill_event(_1d);
_1d.kill();
MVC.Lasso.current.draw(MVC.Event.pointer(_1d),_1d);
return false;
});
MVC.Event.observe(document,"mouseup",function(_1e){
MVC.Delegator.add_kill_event(_1e);
if(MVC.Lasso.current&&MVC.Lasso.current.moved){
MVC.Lasso.current.end(_1e);
MVC.Selectables.fire(_1e,MVC.Lasso.current);
MVC.Selectables.clear();
}
MVC.Lasso.current=null;
});
;
include.set_path('jmvc/plugins/controller/lasso');
MVC.Controller.Action.Selectable=MVC.Controller.Action.Event.extend({match:new RegExp("(.*?)\\s?(selectover|selected|selectout|selectadd|selectmove)$")},{init:function(_1,_2,_3,_4){
this.action=_1;
this.callback=_2;
this.className=_3;
this.element=_4;
this.css_and_event();
var _5=this.selector();
if(!MVC.Selectables.selectors[_5]){
MVC.Selectables.selectors[_5]={};
}
MVC.Selectables.selectors[_5][this.event_type]=_2;
}});
MVC.Selectable=MVC.Controller.Params;
MVC.Selectable.prototype=new MVC.Controller.Params();
MVC.Object.extend(MVC.Selectable.prototype,{cache_position:function(){
this._cache=true;
},cancel:function(){
this._cancel=true;
}});
MVC.Selectables={selectables:[],selectors:{},add:function(_6,_7){
_6=MVC.$E(_6);
_7=MVC.Object.extend({selectover:MVC.Lasso.k,selected:MVC.Lasso.k,selectout:MVC.Lasso.k,selectadd:MVC.Lasso.k,selectmove:MVC.Lasso.k},_7);
_7.element=_6;
_7._is_selected=false;
var _8=new MVC.Selectable(_7);
if(_8.selectadd){
_8.selectadd(_8);
}
if(!_8._canceled){
MVC.Element.make_positioned(_6);
this.selectables.push(_8);
}
},findDeepestChild:function(_9){
if(_9.length==0){
return null;
}
var _a=_9[0];
for(i=1;i<_9.length;++i){
if(MVC.Element.has(_9[i].element,_a.element)){
_a=_9[i];
}
}
return _a;
},isAffected:function(_b,_c){
return (_b.contains(_c));
},deactivate:function(_d,_e,_f){
this.last_active=null;
if(_d.dropout){
_d.dropout({element:_d.element,drag:_e,event:_f});
}
},activate:function(_10,_11,_12){
this.last_active=_10;
if(_10.dropover){
_10.dropover({element:_10.element,drag:_11,event:_12});
}
},dropmove:function(_13,_14,_15){
if(_13.dropmove){
_13.dropmove({element:_13.element,drag:_14,event:_15});
}
},show:function(_16,_17,_18){
if(!this.selectables.length){
return;
}
var _19,_1a=[];
for(var d=0;d<this.selectables.length;d++){
var _1c=this.selectables[d];
var ef=MVC.Selectables.isAffected(_17,this.selectables[d]);
if(ef&&!_1c._is_selected){
_1c.selectover({element:_1c.element});
_1c._is_selected=true;
}
if(ef){
_1c.selectmove({element:_1c.element});
}
if(!ef&&_1c._is_selected){
_1c._is_selected=false;
_1c.selectout({element:_1c.element});
}
}
},fire:function(_1e,_1f){
for(var d=0;d<this.selectables.length;d++){
var _21=this.selectables[d];
var ef=MVC.Selectables.isAffected(_1f,this.selectables[d]);
if(ef){
_21.selected({element:_21.element,event:_1e});
}
}
},compile:function(){
var _23=[];
for(var _24 in MVC.Selectables.selectors){
var _25=_23.concat(MVC.Query(_24));
for(var e=0;e<_25.length;e++){
MVC.Selectables.add(_25[e],MVC.Selectables.selectors[_24]);
}
}
},clear:function(){
this.selectables=[];
}};
;
include.set_path('jmvc/plugins/io/jsonp');
include.plugins("lang");
include("jsonp");
;
include.set_path('jmvc/plugins/io/jsonp');
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
if(MVC.String.include(_11.src.toLowerCase(),this.url.toLowerCase())){
_11.parentNode.removeChild(_11);
}
}
}};
MVC.JsonP._cbs={};
MVC.IO.JsonP=MVC.JsonP;
;
include.set_path('jmvc/plugins/io/window_name');
include.plugins("lang");
include("window_name");
;
include.set_path('jmvc/plugins/io/window_name');
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
if(this.state<2){
this.get_data();
}
},send:function(){
this.domain=window.location.protocol+"//"+window.location.hostname;
this.domain_page=this.domain+"/blank.html"+"#"+this.frameNum;
this.frameName=this.domain_page;
this.frame_container=document.body;
this.doc=document;
if(MVC.Browser.Gecko&&![].reduce){
this.protectFF2();
}
var _5=this.frame=document.createElement(MVC.Browser.IE?"<iframe name=\""+this.frameName+"\" onload=\"MVC.WindowName["+this.frameNum+"]()\">":"iframe");
MVC.WindowName.styleFrame(this.frame);
this.outerFrame=this.outerFrame||this.frame;
this.outerFrame.style.display="none";
this.state=0;
var _6=this;
MVC.WindowName[this.frameNum]=this.frame.onload=MVC.Function.bind(this.onload,this);
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
var _a=this.doc.createElement("input");
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
this.doc=_b.document;
this.doc.write("<html><body margin='0px'><iframe style='width:100%;height:100%;border:0px' name='protectedFrame'></iframe></body></html>");
this.doc.close();
var _c=_b[0];
_b.__defineGetter__(0,function(){
});
_b.__defineGetter__("protectedFrame",function(){
});
this.doc=_c.document;
this.doc.write("<html><body margin='0px'></body></html>");
this.doc.close();
this.frame_container=this.doc.body;
}};
MVC.WindowName.styleFrame=function(_d){
_d.style.width="100%";
_d.style.height="100%";
_d.style.border="0px";
};
if(!MVC._no_conflict&&typeof WindowName=="undefined"){
WindowName=MVC.WindowName;
}
MVC.IO.WindowName=MVC.WindowName;
;
include.set_path('jmvc/plugins/io/xdoc');
include("xdoc");
;
include.set_path('jmvc/plugins/io/xdoc');
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
MVC.XDoc.requesting=this;
try{
_5.contentWindow.postMessage(this.url);
}
catch(e){
_5.contentDocument.postMessage(this.url);
}
},handle:function(_6){
if(_6.data!="null"){
eval("var data = "+_6.data);
data.responseText=_6.data;
}else{
data={responseText:""};
}
this.options.onComplete(data);
}};
MVC.XDoc.next=function(){
var _7=MVC.XDoc.waiting_requests.shift();
if(_7){
_7.send();
}
};
MVC.XDoc.observing=false;
MVC.XDoc.styleFrame=function(_8){
_8.style.width="100%";
_8.style.height="100%";
_8.style.border="0px";
_8.style.display="none";
};
MVC.XDoc._can_request=false;
MVC.XDoc.frame_loaded=function(){
MVC.XDoc._can_request=true;
MVC.XDoc.next();
};
(function(){
var _9=document.createElement(MVC.Browser.IE?"<iframe name=\"Jabbify\" onload=\"MVC.XDoc.frame_loaded()\">":"iframe");
MVC.XDoc.styleFrame(_9);
document.body.appendChild(_9);
_9.onload=MVC.Function.bind(MVC.XDoc.frame_loaded,MVC.XDoc);
_9.contentWindow.location=Jabbify.comet_domain+"/crossdomain.html";
MVC.XDoc._frame=_9;
})();
MVC.Event.observe(document,"message",function(_a){
MVC.XDoc.requesting.handle(_a);
MVC.XDoc.next();
});
}else{
MVC.XDoc=function(){
alert("XDoc should not be called");
};
}
;
include.set_path('jmvc/plugins/lang/date');
(function(){
var _1=Date.parse;
MVC.Native.extend("Date",{add_days:function(_2,_3){
_2.setDate(_2.getDate()+_3);
return _2;
},add_weeks:function(_4,_5){
return MVC.Date.add_days(_4,_5*7);
},day_name:function(_6){
return MVC.Date.day_names[_6.getDay()];
},first_day_of_week:function(_7){
var _8=new Date(_7);
_8.setDate(_7.getDate()-_7.getDay());
return _8;
},month_name:function(_9){
return MVC.Date.month_names[_9.getMonth()];
},number_of_days_in_month:function(_a){
var _b=_a.getFullYear(),_c=_a.getMonth(),m=[31,28,31,30,31,30,31,31,30,31,30,31];
if(_c!=1){
return m[_c];
}
if(_b%4!=0||(_b%100==0&&_b%400!=0)){
return m[1];
}
return m[1]+1;
},day_names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],month_names:["January","February","March","April","May","June","July","August","September","October","November","December"],parse:function(_e){
if(typeof _e!="string"){
return null;
}
var f1=/\d{4}-\d{1,2}-\d{1,2}/,f2=/\d{4}\/\d{1,2}\/\d{1,2}/,f3=/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/;
var _12;
if((_12=_e.match(f3))){
return new Date(Date.UTC(parseInt(_12[1],10),(parseInt(_12[2],10)-1),parseInt(_12[3],10),parseInt(_12[4],10),parseInt(_12[5],10),parseInt(_12[6],10)));
}
if(_e.match(f1)){
var _13=_e.match(f1)[0].split("-");
return new Date(Date.UTC(parseInt(_13[0],10),(parseInt(_13[1],10)-1),parseInt(_13[2],10)));
}
if(_e.match(f2)){
var _13=_e.match(f2)[0].split("/");
return new Date(Date.UTC(parseInt(_13[0],10),(parseInt(_13[1],10)-1),parseInt(_13[2],10)));
}
return _1(_e);
}});
})();
MVC.Native.Date=MVC.Date;
;
include.set_path('jmvc/plugins/lang/json');
include.plugins("lang");
include("json");
;
include.set_path('jmvc/plugins/lang/json');
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
include.set_path('jmvc/plugins/model');
include.plugins("lang/class","lang/openajax");
include("simple_store");
include("model");
;
include.set_path('jmvc/plugins/model');
MVC.Store=MVC.Class.extend({init:function(_1){
this._data={};
this.storing_class=_1;
},find_one:function(id){
return id?this._data[id]:null;
},create:function(_3){
var id=_3[_3.Class.id];
this._data[id]=_3;
},destroy:function(id){
delete this._data[id];
},find:function(f){
var _7=[];
for(var id in this._data){
var _9=this._data[id];
if(!f||f(_9)){
_7.push(_9);
}
}
return _7;
},clear:function(){
this._data={};
},is_empty:function(){
return !this.find().length;
}});
;
include.set_path('jmvc/plugins/model');
MVC.Model=MVC.Class.extend({store_type:MVC.Store,init:function(){
if(!this.className){
return;
}
MVC.Model.models[this.className]=this;
this.store=new this.store_type(this);
},find:function(id,_2,_3){
if(!_2){
_2={};
}
if(typeof _2=="function"){
_3=_2;
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
},asynchronous:true,create_as_existing:function(_4){
if(!_4){
return null;
}
if(_4.attributes){
_4=_4.attributes();
}
var _5=new this(_4);
_5.is_new_record=this.new_record_func;
this.publish("create.as_existing",{data:_5});
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
},_associations:[],element_id_to_id:function(_b){
var re=new RegExp(this.className+"_","i");
return _b.replace(re,"");
},find_by_element:function(el){
return this._find_by_element(MVC.$E(el),this.className,this);
},_find_by_element:function(ce,_f,_10){
var _11,id,_13=new RegExp("^"+_f+"_(.*)$");
if(ce&&ce.id&&(_11=ce.id.match(_13))&&_11.length>1){
id=_11[1];
}else{
id=ce.has_class(_13)[1];
}
return _10.store.find_one(id);
},add_attribute:function(_14,_15){
if(!this.attributes[_14]){
this.attributes[_14]=_15;
}
if(!this.default_attributes[_14]){
this.default_attributes[_14]=null;
}
},attributes:{},default_attributes:{},_clean_callbacks:function(_16){
if(!_16){
_16=function(){
};
}
if(typeof _16=="function"){
return {onSuccess:_16,onFailure:_16};
}
if(!_16.onSuccess&&!_16.onComplete){
throw "You must supply a positive callback!";
}
if(!_16.onSuccess){
_16.onSuccess=_16.onComplete;
}
if(!_16.onFailure&&_16.onComplete){
_16.onFailure=_16.onComplete;
}
return _16;
},models:{},callback:function(_17){
var f=typeof _17=="string"?this[_17]:_17;
var _19=MVC.Array.from(arguments);
_19.shift();
_19.unshift(f,this);
return MVC.Function.bind.apply(null,_19);
},publish:function(_1a,_1b){
OpenAjax.hub.publish(this.className+"."+_1a,_1b);
},namespace:null},{init:function(_1c){
this.errors=[];
this.set_attributes(this.Class.default_attributes||{});
this.set_attributes(_1c);
},set_attributes:function(_1d){
for(var key in _1d){
if(_1d.hasOwnProperty(key)){
this._setAttribute(key,_1d[key]);
}
}
return _1d;
},update_attributes:function(_1f,_20){
this.set_attributes(_1f);
return this.save(_20);
},valid:function(){
return this.errors.length==0;
},validate:function(){
},_setAttribute:function(_21,_22){
if(MVC.Array.include(this.Class._associations,_21)){
this._setAssociation(_21,_22);
}else{
this._setProperty(_21,_22);
}
},_setProperty:function(_23,_24){
if(this["set_"+_23]&&!this["set_"+_23](_24)){
return;
}
var old=this[_23];
this[_23]=MVC.Array.include(["created_at","updated_at"],_23)?MVC.Date.parse(_24):_24;
if(_23==this.Class.id&&this[_23]){
this.is_new_record=this.Class.new_record_func;
if(this.Class.store){
if(!old){
this.Class.store.create(this);
}else{
if(old!=this[_23]){
this.Class.store.destroy(old);
this.Class.store.create(this);
}
}
}
}
this.Class.add_attribute(_23,MVC.Object.guess_type(_24));
},_setAssociation:function(_26,_27){
this[_26]=function(){
if(!MVC.String.is_singular(_26)){
_26=MVC.String.singularize(_26);
}
var _28=window[MVC.String.classize(_26)];
if(!_28){
return _27;
}
return _28.create_many_as_existing(_27);
};
},attributes:function(){
var _29={};
var cas=this.Class.attributes;
for(var _2b in cas){
if(cas.hasOwnProperty(_2b)){
_29[_2b]=this[_2b];
}
}
return _29;
},is_new_record:function(){
return true;
},save:function(_2c){
var _2d;
this.errors=[];
this.validate();
if(!this.valid()){
return false;
}
_2d=this.is_new_record()?this.Class.create(this.attributes(),_2c):this.Class.update(this[this.Class.id],this.attributes(),_2c);
this.is_new_record=this.Class.new_record_func;
return true;
},destroy:function(_2e){
this.Class.destroy(this[this.Class.id],_2e);
this.Class.store.destroy(this[this.Class.id]);
},add_errors:function(_2f){
if(_2f){
this.errors=this.errors.concat(_2f);
}
},_resetAttributes:function(_30){
this._clear();
},_clear:function(){
var cas=this.Class.default_attributes;
for(var _32 in cas){
if(cas.hasOwnProperty(_32)){
this[_32]=null;
}
}
},element_id:function(){
return this.Class.className+"_"+this[this.Class.id];
},element:function(){
return MVC.$E(this.element_id());
},elements:function(){
return MVC.Query("."+this.element_id());
},publish:function(_33,_34){
this.Class.publish(_33,_34||{data:this});
},callback:function(_35){
var f=typeof _35=="string"?this[_35]:_35;
var _37=MVC.Array.from(arguments);
_37.shift();
_37.unshift(f,this);
return MVC.Function.bind.apply(null,_37);
}});
MVC.Object.guess_type=function(_38){
if(typeof _38!="string"){
if(_38==null){
return typeof _38;
}
if(_38.constructor==Date){
return "date";
}
if(_38.constructor==Array){
return "array";
}
return typeof _38;
}
if(_38=="true"||_38=="false"){
return "boolean";
}
if(!isNaN(_38)){
return "number";
}
return typeof _38;
};
if(!MVC._no_conflict&&typeof Model=="undefined"){
Model=MVC.Model;
}
;
include.set_path('jmvc/plugins/model/ajax');
include.plugins("model","io/ajax");
include("ajax_model");
;
include.set_path('jmvc/plugins/io/ajax');
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
if(include.get_env()=="test"&&MVC.Browser.Rhino){
include("fixtures/setup");
}
;
include.set_path('jmvc/plugins/io/ajax');
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
if(typeof this.options.parameters=="string"||typeof this.options.parameters=="number"){
this.options.parameters=""+this.options.parameters+"&_method="+this.options.method;
}else{
this.options.parameters["_method"]=this.options.method;
}
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
this.transport.send(_4||" ");
}
};
MVC.Ajax.factory=_1;
})();
MVC.Ajax.className="Ajax";
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
MVC.IO.Ajax=MVC.Ajax;
if(!MVC._no_conflict){
Ajax=MVC.Ajax;
}
;
include.set_path('jmvc/plugins/model/ajax');
MVC.Model.Ajax=MVC.Model.extend({transport:MVC.Ajax,request:function(){
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
this._super();
},_default_options:function(_5,_6,_7,_8){
var _9={};
this._add_default_callback(_9,"success",_6,_5,_7,_8);
this._add_default_callback(_9,"failure",_6,_5,_7,_8);
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
return function(_1b){
if(this[_18+"_"+_19+"_url"]){
_1a=typeof this[_18+"_"+_19+"_url"]=="function"?this[_18+"_"+_19+"_url"](_1b):this[_18+"_"+_19+"_url"];
}
var _1c=MVC.Array.from(arguments);
var _1d=this._clean_callbacks(_1c[_1c.length-1]);
_1b=_1c.length>1?_1b:{};
var _1e=this.request;
var _1f={method:_19};
var _20=false;
this.request=function(url,_22,_23){
_20=true;
_22=typeof _22!="undefined"?_22:_1b;
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
},json_from_string:function(_2f){
return eval("("+_2f+")");
}},{});
if(!MVC._no_conflict&&typeof Model.Ajax=="undefined"){
Model.Ajax=MVC.Model.Ajax;
}
;
include.set_path('jmvc/plugins/model/cookie');
include.plugins("model","lang/json");
include("cookie_model");
;
include.set_path('jmvc/plugins/model/cookie');
MVC.Model.Cookie=MVC.Model.extend({init:function(){
this._working=null;
this._super();
},days:null,find_one:function(_1){
var _2=this.find_class_data().instances;
if(!_1){
for(var id in _2){
return _2[id];
}
return null;
}
if(_1[this.id]){
return _2[_1[this.id]];
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
},create:function(_16,_17){
var cd=this.find_class_data();
var _19=cd.instances;
_19[_16[this.id]]=_16;
this.create_cookie(this.className,MVC.Object.to_json(cd),this.days);
},update:function(id,_1b){
var cd=this.find_class_data();
var _1d=cd.instances;
_1d[id]=_1b;
this.create_cookie(this.className,MVC.Object.to_json(cd),this.days);
},destroy:function(id){
var cd=this.find_class_data();
var _20=cd.instances;
var _21=_20[id];
delete _20[id];
this.create_cookie(this.className,MVC.Object.to_json(cd),this.days);
return _21;
},destroy_cookie:function(_22){
this.create_cookie(_22,"",-1);
},destroy_all:function(){
this.destroy_cookie(this.className);
return true;
}},{});
;
include.set_path('jmvc/plugins/model/jsonp');
include.plugins("model","lang/date","io/jsonp");
include("remote_model");
;
include.set_path('jmvc/plugins/model/jsonp');
MVC.Model.JsonP=MVC.Model.extend({error_timeout:4000,init:function(){
if(!this.className){
return;
}
if(!this.domain){
throw ("a domain must be provided for remote model");
}
if(!this.controller_name){
this.controller_name=this.className;
}
this.plural_controller_name=MVC.String.pluralize(this.controller_name);
this._super();
},find_all:function(_1,_2){
var _3=this._clean_callbacks(_2);
var _4=_3.onSuccess;
var _5=_3.onFailure;
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
delete p[this.controller_name];
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
include.set_path('jmvc/plugins/model/json_rest');
include.plugins("model/ajax","lang/date");
include("json_rest_model");
;
include.set_path('jmvc/plugins/model/json_rest');
MVC.Model.JsonRest=MVC.Model.Ajax.extend({init:function(){
if(!this.className){
return;
}
this.plural_name=MVC.String.pluralize(this.className);
this.singular_name=this.className;
this._super();
},find_all_get_url:function(){
return "/"+this.plural_name+".json";
},find_all_get_success:function(_1){
var _2=this.json_from_string(_1.responseText);
return this.convert_response_into_instances(_2);
},convert_response_into_instances:function(_3){
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
},destroy_delete_url:function(id){
return "/"+this.plural_name+"/"+id+".xml";
},destroy_delete_failure:function(){
return false;
},destroy_delete_success:function(_19){
return _19.status==200;
}},{});
;
include.set_path('jmvc/plugins/model/window_name');
include.plugins("model","lang/date","io/window_name");
include("window_name_model");
;
include.set_path('jmvc/plugins/model/window_name');
MVC.Model.WindowName=MVC.Model.extend({init:function(){
if(!this.className){
return;
}
if(!this.domain){
throw ("a domain must be provided for remote model");
}
if(!this.controller_name){
this.controller_name=this.className;
}
this.plural_controller_name=MVC.String.pluralize(this.controller_name);
this._super();
},find_all:function(_1,_2){
var _3=this._clean_callbacks(_2);
var _4=_3.onSuccess;
var _5=_3.onFailure;
var _6=this.find_url?this.find_url+"?":this.domain+"/"+this.plural_controller_name+".html?";
if(!_4){
_4=(function(){
});
}
new MVC.WindowName(_6,{parameters:_1,onFailure:_2.onFailure,onComplete:MVC.Function.bind(function(_7){
eval("var callback_params = "+_7);
var _8=this.create_many_as_existing(callback_params);
_4(_8);
},this),method:"get"});
},create:function(_9,_a){
var _b=this._clean_callbacks(_a);
var _c=_b.onSuccess;
this.add_standard_params(_9,"create");
var _d=this,_e=this.className,_f=this.create_url?this.create_url+"?":this.domain+"/"+this.plural_controller_name+".html?";
if(!_c){
_c=(function(){
});
}
_9["_method"]="POST";
new MVC.WindowName(_f,{parameters:_9,onComplete:MVC.Function.bind(this.single_create_callback(_c),this),onFailure:_c.onFailure,method:"post"});
},add_standard_params:function(_10,_11){
if(!_10.referer){
_10.referer=window.location.href;
}
},domain:null},{});
;
include.set_path('jmvc/plugins/model/xml_rest');
include.plugins("model/ajax","lang/date");
include("ObjTree","xml_rest_model");
;
include.set_path('jmvc/plugins/model/xml_rest');
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
include.set_path('jmvc/plugins/model/xml_rest');
MVC.Tree=new XML.ObjTree();
MVC.Tree.attr_prefix="@";
MVC.Model.XmlRest=MVC.Model.Ajax.extend({init:function(){
if(!this.className){
return;
}
this.plural_name=MVC.String.pluralize(this.className);
this.singular_name=this.className;
this._super();
},find_one_get_url:function(_1){
return "/"+this.plural_name+"/"+_1.id+".xml";
},find_one_get_success:function(_2,_3){
var _4=MVC.Tree.parseXML(_2.responseText);
var _5=_4[this.singular_name];
var _6=this.create_as_existing(this._attributesFromTree(_5));
return _6;
},find_all_get_url:function(){
return "/"+this.plural_name+".xml";
},find_all_get_success:function(_7){
var _8=MVC.Tree.parseXML(_7.responseText);
for(var _9 in _8){
if(_9.match(/-/)&&typeof _8[_9]=="object"){
_8[_9.replace(/-/,"_")]=_8[_9];
delete _8[_9];
}
}
for(var _9 in _8){
if(typeof _8[_9]=="object"){
for(var _a in _8[_9]){
if(_a.match(/-/)&&typeof _8[_9][_a]=="object"){
_8[_9][_a.replace(/-/,"_")]=_8[_9][_a];
delete _8[_9][_a];
}
}
}
}
if(!_8[this.plural_name]){
return [];
}
if(!(_8[this.plural_name][this.singular_name] instanceof Array)){
_8[this.plural_name][this.singular_name]=[_8[this.plural_name][this.singular_name]];
}
collection=[];
var _b=_8[this.plural_name][this.singular_name];
for(var i=0;i<_b.length;i++){
collection.push(this.create_as_existing(this._attributesFromTree(_b[i])));
}
return collection;
},create_post_url:function(){
return "/"+this.plural_name+".xml";
},create_request:function(_d,_e){
var _f=new this(_d);
_f.validate();
if(!_f.valid()){
return _f;
}
var _10={};
_10[this.singular_name]=_d;
var url=typeof this.create_post_url=="function"?this.create_post_url():this.create_post_url;
this.request(url,_10,{method:"post"},_f);
return _f;
},create_success:function(_12,_13,_14){
if(/\w+/.test(_12.responseText)){
var _15=_14._errorsFromXML(_12.responseText);
if(_15){
_14.add_errors(_15);
}else{
var _16;
var doc=MVC.Tree.parseXML(_12.responseText);
if(doc&&doc[this.singular_name]){
_16=this._attributesFromTree(doc[this.singular_name]);
}
if(_16){
_14._resetAttributes(_16);
}
}
}
if(_14.is_new_record()&&_12.status==201){
var id=this.get_id(_12);
if(!isNaN(id)){
_14._setProperty("id",id);
}
}
return _14;
},update_put_url:function(id){
return "/"+this.plural_name+"/"+id+".xml";
},update_request:function(id,_1b,_1c){
delete _1b.id;
var _1d={};
_1d[this.singular_name]=_1b;
var _1e=this.create_as_existing(_1b);
_1e.id=id;
_1e.validate();
if(!_1e.valid()){
return _1e;
}
this.request(this.update_put_url(id),_1d,{method:"put"},_1e);
},update_success:function(_1f,_20,_21){
if(/\w+/.test(_1f.responseText)){
var _22=_21._errorsFromXML(_1f.responseText);
if(_22){
_21.add_errors(_22);
}else{
var _23;
var doc=MVC.Tree.parseXML(_1f.responseText);
if(doc&&doc[this.singular_name]){
_23=this._attributesFromTree(doc[this.singular_name]);
}
if(_23){
_21._resetAttributes(_23);
}
}
}
return _21;
},destroy_delete_url:function(id){
return "/"+this.plural_name+"/"+id+".xml";
},destroy_delete_failure:function(){
return false;
},destroy_delete_success:function(_26){
return _26.status==200;
},elementHasMany:function(_27){
if(!_27){
return false;
}
var i=0;
var _29=null;
var _2a=false;
for(var val in _27){
if(_27.hasOwnProperty(val)){
if(i==0){
_29=val;
}
i+=1;
}
}
return (_27[_29]&&typeof (_27[_29])=="object"&&_27[_29].length!=null&&i==1);
},_attributesFromTree:function(_2c){
var _2d={};
for(var _2e in _2c){
if(!_2c.hasOwnProperty(_2e)){
continue;
}
var _2f=_2c[_2e];
if(_2c[_2e]&&_2c[_2e]["@type"]){
if(_2c[_2e]["#text"]){
_2f=_2c[_2e]["#text"];
}else{
_2f=undefined;
}
}
if(!_2f){
var a={};
}else{
if(typeof (_2f)=="string"){
if(_2c[_2e]["@type"]=="integer"){
var num=parseInt(_2f);
if(!isNaN(num)){
_2f=num;
}
}else{
if(_2c[_2e]["@type"]=="boolean"){
_2f=(_2f=="true");
}else{
if(_2c[_2e]["@type"]=="datetime"){
var _32=MVC.Date.parse(_2f);
if(!isNaN(_32)){
_2f=_32;
}
}
}
}
}else{
var _33=_2f;
var i=0;
var _35=null;
var _36=false;
for(var val in _33){
if(_33.hasOwnProperty(val)){
if(i==0){
_35=val;
}
i+=1;
}
}
if(_33[_35]&&typeof (_33[_35])=="object"&&i==1){
alert("has_many");
var _2f=[];
var _38=_2e;
var _39=MVC.String.classize(_35);
if(!(_2c[_38][_35].length>0)){
_2c[_38][_35]=[_2c[_38][_35]];
}
_2c[_38][_35].each(MVC.Function.bind(function(_3a){
if(eval("typeof("+_39+")")=="undefined"){
MVC.Resource.model(_39,{prefix:this._prefix,singular:_35,plural:_38,format:this._format});
}
var _3b=eval(_39+".create_as_existing(this._attributesFromTree(single))");
_2f.push(_3b);
},this));
}else{
_35=_2e;
var _39=MVC.String.classize(_35);
if(eval("typeof("+_39+")")!="undefined"){
_2f=eval(_39+".create_as_existing(this._attributesFromTree(value))");
}else{
_2f=null;
}
}
}
}
attribute=_2e.replace(/-/g,"_");
_2d[attribute]=_2f;
}
return _2d;
}},{_errorsFromXML:function(xml){
if(!xml){
return false;
}
var doc=MVC.Tree.parseXML(xml);
if(doc&&doc.errors){
var _3e=[];
if(typeof (doc.errors.error)=="string"){
doc.errors.error=[doc.errors.error];
}
for(var i=0;i<doc.errors.error.length;i++){
var _40=doc.errors.error[i];
var _41=_40.match(/(\w+) (.*)/);
_3e.push([_41[1].toLowerCase(),_41[2].toLowerCase()]);
}
return _3e;
}else{
return false;
}
}});
;
include.set_path('jmvc/plugins/test');
include("../lang/standard_helpers","../dom/query/standard");
include.plugins("lang/class","lang/openajax");
if(!window._rhino){
include.plugins("debug");
}else{
MVC.Console={log:function(_1){
print(_1);
}};
}
include("test","runner","assertions","unit","functional","controller","synthetic_events");
;
include.set_path('jmvc/plugins/test');
MVC.Tests={};
MVC.Test=MVC.Class.extend({init:function(_1,_2,_3){
this.type=_3||"unit";
this.tests=_2;
this.test_names=[];
this.test_array=[];
for(var t in this.tests){
if(!this.tests.hasOwnProperty(t)){
continue;
}
if(t.indexOf("test")==0){
this.test_names.push(t);
}
this.test_array.push(t);
}
this.name=_1;
this.Assertions=MVC.Test.Assertions.extend(this.helpers());
this.passes=0;
this.failures=0;
MVC.Tests[this.name]=this;
OpenAjax.hub.publish("jmvc.test.created",this);
},fail:function(){
this.failures++;
},helpers:function(){
var _5={};
for(var t in this.tests){
if(this.tests.hasOwnProperty(t)&&t.indexOf("test")!=0){
_5[t]=this.tests[t];
}
}
return _5;
},pass:function(){
this.passes++;
},run:function(_7){
this.working_test=0;
this.callback=_7;
this.passes=0;
this.failures=0;
OpenAjax.hub.publish("jmvc.test.test.start",this);
this.run_next();
},run_helper:function(_8){
var a=new this.Assertions(this);
a[_8](0);
},run_next:function(){
if(this.working_test!=null&&this.working_test<this.test_names.length){
this.working_test++;
this.run_test(this.test_names[this.working_test-1]);
}else{
if(this.working_test!=null){
OpenAjax.hub.publish("jmvc.test.test.complete",this);
this.working_test=null;
if(this.callback){
this.callback();
this.callback=null;
}
}
}
},run_test:function(_a){
var _b=this;
setTimeout(function(){
this.assertions=new _b.Assertions(_b,_a);
},0);
}});
Function.prototype.curry=function(){
var fn=this,_d=Array.prototype.slice.call(arguments);
return function(){
return fn.apply(this,_d.concat(Array.prototype.slice.call(arguments)));
};
};
if(MVC.Console&&MVC.Console.window){
MVC.Console.window.get_tests=function(){
return MVC.Tests;
};
}
MVC.Test.inspect=function(_e){
try{
if(_e===undefined){
return "undefined";
}
if(_e===null){
return "null";
}
if(_e.length!=null&&typeof _e!="string"){
return "[ ... ]";
}
return _e.inspect?_e.inspect():_e.toString();
}
catch(e){
if(e instanceof RangeError){
return "...";
}
throw e;
}
};
MVC.Test.loaded_files={};
include.unit_tests=function(){
for(var i=0;i<arguments.length;i++){
MVC.Console.log("Trying to load: test/unit/"+arguments[i]+"_test.js");
}
include.app(function(i){
return "../../test/unit/"+i+"_test";
}).apply(null,arguments);
};
include.functional_tests=function(){
for(var i=0;i<arguments.length;i++){
MVC.Console.log("Trying to load: test/functional/"+arguments[i]+"_test.js");
}
include.app(function(i){
return "../../test/functional/"+i+"_test";
}).apply(null,arguments);
};
if(!MVC._no_conflict){
Test=MVC.Test;
}
;
include.set_path('jmvc/plugins/test');
MVC.Test.Runner=function(_1,_2,_3){
var _4;
_1.run=function(_5){
_1._callback=_5;
_4=0;
_3.start.call(_1);
_1.run_next();
};
_1.run_next=function(){
if(_4!=null&&_4<_1[_2].length){
if(_4>0){
_3.after.call(_1,_4-1);
}
_4++;
_1[_2][_4-1].run(_1.run_next);
}else{
if(_4!=null){
if(_4>0){
_3.after.call(_1,_4-1);
}
_3.done.call(_1);
if(_1._callback){
_1._callback();
_1._callback=null;
}else{
}
}
}
};
};
;
include.set_path('jmvc/plugins/test');
MVC.Test.Assertions=MVC.Class.extend({init:function(_1,_2){
this.assertions=0;
this.failures=0;
this.errors=0;
this.messages=[];
this._test=_1;
if(!_2){
return;
}
this._delays=0;
this._test_name=_2;
this._last_called=_2;
OpenAjax.hub.publish("jmvc.test.running",this);
if(this.setup){
this._setup();
}else{
this._start();
}
},_start:function(){
try{
this._test.tests[this._test_name].call(this);
}
catch(e){
this.error(e);
this._delays=0;
}
this._update();
},_setup:function(){
var _3=this.next;
var _4;
this.next=function(t){
_4=t?t*1000:500;
};
this.setup();
this.next=_3;
if(_4){
var t=this;
var _7=this._start;
setTimeout(function(){
_7.call(t);
},_4);
}else{
this._start();
}
},assert:function(_8,_9){
var _9=_9||"assert: got \""+MVC.Test.inspect(_8)+"\"";
try{
_8?this.pass():this.fail(_9);
}
catch(e){
this.error(e);
}
},assert_equal:function(_a,_b,_c){
var _c=_c||"assertEqual";
try{
(_a==_b)?this.pass():this.fail(_c+": expected \""+MVC.Test.inspect(_a)+"\", actual \""+MVC.Test.inspect(_b)+"\"");
}
catch(e){
this.error(e);
}
},assert_null:function(_d,_e){
var _e=_e||"assertNull";
try{
(_d==null)?this.pass():this.fail(_e+": got \""+MVC.Test.inspect(_d)+"\"");
}
catch(e){
this.error(e);
}
},assert_not:function(_f,_10){
var _10=arguments[1]||"assert: got \""+MVC.Test.inspect(_f)+"\"";
try{
!_f?this.pass():this.fail(_10);
}
catch(e){
this.error(e);
}
},assert_not_null:function(_11,_12){
var _12=_12||"assertNotNull";
this.assert(_11!=null,_12);
},assert_each:function(_13,_14,_15){
var _15=_15||"assert_each";
try{
var e=MVC.Array.from(_13);
var a=MVC.Array.from(_14);
if(e.length!=a.length){
return this.fail(_15+": expected "+MVC.Test.inspect(_13)+", actual "+MVC.Test.inspect(_14));
}else{
for(var i=0;i<e.length;i++){
if(e[i]!=a[i]){
return this.fail(_15+": expected "+MVC.Test.inspect(_13)+", actual "+MVC.Test.inspect(_14));
}
}
}
this.pass();
}
catch(e){
this.error(e);
}
},pass:function(){
this.assertions++;
},fail:function(_19){
this.failures++;
this.messages.push("Failure: "+_19);
},error:function(_1a){
this.errors++;
this.messages.push(_1a.name+": "+_1a.message+"("+MVC.Test.inspect(_1a)+")");
},_get_next_name:function(){
for(var i=0;i<this._test.test_array.length;i++){
if(this._test.test_array[i]==this._last_called){
if(i+1>=this._test.test_array.length){
alert("There is no function following '"+this._last_called+"'.  Please make sure you have no duplicate function names in your tests.");
}
return this._test.test_array[i+1];
}
}
},_call_next_callback:function(_1c,_1d){
if(!_1c){
_1c=this._get_next_name();
}
var _1e=this;
var _1f=this._test.tests[_1c];
return function(){
_1e._last_called=_1c;
var _20=MVC.Array.from(arguments);
if(_1d){
_20.unshift(_1d);
}
try{
_1f.apply(_1e,_20);
}
catch(e){
_1e.error(e);
}
_1e._delays--;
_1e._update();
};
},next:function(_21,_22,_23){
this._delays++;
_22=_22?_22*1000:500;
setTimeout(this._call_next_callback(_23,_21),_22);
},next_callback:function(_24,_25){
this._delays++;
var f=this._call_next_callback(_24);
if(!_25){
return f;
}
return function(){
setTimeout(f,_25*1000);
};
},_update:function(){
if(this._delays==0){
if(this.teardown){
this.teardown();
}
if(this._do_blur_back){
this._blur_back();
}
OpenAjax.hub.publish("jmvc.test.assertions.update",this);
this.failures==0&&this.errors==0?this._test.pass():this._test.fail();
this._test.run_next();
}
},_blur_back:function(){
MVC.Browser.Gecko?window.blur():MVC.Console.window.focus();
}});
;
include.set_path('jmvc/plugins/test');
MVC.Test.Unit=MVC.Test.extend({init:function(_1,_2){
this._super(_1,_2,"unit");
MVC.Test.Unit.tests.push(this);
}});
MVC.Test.Unit.tests=[];
MVC.Test.Runner(MVC.Test.Unit,"tests",{start:function(){
this.passes=0;
},after:function(_3){
if(this.tests[_3].failures==0){
this.passes++;
}
},done:function(){
OpenAjax.hub.publish("jmvc.test.unit.complete",this);
}});
;
include.set_path('jmvc/plugins/test');
MVC.Test.Functional=MVC.Test.extend({init:function(_1,_2){
this._super(_1,_2,"functional");
MVC.Test.Functional.tests.push(this);
},helpers:function(){
var _3=this._super();
_3.Action=function(_4,_5,_6){
_6=_6||{};
_6.type=_4;
var _7=0;
if(typeof _6=="number"){
_7=_6||0;
}else{
if(typeof _6=="object"){
_7=_6.number||0;
}
}
var _8=typeof _5=="string"?MVC.Query(_5)[_7]:_5;
if((_4=="focus"||_4=="write"||_4=="click")&&!this._do_blur_back){
MVC.Browser.Gecko?MVC.Console.window.blur():window.focus();
this._do_blur_back=true;
}
var _9=new MVC.SyntheticEvent(_4,_6).send(_8);
return {event:_9,element:_8,options:_6};
};
for(var e=0;e<MVC.Test.Functional.events.length;e++){
var _b=MVC.Test.Functional.events[e];
_3[MVC.String.capitalize(_b)]=_3.Action.curry(_b);
}
return _3;
}});
MVC.Test.Functional.events=["blur","change","click","contextmenu","dblclick","keyup","keydown","keypress","mousedown","mousemove","mouseout","mouseover","mouseup","reset","resize","scroll","select","submit","dblclick","focus","load","unload","drag","write"];
MVC.Test.Functional.tests=[];
MVC.Test.Runner(MVC.Test.Functional,"tests",{start:function(){
this.passes=0;
},after:function(_c){
if(this.tests[_c].failures==0){
this.passes++;
}
},done:function(){
MVC.Console.window.document.getElementById("functional_result").innerHTML="("+this.passes+"/"+this.tests.length+")"+(this.passes==this.tests.length?" Wow!":"");
}});
;
include.set_path('jmvc/plugins/test');
MVC.Test.Controller=MVC.Test.Functional.extend({init:function(_1,_2){
var _3=MVC.String.classize(_1);
var _4=_3+"Controller";
this.controller=window[_4];
if(!this.controller){
alert("There is no controller named "+_4);
}
this.unit=_1;
this._super(_3+"TestController",_2);
},helpers:function(){
var _5=this._super();
var _6=MVC.Object.extend({},this.controller.actions);
this.added_helpers={};
for(var _7 in _6){
if(!_6.hasOwnProperty(_7)||!_6[_7].event_type||!_6[_7].css_selector){
continue;
}
var _8=_6[_7].event_type;
var _9=_6[_7].css_selector.replace(/\.|#/g,"")+" "+_8;
var _a=_9.replace(/(\w*)/g,function(m,_c){
return MVC.String.capitalize(_c);
}).replace(/ /g,"");
if(_5[MVC.String.capitalize(_8)]){
_5[_a]=_5[MVC.String.capitalize(_8)].curry(_6[_7].css_selector);
}
this.added_helpers[_a]=_5[_a];
}
return _5;
}});
;
include.set_path('jmvc/plugins/test');
MVC.SyntheticEvent=function(_1,_2){
this.type=_1;
this.options=_2||{};
};
MVC.SyntheticEvent.prototype={send:function(_3){
this.firefox_autocomplete_off(_3);
if(MVC.Browser.Opera&&MVC.Array.include(["focus","blur"],this.type)){
return this.createEvents(_3);
}
if(this.type=="focus"){
return _3.focus();
}
if(this.type=="blur"){
return _3.blur();
}
if(this.type=="write"){
return this.write(_3);
}
if(this.type=="drag"){
return this.drag(_3);
}
return this.create_event(_3);
},firefox_autocomplete_off:function(_4){
if(MVC.Browser.Gecko&&_4.nodeName.toLowerCase()=="input"&&_4.getAttribute("autocomplete")!="off"){
_4.setAttribute("autocomplete","off");
}
},create_event:function(_5){
if(document.createEvent){
this.createEvent(_5);
}else{
if(document.createEventObject){
this.createEventObject(_5);
}else{
throw "Your browser doesn't support dispatching events";
}
}
return this.event;
},createEvent:function(_6){
if(MVC.Array.include(["keypress","keyup","keydown"],this.type)){
this.createKeypress(_6,this.options.character);
}else{
if(this.type=="submit"){
this.createEvents(_6);
}else{
if(MVC.Array.include(["click","dblclick","mouseover","mouseout","mousemove","mousedown","mouseup","contextmenu"],this.type)){
this.createMouse(_6);
}
}
}
},createEventObject:function(_7){
if(MVC.Array.include(["keypress","keyup","keydown"],this.type)){
this.createKeypressObject(_7,this.options.character);
}else{
if(this.type=="submit"){
this.createSubmitObject(_7);
}else{
if(MVC.Array.include(["click","dblclick","mouseover","mouseout","mousemove","mousedown","mouseup","contextmenu"],this.type)){
this.createMouseObject(_7);
}
}
}
},simulateEvent:function(_8){
if(_8.dispatchEvent){
return _8.dispatchEvent(this.event);
}else{
if(_8.fireEvent){
return _8.fireEvent("on"+this.type,this.event);
}else{
throw "Your browser doesn't support dispatching events";
}
}
},createEvents:function(_9){
this.event=document.createEvent("Events");
this.event.initEvent(this.type,true,true);
this.simulateEvent(_9);
},createSubmitObject:function(_a){
if(MVC.Controller){
for(var i=0;i<_a.elements.length;i++){
var el=_a.elements[i];
if(el.nodeName.toLowerCase()=="input"&&el.type.toLowerCase()=="submit"){
return (new MVC.SyntheticEvent("click").send(el));
}
}
for(var i=0;i<_a.elements.length;i++){
var el=_a.elements[i];
if((el.nodeName.toLowerCase()=="input"&&el.type.toLowerCase()=="text")||el.nodeName.toLowerCase()=="textarea"){
return (new MVC.SyntheticEvent("keypress",{keyCode:13}).send(el));
}
}
}else{
this.event=document.createEventObject();
this.simulateEvent(_a);
}
},createKeypress:function(_d,_e){
if(_e&&_e.match(/\n/)){
this.options.keyCode=13;
_e=0;
}
if(_e&&_e.match(/[\b]/)){
this.options.keyCode=8;
_e=0;
}
var _f=MVC.Object.extend({ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,keyCode:this.options.keyCode||(_e?_e.charCodeAt(0):0),charCode:(_e?_e.charCodeAt(0):0)},arguments[2]||{});
try{
this.event=document.createEvent("KeyEvents");
this.event.initKeyEvent(this.type,true,true,window,_f.ctrlKey,_f.altKey,_f.shiftKey,_f.metaKey,_f.keyCode,_f.charCode);
}
catch(e){
try{
this.event=document.createEvent("Events");
}
catch(e2){
this.event=document.createEvent("UIEvents");
}
finally{
this.event.initEvent(this.type,true,true);
MVC.Object.extend(this.event,_f);
}
}
var _10=this.simulateEvent(_d);
if(_10&&this.type=="keypress"&&!MVC.Browser.Gecko&&(_d.nodeName.toLowerCase()=="input"||_d.nodeName.toLowerCase()=="textarea")){
if(_e){
_d.value+=_e;
}else{
if(this.options.keyCode&&this.options.keyCode==8){
_d.value=_d.value.substring(0,_d.value.length-1);
}
}
}
},createKeypressObject:function(_11,_12){
if(_12&&_12.match(/\n/)){
this.options.keyCode=13;
_12=0;
}
if(_12&&_12.match(/[\b]/)){
this.options.keyCode=8;
_12=0;
}
this.event=document.createEventObject();
this.event.charCode=(_12?_12.charCodeAt(0):0);
this.event.keyCode=this.options.keyCode||(_12?_12.charCodeAt(0):0);
var _13=this.simulateEvent(_11);
if(_13&&this.type=="keypress"&&!MVC.Browser.Gecko&&(_11.nodeName.toLowerCase()=="input"||_11.nodeName.toLowerCase()=="textarea")){
if(_12){
_11.value+=_12;
}else{
if(this.options.keyCode&&this.options.keyCode==8){
_11.value=_11.value.substring(0,_11.value.length-1);
}
}
}
},createMouse:function(_14){
this.event=document.createEvent("MouseEvents");
var _15=MVC.Test.center(_14);
var _16=MVC.Object.extend({bubbles:true,cancelable:true,view:window,detail:1,screenX:366,screenY:195,clientX:_15[0],clientY:_15[1],ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,button:(this.type=="contextmenu"?2:0),relatedTarget:null},this.options);
this.event.initMouseEvent(this.type,_16.bubbles,_16.cancelable,_16.view,_16.detail,_16.screenX,_16.screenY,_16.clientX,_16.clientY,_16.ctrlKey,_16.altKey,_16.shiftKey,_16.metaKey,_16.button,_16.relatedTarget);
this.simulateEvent(_14);
},createMouseObject:function(_17){
this.event=document.createEventObject();
var _18=MVC.Test.center(_17);
var _19=MVC.Object.extend({bubbles:true,cancelable:true,view:window,detail:1,screenX:1,screenY:1,clientX:_18[0],clientY:_18[1],ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,button:(this.type=="contextmenu"?2:1),relatedTarget:null},this.options);
MVC.Object.extend(this.event,_19);
if(!MVC.Browser.Gecko&&(_17.nodeName.toLowerCase()=="input"||(_17.type&&_17.type.toLowerCase()=="checkbox"))){
_17.checked=(_17.checked?false:true);
}
this.simulateEvent(_17);
},drag:function(_1a){
var _1b=function(_1c,_1d){
if(!_1d[_1c].x||!_1d[_1c].y){
if(typeof _1d[_1c]=="string"){
_1d[_1c]=document.getElementById(_1d[_1c]);
}
var _1e=MVC.Test.center(_1d[_1c]);
_1d[_1c].x=_1e.left;
_1d[_1c].y=_1e.top;
}
};
_1b("from",this.options);
_1b("to",this.options);
if(this.options.duration){
return new MVC.Test.Drag(_1a,this.options);
}
var x=this.options.from.x;
var y=this.options.from.y;
var _21=this.options.steps||100;
this.type="mousedown";
this.options.clientX=x;
this.options.clientY=y;
this.create_event(_1a);
this.type="mousemove";
for(var i=0;i<_21;i++){
x=this.options.from.x+(i*(this.options.to.x-this.options.from.x))/_21;
y=this.options.from.y+(i*(this.options.to.y-this.options.from.y))/_21;
this.options.clientX=x;
this.options.clientY=y;
this.create_event(_1a);
}
},write:function(_23){
_23.focus();
return new MVC.Test.Write(_23,this.options);
}};
MVC.Test.Write=function(_24,_25){
this.delay=100;
if(typeof _25=="string"){
this.text=_25;
this.synchronous=true;
}else{
if(_25.callback){
this.callback=_25.callback;
}
if(_25.text){
this.text=_25.text;
}
if(_25.synchronous==true){
this.synchronous=true;
}
}
this.element=_24;
this.text_index=1;
if(this.synchronous==true){
for(var i=0;i<this.text.length;i++){
this.write_character(this.text.substr(i,1));
}
}else{
this.write_character(this.text.substr(0,1));
setTimeout(this.next_callback(),this.delay);
}
};
MVC.Test.Write.prototype={next:function(){
if(this.text_index>=this.text.length){
if(this.callback){
this.callback({element:this.target});
}else{
return;
}
}else{
this.write_character(this.text.substr(this.text_index,1));
this.text_index++;
setTimeout(this.next_callback(),this.delay);
}
},write_character:function(_27){
new MVC.SyntheticEvent("keydown",{character:_27}).send(this.element);
new MVC.SyntheticEvent("keypress",{character:_27}).send(this.element);
new MVC.SyntheticEvent("keyup",{character:_27}).send(this.element);
},next_callback:function(){
var t=this;
return function(){
t.next();
};
}};
MVC.Test.Drag=function(_29,_2a){
this.callback=_2a.callback;
this.start_x=_2a.from.x;
this.end_x=_2a.to.x;
this.delta_x=this.end_x-this.start_x;
this.start_y=_2a.from.y;
this.end_y=_2a.to.y;
this.delta_y=this.end_y-this.start_y;
this.target=_29;
this.duration=_2a.duration?_2a.duration*1000:1000;
this.start=new Date();
new MVC.SyntheticEvent("mousedown",{clientX:this.start_x,clientY:this.start_y}).send(_29);
this.pointer=document.createElement("div");
this.pointer.style.width="10px";
this.pointer.style.height="10px";
this.pointer.style.backgroundColor="RED";
this.pointer.style.position="absolute";
this.pointer.style.left=""+this.start_x+"px";
var _2b=window.pageYOffset||document.documentElement.scrollTop||0;
var _2c=this.start_y+_2b;
this.pointer.style.top=""+_2c+"px";
this.pointer.style.lineHeight="1px";
document.body.appendChild(this.pointer);
setTimeout(this.next_callback(),20);
};
MVC.Test.Drag.prototype={next:function(){
var now=new Date();
var _2e=now-this.start;
if(_2e>this.duration){
new MVC.SyntheticEvent("mousemove",{clientX:this.end_x,clientY:this.end_y}).send(this.target);
var _2f=new MVC.SyntheticEvent("mouseup",{clientX:this.end_x,clientY:this.end_y}).send(this.target);
this.pointer.parentNode.removeChild(this.pointer);
if(this.callback){
this.callback({event:_2f,element:this.target});
}
}else{
var _30=_2e/this.duration;
var x=this.start_x+_30*this.delta_x;
var y=this.start_y+_30*this.delta_y;
this.pointer.style.left=""+x+"px";
var _33=window.pageYOffset||document.documentElement.scrollTop||0;
var _34=y+_33;
this.pointer.style.top=""+_34+"px";
new MVC.SyntheticEvent("mousemove",{clientX:x,clientY:y}).send(this.target);
setTimeout(this.next_callback(),20);
}
},next_callback:function(){
var t=this;
return function(){
t.next();
};
}};
MVC.Test.get_dimensions=function(_36){
var _37=_36.style.display;
if(_37!="none"&&_37!=null){
return {width:_36.offsetWidth,height:_36.offsetHeight};
}
var els=_36.style;
var _39=els.visibility;
var _3a=els.position;
var _3b=els.display;
els.visibility="hidden";
els.position="absolute";
els.display="block";
var _3c=_36.clientWidth;
var _3d=_36.clientHeight;
els.display=_3b;
els.position=_3a;
els.visibility=_39;
return {width:_3c,height:_3d};
};
MVC.Test.center=function(_3e){
var d=MVC.Test.get_dimensions(_3e);
var _40=d.height/2,_41=d.width/2;
do{
_40+=_3e.offsetTop||0;
_41+=_3e.offsetLeft||0;
_3e=_3e.offsetParent;
}while(_3e);
var _42=window.pageYOffset||document.documentElement.scrollTop||0;
var _43=window.pageXOffset||document.documentElement.scrollLeft||0;
_40=_40-_42;
_41=_41-_43;
var _44=[_41,_40];
_44.left=_41;
_44.top=_40;
return _44;
};
;
include.set_path('jmvc/plugins/view');
include.plugins("lang");
include("view");
if(include.get_env()=="development"){
include("fulljslint");
}
if(MVC.Controller){
include.plugins("controller/view");
}
;
include.set_path('jmvc/plugins/view');
MVC.View=function(_1){
this.set_options(_1);
if(_1.precompiled){
this.template={};
this.template.process=_1.precompiled;
MVC.View.update(this.name,this);
return;
}
if(_1.url||_1.absolute_url||_1.view_url){
this.name=this.name?this.name:_1.url||_1.absolute_url||"views/"+_1.view_url;
var _2=_1.absolute_url||(_1.url?MVC.root.join(_1.url+(_1.url.match(this.extMatch)?"":this.ext)):MVC.root.join("views/"+_1.view_url+(_1.view_url.match(this.extMatch)?"":this.ext)));
var _3=MVC.View.get(this.name,this.cache);
if(_3){
return _3;
}
if(_3==MVC.View.INVALID_PATH){
return null;
}
this.text=include.request(_2+(this.cache||window._rhino?"":"?"+Math.random()));
if(this.text==null){
if(window._rhino){
print("Exception: "+"There is no template at "+_2);
}
throw ({type:"JMVC",message:"There is no template at "+_2});
}
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
this.ext=_8.ext!=null?_8.ext:MVC.View.ext;
this.extMatch=new RegExp(this.ext.replace(/\./,"."));
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
this.pre_cmd=["var ___ViewO = [];"];
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
var _25="___ViewO.push(";
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
_27.push(_25+"\""+_29(_28)+"\");");
_27.cr();
_28="";
break;
case _2c.left_delimiter:
case _2c.left_equal:
case _2c.left_comment:
_2c.stag=_2b;
if(_28.length>0){
_27.push(_25+"\""+_29(_28)+"\")");
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
_27.push(_26+"(MVC.View.Scanner.to_text("+_28+")))");
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
_27.push(_25+"\""+_29(_28)+"\")");
}
_27.close();
this.out=_27.script+";";
var _2d="this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {"+this.out+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";
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
MVC.View.ext=_31.ext!=null?_31.ext:MVC.View.ext;
var _32={};
MVC.View.templates_directory=_32;
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
MVC.View.config({cache:include.get_env()=="production",type:"<",ext:".ejs"});
MVC.View.PreCompiledFunction=function(_37,_38,f){
new MVC.View({name:_38,precompiled:f});
};
MVC.View.Helpers=function(_3a){
this.data=_3a;
};
MVC.View.Helpers.prototype={partial:function(_3b,_3c){
if(!_3c){
_3c=this.data;
}
return new MVC.View(_3b).render(_3c);
},to_text:function(_3d,_3e){
if(_3d==null||_3d===undefined){
return _3e||"";
}
if(_3d instanceof Date){
return _3d.toDateString();
}
if(_3d.toString){
return _3d.toString().replace(/\n/g,"<br />").replace(/''/g,"'");
}
return "";
}};
include.view=function(_3f){
if(include.get_env()=="development"){
new MVC.View({url:new MVC.File("../"+_3f).join_current()});
}else{
if(include.get_env()=="compress"){
include({path:"../"+_3f,process:MVC.View.process_include,ignore:true});
new MVC.View({url:new MVC.File("../"+_3f).join_current()});
}else{
}
}
};
include.views=function(){
for(var i=0;i<arguments.length;i++){
include.view(arguments[i]+MVC.View.ext);
}
};
MVC.View.process_include=function(_41){
var _42=new MVC.View({text:_41.text});
return "MVC.View.PreCompiledFunction(\""+_41.original_path+"\", \""+_41.path+"\",function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {"+_42.out()+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}})";
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
return _4a.substr(0,_4a.length-1);
}});
;
include.set_path('jmvc/plugins/controller/view');
include.plugins("view","controller");
include("controller_view");
;
include.set_path('jmvc/plugins/controller/view');
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
var _b=_b+MVC.View.ext;
return _b;
};
if(_1.plugin){
_4="../jmvc/plugins/"+_1.plugin;
}
if(_1.action){
var _c="../views/"+_a(_1.action);
}else{
if(_1.partial){
var _c="../views/"+_a(_1.partial);
}else{
var _c="../views/"+_5+"/"+_6.replace(/\.|#/g,"").replace(/ /g,"_")+MVC.View.ext;
}
}
var _d=_1.using||this;
if(_1.locals){
for(var _e in _1.locals){
_d[_e]=_1.locals[_e];
}
}
var _f;
if(!_4){
_f=new MVC.View({url:new MVC.File(_c).join_from(this.Class._path)});
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
var _10=["to","before","after","top","bottom","replace"];
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
if(_10[l]=="replace"){
MVC.$E.replace(_1.replace,_2);
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
}
return _2;
};
;
include.set_path('jmvc/plugins/view/helpers');
include.plugins("view");
include("view_helpers");
;
include.set_path('jmvc/plugins/view/helpers');
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
},time_tag:function(_14,_15,_16,_17){
var _18=[];
if(_17==null||_17==0){
_17=60;
}
for(var h=0;h<24;h++){
for(var m=0;m<60;m+=_17){
var _1b=(h<10?"0":"")+h+":"+(m<10?"0":"")+m;
_18.push({text:_1b,value:_1b});
}
}
return this.select_tag(_14,_15,_18,_16);
},file_tag:function(_1c,_1d,_1e){
return this.input_field_tag(_1c+"[file]",_1d,"file",_1e);
},form_tag:function(_1f,_20){
_20=_20||{};
if(_20.multipart==true){
_20.method="post";
_20.enctype="multipart/form-data";
}
_20.action=_1f;
return this.start_tag_for("form",_20);
},form_tag_end:function(){
return this.tag_end("form");
},hidden_field_tag:function(_21,_22,_23){
return this.input_field_tag(_21,_22,"hidden",_23);
},input_field_tag:function(_24,_25,_26,_27){
_27=_27||{};
_27.id=_27.id||_24;
_27.value=_25||"";
_27.type=_26||"text";
_27.name=_24;
return this.single_tag_for("input",_27);
},label_tag:function(_28,_29){
_29=_29||{};
return this.start_tag_for("label",_29)+_28+this.tag_end("label");
},link_to:function(_2a,url,_2c){
if(!_2a){
var _2a="null";
}
if(!_2c){
var _2c={};
}
this.set_confirm(_2c);
_2c.href=url;
return this.start_tag_for("a",_2c)+_2a+this.tag_end("a");
},link_to_if:function(_2d,_2e,url,_30){
return this.link_to_unless((!_2d),_2e,url,_30);
},link_to_unless:function(_31,_32,url,_34){
if(_31){
return _32;
}
return this.link_to(_32,url,_34);
},set_confirm:function(_35){
if(_35.confirm){
_35.onclick=_35.onclick||"";
_35.onclick=_35.onclick+"; var ret_confirm = confirm(\""+_35.confirm+"\"); if(!ret_confirm){ return false;} ";
_35.confirm=null;
}
},submit_link_to:function(_36,_37,_38,_39){
if(!_36){
var _36="null";
}
if(!_38){
_38={};
}
_38.type="submit";
_38.value=_36;
this.set_confirm(_38);
_38.onclick=_38.onclick+";window.location=\""+_37+"\"; return false;";
return this.single_tag_for("input",_38);
},password_field_tag:function(_3a,_3b,_3c){
return this.input_field_tag(_3a,_3b,"password",_3c);
},select_tag:function(_3d,_3e,_3f,_40){
_40=_40||{};
_40.id=_40.id||_3d;
_40.name=_3d;
var txt="";
txt+=this.start_tag_for("select",_40);
for(var i=0;i<_3f.length;i++){
var _43=_3f[i];
if(typeof _43=="string"){
_43={value:_43};
}
if(!_43.text){
_43.text=_43.value;
}
if(!_43.value){
_43.text=_43.text;
}
var _44={value:_43.value};
if(_43.value==_3e){
_44.selected="selected";
}
txt+=this.start_tag_for("option",_44)+_43.text+this.tag_end("option");
}
txt+=this.tag_end("select");
return txt;
},single_tag_for:function(tag,_46){
return this.tag(tag,_46,"/>");
},start_tag_for:function(tag,_48){
return this.tag(tag,_48);
},submit_tag:function(_49,_4a){
_4a=_4a||{};
_4a.type=_4a.type||"submit";
_4a.value=_49||"Submit";
return this.single_tag_for("input",_4a);
},tag:function(tag,_4c,end){
end=end||">";
var txt=" ";
for(var _4f in _4c){
if(_4c.hasOwnProperty(_4f)){
value=_4c[_4f]!=null?_4c[_4f].toString():"";
if(_4f=="Class"||_4f=="klass"){
_4f="class";
}
if(value.indexOf("'")!=-1){
txt+=_4f+"=\""+value+"\" ";
}else{
txt+=_4f+"='"+value+"' ";
}
}
}
return "<"+tag+txt+end;
},tag_end:function(tag){
return "</"+tag+">";
},text_area_tag:function(_51,_52,_53){
_53=_53||{};
_53.id=_53.id||_51;
_53.name=_53.name||_51;
_52=_52||"";
if(_53.size){
_53.cols=_53.size.split("x")[0];
_53.rows=_53.size.split("x")[1];
delete _53.size;
}
_53.cols=_53.cols||50;
_53.rows=_53.rows||4;
return this.start_tag_for("textarea",_53)+_52+this.tag_end("textarea");
},text_field_tag:function(_54,_55,_56){
return this.input_field_tag(_54,_55,"text",_56);
},img_tag:function(_57,_58){
_58=_58||{};
_58.src="resources/images/"+_57;
return this.single_tag_for("img",_58);
}});
MVC.View.Helpers.prototype.text_tag=MVC.View.Helpers.prototype.text_area_tag;
(function(){
var _59={};
var _5a=0;
MVC.View.Helpers.link_data=function(_5b){
var _5c=_5a++;
_59[_5c]=_5b;
return "_data='"+_5c+"'";
};
MVC.View.Helpers.get_data=function(el){
if(!el){
return null;
}
var _5e=el.getAttribute("_data");
if(!_5e){
return null;
}
return _59[parseInt(_5e)];
};
MVC.View.Helpers.prototype.link_data=function(_5f){
return MVC.View.Helpers.link_data(_5f);
};
MVC.View.Helpers.prototype.get_data=function(el){
return MVC.View.Helpers.get_data(el);
};
})();
;
include.set_path('jmvc/plugins/dom/history');
if(typeof Prototype=="undefined"){
include("json2");
}
include("rsh");
;
include.set_path('jmvc/plugins/dom/history');
if(!this.JSON){
JSON={};
}
(function(){
function f(n){
return n<10?"0"+n:n;
};
if(typeof Date.prototype.toJSON!=="function"){
Date.prototype.toJSON=function(_3){
return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z";
};
String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(_4){
return this.valueOf();
};
}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_6=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_7,_8,_9={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},_a;
function _b(_c){
_6.lastIndex=0;
return _6.test(_c)?"\""+_c.replace(_6,function(a){
var c=_9[a];
if(typeof c==="string"){
return c;
}
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_c+"\"";
};
function _f(key,_11){
var i,k,v,_15,_16=_7,_17,_18=_11[key];
if(_18&&typeof _18==="object"&&typeof _18.toJSON==="function"){
_18=_18.toJSON(key);
}
if(typeof _a==="function"){
_18=_a.call(_11,key,_18);
}
switch(typeof _18){
case "string":
return _b(_18);
case "number":
return isFinite(_18)?String(_18):"null";
case "boolean":
case "null":
return String(_18);
case "object":
if(!_18){
return "null";
}
_7+=_8;
_17=[];
if(typeof _18.length==="number"&&!_18.propertyIsEnumerable("length")){
_15=_18.length;
for(i=0;i<_15;i+=1){
_17[i]=_f(i,_18)||"null";
}
v=_17.length===0?"[]":_7?"[\n"+_7+_17.join(",\n"+_7)+"\n"+_16+"]":"["+_17.join(",")+"]";
_7=_16;
return v;
}
if(_a&&typeof _a==="object"){
_15=_a.length;
for(i=0;i<_15;i+=1){
k=_a[i];
if(typeof k==="string"){
v=_f(k,_18);
if(v){
_17.push(_b(k)+(_7?": ":":")+v);
}
}
}
}else{
for(k in _18){
if(Object.hasOwnProperty.call(_18,k)){
v=_f(k,_18);
if(v){
_17.push(_b(k)+(_7?": ":":")+v);
}
}
}
}
v=_17.length===0?"{}":_7?"{\n"+_7+_17.join(",\n"+_7)+"\n"+_16+"}":"{"+_17.join(",")+"}";
_7=_16;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_19,_1a,_1b){
var i;
_7="";
_8="";
if(typeof _1b==="number"){
for(i=0;i<_1b;i+=1){
_8+=" ";
}
}else{
if(typeof _1b==="string"){
_8=_1b;
}
}
_a=_1a;
if(_1a&&typeof _1a!=="function"&&(typeof _1a!=="object"||typeof _1a.length!=="number")){
throw new Error("JSON.stringify");
}
return _f("",{"":_19});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(_1d,_1e){
var j;
function _20(_21,key){
var k,v,_25=_21[key];
if(_25&&typeof _25==="object"){
for(k in _25){
if(Object.hasOwnProperty.call(_25,k)){
v=_20(_25,k);
if(v!==undefined){
_25[k]=v;
}else{
delete _25[k];
}
}
}
}
return _1e.call(_21,key,_25);
};
cx.lastIndex=0;
if(cx.test(_1d)){
_1d=_1d.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(_1d.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+_1d+")");
return typeof _1e==="function"?_20({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
})();
;
include.set_path('jmvc/plugins/dom/history');
window.MVC.History={isIE:false,isOpera:false,isSafari:false,isKonquerer:false,isGecko:false,isSupported:false,throwErrors:true,fireInitialChange:true,create:function(_1){
var _2=this;
var UA=navigator.userAgent.toLowerCase();
var _4=navigator.platform.toLowerCase();
var _5=navigator.vendor||"";
if(_5==="KDE"){
this.isKonqueror=true;
this.isSupported=false;
}else{
if(typeof window.opera!=="undefined"){
this.isOpera=true;
this.isSupported=true;
}else{
if(typeof document.all!=="undefined"){
this.isIE=true;
this.isSupported=true;
}else{
if(_5.indexOf("Apple Computer, Inc.")>-1){
this.isSafari=true;
this.isSupported=(_4.indexOf("mac")>-1);
}else{
if(UA.indexOf("gecko")!=-1){
this.isGecko=true;
this.isSupported=true;
}
}
}
}
}
window.historyStorage.setup(_1);
if(this.isSafari){
this.createSafari();
}else{
if(this.isOpera){
this.createOpera();
}
}
var _6=this.getCurrentLocation();
this.currentLocation=_6;
if(this.isIE){
this.createIE(_6);
}
var _7=function(){
_2.firstLoad=null;
};
this.addEventListener(window,"unload",_7);
if(this.isIE){
this.ignoreLocationChange=true;
}else{
if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){
this.ignoreLocationChange=true;
this.firstLoad=true;
historyStorage.put(this.PAGELOADEDSTRING,true);
}else{
this.ignoreLocationChange=false;
this.fireOnNewListener=false;
}
}
var _8=function(){
_2.checkLocation();
};
setInterval(_8,100);
},initialize:function(){
if(this.isIE){
if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){
this.fireOnNewListener=false;
this.firstLoad=true;
historyStorage.put(this.PAGELOADEDSTRING,true);
}else{
this.fireOnNewListener=false;
this.firstLoad=false;
}
}
},addListener:function(_9){
this.listener=_9;
if(this.fireOnNewListener){
this.fireHistoryEvent(this.currentLocation);
this.fireOnNewListener=false;
}
},addEventListener:function(o,e,l){
if(o.addEventListener){
o.addEventListener(e,l,false);
}else{
if(o.attachEvent){
o.attachEvent("on"+e,function(){
l(window.event);
});
}
}
},add:function(_d,_e){
if(this.isSafari){
_d=this.removeHash(_d);
historyStorage.put(_d,_e);
this.currentLocation=_d;
window.location.hash=_d;
this.putSafariState(_d);
}else{
var _f=this;
var _10=function(){
if(_f.currentWaitTime>0){
_f.currentWaitTime=_f.currentWaitTime-_f.waitTime;
}
_d=_f.removeHash(_d);
if(MVC.$E(_d)&&_f.debugMode){
var e="Exception: History locations can not have the same value as _any_ IDs that might be in the document,"+" due to a bug in IE; please ask the developer to choose a history location that does not match any HTML"+" IDs in this document. The following ID is already taken and cannot be a location: "+_d;
throw new Error(e);
}
historyStorage.put(_d,_e);
_f.ignoreLocationChange=true;
_f.ieAtomicLocationChange=true;
_f.currentLocation=_d;
window.location.hash=_d;
if(_f.isIE){
_f.iframe.src=_f.blank_html_path+"blank.html?"+_d;
}
_f.ieAtomicLocationChange=false;
};
window.setTimeout(_10,this.currentWaitTime);
this.currentWaitTime=this.currentWaitTime+this.waitTime;
}
},isFirstLoad:function(){
return this.firstLoad;
},getVersion:function(){
return "0.6";
},getCurrentLocation:function(){
var r=this.getCurrentHash();
return r;
},getCurrentHash:function(){
var r=window.location.href;
var i=r.indexOf("#");
return (i>=0?r.substr(i+1):"");
},PAGELOADEDSTRING:"DhtmlHistory_pageLoaded",blank_html_path:MVC.mvc_root+"/plugins/dom/history/",listener:null,waitTime:200,currentWaitTime:0,currentLocation:null,iframe:null,safariHistoryStartPoint:null,safariStack:null,safariLength:null,ignoreLocationChange:null,fireOnNewListener:null,firstLoad:null,ieAtomicLocationChange:null,createIE:function(_15){
this.waitTime=400;
var _16=(historyStorage.debugMode?"width: 800px;height:80px;border:1px solid black;":historyStorage.hideStyles);
var _17="rshHistoryFrame";
var _18="<iframe frameborder=0\" id=\""+_17+"\" style=\""+_16+"\" src=\""+this.blank_html_path+"blank.html?"+_15+"\"></iframe>";
document.write(_18);
this.iframe=MVC.$E(_17);
},createOpera:function(){
this.waitTime=400;
var _19="<img src=\"javascript:location.href='javascript:MVC.History.checkLocation();';\" style=\""+historyStorage.hideStyles+"\" />";
document.write(_19);
},createSafari:function(){
var _1a="rshSafariForm";
var _1b="rshSafariStack";
var _1c="rshSafariLength";
var _1d=historyStorage.debugMode?historyStorage.showStyles:historyStorage.hideStyles;
var _1e=(historyStorage.debugMode?"width:800px;height:20px;border:1px solid black;margin:0;padding:0;":historyStorage.hideStyles);
var _1f=document.createElement("form");
_1f.id=_1a;
_1f.setAttribute("style",_1d);
_1f.innerHTML="<input type=\"text\" style=\""+_1e+"\" id=\""+_1b+"\" value=\"[]\"/>"+"<input type=\"text\" style=\""+_1e+"\" id=\""+_1c+"\" value=\"\"/>";
document.body.appendChild(_1f);
this.safariStack=MVC.$E(_1b);
this.safariLength=MVC.$E(_1c);
if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){
this.safariHistoryStartPoint=history.length;
this.safariLength.value=this.safariHistoryStartPoint;
}else{
this.safariHistoryStartPoint=this.safariLength.value;
}
},getSafariStack:function(){
var r=this.safariStack.value;
return historyStorage.fromJSON(r);
},getSafariState:function(){
var _21=this.getSafariStack();
var _22=_21[history.length-this.safariHistoryStartPoint-1];
return _22;
},putSafariState:function(_23){
var _24=this.getSafariStack();
_24[history.length-this.safariHistoryStartPoint]=_23;
this.safariStack.value=historyStorage.toJSON(_24);
},fireHistoryEvent:function(_25){
var _26=historyStorage.get(_25);
this.listener.call(null,_25,_26);
},checkLocation:function(){
if(!this.isIE&&this.ignoreLocationChange){
this.ignoreLocationChange=false;
return;
}
if(!this.isIE&&this.ieAtomicLocationChange){
return;
}
var _27=this.getCurrentLocation();
if(_27==this.currentLocation){
return;
}
this.ieAtomicLocationChange=true;
if(this.isIE&&this.getIframeHash()!=_27){
this.iframe.src=this.blank_html_path+"blank.html?"+_27;
}else{
if(this.isIE){
return;
}
}
this.currentLocation=_27;
this.ieAtomicLocationChange=false;
this.fireHistoryEvent(_27);
},getIframeHash:function(){
var doc=this.iframe.contentWindow.document;
var _29=String(doc.location.search);
if(_29.length==1&&_29.charAt(0)=="?"){
_29="";
}else{
if(_29.length>=2&&_29.charAt(0)=="?"){
_29=_29.substring(1);
}
}
return _29;
},removeHash:function(_2a){
var r;
if(_2a===null||_2a===undefined){
r=null;
}else{
if(_2a===""){
r="";
}else{
if(_2a.length==1&&_2a.charAt(0)=="#"){
r="";
}else{
if(_2a.length>1&&_2a.charAt(0)=="#"){
r=_2a.substring(1);
}else{
r=_2a;
}
}
}
}
return r;
},iframeLoaded:function(_2c){
if(this.ignoreLocationChange){
this.ignoreLocationChange=false;
return;
}
var _2d=String(_2c.search);
if(_2d.length==1&&_2d.charAt(0)=="?"){
_2d="";
}else{
if(_2d.length>=2&&_2d.charAt(0)=="?"){
_2d=_2d.substring(1);
}
}
window.location.hash=_2d;
}};
window.historyStorage={setup:function(_2e){
if(typeof _2e!=="undefined"){
if(_2e.debugMode){
this.debugMode=_2e.debugMode;
}
if(_2e.toJSON){
this.toJSON=_2e.toJSON;
}
if(_2e.fromJSON){
this.fromJSON=_2e.fromJSON;
}
}
var _2f="rshStorageForm";
var _30="rshStorageField";
var _31=this.debugMode?historyStorage.showStyles:historyStorage.hideStyles;
var _32=(historyStorage.debugMode?"width: 800px;height:80px;border:1px solid black;":historyStorage.hideStyles);
if(MVC.History.isSafari||MVC.Browser.Rhino){
var _33=document.createElement("form");
_33.id=_2f;
_33.setAttribute("style",_31);
_33.innerHTML="<textarea id=\""+_30+"\" style=\""+_32+"\"></textarea>";
document.body.appendChild(_33);
}else{
var _34="<form id=\""+_2f+"\" style=\""+_31+"\">"+"<textarea id=\""+_30+"\" style=\""+_32+"\"></textarea>"+"</form>";
document.write(_34);
}
this.storageField=MVC.$E(_30);
if(typeof window.opera!=="undefined"){
this.storageField.focus();
}
},put:function(key,_36){
this.assertValidKey(key);
if(this.hasKey(key)){
this.remove(key);
}
this.storageHash[key]=_36;
this.saveHashTable();
},get:function(key){
this.assertValidKey(key);
this.loadHashTable();
var _38=this.storageHash[key];
if(_38===undefined){
_38=null;
}
return _38;
},remove:function(key){
this.assertValidKey(key);
this.loadHashTable();
delete this.storageHash[key];
this.saveHashTable();
},reset:function(){
this.storageField.value="";
this.storageHash={};
},hasKey:function(key){
this.assertValidKey(key);
this.loadHashTable();
return (typeof this.storageHash[key]!=="undefined");
},isValidKey:function(key){
return (typeof key==="string");
},showStyles:"border:0;margin:0;padding:0;",hideStyles:"left:-1000px;top:-1000px;width:1px;height:1px;border:0;position:absolute;",debugMode:false,storageHash:{},hashLoaded:false,storageField:null,assertValidKey:function(key){
var _3d=this.isValidKey(key);
if(!_3d&&this.debugMode){
throw new Error("Please provide a valid key for window.historyStorage. Invalid key = "+key+".");
}
},loadHashTable:function(){
if(!this.hashLoaded){
var _3e=this.storageField.value;
if(_3e!==""&&_3e!==null){
this.storageHash=this.fromJSON(_3e);
this.hashLoaded=true;
}
}
},saveHashTable:function(){
this.loadHashTable();
var _3f=this.toJSON(this.storageHash);
this.storageField.value=_3f;
},toJSON:function(o){
return JSON.stringify(o);
},fromJSON:function(s){
return JSON.parse(s);
}};
if(typeof Prototype=="undefined"){
window.MVC.History.create();
}else{
window.MVC.History.create({toJSON:function(o){
return Object.toJSON(o);
},fromJSON:function(s){
return s.evalJSON();
}});
}
MVC.Event.observe(window,"load",function(){
MVC.History.initialize();
MVC.History.addListener(MVC.History.historyChange);
if(MVC.History.fireInitialChange){
MVC.History.historyChange();
}
});
MVC.Controller.test_dispatch=function(_44,_45){
if(!_44){
return false;
}
return MVC.Controller.get_controller_with_name_and_action(_44,_45)!=null;
};
MVC.History.historyChange=function(_46,_47){
var _48=new MVC.Path(location.href);
var _49=MVC.Path.get_data(_48);
var _4a=_48.folder();
var _4b=null,_4c;
if(!_4a){
_4a="index";
}
var _4d=_4a.indexOf("/");
var _4e=new MVC.Controller.Params(_49);
if(_4d!=-1){
_4c=_4a.substring(0,_4d);
_4b=_4a.substring(_4d+1);
}else{
if(MVC.Controller.test_dispatch("main",_4a)){
_4c="main";
_4b=_4a;
}else{
if(MVC.History.throwErrors){
throw "Can't dispatch location "+_4a;
}
return;
}
}
var _4f=MVC.Controller.get_controller_with_name_and_action(_4c,_4b);
var _50=null;
if(!_4f){
if(MVC.History.throwErrors){
throw "Can't dispatch location "+_4a;
}
}else{
_50=_4f.dispatch(_4b,_4e);
}
OpenAjax.hub.publish("history."+_4a.replace("/","."),_4e);
return _50;
};
MVC.Path=function(_51){
this.path=_51;
};
MVC.Path.prototype={domain:function(){
var lhs=this.path.split("#")[0];
return "/"+lhs.split("/").slice(3).join("/");
},folder:function(){
var _53=this.path.indexOf("#");
if(_53==-1){
return null;
}
var _54=this.path.substring(_53+1);
var _55=_54.indexOf("&");
if(_55==-1){
return _54.indexOf("=")!=-1?null:_54;
}
return _54.substring(0,_55);
},params:function(){
var _56=this.path.indexOf("#");
if(_56==-1){
return null;
}
var _57=this.path.substring(_56+1);
var _58=_57.indexOf("&");
if(_58==-1){
return _57.indexOf("=")!=-1?_57:null;
}
return (_57.substring(0,_58).indexOf("=")==-1?_57.substring(_58+1):_57);
}};
MVC.Path.get_data=function(_59){
var _5a=_59.params();
if(!_5a||!_5a.match(/([^?#]*)(#.*)?$/)){
return {};
}
var _5b={};
var _5c=_5a.split("&");
for(var i=0;i<_5c.length;i++){
var _5e=_5c[i].split("=");
if(_5e.length!=2){
continue;
}
var key=decodeURIComponent(_5e[0]),_60=decodeURIComponent(_5e[1]);
var _61=MVC.String.rsplit(key,/\[[^\]]*\]/);
if(_61.length>1){
var _62=_61.length-1;
var _63=_61[0].toString();
if(!_5b[_63]){
_5b[_63]={};
}
var _64=_5b[_63];
for(var k=1;k<_62;k++){
_63=_61[k].substring(1,_61[k].length-1);
if(!_64[_63]){
_64[_63]={};
}
_64=_64[_63];
}
_64[_61[_62].substring(1,_61[_62].length-1)]=_60;
}else{
if(key in _5b){
if(typeof _5b[key]=="string"){
_5b[key]=[_5b[key]];
}
_5b[key].push(_60);
}else{
_5b[key]=_60;
}
}
}
return _5b;
};
MVC.Object.extend(MVC.Controller.prototype,{redirect_to:function(_66){
var _67=this._get_history_point(_66);
var _68=window.location.href.split("#")[0];
window.location=_68+_67;
},history_add:function(_69,_6a){
var _6b=this._get_history_point(_69);
MVC.History.add(_6b,_6a);
},_get_history_point:function(_6c){
var _6d=_6c.controller||this.Class.className;
var _6e=_6c.action||"index";
if(_6c.controller){
delete _6c.controller;
}
if(_6c.action){
delete _6c.action;
}
var _6f=(_6c)?MVC.Object.to_query_string(_6c):"";
if(_6f.length){
_6f="&"+_6f;
}
return "#"+_6d+"/"+_6e+_6f;
},path:function(){
return new MVC.Path(location.href);
},path_data:function(){
return MVC.Path.get_data(this.path());
}});
;
include.set_path('jmvc/rhino/documentation');
if(typeof load!="undefined"&&!MVC.load_doc){
load("jmvc/plugins/lang/standard_helpers.js");
load("jmvc/plugins/view/view.js");
load("jmvc/plugins/lang/class/setup.js");
load("jmvc/rhino/documentation/application.js");
load("jmvc/rhino/documentation/pair.js");
load("jmvc/rhino/documentation/directives.js");
load("jmvc/rhino/documentation/function.js");
load("jmvc/rhino/documentation/class.js");
load("jmvc/rhino/documentation/constructor.js");
load("jmvc/rhino/documentation/file.js");
load("jmvc/rhino/documentation/add.js");
load("jmvc/rhino/documentation/static.js");
load("jmvc/rhino/documentation/prototype.js");
load("jmvc/rhino/documentation/attribute.js");
}else{
include.plugins("view","lang/class");
include("application","pair","directives","function","class","constructor","file","add","static","prototype","attribute");
}
;
include.set_path('jmvc/rhino/documentation');
MVC.render_to=function(_1,_2,_3){
var v=new View({text:readFile(_2),name:_2});
MVCOptions.save(_1,v.render(_3));
};
MVC.Doc={render_to:function(_5,_6,_7){
MVCOptions.save(_5,this.render(_6,_7));
},render:function(_8,_9){
var v=new View({text:readFile(_8),name:_8});
return v.render(_9);
},link_content:function(_b){
return _b.replace(/\[\s*([^\|\]\s]*)\s*\|?\s*([^\]]*)\s*\]/g,function(_c,_d,n){
var _f=MVC.Doc.objects[_d];
if(_f){
if(!n){
n=_d.replace(/\.prototype|\.static/,"");
}
return "<a href='"+_f+"'>"+n+"</a>";
}else{
if(typeof _d=="string"&&_d.match(/^https?|www\.|#/)){
return "<a href='"+_d+"'>"+(n||_d)+"</a>";
}
}
return _c;
});
},link:function(_10){
var url=MVC.Doc.objects[_10];
return url?"<a href='"+url+"'>"+_10+"</a>":_10;
},objects:{},get_template:function(_12){
var _13=readFile("docs/templates/"+_12+".ejs");
if(!_13){
_13=readFile("jmvc/rhino/documentation/templates/"+_12+".ejs");
}
var v=new View({text:_13,name:_12});
return v;
}};
MVC.Doc.Application=function(_15,_16){
this.name=_16;
this.total=_15;
this.files=[];
for(var s=0;s<_15.length;s++){
script=_15[s];
if(typeof script=="string"){
script=_15[s]={path:script,text:readFile(script)};
}
if(typeof script!="function"&&!script.process){
this.files.push(new MVC.Doc.File(_15[s]));
}
}
};
MVC.Doc.Application.prototype={generate:function(){
this.all_sorted=MVC.Doc.Class.listing.concat(MVC.Doc.Constructor.listing).sort(MVC.Doc.Pair.sort_by_name);
var _18=this.left_side();
for(var i=0;i<MVC.Doc.Class.listing.length;i++){
MVC.Doc.Class.listing[i].toFile(_18);
}
for(var i=0;i<MVC.Doc.Constructor.listing.length;i++){
MVC.Doc.Constructor.listing[i].toFile(_18);
}
this.summary_page(_18);
},left_side:function(){
return readFile("docs/templates/left_side.ejs")?MVC.Doc.render("docs/templates/left_side.ejs",this):MVC.Doc.render("jmvc/rhino/documentation/templates/left_side.ejs",this);
},get_name:function(i){
var me=this.all_sorted[i].name;
if(i==0){
return me;
}
var _1c=this.all_sorted[i-1].name;
var t=me.split(/\./);
var p=_1c.split(/\./);
var _1f=[],_20=[];
for(var j=0;j<t.length;j++){
if(p[j]&&p[j]==t[j]){
_1f.push(t[j]);
}else{
_20.push(t[j]);
}
}
return (_1f.length>0?"<span class='matches_previous'>"+_1f.join(".")+".</span>":"")+_20.join(".");
},summary_page:function(_22){
MVC.Doc.render_to("docs/"+this.name+".html","jmvc/rhino/documentation/templates/summary.ejs",this);
},clean_path:function(_23){
return _23;
var _24=_23.split("/");
if(_24.length>5){
_24=_24.slice(_24.length-5);
}
return _24.join("/");
}};
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Pair=MVC.Class.extend({code_match:function(){
return null;
},classes:[],extended:function(_1){
if(_1.className){
this.classes.push(_1);
}
},create:function(_2,_3,_4){
var _5=_2.match(/^@(\w+)/),_6;
if(!(_6=this.has_type(_5?_5[1]:null))){
_6=this.guess_type(_3);
}
if(!_6){
return null;
}
return new _6(_2,_3,_4);
},has_type:function(_7){
if(!_7){
return null;
}
for(var i=0;i<this.classes.length;i++){
if(this.classes[i].className.toLowerCase()==_7.toLowerCase()){
return this.classes[i];
}
}
return null;
},guess_type:function(_9){
for(var i=0;i<this.classes.length;i++){
if(this.classes[i].code_match(_9)){
return this.classes[i];
}
}
return null;
},starts_scope:false,sort_by_full_name:function(a,b){
var af=a.full_name?a.full_name.toLowerCase():a.full_name;
var bf=b.full_name?b.full_name.toLowerCase():a.full_name;
if(af==bf){
return 0;
}
return af>bf?1:-1;
},sort_by_name:function(a,b){
var af=a.name?a.name.toLowerCase():a.name;
var bf=b.name?b.name.toLowerCase():a.name;
if(af==bf){
return 0;
}
return af>bf?1:-1;
},init:function(){
if(this.className){
this._view=MVC.Doc.get_template(this.className);
}
},add:function(){
var _13=MVC.Array.from(arguments);
for(var i=0;i<_13.length;i++){
this._add(_13[i]);
}
},_add:function(_15){
var _16=_15.className+"_";
this.prototype[_16+"add"]=_15.prototype.add;
if(_15.prototype.add_more){
this.prototype[_16+"add_more"]=_15.prototype.add_more;
}
}},{init:function(_17,_18,_19){
this.children=[];
this.comment=_17;
this.code=_18;
this.add_parent(_19);
if(this.Class.code_match(this.code)){
this.code_setup();
}
this.comment_setup();
var par=this;
while(par&&!par.url){
par=par.parent;
}
if(par){
MVC.Doc.objects[this.full_name()]=par.url()+(this.url?"":"#"+this.full_name());
}
},add:function(_1b){
this.children.push(_1b);
},add_parent:function(_1c){
this.parent=_1c;
this.parent.add(this);
},scope:function(){
return this.Class.starts_scope?this:this.parent;
},code_setup:function(){
},toHTML:function(){
return this.Class._view.render(this);
},full_name:function(){
var par=this.parent.full_name();
return (par?par+".":"")+this.name;
},make:function(arr){
var res=["<div>"];
for(var c=0;c<arr.length;c++){
var _21=arr[c];
res.push(_21.toHTML());
}
res.push("</div>");
return res.join("");
},linker:function(){
var _22=[{name:this.name,full_name:this.full_name()}];
if(this.children){
for(var c=0;c<this.children.length;c++){
var _24=this.children[c].linker();
if(_24){
_22=_22.concat(_24);
}
}
}
return _22;
},ordered_params:function(){
var arr=[];
for(var n in this.params){
var _27=this.params[n];
arr[_27.order]=_27;
}
return arr;
},comment_setup:function(){
var i=0;
var _29=this.comment.split("\n");
this.real_comment="";
if(!this.params){
this.params={};
}
if(!this.ret){
this.ret={type:"undefined",description:""};
}
var _2a,_2b;
for(var l=0;l<_29.length;l++){
var _2d=_29[l];
var _2e=_2d.match(/^[\s*]?@(\w+)/);
if(_2e){
var _2f=(_2e[1]+"_add").toLowerCase();
if(!this[_2f]){
this.real_comment+=_2d+"\n";
continue;
}
_2b=this[_2f](_2d);
if(_2b){
_2a=_2e[1].toLowerCase();
}else{
_2a=null;
}
}else{
if(!_2d.match(/^constructor/i)&&!_2a){
this.real_comment+=_2d+"\n";
}else{
if(_2a&&this[_2a+"_add_more"]){
this[_2a+"_add_more"](_2d,_2b);
}
}
}
}
if(this.comment_setup_complete){
this.comment_setup_complete();
}
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Directive=MVC.Class.extend({add:function(_1){
var m=_1.match(/^\s*@(\w+)\s*(.*)/);
if(m){
this[m[1]]=m[2];
}
}});
MVC.Doc.Directive.Init=MVC.Doc.Directive.extend("init",{add:function(_3){
var _4=_3.match(/\s?@init(.*)?/);
if(!_4||!_4[1]){
this.init_description=" ";
return true;
}
this.init_description=_4.pop();
return this.init_description;
},add_more:function(_5){
this.init_description+="\n"+_5;
}});
MVC.Doc.Directive.Param=MVC.Doc.Directive.extend("param",{add_more:function(_6,_7){
if(_7){
_7.description+="\n"+_6;
}
},add:function(_8){
var _9=_8.match(/\s*@param\s+(?:\{(?:(optional):)?([^}]+)\})?\s+([\w\.]+) ?(.*)?/);
if(!_9){
print("LINE: \n"+_8+"\n does not match @params {optional:TYPE} NAME DESCRIPTION");
return;
}
var _a=_9.pop();
var n=_9.pop();
var _c=this.params[n]?this.params[n]:this.params[n]={order:this.ordered_params().length};
_c.description=_a||"";
_c.name=n;
_c.type=_9.pop()||"";
_c.optional=_9.pop()?true:false;
return this.params[n];
}});
MVC.Doc.Directive.Inherits=MVC.Doc.Directive.extend("inherits",{add:function(_d){
var m=_d.match(/^\s*@\w+ ([\w\.]+)/);
if(m){
this.inherits=m[1];
}
}});
MVC.Doc.Directive.Return=MVC.Doc.Directive.extend("return",{add:function(_f){
var _10=_f.match(/\s*@return\s+(?:\{([\w\.\/]+)\})?\s*(.*)?/);
if(!_10){
return;
}
var _11=_10.pop()||"";
var _12=_10.pop();
this.ret={description:_11,type:_12};
return this.ret;
},add_more:function(_13){
this.ret.description+="\n"+_13;
}});
MVC.Doc.Directive.Author=MVC.Doc.Directive.extend("author",{add:function(_14){
var m=_14.match(/^\s*@author\s*(.*)/);
if(m){
this.author=m[1];
}
}});
MVC.Doc.Directive.Hide=MVC.Doc.Directive.extend("hide",{add:function(_16){
var m=_16.match(/^\s*@hide/);
if(m){
this.hide=true;
}
}});
MVC.Doc.Directive.CodeStart=MVC.Doc.Directive.extend("code_start",{add:function(_18){
var m=_18.match(/^\s*@code_start\s*([\w-]*)\s*(.*)/);
if(m){
this.comment_code_type=m[1]?m[1].toLowerCase():"javascript";
this.comment_code=[];
return true;
}
},add_more:function(_1a){
this.comment_code.push(_1a);
}});
MVC.Doc.Directive.CodeEnd=MVC.Doc.Directive.extend("code_end",{add:function(_1b){
var m=_1b.match(/^\s*@code_end/);
if(m){
this.real_comment+="<pre><code class='"+this.comment_code_type+"'>"+this.comment_code.join("\n")+"</code></pre>";
}
return false;
}});
MVC.Doc.Directive.Alias=MVC.Doc.Directive.extend("alias",{add:function(_1d){
var m=_1d.match(/^\s*@alias\s*([\w\-\.]*)/);
if(m){
this.alias=m[1];
}
}});
MVC.Doc.Directive.Plugin=MVC.Doc.Directive.extend("plugin",{add:function(_1f){
this.plugin=_1f.match(/@plugin ([^ ]+)/)[1];
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Function=MVC.Doc.Pair.extend("function",{code_match:/(?:([\w\.]+)|(["'][^"']+["']))\s*[:=]\s*function\(([^\)]*)/,init:function(){
this.add(MVC.Doc.Directive.Return,MVC.Doc.Directive.Param,MVC.Doc.Directive.CodeStart,MVC.Doc.Directive.CodeEnd,MVC.Doc.Directive.Plugin);
this._super();
}},{code_setup:function(){
var _1=this.Class.code_match(this.code);
if(!_1){
_1=this.code.match(/\s*function\s+([\w\.\$]+)\s*(~)?\(([^\)]*)/);
}
this.name=_1[1]?_1[1].replace(/^this\./,""):_1[2];
this.params={};
this.ret={type:"undefined",description:""};
var _2=_1[3].match(/\w+/g);
if(!_2){
return;
}
for(var i=0;i<_2.length;i++){
this.params[_2[i]]={description:"",type:"",optional:false,order:i,name:_2[i]};
}
},function_add:function(_4){
var m=_4.match(/^@\w+\s+([\w\.\$]+)/);
if(m){
this.name=m[1];
}
},signiture:function(){
var _6=[];
var _7=this.ordered_params();
for(var n=0;n<_7.length;n++){
_6.push(_7[n].name);
}
var n=this.name;
return n+"("+_6.join(", ")+") -> "+this.ret.type;
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Class=MVC.Doc.Pair.extend("class",{code_match:/([\w\.]+)\s*=\s*([\w\.]+?).extend\(/,starts_scope:true,listing:[],init:function(){
this.add(MVC.Doc.Directive.Inherits,MVC.Doc.Directive.Author,MVC.Doc.Directive.Hide,MVC.Doc.Directive.CodeStart,MVC.Doc.Directive.CodeEnd,MVC.Doc.Directive.Alias,MVC.Doc.Directive.Plugin);
this._super();
var _1="jmvc/rhino/documentation/templates/file.ejs";
this._file_view=MVC.Doc.get_template("file");
}},{init:function(_2,_3,_4){
this._super(_2,_3,_4);
this.Class.listing.push(this);
},comment_setup_complete:function(){
if(!this.name){
print("Error! No name defined for \n-----------------------");
print(this.comment);
print("-----------------------");
}
},add_parent:function(_5){
while(_5.Class.className!="file"){
_5=_5.parent;
}
this.parent=_5;
this.parent.add(this);
},code_setup:function(){
var _6=this.code.match(this.Class.code_match);
this.name=_6[1];
this.inherits=_6[2];
},class_add:function(_7){
var m=_7.match(/^@\w+ ([\w\.]+)/);
if(m){
this.name=m[1];
}
},toFile:function(_9){
this.summary=_9;
try{
var _a=this.Class._file_view.render(this);
MVCOptions.save("docs/classes/"+this.name+".html",_a);
}
catch(e){
print("Unable to generate class for "+this.name+" !");
print("  Error: "+e);
}
},get_quicklinks:function(){
var _b=this.linker().sort(MVC.Doc.Pair.sort_by_full_name);
var _c=[];
for(var i=0;i<_b.length;i++){
var _e=_b[i];
_c.push("<a href='#"+_e.full_name+"'>"+_e.name+"</a>");
}
return _c.join(", ");
},cleaned_comment:function(){
return MVC.Doc.link_content(this.real_comment).replace(/\n\s*\n/g,"<br/><br/>");
},url:function(){
return this.name+".html";
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Constructor=MVC.Doc.Pair.extend("constructor",{code_match:MVC.Doc.Function.code_match,starts_scope:true,listing:[],create_index:function(){
var _1="<html><head><link rel=\"stylesheet\" href=\"../style.css\" type=\"text/css\" />"+"<title>Constructors</title></head><body>";
_1+="<h1>Constructors <label>LIST</label></h1>";
for(var i=0;i<this.listing.length;i++){
var _3=this.listing[i].name;
_1+="<a href='"+_3+".html'>"+_3+"</a> ";
}
_1+="</body></html>";
MVCOptions.save("docs/constructors/index2.html",_1);
},init:function(){
this.add(MVC.Doc.Directive.Init,MVC.Doc.Directive.Param,MVC.Doc.Directive.Inherits,MVC.Doc.Directive.Author,MVC.Doc.Directive.Return,MVC.Doc.Directive.Hide,MVC.Doc.Directive.CodeStart,MVC.Doc.Directive.CodeEnd,MVC.Doc.Directive.Alias,MVC.Doc.Directive.Plugin);
this._super();
this._file_view=MVC.Doc.get_template("file");
}},{init:function(_4,_5,_6){
this._super(_4,_5,_6);
this.Class.listing.push(this);
},add_parent:function(_7){
while(_7.Class.className!="file"){
_7=_7.parent;
}
this.parent=_7;
this.parent.add(this);
},code_setup:MVC.Doc.Function.prototype.code_setup,toFile:function(_8){
this.summary=_8;
var _9=this.Class._file_view.render(this);
MVCOptions.save("docs/classes/"+this.name+".html",_9);
},get_quicklinks:function(){
var _a=this.linker().sort(MVC.Doc.Pair.sort_by_full_name);
var _b=[];
for(var i=0;i<_a.length;i++){
var _d=_a[i];
_b.push("<a href='#"+_d.full_name+"'>"+_d.name+"</a>");
}
return _b.join(", ");
},signiture:function(){
var _e=[];
var _f=this.ordered_params();
for(var n=0;n<_f.length;n++){
_e.push(_f[n].name);
}
var n=this.alias?this.alias:this.name;
if(this.ret.type=="undefined"){
n="new "+n;
this.ret.type=this.alias?this.alias.toLowerCase():this.name.toLowerCase();
}
return n+"("+_e.join(", ")+") -> "+this.ret.type;
},cleaned_comment:function(){
return MVC.Doc.link_content(this.real_comment).replace(/\n\s*\n/g,"<br/><br/>");
},url:function(){
return this.name+".html";
},comment_setup_complete:function(){
if(!this.name){
print("Error! No name defined for \n-----------------------");
print(this.comment);
print("-----------------------");
}else{
if(!this.init_description){
print("Error! No init_description defined for "+this.name+"\n-----------------------");
print(this.comment);
print("-----------------------");
}
}
},constructor_add:function(_11){
var m=_11.match(/^@\w+ ([\w\.]+)/);
if(m){
this.name=m[1];
}
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.File=MVC.Doc.Pair.extend("file",{group:new RegExp("(?:/\\*(?:[^*]|(?:\\*+[^*/]))*\\*+/[^\\w\\{\\(\\[/]*[^\\n]*)","g"),splitter:new RegExp("(?:/\\*+((?:[^*]|(?:\\*+[^*/]))*)\\*+/[^\\w\\{\\(\\[\"']*([^\\r\\n]*))")},{init:function(_1){
this.children=[];
this.name=_1.path;
this.src=_1.text;
print("   "+this.name);
this.generate();
},generate:function(){
var _2=this.src.match(this.Class.group);
var _3=this;
if(!_2){
return;
}
for(var i=0;i<_2.length;i++){
var _5=_2[i].match(this.Class.splitter);
var _6=_5[1].replace(/^[^\w@]*/,"").replace(/\r?\n(\s*\*+)?/g,"\n");
var _7=_5[2];
var _8=MVC.Doc.Pair.create(_6,_7,_3);
if(_8){
_3=_8.scope();
}
}
},clean_comment:function(_9){
return _9.replace(/\/\*|\*\//,"").replace(/\r?\n\s*\*?\s*/g,"\n");
},full_name:function(){
return "";
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Add=MVC.Doc.Pair.extend("add",{comment_setup:MVC.Doc.Function.prototype.comment_setup,add_add:function(_1){
var m=_1.match(/^@add\s+([\w\.]+)\s+([\w\.]+)?/i);
if(m){
this.sub_scope=m.pop().toLowerCase();
this.scope_name=m.pop();
}
},scope:function(){
var _3=MVC.Doc.Class;
var _4;
for(var l=0;l<_3.listing.length;l++){
if(_3.listing[l].name==this.scope_name){
_4=_3.listing[l];
break;
}
}
if(!_4){
var _3=MVC.Doc.Constructor;
for(var l=0;l<_3.listing.length;l++){
if(_3.listing[l].name==this.scope_name){
_4=_3.listing[l];
break;
}
}
}
if(!_4){
return this;
}
if(this.sub_scope){
var _6=_4.children;
var _7;
for(var i=0;i<_6.length;i++){
if(_6[i].Class.className.toLowerCase()==this.sub_scope.toLowerCase()){
_7=_6[i];
break;
}
}
if(_7){
return _7;
}
}
return _4;
},toHTML:function(){
return "";
},linker:function(){
}});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Static=MVC.Doc.Pair.extend("static",{starts_scope:true},{add_parent:function(_1){
var _2=_1.Class.className;
this.parent=_2=="class"||_2=="constructor"?_1:_1.parent;
if(_2!="file"&&this.parent){
this.parent.add(this);
}
},name:"static"});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Prototype=MVC.Doc.Static.extend("prototype",{name:"prototype"});
;
include.set_path('jmvc/rhino/documentation');
MVC.Doc.Attribute=MVC.Doc.Pair.extend("attribute",{code_match:function(_1){
return _1.match(/(\w+)\s*[:=]\s*/)&&!_1.match(/(\w+)\s*[:=]\s*function\(([^\)]*)/);
}},{code_setup:function(){
var _2=this.code.match(/(\w+)\s*[:=]\s*/);
this.name=_2[1];
},attribute_add:function(_3){
var m=_3.match(/^@\w+ ([\w\.]+)/);
if(m){
this.name=m[1];
}
}});
;
include.next_function();
include.end_of_production();