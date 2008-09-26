include.plugins('lang','dom/query')
if(!window._rhino){
    include.plugins('debug')
}else{
    MVC.Console = {log: function(txt){
        print(txt);
    }}
}

include.plugins('lang/class');
include('test','runner','assertions',
    'unit','functional','controller',
'synthetic_events')