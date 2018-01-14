<?php

include("../../php/Mongo.php");

function main()
{
    $userId = $_GET[ "userId" ];
    $id     = $_GET[   "id"   ];

    $server = getServer();
    $m = new MongoClient("mongodb://$server");

    $db = $m->Calendar;
    $collection = $db->selectCollection($userId);

    $query = array();
    $query[ "_id" ] = new MongoId($id);

    $json = $collection->findOne($query);

    unset($json[  "_id"   ]);
    unset($json[ "userId" ]);

    $data = json_pretty($json);
    // $data = json_encode($json);

    $m->close();

    callback_return($data);
}

main();

?>
