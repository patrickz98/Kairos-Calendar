Search = {};

Search.nuke = function()
{
    NativeInterface.back = Search.lastBack;
    WebLibSimple.nuke(Search.top);
};

Search.joinEvent = function(event)
{
    var joined = "";

    var indexedKeys = ["Title", "Place", "Kind", "Notes"];

    for (var key in event)
    {
        if (WebLibSimple.includes(indexedKeys, key))
        joined += event[ key ] + " ";
    }

    return joined;
};

Search.createResultsList = function(search)
{
    Search.topDiv.innerHTML = "";

    var results = [];

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];
        var eventString = Search.joinEvent(event);

        if (eventString.match(RegExp(search, 'i')))
        {
            results.push(event);
        }
    }

    for (var index in results)
    {
        Schedule.createEvent(index, results[ index ], Search.topDiv);
    }
};

Search.createInputLine = function()
{
    var palaceholder = StringManager.locale.OpenSearch;
    var height = GlobalConf.search_inputHeight;

    var input = StdDesign.createInput(height, palaceholder, Search.headline);
    input.style.position = "relative";
    input.input.type     = "text";

    Search.input = input.input;

    input.input.oninput = function(event)
    {
        Search.createResultsList(input.input.value);
    };

    // enter
    input.input.onkeypress = function(event)
    {
        if (event.keyCode == 13) Search.input.blur();
    };
};

Search.setup = function()
{
    var stdDiv = StdDesign.createStd(Main.toptopDiv);
    Search.top = stdDiv;

    stdDiv.createButton("X", Search.nuke);

    stdDiv.headline.innerHTML    = "";
    stdDiv.headline.style.height = GlobalConf.search_height + "px";
    stdDiv.content.style.top     = GlobalConf.search_height + "px";

    Search.mainDiv  = stdDiv;
    Search.topDiv   = stdDiv.content;
    Search.headline = stdDiv.headline;
};

Search.init = function()
{
    Search.lastBack = NativeInterface.back;
    NativeInterface.back = Search.nuke;

    Menu.closeAnimation();
    Search.setup();
    Search.createInputLine();
};
