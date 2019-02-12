<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 03-Jan-16
 * Time: 17:05
 */

namespace common\helpers;


use api\models\Location;
use common\models\LocationBase;
use Yii;

class LocationHelper
{
    const PROVINCE_KEY = 'province_id';
    const DISTRICT_KEY = 'district_id';

    public static function getDefaultLocation()
    {
        $strLocationDefault = 'location_default';
        $session = Yii::$app->session;
        $locationDefault = $session->get($strLocationDefault);
//        $locationDefault = null;
        if (!$locationDefault) {
            $locationItem = LocationBase::getDefaultLocation();
            if ($locationItem) {
                /* @var LocationBase $locationItem */
                $session->set($strLocationDefault, $locationItem->location_id);
                return $locationItem->location_id;
            } else {
                $locationItem = LocationBase::getFirstLocation();
                if ($locationItem) {
                    /* @var LocationBase $locationItem */
                    $session->set($strLocationDefault, $locationItem->location_id);
                    return $locationItem->location_id;
                } else {
                    $locationId = Yii::$app->params['location_default'];
                    $session->set($strLocationDefault, $locationId);
                    return $locationId;
                }
            }
        }
        return $locationDefault;
    }

    public static function getDefaultLocationWeather()
    {
        $strLocationDefault = 'location_default_weather';
        $session = Yii::$app->session;
        $locationDefault = $session->get($strLocationDefault);
//        $locationDefault = null;
        if (!$locationDefault) {
            $locationItem = LocationBase::getDefaultLocation();
            if ($locationItem) {
                /* @var LocationBase $locationItem */
                $session->set($strLocationDefault, $locationItem->location_id);
                return $locationItem->location_id;
            } else {
                $locationItem = LocationBase::getFirstLocation();
                if ($locationItem) {
                    /* @var LocationBase $locationItem */
                    $session->set($strLocationDefault, $locationItem->location_id);
                    return $locationItem->location_id;
                } else {
                    $locationId = Yii::$app->params['location_default'];
                    $session->set($strLocationDefault, $locationId);
                    return $locationId;
                }
            }
        }
        return $locationDefault;
    }

    public static function getDefaultLocationClassified()
    {
        $strLocationDefault = 'location_default_classified';
        $session = Yii::$app->session;
        $locationDefault = $session->get($strLocationDefault);
//        $locationDefault = null;
        if (!$locationDefault) {
            $locationItem = LocationBase::getDefaultLocation();
            if ($locationItem) {
                /* @var LocationBase $locationItem */
                $session->set($strLocationDefault, $locationItem->location_id);
                return $locationItem->location_id;
            } else {
                $locationItem = LocationBase::getFirstLocation();
                if ($locationItem) {
                    /* @var LocationBase $locationItem */
                    $session->set($strLocationDefault, $locationItem->location_id);
                    return $locationItem->location_id;
                } else {
                    $locationId = Yii::$app->params['location_default'];
                    $session->set($strLocationDefault, $locationId);
                    return $locationId;
                }
            }
        }
        return $locationDefault;
    }

    public static function setDefaultLocation($locationId)
    {
        $session = Yii::$app->session;
        $session->set('location_default', $locationId);
    }

    public static function setDefaultLocationWeather($locationId)
    {
        $session = Yii::$app->session;
        $session->set('location_default_weather', $locationId);
    }

    public static function setDefaultLocationClassified($locationId)
    {
        $session = Yii::$app->session;
        $session->set('location_default_classified', $locationId);
    }

    public static function getProvinces()
    {
        $provinces = LocationBase::getProvince();
        $list = [];
        if (is_array($provinces) && count($provinces)) {
//            $list[0] = 'Tỉnh/Thành phố';
            foreach ($provinces as $province) {
                /* @var LocationBase $province */
                $list[$province->location_id] = $province->location_name;
            }
        }
        return $list;
    }

    public static function getProvincesClient()
    {
        $provinces = LocationBase::getProvince();
        $list = [];
        if (is_array($provinces) && count($provinces)) {
            foreach ($provinces as $province) {
                /* @var LocationBase $province */
                $list[] = [
                    "key" => $province->location_id,
                    "value" => $province->location_name,
                    "is_default" => false,
                ];
            }
            $list = array_values($list);
        }
        return $list;
    }
}