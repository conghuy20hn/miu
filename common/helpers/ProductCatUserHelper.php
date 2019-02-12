<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 06-Jan-16
 * Time: 11:25
 */

namespace common\helpers;


use common\models\ProductCatUserAttributeBase;
use common\models\ProductCatUserBase;
use Yii;

class ProductCatUserHelper
{
    const STATUS_NEW = 0;
    const STATUS_APPROVED = 1;
    const STATUS_REJECTED = 2;
    const TYPE_TEXTBOX = 1;
    const TYPE_COMBOBOX = 2;

    /**
     * huync2: generate ProductCatUser
     * @return array
     * @var ProductCatUserBase $item
     */
    public static function generateProductCatUser($item)
    {
        $categoryId = $item->category_id;
        $attrs = null;
        $attr_show = [];
        $attr_hide = [];
        $arr = [];
        if ($categoryId) {
            $attrs = ProductCatUserAttributeBase::getByCategoryId($categoryId);
        }
        foreach ($attrs as $attr) {
            /* @var ProductCatUserAttributeBase $attr */
            $values = json_decode($item->attr_values, true);
            $val = null;
            foreach ($values as $value) {
                if ($value['id'] == $attr->id) {
                    $val = $value['value'];
                    break;
                }
            }
            if ($attr->attr & 1 == 1 && $val) {
                $attr_show[] = [
                    'title' => $attr->name,
                    'value' => $val . ' ' . $attr->unit,
                ];
            } else if ($val) {
                $attr_hide[] = [
                    'title' => $attr->name,
                    'value' => $val . ' ' . $attr->unit,
                ];
            }
        }
        if ($item->title) {
            $arr['title'] = $item->title;
        }
        $arr['image_path'] = ImageHelper::imagePathThumb($item->image_path, 89, 89, 'prod_user');
        if ($item->price) {
            $arr['price'] = [
                'title' => Yii::t('api', 'Giá'),
                'value' =>number_format($item->price, 0, ',', '.')  . ' ' . $item->price_unit
            ];
        }
        if ($item->category_id) {
            /* $var ProductCategories $category */
            $category = $item->category;
            if ($category) {
                $arr['category'] = [
                    'title' => Yii::t('api', 'Loại'),
                    'value' => $category->name,
                ];
            }
        }
        if (count($attr_show)) {
            $arr['attr_show'] = $attr_show;
        }
        if ($item->memLocation) {
            $arr['location'] = [
                'title' => Yii::t('api', 'Tại'),
                'value' => $item->memLocation->location_full
            ];
        }
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
        if ($item->description) {
            $arr['detail']['description'] = $item->description;
        }
        if (count($attr_hide)) {
            $arr['detail']['attr_hide'] = $attr_hide;
        }
        if ($item->mem_contact) {
            $arr['detail']['mem_contact'] = [
                'title' => Yii::t('api', 'Liên hệ'),
                'value' => $item->mem_contact
            ];
        }
        if ($item->mem_address) {
            $arr['detail']['mem_address'] = [
                'title' => Yii::t('api', 'Địa chỉ'),
                'value' => $item->mem_address
            ];
        }
        if ($item->mem_phone) {
            $arr['detail']['mem_phone'] = [
                'title' => Yii::t('api', 'Điện thoại'),
                'value' => $item->mem_phone
            ];
        }

        if ($item->attr_values) {
            $arrAttr = [];
            $objAttr = json_decode($item->attr_values);
            foreach ($objAttr as $attr) {
                if ($attr->item->id) {
                    /* @var ProductCatUserAttributeBase $objAttrItem */
                    $objAttrItem = ProductCatUserAttributeBase::selectById($attr->item->id);
                    if ($objAttrItem) {
                        $attrItem = [
                            'title' => $objAttrItem->name,
                            'value' => $attr->item->value . ' ' . $objAttrItem->unit,
                        ];
                        $arrAttr[] = $attrItem;
                    }
                }
            }
            if (count($arrAttr)) {
                $arr['attr_values'] = $arrAttr;
            }
        }
        return $arr;
    }
}