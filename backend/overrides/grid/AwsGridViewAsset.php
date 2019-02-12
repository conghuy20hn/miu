<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace backend\overrides\grid;

use yii\web\AssetBundle;

/**
 * This asset bundle provides the javascript files for the [[GridView]] widget.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AwsGridViewAsset extends AssetBundle
{
    public $sourcePath = '@yii/assets';
    public $css = [
        //'plugins/font-opensans/css/font-opensans.css',
//        '/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
    ];
    public $js = [
        'yii.gridView.js',
        '/plugins/float-thead/dist/jquery.floatThead.min.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
    ];
}
