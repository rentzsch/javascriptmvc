//js apps/testing/compress.js

MVCOptions = {
    onload: false,
    compress_callback: function(total){
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/testing/production.js', compressed);
        print("Compressed to 'apps/testing/production.js'.");
        var app = new MVCObject.DApplication(total, "testing");
        app.generate();
        print("Generated docs.");
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
load('jmvc/rhino/documentation/setup.js');
window.location = 'apps/testing/index.html';