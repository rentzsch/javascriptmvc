include.plugins('jquery','lang','lang/class','lang/openajax');
include('delegator','controller');
if(MVC.View) include.plugins('controller/view');
//if(include.get_env() == 'test') include('test')