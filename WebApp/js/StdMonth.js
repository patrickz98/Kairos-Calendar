StdMonth = {};

StdMonth.disableSelections = function()
{
    for (var index in StdMonth.days)
    {
        var div = StdMonth.days[ index ];
        StdMonth.changeBorder(div, div.color);
        div.isSelected = false;
    }
};

StdMonth.click = function(elem)
{
    var onclick = function()
    {
        Main.fixInfoDay = true;

        StdMonth.disableSelections();

        elem.isSelected = true;
        StdMonth.changeBorder(elem, GlobalConf.month_mouseOverColor);

        Schedule.update(elem.date);
    };

    elem.select = onclick;

    if (Main.isIOS)
    {
        elem.addEventListener("touchstart", onclick);
    }
    else
    {
        elem.addEventListener("click", onclick);
    }
};

StdMonth.changeBorder = function(elem, color)
{
    elem.style.border = "2px solid " + color;
};

StdMonth.mouseOver = function(elem)
{
    var mouseOver = function()
    {
        // console.log("mouseOver: " + elem.date);
        StdMonth.changeBorder(elem, GlobalConf.month_mouseOverColor);
        if (! Main.fixInfoDay) Schedule.update(elem.date);
    };

    var mouseOut = function()
    {
        if (! elem.isSelected) StdMonth.changeBorder(elem, elem.color);
    };

    elem.addEventListener("mouseover", mouseOver);
    elem.addEventListener("mouseout",  mouseOut);
};

StdMonth.createWeekDayBar = function(parent)
{
    var top    = GlobalConf.month_headlineHeight;
    var height = GlobalConf.month_weekDayHeight;

    var labelBar = WebLibSimple.createDivHeight(0, top, 0, height, null, parent);
    labelBar.style.overflow = "hidden";

    var width = 100 / 7;

    for (var inx = 0; inx < 7; inx++)
    {
        var left = width * inx;

        var div = WebLibSimple.createDivWidth(left + "%", 0, width + "%", 0, null, labelBar);
        div.style.lineHeight = height + "px";
        div.style.fontWeight = "lighter";
        div.style.textAlign  = "center";
        div.style.fontSize   = GlobalConf.month_weekfontSize + "px";
        div.style.color      = GlobalConf.month_weekDayBarColor;
        div.innerHTML        = Time.getWeekShortTranzlation(inx);

        div.style.webkitUserSelect = "none";
    }
};

StdMonth.changeMonth = function(token)
{
    // var token = event.target.token;
    var data  = StdMonth.monthDateJosn[ token ];
    var month = data.month;
    var year  = data.year;

    CalendarMonth.update(month, year);
    DataManager.setMonth(month, year);

    if (Main.showCategory != null)
    {
        var data = Categorys.highlite(Main.showCategory);
        CategorysInfo.changeHeadlineEvents(data.time, data.events);
    }
};

StdMonth.createHeadline = function()
{
    var parent   = StdMonth.topDiv;
    var height   = GlobalConf.month_headlineHeight;
    var fontSize = GlobalConf.month_headlineFontSize;

    var headline = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    headline.style.overflow = "hidden";

    //
    // Week Day Bar
    //

    StdMonth.createWeekDayBar(parent);

    //
    // headline part helper function
    //

    var createHeadlinePart = function(left)
    {
        var div = WebLibSimple.createDivWidth(left, 0, "33%", 0, null, headline);
        div.style.lineHeight       = height   + "px";
        div.style.fontSize         = fontSize + "px";
        div.style.fontWeight       = "lighter";
        div.style.color            = GlobalConf.headlineColor2;
        div.style.textAlign        = "center";
        div.style.cursor           = "pointer";
        div.style.webkitUserSelect = "none";

        // div.onclick = StdMonth.changeMonth;
        div.onclick = function(event)
        {
            var token = event.target.token;
            StdMonth.changeMonth(token);
        };

        return div;
    };

    //
    // month before
    //

    headline.pastMonth = createHeadlinePart("0%");
    StdDesign.dimmerTouch(headline.pastMonth);

    //
    // current month
    //

    var currnetMonth = createHeadlinePart("33%");
    currnetMonth.style.fontSize   = fontSize + 10 + "px";
    currnetMonth.style.fontWeight = "normal";
    currnetMonth.style.color      = GlobalConf.headlineColor;
    currnetMonth.style.cursor     = "default";
    currnetMonth.onclick          = null;

    headline.currnetMonth = currnetMonth;


    //
    // next month
    //

    headline.nextMonth = createHeadlinePart("66%");
    StdDesign.dimmerTouch(headline.nextMonth);

    StdMonth.headline = headline;
};

