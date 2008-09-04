MVC.Validations = MVC.Class.extend({
	// static
}, {
	// prototype
	init: function(attribute, error_message){
		this.attribute = attribute;
		this.error_message = error_message;
	},
	
	get_value: function(model) {
		return model[this.attribute];
	},
	
	is_valid: function(model) {
		return true;
	}
});

include('validate_format_of');