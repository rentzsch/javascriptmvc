new MVC.Test.Unit('ajax',{
	test_normal_request : function(){
        new MVC.Ajax('fixtures/ajax/request.xml', {onComplete: this.next_callback('normal'), use_fixture: false } );
	},
	normal : function(response){
		this.assert_equal("<data>one</data>", response.responseText);
	},
	test_fixture_request : function(){
		new MVC.Ajax('ajax/request.xml', {onComplete: this.next_callback('fixture') } );
	},
	fixture : function(response){
		this.assert_equal("<data>two</data>", response.responseText)
	},
	test_success_request : function(){
		new MVC.Ajax('fixtures/ajax/request.xml', {onSuccess: this.next_callback('success'), use_fixture: false } );
	},
	success : function(response){
		this.assert_equal("<data>one</data>", response.responseText);
	},
	test_fail_request : function(){
		if(location.href.match(/file:|c:\\/) ) {
			this.messages.push("Skipping because test doesn't work on filesystem.");
			return;
		}
		new MVC.Ajax('fixtures/ajax/reuest.xml', {onFailure: this.next_callback('failure'), use_fixture: false } );
	},
	failure : function(){
		this.assert(true)
	}
});
/*
new MVC.Test.Unit('conflict_ajax',{
	test_normal_request : function(){
		if(window.Prototype) {
			this.messages.push("Skipping because Prototype's Ajax overwrites.");
			return;
		}
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		new Ajax('fixtures/ajax/request.xml', {onComplete: this.next_callback(), use_fixture: false } )
	},
	normal : function(response){
		this.assert_equal("<data>one</data>", response.responseText);
	}
})*/