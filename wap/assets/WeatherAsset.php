<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 19:25
 */

namespace wap\assets;


use yii\web\AssetBundle;

class WeatherAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/bootstrap-select.min.css',
        'css/owl/owl.carousel.min.css',
        'css/owl/owl.theme.default.min.css',
        'css/coder_update.css',
        'css/bootstrap.min.css',
    ];
    public $js = [
        'js/jquery-ui.js',
        'js/owl/owl.carousel.min.js',
        'js/bootstrap-select.js',
//        'js/page/homePage.js',
        'js/page/lazyload.js',
        'js/page/weather.js',
    ];
    public $depends = [
        'wap\assets\AppAsset',
    ];
}