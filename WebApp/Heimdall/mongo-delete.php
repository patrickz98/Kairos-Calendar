<?php

include("../../php/Mongo.php");

function main()
{
    // $userId = $argv[ 1 ];
    // $userId = "patrick";
    $userId = $_GET[ "userId" ];
    $id     = $_GET[   "id"   ];

    $server = getServer();
    $m = new MongoClient("mongodb://$server");

    $db = $m->Calendar;
    $collection = $db->selectCollection($userId);

    $query = array();
    $query[ "_id" ] = new MongoId($id);

    $cursor = $collection->remove($query);

    $data = json_pretty($cursor);
    callback_return($data);

    $m->close();
}

main();

?>
