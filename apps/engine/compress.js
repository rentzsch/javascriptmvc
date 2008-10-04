//js apps/engine/compress.js

MVCOptions = {
    onload: false,
    compress_callback: function(total){
        var compressed = MVCOptions.collect(total);
        MVCOptions.save('apps/engine/production.js', compressed);
        print("Compressed to 'apps/engine/production.js'.");
        var app = new MVCObject.DApplication(total, "engine");
        app.generate();
        print("Generated docs.");
    },
    env: "compress"
}
load('jmvc/rhino/htmlparser.js');
load('jmvc/rhino/env.js');
load('jmvc/rhino/helpers.js');
load('jmvc/rhino/doc.js');
window.location = 'apps/engine/index.html';