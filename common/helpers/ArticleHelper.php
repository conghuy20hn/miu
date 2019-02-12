<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 31-Dec-15
 * Time: 17:02
 */

namespace common\helpers;

use common\models\VtArticleCategoriesBase;
use common\models\VtArticleItemsBase;
use Yii;
use yii\helpers\Url;

class ArticleHelper
{
    const DISPLAY_IMAGE = 1;

    public static function generateHomeNews($cat_id, $cat_child)
    {
        $news = [];
        $news['type'] = 'news';
        $cat = VtArticleCategoriesBase::selectByID($cat_id);
        if ($cat) {
            /* @var VtArticleCategoriesBase $cat */
            $news["title"] = $cat->name;
            $news["slug"] = $cat->slug;
            $news["url"] = Url::to(['/v1/article/load-in-category', 'slug' => $cat->slug]);
            if ($cat_child) {
                $news["cat_child"] = 1;
                $news["child"] = [];
                $childCat = VtArticleCategoriesBase::getChildByParentId($cat->id, Yii::$app->params['home_page']['num_of_child_cat_article']);
                foreach ($childCat as $child) {
                    /* @var VtArticleCategoriesBase $child */
                    $articles = VtArticleItemsBase::getHomeArticleByCatId($child->id, Yii::$app->params['home_page']['num_of_article_in_cat']);
                    if (is_array($articles) && count($articles)) {
                        $c = [];
                        $c["title"] = $child->name;
                        $c["slug"] = $child->slug;
                        $c["display_image"] = $child->attr & self::DISPLAY_IMAGE;
                        $c["articles"] = [];
                        foreach ($articles as $article) {
                            /* @var VtArticleItemsBase $article */
                            $c["articles"][] = self::generateArticleItem($article);
                        }
                        $news["child"][] = $c;
                    }
                }
            } else {
                $news["cat_child"] = 0;
                $news["articles"] = [];
                $news["display_image"] = $cat->attr & self::DISPLAY_IMAGE;
                $articles = VtArticleItemsBase::getHomeArticleByCatId($cat->id, Yii::$app->params['home_page']['num_of_article_in_cat']);
                foreach ($articles as $article) {
                    /* @var VtArticleItemsBase $article */
                    $news["articles"][] = self::generateArticleItem($article);
                }
            }
        }
        return $news;
    }

    public static function generateCategoryNews($cat_slug, $page)
    {
        $news = null;
        $cat = VtArticleCategoriesBase::selectBySlug($cat_slug);
        if ($cat) {
            $news = [];
            /* @var VtArticleCategoriesBase $cat */
            $news["title"] = $cat->name;
            $news["id"] = $cat->id;
            $news["slug"] = $cat->slug;
            $childCat = VtArticleCategoriesBase::getChildByParentId($cat->id);
            if (is_array($childCat) && count($childCat)) {
                $news["cat_child"] = 1;
                $news["child"] = [];
                foreach ($childCat as $child) {
                    /* @var VtArticleCategoriesBase $child */
                    $articles = VtArticleItemsBase::getArticleByCatId($child->id, Yii::$app->params[$page]['num_of_news']);
                    if (is_array($articles) && count($articles)) {
                        $c = [];
                        $c["title"] = $child->name;
                        $c["slug"] = $child->slug;
                        $c["display_image"] = $child->attr & self::DISPLAY_IMAGE;
                        $c["url"] = Url::to(['/v1/article/load-in-category', 'slug' => $child->slug]);
                        $c["articles"] = [];
                        foreach ($articles as $article) {
                            /* @var VtArticleItemsBase $article */
                            $c["articles"][] = self::generateArticleItem($article);
                        }
                        $news["child"][] = $c;
                    }
                }
            } else {
                $news["cat_child"] = 0;
                $news["display_image"] = $cat->attr & self::DISPLAY_IMAGE;
                $news["articles"] = [];
                $articles = VtArticleItemsBase::getArticleByCatId($cat->id, Yii::$app->params[$page]['num_of_news']);
                foreach ($articles as $article) {
                    /* @var VtArticleItemsBase $article */
                    $news["articles"][] = self::generateArticleItem($article);
                }
                if (count($articles) >= Yii::$app->params[$page]['num_of_news_per_page']) {
                    $news["load_more"] = Url::to(['/v1/article/load-more-in-category', 'page' => 2, 'slug' => $cat->slug]);
                }
            }
        }
        return $news;
    }

