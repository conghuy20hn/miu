<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 31-Dec-15
 * Time: 18:51
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\ArticleHelper;
use common\models\VtArticleCategoriesBase;
use Yii;
use yii\base\Exception;

class ArticleController extends ApiController
{
    private $constPageConfig = 'article_page';

    public function actionLoadInCategory()
    {
        try {
            $data = null;
            $slug = Yii::$app->request->getQueryParam('slug');
            if ($slug) {
                $data = ArticleHelper::generateCategoryNews($slug, $this->constPageConfig);
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
                $data = ArticleHelper::generateCategoryNewsPaging($slug, $page, $this->constPageConfig);
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
                $data = ArticleHelper::generateArticleDetail($slug, $this->constPageConfig);
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
                $data = ArticleHelper::generateRelatedArticleDetail($slug, $page, $this->constPageConfig);
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
                $data = ArticleHelper::searchArticleMore($keyword, $page, CommonController::$constSearchPage);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionLoadMoreInCategoryWeather()
    {
        try {
            $data = null;
            $slug = Yii::$app->request->getQueryParam('slug');
            $page = Yii::$app->request->getQueryParam('page');
            if ($slug && $page > 1) {
                /* @var VtArticleCategoriesBase $category */
                $category = VtArticleCategoriesBase::selectBySlug($slug);
                if ($category) {
                    $data['display_image'] = $category->attr & ArticleHelper::DISPLAY_IMAGE;
                    $data['articles'] = ArticleHelper::generateArticleWeather($category->id, $page);
                }
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