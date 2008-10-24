new MVC.Test.Unit('element_test',{
	setup: function(){
          MVC.$E('testarea').innerHTML = "<div id='insertion_test' style='width: 100px; height:100px;'></div>"
    },
    teardown : function(){
          MVC.$E('testarea').innerHTML = "";
    },
    test_insert_bottom: function(){

		var b = MVC.$E('insertion_test');
		b.insert({bottom: '<p id="append_bottom">Bottom</p>'})
		this.assert_equal(b.firstChild.nodeName, 'P')
		this.assert_equal(b.firstChild.id, 'append_bottom')
		this.assert_equal(b.firstChild.innerHTML, 'Bottom')
	},
	test_insert_after: function(){

		var b = MVC.$E('insertion_test');
		b.insert({after: '<p id="insert_after">After</p>'});
		this.assert_equal(b.nextSibling.nodeName, 'P')
		this.assert_equal(b.nextSibling.id, 'insert_after')
		this.assert_equal(b.nextSibling.innerHTML, 'After')
	},
	test_insert_before: function(){

		var b = MVC.$E('insertion_test');
		b.insert({before: '<p id="insert_before">Before</p>'});
		this.assert_equal(b.previousSibling.nodeName, 'P')
		this.assert_equal(b.previousSibling.id, 'insert_before')
		this.assert_equal(b.previousSibling.innerHTML, 'Before')
	},
	test_insert_top: function(){

		var b = MVC.$E('insertion_test');
        b.insert({top: '<p id="second_top">second</p>'});
		b.insert({top: '<p id="insert_top">Top</p>'});
		this.assert_equal(b.childNodes[0].id, 'insert_top')
		this.assert_equal(b.childNodes[1].id, 'second_top')
	},
    test_get_children: function(){
        
        var b = MVC.$E('insertion_test');
        b.innerHTML = "<p> a </p> b <p>c</p>"
        this.assert_equal(2, MVC.$E('insertion_test').get_children().length  );
    },
    insert_two: function(){
        var b = MVC.$E('insertion_test');
        b.insert({top: '<p id="second_top">second</p>'});
		b.insert({top: '<p id="insert_top">Top</p>'});
    },
    test_first: function(){
        this.insert_two();
        this.assert_equal("insert_top", MVC.$E('insertion_test').first().id  );
    },
    test_last: function(){
        this.insert_two();
        this.assert_equal("second_top", MVC.$E('insertion_test').last().id  );
    },
    test_next: function(){
        this.insert_two();
        this.assert_equal("second_top", MVC.$E('insert_top').next().id  );
    },
    test_previous: function(){
        this.insert_two();
        this.assert_equal("insert_top", MVC.$E('second_top').previous().id  );
    },
    test_toggle: function(){
        if(window._rhino) return this.messages.push("Skipping -> style related test in Rhino.");
        MVC.$E('insertion_test').toggle();
        this.assert_equal("none", MVC.$E('insertion_test').get_style('display')  );
        MVC.$E('insertion_test').toggle();
        this.assert(  MVC.String.include(MVC.$E('insertion_test').get_style('display'), "block")   );
        
    },
    test_get_style: function(){
        if(window._rhino) return this.messages.push("Skipping -> style related test in Rhino.");
        MVC.$E('insertion_test').style.border="solid 1px Black";
        this.assert_equal("1px", MVC.$E('insertion_test').get_style('borderBottomWidth')  );
    },
    test_cumulative_offset: function(){
        if(window._rhino) return this.messages.push("Skipping -> style related test in Rhino.");
		
        
        var off = MVC.$E('insertion_test').cumulative_offset();
        this.assert( off.x() > 0 );
        this.assert(off.y() > 0  );
    },
    test_cumulative_scroll_offset: function(){
        if(window._rhino) {
			this.messages.push("Skipping -> style related test in Rhino.");
			return;
		}
        
        var off = MVC.$E('insertion_test').cumulative_scroll_offset();
        this.assert_equal("number", typeof off.x()  );
        this.assert_equal("number", typeof off.y()  );
    },
    test_has: function(){
        this.insert_two();
        this.assert(  MVC.$E('insertion_test').has('insert_top') )
        this.assert_not(  MVC.$E('insert_top').has('second_top') )
        this.assert_not(  MVC.$E('second_top').has('insert_top') )
    },
    test_update: function(){
        MVC.$E('insertion_test').update("<table id='update_test'><tr><td></td></tr></table>")
        MVC.$E('update_test').update("<tr><td id='td_content'>This is my table</td></tr>");
        this.assert_equal("This is my table", MVC.$E('td_content').innerHTML );
    },
    test_remove: function(){
        this.insert_two();
        MVC.$E('insert_top').remove()
        this.assert_null(MVC.$E('insert_top'));
    },
    dimensions: function(){
        var off = MVC.$E('insertion_test').dimensions();
        this.assert_equal("number", typeof off.x()  );
        this.assert_equal("number", typeof off.y()  );
    }
})