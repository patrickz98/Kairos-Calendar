Dialogue = {};

Dialogue.nuke = function()
{
    NativeInterface.back = Dialogue.lastBack;
    WebLibSimple.nuke(Dialogue.dimmerDiv);
};

Dialogue.sureDialogue = function(okEvent, message)
{
    var div = Dialogue.init();

    var text = WebLibSimple.createDiv(0, 0, 0, "50%", null, div);
    text.innerHTML = StringManager.locale.Delete + ": " + message + "?";

    var buttons = WebLibSimple.createDiv(0, "50%", 0, 0, null, div);

    var ok = WebLibSimple.createDiv("50%", 0, 0, 0, null, buttons);
    ok.style.color = GlobalConf.headlineColor;
    ok.innerHTML = "OK";

    ok.onclick = function()
    {
        Dialogue.nuke();
        okEvent();
    };

    var cancle = WebLibSimple.createDiv(0, 0, "50%", 0, null, buttons);
    cancle.innerHTML = StringManager.locale.cancle;
    cancle.onclick   = Dialogue.nuke;

    Dialogue.lastBack = NativeInterface.back;
    NativeInterface.back = Dialogue.nuke;

    StdDesign.dimmerTouch(ok);
    StdDesign.dimmerTouch(cancle);
};

Dialogue.init = function()
{
    var dimmerDiv = WebLibSimple.createDiv(0, 0, 0, 0, null, Main.toptopDiv);

    Dialogue.dimmerDiv = dimmerDiv;

    WebLibSimple.setBGColor(dimmerDiv, "#8c000000");

    // var dialogue = WebLibSimple.createDiv("20%", "40%", "20%", "40%", null, dimmerDiv);
    // dialogue.style.borderRadius = "20px";
    // dialogue.style.lineHeight = "70px";
    // dialogue.style.fontSize = "30px";
    // dialogue.style.color = "#3d3d3d";
    // dialogue.style.textAlign = "center";

    var center = WebLibSimple.createAnyAppend("center", dimmerDiv);
    var dialogue = WebLibSimple.createAnyAppend("div", center);
    dialogue.style.top = "40%";
    // dialogue.style.width = "600px";
    dialogue.style.left = "10%";
    dialogue.style.right = "10%";

    dialogue.style.height = "200px";
    dialogue.style.borderRadius = "20px";
    dialogue.style.lineHeight = "70px";
    dialogue.style.fontSize = "30px";
    dialogue.style.color = "#3d3d3d";
    dialogue.style.textAlign = "center";
    dialogue.style.position   = "absolute";

    WebLibSimple.setBGColor(dialogue, "#ffffff");

    return dialogue;
};

Dialogue.okDialogue = function(message)
{
    var div = Dialogue.init();

    var text = WebLibSimple.createDiv(0, 0, 0, "50%", null, div);
    text.innerHTML = message;

    var buttons = WebLibSimple.createDiv(0, "50%", 0, 0, null, div);

    var ok = WebLibSimple.createDiv("50%", 0, 0, 0, null, buttons);
    // ok.style.color = "#002fa7";
    ok.style.color = GlobalConf.headlineColor;
    ok.onclick = Dialogue.nuke;
    ok.innerHTML = "OK";

    NativeInterface.back = Dialogue.nuke;

    StdDesign.dimmerTouch(ok);
};
