/**
 * Documents an attribute.  Example:
 * <pre>MVC.Object.extend(Person, {
 *    <span class='comment'>/* Number of People *|</span>
 *    count: 0
 * })</pre>
 */
MVC.Doc.Attribute = MVC.Doc.Pair.extend('attribute',
 /* @prototype */
 {
     /**
      * Matches an attribute with code
      * @param {Object} code
      */
     code_match: function(code){
         return code.match(/(\w+)\s*[:=]\s*/) && !code.match(/(\w+)\s*[:=]\s*function\(([^\)]*)/)  
     }
 },{
     /**
      * Saves the name of the attribute
      */
     code_setup: function(){
        var parts = this.code.match(/(\w+)\s*[:=]\s*/);
        this.name = parts[1];
     }
 })