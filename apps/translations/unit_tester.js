MVCOptions = {
    onload: true,
    env: "test",
    done_loading : function(){
        print('\n\nRunning Unit tests');
        MVC.Test.Unit.run()
    },
    report : function(assertions){
        
        clean_messages = function(messages){
        	for(var m = 0; m < messages.length; m++){
        		messages[m] = messages[m].replace(/</g,'&lt;').replace(/\n/g,'\\n');
        	}
        	return messages
        }

        print(assertions._test.name+":"+assertions._test_name)
        
        add_s = function(array){
        	return array == 1 ? '' : 's'
        };
        
        if(assertions.failures == 0 && assertions.errors == 0){
    		print('     Passed: '+assertions.assertions+' assertion'+add_s(assertions.assertions)+  
                (assertions.messages.length> 0?' \n     ':'')+
    			clean_messages(assertions.messages).join("\n     ") )
    		
    	}else{
    		
    		print('     Failed: '+assertions.assertions+' assertion'+add_s(assertions.assertions)+
    		', '+assertions.failures+' failure'+add_s(assertions.failures)+
    		', '+assertions.errors+' error'+add_s(assertions.errors)+
            (assertions.messages.length> 0? ' \n     ': '')+
    			clean_messages(assertions.messages).join("\n     ") )
    	}
        
        
    },
    update_test: function(test){

	print('     Completed '+test.name+' Test ('+test.passes+'/'+test.test_names.length+ ')')
    },
    unit_results : function(test){
        print('\nCompleted Unit Tests ('+test.passes+'/'+test.tests.length+')' + (test.passes == test.tests.length ? ' Wow!' : '')+"\n" )
    }
}
load('jmvc/rhino/htmlparser.js');
load('jmvc/rhino/env.js');
load('jmvc/rhino/helpers.js');
load('jmvc/rhino/doc.js');
window.location = 'apps/translations/index.html';

