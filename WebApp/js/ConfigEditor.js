ConfigEditor = {};

ConfigEditor.nuke = function()
{
    NativeInterface.back = ConfigEditor.lastBack;
    WebLibSimple.nuke(ConfigEditor.mainDiv);
};

ConfigEditor.createEntry = function(title, strings, event)
{
    var topDiv = ConfigEditor.topDiv;

    var entry = WebLibSimple.createAnyAppend("center", topDiv);
    entry.style.paddingTop = GlobalConf.configEditor_paddingTop + "px";

    var div = WebLibSimple.createAnyAppend("div", entry);
    div.style.height      = GlobalConf.configEditor_height   + "px";
    div.style.lineHeight  = GlobalConf.configEditor_height   + "px";
    div.style.fontSize    = GlobalConf.configEditor_fontSize + "px";
    div.style.color       = "#ffffff";
    div.innerHTML         = strings[ title ];

    div.onclick = function()
    {
        ConfigEditor.nuke();
        event(title);
    };

    StdDesign.dimmerTouch(div);

    return div;
};

ConfigEditor.init = function(title, options, strings, doneEvent)
{
    var div = StdDesign.createStd(Config.mainDiv);

    ConfigEditor.mainDiv = div;
    ConfigEditor.topDiv = div.content;

    div.setHeadline(title);
    div.createButton("X", ConfigEditor.nuke);

    ConfigEditor.lastBack = NativeInterface.back;
    NativeInterface.back = ConfigEditor.nuke;

    for (var index in options)
    {
        var option = options[ index ];
        ConfigEditor.createEntry(option, strings, doneEvent);
    }
};
