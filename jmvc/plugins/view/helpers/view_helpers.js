// JavaScriptMVC framework and server, 1.1.22
//  - built on 2008/05/07 19:44
/**
 * @add constructor MVC.View.Helpers Prototype
 */
MVC.Object.extend(MVC.View.Helpers.prototype, {
    /**
     * Creates a check box tag
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} options
     * @param {Object} checked
     */
	check_box_tag: function(name, value, options, checked){
        options = options || {};
        if(checked) options.checked = "checked";
        return this.input_field_tag(name, value, 'checkbox', options);
    },
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} html_options
     */
    date_tag: function(name, value , html_options) {
	    if(! (value instanceof Date)) value = new Date();
		
		var years = [], months = [], days =[];
		var year = value.getFullYear(), month = value.getMonth(), day = value.getDate();
		for(var y = year - 15; y < year+15 ; y++) years.push({value: y, text: y});
		for(var m = 0; m < 12; m++) months.push({value: (m), text: MVC.Date.month_names[m]});
		for(var d = 0; d < 31; d++) days.push({value: (d+1), text: (d+1)});
		
		var year_select = this.select_tag(name+'[year]', year, years, {id: name+'[year]'} );
		var month_select = this.select_tag(name+'[month]', month, months, {id: name+'[month]'});
		var day_select = this.select_tag(name+'[day]', day, days, {id: name+'[day]'});
		
	    return year_select+month_select+day_select;
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} html_options
     */
	file_tag: function(name, value, html_options) {
	    return this.input_field_tag(name+'[file]', value , 'file', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} url_for_options
     * @param {Object} html_options
     */
	form_tag: function(url_for_options, html_options) {
	    html_options = html_options  || {};
		if(html_options.multipart == true) {
	        html_options.method = 'post';
	        html_options.enctype = 'multipart/form-data';
	    }
		html_options.action = url_for_options;
	    return this.start_tag_for('form', html_options);
	},
    /**
     * @plugin view/helpers
     */
	form_tag_end: function() { return this.tag_end('form'); },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} html_options
	 */
    hidden_field_tag: function(name, value, html_options) { 
	    return this.input_field_tag(name, value, 'hidden', html_options); 
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} inputType
     * @param {Object} html_options
     */
	input_field_tag: function(name, value , inputType, html_options) {
	    html_options = html_options || {};
	    html_options.id  = html_options.id  || name;
	    html_options.value = value || '';
	    html_options.type = inputType || 'text';
	    html_options.name = name;
	    return this.single_tag_for('input', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} url
     * @param {Object} html_options
     */
	link_to: function(name, url, html_options) {
	    if(!name) var name = 'null';
	    if(!html_options) var html_options = {};
		this.set_confirm(html_options);
		html_options.href=url;
		return this.start_tag_for('a', html_options)+name+ this.tag_end('a');
	},
    /**
     * @plugin view/helpers
     * @param {Object} condition
     * @param {Object} name
     * @param {Object} url
     * @param {Object} html_options
     */
    link_to_if: function(condition, name, url, html_options) {
		return this.link_to_unless((!condition), name, url, html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} condition
     * @param {Object} name
     * @param {Object} url
     * @param {Object} html_options
     */
    link_to_unless: function(condition, name, url, html_options){
        if(condition) return name;
        return this.link_to(name, url, html_options);
    },
    /**
     * @plugin view/helpers
     * @param {Object} html_options
     */
	set_confirm: function(html_options){
		if(html_options.confirm){
			html_options.onclick = html_options.onclick || '';
			html_options.onclick = html_options.onclick+
			"; var ret_confirm = confirm(\""+html_options.confirm+"\"); if(!ret_confirm){ return false;} ";
			html_options.confirm = null;
		}
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} options
     * @param {Object} html_options
     * @param {Object} post
     */
	submit_link_to: function(name, options, html_options, post){
		if(!name) var name = 'null';
	    if(!html_options) html_options = {};
		html_options.type = 'submit';
	    html_options.value = name;
		this.set_confirm(html_options);
		html_options.onclick=html_options.onclick+';window.location="'+options+'"; return false;';
		return this.single_tag_for('input', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} name
     * @param {Object} value
     * @param {Object} html_options
     */
	password_field_tag: function(name, value, html_options) { return this.input_field_tag(name, value, 'password', html_options); },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} choices
	 * @param {Object} html_options
	 */
    select_tag: function(name, value, choices, html_options) {     
	    html_options = html_options || {};
	    html_options.id  = html_options.id  || name;
	    //html_options.value = value;
		html_options.name = name;
	    var txt = '';
	    txt += this.start_tag_for('select', html_options);
	    for(var i = 0; i < choices.length; i++)
	    {
	        var choice = choices[i];
	        if(typeof choice == 'string') choice = {value: choice};
			if(!choice.text) choice.text = choice.value;
			if(!choice.value) choice.text = choice.text;
			
			var optionOptions = {value: choice.value};
	        if(choice.value == value)
	            optionOptions.selected ='selected';
	        txt += this.start_tag_for('option', optionOptions )+choice.text+this.tag_end('option');
	    }
	    txt += this.tag_end('select');
	    return txt;
	},
    /**
     * @plugin view/helpers
     * @param {Object} tag
     * @param {Object} html_options
     */
	single_tag_for: function(tag, html_options) { return this.tag(tag, html_options, '/>');},
	/**
	 * @plugin view/helpers
	 * @param {Object} tag
	 * @param {Object} html_options
	 */
    start_tag_for: function(tag, html_options)  { return this.tag(tag, html_options); },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} html_options
	 */
    submit_tag: function(name, html_options) {  
	    html_options = html_options || {};
	    html_options.type = html_options.type  || 'submit';
	    html_options.value = name || 'Submit';
	    return this.single_tag_for('input', html_options);
	},
    /**
     * @plugin view/helpers
     * @param {Object} tag
     * @param {Object} html_options
     * @param {Object} end
     */
	tag: function(tag, html_options, end) {
	    end = end || '>';
	    var txt = ' ';
	    for(var attr in html_options) { 
	       if(html_options.hasOwnProperty(attr)){
			   value = html_options[attr] != null ? html_options[attr].toString() : '';

		       if(attr == "Class" || attr == "klass") attr = "class";
		       if( value.indexOf("'") != -1 )
		            txt += attr+'=\"'+value+'\" ' ;
		       else
		            txt += attr+"='"+value+"' " ;
		   }
	    }
	    return '<'+tag+txt+end;
	},
    /**
     * @plugin view/helpers
     * @param {Object} tag
     */
	tag_end: function(tag)             { return '</'+tag+'>'; },
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} html_options
	 */
    text_area_tag: function(name, value, html_options) { 
	    html_options = html_options || {};
	    html_options.id  = html_options.id  || name;
	    html_options.name  = html_options.name  || name;
		value = value || '';
	    if(html_options.size) {
	        html_options.cols = html_options.size.split('x')[0];
	        html_options.rows = html_options.size.split('x')[1];
	        delete html_options.size;
	    }
	    html_options.cols = html_options.cols  || 50;
	    html_options.rows = html_options.rows  || 4;
	    return  this.start_tag_for('textarea', html_options)+value+this.tag_end('textarea');
	},
	/**
	 * @plugin view/helpers
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} html_options
	 */
    text_field_tag: function(name, value, html_options) { return this.input_field_tag(name, value, 'text', html_options); },
	/**
	 * @plugin view/helpers
	 * @param {Object} image_location
	 * @param {Object} options
	 */
    img_tag: function(image_location, options){
		options = options || {};
		options.src = "resources/images/"+image_location;
		return this.single_tag_for('img', options);
	}
	
});

MVC.View.Helpers.prototype.text_tag = MVC.View.Helpers.prototype.text_area_tag;


(function(){
	var data = {};
	var name = 0;
	MVC.View.Helpers.link_data = function(store){
		var functionName = name++;
		data[functionName] = store;	
		return "_data='"+functionName+"'";
	};
	MVC.View.Helpers.get_data = function(el){
		if(!el) return null;
		var dataAt = el.getAttribute('_data');
		if(!dataAt) return null;
		return data[parseInt(dataAt)];
	};
	MVC.View.Helpers.prototype.link_data = function(store){
		return MVC.View.Helpers.link_data(store)
	};
	MVC.View.Helpers.prototype.get_data = function(el){
		return MVC.View.Helpers.get_data(el)
	};
})();


