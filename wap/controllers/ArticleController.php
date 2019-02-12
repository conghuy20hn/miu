<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12/5/2015
 * Time: 6:00 PM
 */

namespace wap\controllers;


use common\helpers\ArticleHelper;
use common\helpers\FileHelper;
use common\models\VtArticleItemsBase;
use wap\models\VtArticleCategories;
use wap\models\VtArticleItems;
use yii\helpers\Url;
use yii\web\Controller;
use \Yii;

class ArticleController extends Controller
{
    public function actionArticleDetail()
    {
        $slug = Yii::$app->request->getQueryParam('slug');
        $data = ArticleHelper::generateArticleDetail($slug, 'article_page');
        $category = false;
        $objArticle = VtArticleItems::selectBySlug($slug);
        if ($objArticle) {
            $category = $objArticle->category;
        }
        Yii::$app->view->title=$data['title'] . Yii::$app->params['host_title'];
        return $this->render('article_detail.twig', [
            'data' => $data,
            'category' => $category
        ]);
    }

    public function actionLoadRelatedDetail()
    {
        $this->layout = false;
        $slug = Yii::$app->request->getQueryParam('slug');
        $pageNo = Yii::$app->request->getQueryParam('page');
        $category = false;
        $data = [];
        $url = false;
        if ($slug && $pageNo > 1) {
            $data = ArticleHelper::generateRelatedArticleDetail($slug, $pageNo, 'article_page');
        }
        if ($data['articles']) {
            $url = Url::to(['/article/load-related-detail', 'page' => $pageNo + 1, 'slug' => $slug]);
        }
        /*return $this->render('_related_items.twig', [
            'articles' => $data['articles'],
            'url' => $url,
        ]);*/
        $arrReturn = [
            'data' => $this->render('_related_items.twig', [
                'articles' => $data['articles'],
                'display_image' => $data['display_image'],
                'url' => $url,
            ]),
            'url' => $url,
        ];
        return json_encode($arrReturn);
    }

    public function actionCategoryArticle()
    {
        $data = [];
        $slugCategory = Yii::$app->request->getQueryParam('slug');

        if ($slugCategory) {
//            $data = ArticleHelper::generateCategoryNewsPaging($slugCategory, 1, 'article_page');
            $data = ArticleHelper::generateCategoryNews($slugCategory, 'article_page');
        }
        Yii::$app->view->title=$data['title'] . Yii::$app->params['host_title'];
        return $this->render('category_article.twig', [
            'data' => $data,
        ]);
    }

    public function actionLoadCategoryArticle()
    {
        $this->layout = false;
        $data = [];
        $url = false;
        $slugCategory = Yii::$app->request->getQueryParam('slug');
        $pageNo = Yii::$app->request->getQueryParam('page');
        if ($slugCategory) {
            $data = ArticleHelper::generateCategoryNewsPaging($slugCategory, $pageNo, 'article_page');
//            if (count($data['articles'])) {

            if ($data['load_more']) {
                $url = Url::to(['/article/load-category-article', 'page' => $pageNo + 1, 'slug' => $slugCategory]);
            }
        }
        /*return $this->render('_related_items.twig', [
            'articles' => $data['articles'],
            'url' => $url,
        ]);*/

        $arrReturn = [
            'data' => $this->render('_related_items.twig', [
                'articles' => $data['articles'],
                'display_image' => $data['display_image'],
                'url' => $url,
            ]),
            'url' => $url,
        ];
        return json_encode($arrReturn);
    }

    public function actionLoadMoreInCategoryWeather()
    {
        $this->layout = false;
        $data = [];
        $slug = Yii::$app->request->getQueryParam('slug');
        $page = Yii::$app->request->getQueryParam('page');
        if ($slug && $page > 1) {
            $data = ArticleHelper::generateArticleWeather(false, $page, $slug, true);
        }
        /*return $this->render('_related_items.twig', [
            'articles' => $data['item'],
            'url' => $data['load_more'],
        ]);*/
        $arrReturn = [
            'data' => $this->render('_related_items.twig', [
                'articles' => $data['item'],
                'display_image' => $data['display_image'],
                'url' => $data['load_more'],
            ]),
            'url' => $data['load_more'],
        ];
        return json_encode($arrReturn);

    }

    public function actionDownloadFile()
    {
        $this->layout = false;
        $slug = Yii::$app->request->getQueryParam('slug');
        $pos = Yii::$app->request->getQueryParam('pos');
        /* @var VtArticleItemsBase $article */
        $article = VtArticleItemsBase::selectBySlug($slug);
        if ($article) {
            $files = json_decode($article->file_attached, true);
            if (count($files) > $pos) {
                $filePath = Yii::$app->params['article_image_path'] . $files[$pos]['item']['file_path'];
                $path_parts = pathinfo($filePath);
                $fileName = $files[$pos]['item']['file_name'] . '.' . $path_parts['extension'];
                FileHelper::downloadFile($filePath, $fileName);
            }
        }
    }

    public function actionViewFileImage()
    {
        $this->layout = false;
        $slug = Yii::$app->request->getQueryParam('slug');
        $pos = Yii::$app->request->getQueryParam('pos');
        /* @var VtArticleItemsBase $article */
        $article = VtArticleItemsBase::selectBySlug($slug);
        $base64 = 'data:image/png;base64,';
        $title = 'Xem hình ảnh';
        if ($article) {
            $files = json_decode($article->file_attached, true);
            if (count($files) > $pos) {
                $filePath = Yii::$app->params['article_image_path'] . $files[$pos]['item']['file_path'];
                $type = pathinfo($filePath, PATHINFO_EXTENSION);
                $data = file_get_contents($filePath);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                $title .= $files[$pos]['item']['file_name'];
            }
        }
        return $this->render('view_image.twig', [
            'base64' => $base64,
            'title' => $title,
        ]);
    }
}