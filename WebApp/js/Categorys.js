Categorys = {};

Categorys.getHighest = function(data)
{
    var highest = 0;

    for (var index in data)
    {
        var value = data[ index ];

        if (value > highest)
        {
            highest = value;
        }
    }

    return highest;
};

Categorys.getHoleTimeSpan = function(data)
{
    var count = 0;

    for (var index in data)
    {
        var event = data[ index ];

        var start = new Date(event[ "Start" ]).getTime();
        var end   = new Date(event[  "End"  ]).getTime();

        count += end - start;
    }

    return count;
};

Categorys.makeMonthNormal = function()
{
    var color = GlobalConf.month_monthColorNormal;
    var alldays = CalendarMonth.getMonthDates();

    for (var index in alldays)
    {
        var date = alldays[ index ];
        var div = CalendarMonth.getDateDiv(date);
        div.style.color = GlobalConf.month_weekDayColor;
        div.color = color;

        Cricle.changeColor(div, color);
    }
};

Categorys.deHighlite = function()
{
    Main.showCategory = null;
    CalendarMonth.updateAllDivs();
};

Categorys.highlite = function(category)
{
    Main.showCategory = category;

    var results = DataManager.getByCategory(category);
    var count   = DataManager.countEvents(results);
    var highest = Categorys.getHighest(count);
    var color   = CategoryManager.getCategorysColor(category);

    // console.log("results: " + JSON.stringify(results));
    // console.log("count: " + JSON.stringify(count));
    // console.log("category: " + category + " highest: " + highest);

    Categorys.makeMonthNormal();

    var setOp = function(date)
    {
        var date = new Date(date);

        var div = CalendarMonth.getDateDiv(date);

        if (div === undefined) return;

        // div.schedule = DataManager.filterCategory(category, div.schedule);
        // console.log("div.schedule: " + JSON.stringify(div.schedule));

        var percent = DataManager.getCategoryDateCount(category, date) / highest;
        Cricle.changeColor(div, color);
        WebLibSimple.setOpacity(div, color, percent);

        // div.style.color = "#000000";
    };

    for (var index in results)
    {
        var json  = results[ index ];
        var event_start = Time.getEventDayDate(json[ "Start" ]).getTime();
        var event_end   = Time.getEventDayDate(json[  "End"  ]).getTime();

        if (event_start > event_end)
        {
            console.log("Break: event_start > event_end");
            break;
        }

        DataManager.getCategoryDateCount();

        var day_ms = 60 * 60 * 24 * 1000;

        while(event_start <= event_end)
        {
            setOp(event_start);

            event_start += day_ms;
        }
    }

    var timeSpan = Categorys.getHoleTimeSpan(results);

    var json = {
        "events": results.length,
        "time": (Math.round((timeSpan / 1000 / 3600) * 10) / 10)
    };

    return json;
};
