<?php
/**
 * Created by PhpStorm.
 * User: HUYNC2
 * Date: 12/27/2018
 * Time: 10:59 PM
 */
$password='abc@1234';
$hash='$2y$13$UW//tB2WNXmpCyPl5oPbCeeVecFmdAuVYCeOhndUGfcJgD73f5Msi';
$test = crypt($password, $hash);
var_dump($test);
$n = strlen($test);
if ($n !== 60) {
    return false;
}
$a= compareString($test, $hash);
var_dump($a);

function compareString($expected, $actual)
{
    $expected .= "\0";
    $actual .= "\0";
    $expectedLength = byteLength($expected);
    $actualLength = byteLength($actual);
    $diff = $expectedLength - $actualLength;
    for ($i = 0; $i < $actualLength; $i++) {
        $diff |= (ord($actual[$i]) ^ ord($expected[$i % $expectedLength]));
    }
    return $diff === 0;
}

function byteLength($string)
{
    return mb_strlen($string, '8bit');
}
?>