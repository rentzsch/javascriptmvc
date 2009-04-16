// we don't include the plugin file because thats done after the app file (in case jquery is loaded)

jQuery.include.plugins("jquery","dom",'lang','lang/class','lang/openajax','dom/synthetic')

if(!jQuery.browser.rhino){
    jQuery.include.plugins('console')
}else{
    jQuery.Console = {log: function(txt){
        print(txt);
    }}
}


jQuery.include(
    'test',
    'runner',
    'assertions',
    'unit',
    'functional',
    'controller')