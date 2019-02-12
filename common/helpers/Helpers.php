<?php

namespace common\helpers;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * author: Toanhv9
 */

use Yii;
use yii\helpers\HtmlPurifier;

class Helpers
{

    public static function getStrLen($str)
    {
        if (extension_loaded('mbstring')) {
            return mb_strlen($str, 'utf-8');
        }
        return strlen($str);
    }

    public static function convertPHPRegex($str)
    {
        return "/" . $str . "/";
    }

    public static function generateStructurePath($str = '')
    {
        $uniqueFileName = uniqid();
        $mash = 255;
        $hashCode = crc32($uniqueFileName);
        $firstDir = $hashCode & $mash;
        $firstDir = vsprintf("%02x", $firstDir);
        $secondDir = ($hashCode >> 8) & $mash;
        $secondDir = vsprintf("%02x", $secondDir);
        $thirdDir = ($hashCode >> 4) & $mash;
        $thirdDir = vsprintf("%02x", $thirdDir);
        return $firstDir . "/" . $secondDir . "/" . $thirdDir . '/' . uniqid($str);
    }

    public static function removeJstag($str)
    {

        $stripArr = array(
            'script', 'onblur', 'onchange', 'alert', 'onclick', 'ondblclick', 'onfocus', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup', 'onselect', 'object', 'embed'
        );
        foreach ($stripArr as $tag) {
            $str = str_replace($tag, '', $str);
            $tag = strtoupper($tag);
            $str = str_replace($tag, '', $str);
        }
        return $str;
    }

    public static function getOnlyMediaImage($path)
    {
        return Yii::$app->params['media_path'] . $path;
    }

    public static function safeInput($input)
    {
        if (!is_array($input)) {
            $p = new HtmlPurifier();
            if (preg_match('/^[0-9]*$/', $input)) {
                return intval($input);
            } else {
                return $p->process($input);
            }
        } else {
            foreach ($input as &$item) {
                $item = Helpers::safeInput($item);
            }
        }
        return $input;
    }

    /*
     * KhanhNQ16
     */

    public static function textCompare($t1, $t2)
    {
        similar_text($t1, $t2, $per);
        return $per;
    }

    /**
     * KhanhNQ16
     * @param $phoneNumber
     * @return bool
     */
    public static function checkViettelPhoneNumber($phoneNumber)
    {
        $phoneNumber = trim($phoneNumber);
        if (substr($phoneNumber, 0, 1) == '+') {
            $phoneNumber = substr($phoneNumber, 1);
        }
        if (preg_match(\Yii::$app->params['viettel_phone_expression'], $phoneNumber)) {
            return true;
        }
        return false;
    }

    /**
     * Kiem tra moi gia tri mang $childArray co thuoc mang $parentArray ko?
     * @param $childArray
     * @param $parentArray
     * @return bool
     */
    public static function checkChildArray($childArray, $parentArray)
    {
        foreach ($childArray as $child) {
            if (!in_array($child, $parentArray)) {
                return false;
            }
        }
        return true;
    }

    public static function moneyFormat($money, $delimiter = '.')
    {
        $return = '';
        $len = strlen($money);
        while ($len > 3) {
            if ($return == '') {
                $return = substr($money, $len - 3);
            } else {
                $return = substr($money, $len - 3) . $delimiter . $return;
            }
            $money = substr($money, 0, $len - 3);
            $len = strlen($money);
        }
        return $money . $delimiter . $return;
    }

    public static function getFirstWordSingerByAlias($alias)
    {
        $alias = trim($alias);
        $alias = trim($alias, '"');
        $alias = trim($alias, "'");
        if ($alias) {
            $first = substr(static::vi2en($alias), 0, 1);
            if (preg_match('/[A-Za-z]/', $first)) {
                return strtoupper($first);
            }
        }
        return '#';
    }

    public static function vi2en($str)
    {
        return str_replace(RemoveSign::$hasSign, RemoveSign::$noSignOnly, $str);
    }

    public static function getArrayColumn($array, $column_name)
    {
        if (!function_exists("array_column")) {
            return array_map(function ($element) use ($column_name) {
                return $element[$column_name];
            }, $array);
        }
        return array_column($array, $column_name);
    }

    /**
     * huync2: kiem tra ky tu co o cuoi chuoi hay ko
     * @param $haystack
     * @param $needle
     * @return bool
     */
    public static function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }
        return (substr($haystack, -$length) === $needle);
    }

    /**
     * huync2
     * @param $s
     * @param $e
     * @return mixed
     */
    public static function preLikeQuery($s, $e = "|")
    {
        return str_replace(array($e, '_', '%'), array($e . $e, $e . '_', $e . '%'), $s);
    }
}
