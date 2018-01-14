CalendarMonth = {};

CalendarMonth.updateDate = function(date)
{
    var dayDiv = CalendarMonth.getDateDiv(date);
    CalendarMonth.updateDay(dayDiv, date, false);

    Schedule.update(date);
};

CalendarMonth.getDateDiv = function(date)
{
    var dayDiv = CalendarMonth.dateDiv[ date ];

    return dayDiv;
};

CalendarMonth.getMonthDates = function()
{
    return Object.keys(CalendarMonth.dateDiv);
};

CalendarMonth.updateDay = function(dayDiv, date, outDate)
{
    dayDiv.style.display = "none";

    if (outDate) return;

    var info = Time.dayInfo(date);

    dayDiv.innerHTML     = date.getDate();
    dayDiv.date          = date;
    dayDiv.month         = info.month;
    dayDiv.year          = info.year;
    dayDiv.color         = GlobalConf.month_monthColorNormal;
    dayDiv.style.color   = GlobalConf.month_weekDayColor;
    dayDiv.style.fontWeight = "lighter";

    Cricle.changeColor(dayDiv, GlobalConf.month_monthColorNormal);
    dayDiv.style.display = "inline-block";

    if (Time.checkToday(date))
    {
        // Cricle.changeColor(dayDiv, "#ffffff");
        dayDiv.style.color = GlobalConf.month_todayColor;
        dayDiv.style.backgroundColor = "#ffffff";
        dayDiv.style.fontWeight = "900";

        return;
    }

    var schedule = DataManager.getDay(dayDiv.date);

    if (schedule.length > 0)
    {
        var color = GlobalConf.month_monthColorEvent;
        dayDiv.color = color;

        var percent = schedule.length / CalendarMonth.eventCount;

        Cricle.changeColor(dayDiv, color);
        WebLibSimple.setOpacity(dayDiv, color, percent);

        return;
    }

    dayDiv.color = GlobalConf.month_monthColorNormal;
    Cricle.changeColor(dayDiv, GlobalConf.month_monthColorNormal);
};

CalendarMonth.updateMonth = function(month, year)
{
    CalendarMonth.dateDiv = {};
    var monthInfo = Time.monthInfo(month, year);

    var startDay = monthInfo.month_start_day - GlobalConf.weekStartDay;

    if (startDay < 0) startDay += 7;

    for (var day = 0; day < 42; day++)
    {
        var dayDiv = StdMonth.getDayDiv(day);
        CalendarMonth.updateDay(dayDiv, null, true);
    }

    var until = startDay + monthInfo.month_count;
    for (var day = startDay; day < until; day++)
    {
        var dayDiv = StdMonth.getDayDiv(day);

        var date = new Date(year, month - 1, (day - startDay + 1));
        CalendarMonth.updateDay(dayDiv, date, false);

        CalendarMonth.dateDiv[ date ] = dayDiv;
    }
};

CalendarMonth.updateAllDivs = function()
{
    CalendarMonth.eventCount = DataManager.getHighest();
    CalendarMonth.updateMonth(CalendarMonth.month, CalendarMonth.year);
};

CalendarMonth.update = function(month, year)
{
    CalendarMonth.month = month;
    CalendarMonth.year  = year;
    CalendarMonth.eventCount = DataManager.getHighest();

    StdMonth.updateHeadline(month, year);
    CalendarMonth.updateAllDivs();
};

CalendarMonth.init = function(date)
{
    var Schedule = Time.dayInfo(date);

    CalendarMonth.update(Schedule.month, Schedule.year);
};
