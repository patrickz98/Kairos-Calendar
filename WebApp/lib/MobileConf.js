MobileConf = {};

MobileConf.mobileViewport = function()
{
    // console.log("viewport: mobileViewport");

    var meta = WebLibSimple.createAnyAppend("meta", document.head);
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=0.5, maximum-scale=1, user-scalable=0";
};

MobileConf.normalViewport = function()
{
    // console.log("viewport: normalViewport");

    var meta = WebLibSimple.createAnyAppend("meta", document.head);
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0";
};

MobileConf.checkMobile = function()
{
    var header = navigator.userAgent;

    // console.log("header: " + JSON.stringify(header));
    // NativeInterface.log("pups");
    // NativeInterface.log("header: " + JSON.stringify(navigator.userAgent));

    MobileConf.isMobile = false;
    MobileConf.device = null;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(header))
    {
        MobileConf.isMobile = true;
        MobileConf.device = "Android";
    }

    if (/iPhone|iPad|iPod/i.test(header))
    {
        MobileConf.device = "IOS";
    }

    //
    // Do not touch!
    //
    if(/iPhone|iPod|Mobile|mobile/i.test(header))
    {
        MobileConf.mobileViewport();
        return;
    }

    MobileConf.normalViewport();
};
