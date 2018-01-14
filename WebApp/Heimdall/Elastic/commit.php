<?php

include("../../php/Elastic.php");

function commit($userId, $json)
{
    $json = json_dec($json);

    $id = $json[ "id" ];
    unset($json[ "id" ]);

    $json[ "user-id" ] = $userId;

    $json = json_pretty($json);

    $url  = getBaseUrl() . $id . "?pretty";

    $curl = curl("POST", $url, $json);

    $response = json_pretty($curl);
    callback_return($response);
}

function main()
{
    $json   = $_GET[  "json"  ];
    $userId = $_GET[ "userId" ];

    commit($userId, $json);
}

main();
?>
