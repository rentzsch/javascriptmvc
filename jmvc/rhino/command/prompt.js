prompt = function(question){
    java.lang.System.out.print(question);
    var br = new java.io.BufferedReader(new java.io.InputStreamReader(java.lang.System["in"]));
    var response;
    try {
         response = br.readLine();
    } catch (e) {
         System.out.println("IO error trying to read");
    }
    return response;
}