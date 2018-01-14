<?php

include("./Mongo.php");

$time_start = microtime(true);

$userId = $argv[ 1 ];

$m = new MongoClient("mongodb://" . getServer());

$db = $m->Calendar;
$collection = $db->selectCollection($userId);


// $query = array("user-id" => $userId);
// $cursor = $collection->find($query);
$cursor = $collection->find();
// echo "Count: " . $collection->count($query) . "\n";
// echo "Count: " . $collection->count() . "\n";

$time_end = microtime(true);
$time = $time_end - $time_start;

$count = 0;

foreach ($cursor as $doc)
{
    // json_encode($doc, JSON_PRETTY_PRINT);
    // echo json_encode($doc) . "\r";
    $count++;
}

echo "Count: " . $count . "\n";
echo "Done $time\n";

?>
