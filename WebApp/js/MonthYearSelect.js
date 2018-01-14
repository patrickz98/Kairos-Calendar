MonthYearSelect = {};

MonthYearSelect.nuke = function()
{
    NativeInterface.back = MonthYearSelect.lastBack;
    WebLibSimple.nuke(MonthYearSelect.mainDiv);
};

MonthYearSelect.done = function()
{
    var month = parseInt(MonthYearSelect.choice[ "month" ]) + 1;
    var year  = DataManager.year - 6 + parseInt(MonthYearSelect.choice[ "year" ]);

    CalendarMonth.update(month, year);
    DataManager.setMonth(month, year);

    MonthYearSelect.nuke();
};

MonthYearSelect.update = function(key, index)
{
    for (var span_index in MonthYearSelect[ key ])
    {
        var span = MonthYearSelect[ key ][ span_index ];

        if (span_index != index) span.disselect();
    }

    MonthYearSelect.choice[ key ] = index;
};

MonthYearSelect.span = function(key, div, title, index)
{
    var span = WebLibSimple.createAnyAppend("div", div);
    span.style.paddingTop = "20px";
    span.style.fontSize = "30px";
    span.innerHTML = title;

    span.select = function()
    {
        span.style.color = GlobalConf.monthYearSelect_color;
    };

    span.disselect = function()
    {
        span.style.color = GlobalConf.monthYearSelect_defaultColor;
    };

    span.onclick = function()
    {
        span.select();
        MonthYearSelect.update(key, index);
    };

    StdDesign.dimmerTouch(span);

    return span;
};

MonthYearSelect.createTable = function(key, div, range, now)
{
    // MonthYearSelect.months_selected = selected;

    var center = WebLibSimple.createAnyAppend("center", div);

    var spanArray = [];

    for (var index in range)
    {
        var entry = range[ index ];
        var span = MonthYearSelect.span(key, center, entry, index);

        spanArray.push(span);

        // if ((index == now) || (entry == now))
        if (index == now)
        {
            span.select();
        }
    }

    MonthYearSelect[ key ] = spanArray;
};

MonthYearSelect.view = function(div)
{
    var left  = WebLibSimple.createDiv(0,     0, "50%", 0, null, div);
    var right = WebLibSimple.createDiv("50%", 0,     0, 0, null, div);

    var months = StringManager.locale.months;

    var selected = DataManager.month - 1;
    MonthYearSelect.createTable("month", left, months, selected);

    var year = DataManager.year;
    var years = StdDesign.range(year-6, year+6, 1);

    MonthYearSelect.createTable("year", right, years, 6);

    MonthYearSelect.choice = {};
    MonthYearSelect.choice[ "month" ] = selected;
    MonthYearSelect.choice[ "year"  ] = 6;

    // DataManager.month = month;
    // DataManager.year  = year;
};

MonthYearSelect.init = function()
{
    Menu.closeAnimation();

    var div = StdDesign.createStd(Main.toptopDiv);

    div.setHeadline(StringManager.locale.OpenSelcetMonthYear);
    div.createButton("X",  MonthYearSelect.nuke);
    div.createButton("OK", MonthYearSelect.done);

    MonthYearSelect.lastBack = NativeInterface.back;
    NativeInterface.back = MonthYearSelect.nuke;

    MonthYearSelect.mainDiv = div;

    MonthYearSelect.view(div.content);
};
