PriorityPicker = {};

PriorityPicker.update = function()
{
    NativeInterface.back = PriorityPicker.lastback;
    AppointmentEditor.update(PriorityPicker.key, PriorityPicker.value);
    WebLibSimple.nuke(PriorityPicker.topDiv);
};

PriorityPicker.createButtons = function(parent)
{
    PriorityPicker.lastback = NativeInterface.back;
    NativeInterface.back = PriorityPicker.update;

    parent.createButton("Ok", PriorityPicker.update);
};

PriorityPicker.createInput = function(parent, preValue)
{
    var height = GlobalConf.priorityPicker_height;

    var title = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    title.style.color = GlobalConf.priorityPicker_titleColor;
    title.style.textAlign = "center";

    var fontSize = GlobalConf.priorityPicker_fontSize;
    title.style.fontSize = fontSize + "px";

    var input = WebLibSimple.createDivHeight(0, height, 0, height, null, parent);

    var changeEvent = function(value)
    {
        var value = parseInt(value);

        var roundedValue = Math.round(value / 10);
        PriorityPicker.value = roundedValue;

        if (value < 33)
        {
            title.innerHTML = StringManager.locale.Low + ": " + roundedValue;
        }

        if (33 < value && value < 66)
        {
            title.innerHTML = StringManager.locale.Middle + ": " + roundedValue;
        }

        if (value > 66)
        {
            title.innerHTML = StringManager.locale.High + ": " + roundedValue;
        }

        title.style.fontSize = (fontSize + value) + "px";
    };

    SliderButton.create(input, preValue * 10, changeEvent);
    changeEvent(preValue * 10);
};

PriorityPicker.init = function(key, preValue, parent)
{
    var div = StdDesign.createStd(parent);
    PriorityPicker.topDiv = div;
    PriorityPicker.key    = key;

    div.setHeadline(StringManager.locale.Priority);
    PriorityPicker.createInput(div.content, preValue);
    PriorityPicker.createButtons(div);
};
