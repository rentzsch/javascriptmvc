
include.translation = function(name){
    include.force("views/translations/"+name+".js");
    if(MVC.Translation._lang) throw "More than one translation loaded"
    MVC.Translation._lang = name
}


MVC.Object.extend(MVC.View.Helpers.prototype, {
    translate : function(phrase){
        var t = MVC.Translation[MVC.Translation._lang][phrase]
        return t ? t : phrase;
    }

})



MVC.Translation = function(translations){
    MVC.Translation[MVC.Translation._lang] = translations;
};
