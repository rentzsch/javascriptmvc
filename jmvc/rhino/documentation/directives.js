MVC.Doc.Directive = MVC.Class.extend({
    
},
{
    
})

MVC.Doc.Directive.Init = MVC.Class.extend('init',{
    add: function(line){
            var parts = line.match(/\s?@init(.*)?/);
            if(!parts || !parts[1]){
                this.init_description = " ";
                return true;
            } 
            this.init_description = parts.pop();
            return this.init_description;
    },
    add_more: function(line){
        this.init_description +="\n"+ line;
    }
});
MVC.Doc.Directive.Param = MVC.Class.extend('param',{
    add_more : function(line, last){
        if(last)
            last.description += "\n"+line;
    },
    /**
     * Adds @param data to the constructor function
     * @param {String} line
     */
    add: function(line){
        var parts = line.match(/\s*@param\s+(?:\{(?:(optional):)?([\w\.\/]+)\})?\s+([\w\.]+) ?(.*)?/);
        if(!parts) return;
        var description = parts.pop();
        var n = parts.pop();
        
        var param = this.params[n] ? this.params[n] : this.params[n] = {order: this.ordered_params().length };

        param.description = description || "";
        param.name = n;
        param.type = parts.pop()|| "";
        param.optional = parts.pop() ? true : false;
        
        return this.params[n];
    }
});

MVC.Doc.Directive.Inherits = MVC.Class.extend('inherits',{
    add: function(line){
        var m = line.match(/^\s*@\w+ ([\w\.]+)/)
        if(m){
            this.inherits = m[1];
        }
    }
})
MVC.Doc.Directive.Return = MVC.Class.extend('return',{
    add: function(line){
        var parts = line.match(/\s*@return\s+(?:\{([\w\.\/]+)\})?\s*(.*)?/);
        
        if(!parts) {
           return; 
        }
        
        var description = parts.pop() || "";
        var type = parts.pop();
        this.ret = {description: description, type: type};
        return this.ret;
    },
    add_more : function(line){
        this.ret.description += "\n"+line;
    }
})
MVC.Doc.Directive.Author = MVC.Class.extend('author',{
    add: function(line){
        var m = line.match(/^\s*@author\s*(.*)/)
        if(m){
            this.author = m[1];
        }
    }
});
MVC.Doc.Directive.Hide = MVC.Class.extend('hide',{
    add: function(line){
        var m = line.match(/^\s*@hide/)
        if(m){
            this.hide = true;
        }
    }
});
MVC.Doc.Directive.CodeStart = MVC.Class.extend('code_start',{
    add: function(line){
        var m = line.match(/^\s*@code_start\s*([\w-]*)\s*(.*)/)
        if(m){
            this.comment_code_type = m[1] ? m[1].toLowerCase() : 'javascript';
            this.comment_code = [];
            return true;
        }
    },
    add_more : function(line){
        this.comment_code.push(line);
    }
});
MVC.Doc.Directive.CodeEnd = MVC.Class.extend('code_end',{
    add: function(line){
        var m = line.match(/^\s*@code_end/)
        
        if(m){
            this.real_comment += 
            "<pre><code class='"+this.comment_code_type+"'>"+this.comment_code.join("\n")+"</code></pre>"
        }
        return false;
    }
});