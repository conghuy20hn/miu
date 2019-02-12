<?php

namespace api\controllers;

use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use api\models\auth\Client;
use api\models\auth\User;
use api\models\Member;
use api\modules\v1\models\SubscriberV1;
use Yii;
use yii\filters\ContentNegotiator;
use yii\rest\Controller;
use yii\web\Response;

/**
 * Site controller
 */
class ApiController extends Controller {

    private $permission;
    private $updateUserData = false;
    private $requiredLogin = false;

    /**
     * @inheritdoc
     */
    public function actions() {
        return [
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'transparent' => true,
                'foreColor' => 0xffff00,
                'minLength' => 4,
                'maxLength' => 4,
                'offset' => 4,
            ],
        ];
    }

    public function actionError() {
        return ApiHelper::errorResponse();
    }

    public function behaviors() {
        $behaviors = parent::behaviors();
        $behaviors['contentNegotiator'] = [
            'class' => ContentNegotiator::className(),
            'formats' => [
                'application/json' => Response::FORMAT_JSON,
            ],
        ];
        return $behaviors;
    }

    public function setUpdateUserData($value) {
        $this->updateUserData = $value;
    }

    public function beforeAction($action) {
        // validate authorization code
        $authorization_code = '';
        if (Yii::$app->request->isGet){
            $authorization_code = Yii::$app->request->getQueryParam('authorization_code');
        }
        else if (Yii::$app->request->isPost){
            $authorization_code = Yii::$app->request->getBodyParam('authorization_code');
        }
        $authorization_code = trim($authorization_code);
        if (!$authorization_code) {
            echo json_encode(ApiHelper::formatResponse(
                            ApiResponseCode::AUTHORIZATION_CODE_REQUIRED, []
            ));
            exit;
        }
        $auth = Client::checkAuthorizationCode($authorization_code);
        /* @var Client $auth */
        if ($auth) {
            $this->permission = $auth->permission;
        } else {
            echo json_encode(ApiHelper::formatResponse(
                            ApiResponseCode::AUTH_INVALID_AUTHORIZATION_CODE, []
            ));
            exit;
        }
        return parent::beforeAction($action);
    }

}
