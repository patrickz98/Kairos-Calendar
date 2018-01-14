App = {};

App.createAnyAppend = function(type, parent)
{
    var div = document.createElement(type);
    parent.appendChild(div);

    return div;
}

App.div = function(left, top, right, bottom, parent)
{
    var div = App.createAnyAppend("div", parent);

    // if (left typeof number)

}

App.main = function()
{
    var topDiv = document.body;
    console.log("Hello World!");
    console.log(typeof 123);
    console.log(typeof 123 == "number");
}
