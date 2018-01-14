<?php

header("Content-Type: application/json");

function getServer()
{
    // $server = "odroid-ubuntu.local";
    // $server = "localhost";
    $server = "odroid-ubuntu-x2.local";

    return $server;
}

function getBaseUrl()
{
    $url = "http://" . getServer() . ":9200/calendar/test/";

    return $url;
}

function curl($protocol, $url, $json = null)
{
    $chlead = curl_init();

    curl_setopt($chlead, CURLOPT_URL, $url);
    curl_setopt($chlead, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chlead, CURLOPT_CUSTOMREQUEST, $protocol);

    if ($json != null)
    {
        curl_setopt($chlead, CURLOPT_POSTFIELDS, $json);
    }

    $chleadresult = curl_exec($chlead);
    $chleadapierr = curl_errno($chlead);
    $chleaderrmsg = curl_error($chlead);
    curl_close($chlead);

    // echo $chleadresult;
    // echo $chleadapierr;
    // echo $chleaderrmsg;

    return json_decode($chleadresult, true);
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