StdMonth.setHeadlineData = function(div, token)
{
    var data = StdMonth.monthDateJosn[ token ];
    div.innerHTML = Time.getMonthTranzlation(data.month) + " " + data.year;
    div.token = token;
};

StdMonth.updateHeadline = function(today_month, today_year)
{
    if (! StdMonth.headline)
    {
        StdMonth.createHeadline(StdMonth.topDiv);
    }

    var headline = StdMonth.headline;

    var info = Time.monthInfo(today_month, today_year);

    StdMonth.monthDateJosn = {};

    StdMonth.monthDateJosn.before = {
        "month": info.month_before,
        "year": info.year_before
    };

    StdMonth.monthDateJosn.current = {
        "month": info.month,
        "year": info.year
    };

    StdMonth.monthDateJosn.next = {
        "month": info.month_next,
        "year": info.year_next
    };

    StdMonth.setHeadlineData(headline.pastMonth,    "before");
    StdMonth.setHeadlineData(headline.currnetMonth, "current");
    StdMonth.setHeadlineData(headline.nextMonth,    "next");
};

StdMonth.createDayMatrix = function(parent)
{
    var height  = 100 / 6;
    var day_width = 100 / 7;
    var padding = 0;
    var color   = GlobalConf.month_noneMonthColor;

    StdMonth.days = [];

    for (var week = 0; week < 6; week++)
    {
        var top = height * week;
        var container = WebLibSimple.createDivHeight(0, top + "%", 0, height + "%", null, parent);
        container.style.overflow = "hidden"

        for (var inx = 0; inx < 7; inx++)
        {
            var left = day_width * inx;
            var div = WebLibSimple.createDivWidth((left + "%"), 0, (day_width + "%"), 0, null, container);

            var center = WebLibSimple.createAnyAppend("center", div);

            var circleSize = GlobalConf.month_circleSize;
            // var index = week + ":" + inx;
            var index = (week * 7) + inx;

            var day = Cricle.createCircle(index, circleSize, color, center, null);
            day.style.fontSize         = GlobalConf.month_circlefontSize + "px";
            day.style.fontWeight       = "lighter";
            day.style.color            = GlobalConf.month_weekDayColor;
            day.style.cursor           = "pointer";
            day.color                  = GlobalConf.month_noneMonthColor;
            day.style.webkitUserSelect = "none";
            day.isSelected             = false;

            StdMonth.click(day);
            // StdMonth.mouseOver(day);

            StdMonth.days[ index ] = day;
        }
    }
};

StdMonth.getDayDiv = function(index)
{
    return StdMonth.days[ index ];
};

StdMonth.createContent = function(parent)
{
    var top = GlobalConf.month_headlineHeight + GlobalConf.month_weekDayHeight;
    var div = WebLibSimple.createDiv(0, top, 0, 0, null, parent);

    var shape = StdMonth.createDayMatrix(div);
    return div;
};

StdMonth.init = function(parent)
{
    StdMonth.topDiv = StdDesign.createStdDiv(parent);

    StdMonth.createHeadline(StdMonth.topDiv);
    var content = StdMonth.createContent(StdMonth.topDiv);

    StdMonth.topDiv.content = content;

    CalendarMonth.init(new Date());

    return StdMonth.topDiv;
};
