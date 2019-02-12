<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 28-Dec-15
 * Time: 15:55
 */

namespace common\helpers;

use Imagine\Image\Box;
use Yii;
use yii\base\Exception;
use yii\imagine\Image;

class ImageHelper {

    public static function articleImagePath($path) {
        try {
            if (strlen($path) == 0) {
                return Yii::$app->params['article_default_media_path'];
            } else {
                $filename = Yii::$app->params['article_img_upload_path'] . $path;
                if (is_file($filename)) {
                    return Yii::$app->params['media_path'] . $path;
                } else {
                    return Yii::$app->params['article_default_media_path'];
                }
            }
        } catch (Exception $e) {
            return Yii::$app->params['article_default_media_path'];
        }
    }

    public static function productPriceImagePath($path, $displayType) {
        try {
            if (strlen($path) == 0) {
                return Yii::$app->params['price' . $displayType . '_default_media_path'];
            } else {
                $filename = Yii::$app->params['price' . $displayType . '_img_upload_path'] . $path;
                if (is_file($filename)) {
                    return Yii::$app->params['media_path'] . $path;
                } else {
                    return Yii::$app->params['price' . $displayType . '_default_media_path'];
                }
            }
        } catch (Exception $e) {
            return Yii::$app->params['price' . $displayType . '_default_media_path'];
        }
    }

    public static function videoImagePath($path) {
        try {
            if (strlen($path) == 0) {
                return Yii::$app->params['video_default_media_path'];
            } else {
                $filename = Yii::$app->params['video_img_upload_path'] . $path;
                if (is_file($filename)) {
                    return Yii::$app->params['media_path'] . $path;
                } else {
                    return Yii::$app->params['video_default_media_path'];
                }
            }
        } catch (Exception $e) {
            return Yii::$app->params['video_default_media_path'];
        }
    }

    public static function imagePathThumb($path, $width, $height = 0, $type = "article") {
        try {
            if (strlen($path) == 0) {
                return self::generateDefaultThumb($width, $height, $type);
            } else {
                $thumbnail = Yii::$app->params['image_thumb_path'] . DIRECTORY_SEPARATOR . $width . $path;
                if (is_file($thumbnail)) {
                    return Yii::$app->params['media_thumb_path'] . DIRECTORY_SEPARATOR . $width . $path;
                } else {
                    $filename = Yii::$app->params[$type . '_img_upload_path'] . $path;
                    if (is_file($filename)) {
                        $imagine = Image::getImagine();
//                        $image = new \Imagick($filename);
                        $image = $imagine->open($filename);
                        if ($height == 0) {
                            $size = $image->getSize();
                            $height = round($width * $size->getHeight() / $size->getWidth());
//                            $height = round($width * $size['rows'] / $size['columns']);
                        }
                        //create folder
                        $pathToFile = $width . $path;
                        $fileName = basename($pathToFile);
                        $folders = explode(DIRECTORY_SEPARATOR, str_replace(DIRECTORY_SEPARATOR . $fileName, '', $pathToFile));
                        $currentFolder = Yii::$app->params['image_thumb_path'] . DIRECTORY_SEPARATOR;
                        foreach ($folders as $folder) {
                            $currentFolder .= $folder . DIRECTORY_SEPARATOR;
                            if (!file_exists($currentFolder)) {
                                mkdir($currentFolder, 0775);
                            }
                        }
                        $image->resize(new Box($width, $height))->save($thumbnail, ['quality' => 100]);
//                        $image->scaleImage($width, $height);
//                        $image->writeimage($thumbnail);
                        if (is_file($thumbnail)) {
                            return Yii::$app->params['media_thumb_path'] . DIRECTORY_SEPARATOR . $width . $path;
                        }
                        return Yii::$app->params['media_path'] . $path;
                    } else {
                        return self::generateDefaultThumb($width, $height, $type);
                    }
                }
            }
        } catch (Exception $e) {
            return self::generateDefaultThumb($width, $height, $type);
        }
        return self::generateDefaultThumb($width, $height, $type);
    }

    static function generateDefaultThumb($width, $height = 0, $type = "article") {
        $thumbnail = Yii::$app->params['image_thumb_path'] . DIRECTORY_SEPARATOR . $width . Yii::$app->params[$type . '_default_thumb_path'];
        if (is_file($thumbnail)) {
            return Yii::$app->params['media_thumb_path'] . DIRECTORY_SEPARATOR . $width . Yii::$app->params[$type . '_default_thumb_path'];
        } else {
            $filename = Yii::$app->params[$type . '_default_thumb_full_path'];
            if (is_file($filename)) {
                $imagine = Image::getImagine();
                $image = $imagine->open($filename);
                if ($height == 0) {
                    $size = $image->getSize();
                    $height = round($width * $size->getHeight() / $size->getWidth());
                }

                //create folder
                $pathToFile = $width . Yii::$app->params[$type . '_default_thumb_path'];
                $fileName = basename($pathToFile);
                $folders = explode(DIRECTORY_SEPARATOR, str_replace(DIRECTORY_SEPARATOR . $fileName, '', $pathToFile));
                $currentFolder = Yii::$app->params['image_thumb_path'] . DIRECTORY_SEPARATOR;
                foreach ($folders as $folder) {
                    $currentFolder .= $folder . DIRECTORY_SEPARATOR;
                    if (!file_exists($currentFolder)) {
                        mkdir($currentFolder, 0775);
                    }
                }
                $image->resize(new Box($width, $height))->save($thumbnail, ['quality' => 100]);
                if (is_file($thumbnail)) {
                    return Yii::$app->params['media_thumb_path'] . DIRECTORY_SEPARATOR . $width . Yii::$app->params[$type . '_default_thumb_path'];
                }
            }
        }
        return Yii::$app->params[$type . '_default_media_path'];
    }

}
