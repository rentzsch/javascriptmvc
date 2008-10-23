DragsController = MVC.Controller.extend('drags',{
    dragstart: function(params){
        params.revert();
        document.documentElement.style.backgroundColor = 
            'rgb('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+  ')'
    },
    dragging: function(params){
        params.element.style.backgroundColor = 
            'rgb('+128+','+128+','+parseInt(Math.random()*255)+  ')'
    },
    dragend: function(params){
        document.documentElement.style.backgroundColor = 
            'rgb('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+  ')'
    },
    mouseover : function(params){
        params.element.style.backgroundColor = '#ddddff'
    },
    mouseout : function(params){
        params.element.style.backgroundColor = ''
    },
    load : function(){
        $(".block").draggable({revert: true});
    }
})

AnimationsController = MVC.Controller.extend('animations',{
  click : function(params){
      new MVC.Animate(params.element, {width: "100px"});
  },
  "# click" : function(){
      $("#animations").animate({width: "100px"})
  }
})

DropsController = MVC.Controller.extend('drops',{
    dragover : function(params){ //the element being hovered over, dropped_element
        params.element.style.backgroundColor = "Gray";
        
    },
    dropped : function(params){
       params.element.style.backgroundColor = "Yellow"
    },
    dragout : function(params){
        params.element.style.backgroundColor = ""
    }
});


