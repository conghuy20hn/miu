<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 08:56
 */

namespace common\helpers;

use common\models\VideoCategoryBase;
use common\models\VtArticleCategoriesBase;
use Yii;
use yii\helpers\Url;

class MenuHelper
{
    const HOME = 'home_page';
    const CLASSIFIEDS = 'buy_sell';
    const CLASSIFIEDS_BUY = 'buy_home';
    const CLASSIFIEDS_SELL = 'sell_home';
    const CLASSIFIEDS_POST = 'post_item';
    const PRICE_LIST = 'price_list';
    const WEATHER = 'weather';
    const NEWS = 'news';
    const VIDEO = 'video';

    public static function getTopMenu($simple = false)
    {
        $topMenu = Yii::$app->params['top_menu'];
        $topMenus = [];
        foreach ($topMenu as $menu) {
            switch ($menu['type']) {
                case self::HOME:
                    $topMenus[] = [
                        'type' => $menu['type'],
                        'title' => Yii::t('wap', $menu['title'])
                    ];
                    break;
                case self::CLASSIFIEDS_BUY:
                    $topMenus[] = [
                        'type' => $menu['type'],
                        'url' => $simple ? Url::to(['/buy-sell/buy-home']) : Url::to(['/v1/classifieds/buy-home']),
                        'title' => Yii::t('wap', $menu['title'])
                    ];
                    break;
                case self::CLASSIFIEDS_SELL:
                    $topMenus[] = [
                        'type' => $menu['type'],
                        'url' => $simple ? Url::to(['/buy-sell/sell-home']) : Url::to(['/v1/classifieds/sell-home']),
                        'title' => Yii::t('wap', $menu['title'])
                    ];
                    break;
                case self::PRICE_LIST:
                    $topMenus[] = [
                        'type' => $menu['type'],
                        'url' => $simple ? Url::to(['/price/home']) : Url::to(['/v1/price/home']),
                        'title' => Yii::t('wap', $menu['title'])
                    ];
                    break;
                case self::NEWS:
                    if ($cat_id = $menu['cat_id']) {
                        $cat = VtArticleCategoriesBase::selectByID($cat_id);
                        if ($cat) {
                            /* @var VtArticleCategoriesBase $cat */
                            $topMenus[] = [
                                'cat_id' => $menu['cat_id'],
                                'type' => $menu['type'],
                                'title' => $cat->name,
                                'cat_child' => VtArticleCategoriesBase::countChildByParentId($cat_id) > 0 ? 1 : 0,
                                'url' => $simple ? Url::to(['/article/category-article', 'slug' => $cat->slug]) : Url::to(['/v1/article/load-in-category', 'slug' => $cat->slug]),
                            ];
                        }
                    }
                    break;
                case self::VIDEO:
                    if ($cat_id = $menu['cat_id']) {
                        $cat = VideoCategoryBase::selectByID($cat_id);
                        if ($cat) {
                            /* @var VideoCategoryBase $cat */
                            $topMenus[] = [
                                'type' => $menu['type'],
                                'title' => $cat->name,
                                'url' => $simple ? Url::to(['/video/load-in-category', 'slug' => $cat->slug]) : Url::to(['/v1/video/load-in-category', 'slug' => $cat->slug]),
                            ];
                        }
                    }
                    break;
            }
        }
        return $topMenus;
    }

    public static function getLeftMenu($simple = false)
    {
        $articleCategory = VtArticleCategoriesBase::getAllParentActive();
        $videoCategory = VideoCategoryBase::getAllParentActive();
        $leftMenu = [
            [
                'title' => Yii::t('api', 'Mua & Bán'),
                'type' => self::CLASSIFIEDS,
                'items' => [
                    [
                        'type' => self::CLASSIFIEDS_BUY,
                        'title' => 'Tin mua',
                        'url' => $simple ? Url::to(['/buy-sell/buy-home']) : Url::to(['/v1/classifieds/buy-home']),
                    ],
                    [
                        'type' => self::CLASSIFIEDS_SELL,
                        'title' => 'Tin bán',
                        'url' => $simple ? Url::to(['/buy-sell/sell-home']) : Url::to(['/v1/classifieds/sell-home']),
                        'other_focus' => $simple ? Url::to(['/buy-sell/buy-home']) : Url::to(['/v1/classifieds/buy-home']),
                    ],
                    [
                        'type' => self::CLASSIFIEDS_POST,
                        'title' => 'Đăng tin',
                        'url' => $simple ? Url::to(['/buy-sell/compose', 'type' => BuySellHelper::BUY_TYPE]) : Url::to(['/v1/classifieds/post-item', 'type' => BuySellHelper::BUY_TYPE])
                    ]
                ]
            ],
            [
                'type' => self::PRICE_LIST,
                'title' => Yii::t('api', 'Giá tôm'),
                'url' => $simple ? Url::to(['/price/home']) : Url::to(['/v1/price/home']),
            ],
            [
                'type' => self::WEATHER,
                'title' => Yii::t('api', 'Thời tiết'),
                'url' => $simple ? Url::to(['/weather/index']) : Url::to(['/v1/weather/home']),
            ]
        ];
        foreach ($articleCategory as $cat) {
            /* @var VtArticleCategoriesBase $cat */
            $leftMenu[] = [
                'title' => $cat->name,
                'type' => self::NEWS,
                'url' => $simple ? Url::to(['/article/category-article', 'slug' => $cat->slug]) : Url::to(['/v1/article/load-in-category', 'slug' => $cat->slug]),
            ];
        }
        foreach ($videoCategory as $cat) {
            /* @var VideoCategoryBase $cat */
            $leftMenu[] = [
                'title' => $cat->name,
                'type' => self::VIDEO,
                'url' => $simple ? Url::to(['/video/load-in-category', 'slug' => $cat->slug]) : Url::to(['/v1/video/load-in-category', 'slug' => $cat->slug]),
            ];
        }

        return $leftMenu;
    }

}