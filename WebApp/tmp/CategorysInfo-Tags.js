MonthInfo = {};

MonthInfo.highliteElem = function(elem)
{
    var color = elem.color;
    var fontWeight = "bolder";
    var fontSize = "60px";

    elem.resize(fontWeight, fontSize, color);

    var timeSpan = Categorys.highlite(elem.title);
    MonthInfo.updateCircleBox(timeSpan, color);
}

MonthInfo.deHighliteAll = function(celem)
{
    MonthInfo.updateCircleBox(MonthInfo.year, GlobalConf.circleBoxDefaultColor);
    Categorys.deHighlite();

    var color = GlobalConf.headlineColor2;
    var fontWeight = "lighter";
    var fontSize = "30px";

    var cats = MonthInfo.categoryTags;

    for (var index in cats)
    {
        var elem = cats[ index ];

        if (celem.title != elem.title)
        {
            elem.resize(fontWeight, fontSize, color);
            elem.clicked = false;
        }

        // console.log(index);
        // MonthInfo.deHighliteElem(elem);
    }
}

MonthInfo.deHighliteElem = function(elem)
{
    MonthInfo.updateCircleBox(MonthInfo.year, "#ffffff");

    var color = GlobalConf.headlineColor2;
    var fontWeight = "lighter";
    var fontSize = "30px";

    elem.resize(fontWeight, fontSize, color);

    Categorys.deHighlite();
}

MonthInfo.mouse = function(elem)
{
    elem.clicked = false;

    var mouseOver = function()
    {
        if (! MonthInfo.categorySelected) MonthInfo.highliteElem(elem);
    }

    var mouseOut = function()
    {
        if (! MonthInfo.categorySelected) MonthInfo.deHighliteElem(elem);
    }

    var click = function()
    {
        MonthInfo.deHighliteAll(elem);

        if (! elem.clicked)
        {
            MonthInfo.categorySelected = true;
            MonthInfo.highliteElem(elem);
            elem.clicked = true;
        }
        else
        {
            MonthInfo.categorySelected = false;
            MonthInfo.deHighliteElem(elem);
            elem.clicked = false;
        }
    }

    elem.addEventListener("click",     click);
    elem.addEventListener("mouseover", mouseOver);
    elem.addEventListener("mouseout",  mouseOut);
}

MonthInfo.touch = function(elem)
{
    elem.clicked = false;

    var click = function()
    {
        // if (! MonthInfo.categorySelected)
        MonthInfo.deHighliteAll(elem);

        console.log("#1 elem.clicked: " + elem.clicked);

        if (! elem.clicked)
        {
            MonthInfo.categorySelected = true;
            MonthInfo.highliteElem(elem);
            elem.clicked = true;
        }
        else
        {
            MonthInfo.categorySelected = false;
            MonthInfo.deHighliteElem(elem);
            elem.clicked = false;
        }

        console.log("#2 elem.clicked: " + elem.clicked);
    }

    var touchStart = function()
    {
        MonthInfo.deHighliteAll(elem);
        MonthInfo.highliteElem(elem);

        MonthInfo.touchStart = new Date().getTime();
    }

    var touchEnd = function()
    {
        var duration = (new Date().getTime()) - MonthInfo.touchStart;
        console.log("touch duration: " + duration);

        if (duration > 300)
        {
            MonthInfo.deHighliteElem(elem);
        }
        else
        {
            click();
        }
    }

    elem.addEventListener("touchstart", touchStart);
    elem.addEventListener("touchend",   touchEnd);
}

MonthInfo.createCircleBox = function()
{
    var border = GlobalConf.circleBoxBorder;
    var size   = GlobalConf.circleBoxSize;
    var color  = GlobalConf.circleBoxDefaultColor;

    var div = Cricle.createCircle("", size, color, MonthInfo.parent, null);
    div.style.fontSize = GlobalConf.circleBoxFontSize;

    MonthInfo.circleBox = div;
}

MonthInfo.updateCircleBox = function(title, color)
{
    if (! MonthInfo.circleBox)
    {
        MonthInfo.createCircleBox();
    }

    var circleBox = MonthInfo.circleBox;
    circleBox.innerHTML = title;
    // circleBox.style.backgroundColor = color;
    // circleBox.style.color = "#ffffff";
    circleBox.style.color = color;
}

MonthInfo.createCalendarCategory = function(title, color, parent)
{
    var div = WebLibSimple.createAnyAppend("div", parent);
    // div.style.paddingTop = "20px";
    // div.style.backgroundColor = "#36966e";

    var span = WebLibSimple.createAnyAppend("div", div);
    span.style.color        = color;
    span.style.fontSize     = "30px";
    span.innerHTML          = title;
    span.title              = title;
    span.style.fontWeight   = "lighter";
    span.color              = color;
    span.style.display      = "inline-block";
    span.style.textAlign    = "center";
    span.style.paddingTop   = "20px";
    span.style.cursor       = "pointer";

    var resize = function(fontWeight, fontSize, color)
    {
        span.style.fontWeight = fontWeight;
        span.style.fontSize = fontSize;
    }

    span.resize = resize;

    if (Main.isMobile)
    {
        MonthInfo.touch(span);
    }
    else
    {
        MonthInfo.mouse(span);
    }

    return span;
}

MonthInfo.updateCategoryBox = function()
{
    var events = GlobalConf.categorys;
    var box    = MonthInfo.categoryBox;
    var parent = MonthInfo.parent;

    if (! box)
    {
        box = WebLibSimple.createDiv(0, GlobalConf.circleBoxSize, 0, 0, null, parent);
        box.style.overflow = "auto";
        MonthInfo.categoryBox = box;
    }

    box.innerHTML = "";

    MonthInfo.categoryTags = {};

    for (var category in events)
    {
        var title = category;
        var color = events[ title ];
        var cat = MonthInfo.createCalendarCategory(title, color, box);

        MonthInfo.categoryTags[ category ] = cat;
    }

    // MonthInfo.touch(box);
}

MonthInfo.updateYear = function(year)
{
    MonthInfo.year = year;
    MonthInfo.updateCircleBox(MonthInfo.year, "#ffffff");
}

MonthInfo.init = function(parent)
{
    var topDiv = StdDesign.createStdDiv(parent);

    var center = WebLibSimple.createAnyAppend("center", topDiv);

    MonthInfo.parent = center;

    var today = Time.dayInfo(new Date());

    MonthInfo.updateYear(today.year);
    MonthInfo.updateCategoryBox();

    return topDiv;
}
