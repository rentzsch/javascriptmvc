jQuery.Class.extend("Animal",
{
    count: 0,
    test : function(){
        return this.match ? true : false
    }
},
{
    init : function(){
        this.Class.count++;
        this.eyes = false;
    }
}
);
Animal.extend("Dog",
{
    match : /abc/
},
{
    init: function(){
        this._super();
    }
});
Dog.extend("Ajax",
{
    count : 0
},
{
    init : function(hairs){
        this._super();
        this.hairs = hairs;
        this.setEyes();
        
    },
    setEyes : function(){
        this.eyes = true;
    }
});
new Dog();
new Animal();
new Animal();
ajax = new Ajax(1000);


jQuery.Test.Unit.extend("Tests.Class",{
    init : function(){ //setup code
        $.Console.log("init")
    },
    destroy : function(){ //teardown code
        $.Console.log("destroy")
    },
    test_count: function() {
       this.assertEqual(2, Animal.count);
       this.assertEqual(1, Dog.count)
       this.assert(Dog.match)
       this.assertNot(Animal.match)
       this.assert(Dog.test())
       this.assertNot(Animal.test())
       this.assertEqual(1, Ajax.count)
       this.assertEqual(2, Animal.count);
       this.assertEqual(true, ajax.eyes);
       this.assertEqual(1000, ajax.hairs);
    },
    test_something : function(){
        
    }
});