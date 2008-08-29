
include.translation = function(name, encoding){
    if(!name) return;
    encoding = encoding || "iso-8859-1";
    include.insert_head(MVC.root.join("views/translations/"+name+".js") , encoding  );
}

MVC.translate = function(phrase){
    return phrase;
}




MVC.Translation = function(translations){

    MVC.translate = function(phrase){
        var t = translations[phrase]
        return t ? t : phrase;
    }
    if(!MVC._no_conflict){
    	$T = MVC.translate;
    }
};


if(!MVC._no_conflict){
	$T = MVC.translate;
    Translation = MVC.Translation;
}

