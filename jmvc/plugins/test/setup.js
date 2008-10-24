include.plugins('lang','dom/query','lang/class','lang/openajax')

if(!window._rhino){
    include.plugins('debug')
}else{
    MVC.Console = {log: function(txt){
        print(txt);
    }}
}


include(
    'test',
    'runner',
    'assertions',
    'unit',
    'functional',
    'controller',
    'synthetic_events')