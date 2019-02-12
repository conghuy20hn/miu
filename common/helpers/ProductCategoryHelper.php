<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 03:09
 */

namespace common\helpers;


use common\models\ProductCategoriesBase;

class ProductCategoryHelper
{
    const PRODUCT_CATEGORY_KEY = 'category_id';

    public static function buildComboBox()
    {
        // bind cat
        $cats = ProductCategoriesBase::getAllActive();
        $cats = self::sortCategories($cats);
        $menu = [];
        if (count($cats) > 0) {
            foreach ($cats as $cat) {
                self::bindCatItems($menu, $cat);
            }
        }
        return $menu;
    }

    private function bindCatItems(&$menu, $item)
    {
        $menu[$item['id']] = $item['level'] > 0 ? str_repeat('--', $item['level']) . $item['name'] : $item['name'];
        if ($item['child'] != null) {
            foreach ($item['child'] as $child) {
                self::bindCatItems($menu, $child);
            }
        }
    }

    public static function buildComboBoxClient()
    {
        // bind cat
        $cats = ProductCategoriesBase::getAllActive();
        $cats = self::sortCategories($cats);
        $menu = [];
        if (count($cats) > 0) {
            foreach ($cats as $cat) {
                self::bindCatItemsClient($menu, $cat);
            }
        }
        return array_values($menu);
    }

    private function bindCatItemsClient(&$menu, $item)
    {
        $menu[] =
            [
                "key" => $item['id'],
                "value" => $item['level'] > 0 ? str_repeat('--', $item['level']) . $item['name'] : $item['name'],
                "display_type" => $item['display_type'],
                "is_default" => false,
            ];
        if ($item['child'] != null) {
            foreach ($item['child'] as $child) {
                self::bindCatItemsClient($menu, $child);
            }
        }
    }

    private function sortCategories($cats, $parent_id = 0, $level = 0)
    {
        $return = null;
        foreach ($cats as $cat) {
            /* @var ProductCategoriesBase $cat */
            if ($cat->parent_id == $parent_id) {
                $return[] = [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'position' => $cat->position,
                    'level' => $level,
                    'child' => self::sortCategories($cats, $cat->id, $level + 1),
                    'display_type' => $cat->display_type,
                ];
            }
        }
        return $return;
    }

}