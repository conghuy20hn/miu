<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 30-Dec-15
 * Time: 16:20
 */

$BASE_URL = "http://www.google.com.vn";
$yql_query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Hanoi, VN")';
$yql_query_url = $BASE_URL . "?q=" . urlencode($yql_query) . "&format=json";
// Make call with cURL
$out = '';
$session = curl_init($BASE_URL);
curl_setopt($session, CURLOPT_VERBOSE, 1);
curl_setopt($session, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($session, CURLOPT_STDERR, $out);
curl_setopt($session, CURLOPT_PROXY, "192.168.193.12");
curl_setopt($session, CURLOPT_PROXYPORT, 3128);
curl_setopt($session, CURLOPT_SSL_VERIFYPEER, 0);
$json = curl_exec($session);
var_dump($out);
die;
// Convert JSON to PHP object
$phpObj = json_decode($json);