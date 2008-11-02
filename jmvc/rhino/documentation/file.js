
/**
 * Represents a file.
 * Breaks up file into comment and code parts.
 * Creates new pairs.
 * Pairs maintain state.
 */
MVC.Doc.File = MVC.Doc.Pair.extend('file',
{
    group : new RegExp("(?:/\\*(?:[^*]|(?:\\*+[^*/]))*\\*+/\[^\\w\\{\\(\\[/]*[^\\n]*)", "g"),
    
    splitter : new RegExp("(?:/\\*+((?:[^*]|(?:\\*+[^*/]))*)\\*+/\[^\\w\\{\\(\\[]*([^\\r\\n]*))")
},{
    init : function(inc){
        this.children = [];
        this.name = inc.path;
        this.src=inc.text;
        print('docs for '+this.name)
        this.generate();
    },
    generate : function(){

        var pairs = this.src.match(this.Class.group);
        //clean comments
        var scope = this;
        if(!pairs) return;
        for(var i = 0; i < pairs.length ; i ++){
            var splits = pairs[i].match(this.Class.splitter);
            var comment = splits[1].replace(/^[^\w@]*/,'').replace(/\r?\n(\s*\*+)?/g,'\n');
            var code = splits[2];
            //print("=================")
            //print( comment)
            //print("-----------------")
            //print(code)
            var pair = MVC.Doc.Pair.create( comment , code, scope);
            if(pair)
                scope = pair.scope();
        }
    },
    clean_comment : function(comment){
        return comment.replace(/\/\*|\*\//,'').replace(/\r?\n\s*\*?\s*/g,'\n')
    },
    full_name: function(){
        return "";
    }
});
print(typeof MVC.Doc.File)