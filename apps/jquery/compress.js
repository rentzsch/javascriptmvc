//js apps/jquery/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function(total){
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/jquery/production.js', compressed);
        print("Compressed to 'apps/jquery/production.js'.");
        load('jmvc/rhino/documentation/setup.js');
        
        var app = new MVC.Doc.Application(total, "jquery");
        app.generate();
        print("Generated docs.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
__env__.scriptTypes["text/javascript"] = true;
window._rhino = __env__.platform == 'Rhino ';
window.location = 'apps/jquery/index.html';
