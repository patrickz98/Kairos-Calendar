AppointmentEditor = {};

AppointmentEditor.update = function(key, value)
{
    AppointmentEditor.data[ key ] = value;

    var box = AppointmentEditor.boxByKey[ key ];

    if (value === "")
    {
        value = "-";
    }

    box.valueDiv.innerHTML = value;
    box.value = value;

    if (key == "Kind")
    {
        box.borderColor = CategoryManager.getCategorysColor(value);

        var titleBox = AppointmentEditor.boxByKey[ "Title" ];
        titleBox.valueDiv.style.color = CategoryManager.getCategorysColor(value);
    }

    if (key == "Start" || key == "End")
    {
        box.valueDiv.innerHTML = AppointmentEditor.getDate(value);
    }

    if (key == "All-Day" || key == "Available")
    {
        box.valueDiv.innerHTML = StringManager.locale[ value + "" ];
    }

    if ((key == "All-Day") && (value == true))
    {
        var oldStartDate = AppointmentEditor.data[ "Start" ];
        var oldEndDate   = AppointmentEditor.data[  "End"  ];

        // NativeInterface.log(AppointmentEditor.data[ "Start" ]);
        // NativeInterface.log(Time.getEventDayDate(AppointmentEditor.data[ "Start" ]).toISOString());

        var newStartDate = Time.getEventDayDate(oldStartDate).toISOString();
        var newEndDate   = Time.getEventDayDate(oldEndDate).toISOString();

        AppointmentEditor.data[ "Start" ] = newStartDate;
        AppointmentEditor.data[  "End"  ] = newEndDate;

        var startTranz = AppointmentEditor.getDate(newStartDate);
        var endTranz   = AppointmentEditor.getDate(newEndDate);

        AppointmentEditor.boxByKey[ "Start" ].valueDiv.innerHTML = startTranz;
        AppointmentEditor.boxByKey[  "End"  ].valueDiv.innerHTML = endTranz;
    }

    if ((key == "All-Day") && (value == false))
    {
        var startTranz = AppointmentEditor.getDate(AppointmentEditor.data[ "Start" ]);
        var endTranz   = AppointmentEditor.getDate(AppointmentEditor.data[  "End"  ]);

        AppointmentEditor.boxByKey[ "Start" ].valueDiv.innerHTML = startTranz;
        AppointmentEditor.boxByKey[  "End"  ].valueDiv.innerHTML = endTranz;
    }
};

AppointmentEditor.nuke = function()
{
    NativeInterface.back = Schedule.back;

    CategorysInfo.updateAllCategorys();
    Schedule.updateInnerSchedule();
    CalendarMonth.updateAllDivs();

    // AppointmentEditor.topDiv.style.innerHTML = "";
    // AppointmentEditor.topDiv.style.display = "none";

    WebLibSimple.nuke(AppointmentEditor.topDiv);
};

AppointmentEditor.delete = function()
{
    var sure = function()
    {
        DataManager.delete(AppointmentEditor.data);
        AppointmentEditor.nuke();
    };

    Dialogue.sureDialogue(sure, AppointmentEditor.data[ "Title" ]);
};

AppointmentEditor.commit = function()
{
    var start = new Date(AppointmentEditor.data[ "Start" ]).getTime();
    var end   = new Date(AppointmentEditor.data[  "End"  ]).getTime();

    if (start > end)
    {
        Dialogue.okDialogue(StringManager.locale.startEndError);
        return;
    }

    DataManager.commit(AppointmentEditor.data);
    // Schedule.updateInnerSchedule();
    AppointmentEditor.nuke();
};

AppointmentEditor.openQr = function()
{
    DataManager.commit(AppointmentEditor.data);

    var title = AppointmentEditor.data[ "Title" ];

    var tmpJson = JSON.parse(JSON.stringify(AppointmentEditor.data));
    delete tmpJson[ "id" ];

    Qr.init(title, tmpJson, AppointmentEditor.topDiv);
};

AppointmentEditor.share = function()
{
    DataManager.commit(AppointmentEditor.data);

    var tmpJson = JSON.parse(JSON.stringify(AppointmentEditor.data));
    delete tmpJson[ "id" ];

    NativeInterface.share(tmpJson);
};

AppointmentEditor.openKind = function()
{
    Kind.init(AppointmentEditor.data[ "Kind" ], AppointmentEditor.topDiv);
};

AppointmentEditor.openPriority = function()
{
    PriorityPicker.init("Priority", AppointmentEditor.data[ "Priority" ], AppointmentEditor.topDiv);
};

