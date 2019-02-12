<?php

namespace backend\components\common;

use Yii;

//use Imagine\Gmagick\Image;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Images {

    public static function BlurImage($fileImage, $radius = 80, $sigma = 100) {
        $basePath = Yii::$app->params['upload']['basePath'];
        $imagePath = $basePath . $fileImage;
        if (is_file($imagePath)) {
            $image = new \Imagick($imagePath);
            $image->blurImage($radius, $sigma);
            $file = explode('/', $imagePath);
            $i = 0;
            $filePath = '';
            while ($i < sizeof($file) - 1) {
                $filePath .= $file[$i] . '/';
                $i ++;
            }
            $filePath = $filePath . md5(time()) . '.png';
            $image->writeimage($filePath);
            $filePath = explode($basePath, $filePath);

            return $filePath[1];
        }
        return '';
    }

    public static function resizeImage($file, $w, $h, $crop = FALSE) {
        list($width, $height) = getimagesize($file);
        $r = $width / $height;
        if ($crop) {
            if ($width > $height) {
                $width = ceil($width - ($width * abs($r - $w / $h)));
            } else {
                $height = ceil($height - ($height * abs($r - $w / $h)));
            }
            $newwidth = $w;
            $newheight = $h;
        } else {
            if ($w / $h > $r) {
                $newwidth = $h * $r;
                $newheight = $h;
            } else {
                $newheight = $w / $r;
                $newwidth = $w;
            }
        }
        $src = imagecreatefromjpeg($file);
        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        return $dst;
    }

}
