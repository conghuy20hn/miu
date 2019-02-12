<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 28-Dec-15
 * Time: 10:42
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\ArticleHelper;
use common\helpers\PriceListHelper;
use common\helpers\VideoHelper;
use common\helpers\WeatherHelper;
use common\libs\HomeTemplateType;
use Yii;

class HomeController extends ApiController
{
    public function actionGetMain()
    {
        $data = null;
        $mainTemplate = Yii::$app->params['home_page']['main_template'];
        $mainTemplate = json_decode($mainTemplate);
        foreach ($mainTemplate as $item) {
            switch ($item->type) {
                case HomeTemplateType::Banner:
                    $data[] = ArticleHelper::generateBanner();
                    break;
                case HomeTemplateType::PriceList:
                    $data[] = PriceListHelper::generatePriceList();
                    break;
                case HomeTemplateType::Weather:
                    $data[] = WeatherHelper::generateHomeWeather(false, false, false, Yii::$app->params['home_page']['num_of_weathers']);
                    break;
                case HomeTemplateType::News:
                    $data[] = ArticleHelper::generateHomeNews($item->cat_id, $item->cat_childs);
                    break;
                case HomeTemplateType::Video:
                    $data[] = VideoHelper::generateVideo($item->cat_id);
                    break;
            }
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionGetLazyLoad()
    {
        $data = null;
        $mainTemplate = Yii::$app->params['home_page']['2nd_template'];
        $mainTemplate = json_decode($mainTemplate);
        foreach ($mainTemplate as $item) {
            switch ($item->type) {
                case HomeTemplateType::Banner:
                    $data[] = ArticleHelper::generateBanner();
                    break;
                case HomeTemplateType::PriceList:
                    $data[] = PriceListHelper::generatePriceList();
                    break;
                case HomeTemplateType::Weather:
                    $data[] = WeatherHelper::generateHomeWeather(false, false, false, Yii::$app->params['home_page']['num_of_weathers']);
                    break;
                case HomeTemplateType::News:
                    $data[] = ArticleHelper::generateHomeNews($item->cat_id, $item->cat_childs);
                    break;
                case HomeTemplateType::Video:
                    $data[] = VideoHelper::generateVideo($item->cat_id);
                    break;
            }
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }
}