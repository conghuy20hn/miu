<?php

namespace backend\controllers;

use Yii;
use common\models\LoginForm;
use common\helpers\MenuHelper;

/**
 * Site controller
 */
class SiteController extends AppController {

    public $layout = 'default';

    /**
     * @inheritdoc
     */
    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'transparent' => true,
                'minLength' => 4,
                'maxLength' => 4,
            ],
        ];
    }

    public function actionIndex() {
        $this->layout = 'main';
        if (!Yii::$app->user->isGuest) {
            // $productItemCount = \backend\models\ProductItems::find(['is_active' => IS_ACTIVE])->count();
            // $buySellCount = \backend\models\ProductCatUser::find()->count();
            // $news = \backend\models\VtArticleItems::find(['is_active' => IS_ACTIVE])->count();
            // $videos = \backend\models\Video::find(['is_active' => IS_ACTIVE])->count();
            return $this->render('index', [
                        'productItemCount' => [],
                        'buySellCount' => [],
                        'news' => [],
                        'videos' => []
            ]);
        }
        $this->redirect('login');
    }

    public function actionLogin() {
        if (!\Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        } else {
            return $this->render('login', [
                        'model' => $model,
            ]);
        }
    }

    public function actionLogout() {
        Yii::$app->user->logout();

        return $this->goHome();
    }

}
