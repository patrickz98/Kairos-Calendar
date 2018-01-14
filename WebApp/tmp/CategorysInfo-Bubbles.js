MonthInfo = {};

MonthInfo.highliteElem = function(elem)
{
    var timeSpan = Categorys.highlite(elem.title);
    var color = GlobalConf.categorys[ elem.title ];

    MonthInfo.updateCircleBox(timeSpan+"h", color);

    elem.highlite();
}

MonthInfo.deHighliteAll = function(celem)
{
    MonthInfo.updateCircleBox(MonthInfo.totalTime, "#ffffff");
    Categorys.deHighlite();

    var cats = MonthInfo.categoryTags;

    for (var index in cats)
    {
        var elem = cats[ index ];

        if (celem.title != elem.title)
        {
            elem.deHighlite();
            elem.clicked = false;
        }
    }
}

MonthInfo.deHighliteElem = function(elem)
{
    MonthInfo.updateCircleBox(MonthInfo.totalTime, "#ffffff");
    elem.deHighlite();
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
    var size  = GlobalConf.circleBoxSize;
    var color = GlobalConf.circleBoxDefaultColor;

    var div = Cricle.createCircle("", size, color, MonthInfo.categoryBox, null);
    div.style.fontSize = GlobalConf.circleBoxFontSize;
    div.style.position = "absolute";
    div.style.left = "200px";
    div.style.top  = "0px";

    MonthInfo.circleBox = div;

    var div = WebLibSimple.createDivHeight(size + 200 + 30, 0, 0, size, null, MonthInfo.categoryBox);
    // div.style.backgroundColor = "#82ad0d";
    div.style.lineHeight = size + "px";
    div.style.fontSize = "65px";
    // div.style.textAlign = "center";
    div.style.color = "#7C25F8";

    div.innerHTML = "2016";
}

MonthInfo.updateCircleBox = function(title, color)
{
    if (! MonthInfo.circleBox)
    {
        MonthInfo.createCircleBox();
    }

    var circleBox = MonthInfo.circleBox;
    circleBox.innerHTML = title;
    circleBox.style.color = color;
}

MonthInfo.createBubble = function(lastCoordinates, title, color, size, index)
{
    // var parent = MonthInfo.topDiv;
    var parent = MonthInfo.categoryBox;
    // var color  = GlobalConf.circleBoxDefaultColor;

    var div = Cricle.createCircle(title, size, color, parent, null);
    div.style.border   = "3px solid " + color;
    div.style.fontSize = "15px";
    div.style.position = "absolute";
    div.style.cursor   = "pointer";
    div.title          = title;

    div.highlite = function()
    {
        div.style.backgroundColor = null;
    }

    div.deHighlite = function()
    {
        div.style.backgroundColor = color;
    }

    var lastSize = lastCoordinates.size;
    var posi = (Math.sqrt((lastSize * lastSize) + (lastSize * lastSize)) - lastSize) / 2 - 10;

    var x = 0;
    var y = 0;

    var lastX = lastCoordinates.x;
    var lastY = lastCoordinates.y;

    if (parseInt(index) % 2 == 0)
    {
        x = lastX + lastSize - posi;
        y = lastY + lastSize - posi;

    }
    else
    {
        x = lastX - size + posi;
        y = lastY + lastSize - posi;
    }

    div.style.left = x + "px";
    div.style.top  = y + "px";

    var coordinates = {"x":x,"y":y,"size":size};
    div.coordinates = coordinates;

    if (Main.isMobile)
    {
        MonthInfo.touch(div);
    }
    else
    {
        MonthInfo.mouse(div);
    }

    return div;
}

MonthInfo.newBox = function()
{
    var box    = MonthInfo.categoryBox;
    var parent = MonthInfo.topDiv;

    if (! box)
    {
        box = WebLibSimple.createDiv(0, 0, 0, 0, null, parent);
        box.style.overflow = "auto";
        MonthInfo.categoryBox = box;
    }

    box.innerHTML = "";

    if (MonthInfo.circleBox !== undefined)
    {
        MonthInfo.circleBox.innerHTML = "";
        MonthInfo.circleBox = null;
    }
}

MonthInfo.updateCategoryBox = function()
{
    MonthInfo.newBox();
    MonthInfo.updateCircleBox("2016", "#ffffff");

    var events = GlobalConf.categorys;

    MonthInfo.categoryTags = {};

    var timeMap = {};

    var holeTime = 0;

    for (var category in events)
    {
        var results = DataManager.getByCategory(category);
        var timeSpan = Categorys.getHoleTimeSpan(results);

        holeTime += timeSpan;
        timeMap[ category ] = timeSpan;
    }

    MonthInfo.totalTime = Math.round((holeTime / 1000 / 3600) * 10) / 10 + "h";
    MonthInfo.updateCircleBox(MonthInfo.totalTime, "#ffffff");

    var lastCoordinates = {"x":200,"y":0,"size":150};

    var index = 0;
    for (var category in events)
    {
        var time = timeMap[ category ];

        var size = Math.round(time / holeTime * 100) + 50;

        if (holeTime == 0) size = 50;

        console.log(time + " / " + holeTime + " = " + size);

        var color = events[ category ];

        var bubble = MonthInfo.createBubble(lastCoordinates, category, color, size, index);
        lastCoordinates = bubble.coordinates;

        MonthInfo.categoryTags[ category ] = bubble;
        index++;
    }
}

MonthInfo.update = function(year)
{
    MonthInfo.updateCategoryBox();
}

MonthInfo.init = function(parent)
{
    var topDiv = StdDesign.createStdDiv(parent);

    MonthInfo.topDiv = topDiv;

    return topDiv;
}
