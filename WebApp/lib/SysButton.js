SysButton = {};

SysButton.mouseOver = function(elem, defaultColor)
{
    var button = elem.button;

    var mouseOver = function()
    {
        var color = GlobalConf.std_button_mouseover_color;

        button.style.border = "1px solid " + color;
        button.style.color  = color;

    };

    var mouseOut = function()
    {
        button.style.border = "1px solid " + defaultColor;
        button.style.color  = defaultColor;
    };

    if (! Main.isMobile)
    {
        elem.addEventListener("mouseover", mouseOver);
        elem.addEventListener("mouseout",  mouseOut);
    }
    else
    {
        elem.addEventListener("touchstart", mouseOver);
        elem.addEventListener("touchend",   mouseOut);
    }
};

SysButton.createButton = function(title, CTitle, size, fontSize, color, paddingLR, parent, eventFunct)
{
    var border   = "1px solid " + color;

    var paddingDiv = WebLibSimple.createAnyAppend("div", parent);
    paddingDiv.style.display      = "inline-block";
    paddingDiv.style.width        = (size + paddingLR * 2) + "px";
    paddingDiv.style.paddingLeft  = paddingLR + "px";
    paddingDiv.style.paddingRight = paddingLR + "px";

    var div = WebLibSimple.createAnyAppend("div", paddingDiv);
    div.style.left         = paddingLR + "px";
    div.style.width        = (size + 2) + "px";
    div.style.top          = "0px";
    div.style.bottom       = "0px";
    div.style.overflow     = "hidden";
    div.style.cursor       = "pointer";
    div.onclick            = eventFunct;

    // WebLibSimple.setBGColor(div, "#c38839");

    var button = Cricle.createBorderCircle(CTitle, size, color, border, div, eventFunct);
    button.style.fontSize = (size * 0.9) + "px";
    button.style.fontWeight = "100";

    var label = WebLibSimple.createAnyAppend("span", div);
    label.style.fontSize   = fontSize + "px";
    label.style.textAlign  = "center";
    label.style.overflow   = "hidden";
    label.style.color      = color;
    label.style.fontWeight = "100";
    label.innerHTML        = title;

    div.button = button;
    div.label  = label;

    SysButton.mouseOver(div, color);
};

SysButton.createShortButton = function(title, size, color, paddingLR, parent, eventFunct)
{
    var border = "1px solid " + color;

    var paddingDiv = WebLibSimple.createAnyAppend("div", parent);
    paddingDiv.style.display      = "inline-block";
    paddingDiv.style.width        = (size + paddingLR * 2) + "px";
    paddingDiv.style.paddingTop   = "2px";
    paddingDiv.style.paddingLeft  = paddingLR + "px";
    paddingDiv.style.paddingRight = paddingLR + "px";

    var button = Cricle.createBorderCircle(title, size, color, border, paddingDiv, eventFunct);
    button.style.fontSize   = (size * 0.5) + "px";
    button.style.fontWeight = "100";
    button.style.left       = paddingLR + "px";
    button.style.cursor     = "pointer";
    button.onclick          = eventFunct;

    button.button = button;

    // SysButton.mouseOver(button, color);
    StdDesign.dimmerTouch(button);

    return button;
};
