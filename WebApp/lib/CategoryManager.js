CategoryManager = {};

// GlobalConf.defaultCategory = {
//     "name": "Calendar",
//     "color": "#08DA73"
// };
//
// GlobalConf.categorys = {
//     "Calendar": "#1ED760",
//     "School": "#B36AE2",
//     "Privat": "#EC5D57",
//     "Work": "#F39019"
// };

CategoryManager.getCategorys = function()
{
    var results = {};

    results[ GlobalConf.defaultCategory.name ] = GlobalConf.defaultCategory.color;

    for (var category in GlobalConf.categorys)
    {
        results[ category ] = GlobalConf.categorys[ category ];
    }

    return results;
};

CategoryManager.getCategorysColor = function(key)
{
    var tmp = CategoryManager.getCategorys();
    return tmp[ key ];
};

CategoryManager.add = function(name, color)
{
    GlobalConf.categorys[ name ] = color;
    ConfigManager.update();
};

CategoryManager.delete = function(category)
{
    delete GlobalConf.categorys[ category ];

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        if (event[ "Kind" ] == category)
        {
            event[ "Kind" ] = GlobalConf.defaultCategory.name;
            NativeInterface.update(event);
        }
    }

    ConfigManager.update();
};

CategoryManager.changeName = function(oldName, newName)
{
    var color_tmp = GlobalConf.categorys[ oldName ];
    delete GlobalConf.categorys[ oldName ];
    GlobalConf.categorys[ newName ] = color_tmp;

    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        if (event[ "Kind" ] == oldName)
        {
            event[ "Kind" ] = newName;
            NativeInterface.update(event);
        }
    }

    ConfigManager.update();
};

CategoryManager.changeColor = function(category, color)
{
    GlobalConf.categorys[ category ] = color;
    ConfigManager.update();
};

CategoryManager.changeDefaultCategoryName = function(name)
{
    // if (name == "" || name == null || name == " ") return;

    var oldname = GlobalConf.defaultCategory.name;
    GlobalConf.defaultCategory.name = name;


    for (var index in DataManager.dataAll)
    {
        var event = DataManager.dataAll[ index ];

        if (event[ "Kind" ] == oldname)
        {
            event[ "Kind" ] = name;
            NativeInterface.update(event);
        }
    }

    ConfigManager.update();
};

CategoryManager.changeDefaultCategoryColor = function(color)
{
    GlobalConf.defaultCategory.color = color;
    ConfigManager.update();
};

CategoryManager.exist = function(category)
{
    var tmp = CategoryManager.getCategorys();
    // WebLibSimple.includes(tmp, category);
    // if (category in tmp) return true;

    for (var cat in tmp)
    {
        if (cat == category) return true;
    }

    return false;
};
