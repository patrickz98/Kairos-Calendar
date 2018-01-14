<?php

include("../../php/Mongo.php");

function main()
{
    // $userId = $argv[ 1 ];
    // $userId = "patrick";

    $userId = $_GET[ "userId" ];
    $json   = $_GET[  "json"  ];

    $server = getServer();
    $m = new MongoClient("mongodb://$server");

    $db = $m->Calendar;
    $collection = $db->selectCollection($userId);

    $newData = json_dec($json);

    $id = new MongoId();
    $newData[ "_id" ] = $id;

    $cursor = $collection->insert($newData);

    $stringId = "\"" . $id . "\"";

    callback_return($stringId);

    $m->close();
}

main();

?>
