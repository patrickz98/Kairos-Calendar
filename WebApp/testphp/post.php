<?php

function json_dec($json)
{
    return json_decode($json, true);
}

function json_pretty($json)
{
    return json_encode($json, JSON_PRETTY_PRINT);
}

function main()
{
    $data = json_dec($_POST[ "data" ]);
    echo json_pretty($data) . "\n";

    $mongo = new MongoClient("mongodb://localhost");

    $database = $mongo->selectDB("Calendar");
    $collection = $database->selectCollection("events");

    foreach ($data as $index => $json)
    {
        $collection->insert($json);
    }

    $mongo->close();

    echo "Done.\n";
}

main();
?>
