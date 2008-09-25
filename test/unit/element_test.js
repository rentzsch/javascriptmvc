new MVC.Test.Unit('element_test',{
	test_insert_bottom: function(){
		if(!MVC.Element) {
			this.messages.push("Skipping because Element plugin isn't included.");
			return;
		}
		var b = MVC.$E('insertion_test');
		b.insert({bottom: '<p id="append_bottom">Bottom</p>'})
		this.assert_equal(b.firstChild.nodeName, 'P')
		this.assert_equal(b.firstChild.id, 'append_bottom')
		this.assert_equal(b.firstChild.innerHTML, 'Bottom')
	},
	test_insert_after: function(){
		if(!MVC.Element) {
			this.messages.push("Skipping because Element plugin isn't included.");
			return;
		}
		var b = MVC.$E('append_bottom');
		b.insert({after: '<p id="insert_after">After</p>'});
		this.assert_equal(b.nextSibling.nodeName, 'P')
		this.assert_equal(b.nextSibling.id, 'insert_after')
		this.assert_equal(b.nextSibling.innerHTML, 'After')
	},
	test_insert_before: function(){
		if(!MVC.Element) {
			this.messages.push("Skipping because Element plugin isn't included.");
			return;
		}
		var b = MVC.$E('append_bottom');
		b.insert({before: '<p id="insert_before">Before</p>'});
		this.assert_equal(b.previousSibling.nodeName, 'P')
		this.assert_equal(b.previousSibling.id, 'insert_before')
		this.assert_equal(b.previousSibling.innerHTML, 'Before')
	},
	test_insert_top: function(){
		if(!MVC.Element) {
			this.messages.push("Skipping because Element plugin isn't included.");
			return;
		}
		var b = MVC.$E('insertion_test');
		b.insert({top: '<p id="insert_top">Top</p>'});
		this.assert_equal(b.childNodes[0].id, 'insert_top')
		this.assert_equal(b.childNodes[1].id, 'insert_before')
		this.assert_equal(b.childNodes[2].id, 'append_bottom')
		this.assert_equal(b.childNodes[3].id, 'insert_after')
	},
    test_get_children: function(){
        this.assert_equal(3, MVC.$E('tests').get_children().length  );
    },
    test_first: function(){
        this.assert_equal("sel", MVC.$E('tests').first().id  );
    },
    test_last: function(){
        this.assert_equal("submit", MVC.$E('tests').last().type  );
    },
    test_next: function(){
        this.assert_equal("input", MVC.$E('sel').next().id  );
    },
    test_previous: function(){
        this.assert_equal("sel", MVC.$E('input').previous().id  );
    },
    test_toggle: function(){
        MVC.$E('sel').toggle();
        this.assert_equal("none", MVC.$E('sel').get_style('display')  );
        MVC.$E('sel').toggle();
        this.assert_equal("inline", MVC.$E('sel').get_style('display')  );
        
    },
    test_get_style: function(){
        MVC.$E('sel').style.border="solid 1px Black";
        this.assert_equal("1px", MVC.$E('sel').get_style('borderBottomWidth')  );
    },
    test_cumulative_offset: function(){
        var off = MVC.$E('sel').cumulative_offset();
        this.assert_equal(8, off.x()  );
        this.assert_equal(161, off.y()  );
    },
    test_cumulative_scroll_offset: function(){
         var off = MVC.$E('sel').cumulative_scroll_offset();
        this.assert_equal("number", typeof off.x()  );
        this.assert_equal("number", typeof off.y()  );
    },
    test_is_parent: function(){
        this.assert(  MVC.$E('tests').is_parent('sel') )
        this.assert_not(  MVC.$E('sel').is_parent('tests') )
        this.assert_not(  MVC.$E('element_el').is_parent('tests') )
        
    },
    test_has: function(){
        this.assert(  MVC.$E('tests').has('sel') )
        this.assert_not(  MVC.$E('sel').has('tests') )
        this.assert_not(  MVC.$E('element_el').has('tests') )
    },
    test_update: function(){
        MVC.$E('update_test').update("<tr><td id='td_content'>This is my table</td></tr>");
        this.assert_equal("This is my table", MVC.$E('td_content').innerHTML );
    },
    test_remove: function(){
        MVC.$E('remove_test').remove()
        this.assert_null(MVC.$E('remove_test'));
    },
    dimensions: function(){
        var off = MVC.$E('sel').dimensions();
        this.assert_equal("number", typeof off.x()  );
        this.assert_equal("number", typeof off.y()  );
    }
})