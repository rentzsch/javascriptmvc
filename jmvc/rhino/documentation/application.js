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
 * document complex functionality across multiple files. <br/>
 * 
 * <p>MVC Doc is pure JavaScript so it is easy to modify and make improvements.  First, lets show what
 * MVC Doc can document: </p>
 * <ul>
 *     <li>[MVC.Doc.Attribute | @attribute] -  values on an object.</li>
 *     <li>[MVC.Doc.Function | @function] - functions on an object.</li>
 *     <li>[MVC.Doc.Constructor | @constructor] - functions you call like: new Thing()</li>
 *     <li>[MVC.Doc.Class| @class] - normal JS Objects and source that uses [MVC.Class]</li>
 * </ul>
 * <p>You can also specifify the scope of where your functions and attributes are being added with: </p>
 * <ul>
 *     <li>[MVC.Doc.Prototype | @prototype] - add to the previous class or constructor's prototype functions</li>
 *     <li>[MVC.Doc.Static | @static] - add to the previous class or constructor's static functions</li>
 *     <li>[MVC.Doc.Add |@add] - add docs to a class or construtor described in another file</li>
 * </ul>    
 * 
 * <h3>Example</h3>
 * The following documents a Person constructor.
 * <pre><span class='comment'> /* @constructor
 *  * Person represents a human with a name.  Read about the 
 *  * animal class [Animal | here].
 *  * @init 
 *  * You must pass in a name.
 *  * @params {String} name A person's name
 *  *|</span>
 * Person = function(name){
 *    this.name = name
 *    Person.count ++;
 * }
 * <span class='comment'>/* @Static *|</span>
 * MVC.Object.extend(Person, {
 *    <span class='comment'>/* Number of People *|</span>
 *    count: 0
 * })
 * <span class='comment'>/* @Prototype *|</span>
 * Person.prototype = {
 *   <span class='comment'>/* Returns a formal name 
 *    * @return {String} the name with "Mrs." added
 *    *|</span>
 *   fancy_name : function(){
 *      return "Mrs. "+this.name;
 *   }
 * }</pre>
 * 
 * There are a few things to notice:
 * <ul>
 *     <li>The example closes comments with <i>*|</i>.  You should close them with / instead of |.</li>
 *     <li>We create a link to another class with <i>[Animal | here]</i>.</li>
 * </ul>
 * 
 * <h3>Using with a JavaScritpMVC application</h3>
 * By default, compression will automatically document your code.  Simply compress your application with:
 * <pre>js apps/app_name/compress.js</pre>
 * The docs will be put in your docs folder.
 * <h3>Using without JavaScriptMVC</h3>
 * This process will be made easier in the future.  But you have to create a js file that looks like this:
 * <pre>
 * //loads doc source
 * load('jmvc/rhino/documentation/setup.js'); 
 * //pass file locations, and a name to a new Doc.Application
 * new MVC.Doc.Application(['file1.js','folder/file2.js'], "MyApp");</pre>
 */
MVC.Doc = 
/* @Static */
{    
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
 * @param {Array} total An array of path names or objects with a path and text.
 * @param {Object} app_name The application name.
 */
MVC.Doc.Application = function(total, app_name){
    
    this.name = app_name;
    this.total = total;
    this.files = [];
    
   
    for(var s=0; s < total.length; s++){
        script = total[s];
        if(typeof script == "string"){
            script = total[s] = {path: script, text: readFile(script)};
        }
        
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
        MVC.Doc.render_to('docs/'+this.name+".html","jmvc/rhino/documentation/templates/summary.ejs" , this)

    },
    
    
    clean_path : function(path){
        return path;
        var parts = path.split("/")
         if(parts.length > 5) parts = parts.slice(parts.length - 5);
         return parts.join("/");
    }
}