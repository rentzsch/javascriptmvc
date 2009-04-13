jQuery.include.plugins('lang');
jQuery.include('view');
//if(jQuery.include.get_env() == 'development')	jQuery.include('fulljslint');

if(jQuery.Controller) jQuery.include.plugins('controller/view');