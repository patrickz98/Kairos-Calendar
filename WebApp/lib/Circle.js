Cricle = {};

Cricle.getAutoFontSize = function(parent, title, size)
{
    var span = WebLibSimple.createAnyAppend("span", parent);
    span.innerHTML          = title;
    span.style.fontSize     = "1px";

    var spansize = 2;
    var border   = size * 0.15;

    while (((span.offsetWidth + border) < size) && ((span.offsetHeight + border) < size))
    {
        span.style.fontSize = spansize + "px";
        spansize++;
    }

    span.style.display = "none";
    span = null;

    return spansize;
};

Cricle.createLabelCircle = function(title, size, color, parent, eventFunct)
{
    var div = Cricle.createCircle(title, size, color, parent, eventFunct);

    div.style.fontSize   = Cricle.getAutoFontSize(div, title, size) + "px";
    div.style.lineHeight = size + "px";

    return div;
};

Cricle.createCircle = function(title, size, color, parent, eventFunct)
{
    var div = WebLibSimple.createAnyAppend("div", parent);
    div.style.borderRadius = "50%";
    div.style.width        = size + "px";
    div.style.height       = size + "px";
    div.style.lineHeight   = size + "px";
    div.style.textAlign    = "center";
    div.style.color        = "#ffffff";
    div.style.display      = "inline-block";
    div.style.overflow     = "hidden";
    div.style.border       = "2px solid " + color;
    div.style.backgroundColor = color;
    div.style.boxShadow       = "none";
    div.style.webkitBoxShadow = "none";

    if ((title != "") && (title != null)) div.style.fontSize = Cricle.getAutoFontSize(div, title, size) + "px";

    div.size = size;

    if (eventFunct != null)
    {
        div.style.cursor = "pointer";
    }


    div.onclick   = eventFunct;
    div.innerHTML = title;

    WebLibSimple.setBGColor(div, color);

    return div;
};

Cricle.changeSize = function(div, size)
{
    var title   = div.innerHTML;
    var oldSize = div.size;
    var newSize = oldSize;

    var time = 500;
    var step = 10;

    // size = size * 1.0;

    console.log("newSize " + oldSize);
    console.log("size    " + size);

    var change = function()
    {
        div.style.width  = newSize + "px";
        div.style.height = newSize + "px";

        // if (newSize < size)
        // {
        //     var add = Math.round((size - oldSize) / (time / step));
        //
        //     if (add == 0) add = 0.5;
        //
        //     newSize += add;
        //
        //     console.log("add: " + add);
        //
        //     setTimeout(change, step);
        // }
        // else
        // {
        //     div.style.width      = size + "px";
        //     div.style.height     = size + "px";
        // }

        if (newSize > size)
        {
            // console.log("newSize > size");

            // var add = Math.round((oldSize - size) / (time / step));
            var add = (oldSize - size) / (time / step);
            add = add.toFixed(3);

            // if (add == 0) add = 0.5;

            newSize -= add;

            // console.log("add: " + add);

            setTimeout(change, step);
        }
        else
        {
            div.style.width  = size + "px";
            div.style.height = size + "px";
        }
    };

    // change();

    div.style.fontSize = Cricle.getAutoFontSize(div, title, size) + "px";
    div.style.lineHeight = size + "px";
    div.style.width  = size + "px";
    div.style.height = size + "px";
    div.size = size;
};

Cricle.changeColor = function(div, color)
{
    div.style.border = "2px solid " + color;
    WebLibSimple.setBGColor(div, color);
};

Cricle.createImgCircle = function(size, color, src, parent)
{
    // Need a center element to work

    var div = WebLibSimple.createAnyAppend("div", parent);
    div.style.borderRadius = "50%";
    div.style.display      = "inline-block";
    div.style.width        = size + "px";
    div.style.height       = size + "px";
    div.style.border       = "1px solid " + color;
    div.style.textAlign    = "center";

    var border = size / 6;
    var widthHeight = size - (border * 2);
    var img = WebLibSimple.createImgWidHei(0, border, widthHeight, widthHeight, null, div);
    img.style.position = "relative";
    img.src = src;

    div.img = img;

    return div;
};

Cricle.createBorderCircle = function(title, size, color, border, parent, eventFunct)
{
    var div = Cricle.createCircle(title, size, "#000000", parent, eventFunct);
    div.style.backgroundColor = null;
    div.style.color           = color;
    div.style.border          = border;

    return div;
};

Cricle.createCenterCircle = function(title, size, color, parent, eventFunct)
{
    var center = WebLibSimple.createAnyAppend("center", parent);
    var div    = Cricle.createCircle(title, size, color, center, eventFunct);

    return div;
};

Cricle.createMenuPoint = function(title, size, color, parent, event)
{
    var paddingDiv = WebLibSimple.createAnyAppend("div", parent);
    paddingDiv.style.display = "inline-block";
    paddingDiv.style.padding = "20px";

    if (event == null)
    {
        color = "#6b6b6b";
    }

    var div = Cricle.createCircle(title, size, color, paddingDiv, event);

    return div;
};
