new MVC.Test.Unit('translation',{
   test_translate: function() {
      this.assert_equal("Hola", MVC.$T('hi'));
   }
});