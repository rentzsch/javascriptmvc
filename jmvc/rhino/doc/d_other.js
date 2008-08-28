MVCObject.DStatic = MVCObject.DPair.extend('static',
{starts_scope: true},
{
    toHTML: function(){
        var ret = "<h2>Static Methods</h2>"
        ret+= this.make(this.children.sort(MVCObject.DPair.sort_by_name)  );
        return ret;
    },
    add_parent : function(scope){
        var scope_class=  scope.Class.className;
        this.parent = scope_class == 'class' || scope_class == 'constructor' ? scope : scope.parent
        this.parent.add(this);
    },
    name: 'static'
});

MVCObject.DPrototype = MVCObject.DStatic.extend('prototype',
{
    toHTML: function(){
        var ret = "<h2>Prototype Methods</h2>"
        ret+= this.make(this.children.sort(MVCObject.DPair.sort_by_name));
        return ret;
    },
    name: 'prototype'
});




 
 MVCObject.DAttribute = MVCObject.DPair.extend('attribute',{
     code_match: function(code){
         return code.match(/(\w+)\s*[:=]\s*/) && !code.match(/(\w+)\s*[:=]\s*function\(([^\)]*)/)  
     }
 },{
     code_setup: function(){
        var parts = this.code.match(/(\w+)\s*[:=]\s*/);
        this.name = parts[1];
     },
     toHTML: function(){
         return "<div class='attribute'><h3>"+this.name+"</h3><p>"+this.comment
         +"</p></div>"
     }
 })

MVCObject.DAdd = MVCObject.DPair.extend('add',
{
    comment_setup: MVCObject.DFunction.prototype.comment_setup,
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
        
        var Class = this.type.toLowerCase() == "class" ? MVCObject.DClass : MVCObject.DConstructor
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




