MVCOptions = {
    onload: false,
    compress_callback: function(total){
        
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/everything/production.js', compressed);
        print("Compressed to 'apps/everything/production.js'.");
        
        print("Parsing files for docs ...");
        MVC.load_doc = false;
        load('jmvc/rhino/documentation/setup.js');
        //add include
        total.unshift("jmvc/include.js")
        var app = new MVC.Doc.Application(total, "jmvc");
        app.generate();
        print("Generated docs.");
    },
    env:"compress"
}
load('jmvc/rhino/compression/setup.js');
window.location = 'apps/everything/index.html';
