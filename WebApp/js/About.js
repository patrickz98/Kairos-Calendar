About = {};

About.nuke = function()
{
    NativeInterface.back = About.lastBack;
    WebLibSimple.nuke(About.topdiv);
};

About.headline = function()
{
    var headline = WebLibSimple.createDivHeight(0, 0, 0, GlobalConf.about_headlineSize, null, About.topdiv);
    headline.style.backgroundColor = GlobalConf.about_headlineColor;
    headline.style.textAlign = "center";
    headline.style.fontSize = GlobalConf.about_headlineFontSize + "px";
    headline.style.lineHeight = GlobalConf.about_headlineSize + "px";
    headline.innerHTML = "About";
};

About.bottom = function()
{
    var bottom = WebLibSimple.createDivHeight(0, 0, 0, GlobalConf.about_bottomSize, null, About.topdiv);
    bottom.style.top = null;
    bottom.style.bottom = "0px";
    bottom.style.backgroundColor = GlobalConf.about_bottomColor;
    bottom.style.textAlign = "center";
    bottom.style.fontSize = GlobalConf.about_bottomFontSize + "px";
    bottom.style.lineHeight = GlobalConf.about_bottomSize + "px";
    bottom.innerHTML = "Close";

    bottom.onclick = About.nuke;

    About.lastBack = NativeInterface.back;
    NativeInterface.back = About.nuke;

    StdDesign.dimmerTouch(bottom);
};

About.Who = function(parent)
{
    var headline = WebLibSimple.createAnyAppend("h1", parent);
    headline.style.textAlign = "center";
    headline.style.fontSize = GlobalConf.about_h1FontSize + "px";
    headline.innerHTML = "Who am I?";

    var centext = WebLibSimple.createAnyAppend("div", parent);
    // centext.style.width = GlobalConf.about_width + "px";
    centext.style.left = GlobalConf.about_border;
    centext.style.right = GlobalConf.about_border;
    centext.style.fontSize = GlobalConf.about_fontSize + "px";
    centext.innerHTML = "" +
        "My name is Patrick Zierahn. I'm a 18 years old Student who visits " +
        "a High-School in Hamburg Germany. I like to code " +
        " and design apps.";
};

About.libs = function(parent)
{
    var headline = WebLibSimple.createAnyAppend("h1", parent);
    headline.style.textAlign = "center";
    headline.style.fontSize = GlobalConf.about_h1FontSize + "px";
    headline.innerHTML = "Libarys";

    var centext = WebLibSimple.createAnyAppend("div", parent);
    // centext.style.width = GlobalConf.about_width + "px";
    centext.style.left = GlobalConf.about_border;
    centext.style.right = GlobalConf.about_border;
    centext.style.fontSize = GlobalConf.about_fontSize + "px";
    centext.innerHTML = "" +
        "I used the <strong>https://github.com/dm77/barcodescanner</strong> libary for the QR-Code proceedings. " +
        "A lot of thanks for the great work.\n" +
        "The libary is under Apache License 2.0: <strong>http://www.apache.org/licenses/LICENSE-2.0</strong>";

    // var link = WebLibSimple.createAnyAppend("a", centext);
    // link.href = "http://www.apache.org/licenses/LICENSE-2.0";
    // link.innerHTML = "http://www.apache.org/licenses/LICENSE-2.0";
};

About.content = function()
{
    var content = WebLibSimple.createDiv(40, GlobalConf.about_headlineSize, 40, GlobalConf.about_bottomSize, null, About.topdiv);
    content.style.color = "#000000";
    // content.innerHTML = "Content";

    var center = WebLibSimple.createAnyAppend("center", content);
    // About.Who(center);
    About.libs(center);
};

About.init = function()
{
    var topdiv = WebLibSimple.createDiv(0, 0, 0, 0, null, Main.toptopDiv);
    topdiv.style.backgroundColor = "#ffffff";
    About.topdiv = topdiv;

    About.headline();
    About.content();
    About.bottom();
};

// about_headlineFontSize: 50,
// about_headlineSize: 100,
// about_bottomColor: "#333333",
// about_bottomFontSize: 30,
// about_bottomSize: 100,
// about_h1FontSize: 35,
// GlobalConf.about_border
