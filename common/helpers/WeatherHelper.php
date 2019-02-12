<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 28-Dec-15
 * Time: 18:51
 */

namespace common\helpers;

use common\models\HydrometeorologyBase;
use common\models\LocationBase;
use DateTime;
use Yii;
use yii\helpers\Url;

class WeatherHelper {

    const info_temp_day = 'temp_day';
    const info_temp_min = 'temp_min';
    const info_temp_max = 'temp_max';
    const info_temp_night = 'temp_night';
    const info_temp_eve = 'temp_eve';
    const info_temp_morn = 'temp_morn';
    const info_pressure = 'pressure';
    const info_humidity = 'humidity';
    const info_weather_main = 'weather_main';
    const info_weather_description = 'weather_description';
    const info_weather_icon = 'weather_icon';
    const info_speed = 'speed';
    const info_deg = 'deg';
    const info_clouds = 'clouds';
    const info_rain = 'rain';
    const detail_main_temp = 'main_temp';
    const detail_main_temp_min = 'main_temp_min';
    const detail_main_pressure = 'main_pressure';
    const detail_main_sea_level = 'main_sea_level';
    const detail_main_grnd_level = 'main_grnd_level';
    const detail_main_humidity = 'main_humidity';
    const detail_weather_main = 'weather_main';
    const detail_weather_description = 'weather_description';
    const detail_weather_icon = 'weather_icon';
    const detail_clouds_all = 'clouds_all';
    const detail_wind_speed = 'wind_speed';
    const detail_wind_deg = 'wind_deg';
    const detail_rain = 'rain';
    const detail_rain_1h = '1h';
    const detail_rain_3h = '3h';
    const detail_dt_txt = 'dt_txt';
    const ctl_text_box = 'text_box';
    const ctl_multi = 'multi';
    const ctl_combo_box = 'combo_box';
    const ctl_date_picker = 'date_picker';
    const ctl_date_range = 'date_range';
    const ctl_extend = 'extend_item';
    const TXT_SEARCH = 'keyword';
    const CBX_PROVINCE = 'province';
    const CBX_DISTRICT = 'district';
    const PRODUCT_CATEGORY = 'category_product';
    const PRODUCT_ITEM = 'product';
    const START_TIME = 'start_time';
    const END_TIME = 'end_time';
    const DATE = 'date';

    public static function convertF2C($f) {
        return round(($f - 32) / 1.8);
    }

    public static function convertDegreeToDirection($bearing) {
        $direction = '';
        $cardinalDirections = array(
            'B' => array(337.5, 22.5),
            'ĐB' => array(22.5, 67.5),
            'Đ' => array(67.5, 112.5),
            'ĐN' => array(112.5, 157.5),
            'N' => array(157.5, 202.5),
            'TN' => array(202.5, 247.5),
            'T' => array(247.5, 292.5),
            'TB' => array(292.5, 337.5)
        );
        foreach ($cardinalDirections as $dir => $angles) {
            if ($bearing >= $angles[0] && $bearing < $angles[1]) {
                $direction = $dir;
                break;
            }
        }
        return $direction;
    }

    public static function convertMStoKmH($value) {
        return round($value / 1000 * 60, 2);
    }

    public static function convertDateToString($date) {
        $cDate = strtotime($date);
        if (date('Y-m-d', time()) == date('Y-m-d', $cDate)) {
            return Yii::t('api', 'Hôm nay');
        } else if (date('Y-m-d', (time() + 24 * 60 * 60)) == date('Y-m-d', $cDate)) {
            return Yii::t('api', 'Ngày mai');
        } else if (date('Y-m-d', (time() + 2 * 24 * 60 * 60)) == date('Y-m-d', $cDate)) {
            return Yii::t('api', 'Ngày kia');
        } else {
            return date('d/m', $cDate);
        }
    }

    public static function getHomeWeather($locationId, $limit, $startDate = false, $endDate = false, $simple = false) {
        $location = LocationBase::selectByID($locationId);
        if ($location) {
            $checkDate = false;
            /* @var LocationBase $location */
            if (!$startDate) {
                $startDate = time();
            } else {
                $checkDate = true;
                $startDate = strtotime($startDate);
            }
            if (!$endDate) {
                $endDate = strtotime($limit > 1 ? '+' . $limit . ' days' : '+' . $limit . ' day');
            } else {
                $endDate = strtotime($endDate);
            }
            $weathers = HydrometeorologyBase::getByLocationId($locationId, $startDate, $endDate, $limit);
//            var_dump(count($weathers));die('aaa');
            $arrWeather = [];
            foreach ($weathers as $weather) {
                /* @var HydrometeorologyBase $weather */
                $weatherInfo = $weather->weather_info;
                $tideInfo = $weather->tide_info;
                if ($weatherInfo) {
//                if ($weatherInfo || $tideInfo) {
                    $arrWeather[] = self::generateInfoWeather($weather, $checkDate, $simple);
                }
            }
//            var_dump($arrWeather);die;
            return $arrWeather;
        }
        return [];
    }

