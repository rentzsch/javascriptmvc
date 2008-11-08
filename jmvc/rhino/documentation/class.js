/**
 * Documents a 'Class'.  A class is typically a collection of static and prototype functions.
 * MVC Doc can automatically detect classes created with MVC.Class.  However, you can make anything
 * a class with the <b>@class <i>ClassName</i></b> directive.
 * @author Jupiter IT
 */
MVC.Doc.Class = MVC.Doc.Pair.extend('class',
/* @Static */
{
    code_match: /([\w\.]+)\s*=\s*([\w\.]+?).extend\(/,
    starts_scope: true,
    listing: [],
    /**
     * Loads the class view.
     */
    init : function(){
        this._super();
        var ejs = "jmvc/rhino/documentation/templates/file.ejs"
        this._file_view = new View({text: readFile(ejs), name: ejs });
    }
},
/* @Prototype */
{
    /**
     * Called when a new class comment is encountered.
     * @param {String} comment the comment text
     * @param {String} code the first line of source following the comment
     * @param {MVC.Doc.Pair} scope where the class was created, typically the file
     */
    init: function(comment, code, scope ){
        this._super(comment, code, scope);
        this.Class.listing.push(this);
    },
    /**
     * Verifies the class was created successfully.
     */
    comment_setup_complete : function(){
        if(!this.name){
            print("Error! No name defined for \n-----------------------")
            print(this.comment)
            print('-----------------------')
        }  
    },
    /**
     * Adds this class to the file it was created in.
     * @param {MVC.Doc.Pair} scope
     */
    add_parent : function(scope){
        //always go back to the file:
        while(scope.Class.className != 'file') scope = scope.parent;
        this.parent = scope;
        this.parent.add(this);
    },
    
    code_setup: function(){
        var parts = this.code.match(this.Class.code_match);
        this.name = parts[1];
        this.inherits = parts[2];
    },
    comment_setup: MVC.Doc.Function.prototype.comment_setup,
    class_add: function(line){
        var m = line.match(/^@\w+ ([\w\.]+)/)
        if(m){
            this.name = m[1];
        }
    },
    inherits_add: function(line){
        var m = line.match(/^\s*@\w+ ([\w\.]+)/)
        if(m){
            this.inherits = m[1];
        }
    },
    author_add: function(line){
        var m = line.match(/^\s*@author\s*(.*)/)
        if(m){
            this.author = m[1];
        }
    },
    /**
     * Renders this class to a file.
     * @param {String} left_side The left side content / list of all documented classes & constructors.
     */
    toFile : function(left_side){
        this.summary = left_side
        try{
            var res = this.Class._file_view.render(this)
            MVCOptions.save('docs/classes/'+this.name+".html", res)
        }catch(e ){
            print("Unable to generate class for "+this.name+" !")
            print("  Error: "+e)
        }
    },
    /**
     * Creates links to functions and attributes in this class.
     */
    get_quicklinks : function(){
        var inside = this.linker().sort(MVC.Doc.Pair.sort_by_full_name);
        var result = [];
        for(var i = 0; i < inside.length; i++){
            var link = inside[i];
            result.push( "<a href='#"+link.full_name+"'>"+link.name+"</a>"  )
        }
        return result.join(", ")
        
    },
    /**
     * Returns a comment that has been cleaned.
     */
    cleaned_comment : function(){
        return MVC.Doc.link_content(this.real_comment).replace(/\n\s*\n/g,"<br/><br/>");
    },
    /**
     * Returns the url for this page
     * @return {String}
     */
    url : function(){
        return this.name+".html";
    }
    
});