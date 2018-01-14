CategorysInfo = {};

CategorysInfo.highliteElem = function(elem)
{
    var timeSpan = Categorys.highlite(elem.title);
    var color = GlobalConf.categorys[ elem.title ];

    // CategorysInfo.updateCircleBox(timeSpan+"h", color);

    elem.highlite();
}

CategorysInfo.deHighliteAll = function(celem)
{
    // CategorysInfo.updateCircleBox(CategorysInfo.totalTime, "#ffffff");
    Categorys.deHighlite();

    var categorys = CategorysInfo.categoryEntrys;

    for (var category in categorys)
    {
        var elem = categorys[ category ];

        if (celem.title != category)
        {
            elem.deHighlite();
            elem.clicked = false;
        }
        else
        {
            CategorysInfo.highliteElem(elem);
        }
    }
}

CategorysInfo.deHighliteElem = function(elem)
{
    // CategorysInfo.updateCircleBox(CategorysInfo.totalTime, "#ffffff");
    elem.deHighlite();
    Categorys.deHighlite();
}

CategorysInfo.mouse = function(elem)
{
    elem.clicked = false;

    var mouseOver = function()
    {
        if (! CategorysInfo.categorySelected) CategorysInfo.highliteElem(elem);
    }

    var mouseOut = function()
    {
        if (! CategorysInfo.categorySelected) CategorysInfo.deHighliteElem(elem);
    }

    var click = function()
    {
        CategorysInfo.deHighliteAll(elem);

        if (! elem.clicked)
        {
            CategorysInfo.categorySelected = true;
            CategorysInfo.highliteElem(elem);
            elem.clicked = true;
        }
        else
        {
            CategorysInfo.categorySelected = false;
            // CategorysInfo.deHighliteElem(elem);
            CategorysInfo.deHighliteAll(elem);
            elem.clicked = false;
        }
    }

    elem.addEventListener("click",     click);
    elem.addEventListener("mouseover", mouseOver);
    elem.addEventListener("mouseout",  mouseOut);
}

CategorysInfo.touch = function(elem)
{
    elem.clicked = false;

    var click = function()
    {
        // if (! CategorysInfo.categorySelected)
        CategorysInfo.deHighliteAll(elem);

        console.log("#1 elem.clicked: " + elem.clicked);

        if (! elem.clicked)
        {
            CategorysInfo.categorySelected = true;
            CategorysInfo.highliteElem(elem);
            elem.clicked = true;
        }
        else
        {
            CategorysInfo.categorySelected = false;
            CategorysInfo.deHighliteElem(elem);
            elem.clicked = false;
        }

        console.log("#2 elem.clicked: " + elem.clicked);
    }

    var touchStart = function()
    {
        CategorysInfo.deHighliteAll(elem);
        CategorysInfo.highliteElem(elem);

        CategorysInfo.touchStart = new Date().getTime();
    }

    var touchEnd = function()
    {
        var duration = (new Date().getTime()) - CategorysInfo.touchStart;
        console.log("touch duration: " + duration);

        if (duration > 300)
        {
            CategorysInfo.deHighliteElem(elem);
        }
        else
        {
            click();
        }
    }

    elem.addEventListener("touchstart", touchStart);
    elem.addEventListener("touchend",   touchEnd);
}

CategorysInfo.updateCategoryBox = function()
{
    CategorysInfo.newBox();
    CategorysInfo.updateCircleBox("2016", "#ffffff");

    var events = GlobalConf.categorys;

    CategorysInfo.categoryTags = {};

    var timeMap = {};

    var holeTime = 0;

    for (var category in events)
    {
        var results = DataManager.getByCategory(category);
        var timeSpan = Categorys.getHoleTimeSpan(results);

        holeTime += timeSpan;
        timeMap[ category ] = timeSpan;
    }

    CategorysInfo.totalTime = Math.round((holeTime / 1000 / 3600) * 10) / 10 + "h";
    CategorysInfo.updateCircleBox(CategorysInfo.totalTime, "#ffffff");

    var lastCoordinates = {"x":200,"y":0,"size":150};

    var index = 0;
    for (var category in events)
    {
        var time = timeMap[ category ];

        var size = Math.round(time / holeTime * 100) + 50;

        if (holeTime == 0) size = 50;

        console.log(time + " / " + holeTime + " = " + size);

        var color = events[ category ];

        var bubble = CategorysInfo.createBubble(lastCoordinates, category, color, size, index);
        lastCoordinates = bubble.coordinates;

        CategorysInfo.categoryTags[ category ] = bubble;
        index++;
    }
}

CategorysInfo.createCircleBox = function(parent)
{
    var size     = GlobalConf.categorysInfo_mainCircleSize;
    var color    = GlobalConf.categorysInfo_mainCircleColor;
    var fontSize = GlobalConf.categorysInfo_eventFontSize;

    var div = Cricle.createCircle("0h", size, color, parent, null);
    div.style.fontSize = fontSize;
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top  = "0px";

    var paddingLeft = GlobalConf.categorysInfo_categoryPadding;
    var div = WebLibSimple.createDiv(size + paddingLeft, 0, 0, 0, null, parent);
    div.style.lineHeight = size + "px";
    div.style.fontSize = fontSize;
    // div.style.textAlign = "center";
    div.style.color = "#7C25F8";
    div.style.textAlign = "center";

    div.innerHTML = "0 Events";
}

