<?php

include("./Elastic.php");

function id()
{
    return uniqid();
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
    $opt = [ "Calendar", "School", "Privat", "Work" ];
    $index = rand(0, count($opt) - 1);

    return $opt[ $index ];
}

function randomJson($user_id)
{
    // $user_id = "user23920";
    $json = array();

    $json[ "user-id"   ] = $user_id;
    $json[ "Title"     ] = randomString(10);
    $json[ "Place"     ] = randomString(10);
    $json[ "Kind"      ] = randomKind();

    $start = randomDate();

    $json[ "All-Day"   ] = randomBool();
    $json[ "Start"     ] = strtotime($start) * 1000;
    $json[ "End"       ] = strtotime(addHours($start, rand(1, 5))) * 1000;
    $json[ "Repeat"    ] = null;
    $json[ "Available" ] = randomBool();
    $json[ "Notes"     ] = randomString(20);

    return json_pretty($json);
}

function main()
{
    $time_start = microtime(true);

    date_default_timezone_set("UTC");

    $url = getBaseUrl() . "?pretty";

    $count = 0;

    $userCount = 42000;
    $userJsons = 365 * 3;
    $all = $userCount * $userJsons;
    echo "--> Documents to create: " . $all . "\n";

    for ($inx = 0; $inx < $userCount; $inx++)
    {
        // $user_id = "user" . rand(0, $userCount);
        $user_id = "patrick";

        for ($iny = 0; $iny < $userJsons; $iny++)
        {
            $count = $count + 1;

            $done = ($inx * $userJsons) + $iny + 1;
            $percent = ($done / $all) * 100;

            $time_end = microtime(true);
            $time = $time_end - $time_start;

            printf("--> Docs: %d %%: %f Time: %ds\r", $done, $percent, $time);

            $json = randomJson($user_id);

            // echo "\n";
            // echo $json . "\n";
            // exit();
            //
            $curl = curl("POST", $url, $json);
            // exit();
        }
    }

    echo "\n";
}

main();
?>
