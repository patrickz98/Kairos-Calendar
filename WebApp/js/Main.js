Main = {};

Main.createMenuBar = function(parent)
{
    var menuContainer = WebLibSimple.createDivWidth(0, 0, GlobalConf.menu_width, 0, null, parent);
    menuContainer.style.overflow = "hidden";
    menuContainer.style.backgroundColor = GlobalConf.menu_color;

    Menu.init(menuContainer);
};

Main.createContainer = function(parent)
{
    var paddingDiv = WebLibSimple.createDiv(5, 5, 5, 5, null, parent);
    var content = WebLibSimple.createDiv(0, 0, 0, 0, null, paddingDiv);

    Main.containerMonth = WebLibSimple.createDiv(0, 0, 0, "50%", null, content);
    Main.containerMonth.style.overflow = "hidden";

    Main.containerMonthInfo = WebLibSimple.createDiv(0, "50%", 0, 0, null, content);
    Main.containerMonthInfo.style.overflow = "hidden";
};

Main.portrait = function()
{
    Main.containerMonth.style.bottom = "50%";
    Main.containerMonth.style.right = "0%";

    Main.containerMonthInfo.style.top = "50%";
    Main.containerMonthInfo.style.left = "0%";
};

Main.landscape = function()
{
    Main.containerMonth.style.bottom = "0%";
    Main.containerMonth.style.right = "50%";

    Main.containerMonthInfo.style.top = "0%";
    Main.containerMonthInfo.style.left = "50%";
};

Main.orientation = function()
{
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (w > h)
    {
        Main.position = "landscape";
    }
    else
    {
        Main.position = "portrait";
    }
};

Main.resize = function()
{
    if (Main.scheduleFullSize) return;

    Main.orientation();

    if (Main.position == "landscape")
    {
        Main.landscape();
    }

    if (Main.position == "portrait")
    {
        Main.portrait();
    }
};


Main.conf = function()
{
    var meta = WebLibSimple.createAnyAppend("meta", document.head);
    meta.charset = "utf-8";

    SliderButton.addCSSShit();

    Main.scheduleFullSize = false;
    Main.showCategory = null;
    NativeInterface.back = null;

    WebLibSimple.disableSelection(document.body);

    window.ondragstart = function()
    {
        return false;
    };

    var topDiv = StdDesign.createStdDiv(document.body);
    topDiv.style.fontFamily              = GlobalConf.fontFamily;
    topDiv.style.color                   = "#ffffff";
    topDiv.style.overflow                = "hidden";
    topDiv.style.webkitUserSelect        = "none";
    topDiv.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
    topDiv.style.msTouchAction           = "manipulation";
    topDiv.style.touchAction             = "manipulation";

    // Spin.createSpin();

    Main.toptopDiv = topDiv;

    var menuWidth = GlobalConf.menu_width;

    var mainContentDiv = WebLibSimple.createDiv(menuWidth, 0, 0, 0, null, topDiv);
    Main.mainContentDiv = mainContentDiv;
    // mainContentDiv.style.overflow = "hidden";

    var moverDiv = WebLibSimple.createDivWidth(0, 0, "100%", 0, null, mainContentDiv);
    Main.moverDiv = moverDiv;

    Main.createContainer(moverDiv);
    Main.createMenuBar(topDiv);

    Main.resize();

    window.addEventListener("resize", Main.resize);
};

Main.setHammer = function(parent)
{
    var hammertime = new Hammer(parent);

    var action = function(event)
    {
        if (! event.isFinal) return;

        var deltaX = event.deltaX;

        if (deltaX >  100) StdMonth.changeMonth("before");
        if (deltaX < -100) StdMonth.changeMonth("next");
    };

    hammertime.on("swipe", action);
};

Main.showScheduleDiv = function()
{
    if (Main.scheduleDivVisable) return;

    AnimationManager.dimmerOn(Main.infoDiv);
    AnimationManager.dimmerOff(Main.scheduleDiv);

    Main.scheduleDivVisable = true;
};

Main.showInfoDiv = function()
{
    if (! Main.scheduleDivVisable) return;

    AnimationManager.dimmerOn(Main.scheduleDiv);
    AnimationManager.dimmerOff(Main.infoDiv);

    Main.scheduleDivVisable = false;
};

Main.setup = function()
{
    var monthDiv = StdMonth.init(Main.containerMonth);
    Main.setHammer(monthDiv);

    var infoDiv = CategorysInfo.init(Main.containerMonthInfo);
    Main.infoDiv = infoDiv;

    var scheduleDiv = Schedule.init(new Date(), Main.containerMonthInfo);
    scheduleDiv.style.display = "none";
    scheduleDiv.style.opacity = 0.0;

    Main.scheduleDivVisable = false;

    Main.scheduleDiv = scheduleDiv;

    Menu.init();

    Main.fixInfoDay = false;
};

Main.finishedLoadingIOS = function(data)
{
    // NativeInterface.log("Main.finishedLoadingIOS");
    // NativeInterface.log("header: " + JSON.stringify(navigator.userAgent));

    var jsons = JSON.parse(data);
    var events = [];

    for (var index in jsons)
    {
        var event = jsons[ index ];
        events.push(JSON.parse(event));
    }

    DataManager.parseDatabaseJson(events);

    var today = Time.dayInfo(new Date());
    DataManager.setMonth(today.month, today.year);

    NativeInterface.exeIntent();
};

Main.finishedLoading = function(data)
{
    // Spin.nukeSpin();

    DataManager.parseDatabaseJson(JSON.parse(data));

    var today = Time.dayInfo(new Date());
    DataManager.setMonth(today.month, today.year);

    NativeInterface.exeIntent();
};

Main.finishedLoadingNet = function(data)
{
    console.log(JSON.stringify(data.userInfo));
    ConfigManager.changeDefaultToConfig(JSON.stringify(data.userInfo));

    // Spin.nukeSpin();

    DataManager.parseDatabaseJson(data.events);

    var today = Time.dayInfo(new Date());
    DataManager.setMonth(today.month, today.year);

    NativeInterface.exeIntent();
};

// Main.desktop = function()
// {
//     MobileConf.device = "Desktop";
//     var script = WebLibSimple.createAnyAppend("script", document.head);
//     script.src = "http://localhost/Calendar/testphp/events.php?callback=Main.finishedLoadingNet";
// };

Main.main = function()
{
    MobileConf.checkMobile();

    var done = function()
    {
        StringManager.init();

        Main.conf();
        Main.setup();

        NativeInterface.getEvents();
    };

    ConfigManager.setGlobalConfig(done);

    // if ((MobileConf.device == "Android") || (MobileConf.device == "IOS")) return;
    // Main.desktop();
};
