new MVC.Test.Unit('position',{
   test_positioin: function() {
      MVC.$E('testarea').innerHTML = "<div id='first'>first</div><div id='second'>second</div>";
      this.assert_equal(4, MVC.Position.compare(MVC.$E('first'), MVC.$E('second')))
      this.assert_equal(2, MVC.Position.compare( MVC.$E('second'),MVC.$E('first')  ))
      this.assert_equal(0, MVC.Position.compare( MVC.$E('first'),MVC.$E('first')  ))
      this.assert_equal(16+4, MVC.Position.compare( MVC.$E('testarea'),MVC.$E('first')  ))
      this.assert_equal(8+2, MVC.Position.compare( MVC.$E('second'),MVC.$E('testarea')  ))
   }
});