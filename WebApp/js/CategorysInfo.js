CategorysInfo = {};

CategorysInfo.deHighlight = function()
{
    Categorys.deHighlite();
    CategorysInfo.changeHeadlineEvents();

    var categorys = CategorysInfo.categoryEntrys;

    for (var category in categorys)
    {
        var elem = categorys[ category ];

        elem.otherHighlight();
        elem.clicked = false;
    }
};

CategorysInfo.makeNormal = function()
{
    Categorys.deHighlite();
    CategorysInfo.changeHeadlineEvents();

    var categorys = CategorysInfo.categoryEntrys;

    for (var category in categorys)
    {
        var elem = categorys[ category ];

        elem.deHighlight();
        elem.clicked = false;
    }
};

CategorysInfo.touch = function(elem)
{
    var click = function()
    {
        if (elem.clicked)
        {
            CategorysInfo.makeNormal();
        }
        else
        {
            elem.clicked = true;
        }
    };

    var touchStart = function()
    {
        var tmp_clicked = elem.clicked;

        CategorysInfo.deHighlight();
        elem.highlight();

        elem.clicked = tmp_clicked;

        CategorysInfo.touchStart = new Date().getTime();
    };

    var touchEnd = function()
    {
        var duration = (new Date().getTime()) - CategorysInfo.touchStart;
        // console.log("touch duration: " + duration);

        if (duration > 300)
        {
            CategorysInfo.makeNormal();
        }
        else
        {
            click();
        }
    };

    elem.addEventListener("touchstart", touchStart);
    elem.addEventListener("touchend",   touchEnd);
};

CategorysInfo.click = function(elem)
{
    var click = function()
    {
        if (elem.clicked)
        {
            CategorysInfo.makeNormal();
        }
        else
        {
            CategorysInfo.deHighlight();
            elem.highlight();

            elem.clicked = true;
        }
    };

    var mouseOver = function()
    {
        var tmp_clicked = elem.clicked;

        CategorysInfo.deHighlight();
        elem.highlight();

        elem.clicked = tmp_clicked;
    };

    var mouseOut = function()
    {
        if (! elem.clicked) CategorysInfo.makeNormal();
    };

    // elem.addEventListener("mouseover", mouseOver);
    // elem.addEventListener("mouseout",  mouseOut);
    elem.addEventListener("click",     click);
};

CategorysInfo.createCircleBox = function(parent)
{
    var size     = GlobalConf.categorysInfo_mainCircleSize;
    var color    = GlobalConf.categorysInfo_mainCircleColor;
    var fontSize = GlobalConf.categorysInfo_eventFontSize;

    var paddingLeft = GlobalConf.categorysInfo_categoryPadding;

    var c_parent = WebLibSimple.createDiv(0, 0, "50%", 0, null, parent);

    var circle = Cricle.createCircle("0h", size, color, c_parent, null);
    circle.style.fontSize = fontSize;
    circle.style.position = "absolute";
    circle.style.right = (paddingLeft / 2) + "px";

    var div = WebLibSimple.createDiv("50%", 0, 0, 0, null, parent);
    div.style.lineHeight = size + "px";
    div.style.fontSize = fontSize;
    div.style.color = GlobalConf.categorysInfo_headlineColor;

    var span = WebLibSimple.createAnyAppend("span", div);
    span.style.paddingLeft = (paddingLeft / 2) + "px";

    span.innerHTML = StringManager.locale.Events + ": 0";

    CategorysInfo.changeHeadlineEvents = function(cricleTitle, eventsTitle)
    {
        if (cricleTitle == undefined && eventsTitle == undefined)
        {
            cricleTitle = CategorysInfo.combinedTime;
            eventsTitle = CategorysInfo.eventsCount;
        }

        circle.innerHTML = cricleTitle + StringManager.locale.HoursShort;
        span.innerHTML   = StringManager.locale.Events + ": " + eventsTitle;
    };
};

