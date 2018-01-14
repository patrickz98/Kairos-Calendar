Schedule = {};

Schedule.updateHeadline = function(title)
{
    var titleTranz = Time.getDateTranzlation(title);
    Schedule.topDiv.setHeadline(titleTranz);
};

Schedule.createSchedule = function()
{
    var box = WebLibSimple.createDiv(0, 0, 0, 0, null, Schedule.topDiv.content);
    box.style.overflow = "auto";

    Schedule.scheduleBox = box;

    Schedule.setHammer(Schedule.scheduleBox);
};

Schedule.createMain = function(title, parent)
{
    var span = WebLibSimple.createAnyAppend("span", parent);
    span.style.fontSize = GlobalConf.scheduleDateFontSize + "px";
    span.style.color = GlobalConf.scheduleDateFontColor;
    span.innerHTML = title;

    return span;
};

Schedule.createNote = function(title, parent)
{
    var span = Schedule.createMain(title, parent);
    span.style.color = GlobalConf.scheduleDateFontColor2;

    return span;
};

Schedule.click = function(elem, data)
{
    elem.onclick = function()
    {
        AppointmentEditor.init(data);
    };
};

Schedule.createEvent = function(index, data, box)
{
    var categorys = CategoryManager.getCategorys();
    var category = data[ "Kind" ];
    var categoryColor = categorys[ category ];

    var paddingTop = GlobalConf.schedulePaddingTop;
    var tagHeight  = GlobalConf.scheduleEntryHeight;

    var loopWidth      = GlobalConf.scheduleLoopWidth;
    var loopPaddingFix = GlobalConf.scheduleLoopPaddingFix;
    var loopTextWeight = GlobalConf.scheduleLoopTextWeight;

    var titleFontSize = GlobalConf.scheduleFontSize;
    var titleColor    = GlobalConf.scheduleFontColor;

    var top = (paddingTop + tagHeight) * index;
    var tagDiv = WebLibSimple.createDivHeight(0, top, 0, tagHeight, null, box);
    tagDiv.style.overflow = "hidden";
    tagDiv.style.cursor = "pointer";

    Schedule.click(tagDiv, data);

    var createLoopSpan = function(loopChar, align, left, right)
    {
        var loop = WebLibSimple.createAnyAppend("span", tagDiv);
        loop.style.position = "absolute";
        loop.style.left     = left;
        loop.style.top      = loopPaddingFix + "px";
        loop.style.right    = right;
        loop.style.width    = loopWidth + "px";

        loop.style.color      = categoryColor;
        loop.style.fontSize   = tagHeight + "px";
        loop.style.fontWeight = loopTextWeight;
        loop.style.textAlign  = align;

        loop.innerHTML = loopChar;

        return loop
    };

    var loop = createLoopSpan("{", "left", "0px", null);
    var loop = createLoopSpan("}", "right", null, "0px");

    var content = WebLibSimple.createDiv(loopWidth, 0, loopWidth, 0, null, tagDiv);

    var title = WebLibSimple.createDiv(0, 0, "50%", 0, null, content);
    title.style.fontSize = titleFontSize + "px";
    title.style.lineHeight = tagHeight + "px";
    title.style.color = titleColor;
    title.innerHTML = data[ "Title" ];

    var date = WebLibSimple.createDiv("50%", 0, 0, 0, null, content);
    date.style.fontSize = (tagHeight / 4) + "px";
    date.style.lineHeight = (tagHeight / 2) + "px";
    date.style.color = GlobalConf.headlineColor2;
    date.style.textAlign = "right";

    var subHeight = tagHeight / 2;

    var startDiv = WebLibSimple.createDivHeight(0,         0, 0, subHeight, null, date);
    var endDiv   = WebLibSimple.createDivHeight(0, subHeight, 0, subHeight, null, date);

    var start = data[ "Start" ];
    var end   = data[  "End"  ];

    var startDate = Time.getEventDayDate(start).toISOString();
    var endDate   = Time.getEventDayDate(end).toISOString();

    var startDateTranz = Time.getDateTranzlation(startDate);
    var endDateTranz   = Time.getDateTranzlation(endDate);

    var startTime = Time.getTimeTranzlation(start);
    var endTime   = Time.getTimeTranzlation(end);

    if (data[ "All-Day" ])
    {
        Schedule.createMain(startDateTranz, startDiv);
        Schedule.createMain(endDateTranz, endDiv);

        return;
    }

    if (startDate != endDate)
    {
        Schedule.createNote(startDateTranz + " - ", startDiv);
        Schedule.createMain(startTime, startDiv);

        Schedule.createNote(endDateTranz + " - ", endDiv);
        Schedule.createMain(endTime, endDiv);
    }
    else
    {
        Schedule.createMain(startTime, startDiv);
        Schedule.createMain(endTime, endDiv);
    }
};

