<?php

/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace backend\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle {

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
        'plugins/font-opensans/css/font-opensans.css',
        'plugins/font-awesome/css/font-awesome.min.css',
        'plugins/simple-line-icons/simple-line-icons.min.css',
        'plugins/bootstrap/css/bootstrap.min.css',
        'plugins/uniform/css/uniform.default.css',
        'plugins/bootstrap-switch/css/bootstrap-switch.min.css',
        'plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
        'css/components-md.css',
        'css/plugins-md.css',
        'css/layout.css',
        'css/themes/darkblue.css',
        'css/custom.css'
    ];
    public $js = [
        'plugins/jquery-ui/jquery-ui.min.js',
        'plugins/bootstrap/js/bootstrap.min.js',
        'plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
        'plugins/jquery-slimscroll/jquery.slimscroll.min.js',
        'plugins/jquery.blockui.min.js',
        'plugins/jquery.cokie.min.js',
        'plugins/uniform/jquery.uniform.min.js',
        'plugins/bootstrap-switch/js/bootstrap-switch.min.js',
        'js/metronic/metronic.js',
        'js/metronic/layout.js',
        'js/metronic/quick-sidebar.js',
        'js/metronic/datatable.js',
        'js/metronic/aws-datatable.js',
        'js/cms.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
    ];

}
