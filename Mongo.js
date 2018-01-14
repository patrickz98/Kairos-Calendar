Mongo = {};

// Elastic.baseUrl = "http://patrick-macbook.local/Calendar/";
Mongo.baseUrl = "/Calendar/Heimdall/";

Mongo.log = function(response)
{
    console.log("--> Mongo.log: " + JSON.stringify(response));
}

Mongo.getData = function(url, callback)
{
    var script = WebLibSimple.createAnyAppend("script", document.body);
    script.src = url + "&callback=" + callback;

    console.log("Mongo: " + script.src);
}

Mongo.getAll = function(userId, callback)
{
    // var src = Mongo.baseUrl + "mongo-dump.php?userId=" + userId;
    // Mongo.getData(src, callback);

    if (Main.isMobile)
    callback(Android.events());
}

//
// decrypt
//
// Mongo.getById = function(userId, id, callback)
// {
//     var src = Mongo.baseUrl + "mongo-dump-id.php?userId=" + userId + "&id=" + id;
//     Mongo.getData(src, callback);
// }

Mongo.call_callback = function(id)
{
    console.log("id: " + id);
    Mongo.callback(id);
}

//
// encrypt
//
Mongo.commit = function(json, callback)
{
    // Mongo.callback = callback;
    //
    // var userId = GlobalConf.userId;
    // var json = JSON.stringify(json);
    //
    // var url = Mongo.baseUrl + "mongo-commit.php?" + "userId=" + userId + "&json=" + json;
    //
    // Mongo.getData(url, "Mongo.call_callback");

    var json = JSON.stringify(json);
    Android.add(json);
}

//
// encrypt
//
Mongo.update = function(json, callback)
{
    // Mongo.callback = callback;
    //
    // var userId = GlobalConf.userId;
    // var json = JSON.stringify(json);

    // var url = Mongo.baseUrl + "mongo-update.php?" + "userId=" + userId + "&json=" + json;
    //
    // Mongo.getData(url, "Mongo.call_callback");

    var id = json.id;
    var json = JSON.stringify(json);
    Android.commit(id, json);
}

Mongo.delete = function(id)
{
    // var userId = GlobalConf.userId;
    // var url = Mongo.baseUrl + "mongo-delete.php?" + "userId=" + userId + "&id=" + id;
    //
    // Mongo.getData(url, "Mongo.log");

    Android.delete(id);
}
