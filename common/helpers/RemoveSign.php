<?php

namespace common\helpers;

/**
 * Created by PhpStorm.
 * User: khanhnq16
 * Date: 17-Oct-15
 * Time: 2:54 PM
 */
class RemoveSign {

    public static $hasSign = array(
        "à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ",
        "è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ",
        "ì", "í", "ị", "ỉ", "ĩ",
        "ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ",
        "ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ",
        "ỳ", "ý", "ỵ", "ỷ", "ỹ",
        "đ",
        "À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă", "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ",
        "È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ",
        "Ì", "Í", "Ị", "Ỉ", "Ĩ",
        "Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ", "Ờ", "Ớ", "Ợ", "Ở", "Ỡ",
        "Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ",
        "Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ",
        "Đ",
    );
    public static $noSign = array(
        "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
        "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
        "i", "i", "i", "i", "i",
        "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
        "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
        "y", "y", "y", "y", "y",
        "d",
        "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
        "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
        "i", "i", "i", "i", "i",
        "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
        "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
        "y", "y", "y", "y", "y",
        "d");
    public static $noSignOnly = array(
        "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
        "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
        "i", "i", "i", "i", "i",
        "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
        "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
        "y", "y", "y", "y", "y",
        "d",
        "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A",
        "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
        "I", "I", "I", "I", "I",
        "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O",
        "U", "U", "U", "U", "U", "U", "U", "U", "U", "U", "U",
        "Y", "Y", "Y", "Y", "Y",
        "D");

    public static function createTokenCsrf() {
        echo $_SERVER['SERVER_NAME'];
        die();
//        $domain = $_SERVER['SERVER_NAME'];
        $domain = \Yii::$app->params['server_name'];
        $cookies = \Yii::$app->response->cookies;
        $cookies->add(new \yii\web\Cookie([
            'name' => 'sToken',
            'value' => uniqid(rand(), true),
            'domain' => $domain
        ]));

//        \Yii::$app->response->setCookie('sToken', uniqid(rand(), true), NULL, "/", $domain
//            sfConfig::get("app_main_domain", "localhost")
    }

    /**
     * KhanhNQ16 - 17/10/2015
     * @param $msisdn
     */
    public static function convertMsisdn($msisdn, $type = 'simple') {
        if ($msisdn != "") {
            switch ($type) {
                case 'simple':
                    if ($msisdn[0] == '0') {
                        while ($msisdn[0] == '0') {
                            $msisdn = substr($msisdn, 1);
                        }
                        return $msisdn;
                    } else if ($msisdn[0] . $msisdn[1] == '84')
                        return substr($msisdn, 2);
                    else
                        return $msisdn;
                    break;
                case '84':
                    if ($msisdn[0] == '0') {
                        while ($msisdn[0] == '0') {
                            $msisdn = substr($msisdn, 1);
                        }
                        return '84' . $msisdn;
                    } else if ($msisdn[0] . $msisdn[1] != '84')
                        return '84' . $msisdn;
                    else
                        return $msisdn;
                    break;

                default:
                    if ($msisdn[0] == '0') {
                        while ($msisdn[0] == '0') {
                            $msisdn = substr($msisdn, 1);
                        }
                        return '84' . $msisdn;
                    } else if ($msisdn[0] . $msisdn[1] != '84')
                        return '84' . $msisdn;
                    else
                        return $msisdn;
                    break;
            }
        }
    }

    /**
     * KhanhNQ16
     * @param $str
     * @return string
     */
    public static function removeSign($str) {
        //Sign
        $str = str_replace(self::$hasSign, self::$noSign, $str);
        //Special string
        $spcStr = "/[^A-Za-z0-9]+/";
        $str = preg_replace($spcStr, ' ', $str);
        $str = trim($str);
        //Space
//        $str = preg_replace("/( )+/", '-', $str);
        return strtolower($str);
    }

    public static function removeSignAndSpace($str) {
        //Sign
        $str = str_replace(self::$hasSign, self::$noSign, $str);
        //Special string
        $spcStr = "/[^A-Za-z0-9]+/";
        $str = preg_replace($spcStr, ' ', $str);
        $str = trim($str);
        //Space
        $str = preg_replace("/( )+/", '-', $str);
        return strtolower($str);
    }

    public static function name2slug($str, $id = 0) {
        //Sign
        $str = str_replace(self::$hasSign, self::$noSign, $str);
        //Special string
        $spcStr = "/[^A-Za-z0-9]+/";
        $str = preg_replace($spcStr, ' ', $str);
        $str = trim($str);
        //Space
        $str = preg_replace("/( )+/", '-', $str);
        if ($id) {
            return $id . '-' . strtolower($str);
        }
        return strtolower($str);
    }

}
