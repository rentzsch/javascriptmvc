/**
 * Documents a function.
 * Doc can guess at a functions name and params if the source following a comment
 * matches something like:
 * @code_start
 * myFuncOne : function(param1, param2){}  //or
 * myFuncTwo = function(param1, param2){} 
 * @code_end
 * <h3>Directives</h3>
 * Use the following directives to document a function.
@code_start no-highlight
@function <i>function_name</i>                  -> Forces a function
@param {<i>optional:type</i>} <i>param_name</i> <i>Description</i>     -> Describes a parameter
@return {<i>type</i>} <i>Description</i>               -> Describes the return value
@code_end
 * Add <i>optional:</i> for optional params.
 * <h3>Example</h3>
@code_start
/* Adds, Mr. or Ms. before someone's name
* * @param {String} name the persons name
* * @param {optional:Boolean} gender true if a man, false if female.  Defaults to true.
* * @return {String} returns the appropriate honorific before the person's name.
* *| 
 honorific = function(name, gender){
@code_end
 */
MVC.Doc.Function = MVC.Doc.Pair.extend('function',
/* @static */
{
    code_match: /([\w\.\$]+)\s*[:=]\s*function\(([^\)]*)/,
    init : function(){
        this.add(MVC.Doc.Directive.Return, MVC.Doc.Directive.Param, MVC.Doc.Directive.CodeStart, MVC.Doc.Directive.CodeEnd)
        this._super();
    }
},
/* @prototype */
{
    code_setup: function(){
        var parts = this.Class.code_match(this.code);
        if(!parts){
            parts = this.code.match(/\s*function\s+([\w\.\$]+)\s*\(([^\)]*)/)
        }
        this.name = parts[1].replace(/^this\./,"");
        this.params = {};
        this.ret = {type: 'undefined',description: ""}
        var params = parts[2].match(/\w+/);
        if(!params) return;
        
        for(var i = 0 ; i < params.length; i++){
            this.params[params[i]] = {description: "", type: "", optional: false, order: i, name: params[i]};
        }
        
    },
    /**
     * Goes through the comment line by line.  Searches for lines starting with a <i>@directive</i>.
     * If a line with a directive is found, it sees if the instance has a function that matches
     * <i>directive</i>_add exists.  If it does, <i>directive</i>_add is called on that object.
     * If following lines do not have a directive, the <i>directive</i>_add_more function is called
     * on the instance
     * <br/>
     * Initial comments are added to real_comment.<br>
     * This function is shared by Class and Constructor.
     */
    comment_setup: function(){
        var i = 0;
        var lines = this.comment.split("\n");
        this.real_comment = '';
        if(!this.params) this.params = {};
        if(!this.ret) this.ret = {type: 'undefined',description: ""};
        var last, last_data;
        for(var l=0; l < lines.length; l++){
            var line = lines[l];
            var match = line.match(/^[\s*]?@(\w+)/)
            if(match){
                var fname = (match[1]+'_add').toLowerCase();
                if(! this[fname]) {
                    this.real_comment+= line+"\n"
                    continue;
                }
                last_data = this[fname](line);
                if(last_data) last = match[1].toLowerCase(); else last = null;
            }
            else if(!line.match(/^constructor/i) && !last )
                this.real_comment+= line+"\n"
            else if(last && this[last+'_add_more']){
                this[last+'_add_more'](line, last_data);
            }
        }
        if(this.comment_setup_complete) this.comment_setup_complete();
    },

    /**
     * Sets the function's name if one can't be determined from the source
     * @param {Object} line
     */
    function_add: function(line){
        var m = line.match(/^@\w+\s+([\w\.\$]+)/)
        if(m) this.name = m[1];
    },
    /**
     * Returns the HTML signiture of the function.
     */
    signiture : function(){
        var res = [];
        var ordered = this.ordered_params();
        for(var n = 0; n < ordered.length; n++){
            var param = ordered[n];
            res.push(param.name)
        }
        
        var n = this.name;
        return n+"("+res.join(", ")+") -> "+this.ret.type;
    }
});