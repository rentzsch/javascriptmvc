/**
 * Hey o [MVC.Doc.Constructor.prototype.init | Constructor's init]
 */
MVC.Doc.Class = MVC.Doc.Pair.extend('class',
{
    code_match: /([\w\.]+)\s*=\s*([\w\.]+?).extend\(/,
    starts_scope: true,
    listing: [],
    create_index : function(){
        var res = '<html><head><link rel="stylesheet" href="../style.css" type="text/css">'+
            '<title>Classes</title></head><body>'
        res += '<h1>Classes <label>LIST</label></h1>'
        for(var i = 0; i < this.listing.length; i++){
            var name = this.listing[i].name;
            res += "<a href='"+name+".html'>"+name+"</a> "
        }
        res +="</body></html>"
        MVCOptions.save('docs/classes/index.html', res)
    },
    init : function(){
        this._super();
        var ejs = "jmvc/rhino/documentation/templates/file.ejs"
        this._file_view = new View({text: readFile(ejs), name: ejs });
    }
},
{
    init: function(comment, code, scope ){
        this._super(comment, code, scope);
        this.Class.listing.push(this);
    },
    comment_setup_complete : function(){
        if(!this.name){
            print("Error! No name defined for \n-----------------------")
            print(this.comment)
            print('-----------------------')
        }  
    },
    add_parent : function(scope){
        //always go back to the file:
        while(scope.Class.className != 'file') scope = scope.parent;
        this.parent = scope;
        this.parent.add(this);
    },
    code_setup: function(){
        var parts = this.code.match(this.Class.code_match);
        this.name = parts[1];
        this.sup = parts[2];
    },
    comment_setup: MVC.Doc.Function.prototype.comment_setup,
    class_add: function(line){
        var m = line.match(/^@\w+ ([\w\.]+)/)
        if(m){
            this.name = m[1];
        }
    },
    toFile : function(summary){
        this.summary = summary
        try{
            var res = this.Class._file_view.render(this)
            MVCOptions.save('docs/classes/'+this.name+".html", res)
        }catch(e ){
            print("Unable to generate class for "+this.name+" !")
            print("  Error: "+e)
        }
        
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
    cleaned_comment : function(){
        return MVC.Doc.link_content(this.real_comment);
    },
    url : function(){
        return this.name+".html";
    }
    
});