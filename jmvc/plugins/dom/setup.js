
jQuery.fn.makePositioned = function() {
  return this.each(function(){
        var pos = this.style.position;
        if (pos == 'static' || !pos) {
          this.style.position = 'relative';
          if (window.opera) {
            element.style.top = 0;
            element.style.left = 0;
          }
        }
  });
};