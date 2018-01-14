StringManager = {};

StringManager.getLocale = function()
{
    var language = null;

    if (navigator.languages != undefined)
    {
        language = navigator.languages[ 0 ];
    }

    language = navigator.language;

    return language.substring(0, 2).toLowerCase();
};

StringManager.init = function()
{
    var language = GlobalConf.language;

    console.log("language: " + language);

    StringManager.locale = locale_en;

    if (language == "en") StringManager.locale = locale_en;
    if (language == "de") StringManager.locale = locale_de;
    if (language == "es") StringManager.locale = locale_es;
    if (language == "fr") StringManager.locale = locale_fr;
};
