MVC.render_to = function(file, ejs, data){
    var v = new View({text: readFile(ejs), name: ejs });
    
    MVCOptions.save(file,  v.render(data)  );
    
    //print( (first ? "Generating ...":"              ") + " "+file);
    
    //first = false;
};

/**
 * @class MVC.Doc
 * JavaScriptMVC comes with powerful and easy to extend documentation functionality - MVC Doc.
 * MVC Doc is designed specifically for documenting JavaScript.  It understands a little about
 * JavaScript syntax to guess at things like function names and parameters.  But, you can also
 * document complex functionality across multiple files.
 * 
 * MVC Doc is pure JavaScript so it is easy to modify and make improvements.  First, lets get through
 * what JavaScriptMVC can document: <br/>
 * 
 * [MVC.Doc.Class], [MVC.Doc.Constructor], [MVC.Doc.Function], [MVC.Doc.Attribute]<br/>
 * 
 * MVC Doc lets you manipulate the scope of your code with: <br/>
 * 
 * [MVC.Doc.Prototype], [MVC.Doc.Static], [MVC.Doc.Add]
 * 
 */
MVC.Doc = {
    render_to: function(file, ejs, data){
        var v = new View({text: readFile(ejs), name: ejs });
        MVCOptions.save(file,  v.render(data)  );
    },
    /**
     * Replaces content in brackets [] with a link to source.
     * @param {String} content Any text, usually a commment.
     */
    link_content : function(content){
        return content.replace(/\[\s*([^\|\]\s]*)\s*\|?\s*([^\]]*)\s*\]/g, function(match, first, name){
            //need to get last
            //need to remove trailing whitespace
            var url = MVC.Doc.objects[first];
            if(!name){
                name = first.replace(/\.prototype|\.static/)
            }
            return url ? "<a href='"+url+"'>"+name+"</a>" : match;
        })
    },
    /**
     * A map of the full name of all the objects the application creates and the url to 
     * the documentation for them.
     */
    objects : {}
};

/**
 * @constructor
 * abc
 * @init
 * asfda
 * @param {Object} total
 * @param {Object} app_name
 */
MVC.Doc.Application = function(total, app_name){
    
    this.name = app_name;
    this.total = total;
    this.files = [];
    
   
    for(var s=0; s < total.length; s++){
		script = total[s];
        if(typeof script != 'function' && !script.process){
            this.files.push( new MVC.Doc.File(total[s]) ) 
        }
	}
}


MVC.Doc.Application.prototype = {
    generate : function(){
        var summary = this.summary();
        
        //make classes
        for(var i = 0; i < MVC.Doc.Class.listing.length; i++){
            MVC.Doc.Class.listing[i].toFile(summary);
        }
        //MVC.Doc.Class.create_index();
        
        //make constructors
        for(var i = 0; i < MVC.Doc.Constructor.listing.length; i++){
            MVC.Doc.Constructor.listing[i].toFile(summary);
        }

        this.summary_page(summary)
    },
    summary: function(){

        var res = "<h3>Documentation</h3><ul>"

        var things = MVC.Doc.Class.listing.concat( MVC.Doc.Constructor.listing ).sort( MVC.Doc.Pair.sort_by_name );

        for(var i = 0; i < things.length; i++){
            var name = things[i].name;
            res += "<li><a href='../classes/"+name+".html'>"+name+"</a></li>"
        }
        return res + "</ul>"

    },
    summary_page : function(summary){
        print("rendering summary");

        MVC.Doc.render_to('docs/'+this.name+".html","jmvc/rhino/documentation/templates/summary.ejs" , this)

    },
    
    
    clean_path : function(path){
        return path;
        var parts = path.split("/")
         if(parts.length > 5) parts = parts.slice(parts.length - 5);
         return parts.join("/");
    }
}