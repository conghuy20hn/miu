<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/20/2015
 * Time: 1:45 PM
 */

namespace api\libs;

use Yii;
use yii\base\Exception;

class ApiHelper {

    static function formatResponse($errCode, $content = [], $message = null) {
        if (!$message) {
            $message = ApiResponseCode::getMessage($errCode);
        }
        if (!$message) {
            return self::errorResponse();
        }
        return [
            'errorCode' => $errCode,
            'message' => $message,
            'data' => $content,
        ];
    }

    static function errorResponse() {
        return [
            'errorCode' => ApiResponseCode::UNKNOWN,
            'message' => ApiResponseCode::getMessage(ApiResponseCode::UNKNOWN),
            'data' => [],
        ];
    }

    static function insertArrayIndex($array, $new_element, $index) {
        /*         * * get the start of the array ** */
        $start = array_slice($array, 0, $index);
        /*         * * get the end of the array ** */
        $end = array_slice($array, $index);
        /*         * * add the new element to the array ** */
        $start[] = $new_element;
        /*         * * glue them back together and return ** */
        return array_merge($start, $end);
    }

    static function imagePath($path, $type = "album") {
        try {
            if (strlen($path) == 0) {
                return Yii::$app->params[$type . '_default_media_path'];
            } else {
                $filename = Yii::$app->params['upload_path'] . $path;
                if (is_file($filename)) {
                    return Yii::$app->params['media_path'] . $path;
                } else {
                    return Yii::$app->params[$type . '_default_media_path'];
                }
            }
        } catch (Exception $e) {
            return Yii::$app->params[$type . '_default_media_path'];
        }
    }

}
