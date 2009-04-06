jQuery.include.plugins('jquery','lang','lang/class','lang/openajax','lang/inflector','dom/delegate');
jQuery.include('controller');
if(jQuery.View) jQuery.include.plugins('controller/view');
//if(include.get_env() == 'test') include('test')