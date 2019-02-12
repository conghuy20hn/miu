<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12/5/2015
 * Time: 6:00 PM
 */

namespace wap\controllers;

use common\helpers\ArticleHelper;
use common\helpers\LocationHelper;
use common\helpers\WeatherHelper;
use common\models\HydrometeorologyBase;
use common\models\LocationBase;
use wap\models\Location;
use Yii;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\Cookie;

class WeatherController extends Controller
{

    public function addSessionProvince($locationId)
    {
        if ($locationId) {
            Yii::$app->session[WeatherHelper::CBX_PROVINCE] = $locationId;
            $cookie = new Cookie([
                'name' => WeatherHelper::CBX_PROVINCE,
                'value' => $locationId,
                'expire' => time() + 86400 * 365,
            ]);
            Yii::$app->getResponse()->getCookies()->add($cookie);
        }
    }

    public function actionHomeSearch()
    {
        $this->layout = false;

        $locationId = Yii::$app->request->getBodyParam(WeatherHelper::CBX_PROVINCE);
        $isHomeWeather = trim(Yii::$app->request->getBodyParam('isHomeWeather'));

        $province = LocationBase::selectByProvinceID($locationId);
        $date = Yii::$app->request->getBodyParam(WeatherHelper::DATE);
        $weather = [];
        if ($province) {
            $limit = Yii::$app->params['home_page']['num_of_weathers'];
            if ($isHomeWeather) {
                $limit = Yii::$app->params['weather_limit_day'];
            }
            LocationHelper::setDefaultLocationWeather($locationId);
            if (!$date) {
                if ($locationId) {
                    $weather = WeatherHelper::generateHomeWeather($locationId, false, true, $limit);
                }
            } else {
                if ($locationId) {
                    $weather = WeatherHelper::generateHomeWeather($locationId, $date, true, $limit);
                }
            }
        }
        return $this->render('_weather_item.twig', [
            'weather' => $weather,
        ]);
    }

    public function actionLoadDetail()
    {
        Yii::$app->view->title='Chi tiết Thời tiết - Thủy triều' . Yii::$app->params['host_title'];
        $data = [];
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
                $arTide = [
                    'title' => 'Thủy triều khu vực',
                    'location' => $location->location_full,
                    'tide_info' => $arrTideInfo,
                    'tide_detail' => $arrTideDetail,
                ];

                $data = [
                    'tide' => $arTide,
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
//                    'url' => [
//                        'url_next' => [
//                            'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('+1 day', strtotime($date)))),
//                            'url' => Url::to(['/weather/load-detail',
//                                'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('+1 day', strtotime($date)))]),
//                        ],
//                        'url_prev' => [
//                            'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('-1 day', strtotime($date)))),
//                            'url' => Url::to(['/weather/load-detail',
//                                'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('-1 day', strtotime($date)))]),
//                        ]
//                    ],
                ];
                if ($checkNextUrl) {
                    $data['url']['url_next'] = [
                        'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('+1 day', strtotime($date)))),
                        'url' => Url::to(['/weather/load-detail',
                            'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('+1 day', strtotime($date)))]),
                    ];
                }

                if ($checkPreUrl) {
                    $data['url']['url_prev'] = [
                        'title' => WeatherHelper::convertDateToString(date('Y-m-d', strtotime('-1 day', strtotime($date)))),
                        'url' => Url::to(['/weather/load-detail',
                            'location_id' => $location_id, 'date' => date('Y-m-d', strtotime('-1 day', strtotime($date)))]),
                    ];
                }
            }
        }

        return $this->render('weather_detail.twig', [
            'data' => $data,
        ]);
    }

    public function actionIndex()
    {
        Yii::$app->view->title='Thông tin thời tiết' . Yii::$app->params['host_title'];
//        Yii::$app->session->set('weather_default_location', false);
        if (Yii::$app->request->post()) {
            $provinceId = Yii::$app->request->getBodyParam(WeatherHelper::CBX_PROVINCE);
            $province = LocationBase::selectByProvinceID($provinceId);
            if ($province) {
                LocationHelper::setDefaultLocationWeather($provinceId);
                $weather = WeatherHelper::generateHomeWeather($provinceId, false, true, Yii::$app->params['weather_limit_day']);
                $data['data'] = $weather;
                $categoryId = Yii::$app->params['article_home_weather']['category_id'];
                $data['articles'] = ArticleHelper::generateArticleWeather($categoryId, 1, false, true);
            } else {
                return $this->render('empty.twig');
            }
        } else {
            $provinceId = LocationHelper::getDefaultLocationWeather();
            if ($provinceId) {
                $weather = WeatherHelper::generateHomeWeather($provinceId, false, true, Yii::$app->params['weather_limit_day']);
                $data['data'] = $weather;
                $categoryId = Yii::$app->params['article_home_weather']['category_id'];
                $data['articles'] = ArticleHelper::generateArticleWeather($categoryId, 1, false, true);
            } else {
                return $this->render('empty.twig');
            }
        }

        return $this->render('index.twig', [
            'control' => $data['data']['control'][0]['items'],
            'weather' => $data['data']['data'],
            'data' => $data,
            'articles' => $data['articles'],
        ]);
    }

}
