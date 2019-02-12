<?php

namespace wap\controllers;

use common\helpers\ArticleHelper;
use common\helpers\LocationHelper;
use common\helpers\PriceListHelper;
use common\helpers\VideoHelper;
use common\helpers\WeatherHelper;
use common\libs\HomeTemplateType;
use Yii;
use yii\web\Controller;

/**
 * Site controller
 */
class SiteController extends Controller
{

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        Yii::$app->view->title='Trang chủ' . Yii::$app->params['host_title'];
        $data = [];
        $mainTemplate = Yii::$app->params['home_page']['main_template'];
        $twoTemplate = Yii::$app->params['home_page']['2nd_template'];
        $mainTemplate = json_decode($mainTemplate);
        $twoTemplate = json_decode($twoTemplate);
        foreach ($mainTemplate as $item) {
            switch ($item->type) {
                case HomeTemplateType::Banner:
                    $data[] = ArticleHelper::generateBanner();
                    break;
                case HomeTemplateType::PriceList:
                    $data[] = PriceListHelper::generatePriceList();
                    break;
                case HomeTemplateType::Weather:
                    $data[] = WeatherHelper::generateHomeWeather(LocationHelper::getDefaultLocationWeather(), false, true, Yii::$app->params['home_page']['num_of_weathers']);
                    break;
                case HomeTemplateType::News:
                    $data[] = ArticleHelper::generateHomeNews($item->cat_id, $item->cat_childs);
                    break;
                case HomeTemplateType::Video:
                    $data[] = VideoHelper::generateVideo($item->cat_id);
                    break;
            }
        }
        foreach ($twoTemplate as $item) {
            switch ($item->type) {
                case HomeTemplateType::Banner:
                    $data[] = ArticleHelper::generateBanner();
                    break;
                case HomeTemplateType::PriceList:
                    $data[] = PriceListHelper::generatePriceList();
                    break;
                case HomeTemplateType::Weather:
                    $data[] = WeatherHelper::generateHomeWeather(LocationHelper::getDefaultLocationWeather(), false, true, Yii::$app->params['home_page']['num_of_weathers']);
                    break;
                case HomeTemplateType::News:
                    $data[] = ArticleHelper::generateHomeNews($item->cat_id, $item->cat_childs);
                    break;
                case HomeTemplateType::Video:
                    $data[] = VideoHelper::generateVideo($item->cat_id);
                    break;
            }
        }
        $formWeather = WeatherHelper::buildSearchForm();
        return $this->render('index.twig', [
            'mainTemplate' => $data,
            'formWeather' => $formWeather,
        ]);
    }

}
