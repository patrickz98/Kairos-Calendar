DateTime = {};

DateTime.nuke = function()
{
    NativeInterface.back = DateTime.lastBack;
    WebLibSimple.nuke(DateTime.topDiv);
};

DateTime.update = function()
{
    var date = new Date(DateTime.dateInput.value);
    DateTime.dateInput.blur();

    var newDate = new Date(date.getTime() + (date.getTimezoneOffset() * 1000 * 60));

    AppointmentEditor.update(DateTime.key, newDate);
    DateTime.nuke();
};

DateTime.createButtons = function(parent)
{
    parent.createButton("X", DateTime.nuke);

    DateTime.lastBack = NativeInterface.back;
    NativeInterface.back = DateTime.update;

    parent.createButton("Ok", DateTime.update);
};

DateTime.createHeadline = function(title, parent)
{
    var height = GlobalConf.dateTime_headlineHeight;

    var div = WebLibSimple.createDivHeight(0, 0, 0, height, null, parent);
    div.style.color      = GlobalConf.headlineColor2;
    div.style.textAlign  = "center";
    div.style.lineHeight = height + "px";
    div.style.position   = "relative";
    div.style.fontSize   = (height * 0.5) + "px";
    div.innerHTML        = title;

    return div;
};

DateTime.createBox = function(title, parent)
{
    var headlineHeight = GlobalConf.dateTime_headlineHeight;
    var inputHeight    = GlobalConf.dateTime_inputHeight;

    var div = WebLibSimple.createAnyAppend("div", parent);
    div.style.height = (headlineHeight + inputHeight + 10) + "px";
    div.style.left   = "0px";
    div.style.right  = "0px";

    DateTime.createHeadline(title, div);

    var box = WebLibSimple.createDivHeight(0, 0, 0, inputHeight + 10, null, div);
    box.style.position = "relative";

    div.box = box;

    return div;
};

DateTime.getPickerDate = function(date, time)
{
    var date = new Date(date);
    var iso = "";

    var fillZeros = function(number)
    {
        var r = String(number);
        if (r.length === 1)
        {
          r = '0' + r;
        }

        return r;
    };

    iso += date.getFullYear();
    iso += '-' + fillZeros(date.getMonth() + 1);
    iso += '-' + fillZeros(date.getDate());

    if (time)
    {
        iso += 'T' + fillZeros(date.getHours());
        iso += ':' + fillZeros(date.getMinutes());
    }

    return iso;
};

DateTime.doneWithInput = function(event)
{
    if (event.keyCode == 13)
    {
        DateTime.update();
    }
};

DateTime.createTimeDateInput = function(date, parent)
{
    var div = DateTime.createBox(StringManager.locale.DateAndTime, parent);

    var inputHeight = GlobalConf.dateTime_inputHeight;

    var input = StdDesign.createInput(inputHeight, null, div.box);
    input.style.position = "relative";

    var preDate = DateTime.getPickerDate(date, true);
    input.input.value = preDate;
    // input.input.value = "2016-09-24T10:33";
    // input.input.value = "2016-09-24T10:50:00.000Z";
    // input.input.value = "2016-09-24";
    // input.input.value = "2016-09-24T15:00";
    input.input.type = "datetime-local";

    // console.log("preDate: " + preDate);

    input.input.onkeypress = DateTime.doneWithInput;

    // input.input.oninput = function()
    // {
    //     console.log("new Date: " + input.input.value);
    // };

    DateTime.dateInput = input.input;
};

DateTime.createDateInput = function(date, parent)
{
    var div = DateTime.createBox(StringManager.locale.Date, parent);

    var inputHeight = GlobalConf.dateTime_inputHeight;

    var input = StdDesign.createInput(inputHeight, null, div.box);
    input.style.position = "relative";

    input.input.value = DateTime.getPickerDate(date, false);;
    input.input.type = "date";

    // console.log("new Date: " + input.input.value);

    input.input.onkeypress = DateTime.doneWithInput;

    DateTime.dateInput = input.input;
};


DateTime.init = function(key, date, allday, parent)
{
    DateTime.key = key;

    var div = StdDesign.createStd(parent);
    DateTime.topDiv = div;

    div.setHeadline(StringManager.locale[ key ]);
    DateTime.createButtons(div);

    DateTime.allday = allday;

    var paddingDiv = WebLibSimple.createDiv(
        GlobalConf.textEdit_padding,
        0,
        GlobalConf.textEdit_padding,
        0,
        null,
        div.content);

    if (! allday)
    {
        DateTime.createTimeDateInput(date, paddingDiv);
    }
    else
    {
        DateTime.createDateInput(date, paddingDiv);
    }
};

// input.input.value = "2016-04-20T20:15";
// input.input.type = "datetime-local";

// input.input.value = "2016-04-20";
// input.input.type = "date";
