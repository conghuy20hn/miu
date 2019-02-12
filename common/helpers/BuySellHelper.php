<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 02:45
 */

namespace common\helpers;

use common\models\ProductItemUserBase;
use Yii;
use yii\helpers\Url;

class BuySellHelper
{
    const BUY_TYPE = 2;
    const SELL_TYPE = 1;
    const BUY_TAB = 'buy';
    const SELL_TAB = 'sell';
    const ctl_text_box = 'text_box';
    const ctl_multi = 'multi';
    const ctl_combo_box = 'combo_box';
    const ctl_date_picker = 'date_picker';
    const ctl_date_range = 'date_range';
    const ctl_extend = 'extend_item';
    const TXT_SEARCH = 'keyword';
    const CBX_PROVINCE = 'province';
    const CBX_DISTRICT = 'district';
    const PRODUCT_CATEGORY = 'category_product';
    const PRODUCT_ITEM = 'product';
    const START_TIME = 'start_time';
    const END_TIME = 'end_time';
    const MAXLENGTH_SEARCH = 255;

    public static function buildSearchForm($simple = false)
    {
        return [
            [
                'type' => self::ctl_multi,
                'items' => [
                    [
                        'type' => self::ctl_text_box,
                        'place_holder' => Yii::t('wap', 'Nhập từ khóa'),
                        'title' => null,
                        'name' => self::TXT_SEARCH,
                        'option' => [
                            'max-length' => self::MAXLENGTH_SEARCH
                        ]
                    ]
                ]
            ],
            [
                'type' => self::ctl_multi,
                'items' => [
                    [
                        'type' => self::ctl_combo_box,
                        'place_holder' => Yii::t('wap', 'Tỉnh/TP'),
                        'title' => null,
                        'name' => self::CBX_PROVINCE,
                        'option' => [
                            'data' => self::addDefaultItem($simple, $simple ?
                                LocationHelper::getProvinces() : LocationHelper::getProvincesClient(), false,
                                Yii::t('api', 'Chọn Tỉnh/TP')),
                            'url' => $simple ? Url::to(['/common/get-district']) : Url::to(['/v1/common/get-district']),
                            'send-obj' => 'key',
                            'target' => self::CBX_DISTRICT,
                            'send-name' => LocationHelper::PROVINCE_KEY
                        ]
                    ],
                    [
                        'type' => self::ctl_combo_box,
                        'place_holder' => Yii::t('wap', 'Quận/Huyện/TP'),
                        'title' => null,
                        'name' => self::CBX_DISTRICT,
                        'option' => [
                            'data' => BuySellHelper::addDefaultItem($simple, [], false,
                                Yii::t('wap', 'Quận/Huyện/TP')),
                            'send-obj' => 'key'
                        ]
                    ]
                ]
            ],
            [
                'type' => self::ctl_multi,
                'items' => [
                    [
                        'type' => self::ctl_combo_box,
                        'place_holder' => Yii::t('wap', 'Danh mục'),
                        'title' => null,
                        'name' => self::PRODUCT_CATEGORY,
                        'option' => [
                            'data' => self::addDefaultItem($simple, $simple ?
                                ProductCategoryHelper::buildComboBox() : ProductCategoryHelper::buildComboBoxClient(),
                                false, Yii::t('api', 'Danh mục')),
//                            'url' => $simple ? Url::to(['/common/load-product']) : Url::to(['/v1/product-category/load-product']),
                            'send-obj' => 'key',
//                            'target' => self::PRODUCT_ITEM,
                            'send-name' => self::PRODUCT_CATEGORY
//                            'send-name' => ProductCategoryHelper::PRODUCT_CATEGORY_KEY
                        ]
                    ],
//                    [
//                        'type' => self::ctl_combo_box,
//                        'place_holder' => Yii::t('wap', 'Chọn sản phẩm'),
//                        'title' => null,
//                        'name' => self::PRODUCT_ITEM,
//                        'option' => [
//                            'read-only' => true,
//                            'send-obj' => 'key',
//                        ]
//                    ]
                ]
            ],
            [
                'type' => self::ctl_extend
            ],
            [
                'type' => self::ctl_date_range,
                'items' => [
                    [
                        'type' => self::ctl_date_picker,
                        'place_holder' => Yii::t('wap', 'Ngày bắt đầu'),
                        'title' => null,
                        'name' => self::START_TIME,
                        'option' => [
                            'display-format' => 'dd-MM-yyyy',
                            'send-format' => 'yyyy-MM-dd'
                        ]
                    ],
                    [
                        'type' => self::ctl_date_picker,
                        'place_holder' => Yii::t('wap', 'Ngày kết thúc'),
                        'title' => null,
                        'name' => self::END_TIME,
                        'option' => [
                            'display-format' => 'dd-MM-yyyy',
                            'send-format' => 'yyyy-MM-dd'
                        ]
                    ]
                ]
            ],
        ];
    }

    public static function addDefaultItem($simple, $arr, $index = false, $label = '')
    {
        if (!$label) {
            $label = Yii::t("api", "Tất cả");
        }
        if ($index === false) {
            if (!$simple) {
                array_unshift($arr, [
                    "key" => "",
                    "value" => Yii::t('api', $label),
                    "is_default" => true,
                ]);
            } else {
                return array('' => Yii::t('api', $label)) + $arr;
            }
        } else {
            if ($arr[$index] && !$simple) {
                $arr[$index]['is_default'] = true;
            }
        }
        return $arr;
    }


    /**
     * @param ProductItemUserBase $item
     * @return array
     */
    public static function generateProductItemUser($item)
    {
        $arr = [
            'title' => $item->title,
            'image_path' => ImageHelper::imagePathThumb($item->image_path, 89, 89, 'prod_user'),
            'price' => [
                'title' => Yii::t('api', 'Giá'),
                'value' => $item->price . ' ' . $item->price_unit
            ],
            'item' => [
                'title' => Yii::t('api', 'Loại'),
                'value' => $item->item ? $item->item->name : ""
            ],
            'location' => [
                'title' => Yii::t('api', 'Tại'),
                'value' => $item->memLocation ? $item->memLocation->location_full : ""
            ],
        ];
        if (date('Y', strtotime($item->start_at)) == date('Y', strtotime($item->expires_at))) {
            $arr['time'] = [
                'title' => Yii::t('api', 'Thời gian'),
                'value' => date('d/m', strtotime($item->start_at)) . '-' . date('d/m/Y', strtotime($item->expires_at))
            ];
        } else {
            $arr['time'] = [
                'title' => Yii::t('api', 'Thời gian'),
                'value' => date('d/m/Y', strtotime($item->start_at)) . '-' . date('d/m/Y', strtotime($item->expires_at))
            ];
        }
        return $arr;
    }
}