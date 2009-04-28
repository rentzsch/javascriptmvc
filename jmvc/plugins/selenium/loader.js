importClass(Packages.com.thoughtworks.selenium.DefaultSelenium);
var selenium = new DefaultSelenium("localhost", 4444, "*firefox C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe", "http://www.google.com");
selenium.start();
selenium.open("file:///c:/development/jmvc_1_5/index.html");
//selenium.type("q", "hello world");
//selenium.click("btnG");
//selenium.stop();