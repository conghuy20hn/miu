<?php

namespace backend\controllers;

use backend\components\common\Utility;
use common\helpers\Helpers;
use xj\uploadify\UploadAction;
use Yii;

class UploadController extends AppController {

    public $video = 'video';

    public function actions() {
        return [
            'video-upload' => [
                'class' => UploadAction::className(),
                'basePath' => Utility::getBasePathUpload('video'),
                'baseUrl' => Yii::$app->params['upload']['baseUrl'],
                'enableCsrf' => true, // default
                'postFieldName' => 'Filedata', // default
                //BEGIN METHOD
                'format' => [$this, 'methodName'],
                //END METHOD
                //BEGIN CLOSURE BY-HASH
                'overwriteIfExist' => true,
                'format' => function (UploadAction $action) {
            $fileext = $action->uploadfile->getExtension();
            $filename = sha1_file($action->uploadfile->tempName);
            return "{$filename}.{$fileext}";
        },
                //END CLOSURE BY-HASH
                //BEGIN CLOSURE BY TIME
                'format' => function (UploadAction $action) {
            $fileext = $action->uploadfile->getExtension();
            //$filehash = sha1(uniqid() . time());
            //$p1 = substr($filehash, 0, 2);
            //$p2 = substr($filehash, 2, 2);
            $filehash = Helpers::generateStructurePath();
            return "{$filehash}.{$fileext}";
        },
                //END CLOSURE BY TIME
                'validateOptions' => [
                    'extensions' => \Yii::$app->params['upload']['video']['extensions'],
                    'maxSize' => \Yii::$app->params['upload']['video']['maxSize'],
                ],
                'beforeValidate' => function (UploadAction $action) {
            
        },
                'afterValidate' => function (UploadAction $action) {
            
        },
                'beforeSave' => function (UploadAction $action) {
            
        },
                'afterSave' => function (UploadAction $action) {
            $action->output['fileUrl'] = $action->baseUrl . Yii::$app->params['upload']['video']['basePath'] . '/' . $action->getFilename();
            $action->output['filePath'] = Utility::getFilePathToSave($action->getSavePath(), 'video');
            $action->getFilename(); // "image/yyyymmddtimerand.jpg"
            $action->getWebUrl(); //  "baseUrl + filename, /upload/image/yyyymmddtimerand.jpg"
            $action->getSavePath(); // "/var/www/htdocs/upload/image/yyyymmddtimerand.jpg"
        },
            ],
        ];
    }

}
