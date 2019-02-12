<?php

namespace backend\components\common;

use Yii;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Utility {

    public static function getFilePathToSave($filePath, $type) {
        if (is_file($filePath)) {
            $config = Yii::$app->params['upload'][$type]['basePath'];
            $file = explode($config, $filePath);
            return $config . $file[1];
        }
        return '';
    }

    public static function getBasePathUpload($type) {
        return Yii::$app->params['upload']['basePath'] . Yii::$app->params['upload'][$type]['basePath'];
    }

}
