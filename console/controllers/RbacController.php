<?php
namespace console\controllers;

use common\models\User;
use Yii;
use yii\console\Controller;

class RbacController extends Controller
{
    public function actionInit()
    {
        //$auth = Yii::$app->authManager;

        $user = new User();
        $user->username = "hoangl";
        $user->email = "hoangl@viettel.com.vn";
        $user->status = 10;
        $user->setPassword("abc@1234");
        $user->generatePasswordResetToken();
        $user->generateAuthKey();
        $user->save();
    }


    public function actionIndex()
    {
//        $auth = Yii::$app->authManager;

        $user = new User();
        $user->username = "hoangl";
        $user->email = "hoangl@viettel.com.vn";
        $user->status = 10;
        $user->setPassword("abc@12345");
        $user->generatePasswordResetToken();
        $user->generateAuthKey();
        $user->save();
    }
}