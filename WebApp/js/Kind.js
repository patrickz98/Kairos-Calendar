Kind = {};

Kind.nuke = function()
{
    NativeInterface.back = Kind.lastBack;
    WebLibSimple.nuke(Kind.topDiv);
};

Kind.add = function(category, color)
{
    CategorysInfo.updateAllCategorys();
    Kind.addCategory(category);
};

Kind.openNewKind = function()
{
    AddKind.init(Kind.topDiv, Kind.add);
};

Kind.setBorder = function(elem, color)
{
    elem.style.border = "2px solid " + color;
};

Kind.mouseOver = function(elem)
{
    var baseBorder = GlobalConf.baseBorder;

    var mouseOver = function()
    {
        Kind.setBorder(elem, elem.borderColor);
    };

    var mouseOut = function()
    {
        if (! elem.selected) Kind.setBorder(elem, elem.stdColor);
    };

    if (! Main.isMobile)
    {
        elem.addEventListener("mouseover", mouseOver);
        elem.addEventListener("mouseout",  mouseOut);
    }
    else
    {
        elem.addEventListener("touchstart", mouseOver);
        // elem.addEventListener("touchend", mouseOut);
    }
};

Kind.select = function(category)
{
    var elem = Kind.contentFields[ category ];
    Kind.setBorder(elem, elem.borderColor);

    for (var cat in Kind.contentFields)
    {
        var cat = Kind.contentFields[ cat ];
        cat.selected = false;

        Kind.setBorder(cat, elem.stdColor);
    }

    elem.selected = true;
    Kind.setBorder(elem, elem.borderColor);

    AppointmentEditor.update("Kind", elem.kind);
};

Kind.clicked = function(event)
{
    var elem = event.target;
    Kind.select(elem.kind);
};

Kind.createCategory = function(title)
{
    var parent = Kind.topDiv.content;

    if (Kind.indexCount == null) Kind.indexCount = 0;

    var index = Kind.indexCount;

    var paddingTop = GlobalConf.kind_paddingTop;
    var paddingLR = GlobalConf.kind_paddingLR;
    var height = GlobalConf.kind_height;

    divHeight = height + (paddingTop * 2)

    var top = divHeight * index;
    var div = WebLibSimple.createDivHeight(0, top, 0, divHeight, null, parent);

    var stdColor = "#3D3D3D";

    var content = WebLibSimple.createDiv(
        paddingLR,
        paddingTop,
        paddingLR,
        paddingTop,
        null,
        div);

    content.style.textAlign    = "center";
    content.style.lineHeight   = height + "px";
    content.style.fontSize     = (height - 20) +"px";
    content.style.cursor       = "pointer";
    content.style.borderRadius = "5000px";
    content.style.color        = GlobalConf.edit_fontColor;
    content.innerHTML          = title;
    content.onclick            = Kind.clicked;
    content.selected           = false;
    content.kind               = title;

    content.borderColor = CategoryManager.getCategorysColor(title);
    content.stdColor = stdColor;

    Kind.setBorder(content, stdColor);
    Kind.mouseOver(content);

    Kind.indexCount++;

    return content;
};

Kind.createContent = function(parent)
{
    for (var kind in CategoryManager.getCategorys())
    {
        Kind.addCategory(kind);
    }
};

Kind.addCategory = function(kind)
{
    var cat = Kind.createCategory(kind);
    Kind.contentFields[ kind ] = cat;
};

Kind.createButtons = function(parent)
{
    Kind.lastBack = NativeInterface.back;
    NativeInterface.back = Kind.nuke;

    parent.createButton("+", Kind.openNewKind);
    parent.createButton("Ok", Kind.nuke);
};

Kind.init = function(preSelected, parent)
{
    // console.log("Kind.init: " + preSelected);
    Kind.contentFields = {};
    Kind.indexCount = null;

    var div = StdDesign.createStd(parent);
    Kind.topDiv = div;

    div.setHeadline(StringManager.locale.Kind);
    Kind.createContent();
    Kind.createButtons(div);

    Kind.select(preSelected);
};
