Menu = {};

Menu.animation = function(direction)
{
    var size = 0;

    var pups  = 0;
    var pups2 = 0;

    if (direction < 0)
    {
        pups  = 50;
        pups2 = 0.5;
    }

    var run = function()
    {
        size += 10;
        var position = WebLibSimple.circ(size / 100);

        Menu.textMenu.style.left  = -pups + direction * ((-50 * position + 50) * -1) + "%";
        Main.moverDiv.style.left  =  pups + direction * (  50 * position)            + "%";
        Main.moverDiv.style.right =  pups + direction * (  50 * position       * -1) + "%";

        Menu.dimmer.style.opacity = 0.5 * position * direction + pups2;

        // console.log(position);

        if (position < 1)
        {
            setTimeout(run, 15);
        }
        else
        {
            if (direction < 0) WebLibSimple.nuke(Menu.dimmer);
        }
    };

    run();
};

Menu.openAnimation = function()
{
    Menu.back = NativeInterface.back;
    NativeInterface.back = Menu.closeAnimation;

    var mover = Main.moverDiv;

    var dimmer = WebLibSimple.createDiv(0, 0, 0, 0, null, mover);
    dimmer.onclick = Menu.openMenu;

    WebLibSimple.setBGColor(dimmer, "#000000");
    Menu.dimmer = dimmer;

    Menu.animation(1);
    Menu.isOpen = true;
};

Menu.closeAnimation = function()
{
    if (! Menu.isOpen) return;

    Menu.animation(-1);
    Menu.isOpen = false;

    NativeInterface.back = Menu.back;
};

Menu.openMenu = function()
{
    if (Menu.isOpen === undefined)
    {
        Menu.isOpen = false;
    }

    if (! Menu.isOpen)
    {
        Menu.openAnimation();
    }
    else
    {
        Menu.closeAnimation();
    }
};

Menu.createTextMenuEntry = function(index, data)
{
    var menuWidth  = GlobalConf.menu_width;
    var size       = GlobalConf.menu_size;
    var paddingTop = GlobalConf.menu_paddingTop;
    var left       = (menuWidth - size) / 2;

    var top = (size + paddingTop) * index + paddingTop;

    var div = WebLibSimple.createDivHeight(left, top, 0, size, null, Menu.textMenu);
    div.style.lineHeight = size + "px";
    div.style.fontSize = size + "px";
    div.style.textAlign = "left";
    div.innerHTML = data.name;
    div.onclick = data.click;

    StdDesign.dimmerTouch(div);
};

Menu.createTextMenu = function()
{
    var textMenu = WebLibSimple.createDivWidth("-50%", 0, "50%", 0, null, Main.mainContentDiv);
    textMenu.style.backgroundColor = GlobalConf.menu_color;

    // prevent parent event
    textMenu.onclick = function(event)
    {
        event.stopPropagation();
    };

    Menu.textMenu = textMenu;

    for (var index in Menu.entrys)
    {
        var data = Menu.entrys[ index ];
        Menu.createTextMenuEntry(index, data);
    }
};

Menu.createMenuPoint = function(index, data, parent)
{
    var menuWidth  = GlobalConf.menu_width;
    var size       = GlobalConf.menu_size;
    var paddingTop = GlobalConf.menu_paddingTop;
    var left       = (menuWidth - size) / 2;

    var top = (size + paddingTop) * index + paddingTop;

    var img = WebLibSimple.createImgWidHei(left, top, size, size, null, parent);
    img.style.cursor = "pointer";
    img.src = data.icon;
    img.onclick = data.click;

    StdDesign.dimmerTouch(img);
};

Menu.setToday = function()
{
    var today = Time.dayInfo(new Date());

    Menu.closeAnimation();

    DataManager.setMonth(today.month, today.year);
    CalendarMonth.update(today.month, today.year);

    if (Main.scheduleDivVisable) Schedule.update(Time.getEventDayDate(new Date()));

    if (Main.showCategory != null)
    {
        var data = Categorys.highlite(Main.showCategory);
        CategorysInfo.changeHeadlineEvents(data.time, data.events);
    }
};

Menu.selectMonthYear = function()
{
    MonthYearSelect.init();
};

Menu.openSearch = function()
{
    Search.init();
};

Menu.openConf = function()
{
    Config.init();
};

Menu.init = function(parent)
{

    // "OpenMenu": "Menu",
    // "OpenToday": "Today",
    // "OpenSearch": "Search",
    // "OpenScan": "Scan Code",
    // "OpenConfig": "Config",
    // "OpenSelcetMonthYear": "Select Month/Year"

    // StringManager.locale

    Menu.entrys = [
        {
            // "name": StringManager.locale.OpenMenu,
            "name": "",
            "icon": img_menu_w,
            "click": Menu.openMenu
        },
        {
            "name": StringManager.locale.OpenToday,
            "icon": today_w,
            "click": Menu.setToday
        },
        {
            "name": StringManager.locale.OpenSearch,
            "icon": img_search_w,
            "click": Menu.openSearch
        },
        {
            "name": StringManager.locale.OpenScan,
            "icon": img_scan_w,
            "click": NativeInterface.openScan
        },
        {
            "name": StringManager.locale.OpenConfig,
            "icon": img_config_w,
            "click": Menu.openConf
        },
        // {
        //     "name": "Reload",
        //     "icon": img_reload_w,
        //     "click": NativeInterface.reload
        // },
        {
            "name": StringManager.locale.OpenSelcetMonthYear,
            "icon": img_select_w,
            "click": Menu.selectMonthYear
        },
        {
            "name": StringManager.locale.Statistics,
            "icon": statistics_w,
            "click": Statistics.init
        },
        {
            "name": "About",
            "icon": null,
            "click": About.init
        }
    ];

    for (var index in Menu.entrys)
    {
        var data = Menu.entrys[ index ];
        if (data.icon != null) Menu.createMenuPoint(index, data, parent);
    }

    Menu.createTextMenu();
};
