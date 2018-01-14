AnimationManager = {};

AnimationManager.dimmerOff = function(object)
{
    var size = 0;

    object.style.display = "inline-block";

    var run = function()
    {
        size += 20;
        var position = WebLibSimple.circ(size / 100);

        object.style.opacity = position;

        if (position < 1)
        {
            setTimeout(run, 25);
        }
    };

    run();
};

AnimationManager.dimmerOn = function(object)
{
    // var div = WebLibSimple.createDiv(0, 0, 0, 0, null, object);

    var size = 0;

    var run = function()
    {
        size += 20;
        var position = WebLibSimple.circ(size / 100);

        object.style.opacity = 1.0 - position;

        if (position < 1)
        {
            setTimeout(run, 25);
        }
        else
        {
            object.style.display = "none";
        }
    };

    run();
};
