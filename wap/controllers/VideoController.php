<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12/5/2015
 * Time: 6:00 PM
 */

namespace wap\controllers;


use common\helpers\ArticleHelper;
use common\helpers\VideoHelper;
use wap\models\Video;
use wap\models\VtArticleCategories;
use wap\models\VtArticleItems;
use yii\helpers\Url;
use yii\web\Controller;
use \Yii;

class VideoController extends Controller
{
    private $constPageConfig = 'video_page';

    public function actionLoadInCategory()
    {
        $data = [];
        $slug = Yii::$app->request->getQueryParam('slug');
        if ($slug) {
            $data = VideoHelper::generateCategoryVideo($slug, $this->constPageConfig);
            Yii::$app->view->title=$data['title'] . Yii::$app->params['host_title'];
        }
        return $this->render('video_category.twig', [
            'data' => $data,
        ]);
    }

    public function actionLoadMoreInCategory()
    {
        $this->layout = false;
        $data = [];
        $url = false;
        $slug = Yii::$app->request->getQueryParam('slug');
        $page = Yii::$app->request->getQueryParam('page');
        if ($slug) {
            $data = VideoHelper::generateCategoryVideoPaging($slug, $page, $this->constPageConfig, false);
        }
        if ($data['load_more']) {
            $url = Url::to(['/video/load-more-in-category', 'page' => $page + 1, 'slug' => $slug]);
        }
        /*return $this->render('_video_items.twig', [
            'videos' => $data['videos'],
            'url' => $url,
        ]);*/

        $arrReturn = [
            'data' => $this->render('_video_items.twig', [
                'videos' => $data['videos'],
                'url' => $url,
            ]),
            'url' => $url,
        ];
        return json_encode($arrReturn);


    }


    public function actionVideoDetail()
    {
        $data = [];
        $slug = Yii::$app->request->getQueryParam('slug');
        $objVideo = false;
        if ($slug) {
            $objVideo = Video::selectBySlug($slug);
            $data = VideoHelper::generateVideoDetail($slug, $this->constPageConfig);
            Yii::$app->view->title=$data['title'] . Yii::$app->params['host_title'];
        }
        return $this->render('video_detail.twig', [
            'data' => $data,
            'objVideo' => $objVideo,
        ]);
    }

    public function actionLoadRelatedVideoDetail()
    {
        $this->layout = false;
        $data = [];
        $url = false;
        $slug = Yii::$app->request->getQueryParam('slug');
        $page = Yii::$app->request->getQueryParam('page');
        if ($slug) {
            $data = VideoHelper::generateRelatedVideoDetail($slug, $page, $this->constPageConfig);
        }
        if ($data['load_more']) {
            $url = Url::to(['/video/load-related-video-detail', 'page' => $page + 1, 'slug' => $slug]);
        }
        /*return $this->render('_video_items.twig', [
            'videos' => $data['videos'],
            'url' => $url,
        ]);*/

        $arrReturn = [
            'data' => $this->render('_video_items.twig', [
                'videos' => $data['videos'],
                'url' => $url,
            ]),
            'url' => $url,
        ];
        return json_encode($arrReturn);
    }
}