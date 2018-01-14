<?php

include("../../php/Elastic.php");

function delete($id)
{
    $url  = getBaseUrl() . $id . "?pretty";
    $curl = curl("DELETE", $url);

    $response = json_pretty($curl);
    callback_return($response);
}

function main()
{
    $id = $_GET[ "id" ];

    delete($id);
}

main();

?>