AppointmentEditor.openBool = function(event)
{
    var target = event.target;
    if (target.root) target = target.root;

    var preBool = AppointmentEditor.data[ target.key ];

    Bool.init(target.key, preBool, AppointmentEditor.topDiv);
};

AppointmentEditor.openText = function(event)
{
    var target = event.target;
    if (target.root) target = target.root;

    Text.init(target.key, target.value, AppointmentEditor.topDiv);
};

AppointmentEditor.openDateTime = function(event)
{
    var target = event.target;
    if (target.root) target = target.root;

    var allDay = AppointmentEditor.data[ "All-Day" ];

    // console.log("clicked: key   --> " + target.key);
    // console.log("clicked: value --> " + target.value);
    // console.log("all-day: value --> " + allDay);

    DateTime.init(target.key, target.value, allDay, AppointmentEditor.topDiv);
};

AppointmentEditor.mouseOver = function(elem)
{
    var baseBorder = GlobalConf.edit_baseBorder;

    var mouseOver = function()
    {
        elem.style.border = baseBorder + elem.borderColor;
    };

    var mouseOut = function()
    {
        elem.style.border = baseBorder + GlobalConf.edit_tileColor;
    };

    if (! Main.isMobile)
    {
        elem.addEventListener("mouseover", mouseOver);
        elem.addEventListener("mouseout",  mouseOut);
    }
    // else
    // {
    //     elem.addEventListener("touchstart", mouseOver);
    //     elem.addEventListener("touchend",   mouseOut);
    // }
};

AppointmentEditor.createMainPoint = function(title, parent)
{
    var size = GlobalConf.edit_tilefontSize;

    var span = WebLibSimple.createDivHeight(0, 0, 0, 0, null, parent);
    span.style.top        = null;
    span.style.bottom     = GlobalConf.edit_tilePointPadding + "px";
    span.style.height     = size + "px";
    span.style.fontSize   = (size - 4) + "px";
    span.style.lineHeight = (size - 4) + "px";
    span.style.fontWeight = "900";
    span.style.textAlign  = "center";
    span.style.color      = GlobalConf.edit_mainPointColor;
    span.style.overflow   = "hidden";
    span.innerHTML        = title;

    return span;
};

AppointmentEditor.createNotePoint = function(title, parent)
{
    var span = AppointmentEditor.createMainPoint(title, parent);
    span.style.top        = GlobalConf.edit_tilePointPadding + "px";
    span.style.height     = null;
    span.style.bottom     = null;
    span.style.color      = GlobalConf.edit_notePointColor;
    span.style.fontWeight = "100";

    return span;
};

AppointmentEditor.createOptionFields = function(index, parent)
{
    var size   = 100 / 3;
    var left   = size * index;
    var width  = size + "%";
    var margin = 10;
    var bgcolor = GlobalConf.edit_tileColor;

    var div = WebLibSimple.createDivWidth(left + "%", 0, width, 0, null, parent);

    var content = WebLibSimple.createDiv(margin, margin, margin, margin, null, div);
    content.style.borderRadius = GlobalConf.edit_borderRadius + "px";
    content.style.overflow     = "hidden";
    content.style.border       = GlobalConf.edit_baseBorder + bgcolor;
    content.style.cursor       = "pointer";

    WebLibSimple.setBGColor(content, bgcolor);

    var tagBox = WebLibSimple.createDiv(0, 0, 0, "50%", null, content);
    var tagDiv = AppointmentEditor.createMainPoint("title", tagBox);

    var valueBox = WebLibSimple.createDiv(0, "50%", 0, 0, null, content);
    var valueDiv = AppointmentEditor.createNotePoint("title", valueBox);

    tagBox.root   = content;
    tagDiv.root   = content;
    valueBox.root = content;
    valueDiv.root = content;

    content.tagDiv = tagDiv;
    content.valueDiv = valueDiv;

    // AppointmentEditor.mouseOver(content);
    StdDesign.dimmerTouch(content);

    return content;
};

AppointmentEditor.createOptionLine = function(index, parent)
{
    var size   = 100 / 3;
    var top    = size * index;
    var height = size + "%";

    var topDiv = WebLibSimple.createDivHeight(0, top + "%", 0, height, null, parent);

    for (var inx = 0; inx < 3; inx++)
    {
        var optionBoxe = AppointmentEditor.createOptionFields(inx, topDiv);

        var optIndex = index + ":" + inx;
        AppointmentEditor.optionBoxes[ optIndex ] = optionBoxe;
    }
};

