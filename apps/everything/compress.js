MVCOptions = {
    onload: false,
    compress_callback: function(total){
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/everything/production.js', compressed);
        print("Compressed to 'apps/everything/production.js'.");
        
        print("Parsing files for docs ...");
        var app = new MVCObject.DApplication(total, "jmvc");
        
        app.generate();
        print("Generated docs.");
    }
}
load('jmvc/rhino/htmlparser.js');
load('jmvc/rhino/env.js');
load('jmvc/rhino/helpers.js');
load('jmvc/rhino/doc.js');
window.location = 'apps/everything/index.html';
