<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 02-Jan-16
 * Time: 10:26
 */

namespace wap\components;

use common\helpers\ImageHelper;
use common\helpers\MenuHelper;
use common\helpers\TimeHelper;
use common\models\VtArticleCategoriesBase;
use Twig_SimpleFilter;
use Twig_SimpleFunction;
use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\HtmlPurifier;
use yii\twig\Extension;

class WapExtension extends Extension
{
    public function getName()
    {
        return "WapExtension";
    }

    public function getFunctions()
    {
        return ArrayHelper::merge(array(
            new Twig_SimpleFunction('var_dump', array($this, 'var_dump')),
            new Twig_SimpleFunction('randomString', array($this, 'randomString')),
        ), parent::getFunctions());
    }

    public function getFilters()
    {
        return ArrayHelper::merge(array(
            new Twig_SimpleFilter('imagePathThumb', array($this, 'imagePathThumb')),
            new Twig_SimpleFilter('var_dump', array($this, 'var_dump')),
            new Twig_SimpleFilter('timeFormat', array($this, 'timeFormat')),
            new Twig_SimpleFilter('removeHtml', array($this, 'removeHtml')),
            new Twig_SimpleFilter('randomString', array($this, 'randomString')),
            new Twig_SimpleFilter('formatTimeArticle', array($this, 'formatTimeArticle')),
            new Twig_SimpleFilter('getLeftMenu', array($this, 'getLeftMenu')),
            new Twig_SimpleFilter('getTopMenu', array($this, 'getTopMenu')),
            new Twig_SimpleFilter('iconLeftMenu', array($this, 'iconLeftMenu')),
            new Twig_SimpleFilter('checkMenuTopArticle', array($this, 'checkMenuTopArticle')),
            new Twig_SimpleFilter('getAllParent', array($this, 'getAllParent')),
            new Twig_SimpleFilter('checkMenuCat', array($this, 'checkMenuCat')),
        ), parent::getFilters());
    }

    public function imagePathThumb($path, $width, $height = 0, $type = "article")
    {
        return ImageHelper::imagePathThumb($path, $width, $height, $type);
    }

    public function timeFormat($time)
    {
        return TimeHelper::time_elapsed_string(strtotime($time));
    }

    public function randomString($length = 8)
    {
        return Yii::$app->security->generateRandomString($length);
    }

    public function removeHtml($html)
    {
        return HtmlPurifier::process($html);
    }

    public function var_dump($val, $die = false)
    {
        var_dump($val);
        if ($die) {
            die($die);
        }
    }

    public function formatTimeArticle($time)
    {
        return TimeHelper::formatTimeArticle($time);
    }

    /**
     * huync2: getLeftMenu
     * @return array
     */
    public function getLeftMenu()
    {
        return MenuHelper::getLeftMenu(true);
    }

    /**
     * huync2: getTopMenu
     * @return array
     */
    public function getTopMenu()
    {
        return MenuHelper::getTopMenu(true);
    }

    public function iconLeftMenu($type)
    {
        $arrClass = Yii::$app->params['class_icon_left_menu'];
        return $arrClass[$type];
    }

    public function checkMenuTopArticle($catId)
    {
        $arrCatId = explode(',', Yii::$app->params['top_menu_type_news']);
        $objCatId = VtArticleCategoriesBase::getChildById($arrCatId);
        $arrCatId = array();
        foreach ($objCatId as $cat) {
            /*@var VtArticleCategoriesBase $catId */
            $arrchild_list = explode(',', $cat->child_list);
            $arrCatId=array_merge($arrCatId, $arrchild_list);
        }
        if (in_array($catId, $arrCatId)) {
            return true;
        }
        return false;
    }

    public function checkMenuCat($type) {
        if ($type == MenuHelper::NEWS || $type == MenuHelper::VIDEO) {
            return true;
        }
        return false;
    }

    public function getAllParent($catId)
    {
        return VtArticleCategoriesBase::getAllParents($catId, MenuHelper::NEWS . '_');
    }
}