    public static function generateCategoryNewsPaging($cat_slug, $pageNo, $page)
    {
        $news = [];
        $cat = VtArticleCategoriesBase::selectBySlug($cat_slug);
        $news["articles"] = [];

        if ($cat) {
            /* @var VtArticleCategoriesBase $cat */
            $news["display_image"] = $cat->attr & self::DISPLAY_IMAGE;
            $limit = Yii::$app->params[$page]['num_of_news_per_page'];
            $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$page]['num_of_news']);

            $articles = VtArticleItemsBase::getArticleByCatId($cat->id, $limit, $offset);
            foreach ($articles as $article) {
                /* @var VtArticleItemsBase $article */
                $news["articles"][] = self::generateArticleItem($article);
            }
            if (count($articles) >= $limit) {
                $news["load_more"] = Url::to(['/v1/article/load-more-in-category', 'page' => $pageNo + 1, 'slug' => $cat->slug]);
            }
        }
        return $news;
    }

    public static function generateArticleDetail($article_slug, $page)
    {
        $news = null;
        $article = VtArticleItemsBase::selectBySlug($article_slug);
        if ($article) {
            /* @var VtArticleItemsBase $article */
            $news = self::generateArticleItem($article);
            if (count($news)) {
                $news['published_time'] = TimeHelper::formatTimeArticle($article->published_time);
                $news['fulltext'] = str_replace(Yii::$app->params['media_host_replace'], Yii::$app->params['path_article_replace'], $article->fulltext);
                $files = json_decode($article->file_attached, true);
                if (count($files)) {
                    $news['attachment'] = [];
                    $index = 0;
                    foreach ($files as $file) {
                        $filePath = $file['item']['file_path'];
                        $path_parts = pathinfo($filePath);
                        $isImage = FileHelper::isImage(Yii::$app->params['article_image_path'] . $filePath);
                        $news['attachment'][] = [
                            'file_name' => $file['item']['file_name'],
                            'file_ext' => $path_parts['extension'],
                            'file_path' => Yii::$app->params['server_name'] .
                                Url::to(['/article/download-file', 'slug' => $article->slug, 'pos' => $index]),
                            'file_viewer' => $isImage ? Yii::$app->params['server_name'] .
                                Url::to(['/article/view-file-image', 'slug' => $article->slug, 'pos' => $index]) :
                                Yii::$app->params['doc_viewer_prefix'] . Yii::$app->params['server_name'] .
                                Url::to(['/article/download-file', 'slug' => $article->slug, 'pos' => $index]),
                            'description' => $file['item']['description'],
                        ];
                        $index++;
                    }
                }
            }
            $news['related_items'] = [];
            /* @var VtArticleCategoriesBase $cat */
            $cat = VtArticleCategoriesBase::selectByID($article->category_id);
            if ($cat) {
                $news['related_items']["display_image"] = $cat->attr & self::DISPLAY_IMAGE;
                $news['related_items']['articles'] = [];
                $related = VtArticleItemsBase::getRelatedArticle($article, Yii::$app->params[$page]['num_of_related_article']);
                if (is_array($related) && count($related)) {
                    $news['related_items']['articles'] = [];
                    foreach ($related as $item) {
                        /* @var VtArticleItemsBase $item */
                        $news['related_items']['articles'][] = self::generateArticleItem($item);
                    }
                    if (count($related) >= Yii::$app->params[$page]['num_of_related_article']) {
                        $news['related_items']['load_more'] = Url::to(['/v1/article/load-related-detail', 'page' => 2, 'slug' => $article->slug]);
                    }
                }
            }
        }
        return $news;
    }

    public static function generateRelatedArticleDetail($article_slug, $pageNo, $page)
    {
        $news = null;
        $article = VtArticleItemsBase::selectBySlug($article_slug);
        if ($article) {
            $news = [];
            /* @var VtArticleItemsBase $article */
            /* @var VtArticleCategoriesBase $cat */
            $cat = VtArticleCategoriesBase::selectByID($article->category_id);
            $news['articles'] = [];
            if ($cat) {
                $news["display_image"] = $cat->attr & self::DISPLAY_IMAGE;
                $limit = Yii::$app->params[$page]['num_of_related_article_more'];
                $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$page]['num_of_related_article']);
                $related = VtArticleItemsBase::getRelatedArticle($article, $limit, $offset);
                if (is_array($related) && count($related)) {
                    $news['articles'] = [];
                    foreach ($related as $item) {
                        /* @var VtArticleItemsBase $item */
                        $news['articles'][] = self::generateArticleItem($item);
                    }
                    if (count($related) >= $limit) {
                        $news['load_more'] = Url::to(['/v1/article/load-related-detail', 'page' => $pageNo + 1, 'slug' => $article->slug]);
                    }
                }
            }
        }
        return $news;
    }

    public static function generateBanner()
    {
        $hotNews = [];
        $hotNews['type'] = 'banner';
        $hotNews['data'] = [];
        $listArticles = VtArticleItemsBase::getHotArticle(\Yii::$app->params['home_page']['num_of_hot_news']);
        foreach ($listArticles as $article) {
            /* @var VtArticleItemsBase $article */
            $ar = ArticleHelper::generateArticleItem($article, 320, 270);
            $ar['category_name'] = $article->category ? $article->category->name : "";
            $ar['published_time'] = '';
            $ar['published_time_org'] = '';
            $hotNews['data'][] = $ar;
        }
        return $hotNews;
    }

    public static function searchArticle($keyword, $limit, $offset)
    {
        if ($keyword) {
            $news = [];

            $items = VtArticleItemsBase::searchArticle($keyword, $limit, $offset);
            $news['articles'] = [];
            $news['display_image'] = 1;
            $news['total'] = VtArticleItemsBase::searchArticleCount($keyword);
            $data = $items;
            if ($data) {
                foreach ($data as $item) {
                    /* @var VtArticleItemsBase $item */
                    $news['articles'][] = self::generateArticleItem($item);
                }
                if (count($news['articles']) >= $limit) {
                    $news['load_more'] = Url::to(['/v1/article/search-more', 'page' => 2,
                        'keyword' => urlencode(base64_encode($keyword))]);
                }
            }
            return $news;
        }
        return [];
    }

    public static function searchArticleMore($keyword, $pageNo, $page)
    {
        if ($keyword) {
            $news = [];
            $limit = Yii::$app->params[$page]['num_of_article_more'];
            $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$page]['num_of_article']);
            $keyword = base64_decode(urldecode($keyword));
            $items = VtArticleItemsBase::searchArticle($keyword, $limit, $offset);
            $news['display_image'] = 1;
            $news['articles'] = [];
            if ($items) {
                foreach ($items as $item) {
                    /* @var VtArticleItemsBase $item */
                    $news['articles'][] = self::generateArticleItem($item);
                }
                if (count($items) >= $limit) {
                    $news['load_more'] = Url::to(['/v1/article/search-more', 'page' => $pageNo + 1,
                        'keyword' => urlencode(base64_encode($keyword))]);
                }
            }
            return $news;
        }
        return [];
    }

    public static function generateArticleItem($article, $imageWidth = 89, $imageHeight = 67)
    {
        if ($article) {
            /* @var VtArticleItemsBase $article */
            return [
                'title' => $article->title,
                'image_path' => ImageHelper::imagePathThumb($article->image, $imageWidth, $imageHeight),
                'slug' => $article->slug,
                'url' => Url::to(['/v1/article/load-detail', 'slug' => $article->slug]),
//                'introtext' => $article->introtext,
                'hits' => $article->hits ? $article->hits : 0,
                'has_attachment' => count(json_decode($article->file_attached, true)) ? 1 : 0,
                'published_time' => TimeHelper::time_elapsed_string(strtotime($article->published_time)),
                'published_time_org' => $article->published_time,
            ];
        }
        return [];
    }

    public static function generateArticleWeather($categoryId, $page = 1, $slug = false, $simple = false)
    {
        /** @var  VtArticleCategoriesBase $category */
        if ($slug) {
            $category = VtArticleCategoriesBase::selectBySlug($slug);
        } else {
            $category = VtArticleCategoriesBase::selectByID($categoryId);
        }
        $news["item"] = [];
        if ($category) {
            $limit = Yii::$app->params['article_home_weather']['num_of_item'];
            $offset = ($page - 1) * $limit;
            $childList = $category->child_list ? $category->child_list : $categoryId;
            $childList = explode(',', $childList);
            $news["display_image"] = $category->attr & self::DISPLAY_IMAGE;
            $articles = VtArticleItemsBase::getArticleByCatId($childList, $limit, $offset);

            foreach ($articles as $article) {
                /* @var VtArticleItemsBase $article */
                $news["item"][] = self::generateArticleItem($article);
            }
            if (count($articles) >= $limit) {
                $news["load_more"] = $simple ? Url::to(['/article/load-more-in-category-weather', 'page' => $page + 1, 'slug' => $category->slug]) : Url::to(['/v1/article/load-more-in-category-weather', 'page' => $page + 1, 'slug' => $category->slug]);
            }
            return $news;
        } else {
            return $news;
        }
    }

}