Schedule.createNoneDiv = function(parent)
{
    var div = WebLibSimple.createAnyAppend("div", parent);
    div.style.color      = GlobalConf.headlineColor2;
    div.style.fontSize   = GlobalConf.month_headlineFontSize + "px";
    div.style.textAlign  = "center";
    div.style.top        = "45%";
    div.style.width      = "100%";
    div.style.fontSize   = GlobalConf.std_headline_fontSize + "px";
    div.style.position   = "absolute";
    div.innerHTML        = StringManager.locale.None;
};

Schedule.sortEvents = function(events)
{
    var idEvents = {};
    var time = [];

    for (var index in events)
    {
        var json = events[ index ];
        var eTime = new Date(json[ "Start" ]).getTime();

        var id = json[ "id" ];
        idEvents[ id ] = json;

        // time + $ + id
        // 1475791200000-9f7ddc65-51c2-4f2c-e2e6-87169c2c31b7
        var tmp = eTime + "$" + id;
        time.push(tmp);
    }

    var sortDate = function(a, b)
    {
        var valueA = parseInt(a.split("$")[ 0 ]);
        var valueB = parseInt(b.split("$")[ 0 ]);

        return valueA - valueB;
    };

    time.sort(sortDate);


    var sortEvents = [];

    for (var index in time)
    {
        var timeId = time[ index ];
        var id = timeId.split("$")[ 1 ];

        sortEvents.push(idEvents[ id ]);
    }

    return sortEvents;
};

Schedule.updateSchedule = function(schedule)
{
    if (! Schedule.scheduleBox)
    {
        Schedule.createSchedule();
    }

    var box = Schedule.scheduleBox;
    box.innerHTML = "";

    var createdEvents = 0;

    var tmp = [];

    for (var index in schedule)
    {
        var event = schedule[ index ];

        if ((Main.showCategory != null) && (event[ "Kind" ] != Main.showCategory)) continue;

        tmp.push(event);
    }

    var sortEvents = Schedule.sortEvents(tmp);

    for (var index in sortEvents)
    {
        var event = sortEvents[ index ];

        Schedule.createEvent(createdEvents, event, box);
        createdEvents++;
    }

    if (createdEvents == 0)
    {
        Schedule.createNoneDiv(box);
    }
};

Schedule.back = function()
{
    if (! Main.scheduleDivVisable)
    {
        NativeInterface.androidSuperBack();
    }

    if (Main.scheduleFullSize)
    {
        Schedule.exitFullDisplay();
        return;
    }

    StdMonth.disableSelections();

    Main.showInfoDiv();

    Main.fixInfoDay = false;

    Schedule.date = null;
};

Schedule.add = function()
{
    var date = (new Date(Schedule.date)).getTime();

    var startDate = new Date(date + 9 * 60 * 60 * 1000);
    var endDate   = new Date(date + 10 * 60 * 60 * 1000);

    var data =
    {
        "id": null,
        "Title": StringManager.locale.NewEvnetPlaceholder,
        "Place": "",
        "Kind": GlobalConf.defaultCategory.name,
        "All-Day": false,
        "Start": startDate,
        "End": endDate,
        "Priority": 5,
        "Available": false,
        "Notes": ""
    };

    Schedule.stdJson = data;

    var json = JSON.parse(JSON.stringify(data));
    AppointmentEditor.init(json);
};

Schedule.createButtons = function(parent)
{
    parent.createButton("+", Schedule.add);
    parent.createButton("X", Schedule.back);

    NativeInterface.back = Schedule.back;
};

Schedule.update = function(date)
{
    Main.showScheduleDiv();

    // console.log("update: " + Schedule.date + " : " + date);
    if (Schedule.date == date)
    {
        Schedule.fullDisplay();
        return;
    }

    Schedule.date = date;

    var schedule = DataManager.getDay(date);

    Schedule.updateHeadline(date);
    Schedule.updateSchedule(schedule);
};

