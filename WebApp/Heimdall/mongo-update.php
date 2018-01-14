<?php

include("../../php/Mongo.php");

function main()
{
    // $userId = $argv[ 1 ];
    // $userId = "patrick";

    $userId = $_GET[ "userId" ];
    $json   = json_dec($_GET[ "json" ]);

    $id = $json[ "id" ];
    unset($json[ "id" ]);

    $server = getServer();
    $m = new MongoClient("mongodb://$server");

    $db = $m->Calendar;
    $collection = $db->selectCollection($userId);

    $query = array();
    $query[ "_id" ] = new MongoId($id);

    $cursor = $collection->update($query, $json);

    $stringId = "\"" . $id . "\"";

    callback_return($stringId);

    $m->close();
}

main();

?>
