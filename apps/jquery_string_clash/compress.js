//js apps/jquery_string_clash/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function(total){
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/jquery_string_clash/production.js', compressed);
        print("Compressed to 'apps/jquery_string_clash/production.js'.");
        load('jmvc/rhino/documentation/setup.js');
        
        var app = new MVC.Doc.Application(total, "jquery_string_clash");
        app.generate();
        print("Generated docs.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
window.location = 'apps/jquery_string_clash/index.html';