<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 17:34
 */

namespace common\helpers;

use common\models\VideoBase;
use common\models\VideoCategoryBase;
use Yii;
use yii\helpers\Url;

class VideoHelper
{

    public static function generateVideo($catId)
    {
        $video = [];
        $video['type'] = 'video';
        $video['data'] = [];
        $cat = VideoCategoryBase::selectByID($catId);
        if ($cat) {
            /* @var VideoCategoryBase $cat */
            $video['data']['title'] = $cat->name;
            $video['data']['slug'] = $cat->slug;
            $video['data']['url'] = Url::to(['/v1/video/load-in-category', 'slug' => $cat->slug]);
            $video['data']['videos'] = [];
            $videos = VideoBase::getVideoByCatId($cat->id, Yii::$app->params['home_page']['num_of_videos']);
            foreach ($videos as $vi) {
                /* @var VideoBase $vi */
                $video['data']['videos'][] = self::generateVideoItem($vi);
            }
        }
        return $video;
    }

    public static function generateCategoryVideo($slug, $page)
    {
        $video = null;
        $cat = VideoCategoryBase::selectBySlug($slug);
        if ($cat) {
            $video = [];
            /* @var VideoCategoryBase $cat */
            $video['title'] = $cat->name;
            $video['slug'] = $cat->slug;
            $video['videos'] = [];
            $limit = Yii::$app->params[$page]['num_of_video_per_page'];
            $offset = ($page - 1) * $limit;
            $videos = VideoBase::getVideoByCatId($cat->id, $limit, $offset, false);
            foreach ($videos as $vi) {
                /* @var VideoBase $vi */
                $video['videos'][] = self::generateVideoItem($vi);
            }
            if (count($videos) >= Yii::$app->params[$page]['num_of_video_per_page']) {
                $video['load_more'] = Url::to(['/v1/video/load-more-in-category', 'page' => 2, 'slug' => $cat->slug]);
            }
        }
        return $video;
    }

    public static function generateCategoryVideoPaging($slug, $pageNo, $page, $isHomePage = true)
    {
        $video = null;
        $cat = VideoCategoryBase::selectBySlug($slug);
        if ($cat) {
            $video = [];
            /* @var VideoCategoryBase $cat */
            $video['title'] = $cat->name;
            $video['slug'] = $cat->slug;
            $video['videos'] = [];
            $limit = Yii::$app->params[$page]['num_of_video_per_page'];
            $offset = ($pageNo - 1) * $limit;
            $videos = VideoBase::getVideoByCatId($cat->id, $limit, $offset, $isHomePage);
            foreach ($videos as $vi) {
                /* @var VideoBase $vi */
                $video['videos'][] = self::generateVideoItem($vi);
            }
            if (count($videos) >= Yii::$app->params[$page]['num_of_video_per_page']) {
                $video['load_more'] = Url::to(['/v1/video/load-more-in-category', 'page' => $pageNo + 1, 'slug' => $cat->slug]);
            }
        }
        return $video;
    }

    public static function generateVideoDetail($slug, $page)
    {
        $video = null;
        $vItem = VideoBase::selectBySlug($slug);
        if ($vItem) {
            /* @var VideoBase $vItem */
            $video = self::generateVideoItem($vItem);
            if (count($video)) {
                $video['file_path'] = Yii::$app->params['streaming_media_path'] . $vItem->file_path;
            }
            $related = VideoBase::getRelatedVideo($vItem, Yii::$app->params[$page]['num_of_related_video']);
            if (is_array($related) && count($related)) {
                $video['related_items'] = [];
                $video['related_items']['videos'] = [];
                foreach ($related as $item) {
                    /* @var VideoBase $item */
                    $video['related_items']['videos'][] = self::generateVideoItem($item);
                }
                if (count($related) >= Yii::$app->params[$page]['num_of_related_video']) {
                    $video['related_items']['load_more'] = Url::to(['/v1/video/load-related-detail', 'page' => 2, 'slug' => $vItem->slug]);
                }
            }
        }
        return $video;
    }

    public static function generateRelatedVideoDetail($slug, $pageNo, $page)
    {
        $video = null;
        $vItem = VideoBase::selectBySlug($slug);
        if ($vItem) {
            /* @var VideoBase $vItem */
            $limit = Yii::$app->params[$page]['num_of_related_video_more'];
            $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$page]['num_of_related_video']);
            $related = VideoBase::getRelatedVideo($vItem, $limit, $offset);
            if (is_array($related) && count($related)) {
                $video = [];
//                $video['videos_num_of_related_video'] = Yii::$app->params[$page]['num_of_related_video'];
//                $video['videos_limit'] = $limit;
//                $video['videos_offset'] = $offset;
                $video['videos'] = [];
                foreach ($related as $item) {
                    /* @var VideoBase $item */
                    $video['videos'][] = self::generateVideoItem($item);
                }
                if (count($related) >= $limit) {
                    $video['load_more'] = Url::to(['/v1/video/load-related-detail', 'page' => $pageNo + 1, 'slug' => $vItem->slug]);
                }
            }
        }
        return $video;
    }

    public static function searchVideo($keyword, $limit, $offset)
    {
        if ($keyword) {
            $videos = [];
            $items = VideoBase::searchVideo($keyword, $limit, $offset);
            $videos['videos'] = [];
            $videos['total'] = VideoBase::searchVideoCount($keyword);
            $data = $items;
            if ($data) {
                foreach ($data as $item) {
                    /* @var VideoBase $item */
                    $videos['videos'][] = self::generateVideoItem($item);
                }
                if (count($videos['videos']) >= $limit) {
                    $videos['load_more'] = Url::to(['/v1/video/search-more', 'page' => 2,
                        'keyword' => urlencode(base64_encode($keyword))]);
                }
            }
            return $videos;
        }
        return [];
    }

    public static function searchVideoMore($keyword, $pageNo, $page)
    {
        if ($keyword) {
            $videos = [];
            $limit = Yii::$app->params[$page]['num_of_video_more'];
            $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$page]['num_of_video']);
            $keyword = base64_decode(urldecode($keyword));
            $items = VideoBase::searchVideo($keyword, $limit, $offset);
            if ($items) {
                $videos['videos'] = [];
                foreach ($items as $item) {
                    /* @var VideoBase $item */
                    $videos['videos'][] = self::generateVideoItem($item);
                }
                if (count($items) >= $limit) {
                    $videos['load_more'] = Url::to(['/v1/video/search-more', 'page' => $pageNo + 1,
                        'keyword' => urlencode(base64_encode($keyword))]);
                }
            }
            return $videos;
        }
        return [];
    }

    /**
     * @param VideoBase $video
     * @return array
     */
    public static function generateVideoItem($video)
    {
        if ($video) {
            return [
                'title' => $video->name,
                'slug' => $video->slug,
                'date' => TimeHelper::formatTimeArticle($video->updated_at),
                'description' => $video->caption ? $video->caption : "",
                'url' => Url::to(['/v1/video/load-detail', 'slug' => $video->slug]),
                'image_path' => ImageHelper::imagePathThumb($video->image_path, 320, 188, 'video'),
                'updated_at' => $video->updated_at,
            ];
        }
        return [];
    }

}
