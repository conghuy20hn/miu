<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace wap\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/bootstrap.min.css',
        'css/bootstrap-select.min.css',
        'css/reset.css',
        'css/jquery.mmenu.all.css',
        'css/style.css',
//        'css/owl/owl.carousel.min.css',
        'css/owl/owl.theme.default.min.css',
        'css/coder_update.css',
    ];
    public $js = [
        'js/common/event.js',
        'js/common/function.js',
        'js/common/load.js',
        'js/common/common.js',
        'js/shrimp.js',
//        'js/search/search.js',
        'js/jquery.mmenu.min.all.js',
//        'js/plugins/dotdotdot/jquery.dotdotdot.min.js',
        'js/bootstrap.min.js',
//        'js/plugins/truncate/jquery.truncate.min.js',
//        'js/owl/owl.carousel.min.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}