    /**
     * @param HydrometeorologyBase $weather
     * @return array
     */
    public static function generateInfoWeather($weather, $checkDate = false, $simple = false) {
        /* @var HydrometeorologyBase $weather */
        if ($weather) {
            $weatherInfo = $weather->weather_info;
            $tideInfo = $weather->tide_info;
            $weather_detail = json_decode($weather->weather_detail);
            if ($weatherInfo) {
//            if ($weatherInfo || $tideInfo) {
                $weatherInfo = json_decode($weatherInfo, true);
                $tideInfo = json_decode($tideInfo, true);
                if ($weatherInfo) {
//                if ($weatherInfo || $tideInfo) {
                    $arrReturn = [
                        'date' => $checkDate ? 'Ngày ' . date('d/m/Y', strtotime($weather->date)) : self::convertDateToString($weather->date),
                        'temp_low' => ceil($weatherInfo[self::info_temp_min]) . '°С',
                        'temp_high' => ceil($weatherInfo[self::info_temp_max]) . '°С',
                        'image_path' => $weatherInfo[self::info_weather_icon] ? str_replace('{weather_code}', $weatherInfo[self::info_weather_icon], Yii::$app->params['weather_img_template']) : '',
                    ];
                    if ($weather_detail) {
                        $arrReturn['url'] = $simple ? Url::to(['/weather/load-detail',
                                    'location_id' => $weather->location_id, 'date' => $weather->date]) : Url::to(['/v1/weather/load-detail',
                                    'location_id' => $weather->location_id, 'date' => $weather->date]);
                    }
                    return $arrReturn;
                }
            }
        }
        return [];
    }

    /**
     * @param HydrometeorologyBase $weather
     * @return array
     */
    public static function generateDetailWeather($weather) {

        if ($weather) {
            $weatherDetail = $weather->weather_detail;
            $tideDetail = $weather->tide_detail;
            if ($weatherDetail) {
//            if ($weatherDetail && $tideDetail) {
                $weatherDetail = json_decode($weatherDetail, true);
                $tideDetail = json_decode($tideDetail, true);
                if ($weatherDetail) {

//                if ($weatherDetail && $tideDetail) {
                    $weathers = [];
                    $step = 3; // hour
                    $index = 0; //start 00:00
                    $datetime = new DateTime();
                    while ($index <= (24 - $step)) {
                        $datetime->setTime($index, 0, 0);
                        $weatherIndex = $datetime->format('H:i:s');
                        if ($weatherDetail[$weatherIndex]) {
//                        if ($weatherDetail[$weatherIndex] || $tideDetail[$index]) {
                            $rain = '';
                            $rainUnit = '';
                            $description = $weatherDetail[$weatherIndex][self::detail_weather_description];
                            if (count($weatherDetail[$weatherIndex][self::detail_rain])) {
                                if (in_array(self::detail_rain_1h, array_keys($weatherDetail[$weatherIndex][self::detail_rain]))) {
                                    $rain = $weatherDetail[$weatherIndex][self::detail_rain][self::detail_rain_1h];
                                    $rainUnit = self::detail_rain_1h;
                                } else if (in_array(self::detail_rain_3h, array_keys($weatherDetail[$weatherIndex][self::detail_rain]))) {
                                    $rain = $weatherDetail[$weatherIndex][self::detail_rain][self::detail_rain_3h];
                                    $rainUnit = self::detail_rain_3h;
                                }
                            }
                            $icon = ($weatherDetail[$weatherIndex][self::detail_weather_icon]) ?
                                    str_replace('{weather_code}', $weatherDetail[$weatherIndex][self::detail_weather_icon], Yii::$app->params['weather_img_template']) : '';
                            $weathers[] = [
                                'intro' => [
                                    'time' => $datetime->format('H:i'),
                                    'icon' => $icon,
                                    'temp' => (string) ceil($weatherDetail[$weatherIndex][self::detail_main_temp]) . '°С',
                                    'rain' => ((string) $rain != '') ? (string) $rain . 'mm/' . $rainUnit : 'N/A',
                                    'description' => ((string) $description != '') ? (string) Yii::$app->params['weather_description'][str_replace(' ', '_', $description)] : '',
                                ],
                                'detail' => [
                                    [
                                        'title' => Yii::t('api', 'Độ ẩm'),
                                        'value' => $weatherDetail[$weatherIndex][self::detail_main_humidity] . '%',
                                    ], [
                                        'title' => Yii::t('api', 'Mật độ mây'),
                                        'value' => $weatherDetail[$weatherIndex][self::detail_clouds_all] . '%',
                                    ], [
                                        'title' => Yii::t('api', 'Gió'),
                                        'value' => self::convertMStoKmH($weatherDetail[$weatherIndex][self::detail_wind_speed])
                                        . self::convertDegreeToDirection($weatherDetail[$weatherIndex][self::detail_wind_deg]),
                                    ], [
                                        'title' => Yii::t('api', 'Áp suất'),
                                        'value' => $weatherDetail[$weatherIndex][self::detail_main_pressure] . 'hPa',
                                    ], [
                                        'title' => Yii::t('api', 'Lượng mưa'),
                                        'value' => ((string) $rain != '') ? $rain . 'mm/' . $rainUnit : "N/A",
                                    ],
                                ]
                            ];
                        }
                        $index += $step;
                    }
                    return $weathers;
                }
            }
        }
        return [];
    }

