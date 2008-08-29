// java -jar jmvc\rhino\js.jar -e load('apps/translations/compress.js')

MVCOptions = {
    onload: false,
    compress_callback: function(total){
        var compressed = MVCOptions.collect_and_compress(total);
        MVCOptions.save('apps/translations/production.js', compressed);
        print("Compressed to 'apps/translations/production.js'.");
        var app = new MVCObject.DApplication(total, "translations");
        app.generate();
        print("Generated docs.");
    }
}
load('jmvc/rhino/htmlparser.js');
load('jmvc/rhino/env.js');
load('jmvc/rhino/helpers.js');
load('jmvc/rhino/doc.js');
window.location = 'apps/translations/index.html';
