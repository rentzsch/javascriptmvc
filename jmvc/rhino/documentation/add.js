/**
 * Used to add functionality from one place to another
 * @param {Object} line
 */
MVC.Doc.Add = MVC.Doc.Pair.extend('add',
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




