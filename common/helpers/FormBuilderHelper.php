<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 08-Jan-16
 * Time: 20:14
 */

namespace common\helpers;


use common\models\ProductCategoriesBase;
use common\models\ProductCatUserAttributeBase;
use common\models\ProductItemsBase;
use common\models\ProductItemUserAttributeBase;
use Yii;
use yii\helpers\Url;

class FormBuilderHelper
{
    const ctl_text_box = 'text_box';
    const ctl_text_area = 'text_area';
    const ctl_multi = 'multi';
    const ctl_combo_box = 'combo_box';
    const ctl_radio_button = 'radio_button';
    const ctl_date_picker = 'date_picker';
    const ctl_date_range = 'date_range';
    const ctl_extend = 'extend_item';
    const ctl_upload_image = 'upload_image';
    const ctl_upload_gallery = 'upload_gallery';
    const TXT_SEARCH = 'keyword';
    const CBX_PROVINCE = 'province';
    const CBX_DISTRICT = 'district';
    const PRODUCT_CATEGORY = 'category_product';
    const PRODUCT_ITEM = 'product';
    const PRODUCT_EXTEND = 'product_extend';
    const PRODUCT_TYPE = 'type';
    const START_TIME = 'start_time';
    const END_TIME = 'end_time';
    const TXT_TITLE = 'title';
    const TXT_DESCRIPTION = 'description';
    const TXT_PRICE = 'price';
    const PRICE_UNIT = 'price_unit';
    const TXT_CONTACT = 'mem_contact';
    const TXT_ADDRESS = 'mem_address';
    const TXT_PHONE = 'mem_phone';
    const TXT_EMAIL = 'mem_email';
    const IMAGE_PATH = 'image_path';
    const BUILD_CONTROL = 'build_control';
    const BUILD_DATA = 'build_data';
    const VALID_DAYS = 'valid_days';
    const ATTRIBUTE_PREFIX = 'attr-';
    const MAXLENGTH_ATTR = 64;
    const MAXLENGTH_TITLE = 255;
    const MAXLENGTH_PRICE = 15;
    const MAXLENGTH_CONTACT = 255;
    const MAXLENGTH_ADDRESS = 255;
    const MAXLENGTH_EMAIL = 255;
    const MAXLENGTH_PHONE = 20;

    public static function buildProductAttrForm($productId, $simple = false)
    {
        $attributes = ProductItemUserAttributeBase::getActiveByProductItem($productId);
        $items = [];
        foreach ($attributes as $attribute) {
            /* @var ProductItemUserAttributeBase $attribute */
            switch ($attribute->type) {
                case ProductItemUserHelper::TYPE_TEXTBOX:
                    $items[] = [
                        'type' => self::ctl_text_box,
                        'place_holder' => $attribute->name . ' (' . $attribute->unit . ')',
                        'title' => null,
                        'name' => self::ATTRIBUTE_PREFIX . $attribute->slug,
                        'option' => [
                            'max-length' => self::MAXLENGTH_ATTR
                        ]
                    ];
                    break;
            }
        }
        return $items;
    }

