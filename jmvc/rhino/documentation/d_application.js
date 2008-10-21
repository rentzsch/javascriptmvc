MVCObject.DApplication = function(total, app_name){
    
    this.name = app_name;
    this.total = total;
    this.files = [];
    
    
    
    
    
    for(var s=0; s < total.length; s++){
		script = total[s];
        if(typeof script != 'function' && !script.process)
            this.files.push( new MVCObject.DFile(total[s]) ) 
	}
        
    
    
    
}


MVCObject.DApplication.prototype = {
    generate : function(){
        var summary = this.summary();
        
        //make classes
        for(var i = 0; i < MVCObject.DClass.listing.length; i++){
            MVCObject.DClass.listing[i].toFile(summary);
        }
        //MVCObject.DClass.create_index();
        
        //make constructors
        for(var i = 0; i < MVCObject.DConstructor.listing.length; i++){
            MVCObject.DConstructor.listing[i].toFile(summary);
        }

        this.summary_page(summary)
    },
    summary: function(){

        var res = "<h3>Documentation</h3><ul>"

        var things = MVCObject.DClass.listing.concat( MVCObject.DConstructor.listing ).sort( MVCObject.DPair.sort_by_name );
        

        for(var i = 0; i < things.length; i++){
            var name = things[i].name;
            res += "<li><a href='../classes/"+name+".html'>"+name+"</a></li>"
        }
        
        
        

        
        return res + "</ul>"

    },
    summary_page : function(summary){
        var res = '<html><head><link rel="stylesheet" href="../jmvc/rhino/doc/style.css" type="text/css" />'+
            '<title>'+this.name+'</title></head><body>'
        
        res += "<div id='left_side'>"+"</div>"
        res += "<div id='right_side'>"
        res += '<h1>Application Summary <label>'+this.name+'</label></h1>'
        
        
        res += '<h2>Classes</h2>'
        var things = MVCObject.DClass.listing.sort( MVCObject.DPair.sort_by_name );
        

        for(var i = 0; i < things.length; i++){
            var name = things[i].name;
            res += "<li><a href='classes/"+name+".html'>"+name+"</a></li>"
        }
        
        
        
        res += '<h2>Constructors </h2>'
        var sorted_constructors = MVCObject.DConstructor.listing.sort( MVCObject.DPair.sort_by_name )
        for(var i = 0; i < sorted_constructors.length; i++){
            var name = sorted_constructors[i].name;
            res += "<div><a href='classes/"+name+".html'>"+name+"</a></div>"
        }
        
        
        res += '<h2>Files </h2>'
        
        for(var i = 0; i < this.files.length; i++)
            res += '<div><a href="'+this.files[i].name  +'">'+this.clean_path( this.files[i].name)+'</a></div>'
        
        
        res+="</div>";
        
        
        //return res + "</ul>"
        MVCOptions.save('docs/'+this.name+".html", res)
    },
    
    
    clean_path : function(path){
        return path;
        var parts = path.split("/")
         if(parts.length > 5) parts = parts.slice(parts.length - 5);
         return parts.join("/");
    }
}