<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 13-Jan-16
 * Time: 19:33
 */

namespace api\modules\v1\controllers;

use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\ArticleHelper;
use common\helpers\LocationHelper;
use common\helpers\PriceListHelper;
use common\helpers\WeatherHelper;
use common\models\HydrometeorologyBase;
use common\models\LocationBase;
use common\models\VtArticleCategoriesBase;
use Yii;
use yii\base\Exception;
use yii\helpers\Url;

class WeatherController extends ApiController
{

    public function actionHome()
    {
        $data = [];
        try {
            $weather = WeatherHelper::generateHomeWeather(false, false, false, Yii::$app->params['weather_limit_day']);
            $data['data'] = $weather;
            $categoryId = Yii::$app->params['article_home_weather']['category_id'];
            /* @var VtArticleCategoriesBase $category */
            $category = VtArticleCategoriesBase::selectByID($categoryId);
            if ($category) {
                $data['display_image'] = $category->attr & ArticleHelper::DISPLAY_IMAGE;
                $data['articles'] = ArticleHelper::generateArticleWeather($categoryId);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS, $data
        );
    }

    public function actionHomeSearch()
    {
        $data = [];
        try {
            $locationId = trim(Yii::$app->request->getBodyParam(WeatherHelper::CBX_PROVINCE));
            $isHomeWeather = trim(Yii::$app->request->getBodyParam('isHomeWeather'));

            if ($locationId) {
                $limit = Yii::$app->params['home_page']['num_of_weathers'];
                if ($isHomeWeather) {
                    $limit = Yii::$app->params['weather_limit_day'];
                }

                $province = LocationBase::selectByID($locationId);
                /* @var LocationBase $province */
                if (!$province) {
                    $data = [
                        'error-control' => WeatherHelper::CBX_PROVINCE,
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::WEATHER_PROVINCE_INVALID, $data
                    );
                }
            } else {
                $data = [
                    'error-control' => WeatherHelper::CBX_PROVINCE,
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::WEATHER_PROVINCE_REQUIRED, $data
                );
            }

            $date = Yii::$app->request->getBodyParam(WeatherHelper::DATE);
            if (!$date) {
                if ($locationId) {
                    $weather = WeatherHelper::generateHomeWeatherSearch($locationId, false, false, $limit);
                    $data['data'] = $weather;
                }
            } else {
                if ($locationId) {
                    $weather = WeatherHelper::generateHomeWeatherSearch($locationId, $date, false, $limit);
                    $data['data'] = $weather;
                }
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS, $data
        );
    }

    public function actionLoadDetail()
    {
        try {
            $data['items'] = [];
            $location_id = Yii::$app->request->getQueryParam('location_id');
            $date = Yii::$app->request->getQueryParam('date');
            $date = date('Y-m-d', strtotime($date));
            $location = LocationBase::selectByID($location_id);
            if ($location) {
                /* @var LocationBase $location */
                $weather = HydrometeorologyBase::getDetail($location_id, $date);
                /* @var HydrometeorologyBase $weatherNextDate */
                $weatherNextDate = HydrometeorologyBase::getDetail($location_id, date('Y-m-d', strtotime('+1 day', strtotime($date))));
                $checkNextUrl = false;
                if ($weatherNextDate) {
                    if (json_decode($weatherNextDate->weather_detail)) {
                        $checkNextUrl = true;
                    }
                }
                /* @var HydrometeorologyBase $weatherPreDate */
                $weatherPreDate = HydrometeorologyBase::getDetail($location_id, date('Y-m-d', strtotime('-1 day', strtotime($date))));
                $checkPreUrl = false;
                if ($weatherPreDate) {
                    if (json_decode($weatherPreDate->weather_detail)) {
                        $checkPreUrl = true;
                    }
                }
                /* @var HydrometeorologyBase $weather */
                if ($weather) {
                    $arrTideInfo = [];
                    $arrTideDetail = [];
                    // thong tin thuy trieu cao nhat/thap nhat
                    if ($weather->tide_info) {
                        $tideInfo = $weather->tide_info;
                        $tideInfo = json_decode($tideInfo, true);
                        $arrTideInfo = [
                            'tide_high' => [
                                'title' => 'Cao nhất (cm)',
                                'value' => array_values($tideInfo)[1],
                                'time' => '(' . array_keys($tideInfo)[1] . ' giờ)',
                            ],
                            'tide_low' => [
                                'title' => 'Thấp nhất (cm)',
                                'value' => array_values($tideInfo)[0],
                                'time' => '(' . array_keys($tideInfo)[0] . ' giờ)',
                            ]
                        ];
                    }
                    // thong tin thuy trieu detail
                    if ($weather->tide_detail) {
                        $tideDetail = $weather->tide_detail;
                        $tideDetail = json_decode($tideDetail, true);
                        foreach ($tideDetail as $key => $item) {
                            $arrTideDetail[] = [
                                'time' => $key,
                                'value' => $item,
                            ];
                        }
                    }

                    $data = [
//                        'tide' => $arTide,
                        'location_name' => $location->location_full,
                        'date' => date('d-m-Y', strtotime($date)),
//                        'label' => Yii::t('api', 'Ng') . ' ' . date('d-m-Y', strtotime($date)).'|'. ''.'|'.Yii::t('api', 'NH.ĐỘ').'|'.Yii::t('api', 'LG.MƯA'),
                        'label' => [
                            'label0' => Yii::t('api', 'Ng') . ' ' . date('d-m-Y', strtotime($date)),
                            'label1' => '',
                            'label2' => Yii::t('api', 'NH.ĐỘ'),
                            'label3' => Yii::t('api', 'LG.MƯA'),
                        ],
                        'items' => WeatherHelper::generateDetailWeather($weather),
//                        'url' => [
//                            'url_next' => [
//                                'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('+1 day', strtotime($date)))),
//                                'url' => Url::to(['/v1/weather/load-detail',
//                                    'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('+1 day', strtotime($date)))]),
//                            ],
//                            'url_prev' => [
//                                'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('-1 day', strtotime($date)))),
//                                'url' => Url::to(['/v1/weather/load-detail',
//                                    'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('-1 day', strtotime($date)))]),
//                            ]
//                        ],
                    ];

                    if ($arrTideInfo && $arrTideDetail) {
                        $arTide = [
                            'title' => 'Thủy triều khu vực',
                            'location' => $location->location_full,
                            'tide_info' => $arrTideInfo,
                            'tide_detail' => $arrTideDetail,
                        ];
                        $data['tide'] = $arTide;
                    }

                    if ($checkNextUrl) {
                        $data['url']['url_next'] = [
                            'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('+1 day', strtotime($date)))),
                            'url' => Url::to(['/v1/weather/load-detail',
                                'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('+1 day', strtotime($date)))]),
                        ];
                    }

                    if ($checkPreUrl) {
                        $data['url']['url_prev'] = [
                            'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('-1 day', strtotime($date)))),
                            'url' => Url::to(['/v1/weather/load-detail',
                                'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('-1 day', strtotime($date)))]),
                        ];
                    }
                }
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS, $data
        );
    }

}
