<?php

include("./Mongo.php");

function collectInfo()
{
    date_default_timezone_set("UTC");

    $m = new MongoClient("mongodb://" . getServer());

    $db = $m->Calendar;
    $collection = $db->getCollectionNames();

    $userCount = count($collection);

    $user = 42000;
    $price = 3.99;

    $count = 0;

    foreach ($collection as $coll => $value)
    {
        printf("%-9s\r", $value);

        $select = $db->selectCollection($value);
        $count = $count + $select->count();
    }

    $m->close();

    // echo date("c") . "\n";
    // echo "--> Goal:     " . $user . "\n";
    // echo "--> Count:    " . $userCount . "\n";
    // echo "--> Percent:  " . round(($userCount / $user) * 100, 2) . "%\n";
    // echo "--> Euro:     " . ($userCount * $price * 0.58) . "€\n";
    // echo "--> userDocs: " . ($user * 365 * 3) . "\n";
    // echo "--> Docs:     " . $count . "\n";

    $result = array();

    $result[ "date"       ] = date("c");
    $result[ "user goal"  ] = $user;
    $result[ "user count" ] = $userCount;
    $result[ "doc goal"   ] = ($user * 365 * 3);
    $result[ "doc count"  ] = $count;
    $result[ "done"       ] = round(($userCount / $user) * 100, 2) . "%";
    $result[ "profite"    ] = ($userCount * $price * 0.58) . "€";

    return $result;
}

function main()
{
    $json = collectInfo();

    echo "\n";
    // echo json_pretty($json) . "\n";

    foreach ($json as $key => $value)
    {
        printf("%-11s    %s\n", $key . ":", $value);
    }
}

main();

?>
