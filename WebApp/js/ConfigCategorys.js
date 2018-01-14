ConfigCategorys = {};

ConfigCategorys.nuke = function()
{
    NativeInterface.back = ConfigCategorys.lastBack;
    WebLibSimple.nuke(ConfigCategorys.mainDiv);
};

ConfigCategorys.deleteCategory = function(category)
{
    CategoryManager.delete(category);
    ConfigCategorys.updateAll();

    ConfigCategorys.nuke();
    ConfigCategorys.init();
};

ConfigCategorys.changeCategoryName = function(oldName, newName)
{
    CategoryManager.changeName(oldName, newName);
    ConfigCategorys.updateAll();
};

ConfigCategorys.updateAll = function()
{
    Schedule.updateInnerSchedule();
    CalendarMonth.updateAllDivs();
    CategorysInfo.updateAllCategorys();
    // DataInterface.updateConfig();
};

ConfigCategorys.createEntry = function(index, category)
{
    var height = GlobalConf.configCategorys_height;
    var padding = GlobalConf.configCategorys_padding;
    var top = ((height + padding) * index)
    var div = WebLibSimple.createDivHeight(0, top, 0, height, null, ConfigCategorys.topDiv);

    //
    // Circle
    //

    var circleDiv = WebLibSimple.createDivWidth(0, 0, "33%", 0, null, div);
    var center = WebLibSimple.createAnyAppend("center", circleDiv);

    var color = CategoryManager.getCategorysColor(category);
    var circle = Cricle.createCircle("", height, color, center, null);

    var newColor = function(newColor)
    {
        CategoryManager.changeColor(category, newColor);
        Cricle.changeColor(circle, newColor);
        ConfigCategorys.updateAll();
    };

    circle.onclick = function()
    {
        ColorPicker.init(color, newColor);
    };

    StdDesign.dimmerTouch(circle);

    //
    // Text
    //

    var textDiv = WebLibSimple.createDivWidth("33%", 0, "33%", 0, null, div);

    var input = WebLibSimple.createAnyAppend("input", textDiv);
    input.placeholder           = StringManager.locale.Name;
    input.value                 = category;
    input.style.fontSize        = (height * 0.7) + "px";
    input.style.color           = "#ffffff";
    input.style.textAlign       = "center";
    input.style.lineHeight      = height + "px";
    input.style.fontFamily      = GlobalConf.fontFamily;
    input.style.backgroundColor = "transparent";
    input.style.border          = "0px solid #000000";
    input.style.width           = "100%";
    input.style.height          = "100%";
    input.style.outline         = 0;
    input.style.overflow        = "hidden";

    var commitDefaultChanges = function()
    {
        input.blur();
        ConfigCategorys.changeCategoryName(category, input.value);
        ConfigCategorys.updateAll();

        ConfigCategorys.okButton.onclick = ConfigCategorys.nuke;
    };

    input.onkeypress = function(event)
    {
        if (event.keyCode == 13) commitDefaultChanges();
    };

    input.oninput = function(event)
    {
        ConfigCategorys.okButton.onclick = commitDefaultChanges;
    };

    //
    // Delete Button
    //

    var buttonDiv = WebLibSimple.createDivWidth("66%", 0, "33%", 0, null, div);
    buttonDiv.style.lineHeight = height + "px";
    buttonDiv.style.textAlign  = "center";
    buttonDiv.style.fontSize   = (height * 0.5) + "px";
    buttonDiv.style.color      = GlobalConf.configCategorys_deleteButtonColor;
    buttonDiv.innerHTML        = StringManager.locale.Delete;

    var okEvent = function()
    {
        ConfigCategorys.deleteCategory(category);
        div.style.display = "none";
    };

    buttonDiv.onclick = function()
    {
        Dialogue.sureDialogue(okEvent, category);
    };

    StdDesign.dimmerTouch(buttonDiv);

    div.colorDiv  = circle;
    div.input     = input;
    div.buttonDiv = buttonDiv;

    return div;
};

ConfigCategorys.createDefaultCategory = function()
{
    var defaultName = GlobalConf.defaultCategory.name;
    var div = ConfigCategorys.createEntry(0, defaultName);

    //
    // Default Color
    //
    var circle = div.colorDiv;

    var newColor = function(newColor)
    {
        CategoryManager.changeDefaultCategoryColor(newColor);
        Cricle.changeColor(circle, newColor);
        ConfigCategorys.updateAll();
    };

    circle.onclick = function()
    {
        var color = CategoryManager.getCategorysColor(defaultName);
        ColorPicker.init(color, newColor);
    };

    //
    // Default category change name
    //

    var input = div.input;

    var commitDefaultChanges = function()
    {
        input.blur();
        CategoryManager.changeDefaultCategoryName(input.value);
        ConfigCategorys.updateAll();

        ConfigCategorys.okButton.onclick = ConfigCategorys.nuke;
    };

    input.onkeypress = function(event)
    {
        if (event.keyCode == 13) commitDefaultChanges();
    };

    input.oninput = function(event)
    {
        ConfigCategorys.okButton.onclick = commitDefaultChanges;
    };

    //
    // Delete --> Defualt
    //

    div.buttonDiv.innerHTML = StringManager.locale.Default;
    div.buttonDiv.onclick = null;
    div.buttonDiv.addEventListener("touchstart", null);
    div.buttonDiv.addEventListener("touchend",   null);
};

ConfigCategorys.createCategorys = function()
{
    var index = 1;

    for (var category in GlobalConf.categorys)
    {
        ConfigCategorys.createEntry(index, category);
        index++;
    }
};

ConfigCategorys.openNewKind = function()
{
    var done = function()
    {
        ConfigCategorys.updateAll();

        ConfigCategorys.nuke();
        ConfigCategorys.init();
    };

    AddKind.init(Config.mainDiv, done);
};

ConfigCategorys.init = function()
{
    var div = StdDesign.createStd(Config.mainDiv);

    ConfigCategorys.mainDiv = div;
    ConfigCategorys.topDiv = div.content;

    div.setHeadline(StringManager.locale.EditCategorys);
    div.createButton("+", ConfigCategorys.openNewKind);
    ConfigCategorys.okButton = div.createButton("Ok", ConfigCategorys.nuke);

    ConfigCategorys.lastBack = NativeInterface.back;
    NativeInterface.back = ConfigCategorys.nuke;

    ConfigCategorys.createDefaultCategory();
    ConfigCategorys.createCategorys();
};
