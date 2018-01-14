ConfigManager = {};

ConfigManager.changeDefaultToConfig = function(config)
{
    if (config == "None")
    {
        ConfigManager.doneCallback();
        return;
    }

    config = JSON.parse(config);

    GlobalConf.defaultCategory = config.defaultCategory;
    GlobalConf.categorys       = config.categorys;
    GlobalConf.language        = config.language;
    GlobalConf.weekStartDay    = parseInt(config.weekStartDay);
    GlobalConf.dateFormat      = config.dateFormat;

    // console.log("config: " + JSON.stringify(config));
    ConfigManager.doneCallback();
};

ConfigManager.setGlobalConfig = function(doneCallback)
{
    ConfigManager.doneCallback = doneCallback;

    GlobalConf.defaultCategory = {
        "name": "Calendar",
        "color": GlobalConf.configManager_stdColor
    };

    GlobalConf.categorys = {};

    GlobalConf.language     = StringManager.getLocale();
    GlobalConf.weekStartDay = GlobalConf.configManager_stdWeekDayStart;
    GlobalConf.dateFormat   = GlobalConf.configManager_stdDateFormart;

    var config = NativeInterface.getConfig("ConfigManager.changeDefaultToConfig");
};

ConfigManager.update = function()
{
    var config = {};

    config.defaultCategory = GlobalConf.defaultCategory;
    config.categorys       = GlobalConf.categorys;
    config.language        = GlobalConf.language;
    config.weekStartDay    = parseInt(GlobalConf.weekStartDay);
    config.dateFormat      = GlobalConf.dateFormat;

    NativeInterface.updateConfig(config);
};
