new MVC.Test.Unit('vector',{
   test_init: function() {
      var vector = new MVC.Vector(-10, 5);
      this.assert_equal(-10, vector[0]);
      this.assert_equal(-10, vector.x());
      this.assert_equal(-10, vector.left());
      this.assert_equal(5, vector[1]);
      this.assert_equal(5, vector.y());
      this.assert_equal(5, vector.top());
   },
   test_plus: function(){
       var vector = new MVC.Vector(-10, 5);
       var v2 = vector.plus(3, -2);
       this.assert_equal(-7, v2[0]);
       this.assert_equal(3, v2[1]);
       var v3 = vector.plus(v2);
       this.assert_equal(-17, v3[0]);
       this.assert_equal(8, v3[1]);
       
   },
   test_minus: function(){
       var vector = new MVC.Vector(-10, 5);
       var v2 = vector.minus(3, -2);
       this.assert_equal(-13, v2[0]);
       this.assert_equal(7, v2[1]);
       var v3 = vector.minus(v2);
       this.assert_equal(3, v3[0]);
       this.assert_equal(-2, v3[1]);
   },
   test_app : function(){
        var vector = new MVC.Vector(-10, 5);
        var v2 = vector.app(function(i){return i*i;})
        this.assert_equal(100, v2[0]);
        this.assert_equal(25, v2[1]);
   }
});