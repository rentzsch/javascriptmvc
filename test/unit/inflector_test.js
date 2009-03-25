MVC.Test.Unit.extend('Inflector',{
	test_singularize : function(){
		this.assertEqual('person', MVC.String.singularize('people'));
		this.assertEqual('dog', MVC.String.singularize('dogs'));
		this.assertEqual('woman', MVC.String.singularize('women'));
	},
	test_pluralize : function(){
		this.assertEqual('people', MVC.String.pluralize('person'));
		this.assertEqual('dogs', MVC.String.pluralize('dog'));
		this.assertEqual('women', MVC.String.pluralize('woman'));
	},
	test_conflict_singular : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assertEqual('person', 'people'.singularize());
		this.assertEqual('dog', 'dogs'.singularize());
	},
	test_conflict_pluralize : function(){
		if(MVC._no_conflict) {
			this.messages.push("Skipping because no_conflict mode is on.");
			return;
		}
		this.assertEqual('people', 'person'.pluralize(), "OK if no conflict");
		this.assertEqual('dogs', 'dog'.pluralize(), "OK if no conflict");
	}
});