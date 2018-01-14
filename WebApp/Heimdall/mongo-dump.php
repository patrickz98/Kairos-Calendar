<?php

include("../../php/Mongo.php");

function main()
{
    // $userId = $argv[ 1 ];
    // $userId = "patrick";
    // $userId = "user36363";
    $userId = $_GET[ "userId" ];

    $server = getServer();
    $m = new MongoClient("mongodb://$server");

    $db = $m->Calendar;
    $collection = $db->selectCollection($userId);
    $cursor = $collection->find();

    $json = array();

    foreach ($cursor as $doc)
    {
        $doc[ "id" ] = $doc[ "_id" ]->{'$id'};

        unset($doc[  "_id"   ]);
        unset($doc[ "userId" ]);

        array_push($json, $doc);
    }

    $data = json_pretty($json);
    // $data = json_encode($json);

    $m->close();

    callback_return($data);
}

main();

?>
