if($.include.get_env() != 'test' && typeof console != 'undefined'){
	$.Console.log = function(message){
			console.log(message)
	};
}else{
	
	$.Console = {};
	$.Console.window = window.open($.MVC.mvcRoot+'/plugins/console/console.html', 'test', "width=600,height=400,resizable=yes,scrollbars=yes");
	$.Console.log = function(message, html){
		var el = $.Console.window.document.createElement(html ? 'p' : 'pre' );
		if(! jQuery.browser.msie || html){
			el.innerHTML = html ? message : message.toString().replace(/</g,'&lt;');
		}else{
			var lines = message.toString().split('\n')
			for(var l = 0 ; l < lines.length; l++){
				var txt = $.Console.window.document.createTextNode(lines[l] ? lines[l] : ' ')
				el.appendChild(txt);
				if(l != lines.length - 1) el.appendChild( $.Console.window.document.createElement('br')  )
			}
		}
		var place = $.Console.window.document.getElementById('console_log')
		place.appendChild(el);
		
		if($.Console.window.window_resise){
			$.Console.window.window_resise();
			$.Console.window.console_scroll();
		}
		
		if(typeof console != 'undefined'){
			console.log(message)
		}
	};
}






