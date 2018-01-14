Statistics = {};

Statistics.nuke = function()
{
    NativeInterface.back = Search.lastBack;
    WebLibSimple.nuke(Statistics.topDiv);
};

Statistics.newCtx = function()
{
    var center = WebLibSimple.createAnyAppend("center", Statistics.content);

    var div = WebLibSimple.createAnyAppend("div", center);
    div.style.width = GlobalConf.statistics_width;
    div.style.paddingBottom = GlobalConf.statistics_paddingBottom;

    var canvas = WebLibSimple.createAnyAppend("canvas", div);
    var ctx = canvas.getContext("2d");

    return ctx;
};

Statistics.headline = function(title)
{
    var center = WebLibSimple.createAnyAppend("center", Statistics.content);

    var div = WebLibSimple.createAnyAppend("h1", center);
    div.style.width = GlobalConf.statistics_width;
    div.innerHTML = title;
    // div.style.paddingBottom = "50px";

};

Statistics.spendingMonth = function()
{
    Statistics.headline(StringManager.locale.EventsMonth);

    var months = StringManager.locale.months;

    var months_count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        var start_event = parseInt(Time.getEventDayDate(event[ "Start" ]).getMonth());
        var end_event   = parseInt(Time.getEventDayDate(event[  "End"  ]).getMonth());

        if (start_event == end_event)
        {
            months_count[ start_event ] += 1;
        }
        else
        {
            months_count[ start_event ] += 1;
            months_count[  end_event  ] += 1;
        }
    }

    var color = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    var data = {
        labels: months,
        datasets: [
            {
                label: StringManager.locale.EventCount,
                backgroundColor: color,
                borderColor: color,
                data: months_count
            }
        ]
    };

    var ctx = Statistics.newCtx();

    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data
    });
};

Statistics.priority = function()
{
    Statistics.headline(StringManager.locale.AveragePriorityMonth);

    var months = StringManager.locale.months;

    var average = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var count   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        var start = new Date(event[ "Start" ]);
        var end   = new Date(event[  "End"  ]);
        var priority = event[ "Priority" ];

        // if (priority > 10)
        // {
        //     console.log("event: " + JSON.stringify(event));
        // }

        var start_event = start.getMonth();
        var end_event   = end.getMonth();

        if (start_event == end_event)
        {
            average[ start_event ] += priority;
            count[ start_event ] += 1;
        }
        else
        {
            average[ start_event ] += priority;
            average[  end_event  ] += priority;

            count[ start_event ] += 1;
            count[ end_event ] += 1;
        }
    }

    for (var index in average)
    {
        var aver = average[ index ] / count[ index ];
        average[ index ] = aver;
    }

    var datasets = [
        {
            label: StringManager.locale.Priority,
            data: average,
            // borderColor: GlobalConf.headlineColor
            borderColor: GlobalConf.statistics_priorityColor
        }
    ];

    var data = {
        labels: months,
        datasets: datasets
    };

    // console.log("data: " + JSON.stringify(data));

    var ctx = Statistics.newCtx();

    var myBarChart = new Chart(ctx, {
        type: 'line',
        data: data
    });
};

Statistics.priorityCategorys = function()
{
    Statistics.headline(StringManager.locale.CategorysPriorityAverageMonth);

    var months = StringManager.locale.months;
    var categorys = CategoryManager.getCategorys();

    var json = {};

    for (var name in categorys)
    {
        var tmp = {};
        tmp.average = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        tmp.count   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        json[ name ] = tmp;
    }

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        var start = new Date(event[ "Start" ]);
        var end   = new Date(event[  "End"  ]);
        var priority = event[ "Priority" ];
        var name     = event[ "Kind" ];

        var start_event = start.getMonth();
        var end_event   = end.getMonth();

        if (start_event == end_event)
        {
            json[ name ].average[ start_event ] += priority;
            json[ name ].count[ start_event ] += 1;
        }
        else
        {
            json[ name ].average[ start_event ] += priority;
            json[ name ].average[  end_event  ] += priority;

            json[ name ].count[ start_event ] += 1;
            json[ name ].count[ end_event ] += 1;
        }
    }

    var colors = {};

    for (var name in categorys)
    {
        var array = [];

        for (var index in months)
        {
            array[ index ] = categorys[ name ];
        }

        colors[ name ] = array;
    }

    var datasets = [];

    for (var name in json)
    {
        var tmp = {};
        tmp.label = name;
        tmp.borderColor = colors[ name ];
        tmp.backgroundColor = colors[ name ];

        var data = [];

        for (var index in json[ name ].average)
        {
            var aver = json[ name ].average[ index ] / json[ name ].count[ index ];
            data[ index ] = aver;
        }

        tmp.data = data;

        datasets.push(tmp);
    }

    var data = {
        labels: months,
        datasets: datasets
    };

    // console.log("data: " + JSON.stringify(data));

    var ctx = Statistics.newCtx();

    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data
    });
};

