<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 01-Jan-16
 * Time: 19:25
 */

namespace wap\assets;


use yii\web\AssetBundle;

class VideoAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/coder_update.css',
        'css/blue.monday/css/jplayer.blue.monday.min.css',
//        'css/jplayer.blue.monday.min.css',
    ];
    public $js = [
        'js/page/lazyload.js',
        'js/jplayer/jquery.jplayer.min.js',
        'js/jplayer/jplayer.playlist.min.js',
        'js/page/videos.js',
//        'js/page/jwplayer/jwplayer.js',
    ];
    public $depends = [
        'wap\assets\AppAsset',
    ];
}