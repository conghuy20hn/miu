<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 8/10/2015
 * Time: 4:29 PM
 */

namespace backend\controllers;

use backend\models\ProductItems;
use Yii;
use yii\web\Controller;
use zxbodya\yii2\galleryManager\GalleryManagerAction;

class AppController extends Controller {

    public function beforeAction($action) {
        if (Yii::$app->session->has('lang')) {
            Yii::$app->language = Yii::$app->session->get('lang');
        } else {
            //or you may want to set lang session, this is just a sample
            Yii::$app->language = 'vi';
        }
        return parent::beforeAction($action);
    }

    public function actions() {
        $oldAction = parent::actions();
        return array_merge([
            'galleryApi' => [
                'class' => GalleryManagerAction::className(),
                // mappings between type names and model classes (should be the same as in behaviour)
                'types' => [
                    //'product' => ProductItems::className()
                ]
            ],
                ], $oldAction);
    }

}
