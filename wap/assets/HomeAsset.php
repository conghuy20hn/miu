<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 19:25
 */

namespace wap\assets;


use yii\web\AssetBundle;

class HomeAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/owl/owl.carousel.min.css',
        'css/coder_update.css',
    ];
    public $js = [
        'js/owl/owl.carousel.min.js',
        'js/bootstrap-select.js',
        'js/page/homePage.js',
    ];
    public $depends = [
        'wap\assets\AppAsset',
    ];
}