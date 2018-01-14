Bool = {};

Bool.nuke = function()
{
    NativeInterface.back = Bool.lastBack;
    WebLibSimple.nuke(Bool.topDiv);
};

Bool.createPicker = function(parent, preBool)
{
    var height = GlobalConf.boolPicker_height;

    var text = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    text.style.lineHeight = height + "px";
    text.style.fontSize = GlobalConf.boolPicker_fontSize + "px";
    text.style.textAlign = "center";
    text.innerHTML = StringManager.locale[ preBool + "" ];

    var changeEvent = function(active)
    {
        text.innerHTML = StringManager.locale[ active + "" ];
        AppointmentEditor.update(Bool.key, active);
    };

    var switchDiv    = WebLibSimple.createDiv(0, height, 0, 0, null, parent);
    var center       = WebLibSimple.createAnyAppend("center", switchDiv);
    var switchButton = StdDesign.switchButton(center, 200, 100, changeEvent);

    if (preBool)
    {
        switchButton.on();
    }
    else
    {
        switchButton.off();
    }
};

Bool.init = function(key, preBool, parent)
{
    Bool.key = key;

    var div = StdDesign.createStd(parent);
    Bool.topDiv = div;

    div.setHeadline(StringManager.locale[ key ]);
    Bool.createPicker(div.content, preBool);

    Bool.lastBack = NativeInterface.back;
    NativeInterface.back = Bool.nuke;

    div.createButton("Ok", Bool.nuke);
};