CategorysInfo.createEntry = function(category, index, parent)
{
    // var mainCircleSize = GlobalConf.categorysInfo_mainCircleSize;
    var mainCircleSize = 100;
    var paddingTop = GlobalConf.categorysInfo_categoryPaddingTop;
    // var paddingTop = 0;

    var top = (mainCircleSize + paddingTop) * index + paddingTop;
    var div = WebLibSimple.createDivHeight(0, top, 0, mainCircleSize, null, parent);

    var left = mainCircleSize + 50 + GlobalConf.categorysInfo_categoryPadding;
    var textDiv = WebLibSimple.createDiv(left, 0, 0, 0, null, div);
    // textDiv.style.fontSize = GlobalConf.categorysInfo_categoryFontSize;
    textDiv.style.fontSize = "25px";
    textDiv.style.fontWeight = "100";
    // textDiv.style.color = "#b4b4b4";
    // textDiv.style.backgroundColor = "#b4b4b4";
    textDiv.style.textAlign = "center";
    textDiv.style.lineHeight = mainCircleSize + "px";
    textDiv.title = category;
    textDiv.innerHTML = category;
    textDiv.style.cursor = "pointer";

    // var textSpan = WebLibSimple.createAnyAppend("span", textDiv);
    // textSpan.innerHTML = category;
    // textSpan.style.cursor = "pointer";
    // textSpan.title = category;

    var tmpDiv = WebLibSimple.createDivWidth(0, 0, mainCircleSize + 50, 0, null, div);
    var center = WebLibSimple.createAnyAppend("center", tmpDiv);

    var defaultSize = GlobalConf.categorysInfo_categoryDefaultCircleSize;
    var color = GlobalConf.categorys[ category ];
    // WebLibSimple.setBGColor(div, color);
    // WebLibSimple.setBGColor(textDiv, color);

    var paddingDiv = WebLibSimple.createAnyAppend("div", center);
    paddingDiv.style.height = ((mainCircleSize - defaultSize) / 2) + "px";
    // paddingDiv.style.backgroundColor = "#30bb41";

    var circleDiv = Cricle.createLabelCircle("0h", defaultSize, color, center, null);
    circleDiv.style.border = "3px solid " + color;
    circleDiv.style.cursor = "pointer";
    circleDiv.style.color  = color;
    circleDiv.title        = category;

    var highlite = function()
    {
        circleDiv.style.color = "#ffffff";
        circleDiv.style.backgroundColor = null;
    }

    var deHighlite = function()
    {
        circleDiv.style.color  = color;
        circleDiv.style.backgroundColor = color;
    }

    // textSpan.highlite = highlite;
    // textSpan.deHighlite = deHighlite;
    textDiv.highlite = highlite;
    textDiv.deHighlite = deHighlite;

    circleDiv.highlite = highlite;
    circleDiv.deHighlite = deHighlite;

    circleDiv.changeConf = function(title, size)
    {
        paddingDiv.style.height = ((mainCircleSize - size) / 2) + "px";

        circleDiv.innerHTML = title;

        Cricle.changeSize(circleDiv, size);
    }

    if (Main.isMobile)
    {
        CategorysInfo.touch(textDiv);
        CategorysInfo.touch(circleDiv);
    }
    else
    {
        CategorysInfo.mouse(textDiv);
        CategorysInfo.mouse(circleDiv);
    }

    return circleDiv;
}

CategorysInfo.updateHeadline = function(hours, events)
{

    var circleBox = CategorysInfo.circleBox;
    circleBox.innerHTML = title;
    circleBox.style.color = color;
}

CategorysInfo.createHeadline = function(parent)
{
    var size = GlobalConf.categorysInfo_mainCircleSize;
    var div = WebLibSimple.createDivHeight(100, 0, 100, size, null, parent);

    CategorysInfo.createCircleBox(div);
}

CategorysInfo.createCategorys = function(parent)
{
    var mainCircleSize = GlobalConf.categorysInfo_mainCircleSize;
    var div = WebLibSimple.createDiv(100, mainCircleSize + 20, 100, 0, null, parent);
    // div.style.backgroundColor = "#88e0a1";

    var categorys = GlobalConf.categorys;
    var index = 0;

    CategorysInfo.categoryEntrys = {};

    for (var category in categorys)
    {
        var entry = CategorysInfo.createEntry(category, index, div);

        CategorysInfo.categoryEntrys[ category ] = entry;
        index++;
    }
}

CategorysInfo.update = function(year)
{
    var entrys = CategorysInfo.categoryEntrys;

    var combinedTime = 0;

    var highest = 0;

    var timeSpans = {};

    for (var category in GlobalConf.categorys)
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
        var pasadsf = 70;

        var percent = timeSpan / highest;

        if (highest == 0) percent = 0;
        console.log(entry + " " + percent);

        var hours =  Math.round((timeSpan / 1000 / 3600) * 10) / 10;

        CategorysInfo.categoryEntrys[ entry ].changeConf(hours + "h", percent * pasadsf + start);
    }

    console.log("combinedTime: " + Math.round((combinedTime / 1000 / 3600) * 10) / 10 + "h");
    console.log("highest: " + highest);
}

CategorysInfo.init = function(parent)
{
    var topDiv = StdDesign.createStdDiv(parent);
    topDiv.style.overflow = "auto";

    CategorysInfo.createHeadline(topDiv);
    CategorysInfo.createCategorys(topDiv);

    return topDiv;
}

// categorysInfo_eventFontSize: "40px",
// categorysInfo_eventColor: "#7C25F8",
//
// categorysInfo_categoryPadding: 40,
//
// categorysInfo_mainCircleSize: 150,
// categorysInfo_mainCircleColor: "#3D3D3D",
//
// categorysInfo_categoryFontSize: "40px",
// categorysInfo_categoryColor: "#ffffff",
//
// categorysInfo_categoryDefaultCircleSize: 50,
// categorysInfo_categoryPaddingTop: 30,
