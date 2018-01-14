ColorPicker = {};

ColorPicker.nuke = function()
{
    WebLibSimple.nuke(ColorPicker.mainDiv);
};

ColorPicker.back = function()
{
    NativeInterface.back = ColorPicker.lastBack;

    if (ColorPicker.selectEvent != null)
    {
        ColorPicker.selectEvent(ColorPicker.color);
    }

    ColorPicker.nuke();
};

ColorPicker.select = function(event)
{
    var target = event.target;

    for (var colorDiv in ColorPicker.colorDivs)
    {
        var div = ColorPicker.colorDivs[ colorDiv ];
        div.disselect();
    }

    target.select();
};

ColorPicker.createColorDiv = function(color, parent)
{
    var size = GlobalConf.colorPicker_size;
    var paddingTop = GlobalConf.colorPicker_paddingTop;
    var border = "2px solid " + color;

    var paddingDiv = WebLibSimple.createAnyAppend("div", parent);
    paddingDiv.style.width      = (size + paddingTop * 2) + "px";
    paddingDiv.style.paddingTop = paddingTop + "px";

    var button = Cricle.createBorderCircle("", size, color, border, paddingDiv, ColorPicker.select);
    button.style.left = paddingTop + "px";
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
        ColorPicker.color = color;
    };

    // AddKind.mouseOver(button);
    WebLibSimple.setBGColor(button, color);

    return button;
};

ColorPicker.createColorPicker = function(preColor)
{
    var center = WebLibSimple.createAnyAppend("center", ColorPicker.topDiv);

    ColorPicker.colorDivs = [];
    var colors = GlobalConf.addKind_colors;

    for (var index in colors)
    {
        var color = colors[ index ];
        var colorDiv = ColorPicker.createColorDiv(color, center);
        ColorPicker.colorDivs.push(colorDiv);

        if (color == preColor) colorDiv.select();
    }
};

ColorPicker.init = function(preColor, selectEvent)
{
    var div = StdDesign.createStd(Config.mainDiv);

    ColorPicker.mainDiv = div;
    ColorPicker.topDiv = div.content;

    div.setHeadline(StringManager.locale.ColorPicker);
    div.createButton("OK", ColorPicker.back);

    ColorPicker.lastBack = NativeInterface.back;
    NativeInterface.back = ColorPicker.back;

    ColorPicker.selectEvent = selectEvent;

    ColorPicker.createColorPicker(preColor);
};
