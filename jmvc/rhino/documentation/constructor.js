/**
 * Documents javascript constructor classes typically created like:
 * new MyContructor(args).
 * 
 * A constructor can be described by putting @constructor as the first declaritive.
 * To describe the construction function, write that after init.  Example:
 * 
 * <pre>
 * <div class='comment'>/* @constructor
 *  * Person represents a human with a name 
 *  * @init 
 *  * You must pass in a name.
 *  * @params {String} name A person's name
 *  *|</div>
 * Person = function(name){
 *    this.name = name
 *    Person.count ++;
 * }
 * /* @Static *|
 * MVC.Object.extend(Person, {
 *    /* Number of People *|
 *    count: 0
 * })
 * /* @Prototype *|
 * Person.prototype = {
 *   /* Returns a formal name 
 *    * @return {String} the name with "Mrs." added
 *    *|
 *   fancy_name : function(){
 *      return "Mrs. "+this.name;
 *   }
 * }</pre>
 * 
 */
MVC.Doc.Constructor = MVC.Doc.Pair.extend('constructor',
/* @Static */
{
    code_match: /([\w\.]+)\s*[:=]\s*function\(([^\)]*)/,
    starts_scope: true,
    listing: [],
    create_index : function(){
        var res = '<html><head><link rel="stylesheet" href="../style.css" type="text/css" />'+
            '<title>Constructors</title></head><body>'
        res += '<h1>Constructors <label>LIST</label></h1>'
        for(var i = 0; i < this.listing.length; i++){
            var name = this.listing[i].name;
            res += "<a href='"+name+".html'>"+name+"</a> "
        }
        res +="</body></html>"
        MVCOptions.save('docs/constructors/index2.html', res)
    },
    init : function(){
        this._super();
        var ejs = "jmvc/rhino/documentation/templates/file.ejs"
        this._file_view = new View({text: readFile(ejs), name: ejs });
    }
},
/* @Prototype */
{
    /**
     * 
     * @param {Object} comment
     * @param {Object} code
     * @param {Object} scope
     */
    init: function(comment, code, scope ){
        this._super(comment, code, scope);
        this.Class.listing.push(this);
    },
    add_parent : function(scope){
        while(scope.Class.className != 'file') scope = scope.parent;
        this.parent = scope;
        this.parent.add(this);
    },
    code_setup: MVC.Doc.Function.prototype.code_setup,
    comment_setup: MVC.Doc.Function.prototype.comment_setup,
    return_add: MVC.Doc.Function.prototype.return_add,
    /**
     * @function param_add
     * Adds @param data to the constructor function
     * @param {String} line
     */
    param_add: MVC.Doc.Function.prototype.param_add,
    /**
     * @function param_add_more
     * Adds data on lines following a @param to the previous @param
     * @param {String} line
     */
    param_add_more: MVC.Doc.Function.prototype.param_add_more,
    /**
     * Adds the @init data to the constructor.  Adds to init_description.
     * @param {String} line the first line that has @init
     */
    init_add: function(line){
            var parts = line.match(/\s?@init (.*)/);
            if(!parts){
                this.init_description = "";
                return true;
            } 
            this.init_description = parts.pop();
            return this.init_description;
    },
    /**
     * Adds lines called after a @param to the init_description
     * @param {Object} line
     */
    init_add_more: function(line){
        this.init_description +="\n"+ line;
    },
    toFile : function(summary){
        this.summary = summary
        //try{
            var res = this.Class._file_view.render(this)
            MVCOptions.save('docs/classes/'+this.name+".html", res)
        //}catch(e ){
        //    throw
        //}
    },
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
     * Returns the HTML signiture of the constructor function.
     */
    signiture : function(){
            var res = [];
            for(var n in this.params){
                res.push(n)
            }
            var n = this.name;
            //if(this.parent.Class.className == 'static')
            //    n = this.parent.parent.name+"."+this.name;
            //else if(this.parent.Class.className == 'prototype')
            //    n = this.parent.parent.name.toLowerCase()+"."+this.name;
            if(this.ret.type =='undefined'){
                n = "new "+n;
                this.ret.type = this.name.toLowerCase();
            }
            return n+"("+res.join(", ")+") -> "+this.ret.type;
    },
    url : function(){
        return this.name+".html";
    }
});