    public static function buildCategoryAttrForm($categoryId, $simple = false)
    {
        $items = [];
        if ($categoryId >= 0) {
            $category = ProductCategoriesBase::selectByID($categoryId);
            if ($category) {
                /* @var ProductCategoriesBase $category */
                $attributes = ProductCatUserAttributeBase::getByCategoryId($categoryId);
                if ($attributes && count($attributes) > 0) {
                    foreach ($attributes as $attribute) {
                        /* @var ProductCatUserAttributeBase $attribute */
                        switch ($attribute->type) {
                            case ProductItemUserHelper::TYPE_TEXTBOX:
                                $items[] = [
                                    'type' => self::ctl_text_box,
                                    'place_holder' => $attribute->name . ' (' . $attribute->unit . ')',
                                    'title' => null,
                                    'name' => self::ATTRIBUTE_PREFIX . $attribute->slug,
                                    'option' => [
                                        'max-length' => self::MAXLENGTH_ATTR
                                    ]
                                ];
                                break;
                            case ProductItemUserHelper::TYPE_COMBOBOX:
                                if ($attribute->data && $cbx = json_decode($attribute->data, true)) {
                                    $arr = [];
                                    if (count($cbx)) {
                                        foreach ($cbx as $item) {
                                            if ($simple) {
                                                $arr[trim($item)] = $item . ' ' . $attribute->unit;
                                                return $arr;
                                            } else {
                                                $arr[] = [
                                                    "key" => trim($item),
                                                    "value" => $item . ' ' . $attribute->unit,
                                                    "is_default" => false
                                                ];
                                            }
                                        }
                                        $items[] = [
                                            'type' => self::ctl_combo_box,
                                            'place_holder' => $attribute->name . ' (' . $attribute->unit . ')',
                                            'title' => null,
                                            'name' => self::ATTRIBUTE_PREFIX . $attribute->slug,
                                            'option' => [
                                                'send-obj' => 'key',
                                                'data' => BuySellHelper::addDefaultItem($simple, $arr, false,
                                                    $attribute->name . ' (' . $attribute->unit . ')'),
                                            ]
                                        ];
                                    }
                                }
                                break;
                        }
                    }
                }
                $items[] = [
                    'type' => self::ctl_text_box,
                    'place_holder' => Yii::t('wap', 'Giá'),
                    'title' => null,
                    'name' => self::TXT_PRICE,
                    'option' => [
                        'max-length' => self::MAXLENGTH_PRICE,
                        'required' => true,
                        'regex' => Yii::$app->params['regex_validation']['price']
                    ]
                ];
                $priceUnit = $category->priceUnit;
                if ($priceUnit && $priceUnit->data && $cbx = json_decode($priceUnit->data, true)) {
                    $arr = [];
                    if (count($cbx)) {
                        foreach ($cbx as $item) {
                            if ($simple) {
                                $arr[$item] = $item;
                                return $arr;
                            } else {
                                $arr[] = [
                                    "key" => $item,
                                    "value" => $item,
                                    "is_default" => false
                                ];
                            }
                        }
                        $items[] = [
                            'type' => self::ctl_combo_box,
                            'place_holder' => Yii::t('wap', 'Đ/vị tính'),
                            'title' => null,
                            'name' => self::PRICE_UNIT,
                            'option' => [
                                'required' => true,
                                'send-obj' => 'key',
                                'data' => BuySellHelper::addDefaultItem($simple, $arr, false,
                                    Yii::t('wap', 'Đ/vị tính')),
                            ]
                        ];
                    }
                }
            }
        }
        return $items;
    }

    /**
     * @param ProductItemsBase $product
     * @param bool|false $simple
     * @return array
     */
    public static function buildProductPriceUnit($product, $simple = false)
    {
        $arr = [];
        if ($simple) {
            $arr[$product->price_unit] = $product->price_unit;
            return $arr;
        }
        $arr[] = [
            "key" => $product->price_unit,
            "value" => $product->price_unit,
            "is_default" => false
        ];
        return $arr;
    }

