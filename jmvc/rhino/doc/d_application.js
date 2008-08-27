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
        //make classes
        for(var i = 0; i < MVCObject.DClass.listing.length; i++){
            MVCObject.DClass.listing[i].toFile();
        }
        //MVCObject.DClass.create_index();
        
        //make constructors
        for(var i = 0; i < MVCObject.DConstructor.listing.length; i++){
            MVCObject.DConstructor.listing[i].toFile();
        }
        //MVCObject.DConstructor.create_index();
        
        //what makes most sense is to group MVC, and Core
        
        this.summary()
    },
    summary: function(){
        var res = '<html><head><link rel="stylesheet" href="../../jmvc/rhino/doc/style.css" type="text/css">'+
            '<title>'+this.name+'<title></head><body>'
        
        res += '<h1>Application Summary <label>'+this.name+'</label></h1>'
        
        
        res += '<h2>Classes</h2>'
        
        for(var i = 0; i < MVCObject.DClass.listing.length; i++){
            var name = MVCObject.DClass.listing[i].name;
            res += "<div><a href='../classes/"+name+".html'>"+name+"</a></div>"
        }
        
        
        
        res += '<h2>Constructors </h2>'
        
        for(var i = 0; i < MVCObject.DConstructor.listing.length; i++){
            var name = MVCObject.DConstructor.listing[i].name;
            res += "<div><a href='../constructors/"+name+".html'>"+name+"</a></div>"
        }
        
        
        res += '<h2>Files </h2>'
        
        for(var i = 0; i < this.files.length; i++)
            res += '<div><a href="'+this.files[i].name  +'">'+this.clean_path( this.files[i].name)+'</a></div>'
        
        
        
        
        
        
        MVCOptions.save('docs/apps/'+this.name+".html", res)
    },
    clean_path : function(path){
        return path;
        var parts = path.split("/")
         if(parts.length > 5) parts = parts.slice(parts.length - 5);
         return parts.join("/");
    }
}