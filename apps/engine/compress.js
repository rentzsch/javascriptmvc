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
load('jmvc/rhino/compression/setup.js');
load('jmvc/rhino/documentation/setup.js');
window.location = 'apps/engine/index.html';