Statistics.spendingMonthTime = function()
{
    Statistics.headline(StringManager.locale.SpendingMonthHours);

    var months = StringManager.locale.months;

    var cats = {};

    var categorys = CategoryManager.getCategorys();
    for (var name in categorys)
    {
        cats[ name ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        var start = new Date(event[ "Start" ]);
        var end   = new Date(event[  "End"  ]);

        var time = end.getTime() - start.getTime();

        var start_event = start.getMonth();
        var end_event   = end.getMonth();
        var name = event[ "Kind" ];

        if (start_event == end_event)
        {
            cats[ name ][ start_event ] += time;
        }
        else
        {
            cats[ name ][ start_event ] += time;
            cats[ name ][  end_event  ] += time;
        }
    }

    var datasets = [];

    for (var name in cats)
    {
        var tmp = {};
        tmp.label = name;

        var data = [];

        for (var index in cats[ name ])
        {
            var milli = cats[ name ][ index ];
            data.push(milli / 1000 / 60 / 60);
        }

        tmp.data = data;
        tmp.borderColor = CategoryManager.getCategorysColor(name);

        datasets.push(tmp);
    }

    // console.log("pups: " + JSON.stringify(months_count));

    var data = {
        labels: months,
        datasets: datasets
    };

    var ctx = Statistics.newCtx();

    var myBarChart = new Chart(ctx, {
        type: 'line',
        data: data
    });
};

Statistics.spendingCategorys = function()
{
    Statistics.headline(StringManager.locale.EventsCategory);

    var cats = {};

    var categorys = CategoryManager.getCategorys();
    for (var name in categorys)
    {
        cats[ name ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        var start_event = parseInt(Time.getEventDayDate(event[ "Start" ]).getMonth());
        var end_event   = parseInt(Time.getEventDayDate(event[  "End"  ]).getMonth());
        var name = event[ "Kind" ];

        if (start_event == end_event)
        {
            cats[ name ][ start_event ] += 1;
        }
        else
        {
            cats[ name ][ start_event ] += 1;
            cats[ name ][  end_event  ] += 1;
        }
    }

    var datasets = [];

    for (var name in cats)
    {
        var tmp = {};

        tmp.label = name;
        tmp.data = cats[ name ];
        tmp.borderColor = CategoryManager.getCategorysColor(name);

        datasets.push(tmp);
    }

    var data = {
        labels: StringManager.locale.months,
        datasets: datasets
    };

    var ctx = Statistics.newCtx();

    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data
    });
};

Statistics.categoryProportion = function()
{
    Statistics.headline(StringManager.locale.ProportionCategory);

    var cats = {};
    var names = [];

    var categorys = CategoryManager.getCategorys();
    for (var name in categorys)
    {
        cats[ name ] = 0;
        names.push(name + " " + StringManager.locale.Events);
    }

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];
        var name = event[ "Kind" ];
        cats[ name ] += 1;
    }

    var tmp = {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderColor: []
    };

    for (var categ in cats)
    {
        tmp.data.push(cats[ categ ]);

        var color = CategoryManager.getCategorysColor(categ);
        tmp.backgroundColor.push(color);
        tmp.hoverBackgroundColor.push(color);
        tmp.borderColor.push(color);
    }

    var data = {
        labels: names,
        datasets: [ tmp ]
    };

    var ctx = Statistics.newCtx();

    var myLineChart = new Chart(ctx, {
        type: 'pie',
        data: data
    });
};

Statistics.init = function()
{
    var div = StdDesign.createStd(Main.toptopDiv);

    div.setHeadline(StringManager.locale.Statistics);
    div.createButton("X", Statistics.nuke);

    Search.lastBack = NativeInterface.back;
    NativeInterface.back = Statistics.nuke;

    Statistics.content = div.content;
    Statistics.topDiv = div;

    Chart.defaults.global.defaultFontColor = GlobalConf.statistics_defaultFontColor;
    Chart.defaults.global.defaultFontFamily = GlobalConf.statistics_defaultFontFamily;
    Chart.defaults.global.defaultFontSize = GlobalConf.statistics_defaultFontSize;

    Statistics.spendingMonth();
    Statistics.spendingCategorys();
    Statistics.spendingMonthTime();
    Statistics.categoryProportion();
    Statistics.priority();
    Statistics.priorityCategorys();
};