CategorysInfo.createEntry = function(category, index, parent)
{
    // var mainCircleSize = GlobalConf.categorysInfo_mainCircleSize;
    var mainCircleSize = 100;
    var paddingTop = GlobalConf.categorysInfo_categoryPaddingTop;

    var top = (mainCircleSize + paddingTop) * index + paddingTop;
    var div = WebLibSimple.createDivHeight(0, top, 0, mainCircleSize, null, parent);

    var color = CategoryManager.getCategorysColor(category);
    var fontSize = 25;

    div.style.fontSize = fontSize + "px";
    div.style.fontWeight = "100";
    div.style.textAlign = "center";
    div.style.lineHeight = mainCircleSize + "px";
    div.style.color = color;
    div.style.fontSize = GlobalConf.categorysInfo_categoryFontSize;

    var span = WebLibSimple.createAnyAppend("span", div);
    span.innerHTML = category;
    span.style.cursor = "pointer";
    span.clicked = false;

    var highlight = function()
    {
        div.style.color = color;
        var data = Categorys.highlite(category);
        CategorysInfo.changeHeadlineEvents(data.time, data.events);
    };

    var deHighlight = function()
    {
        div.style.color = color;
        Categorys.deHighlite();
    };

    var otherHighlight = function()
    {
        div.style.color = GlobalConf.categorysInfo_categoryNotSelected;
    };

    span.highlight = highlight;
    span.deHighlight = deHighlight;
    span.otherHighlight = otherHighlight;

    span.changeConf = function(size)
    {
        div.style.fontSize = (fontSize + size) + "px"
    };


    if (MobileConf.device == "Desktop")
    {
        CategorysInfo.click(span);
    }
    else
    {
        CategorysInfo.touch(span);
    }

    return span;
};

CategorysInfo.createHeadline = function(parent)
{
    var div = WebLibSimple.createDiv(0, 0, 0, 0, null, parent);
    CategorysInfo.createCircleBox(div);
};

CategorysInfo.createCategorys = function(parent)
{
    var div = WebLibSimple.createDiv(0, 20, 0, 0, null, parent);

    var index = 0;

    CategorysInfo.categoryEntrys = {};

    for (var category in CategoryManager.getCategorys())
    {
        var entry = CategorysInfo.createEntry(category, index, div);

        CategorysInfo.categoryEntrys[ category ] = entry;
        index++;
    }
};

CategorysInfo.update = function()
{
    var entrys = CategorysInfo.categoryEntrys;

    var combinedTime = 0;

    var highest = 0;

    var timeSpans = {};

    for (var category in CategoryManager.getCategorys())
    {
        var results = DataManager.getByCategory(category);
        var timeSpan = Categorys.getHoleTimeSpan(results);

        combinedTime += timeSpan;
        timeSpans[ category ] = timeSpan;

        if (timeSpan > highest) highest = timeSpan;
    }

    for (var entry in entrys)
    {
        var timeSpan = timeSpans[ entry ];

        var start = 30;
        var max = 50;

        var percent = timeSpan / highest;

        if (highest == 0) percent = 0;
        console.log(entry + " " + percent);

        var hours =  Math.round((timeSpan / 1000 / 3600) * 10) / 10;

        CategorysInfo.categoryEntrys[ entry ].changeConf(percent * max + start);
    }

    CategorysInfo.combinedTime = (Math.round((combinedTime / 1000 / 3600) * 10) / 10);
    CategorysInfo.eventsCount = DataManager.monthData.length;

    CategorysInfo.changeHeadlineEvents();
};

CategorysInfo.updateAllCategorys = function()
{
    CategorysInfo.contentDiv.innerHTML = "";

    CategorysInfo.createCategorys(CategorysInfo.contentDiv);
    CategorysInfo.update();
};

CategorysInfo.setup = function(parent)
{
    var size = GlobalConf.categorysInfo_mainCircleSize;
    var headlineDiv = WebLibSimple.createDivHeight(0, 0, 0, size + 10, null, parent);

    CategorysInfo.createHeadline(headlineDiv);

    var contentDiv = WebLibSimple.createDiv(0, size + 10, 0, 0, null, parent);
    contentDiv.style.overflow = "auto";

    CategorysInfo.contentDiv = contentDiv;

    CategorysInfo.createCategorys(contentDiv);
};

CategorysInfo.init = function(parent)
{
    var topDiv = StdDesign.createStdDiv(parent);
    topDiv.style.backgroundColor = null;

    CategorysInfo.setup(topDiv);

    return topDiv;
};
