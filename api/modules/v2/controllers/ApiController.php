<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/20/2015
 * Time: 2:22 PM
 */

namespace api\modules\v2\controllers;


use api\libs\ApiHelper;
use Yii;
use yii\web\Controller;

class ApiController extends \api\controllers\ApiController
{
    public function init()
    {
        Yii::$app->response->format = 'json';
        parent::init();
    }

    public function actionIndex()
    {
        return ApiHelper::formatResponse(
            '000000',
            ['abc' => '123']
        );
    }

    public function actionError()
    {
        return ApiHelper::formatResponse(
            '999999',
            ['abc' => '123']
        );
    }
}