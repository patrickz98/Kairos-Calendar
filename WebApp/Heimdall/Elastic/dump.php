<?php

include("../../php/Elastic.php");

function queryIncludedMonth(&$query, $gte, $lte)
{
    $range = array();
    $range[ "range" ] = array();
    $range[ "range" ][ "Start" ] = array();
    $range[ "range" ][ "Start" ][ "gte"    ] = $gte;
    $range[ "range" ][ "Start" ][ "lte"    ] = $lte;
    $range[ "range" ][ "Start" ][ "format" ] = "dd.MM.yyyy";

    array_push($query, $range);

    $range = array();
    $range[ "range" ] = array();
    $range[ "range" ][ "End" ] = array();
    $range[ "range" ][ "End" ][ "gte"    ] = $gte;
    $range[ "range" ][ "End" ][ "lte"    ] = $lte;
    $range[ "range" ][ "End" ][ "format" ] = "dd.MM.yyyy";

    array_push($query, $range);
}

function queryOverlapMonth(&$query, $gte, $lte)
{
    $range = array();
    $range[ "range" ] = array();
    $range[ "range" ][ "Start" ] = array();
    $range[ "range" ][ "Start" ][ "lte"    ] = $gte;
    $range[ "range" ][ "Start" ][ "format" ] = "dd.MM.yyyy";

    array_push($query, $range);

    $range = array();
    $range[ "range" ] = array();
    $range[ "range" ][ "End" ] = array();
    $range[ "range" ][ "End" ][ "gte"    ] = $lte;
    $range[ "range" ][ "End" ][ "format" ] = "dd.MM.yyyy";

    array_push($query, $range);
}

function queryDateRange($userId, $month, $year)
{
    $gte = "01.$month.$year";

    $lte_month = $month + 1;
    $lte_year  = $year;

    if ($lte_month > 12)
    {
        $lte_month = 1;
        $lte_year = $year + 1;
    }

    $lte = "01.$lte_month.$lte_year";

    if ($month     < 10) $gte = "01.0$month.$year";
    if ($lte_month < 10) $lte = "01.0$lte_month.$lte_year";

    $query = array();
    $query[ "from"  ] = 0;
    $query[ "size"  ] = 1000;
    $query[ "query" ] = array();

    $query[ "query" ][ "filtered" ] = array();
    $query[ "query" ][ "filtered" ][ "query" ] = array();
    $query[ "query" ][ "filtered" ][ "query" ][ "term" ] = array();
    $query[ "query" ][ "filtered" ][ "query" ][ "term" ][ "user-id" ] = $userId;

    $query[ "query" ][ "filtered" ][ "filter" ] = array();
    $query[ "query" ][ "filtered" ][ "filter" ][ "or" ] = array();

    $opt = array();
    $opt[ "or" ] = array();
    queryIncludedMonth($opt[ "or" ], $gte, $lte);
    array_push($query[ "query" ][ "filtered" ][ "filter" ][ "or" ], $opt);

    $opt = array();
    $opt[ "and" ] = array();
    queryOverlapMonth($opt[ "and" ], $gte, $lte);
    array_push($query[ "query" ][ "filtered" ][ "filter" ][ "or" ], $opt);

    $json = json_pretty($query);

    // echo $json . "\n";

    return $json;
}

function extractSource($data)
{
    $json = $data[ "_source" ];
    $json[ "id" ] = $data[ "_id" ];

    unset($json[ "user-id" ]);

    return $json;
}

function filter($data)
{
    $data = $data[ "hits" ][ "hits" ];

    $result = array();

    foreach($data as $key => $hits)
    {
        array_push($result, extractSource($hits));
    }

    return $result;
}

function searchDateRange($userId, $month, $year)
{
    $url = getBaseUrl() . "_search?pretty";
    $query = queryDateRange($userId, $month, $year);

    $curl = curl("GET", $url, $query);
    $data = filter($curl);

    $reslut = json_pretty($data);
    callback_return($reslut);
}

function main()
{
    $userId = $_GET[ "userId" ];
    $month  = $_GET[ "m" ];
    $year   = $_GET[ "y" ];

    // echo queryDateRange($userId, $month, $year) . "\n";

    searchDateRange($userId, $month, $year);
}

main();
// echo queryDateRange("user10972", 7, 2016) . "\n";
// searchDateRange($userId, $month, $year);
?>
