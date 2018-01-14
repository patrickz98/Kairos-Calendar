StdDesign = {};

StdDesign.createInput = function(height, placeholder, parent)
{
    var inputDiv = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    inputDiv.style.borderRadius = "1000px";
    inputDiv.style.border       = GlobalConf.std_input_border;
    inputDiv.style.overflow     = "hidden";

    var input = WebLibSimple.createAnyAppend("input", inputDiv);
    input.placeholder           = placeholder;
    input.style.fontSize        = (height / 2) + "px";
    input.style.color           = GlobalConf.std_input_color;
    input.style.textAlign       = "center";
    input.style.lineHeight      = height + "px";
    input.style.fontFamily      = GlobalConf.fontFamily;
    input.style.fontWeight      = "100";
    input.style.backgroundColor = "transparent";
    input.style.border          = "0px solid #000000";
    input.style.width           = "100%";
    input.style.height          = "100%";
    input.style.outline         = 0;
    input.style.overflow        = "hidden";

    // input.style.position        = "relative";

    inputDiv.input = input

    return inputDiv;
};

StdDesign.stdNuke = function(elem)
{
    elem.nuke = function()
    {
        WebLibSimple.nuke(elem);
    };
};

StdDesign.createStdDiv = function(parent)
{
    var div = WebLibSimple.createDiv(0, 0, 0, 0, null, parent);
    WebLibSimple.setBGColor(div, GlobalConf.bodyColor);

    return div;
};

StdDesign.createHeadline = function(title, height, fontSize, parent)
{
    var div = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    div.style.color      = GlobalConf.headlineColor;
    div.style.textAlign  = "center";
    div.style.lineHeight = height + "px";
    div.style.fontSize   = fontSize + "px";
    div.innerHTML = title;

    parent.setHeadline = function(title)
    {
        div.innerHTML = title;
    };

    return div;
};

StdDesign.createStdContent = function(top, bottom, parent)
{
    var div = WebLibSimple.createDiv(0, top, 0, bottom, null, parent);
    div.style.overflow = "auto";

    WebLibSimple.setBGColor(div, GlobalConf.bodyColor);

    return div;
};

StdDesign.createStdButtonBar = function(height, parent)
{
    var div = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    div.style.top = null;
    div.style.bottom = "0px";
    div.style.overflow = "hidden";

    WebLibSimple.setBGColor(div, GlobalConf.bodyColor);

    var center = WebLibSimple.createAnyAppend("center", div);

    div.content = center;

    var size = GlobalConf.std_button_size;
    var color = GlobalConf.std_button_color;
    var paddingLR = 10;

    div.createButton = function(title, event)
    {
        return SysButton.createShortButton(title, size, color, paddingLR, center, event);
    };

    parent.createButton = div.createButton;

    return div;
};


StdDesign.createStd = function(parent)
{
    var div = StdDesign.createStdDiv(parent);

    StdDesign.stdNuke(div);

    var title = "+++++";

    var headline_std_height   = GlobalConf.std_headline_height;
    var headline_std_fontSize = GlobalConf.std_headline_fontSize;
    var buttonBar_std_height  = GlobalConf.std_buttonBar_height;

    var headline  = StdDesign.createHeadline(title, headline_std_height, headline_std_fontSize, div);
    var content   = StdDesign.createStdContent(headline_std_height, buttonBar_std_height, div);
    var buttonBar = StdDesign.createStdButtonBar(buttonBar_std_height, div);

    div.headline  = headline;
    div.content   = content;
    div.buttonBar = buttonBar;

    return div;
};

StdDesign.createDimmerDiv = function()
{
    var div = WebLibSimple.createDiv(0, 0, 0, 0, null, document.body);
    div.style.zIndex = "100";
    div.style.fontFamily = GlobalConf.fontFamily;

    WebLibSimple.setBGColor(div, "#96000000");

    return div;
};

StdDesign.dimmerTouch = function(elem)
{
    var touchstart = function()
    {
        elem.style.opacity = 0.5;
    };

    var touchend = function()
    {
        var tmp = function()
        {
            elem.style.opacity = 1.0;
        };

        setTimeout(tmp, 50);
    };

    elem.addEventListener("touchstart", touchstart);
    elem.addEventListener("touchend",   touchend);
};

StdDesign.range = function(start, stop, step)
{
    if (typeof stop == 'undefined')
    {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined')
    {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop))
    {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step)
    {
        result.push(i);
    }

    return result;
};

StdDesign.switchButton = function(parent, width, height, changeEvent)
{
    // var div    = WebLibSimple.createDivWidHei(0, 0, width, height, null, parent);
    var div    = WebLibSimple.createAnyAppend("div", parent);
    var slider = WebLibSimple.createDivWidHei(0, 0, "50%", height, null, div);

    div.style.left = null;
    div.style.top = null;
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.display = "inline-block";
    div.style.position = "relative";

    div.style.backgroundColor    = "#CCCCCC";
    slider.style.backgroundColor = "#FFFFFF";

    div.style.borderRadius = "1000px";
    slider.style.borderRadius = "1000px";

    div.active = false;

    var on = function()
    {
        div.active = true;
        // div.style.backgroundColor = "#2196F3";
        div.style.backgroundColor = GlobalConf.std_switch_color;
        slider.style.left = null;
        slider.style.right = "0px";

        changeEvent(true);
    };

    var off = function()
    {
        div.active = false;
        div.style.backgroundColor = "#CCCCCC";
        slider.style.left = "0px";
        slider.style.right = null;

        changeEvent(false);
    };

    div.onclick = function()
    {
        if (div.active)
        {
            off();
        }
        else
        {
            on();
        }
    };

    div.on = on;
    div.off = off;

    return div;
};

StdDesign.createImgButton = function(parent, src, event)
{
    var tmp = parent.createButton("", event);

    var size = GlobalConf.std_button_size;

    var border = size * 0.15;
    // var widthHeight = size - (border * 2);
    var widthHeight = size * 0.7;
    var img = WebLibSimple.createImgWidHei(0, border, widthHeight, widthHeight, null, tmp);
    img.style.position = "relative";
    // img.style.backgroundColor = "#b8d70a";
    img.src = src;
};
