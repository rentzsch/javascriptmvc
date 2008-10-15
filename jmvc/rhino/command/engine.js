Engine =  function(uri, name){
    this.uri =  uri
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
    }
}

