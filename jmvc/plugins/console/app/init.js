
opener.jQuery.Console.log = function(){
	var args = jQuery.makeArray(arguments)
	var messages = []
	for(var i =0; i < args.length;i++){
		messages.push( args[i].replace(/</g,'&lt;')  )
	}
	opener.jQuery.Console.logHtml("<pre>"+ messages.join(", ") +"</pre>")
}


opener.jQuery.Console.logHtml = function(html){
	$("#console_log").append(  html )
}
	
		
tests = {};
//we need 2
jQuery.Controller.extend("TestsController",{
	init : function(el){
		this.tests = {};
		this._super(el)
	},
	"# .play click" : function(){
		opener.jQuery.Test.Unit.run_all()
	},
	".test_run click" : function(el){
		this.tests[el.controllerElement()[0].id].run()
	},
	".step a click" : function(el){
		var ce = el.controllerElement()
		var test = this.tests[ce[0].id];
		test.run_test(el.parents(".step").attr('stepName'));
		
	},
	"opener~jquery.test.created subscribe" : function(called, test){
		if(test.type != this.element.id) return;
		this.tests[test.underscoredName] = test;
		this.find(".tests_container").append({view: "jmvc/plugins/console/app/test", data: test});
		window_resise();
	},
	"opener~jquery.test.running subscribe" : function(called, assertions){
		if(assertions._test.type != this.element.id) return;
		
		var test = assertions._test;
		this.find('#step_'+test.name+'_'+assertions._test_name).removeClass().
			find('.result').html("Running...");
	},
	"opener~jquery.test.case.complete subscribe": function(called, testInstance){

		if(testInstance.Class.type != this.element.id) return;
	    var test_name = testInstance._testName
	    var step = this.find('#step_'+testInstance.Class.underscoredName+'_'+test_name);
		var result = step.find(".result");
		
		if(testInstance.failures == 0 && testInstance.errors == 0){
			step.addClass('passed');
			result.html(  'Passed: '+testInstance.assertions+' assertion'+add_s(testInstance.assertions)+' <br/>'+
				clean_messages(testInstance.messages).join("<br/>")  )
			
		}else{
			step.addClass('failure');
			result.html(  'Failed: '+testInstance.assertions+' assertion'+add_s(testInstance.assertions)+
			', '+testInstance.failures+' failure'+add_s(testInstance.failures)+
			', '+testInstance.errors+' error'+add_s(testInstance.errors)+' <br/>'+
				clean_messages(testInstance.messages).join("<br/>") )
		}
	},
	"opener~jquery.test.test.complete subscribe": function(called, test){
		if(test.type != this.element.id) return;
		this.find("#"+test.underscoredName+" .test_results").html( '('+test.passes+'/'+test.testNames.length+ ')' )
	},
	"opener~jquery.test.unit.complete subscribe": function(called, superTest){
	    console.log(superTest)
		if(!called.match( this.element.id)) return;
		//get ones with failures
	    var fails = 0;
	    for(var i=0; i < superTest.tests.length; i++){
	        if( superTest.tests[i].failures ) fails++;
	    }
	    var passes = superTest.tests.length - fails;
	    document.getElementById('unit_result').innerHTML = 
		'('+(passes)+'/'+superTest.tests.length+')' + (passes == superTest.tests.length ? ' Wow!' : '');
	}
});
$("#unit").tests_controller();


clean_messages = function(messages){
	for(var m = 0; m < messages.length; m++){
		messages[m] = messages[m].replace(/</g,'&lt;').replace(/\n/g,'\\n');
	}
	return messages
}
$('#your_app_name_unit').text(opener.jQuery.MVC.app_name)
$('#your_app_name_functional').text(opener.jQuery.MVC.app_name)


opener.jQuery.Console.log('You are running '+
		'"'+opener.jQuery.MVC.app_name+'" ' +'in the '+opener.jQuery.include.get_env()+' environment.')





add_s = function(array){
	return array == 1 ? '' : 's'
};

show = function(type){
	var types = ['unit','functional','console'];
	var els = {}
	var buttons = {};
	for(var i = 0 ; i < types.length; i++){
		els[types[i]] =  document.getElementById(types[i]);
		buttons[types[i]] =  document.getElementById(types[i]+'_button');
		els[types[i]].style.display = 'none'
		buttons[types[i]].className = '';
	}
	els[type].style.display = 'block';
	buttons[type].className = 'selected';
	console_scroll();
};

if(window.innerHeight){
	getDimensions = function(){
		return {width: window.innerWidth, height: window.innerHeight};
	};
}else{
	getDimensions = function(){
		var el = document.documentElement;
		return {width: el.clientWidth, height: el.clientHeight - 2};
	};
}

window.onresize = window_resise =function(){
	var cl = document.getElementById('console_log');
	cl.style.height = ''+(getDimensions().height - 57)+'px';
	cl.style.width = ''+(getDimensions().width -1)+'px';
	var u = document.getElementById('unit')
	u.style.height = ''+(getDimensions().height - 57)+'px';
	
	var f = document.getElementById('functional')
	f.style.height = ''+(getDimensions().height - 57)+'px';
	if(opener.jQuery.browser.msie){
		var up = document.getElementById('unit_play').offsetWidth;
		var fp = document.getElementById('functional_play').offsetWidth;
		if(up){
			document.getElementById('unit_container').style.width = ''+(up+20)+'px'
		}else if(fp){
			document.getElementById('functional_container').style.width = ''+(fp+20)+'px'
		}
		
	}
	
}

console_scroll = function(){
	if(console_scrolled <= -10){
		if(opener.jQuery.jQuery.browser.safari ){
			setTimeout(function(){
				var cl = document.getElementById('console_log');
				var newHeight = cl.clientHeight;
				cl.scrollTop = console_info.scrollTop;
			},1);
		}
	} else {
		setTimeout(function(){
		var cl = document.getElementById('console_log');
			cl.scrollTop = cl.scrollHeight;
		},1);
		
	}
	
};

console_log_scrolled = function(){
	var cl = document.getElementById('console_log');
	console_scrolled = cl.scrollTop - cl.scrollHeight+cl.clientHeight;
	console_info = {
		scrollTop : cl.scrollTop,
		clientHeight : cl.clientHeight,
		scrollHeight : cl.scrollHeight
	}
	
};

console_log_scrolled();
