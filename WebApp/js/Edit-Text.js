Text = {};

Text.nuke = function()
{
    NativeInterface.back = AppointmentEditor.back;
    WebLibSimple.nuke(Text.topDiv);
};

Text.update = function()
{
    var text = Text.input.input.value;

    Text.input.input.blur();

    if (Text.key == "Title" && (text == null || text == ""))
    {
        Text.nuke();
        return;
    }

    AppointmentEditor.update(Text.key, text);
    Text.nuke();
};

Text.createButtons = function(parent)
{
    parent.createButton("X", Text.nuke);

    if (Text.key == "Place")
    {
        StdDesign.createImgButton(parent, img_maps_w, Text.openMaps);
    }

    NativeInterface.back = Text.update;
    parent.createButton("Ok", Text.update);
};

Text.openMaps = function()
{
    var place = Text.input.input.value;
    NativeInterface.openMaps(place);
};

Text.createInput = function(oldTxt, parent)
{
    var height = 100;
    var placeholder = "type!";

    if (oldTxt == StringManager.locale.NewEvnetPlaceholder)
    {
        oldTxt = null;
        placeholder = StringManager.locale.NewEvnetPlaceholder;
    }

    var padding = GlobalConf.textEdit_padding;
    var paddingDiv = WebLibSimple.createDivHeight(padding, 0, padding, height, null, parent);
    var input = StdDesign.createInput(height, placeholder, paddingDiv);

    input.input.onkeypress = function(event)
    {
        if (event.keyCode == 13)
        {
            Text.update();
        }
    };

    if (oldTxt)
    {
        input.input.value = oldTxt;
    }

    Text.input = input;
};

Text.init = function(key, oldTxt, parent)
{
    var div = StdDesign.createStd(parent);
    Text.topDiv = div;
    Text.key    = key;

    div.setHeadline(StringManager.locale[ key ]);
    Text.createInput(oldTxt, div.content);
    Text.createButtons(div);
};
