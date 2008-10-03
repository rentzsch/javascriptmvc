/*  This is a port to JavaScript of Rail's plugin functionality.  It uses the following
 * license:
 *  This is Free Software, copyright 2005 by Ryan Tomayko (rtomayko@gmail.com) 
     and is licensed MIT: (http://www.opensource.org/licenses/mit-license.php)
 */

File = {
    join: function(){
        var args = [];
        arguments.forEach(function(arg){
            args.push( arg.match(/^\/?(.*?)\/$/)[1])
        })
        
        return args.join("/")
    }
}


RecursiveHTTPFetcher = function(urls_to_fetch, level, cwd){
    this.urls_to_fetch = urls_to_fetch;
    this.level = level || 1
    this.cwd = cwd || "."
    this.quite =false
    
}
RecursiveHTTPFetcher.prototype = {
    ls: function(){
        var links = [];
        this.urls_to_fetch.forEach(function(url){
            if(url.match( /^svn:\/\/.*/ ) ){
              print('not supported')
          
            }else{
                links.concat( this.links("", readUrl( url)	) );
            }
        });
        return links;
        //store and return flatten
    },
    links: function(base_url, contents){
        var links = []
        var anchors = contents.match(/href\s*=\s*\"*[^\">]*/i);
        anchors.forEach(function(link){
            link = link.replace(/href="/i, "");
            if(link.match(/svnindex.xsl$/) ) continue;
            if(link.match(  /^(\w*:|)\/\//) || link.match(/^\./)    ) continue;
            links.push( File.join(base_url,link) );
        } )
        return links;
    },
    push_d: function(dir){
        this.cwd = File.join(this.cwd , dir);
        //  FileUtils.mkdir_p(this.cwd) make this directory
    },
    pop_d: function(){
        // get absolute  @cwd = File.dirname(@cwd)
    },
    download : function(link){
        var file = readUrl( link);
        //save to file!  File.basename(link))
    },
    fetch : function(links ){
        var auto_fetch = !links;
        links = links || this.urls_to_fetch
        links.forEach(function(link){
            link.match(/\/$/) || auto_fetch ? this.fetch_dir(link) : this.download(link);
        })
    },
    fetch_dir : function(url){
        this.level++;
        if(this.level > 0) this.push_d(url);
        
        var contents = readUrl(url)
        this.fetch(this.links(url, contents));
        if(this.level > 0) this.pop_d();
        this.level --;
    }
    
}