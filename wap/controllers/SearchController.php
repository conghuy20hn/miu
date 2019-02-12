<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/20/2015
 * Time: 9:26 PM
 */

namespace wap\controllers;

use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\ArticleHelper;
use common\helpers\BuySellHelper;
use common\helpers\Helpers;
use common\helpers\VideoHelper;
use Yii;
use yii\helpers\Url;
use yii\web\Controller;

class SearchController extends Controller
{
    public function actionGetDistrict()
    {

    }

    public function actionIndex()
    {
        Yii::$app->view->title="Kết quả tìm kiếm";
        $data = [];
        $dataValid = [];
        $message = '';
        if (Yii::$app->request->get() && Yii::$app->request->getQueryParam('keyword')) {
            $keyword = trim(Yii::$app->request->getQueryParam('keyword'));
            if (!$keyword) {
                $dataValid['keyword_required'] = [
                    'error-code' => ApiResponseCode::SEARCH_REQUIRED,
                    'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::SEARCH_REQUIRED),
                ];

            }

            if ($keyword && Helpers::getStrLen($keyword) > 255) {
                $dataValid['keyword_maxlength'] = [
                    'error-code' => ApiResponseCode::SEARCH_MAXLENGTH,
                    'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::SEARCH_MAXLENGTH),
                ];
            }

            Yii::$app->session->set('search_keyword', $keyword);

            $data = [];
            if (!count($dataValid)) {
                if ($keyword) {
                    $limitArticle = Yii::$app->params['search_page']['num_of_article'];
                    $limitVideo = Yii::$app->params['search_page']['num_of_video'];

                    $offset = 0;
                    $data['keyword'] = $keyword;
                    $data['result'] = [];
                    $data['total'] = 0;
                    $articles = ArticleHelper::searchArticle($keyword, $limitArticle, $offset);
                    $videos = VideoHelper::searchVideo($keyword, $limitVideo, $offset);
                    if ($articles && sizeof($articles['articles'])) {
                        $data['result'][] = [
                            'title' => Yii::t('api', 'Tin tức'),
                            'type' => 'news',
                            'items' => ['articles' => $articles['articles']]
                        ];
                        $data['total'] += $articles['total'];
                    }
                    if ($videos && sizeof($videos['videos'])) {
                        $data['result'][] = [
                            'title' => Yii::t('api', 'Video'),
                            'type' => 'video',
                            'items' => ['videos' => $videos['videos']]
                        ];
                        $data['total'] += $videos['total'];
                    }
                }
            } else {
                foreach ($dataValid as $item) {
                    $message = $item['error-mess'];
                    break;
                }
            }
        }

        return $this->render('index.twig', [
            'pageTitle' => "Kết quả tìm kiếm",
            'data' => $data,
            'keyword' => \yii\helpers\Html::encode($keyword),
            'loadmore_article' => intval($articles['total']) > intval(Yii::$app->params['search_page']['num_of_article']) ? 1 : 0,
            'loadmore_video' => intval($videos['total']) > intval(Yii::$app->params['search_page']['num_of_video']) ? 1 : 0,
            'message' => $message,

        ]);
    }

    public function actionLoadArticles()
    {
        $this->layout = false;
        $data = [];
        $url = false;
        $keyword = Yii::$app->session->get('search_keyword');
        if ($keyword) {
            $num_of_article = Yii::$app->params['search_page']['num_of_article'];
            $limit = Yii::$app->params['search_page']['num_of_article_more'];
            $page = Yii::$app->request->getQueryParam('page');
            $offset = ($page - 1) * $limit - ($limit - $num_of_article);
            if ($keyword && $page > 1) {
                $data = ArticleHelper::searchArticle($keyword, $limit, $offset);
            }
            if ($data) {
                if ($data['load_more']) {
                    $url = Url::to(['/search/load-articles/', 'page' => $page + 1]);
                }
            }
        }

        /*return $this->render('_articles.twig', [
            'articles' => $data['articles'],
            'url' => $url,
        ]);*/

        $arrReturn = [
            'data' => $this->render('_articles.twig', [
                'articles' => $data['articles'],
                'url' => $url,
            ]),
            'url' => $url,
        ];
        return json_encode($arrReturn);
    }

    public function actionLoadVideos()
    {
        $this->layout = false;
        $data = [];
        $url = false;
        $keyword = Yii::$app->session->get('search_keyword');
        if ($keyword) {
            $page = Yii::$app->request->getQueryParam('page');
            $limit = Yii::$app->params['search_page']['num_of_video_more'];
            $num_of_video = Yii::$app->params['search_page']['num_of_video'];
            $ofsset = ($page - 1) * $limit - ($limit - $num_of_video);
            if ($keyword && $page > 1) {
                $data = VideoHelper::searchVideo($keyword, $limit, $ofsset);
            }
            $url = false;
            if ($data) {
                if ($data['load_more']) {
                    $url = Url::to(['/search/load-videos', 'page' => $page + 1]);
                }
            }
        }
        /*return $this->render('_videos.twig', [
            'videos' => $data['videos'],
            'url' => $url,
        ]);*/

        $arrReturn = [
            'data' => $this->render('_videos.twig', [
                'videos' => $data['videos'],
                'url' => $url,
            ]),
            'url' => $url,
        ];
        return json_encode($arrReturn);
    }

}