Schedule.updateInnerSchedule = function()
{
    var schedule = DataManager.getDay(Schedule.date);
    Schedule.updateSchedule(schedule);
};

Schedule.reconfHeadline = function(parent)
{
    parent.headline.style.fontSize   = GlobalConf.scheduleHeadlineSize   + "px";
    parent.headline.style.lineHeight = GlobalConf.scheduleHeadlineHeight + "px";
    parent.headline.style.height     = GlobalConf.scheduleHeadlineHeight + "px";
    parent.headline.style.color      = GlobalConf.scheduleHeadlineColor;

    parent.content.style.top = GlobalConf.scheduleHeadlineHeight + "px";
};

Schedule.animation = function(direction)
{
    var size = 0;

    var startPpacity = 1.0;
    var startPosition = 50;

    if (direction < 0)
    {
        startPpacity = 0;
        startPosition = 0;
    }

    Main.orientation();

    if (Main.position == "landscape")
    {
        Main.containerMonth.style.bottom = "0%";
        Main.containerMonth.style.right = "50%";
    }

    if (Main.position == "portrait")
    {
        Main.containerMonth.style.bottom = "50%";
        Main.containerMonth.style.right = "0%";
    }

    var run = function()
    {
        size += 10;
        var position = WebLibSimple.circ(size / 100);

        if (Main.position == "portrait")
        {
            Schedule.parent.style.top = (startPosition - (50 * position * direction)) + "%";
        }

        if (Main.position == "landscape")
        {
            Schedule.parent.style.left = (startPosition - (50 * position * direction)) + "%";
        }

        Main.containerMonth.style.opacity = startPpacity - (position * direction);

        if (position < 1)
        {
            setTimeout(run, 15);
        }
    };

    run();
};

Schedule.fullDisplay = function()
{
    Main.scheduleFullSize = true;
    Schedule.animation(1);
};

Schedule.exitFullDisplay = function()
{
    Main.scheduleFullSize = false;
    Schedule.animation(-1);
};

Schedule.changeMonthCeckCategory = function()
{
    if (Main.showCategory == null) return;

    var data = Categorys.highlite(Main.showCategory);
    CategorysInfo.changeHeadlineEvents(data.time, data.events);
};

Schedule.nextDay = function()
{
    var date = new Date(Schedule.date);

    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();

    var monthInfo = Time.monthInfo(month, year);

    day = day + 1;

    if (day - 1 == Time.monthCount(month + 1, year))
    {
        day   = 1;
        month = monthInfo.month_next;
        year  = monthInfo.year_next;

        if (month == 12)
        {
            month = 0;
            year += 1;
        }

        DataManager.setMonth(month + 1, year);
        CalendarMonth.update(month + 1, year);

        Schedule.changeMonthCeckCategory();
    }

    var nextDate = new Date(year, month, day);
    CalendarMonth.dateDiv[ nextDate ].select();
};

Schedule.lastDay = function()
{
    var date = new Date(Schedule.date);

    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();

    var monthInfo = Time.monthInfo(month, year);

    day = day - 1;

    if (day == 0)
    {
        month = monthInfo.month_before;
        year  = monthInfo.year_before;

        if (month == 12)
        {
            month = 0;
            year += 1;
        }

        if (month == -1)
        {
            month = 11;
            year -= 1;
        }

        day = Time.monthCount(month + 1, year);
        DataManager.setMonth(month  + 1, year);
        CalendarMonth.update(month  + 1, year);

        Schedule.changeMonthCeckCategory();
    }

    var lastDate = new Date(year, month, day);
    CalendarMonth.dateDiv[ lastDate ].select();
};

Schedule.setHammer = function(parent)
{
    var hammertime = new Hammer(parent);

    var action = function(event)
    {
        if (! event.isFinal) return;

        var deltaX = event.deltaX;

        if (deltaX >  100) Schedule.lastDay();
        if (deltaX < -100) Schedule.nextDay();
    };

    hammertime.on("swipe", action);
};

Schedule.init = function(date, parent)
{
    Schedule.parent = parent;
    Schedule.date = null;

    var div = StdDesign.createStd(parent);
    div.style.backgroundColor           = null;
    div.headline.style.backgroundColor  = null;
    div.content.style.backgroundColor   = null;
    div.buttonBar.style.backgroundColor = null;

    Schedule.topDiv = div;

    // Schedule.setHammer(div.content);

    Schedule.reconfHeadline(div);
    Schedule.createButtons(div);

    return div;
};
