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
        ret+= this.make(this.children);
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






/*
 * 
 */
