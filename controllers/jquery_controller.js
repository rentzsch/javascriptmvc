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


MVC.Controller.extend("Controllers.Main", {
    "a click" : function(element, event){
        console.log(element, event)
    }
})