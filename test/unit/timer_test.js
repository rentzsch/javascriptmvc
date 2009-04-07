new jQuery.Test.Unit('timer',{
   test_timer: function() {
      var timer = new MVC.Timer({
          time: 1000,
          from: 10,
          to: -1,
          onComplete: this.next_callback('timer_complete')
      })
      timer.start();
   },
   timer_complete : function(value){
       this.assert_equal(-1, value);
   }
});