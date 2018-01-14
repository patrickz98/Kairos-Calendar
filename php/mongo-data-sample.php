<?php

include("./Mongo.php");

function id()
{
    return uniqid();
}

function gen_uuid()
{
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

function randomString($length = 10)
{
    $characters = "aaaaabcdeeeeeeefghiiiiiiiiiiiijklmnnnnnnnnnopqrrrsssstttuvwxyz";
    $charactersLength = strlen($characters);
    $randomString = "";

    for ($inx = 0; $inx < $length; $inx++)
    {
        $index = rand(0, $charactersLength - 1);
        $randomString .= $characters[ $index ];
    }

    return $randomString;
}

function randomBool()
{
    $rand = rand(0, 1);

    if ($rand == 0)
    {
        return false;
    }
    else
    {
        return true;
    }
}

function randomDate()
{
    $hour = rand(0, 23);
    $min  = rand(0, 59);

    $year  = rand(2010, 2020);
    $month = rand(1, 12);
    $day   = rand(1, 29);

    // mktime([ int $hour = date("H") [, int $minute = date("i") [, int $second = date("s") [, int $month = date("n") [, int $day = date("j") [, int $year = date("Y")
    $date = mktime($hour, $min, 0, $month, $day, $year);

    // return date("Y-m-dTH:i:s", $date);
    return date(DATE_ISO8601, $date);
}

function addHours($date, $hours)
{
    $date = new DateTime($date);
    $date->modify("+$hours hours");

    // return date_format($date, "Y-m-dTH:i:s");
    return $date->format(DateTime::ISO8601);
}

function randomKind()
{
    $opt = [ "Calendar", "School", "Private" ];
    $index = rand(0, count($opt) - 1);

    return $opt[ $index ];
}

function randomJson()
{
    // $user_id = "user23920";
    $json = array();

    // $json[ "userId"    ] = $user_id;
    $json[ "Title"     ] = randomString(10);
    $json[ "Place"     ] = randomString(10);
    $json[ "Kind"      ] = randomKind();

    $start = randomDate();

    $json[ "All-Day"   ] = randomBool();
    $json[ "Start"     ] = strtotime($start) * 1000;
    $json[ "End"       ] = strtotime(addHours($start, rand(1, 5))) * 1000;
    $json[ "Available" ] = randomBool();
    $json[ "Notes"     ] = randomString(20);
    $json[ "Priority"  ] = rand(0, 10);
    $json[ "_id"       ] = gen_uuid();

    return $json;
}

function main()
{
    // connect
    // $m = new MongoDB\Driver\Manager("mongodb://patrick-macbook.local");
    // $m = new MongoClient("mongodb://patrick-debian.local");
    $m = new MongoClient("mongodb://" . getServer());
    // $m = new Mongo("mongodb://patrick-debian.local");

    // select a database
    $db = $m->Calendar;

    // select a collection (analogous to a relational database's table)

    $time_start = microtime(true);

    date_default_timezone_set("UTC");

    $count = 0;

    $userCount = 42000;
    $userJsons = 365 * 3;
    $all = $userCount * $userJsons;
    echo "--> Documents to create: " . $all . "\n";

    for ($inx = 0; $inx < $userCount; $inx++)
    {
        // $user_id = "user" . rand(0, $userCount);
        // $user_id = "patrick";
        // $user_id = "test";

        $collection = $db->selectCollection("events");

        for ($iny = 0; $iny < $userJsons; $iny++)
        {
            $count = $count + 1;

            $done = ($inx * $userJsons) + $iny + 1;
            $percent = ($done / $all) * 100;

            $time_end = microtime(true);
            $time = $time_end - $time_start;

            printf("--> Docs: %d (%.4f%%) Time: %ds\r", $done, $percent, $time);

            $document = randomJson();

            $collection->insert($document);
        }
        //
        echo "\n";
        exit();
    }

    $a->close();

    echo "\n";
}

main();
?>
