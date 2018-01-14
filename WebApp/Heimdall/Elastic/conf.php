<?php

// include("../../php/Elastic.php");

function getConf($userId)
{
    $url = "http://" . getServer() . ":9200/calendar/userConf/" . $userId;

    $curl = curl("GET", $url);

    $reslut = json_encode($curl[ "_source" ][ "categorys" ]);

    // echo $url . "\n";
    // echo $curl . "\n";
    // echo $reslut . "\n";

    return $reslut;
}

function main()
{
    $userId = $_GET[ "userId" ];
    getConf($userId);
}

// main();

?>
