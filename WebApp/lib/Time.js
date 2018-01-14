Time = {};

// Time.createDate = function(day, month, year)
// {
//     var month = month - 1;
//     var date = new Date(year, month, day);
//     return date;
// }

Time.getToDay = function()
{
    var today = new Date();
    return today;
};

// Month day from 1 to 31
Time.getMonthDay = function(date)
{
    var date = new Date(date);
    var day  = date.getDate();

    return day;
};

//
// Week day from 0 to 6
// S M T W T F S
//
Time.getDay = function(date)
{
    var date = new Date(date);
    var day  = date.getDay();

    // console.log("++> date: " + date);
    // console.log("++> day:  " + Time.getDayTranzlation(day));
    // console.log("++> day:  " + day);

    return day;
};

// Month from 0 to 11
Time.getMonth = function(date)
{
    var date  = new Date(date);
    var month = date.getMonth() + 1;

    return month;
};

// Year
Time.getYear = function(date)
{
    var date = new Date(date);
    var year = date.getFullYear();

    return year;
};

// Days in Month
Time.monthCount = function(month, year)
{
    var date = new Date(year, month, 0);
    var count = date.getDate();

    return count;
};

Time.getMonthStart = function(month, year)
{
    var date  = new Date(year, month - 1, 1);
    var start = Time.getDay(date);

    return start;
};

Time.getMonthEnd = function(month, year)
{
    var date  = new Date(year, month, 0);
    var start = Time.getDay(date);

    return start;
};

Time.dayInfo = function(date)
{
    var date = new Date(date);

    var month_day       = Time.getMonthDay(date);
    var month           = Time.getMonth(date);
    var year            = Time.getYear(date);
    var week_day        = Time.getDay(date);

    var hour            = date.getHours();
    var min             = date.getMinutes();

    var info = {};
    info.date        = date;
    info.day         = month_day;
    info.month       = month;
    info.year        = year;
    info.week_day    = week_day;
    info.hour        = hour;
    info.min         = min;

    return info;
};

Time.monthInfo = function(month, year)
{
    //
    // date month
    //

    var month_count     = Time.monthCount(month, year);
    var month_start_day = Time.getMonthStart(month, year);
    var month_end_day   = Time.getMonthEnd(month, year);

    var info = {};
    info.month           = month;
    info.year            = year;
    info.month_count     = month_count;
    info.month_start_day = month_start_day;
    info.month_end_day   = month_end_day;
    info.min_size        = month_start_day + month_count;

    if ((month_count + month_start_day) >= 35)
    {
        info.weeks = 6;
    }
    else
    {
        info.weeks = 5;
    }

    //
    // month before
    //

    var month_before = month - 1;
    var year_before  = year;

    if (month_before == 0)
    {
        month_before = 12;
        year_before  = year_before - 1;
    }

    var month_before_count = Time.monthCount(month_before, year_before);

    info.month_before       = month_before;
    info.year_before        = year_before;
    info.month_before_count = month_before_count;

    //
    // next month
    //

    var month_next = month + 1;
    var year_next  = year;

    if (month_next == 13)
    {
        month_next = 1;
        year_next  = year_next + 1;
    }

    var month_next_count = Time.monthCount(month_next, year_next);

    info.month_next = month_next;
    info.year_next  = year_next;
    info.month_next_count = month_next_count;

    return info;
};

Time.checkToday = function(date)
{
    var today   = Time.getEventDayDate(Time.getToDay());
    var TmpDate = Time.getEventDayDate(date);

    if (today.toISOString() == TmpDate.toISOString()) return true;

    return false;
};

Time.getEventDayDate = function(date)
{
    var date = new Date(date);

    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();

    var dayDate = new Date(year, month, day);

    // console.log(date);
    // console.log(dayDate);

    return dayDate;
};


Time.checkInMonth = function(month, year, date)
{
    var date = new Date(date);

    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();

    var dayDate = new Date(year, month, day);

    // console.log(date);
    // console.log(dayDate);

    return dayDate;
};

Time.fillZero = function(Number)
{
    if (Number < 10)
    {
        return "0" + Number;
    }

    return "" + Number;
};

Time.tranzToDate = function(date, time)
{
    var date  = date.split(".");
    var year  = parseInt(date[ 2 ]);
    var month = parseInt(date[ 1 ]) - 1;
    var day   = parseInt(date[ 0 ]);

    var newDate = null;

    if (time)
    {
        var time  = time.split(":");
        var hours = parseInt(time[ 0 ]);
        var min   = parseInt(time[ 1 ]);

        newDate = new Date(year, month, day, hours, min);
    }
    else
    {
        newDate = new Date(year, month, day);
    }

    return newDate;
};

Time.getDateTranzlation = function(date)
{
    var info = Time.dayInfo(date);

    var formart = GlobalConf.dateFormat;

    // GlobalConf.dateFormat
    // "DD.MM.YYYY"
    // "DD/MM/YYYY"
    // "MM.DD.YYYY"
    // "MM/DD/YYYY"
    // "YYYY-MM-DD"
    // "YYYY/MM/DD"

    var separator = ".";

    if (WebLibSimple.includes(formart, "/")) separator = "/";
    if (WebLibSimple.includes(formart, "-")) separator = "-";

    var dateParts = GlobalConf.dateFormat.split(separator);

    var tranzDate = [];

    for (var index in dateParts)
    {
        var part = dateParts[ index ];

        if (part == "DD")   tranzDate[ index ] = Time.fillZero(info.day);
        if (part == "MM")   tranzDate[ index ] = Time.fillZero(info.month);
        if (part == "YYYY") tranzDate[ index ] = info.year;
    }

    return tranzDate.join(separator);
    // return Time.fillZero(info.day) + "." + Time.fillZero(info.month) + "." + info.year;
};

Time.getTimeTranzlation = function(date)
{
    var info = Time.dayInfo(date);

    return Time.fillZero(info.hour) + ":" + Time.fillZero(info.min);
};

Time.getDateTimeTranzlation = function(date)
{
    var inDate = new Date(date);
    var time = Time.getTimeTranzlation(inDate);
    var date = Time.getDateTranzlation(inDate);

    return date + " " + time;
};

Time.getWeekShortTranzlation = function(day)
{
    var week = StringManager.locale.weekdaysShort;
    var index = ((day + GlobalConf.weekStartDay) % 7);
    
    return week[ index ];
};

Time.getMonthTranzlation = function(month)
{
    var month = month - 1;
    var months = StringManager.locale.months;

    return months[ month ];
};
