<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 17:28
 */

namespace common\helpers;

use common\models\LocationBase;
use common\models\ProductCategoriesBase;
use common\models\ProductItemsBase;
use Yii;
use yii\helpers\Url;

class PriceListHelper {

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

    public static function buildSearchForm($simple = false) {
        return [
            [
                'type' => self::ctl_multi,
                'items' => [
                    [
                        'type' => self::ctl_combo_box,
                        'place_holder' => Yii::t('wap', 'Tỉnh/TP'),
                        'checked' => Yii::$app->session->get('session_province_checked'),
                        'title' => null,
                        'name' => self::CBX_PROVINCE,
                        'option' => [
                            'send-obj' => 'key',
                            'data' => self::addDefaultItem($simple, $simple ?
                                            LocationHelper::getProvinces() : LocationHelper::getProvincesClient(), false, Yii::t('api', 'Tỉnh/TP')),
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
                        'checked' => Yii::$app->session->get('session_actionSearch_Price_defaultCategory'),
                        'title' => null,
                        'name' => self::PRODUCT_CATEGORY,
                        'option' => [
                            'data' => BuySellHelper::addDefaultItem($simple, $simple ? ProductCategoryHelper::buildComboBox() : ProductCategoryHelper::buildComboBoxClient(), 0),
                            'url' => $simple ? Url::to(['/common/load-product']) : Url::to(['/v1/product-category/load-product']),
                            'send-obj' => 'key',
                            'target' => self::PRODUCT_ITEM,
                            'send-name' => ProductCategoryHelper::PRODUCT_CATEGORY_KEY
                        ]
                    ],
                    [
                        'type' => self::ctl_combo_box,
                        'place_holder' => Yii::t('wap', 'Sản phẩm'),
                        'checked' => Yii::$app->session->get('session_product_checked'),
                        'title' => null,
                        'name' => self::PRODUCT_ITEM,
                        'option' => [
                            'send-obj' => 'key',
                            'read-only' => true
                        ]
                    ]
                ]
            ]
        ];
    }

    public static function generatePriceList() {
        // Price List
        $priceList = [];
        $priceList['type'] = 'price_list';
        $priceList['title'] = 'Giá tôm';
        $priceList['url'] = Url::to(['/v1/price/home']);

        $priceList['control'] = self::generateControlPricelist();
        $priceList['data'] = [];
        // select cat list
        $catList = ProductCategoriesBase::getHomePriceList(Yii::$app->params['home_page']['num_of_price_cat_list']);
        if ($catList) {
            foreach ($catList as $cat) {
                /* @var ProductCategoriesBase $cat */
                // select all price items in categories
                $items = ProductItemsBase::getHomePriceList($cat->id, LocationHelper::getDefaultLocationClassified(), Yii::$app->params['home_page']['num_of_price_item_list']);
                if (is_array($items) && count($items)) {
                    $catItem = [];
                    $catItem['name'] = $cat->name;
                    $catItem['display_type'] = $cat->display_type;
                    $catItem['items'] = [];
                    if ($cat->display_type == 2) {
                        foreach ($items as $item) {
                            $catItem['items'][] = [
                                'name' => $item['name'],
                                'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 0, 'price' . $cat->display_type),
                                'price' => [
                                    'title' => 'Giá',
                                    'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit'],
                                ],
                                'state' => $item['state'],
                            ];
                        }
                    } else {
                        foreach ($items as $item) {
                            $catItem['items'][] = [
                                'name' => $item['name'],
                                'price' => [
//                                    'title' => 'Giá',
                                    'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit'],
                                ],
                                'state' => $item['state'],
                            ];
                        }
                    }
                    $priceList['data'][] = $catItem;
                }
            }
        }
        return $priceList;
    }

    /* public static function addDefaultItem($simple, $arr, $index = false, $label = '')
      {
      if ($index == false) {
      if (!$simple) {
      array_unshift($arr, [
      "key" => "",
      "value" => Yii::t('api', "Tất cả"),
      "is_default" => true,
      ]);
      }
      } else {
      if ($arr[$index] && !$simple) {
      $arr[$index]['is_default'] = true;
      }
      }
      return $arr;
      } */

    public static function addDefaultItem($simple, $arr, $index = false, $label = '') {
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

    public function generateControlPricelist() {
        $location = LocationHelper::getProvincesClient();
        // location default
        $locationDefault = LocationHelper::getDefaultLocationClassified();
        $index = 0;
        if ($locationDefault) {
            foreach ($location as $key => $val) {
                if ($locationDefault == $val['key']) {
                    $index = $key;
                    break;
                }
            }
        }

        $control = [
            'type' => self::ctl_multi,
            'items' => [
                [
                    'type' => self::ctl_combo_box,
                    'place_holder' => Yii::t('wap', 'Tỉnh/TP'),
                    'title' => null,
                    'name' => self::CBX_PROVINCE,
                    'option' => [
                        'url' => url::to('/v1/price/get-pricelist-province'),
                        'send-obj' => 'key',
                        'send-name' => self::CBX_PROVINCE,
                        'data' => self::addDefaultItem(false, LocationHelper::getProvincesClient(), $index, Yii::t('api', 'Tỉnh/TP')),
                    ]
                ]
            ]
        ];
        return $control;
    }

}
