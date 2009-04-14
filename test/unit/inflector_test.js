$.Test.Unit.extend('Inflector',{
	test_singularize : function(){
		this.assertEqual('person', jQuery.String.singularize('people'));
		this.assertEqual('dog', jQuery.String.singularize('dogs'));
		this.assertEqual('woman', jQuery.String.singularize('women'));
	},
	test_pluralize : function(){
		this.assertEqual('people', jQuery.String.pluralize('person'));
		this.assertEqual('dogs', jQuery.String.pluralize('dog'));
		this.assertEqual('women', jQuery.String.pluralize('woman'));
	}
});