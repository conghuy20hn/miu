<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 19:25
 */

namespace wap\assets;


use yii\web\AssetBundle;

class BuySellAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
//        'css/jquery.mobile-1.3.0.min.css',
        'css/mobipick.css',
        'css/reset.css',
        'css/style.css',
        'css/bootstrap.min.css',
        'css/coder_update.css',
        'css/bootstrap-select.min.css',
        'css/jquery-ui.css',
    ];
    public $js = [
//        'js/plugins/mobidate/external/shCore.js',
//        'js/plugins/mobidate/external/xdate.js',
//        'js/plugins/mobidate/external/xdate.i18n.js',
//        'js/plugins/mobidate/external/jquery.mobile-1.3.0.min.js',
//        'js/plugins/mobidate/mobipick.js',
//        'js/plugins/mobidate/mobipick.js',

        'js/common/load.js',
        'js/common/common.js',
        'js/bootstrap.min.js',
        'js/bootstrap-select.js',
        'js/page/buysell.js',
        'js/jquery-ui.js',
        'js/page/lazyload.js'
    ];
    public $depends = [
        'wap\assets\AppAsset',
    ];
}