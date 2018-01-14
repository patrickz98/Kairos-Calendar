DataManager = {};

DataManager.dataAll = [];
DataManager.monthData = [];

DataManager.setMonth = function(month, year)
{
    console.log("setMonth --> month: " + month + " year: " + year);

    DataManager.month = month;
    DataManager.year  = year;

    var info = Time.monthInfo(month, year);

    var start_month = new Date(year, month - 1, 1).getTime();
    var end_month   = new Date(info.year_next, info.month_next - 1, 0).getTime();

    var results = [];

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        var start_event = Time.getEventDayDate(event[ "Start" ]).getTime();
        var end_event   = Time.getEventDayDate(event[  "End"  ]).getTime();

        if (((start_event >= start_month) && (start_event <= end_month)) ||
            ((end_event   >  start_month) && (end_event   <= end_month)))
        {
            results.push(event);
        }
    }

    DataManager.monthData = results;

    CalendarMonth.updateAllDivs();
    CategorysInfo.update();
};

DataManager.uuid = function()
{
    var S4 = function()
    {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    // then to call it, plus stitch in '4' in the third group
    var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

    return guid;
};

DataManager.commit = function(data)
{
    var id = data[ "id" ];

    if (id == null)
    {
        data[ "id" ] = DataManager.uuid();

        DataManager.monthData.push(data);
        DataManager.dataAll.push(data);
        NativeInterface.update(data);
    }
    else
    {
        DataManager.changeJsonById(id, data);
        NativeInterface.update(data);
    }
};

DataManager.delete = function(data)
{
    var id = data[ "id" ];

    DataManager.deleteById(id);
    NativeInterface.delete(id);
};

DataManager.deleteById = function(id)
{
    var check = function(source)
    {
        for (var index in source)
        {
            var event = source[ index ];
            var event_id = event[ "id" ];

            if (id == event_id)
            {
                source.splice(index, 1);
            }
        }
    };

    check(DataManager.monthData);
    check(DataManager.dataAll);
};

// ???
DataManager.changeJsonById = function(id, json)
{
    var check = function(source)
    {
        for (var index in source)
        {
            var event = source[ index ];
            var event_id = event[ "id" ];

            if (id == event_id)
            {
                source[ index ] = json;
            }
        }
    };

    check(DataManager.monthData);
    check(DataManager.dataAll);
};

DataManager.getDay = function(date)
{
    var searchDate = new Date(date).getTime();

    var results = [];

    for (var index in DataManager.monthData)
    {
        var event = DataManager.monthData[ index ];
        var start = Time.getEventDayDate(event[ "Start" ]).getTime();
        var end   = Time.getEventDayDate(event[  "End"  ]).getTime() + (60 * 60 * 24 * 1000);

        if (start <= searchDate && end > searchDate)
        {
            results.push(event);
        }
    }

    return results;
};

DataManager.getHighest = function()
{
    var allEvents = DataManager.countEvents(DataManager.monthData);

    var highest = 1;

    for (var index in allEvents)
    {
        var value = allEvents[ index ];

        if (value > highest)
        {
            highest = value;
        }
    }

    return highest;
};

DataManager.countEvents = function(data)
{
    var result = {};

    var add = function(date)
    {
        if (! result[ date ])
        {
            result[ date ] = 1;
        }
        else
        {
            result[ date ] = result[ date ] + 1;
        }
    };

    for (var index in data)
    {
        var event = data[ index ];
        var start_ms = Time.getEventDayDate(event[ "Start" ]).getTime();
        var end_ms   = Time.getEventDayDate(event[  "End"  ]).getTime();
        var day_ms   = 60 * 60 * 24 * 1000;

        while(start_ms <= end_ms)
        {
            var add_Date = new Date(start_ms).toISOString();
            add(add_Date);

            start_ms += day_ms;
        }
    }

    return result;
};

DataManager.getCategoryDateCount = function(category, date)
{
    var results = 0;

    for (var index in DataManager.monthData)
    {
        var event = DataManager.monthData[ index ];
        var event_category = event[ "Kind"  ];

        var event_start = Time.getEventDayDate(event[ "Start" ]).getTime();
        var event_end   = Time.getEventDayDate(event[  "End"  ]).getTime();
        var date        = Time.getEventDayDate(date).getTime();

        if (category != event_category) continue;

        if ((event_start <= date) && (event_end >= date))
        {
            results++;
        }
    }

    return results;
};

DataManager.filterCategory = function(category, schedule)
{
    var results = [];

    for (var index in schedule)
    {
        var event = DataManager.monthData[ index ];
        var event_category = event[ "Kind" ];

        if (category == event_category)
        {
            results.push(event);
        }
    }

    return results;
};

DataManager.getByCategory = function(category)
{
    var results = [];

    for (var index in DataManager.monthData)
    {
        var event = DataManager.monthData[ index ];
        var event_category = event[ "Kind" ];

        if (category == event_category)
        {
            results.push(event);
        }
    }

    return results;
};

DataManager.parseDatabaseJson = function(data)
{
    DataManager.dataAll = [];

    for (var index in data)
    {
        var event = data[ index ];

        var start = event[ "Start" ];
        var end   = event[  "End"  ];

        event[ "Start" ] = new Date(start);
        event[  "End"  ] = new Date( end );

        if (WebLibSimple.hasKey(event, "Repeat"))
        {
            console.log("change: " + JSON.stringify(event));
            delete event[ "Repeat" ];
            event[ "Priority" ] = 5;

            NativeInterface.update(event);
        }

        DataManager.dataAll.push(event);
    }
};
