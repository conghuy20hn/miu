<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 18:06
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\VideoHelper;
use Yii;
use yii\base\Exception;

class VideoController extends ApiController
{
    private $constPageConfig = 'video_page';

    public function actionLoadInCategory()
    {
        try {
            $data = null;
            $slug = Yii::$app->request->getQueryParam('slug');
            if ($slug) {
                $data = VideoHelper::generateCategoryVideo($slug, $this->constPageConfig);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionLoadMoreInCategory()
    {
        try {
            $data = null;
            $slug = Yii::$app->request->getQueryParam('slug');
            $page = Yii::$app->request->getQueryParam('page');
            if ($slug && $page > 1) {
                $data = VideoHelper::generateCategoryVideoPaging($slug, $page, $this->constPageConfig);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionLoadDetail()
    {
        try {
            $data = null;
            $slug = Yii::$app->request->getQueryParam('slug');
            if ($slug) {
                $data = VideoHelper::generateVideoDetail($slug, $this->constPageConfig);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionLoadRelatedDetail()
    {
        try {
            $data = null;
            $slug = Yii::$app->request->getQueryParam('slug');
            $page = Yii::$app->request->getQueryParam('page');
            if ($slug && $page > 1) {
                $data = VideoHelper::generateRelatedVideoDetail($slug, $page, $this->constPageConfig);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionSearchMore()
    {
        try {
            $data = null;
            $keyword = Yii::$app->request->getQueryParam('keyword');
            $page = Yii::$app->request->getQueryParam('page');
            if ($keyword && $page > 1) {
                $data = VideoHelper::searchVideoMore($keyword, $page, CommonController::$constSearchPage);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }
}