    public static function generateHomeWeatherSearch($locationId = false, $startDate = false, $simple = false, $limit = 5) {
        if (!$locationId) {
            $locationId = LocationHelper::getDefaultLocationWeather();
        }
        if (!$startDate && $startDate === false) {
            $data = self::getHomeWeather($locationId, $limit, false, false, $simple);
        } else {
            $data = self::getHomeWeather($locationId, $limit, $startDate, $startDate, $simple);
        }
        return [
            'type' => 'weather',
            'data' => $data,
        ];
    }

    public static function generateHomeWeather($locationId = false, $startDate = false, $simple = false, $limit = false) {
        if (!$locationId) {
            $locationId = LocationHelper::getDefaultLocationWeather();
        }
        if (!$limit) {
            $limit = Yii::$app->params['weather_limit_day'];
        }
        if (!$startDate && $startDate === false) {
            $data = self::getHomeWeather($locationId, $limit, false, false, $simple);
        } else {
            $data = self::getHomeWeather($locationId, $limit, $startDate, $startDate, $simple);
        }
        return [
            'type' => 'weather',
            'title' => 'Thời tiết',
            'data' => $data,
            'control' => self::buildSearchForm(),
            'url' => url::to('/v1/weather-home'),
            'title' => Yii::t('api', 'Thời tiết'),
            'url_search' => [
                'url' => url::to('/v1/weather/home-search'),
                'send-obj' => 'key',
            ],
        ];
    }

    public static function buildSearchForm($simple = false) {
        $locationDefault = LocationHelper::getDefaultLocationWeather();
        $simple ? $location = LocationHelper::getProvinces() : $location = LocationHelper::getProvincesClient();
        $index = 0;
        if ($locationDefault) {
            foreach ($location as $key => $val) {
                if ($val['key'] == $locationDefault) {
                    $index = $key;
                    break;
                }
            }
        }
        return [
            [
                'type' => self::ctl_multi,
                'items' => [
                    [
                        'type' => self::ctl_combo_box,
                        'place_holder' => Yii::t('wap', 'Chọn tỉnh'),
                        'title' => Yii::t('wap', 'Chọn tỉnh'),
                        'name' => self::CBX_PROVINCE,
                        'option' => [
                            'send-obj' => 'key',
                            'data' => self::addDefaultItem($simple, $simple ? LocationHelper::getProvinces() : LocationHelper::getProvincesClient(), $index),
                            'send-name' => self::CBX_PROVINCE,
                            'url' => url::to('/v1/weather/home-search'),
                        ]
                    ]
                ]
            ]
        ];
    }

    public static function addDefaultItem($simple, $arr, $index = false) {
        if ($index === false) {
            if (!$simple) {
                array_unshift($arr, [
                    "key" => "",
                    "value" => Yii::t('api', "Tất cả"),
                    "is_default" => true,
                ]);
            }
        } else {
            if ($arr[$index] && !$simple) {
                $arr[$index]['is_default'] = true;
            }
        }
        return $arr;
    }

}
