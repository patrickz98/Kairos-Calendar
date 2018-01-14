Qr = {};

Qr.nuke = function()
{
    NativeInterface.back = Qr.lastBack;
    WebLibSimple.nuke(Qr.topDiv);
};

Qr.createButtons = function(parent)
{
    Qr.lastBack = NativeInterface.back;
    NativeInterface.back = Qr.nuke;

    StdDesign.createImgButton(parent, img_share_android_w, AppointmentEditor.share);
    parent.createButton("X", Qr.nuke);
};

Qr.createQrCircle = function(data, parent)
{
    var size = 500;

    var div = WebLibSimple.createAnyAppend("div", parent);
    div.style.borderRadius = "50%";
    div.style.display      = "inline-block";
    div.style.width        = size + "px";
    div.style.height       = size + "px";

    WebLibSimple.setBGColor(div, "#ffffff");

    var border = size / 6;
    var widthHeight = size - (border * 2);
    var qrDiv = WebLibSimple.createDivWidHei(0, border, widthHeight, widthHeight, null, div);
    qrDiv.style.position = "relative";

    var qrcode = new QRCode(qrDiv,
    {
        text: data,
        width: widthHeight,
        height: widthHeight,
        colorDark : "#7C25F8",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
};

Qr.createBigBox = function(data, parent)
{
    var size = 500;

    var div = WebLibSimple.createAnyAppend("div", parent);
    div.style.display      = "inline-block";
    div.style.width        = size + "px";
    div.style.height       = size + "px";
    div.style.marginTop    = "50px";

    WebLibSimple.setBGColor(div, "#ffffff");

    var border = size * 0.02;
    var widthHeight = size - (border * 2);

    div.style.borderRadius = border + "px";

    var qrDiv = WebLibSimple.createDivWidHei(0, border, widthHeight, widthHeight, null, div);
    qrDiv.style.position = "relative";

    var qrcode = new QRCode(qrDiv,
    {
        text: data,
        width: widthHeight,
        height: widthHeight,
        // colorDark : "#7C25F8",
        colorDark : "#000000",
        // colorDark : "#CC006A",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });
};

Qr.createContent = function(data, parent)
{
    var center = WebLibSimple.createAnyAppend("center", parent);

    // Qr.createQrCircle(data, center);
    Qr.createBigBox(data, center);
};

Qr.init = function(title, json, parent)
{
    var div = StdDesign.createStd(parent);
    Qr.topDiv = div;

    div.setHeadline(title);

    var data = JSON.stringify(json);

    Qr.createButtons(div);
    Qr.createContent(data, div.content);
};