AppointmentEditor.getDate = function(date)
{
    if (AppointmentEditor.data[ "All-Day" ])
    {
        return Time.getDateTranzlation(date);
    }
    else
    {
        return Time.getDateTimeTranzlation(date);
    }
};

AppointmentEditor.confTile = function(index, key)
{
    var data        = AppointmentEditor.data;
    var box         = AppointmentEditor.optionBoxes[ index ];
    box.borderColor = GlobalConf.edit_tileBorderColor;
    box.onclick     = AppointmentEditor.openText;

    var value = data[ key ];

    box.key = key;
    box.value = value;

    AppointmentEditor.boxByKey[ key ] = box;

    if (value === "")
    {
        value = "-";
    }

    box.tagDiv.innerHTML = StringManager.locale[ key ];
    box.valueDiv.innerHTML = value;

    if (key == "Title")
    {
        // var color = GlobalConf.categorys[ data[ "Kind" ] ];
        // box.valueDiv.style.color = GlobalConf.edit_mainTitleColor;
        box.valueDiv.style.color = CategoryManager.getCategorysColor(data[ "Kind" ]);
        box.valueDiv.style.fontWeight = "900";
    }

    if (key == "Kind")
    {
        var color = CategoryManager.getCategorysColor(data[ "Kind" ]);
        box.borderColor = color;
        box.onclick = AppointmentEditor.openKind;
    }

    if (key == "Priority")
    {
        box.onclick = AppointmentEditor.openPriority;
    }

    if (key == "All-Day" || key == "Available")
    {
        box.onclick = AppointmentEditor.openBool;
        box.valueDiv.innerHTML = StringManager.locale[ value + "" ];
    }

    if (key == "Start" || key == "End")
    {
        box.onclick = AppointmentEditor.openDateTime;
        box.valueDiv.innerHTML = AppointmentEditor.getDate(data[ key ]);
    }
};

AppointmentEditor.createOptions = function(bottom, topDiv)
{
    var topDiv = WebLibSimple.createDiv(0, 0, 0, bottom, null, topDiv);

    var padding = 20;
    var paddingDiv = WebLibSimple.createDiv(padding, 0, padding, 0, null, topDiv);
    // WebLibSimple.setBGColor(paddingDiv, "#203dd4");

    AppointmentEditor.optionBoxes = {};

    for (var inx = 0; inx < 3; inx++)
    {
        AppointmentEditor.createOptionLine(inx, paddingDiv);
    }

    AppointmentEditor.boxByKey = [];

    var inz = 0;

    for (var inx = 0; inx < 3; inx++)
    {
        for (var iny = 0; iny < 3; iny++)
        {
            var index = inx + ":" + iny;
            var key   = AppointmentEditor.dataKeys[ inz ];

            AppointmentEditor.confTile(index, key);

            inz++;
        }
    }
};

AppointmentEditor.back = function()
{
    // NativeInterface.log(JSON.stringify(Schedule.stdJson));

    // console.log("#1 " + JSON.stringify(Schedule.stdJson));
    // console.log("#2 " + JSON.stringify(AppointmentEditor.data));

    if (JSON.stringify(Schedule.stdJson) == JSON.stringify(AppointmentEditor.data))
    {
        // delete without sure
        // DataManager.delete(AppointmentEditor.data);
        // AppointmentEditor.nuke();

        AppointmentEditor.delete();

        // NativeInterface.log("delete");

        return;
    }

    // NativeInterface.log("commit");

    AppointmentEditor.commit();
};

AppointmentEditor.createButtonBar = function(height, parent)
{
    var div = StdDesign.createStdButtonBar(height, parent);

    NativeInterface.back = AppointmentEditor.back;

    div.createButton("X",  AppointmentEditor.delete);
    div.createButton("Qr", AppointmentEditor.openQr);
    div.createButton("Ok", AppointmentEditor.commit);
};

AppointmentEditor.init = function(data)
{
    var topDiv = StdDesign.createStdDiv(Main.toptopDiv);

    WebLibSimple.setBGColor(topDiv, GlobalConf.bodyColor);

    AppointmentEditor.topDiv = topDiv;

    var keys = Object.keys(data);

    if (WebLibSimple.includes(keys, "id")) WebLibSimple.removeValFromArray("id", keys);

    AppointmentEditor.originalData = data;
    AppointmentEditor.data         = data;
    AppointmentEditor.dataKeys     = keys;

    var buttonBarHeight = GlobalConf.std_buttonBar_height;

    AppointmentEditor.createOptions(buttonBarHeight, topDiv);
    AppointmentEditor.createButtonBar(buttonBarHeight, topDiv);
};
