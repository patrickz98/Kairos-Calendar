<?php

header("Content-Type: application/json");

function callback_return($data)
{
    $callback = $_GET[ "callback" ];

    if (isset($callback))
    {
        echo $callback . "(" . $data . ");";
    }
    else
    {
        echo $data . "\n";
    }
}

function json_pretty($json)
{
    return json_encode($json, JSON_PRETTY_PRINT);
}

function json_dec($json)
{
    return json_decode($json, true);
}

function events($database, $ids)
{
    $collection = $database->selectCollection("events");

    $query = array("_id" => array("\$in" => $ids));
    $cursor = $collection->find($query);
    // $cursor = $collection->find();

    $count = 0;

    $json = array();

    foreach ($cursor as $doc)
    {
        $tmp = $doc;
        $tmpId = $doc[ "_id" ];

        unset($tmp[ "_id" ]);

        $tmp[ "id" ] = $tmpId;

        array_push($json, $tmp);
        // echo json_encode($doc) . "\n";
        // echo $doc[ "_id" ] . "\n";
        // $count++;
        // if ($count > 200) break;
    }

    // echo json_pretty($json) . "\n";
    // callback_return("\"" . json_pretty($json) . "\"");
    // callback_return(json_pretty($json));

    return $json;
}

function userConfig($database)
{
    $collection = $database->selectCollection("userInfo");
    $query = array("_id" => "b1bc0af8-d2c0-4d6c-9513-7b70fecaabb9");
    $cursor = $collection->findOne($query);

    return $cursor;
}

function updateConfig($database)
{
    $collection = $database->selectCollection("userInfo");
    $query = array("_id" => "b1bc0af8-d2c0-4d6c-9513-7b70fecaabb9");
    $cursor = $collection->remove($query);

    $ids = array(
        "cf04fd81-89ff-414c-95d7-90efb063c644",
        "51742ebd-228a-460e-8570-6377d868f165",
        "8e5d0493-1434-453c-ae75-79e6ff63453c",
        "8d345549-f07b-44c0-83c2-e34dd5c943d9",
        "6ce8eda4-b4fe-491c-8d4d-f4676a6cb1e3",
        "7b81592d-e089-4685-bbab-5abaa2fe91e9",
        "d8c5f54c-d101-47c8-86ff-5a83febbaa55",
        "141966b1-f9e0-4ff1-b47a-becb902f91c8",
        "9c021867-1b1d-4666-b405-5aa8798a774b",
        "d5cf5d46-78d1-4247-b3b8-418070b37d7f",
        "4533a402-6799-49e6-b7ab-de0dadf40ec1",
        "a499a2d2-4346-4764-8be2-40707213a7b6",
        "ebba5a18-e844-4398-b2b2-a9d47bf0ff59",
        "02939adf-e3e4-43a5-8a2e-651d76c076eb",
        "7c59bc57-f03b-4302-97e8-6bda8c4c860f",
        "ace07dd1-c162-4407-96f7-4d6f12902e16",
        "a8f8272c-2c48-40f6-896a-36b0876ad50c",
        "b2fd2895-56c9-44aa-ad31-cb9a01606030",
        "1fca3ef5-852b-48c0-b143-68d81c77c315",
        "370ebb45-9891-4b19-8aeb-6f251fa11238",
        "516776c4-3319-463c-b247-3977f533b1bd",
        "cc8e4fc6-93d5-412e-93c4-2426a58ae51c",
        "8326900b-4c88-4788-8e58-b06f6a1ebb73",
        "c28ef43a-41b9-4234-8ee7-cc23f32dd466",
        "18e387de-83de-4a40-8fcf-97f9c67cbd7a",
        "c21d6670-9c45-41a5-a9ef-0e8cd1e7ce3b",
        "aea29584-2588-4245-8161-00f802811136",
        "d7a9a32a-6bac-405b-a45a-c169ce99d4e7",
        "d86fcb29-de25-4306-ab1b-05d1bd408107",
        "dd4c5474-6185-4b50-848d-9b23972bf6d9",
        "7e7aea33-e81f-4996-9608-ba8c7aa9e8d6",
        "18fc090c-46c3-40c8-8585-4d1ec3fecbb7",
        "f167c6ec-96f6-4c16-b7ae-01a596f190f8",
        "6cb6d8e8-1f70-40c5-8096-5016bfbb7d20",
        "9aa3aea3-a2d3-4cab-8f1c-d63ee7a4004a",
        "a796ad6f-75ae-4644-a2c5-529208189b64",
        "53fb6f1a-0cda-4e8f-bacd-2144d5fbdb4a",
        "f5938eb2-744d-419b-b889-a329af5df1da",
        "3a0f2c3f-001b-4916-9157-8c1ae8483224",
        "357ff839-7887-4bc2-89ea-5b029766a58c",
        "6fc3e73d-5555-409f-9ece-fc3abf40c0f9",
        "172a9f8e-3a8b-4bd2-84eb-42ece081fbe6"
    );

    // GlobalConf.defaultCategory = config.defaultCategory;
    // GlobalConf.categorys       = config.categorys;
    // GlobalConf.language        = config.language;
    // GlobalConf.weekStartDay    = parseInt(config.weekStartDay);
    // GlobalConf.dateFormat      = config.dateFormat;

    $config = array();
    $config[ "_id"             ] = "b1bc0af8-d2c0-4d6c-9513-7b70fecaabb9";
    $config[ "eventsIds"       ] = $ids;
    $config[ "defaultCategory" ] = array("name" => "Calendar", "color" => "#F83475");
    $config[ "categorys"       ] = array("School" => "#F83434", "Private" => "#3475F8");
    $config[ "language"        ] = "en";
    $config[ "weekStartDay"    ] = 1;
    $config[ "dateFormat"      ] = "DD.MM.YYYY";

    $cursor = $collection->insert($config);
}

function main()
{
    $mongo = new MongoClient("mongodb://localhost");
    $database = $mongo->selectDB("Calendar");

    updateConfig($database);

    $config = userConfig($database);

    $json = array();
    $json[ "events" ] = events($database, $config[ "eventsIds" ]);
    $json[ "userInfo" ] = $config;

    $mongo->close();

    // echo json_pretty($json) . "\n";
    callback_return(json_pretty($json));
}

main();

?>
