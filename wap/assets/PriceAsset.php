<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 19:25
 */

namespace wap\assets;


use yii\web\AssetBundle;

class PriceAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/bootstrap.min.css',
        'css/reset.css',
        'css/style.css',
        'css/coder_update.css',
        'css/bootstrap-select.min.css',
        'css/jquery-ui.css',
    ];
    public $js = [
        'js/common/load.js',
        'js/common/common.js',
        'js/bootstrap.min.js',
        'js/bootstrap-select.js',
        'js/page/price.js',
        'js/jquery-ui.js',
        'js/page/lazyload.js'
    ];
    public $depends = [
        'wap\assets\AppAsset',
    ];
}