MVC.Doc.File = MVC.Doc.Pair.extend('file',
{
    group : new RegExp("(?:/\\*(?:[^*]|(?:\\*+[^*/]))*\\*+/\[^\\w\\{\\(\\[]*[^\\n]*)", "g"),
    splitter : new RegExp("(?:/\\*+((?:[^*]|(?:\\*+[^*/]))*)\\*+/\[^\\w\\{\\(\\[]*([^\\r\\n]*))")
},{
    init : function(inc){
        this.children = [];
        this.name = inc.path;
        this.src=inc.text;
        //if(!this.name.match(/jmvc/)  ){
            print('docs for '+this.name)
            this.generate();
        //}
            
            
    },
    generate : function(){
        //find all comments

        //pairs of comment and first liners
        
        
        var pairs = this.src.match(this.Class.group);
        //clean comments
        var scope = this;
        if(!pairs) return;
        for(var i = 0; i < pairs.length ; i ++){
            var splits = pairs[i].match(this.Class.splitter);
            var comment = splits[1].replace(/^[^\w@]*/,'').replace(/\r?\n(\s*\*+)?/g,'\n');
            var code = splits[2];
            var pair = MVC.Doc.Pair.create( comment , code, scope);
            if(pair)
                scope = pair.scope();
        }
        //return this.toHTML();
    },
    make_doc: function(cleaned){
        //go through and match Class, Function, Member
    },
    clean_comment : function(comment){
        //get the comment
        
        
        return comment.replace(/\/\*|\*\//,'').replace(/\r?\n\s*\*?\s*/g,'\n')
    },
    full_name: function(){
        return "";
    }
})