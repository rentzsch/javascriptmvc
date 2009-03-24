//js apps/engine/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function(total){
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/engine/production.js', compressed);
        print("Compressed to 'apps/engine/production.js'.");
        load('jmvc/rhino/documentation/setup.js');
        
        var app = new MVC.Doc.Application(total, "engine");
        app.generate();
        print("Generated docs.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
__env__.scriptTypes["text/javascript"] = true;
window._rhino = __env__.platform == 'Rhino ';
window.location = 'apps/engine/index.html';
