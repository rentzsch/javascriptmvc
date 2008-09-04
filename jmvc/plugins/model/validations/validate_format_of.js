MVC.ValidateFormatOf = MVC.Validations.extend({
	// static
}, {
	// prototype
	
	init: function(attribute, format, error_message) {
		this._super(attribute, error_message);
		this.format = format;
	},
	
	is_valid: function(model) {
		return this.format.test(this.get_value(model));
	}
});