    public static function buildRequestForm($type, $simple = false)
    {
        $productCategory = BuySellHelper::addDefaultItem($simple, $simple ?
            ProductCategoryHelper::buildComboBox() : ProductCategoryHelper::buildComboBoxClient(), false,
            Yii::t('api', 'Danh mục'));
//        $productCategoryId = 0;
//        if (count($productCategory)) {
//            $productCategoryId = $simple ? array_keys($productCategory)[0] : $productCategory[0]['key'];
//        }
//        $catAttrs = self::buildCategoryAttrForm($productCategoryId);
        $validDays = Yii::$app->params['prod_user']['valid_date'];
        $validDay = [];
        foreach ($validDays as $index => $item) {
            if ($simple) {
                $validDay[$index] = $item;
            } else {
                $validDay[] = [
                    "key" => $index,
                    "value" => $item,
                    "is_default" => false
                ];
            }
        }
        return [
            [
                'title' => Yii::t('api', 'Đăng tin'),
                'ctl_on_header' => self::buildBuySellOption($simple, $type),
                'items' => [
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'type' => self::ctl_text_box,
                                'place_holder' => Yii::t('wap', 'Tiêu đề'),
                                'title' => null,
                                'name' => self::TXT_TITLE,
                                'option' => [
                                    'max-length' => self::MAXLENGTH_TITLE,
                                    'required' => true
                                ]
                            ]
                        ]
                    ],
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'type' => self::ctl_text_area,
                                'place_holder' => Yii::t('wap', 'Thông tin chi tiết'),
                                'title' => null,
                                'name' => self::TXT_DESCRIPTION,
                                'option' => [
                                    'rows' => 4
                                ]
                            ]
                        ]
                    ],
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'type' => self::ctl_combo_box,
                                'place_holder' => Yii::t('wap', 'Hạn đăng'),
                                'title' => null,
                                'name' => self::VALID_DAYS,
                                'option' => [
                                    'required' => true,
                                    'send-obj' => 'key',
                                    'data' => BuySellHelper::addDefaultItem($simple,
                                        $validDay,
                                        false, Yii::t('api', 'Hạn đăng')),
                                ]
                            ]
                        ]
                    ],
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'title' => null,
                                'place_holder' => Yii::t('wap', 'Chọn hình ảnh'),
                                'type' => self::ctl_upload_image,
                                'name' => self::IMAGE_PATH,
                                'option' => [
                                    'ext' => Yii::$app->params['prod_user']['image_upload']['ext'],
                                    'size' => Yii::$app->params['prod_user']['image_upload']['maxSize'],
                                    'save_ext' => Yii::$app->params['prod_user']['image_upload']['save_ext'],
                                ]
                            ]
                        ]
                    ],
                ]
            ],
            [
                'title' => Yii::t('api', 'Thông tin cơ bản'),
                'items' => [
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'type' => self::ctl_combo_box,
                                'place_holder' => Yii::t('wap', 'Danh mục'),
                                'title' => null,
                                'name' => self::PRODUCT_CATEGORY,
                                'option' => [
                                    'data' => $productCategory,
                                    'url' => $simple ? Url::to(['/common/load-product-attr']) : Url::to(['/v1/product-category/load-attribute']),
                                    'send-obj' => 'key',
                                    'target' => self::PRODUCT_EXTEND,
                                    'send-name' => ProductCategoryHelper::PRODUCT_CATEGORY_KEY,
                                    'required' => true
                                ]
                            ],
                            [
                                'type' => self::ctl_extend,
                                'name' => self::PRODUCT_EXTEND,
                                'option' => [
//                                    'default' => $catAttrs,
                                    'num_per_row' => 2,
                                    'position' => 1
                                ]
                            ]
                        ]
                    ],
                ]
            ],
            [
                'title' => Yii::t('api', 'Thông tin liên hệ'),
                'items' => [
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'type' => self::ctl_text_box,
                                'place_holder' => Yii::t('wap', 'Họ tên'),
                                'title' => null,
                                'name' => self::TXT_CONTACT,
                                'option' => [
                                    'max-length' => self::MAXLENGTH_CONTACT,
                                    'required' => true
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
                                    'data' => BuySellHelper::addDefaultItem($simple, $simple ?
                                        LocationHelper::getProvinces() : LocationHelper::getProvincesClient(), false,
                                        Yii::t('wap', 'Tỉnh/TP')),
                                    'url' => $simple ? Url::to(['/common/get-district']) : Url::to(['/v1/common/get-district']),
                                    'send-obj' => 'key',
                                    'target' => self::CBX_DISTRICT,
                                    'send-name' => LocationHelper::PROVINCE_KEY,
                                    'required' => true
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
                                'type' => self::ctl_text_box,
                                'place_holder' => Yii::t('wap', 'Địa chỉ'),
                                'title' => null,
                                'name' => self::TXT_ADDRESS,
                                'option' => [
                                    'max-length' => self::MAXLENGTH_ADDRESS
                                ]
                            ]
                        ]
                    ],
                    [
                        'type' => self::ctl_multi,
                        'items' => [
                            [
                                'type' => self::ctl_text_box,
                                'place_holder' => Yii::t('wap', 'Di động'),
                                'title' => null,
                                'name' => self::TXT_PHONE,
                                'option' => [
                                    'max-length' => self::MAXLENGTH_PHONE,
                                    'required' => true,
                                    'regex' => Yii::$app->params['regex_validation']['mem_phone']
                                ]
                            ]
                        ]
                    ],
                ]
            ]
        ];
    }

    public static function buildBuySellOption($simple, $type)
    {
        $arr = [];
        if (!$simple) {
            $arr = [
                [
                    "key" => BuySellHelper::BUY_TYPE,
                    "value" => Yii::t('api', 'Cần mua'),
                    "is_default" => $type == BuySellHelper::BUY_TYPE ? true : false
                ],
                [
                    "key" => BuySellHelper::SELL_TYPE,
                    "value" => Yii::t('api', 'Cần bán'),
                    "is_default" => $type == BuySellHelper::SELL_TYPE ? true : false
                ]
            ];
        } else {
            if ($type == BuySellHelper::BUY_TYPE) {
                $arr[BuySellHelper::BUY_TYPE] = Yii::t('api', 'Cần mua');
                $arr[BuySellHelper::SELL_TYPE] = Yii::t('api', 'Cần bán');
            } else {
                $arr[BuySellHelper::SELL_TYPE] = Yii::t('api', 'Cần bán');
                $arr[BuySellHelper::BUY_TYPE] = Yii::t('api', 'Cần mua');
            }
        }
        return [
            'type' => self::ctl_radio_button,
//            'type' => self::ctl_combo_box,
            'name' => self::PRODUCT_TYPE,
            'option' => [
                'data' => $arr,
                'send-obj' => 'key',
                'required' => true
            ]
        ];
    }
}