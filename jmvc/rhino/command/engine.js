Engine =  function(uri, name){
    if(! uri.match(/^http/)){
        this.name = uri;
        return this.check_engine_list();
    }
    this.uri =  uri;
    if(name){
        this.name = name;
    }else
        this.guess_name(uri);
}
Engine.prototype = {
    install_using_http: function(options){
        options = options || {};
        new File("engines/"+this.name).mkdir();
        var fetcher = new RecursiveHTTPFetcher(this.uri, -1, "engines/"+this.name)
        fetcher.quiet = options.quiet || true
        fetcher.fetch();
        print("  Engine downloaded.")
    },
    guess_name: function(url){
      this.name = new MVC.File(url).basename();
      if(this.name == 'trunk' || ! this.name){
          this.name = new MVC.File( new MVC.File(url).dir() ).basename();
      }
    },
	check_engine_list : function(){
        print("  Looking for engine ...")
        
        var plugin_list_source = readUrl("http://javascriptmvc.googlecode.com/svn/branches/1_5/jmvc/rhino/command/engine_list.json");
        var plugin_list;
        eval("plugin_list = "+plugin_list_source);
        this.uri = plugin_list[this.name]
        if(!this.uri){
            print("  no plugin named '"+this.name+"' was found.  Maybe try supplying a url.");
            quit();
        }
        print("  Engine found.")
        
    }
}

