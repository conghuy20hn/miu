<?php
namespace console\controllers;

use common\models\User;
use Yii;
use yii\console\Controller;

class TestController extends Controller
{
    /**
     * php yii test
     */
    public function actionIndex()
    {
        //$auth = Yii::$app->authManager;
            echo "test";
//        $user = new User();
//        $user->username = "hoangl";
//        $user->email = "hoangl@viettel.com.vn";
//        $user->status = 10;
//        $user->setPassword("abc@1234");
//        $user->generatePasswordResetToken();
//        $user->generateAuthKey();
//        $user->save();
    }

    /**
     * php yii test/getlist
     */
    public function actionGetlist()
    {
        //$auth = Yii::$app->authManager;
            echo "actionGetlist";
//        $user = new User();
//        $user->username = "hoangl";
//        $user->email = "hoangl@viettel.com.vn";
//        $user->status = 10;
//        $user->setPassword("abc@1234");
//        $user->generatePasswordResetToken();
//        $user->generateAuthKey();
//        $user->save();
    }
}