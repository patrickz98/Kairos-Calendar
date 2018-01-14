Config = {};

Config.nuke = function()
{
    NativeInterface.back = Config.lastBack;
    WebLibSimple.nuke(Config.mainDiv);
};

Config.update = function()
{
    ConfigManager.update();
    NativeInterface.reload();
};

Config.createEntry = function(event)
{
    var topDiv = Config.topDiv;

    var entry = WebLibSimple.createAnyAppend("center", topDiv);
    entry.style.paddingTop = GlobalConf.config_paddingTop + "px";

    var div = WebLibSimple.createAnyAppend("div", entry);
    div.style.borderRadius    = "1000px";
    div.style.width           = GlobalConf.config_width  + "px";
    div.style.height          = GlobalConf.config_height + "px";
    div.style.lineHeight      = GlobalConf.config_height + "px";
    div.style.fontSize        = GlobalConf.config_fontSize + "px";
    div.style.color           = GlobalConf.config_color;
    div.style.backgroundColor = GlobalConf.config_backgroundColor;

    div.changeTitle = function(title)
    {
        div.innerHTML = title;
    };

    div.onclick = event;

    StdDesign.dimmerTouch(div);

    return div;
};

Config.createOption = function(GlobalConfKey, strings)
{
    // "language": "Language",
    // "dateFormat": "Date Format",
    // "weekStartDay": "Start of the week"

    var selected = GlobalConf[ GlobalConfKey ];
    var options = Object.keys(strings);

    var title = StringManager.locale[ GlobalConfKey ];
    var target = null;

    var doneEvent = function(selection)
    {
        target.changeTitle(title + ": " + strings[ selection ]);
        GlobalConf[ GlobalConfKey ] = selection;
    };

    var click = function(event)
    {
        target = event.target;
        ConfigEditor.init(title, options, strings, doneEvent);
    };

    var entry = Config.createEntry(click);
    entry.changeTitle(title + ": " + strings[ selected ]);
};

Config.createEditCategorys = function()
{
    var click = function(event)
    {
        ConfigCategorys.init();
    };

    var entry = Config.createEntry(click);
    entry.changeTitle(StringManager.locale.EditCategorys);
};

Config.init = function()
{
    Menu.closeAnimation();

    var div = StdDesign.createStd(Main.toptopDiv);

    div.setHeadline(StringManager.locale.Config);
    // div.createButton("X", Config.nuke);
    div.createButton("OK", Config.update);

    Config.lastBack = NativeInterface.back;
    NativeInterface.back = Config.update;

    Config.mainDiv = div;
    Config.topDiv = div.content;

    // GlobalConf.language
    // GlobalConf.dateFormat
    // GlobalConf.weekStartDay

    Config.createOption("language",     StringManager.locale.languages);
    Config.createOption("dateFormat",   StringManager.locale.dateFormats);
    Config.createOption("weekStartDay", StringManager.locale.weekdays);

    Config.createEditCategorys();
};
