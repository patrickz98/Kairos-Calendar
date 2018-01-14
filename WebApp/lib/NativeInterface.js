NativeInterface = {};

NativeInterface.getEvents = function()
{
    if (MobileConf.device == "Android") Main.finishedLoading(Android.events());
    if (MobileConf.device == "IOS") webkit.messageHandlers.events.postMessage("nothing");
};

NativeInterface.getConfig = function(callback)
{
    var config = "None";
    if (MobileConf.device == "Android") ConfigManager.changeDefaultToConfig(Android.config());
    if (MobileConf.device == "IOS") webkit.messageHandlers.config.postMessage(callback);
};

NativeInterface.updateConfig = function(config)
{
    // NativeInterface.log("updateConfig");

    var newConfig = JSON.stringify(config);
    if (MobileConf.device == "Android") Android.putConfig(newConfig)
    if (MobileConf.device == "IOS") webkit.messageHandlers.putConfig.postMessage(newConfig);
};

NativeInterface.openMaps = function(place)
{
    // NativeInterface.log("openMaps: " + place);
    if (MobileConf.device == "Android") Android.openMaps(place);
    if (MobileConf.device == "IOS") webkit.messageHandlers.openMaps.postMessage(place);
};

// update json by uuid
NativeInterface.update = function(json)
{
    var id = json.id;
    var json = JSON.stringify(json);

    // NativeInterface.log("update: " + id);

    if (MobileConf.device == "Android") Android.update(id, json);
    if (MobileConf.device == "IOS") webkit.messageHandlers.update.postMessage(json);
};

NativeInterface.delete = function(id)
{
    // NativeInterface.log("delete: " + id);
    if (MobileConf.device == "Android") Android.delete(id);
    if (MobileConf.device == "IOS") webkit.messageHandlers.delete.postMessage(id);
};

NativeInterface.openScan = function()
{
    // NativeInterface.log("open scan");
    if (MobileConf.device == "Android") Android.openScanner();
    if (MobileConf.device == "IOS") webkit.messageHandlers.showToast.postMessage("Open Scanner!");
    if (MobileConf.device == "IOS") webkit.messageHandlers.openScanner.postMessage("nothing");
};

NativeInterface.reload = function()
{
    // NativeInterface.log("reload");
    if (MobileConf.device == "Android") Android.reload();
    if (MobileConf.device == "IOS") webkit.messageHandlers.reload.postMessage("nothing");
};

NativeInterface.qrCallback = function(scanResult)
{
    // console.log("QR-Code: " + scanResult);

    try
    {
        var data = JSON.parse(scanResult);
    }
    catch(e)
    {
        console.log("corrupt qr respons");
        return;
    }

    if (! WebLibSimple.hasKey(data, "Title"))     return;
    if (! WebLibSimple.hasKey(data, "Place"))     return;
    if (! WebLibSimple.hasKey(data, "Kind"))      return;
    if (! WebLibSimple.hasKey(data, "All-Day"))   return;
    if (! WebLibSimple.hasKey(data, "Start"))     return;
    if (! WebLibSimple.hasKey(data, "End"))       return;
    if (! WebLibSimple.hasKey(data, "Priority"))  return;
    if (! WebLibSimple.hasKey(data, "Available")) return;
    if (! WebLibSimple.hasKey(data, "Notes"))     return;

    if (! CategoryManager.exist(data[ "Kind" ]))
    {
        data[ "Kind" ] = GlobalConf.defaultCategory.name;
    }

    AppointmentEditor.init(data);
};

NativeInterface.exeIntent = function()
{
    if (MobileConf.device == "Android") Android.exeIntent();
    if (MobileConf.device == "IOS") webkit.messageHandlers.exeIntent.postMessage("nothing");
};

NativeInterface.intent = function(eventBase64)
{
    var parts = eventBase64.split("?");

    var json = WebLibSimple.base64Decode(parts[ 1 ]);
    NativeInterface.qrCallback(json);
};

NativeInterface.share = function(event)
{
    var url = "kairos://kairos-calendar.com/event/?" + WebLibSimple.base64Encode(JSON.stringify(event));

    var message = event[ "Title" ] +  ":\n\n" + url;

    if (MobileConf.device == "Android") Android.share(message);
    if (MobileConf.device == "IOS") webkit.messageHandlers.share.postMessage(message);
};

NativeInterface.androidBack = function()
{
    if (NativeInterface.back == null) return;
    NativeInterface.back();
};

NativeInterface.androidSuperBack = function()
{
    if (MobileConf.device == "Android") Android.onBackPressed();
};

NativeInterface.log = function(log)
{
    if (MobileConf.device == "Android") Android.showToast(log);
    if (MobileConf.device == "IOS") webkit.messageHandlers.showToast.postMessage(log);
    console.log("NativeInterface.log: " + log);
};
