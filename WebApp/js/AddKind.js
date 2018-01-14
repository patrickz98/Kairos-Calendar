AddKind = {};

AddKind.nuke = function()
{
    NativeInterface.back = AddKind.lastBack;

    WebLibSimple.nuke(AddKind.topDiv);
};

AddKind.addNew = function()
{
    var value = AddKind.input.value;
    var color = AddKind.color;

    if ((value == "") || (value == null)) return;

    if (WebLibSimple.hasKey(CategoryManager.getCategorys(), value))
    {
        AddKind.nuke();
        return;
    }

    CategoryManager.add(value, color);

    AddKind.callback(value, color);
    AddKind.nuke();
};

AddKind.select = function(event)
{
    var target = event.target;

    for (var colorDiv in AddKind.colorDivs)
    {
        var div = AddKind.colorDivs[ colorDiv ];
        div.disselect();
    }

    target.select();
};

AddKind.mouseOver = function(elem)
{
    var mouseOver = function()
    {
        elem.style.border = "2px solid #ffffff";
    };

    var mouseOut = function()
    {
        if (! elem.selected)
        {
            elem.style.border = "2px solid " + elem.color;
        }
    };

    elem.addEventListener("mouseover", mouseOver);
    elem.addEventListener("mouseout",  mouseOut);
};

AddKind.createColorDiv = function(color, parent)
{
    var size = GlobalConf.addKind_boxSize;
    var paddingLR = GlobalConf.addKind_boxPadding;
    var border = "2px solid " + color;

    var paddingDiv = WebLibSimple.createAnyAppend("div", parent);
    paddingDiv.style.display      = "inline-block";
    paddingDiv.style.width        = (size + paddingLR * 2) + "px";
    paddingDiv.style.height       = (size + paddingLR * 2) + "px";
    paddingDiv.style.paddingLeft  = paddingLR + "px";
    paddingDiv.style.paddingRight = paddingLR + "px";
    // paddingDiv.style.backgroundColor = "#57d4b4";

    var button = Cricle.createBorderCircle("", size, color, border, paddingDiv, AddKind.select);
    button.style.left = paddingLR + "px";
    button.color      = color;
    button.selected   = false;

    button.disselect = function()
    {
        button.selected = true;
        button.style.border = "2px solid " + color;
    };

    button.select = function()
    {
        button.selected = false;
        button.style.border = "2px solid #ffffff";
        AddKind.color = color;
    };

    // AddKind.mouseOver(button);
    WebLibSimple.setBGColor(button, color);

    return button;
};

AddKind.createColorPicker = function(parent)
{
    // var top = 100 + 50;
    // var height = 100;
    //
    // var div = WebLibSimple.createDiv(0, top, 0, 0, null, parent);
    // div.style.backgroundColor = "#2de2f2";
    var center = WebLibSimple.createAnyAppend("center", parent);

    AddKind.colorDivs = [];
    var colors = GlobalConf.addKind_colors;

    for (var index in colors)
    {
        var color = colors[ index ];
        var colorDiv = AddKind.createColorDiv(color, center);
        AddKind.colorDivs.push(colorDiv);
    }

    AddKind.colorDivs[ 0 ].select();
};

AddKind.createInput = function(parent)
{
    var border = GlobalConf.addKind_paddingTop;
    var paddingLR = GlobalConf.addKind_paddingLR;
    var height = GlobalConf.addKind_inputHeight;

    var borderDiv = WebLibSimple.createDivHeight(
        paddingLR,
        border,
        paddingLR,
        height + 50,
        null,
        parent);

    borderDiv.style.overflow = "hidden";

    var colorPickerDiv = WebLibSimple.createDiv(paddingLR,
        height + 40,
        paddingLR,
        0,
        null,
        parent);

    colorPickerDiv.style.overflow = "auto";

    var div = StdDesign.createInput(
        height,
        StringManager.locale.newKind,
        borderDiv);

    AddKind.input = div.input;

    AddKind.createColorPicker(colorPickerDiv);
};

AddKind.createButtons = function(parent)
{
    AddKind.lastBack = NativeInterface.back;
    NativeInterface.back = AddKind.nuke;

    parent.createButton("X",  AddKind.nuke);
    parent.createButton("Ok", AddKind.addNew);
};

AddKind.init = function(parent, callback)
{
    var div = StdDesign.createStd(parent);

    AddKind.callback = callback;

    div.setHeadline(StringManager.locale.AddKind);
    AddKind.createInput(div.content);
    AddKind.createButtons(div);

    AddKind.topDiv = div;
};
