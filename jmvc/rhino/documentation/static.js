/**
 * 
 */
MVC.Doc.Static = MVC.Doc.Pair.extend('static',
{starts_scope: true},
{
    add_parent : function(scope){
        var scope_class=  scope.Class.className;
        this.parent = scope_class == 'class' || scope_class == 'constructor' ? scope : scope.parent;
        if(scope_class != "file" && this.parent)
            this.parent.add(this);
    },
    name: 'static'
});