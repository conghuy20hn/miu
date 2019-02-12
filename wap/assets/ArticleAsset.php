<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 19:25
 */

namespace wap\assets;


use yii\web\AssetBundle;

class ArticleAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
    ];
    public $js = [
        'js/page/lazyload.js'
    ];
    public $depends = [
        'wap\assets\AppAsset',
    ];
}