<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12-Jan-16
 * Time: 09:22
 */

namespace common\helpers;


use common\models\ProductCategoriesBase;
use common\models\ProductItemsBase;
use Yii;

class ProductItemHelper
{
    const PRODUCT_ITEM_KEY = 'item_id';

    public static function buildComboBoxByCatId($categoryId)
    {
        $data = [];
        if ($categoryId) {
            $cat = ProductCategoriesBase::selectByID($categoryId);
            if ($cat) {
                /* @var ProductCategoriesBase $cat */
                $categoryId = explode(',', $cat->child_list);
            }
            $items = ProductItemsBase::getByCategoryId($categoryId);
            foreach ($items as $index => $item) {
                /* @var ProductItemsBase $item */
                $data[$item->id] = $item->name;
            }
        }
        return $data;
    }

    public static function buildComboBoxByCatIdClient($categoryId)
    {
        $data = [];
        if ($categoryId) {
            $items = ProductItemsBase::getByCategoryId($categoryId);
            foreach ($items as $index => $item) {
                /* @var ProductItemsBase $item */
                $data[] = [
                    "key" => $item->id,
                    "value" => $item->name,
                    "is_default" => false,
                ];
            }
        }
        return $data;
    }
}