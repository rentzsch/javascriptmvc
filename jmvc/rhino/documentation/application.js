MVC.render_to = function(file, ejs, data){
    var v = new View({text: readFile(ejs), name: ejs });
    
    MVCOptions.save(file,  v.render(data)  );
    
    //print( (first ? "Generating ...":"              ") + " "+file);
    
    //first = false;
};


MVC.Doc = {
    render_to: function(file, ejs, data){
        var v = new View({text: readFile(ejs), name: ejs });
        MVCOptions.save(file,  v.render(data)  );
    }
};

/**
 * 
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