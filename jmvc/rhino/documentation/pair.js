/**
 * A base class for a comment and the line of code following it.
 */
MVC.Doc.Pair = MVC.Class.extend(
/* @Static */
{
    code_match: function(){ return null},
    classes: [],
    extended: function(Klass){
        if(Klass.className){
            this.classes.push(Klass)
        }
    },
    /**
     * From the comment and code, guesses at the type of comment and creates a new
     * instance of that type.
     * @param {String} comment - the comment
     * @param {String} code - the first line of source following the comment
     * @param {MVC.Doc.Pair} scope - The current scope of documentation.  
     * This is typically a Class, Constructor, Static, or Prototype
     * @return {MVC.Doc.Pair} - If a type can be found, the new Doc object; otherwise, null.
     */
    create: function(comment, code, scope){
        var check =  comment.match(/^@(\w+)/), type

        if(!(type = this.has_type(check ? check[1] : null)) ){ //try code
            type = this.guess_type(code);
        }
        if(!type) return null;
        return new type(comment, code, scope)
    },
    /**
     * Looks for a Doc class with a className for the given type
     * @param {String} type a potential className
     */
    has_type: function(type){
        if(!type) return null;
        for(var i=0;i< this.classes.length; i++){
            if(this.classes[i].className.toLowerCase() == type.toLowerCase() ) 
                return this.classes[i];
        }
        return null;
    },
    /**
     * Tries to guess at a piece of code's type.
     * @param {Object} code
     */
    guess_type: function(code){
        for(var i=0;i< this.classes.length; i++){
            if(this.classes[i].code_match(code) ) 
                return this.classes[i];
        }
        return null;
    },
    starts_scope: false,
    /**
     * Given a and b, sorts by their full_name property.
     * @param {Object} a
     * @param {Object} b
     */
    sort_by_full_name : function(a, b){
       
       if(a.full_name == b.full_name) return 0;
       return a.full_name > b.full_name ? 1: -1;
    },
    sort_by_name : function(a, b){
       
       if(a.name == b.name) return 0;
       return a.name > b.name ? 1: -1;
    },
    /**
     * Loads a template to use to render different doc types.
     */
    init : function(){
        if(this.className){
             var ejs = "jmvc/rhino/documentation/templates/"+this.className+".ejs"
             this._view = new View({text: readFile(ejs), name: ejs });
        }
    }
},
/* @Prototype */
{
    init : function(comment, code, scope ){
        this.children = []
        this.comment = comment;
        this.code = code;

        //we need to add to a class if we 
        this.add_parent(scope);
        
        if(this.Class.code_match(this.code))
            this.code_setup();
        this.comment_setup();
        
        
        var par = this;
        while(par && !par.url){
            par = par.parent;
        }
        if(par){
            MVC.Doc.objects[this.full_name()] = par.url()+"#"+this.full_name();
        }
        
    },
    add: function(child){
        this.children.push(child);
    },
    add_parent : function(scope){
         this.parent = scope;
         this.parent.add(this);
    },
    scope: function(){
        return this.Class.starts_scope ? this : this.parent
    },
    code_setup: function(){},
    comment_setup: function(){},
    toHTML : function(){
       // var parts = [];
       //for(var c=0; c<this.children.length; c++){
       //     parts.push( this.children[c].toHTML());
       // }
       // 
       // return this.Class.className+": "+this.name+"\n"+parts.join("\n\n");
       return this.Class._view.render(this)
    },
    full_name: function(){
        var par = this.parent.full_name()
        return (par ? par+"." : "")+this.name ;
    },
    make : function(arr){
        var res = ["<div>"];
        //we should alphabetize by name
        
        for(var c=0; c<arr.length; c++){
            var child = arr[c];
            res.push(child.toHTML());
        }
        res.push("</div>");
        return res.join("");
    },
    linker : function(){
        var result = [{name: this.name, full_name: this.full_name()}];
        
        if(this.children){
            for(var c=0; c<this.children.length; c++){
                var adds = this.children[c].linker();
                if(adds)
                    result = result.concat( adds );
            }
        }
        return result;
    },
    ordered_params : function(){
            var arr = [];
            for(var n in this.params){
                var param = this.params[n];
                arr[param.order] = param;
            }
            return arr;
    },
    plugin_add : function(line){
        this.plugin = line.match(/@plugin ([^ ]+)/)[1];
    }
})