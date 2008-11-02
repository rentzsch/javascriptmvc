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
/**
 * 
 */
MVC.Doc.Prototype = MVC.Doc.Static.extend('prototype',
{
    name: 'prototype'
});




/**
 * 
 */
MVC.Doc.Attribute = MVC.Doc.Pair.extend('attribute',{
     code_match: function(code){
         return code.match(/(\w+)\s*[:=]\s*/) && !code.match(/(\w+)\s*[:=]\s*function\(([^\)]*)/)  
     }
 },{
     code_setup: function(){
        var parts = this.code.match(/(\w+)\s*[:=]\s*/);
        this.name = parts[1];
     }
 })

MVC.Doc.Attribute = MVC.Doc.Pair.extend('add',
{
    comment_setup: MVC.Doc.Function.prototype.comment_setup,
    add_add : function(line){
        //@add class MVC.String Static
        var m = line.match(/^@add (class|constructor) ([\w\.]+) ([\w\.]+)?/i)
        if(m){
            this.sub_scope = m.pop().toLowerCase()
            this.scope_name = m.pop()
            this.type = m.pop()
        }
    },
    
    scope : function(){
        if(!this.type) return this;
        
        var Class = this.type.toLowerCase() == "class" ? MVC.Doc.Class : MVC.Doc.Constructor
        //find
        var inst;
        for(var l =0 ; l < Class.listing.length; l++){
            if(Class.listing[l].name == this.scope_name) {
                inst = Class.listing[l];break;
            }
        }
        if(!inst) return this;
        if(this.sub_scope){
            var children = inst.children;
            var child;
            for(var i=0; i< children.length; i++){
                if(children[i].Class.className.toLowerCase() == this.sub_scope) {
                    child = children[i];break;
                }
            }
            if(child) return child;
        }
        return inst;
        
    },
    toHTML: function(){return ""},
    linker: function(){}
});




