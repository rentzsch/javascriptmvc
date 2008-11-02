RMVC.render_to = function(file, ejs, data){
    var v = new View({text: readFile(ejs) });
    
    MVCOptions.save(file,  v.render(data)  );
    
    //print( (first ? "Generating ...":"              ") + " "+file);
    
    //first = false;
}

RMVC.DApplication = function(total, app_name){
    
    this.name = app_name;
    this.total = total;
    this.files = [];
    
    
    print('total '+total.length)
    
    
    for(var s=0; s < total.length; s++){
		script = total[s];
        if(typeof script != 'function' && !script.process)
            this.files.push( new RMVC.DFile(total[s]) ) 
	}
        
    
    
    
}


RMVC.DApplication.prototype = {
    generate : function(){
        var summary = this.summary();
        
        //make classes
        for(var i = 0; i < RMVC.DClass.listing.length; i++){
            RMVC.DClass.listing[i].toFile(summary);
        }
        //RMVC.DClass.create_index();
        
        //make constructors
        for(var i = 0; i < RMVC.DConstructor.listing.length; i++){
            RMVC.DConstructor.listing[i].toFile(summary);
        }

        this.summary_page(summary)
    },
    summary: function(){

        var res = "<h3>Documentation</h3><ul>"

        var things = RMVC.DClass.listing.concat( RMVC.DConstructor.listing ).sort( RMVC.DPair.sort_by_name );
        

        for(var i = 0; i < things.length; i++){
            var name = things[i].name;
            res += "<li><a href='../classes/"+name+".html'>"+name+"</a></li>"
        }
        
        
        

        
        return res + "</ul>"

    },
    summary_page : function(summary){
        print("rendering summary");

        RMVC.render_to('docs/'+this.name+".html","jmvc/rhino/documentation/templates/summary.ejs" , this)

    },
    
    
    clean_path : function(path){
        return path;
        var parts = path.split("/")
         if(parts.length > 5) parts = parts.slice(parts.length - 5);
         return parts.join("/");
    }
}