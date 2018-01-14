<?php

header("Content-Type: application/json");

function getServer()
{
    // $server = "patrick-debian.local";
    // $server = "patrick-macbook.local";
    // $server = "odroid-ubuntu-x2.local";
    $server = "localhost";

    return $server;
}

function callback_return($data)
{
    $callback = $_GET[ "callback" ];

    if (isset($callback))
    {
        echo $callback . "(" . $data . ");";
    }
    else
    {
        echo $data . "\n";
    }
}

function json_pretty($json)
{
    return json_encode($json, JSON_PRETTY_PRINT);
}

function json_dec($json)
{
    return json_decode($json, true);
}

?>
