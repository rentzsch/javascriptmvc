/*$().delegate("a","click",function(e){
   alert('a')
    
})
$().delegate("#container","click",function(e){
    alert('container')
})


$().delegate("#two","click",function(e){
    alert('tow')
    e.stopDelegation();
})*/


MVC.Controller.extend("Controllers.Tests", {
    "a click" : function(element, event){
        var i = 0;
        var el = element.controllerParent();
        var b = 1;
    }
})