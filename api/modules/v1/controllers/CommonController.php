<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/20/2015
 * Time: 9:26 PM
 */

namespace api\modules\v1\controllers;


use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use api\modules\v1\models\LocationV1;
use common\helpers\ArticleHelper;
use common\helpers\BuySellHelper;
use common\helpers\Helpers;
use common\helpers\LocationHelper;
use common\helpers\MenuHelper;
use common\helpers\VideoHelper;
use common\models\LocationBase;
use Yii;
use yii\base\Exception;

class CommonController extends \api\controllers\ApiController
{
    public static $constSearchPage = 'search_page';

    public function actionGetDefaultLocation() {
        try {
            $data = [];
            $data['location_id'] = LocationHelper::getDefaultLocation();
        }  catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionGetLocation()
    {
        try {
            $data = null;
            $locations = LocationV1::getProvince();
            $data['default'] = 0;
            $data['locations'] = [];
            $isFound = false;
            foreach ($locations as $location) {
                /* @var LocationV1 $location */
                $data['locations'][] = [
                    'key' => $location->location_id,
                    'value' => $location->location_name,
                ];
                if (!$isFound && $location->is_default) {
                    $isFound = true;
                    $data['default'] = $location->location_id;
                }
            }
            if (!$data['default'] && count($data['locations'])) {
                $data['default'] = $data['locations'][0]['id'];
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionGetDistrict()
    {
        try {
            $data = null;
            $provinceId = Yii::$app->request->getBodyParam(LocationHelper::PROVINCE_KEY);
            if ($provinceId) {
                $province = LocationBase::selectByProvinceID($provinceId);
                if ($province) {
                    $locations = LocationBase::getDistrict($provinceId);
                    $data['items'] = [];
                    foreach ($locations as $location) {
                        /* @var LocationV1 $location */
                        $data['items'][] = [
                            'key' => $location->location_id,
                            'value' => $location->location_name,
                            'is_default' => false,
                        ];
                    }
                    $data['items'] = BuySellHelper::addDefaultItem(false, $data['items'], false, Yii::t('api', 'Quận/Huyện/TP'));
                }
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionSearch()
    {
        try {
            $data = null;
            $keyword = trim(Yii::$app->request->getBodyParam('keyword'));
            if (!$keyword) {
                $data = [
                    'error-control' => BuySellHelper::TXT_SEARCH
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::SEARCH_REQUIRED,
                    $data
                );
            }

            if ($keyword && Helpers::getStrLen($keyword) > 255) {
                $data = [
                    'error-control' => BuySellHelper::TXT_SEARCH
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::SEARCH_MAXLENGTH,
                    $data
                );
            }


            if ($keyword) {
                $limitArticle = Yii::$app->params['search_page']['num_of_article'];
                $limitVideo = Yii::$app->params['search_page']['num_of_video'];

                $offset = 0;
                $data['keyword'] = $keyword;
                $data['result'] = [];
                $data['result'][] = [
                    'title' => Yii::t('api', 'Tin tức'),
                    'type' => 'news',
                    'items' => ArticleHelper::searchArticle(self::removeSign($keyword), $limitArticle, $offset)
                ];
                $data['result'][] = [
                    'title' => Yii::t('api', 'Video'),
                    'type' => 'video',
                    'items' => VideoHelper::searchVideo(self::removeSign($keyword), $limitVideo, $offset)
                ];
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionGetTopMenu()
    {
        try {
            $data = MenuHelper::getTopMenu();
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionGetLeftMenu()
    {
        try {
            $data = MenuHelper::getLeftMenu();
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }
	
	
	public static function removeSign($str)
    {
        $hasSign = array(
            'à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ', '&agrave;', '&aacute;', '&acirc;', '&atilde;',
            'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ', '&egrave;', '&eacute;', '&ecirc;',
            'ì', 'í', 'ị', 'ỉ', 'ĩ', '&igrave;', '&iacute;', '&icirc;',
            'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', 'ố', 'ó',
            'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ', '&ugrave;', '&uacute;',
            'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ', '&yacute;',
            'đ', '&eth;',
            'À', 'Á', 'Ạ', 'Ả', 'Ã', 'Â', 'Ầ', 'Ấ', 'Ậ', 'Ẩ', 'Ẫ', 'Ă', 'Ằ', 'Ắ', 'Ặ', 'Ẳ', 'Ẵ', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;',
            'È', 'É', 'Ẹ', 'Ẻ', 'Ẽ', 'Ê', 'Ề', 'Ế', 'Ệ', 'Ể', 'Ễ', '&Egrave;', '&Eacute;', '&Ecirc;',
            'Ì', 'Í', 'Ị', 'Ỉ', 'Ĩ', '&Igrave;', '&Iacute;', '&Icirc;',
            'Ò', 'Ó', 'Ọ', 'Ỏ', 'Õ', 'Ô', 'Ồ', 'Ố', 'Ộ', 'Ổ', 'Ỗ', 'Ơ', 'Ờ', 'Ớ', 'Ợ', 'Ở', 'Ỡ', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', 'ố', 'ó',
            'Ù', 'Ú', 'Ụ', 'Ủ', 'Ũ', 'Ư', 'Ừ', 'Ứ', 'Ự', 'Ử', 'Ữ', '&Ugrave;', '&Uacute;',
            'Ỳ', 'Ý', 'Ỵ', 'Ỷ', 'Ỹ', '&Yacute;',
            'Đ', '&ETH;',
        );
        $noSign = array(
            'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
            'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
            'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i',
            'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
            'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
            'y', 'y', 'y', 'y', 'y', 'y',
            'd', 'd',
            'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
            'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
            'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I',
            'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'o', 'o',
            'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
            'Y', 'Y', 'Y', 'Y', 'Y', 'Y',
            'D', 'D'
        );

        $str = str_replace($hasSign, $noSign, $str);
        return $str;
    }
}