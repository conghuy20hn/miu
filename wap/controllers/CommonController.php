<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/20/2015
 * Time: 9:26 PM
 */

namespace wap\controllers;


use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\BuySellHelper;
use common\helpers\FormBuilderHelper;
use common\helpers\LocationHelper;
use common\helpers\MenuHelper;
use common\helpers\ProductCategoryHelper;
use common\models\LocationBase;
use common\models\ProductCategoriesBase;
use common\models\ProductItemsBase;
use Yii;
use yii\base\Exception;
use yii\web\Controller;

class CommonController extends Controller
{
    public function actionGetDistrict()
    {
        $this->layout = false;
        $data = [];
        $data['items'] = [];
        $provinceId = Yii::$app->request->getQueryParam(LocationHelper::PROVINCE_KEY);
        if ($provinceId) {
            $province = LocationBase::selectByID($provinceId);
            /*if ($province) {
                $locations = LocationBase::getDistrict($provinceId);
                foreach ($locations as $location) {

                    $data['items'][] = [
                        'key' => $location->location_id,
                        'value' => $location->location_name,
                    ];
                }
            }*/
            if ($province) {
                $locations = LocationBase::getDistrict($provinceId);
                $data['items'] = [];
                foreach ($locations as $location) {
                    /* @var LocationBase $location */
                    $data['items'][] = [
                        'key' => $location->location_id,
                        'value' => $location->location_name,
                        'is_default' => false,
                    ];
                }

            }
        }
        $data['items'] = BuySellHelper::addDefaultItem(false, $data['items'], false, Yii::t('api', 'Quận/Huyện/TP'));

        return json_encode($data);
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


    public function actionLoadProduct()
    {
        $this->layout = false;
        $data = [];
        $data['items'] = [];
        $categoryId = Yii::$app->request->getQueryParam(ProductCategoryHelper::PRODUCT_CATEGORY_KEY);

        $data['items'] = BuySellHelper::addDefaultItem(false, $data['items'], false, 'Sản phẩm');
        if ($categoryId) {
            $category = ProductCategoriesBase::selectByID($categoryId);
            if ($category) {
                /* @var ProductCategoriesBase $category */
                if ($category->child_list) {
                    $categoryIds = explode(',', $category->child_list);
                } else {
                    $categoryIds = $categoryId;
                }
                $products = ProductItemsBase::getByCategoryId($categoryIds);

                foreach ($products as $product) {
                    /* @var ProductItemsBase $product */
                    $data['items'][] = [
                        'key' => $product->id,
                        'value' => $product->name,
                        'is_default' => false,
                    ];
                }
            }
        }
        return json_encode($data);
    }

    public function actionLoadProductAttr()
    {
        $this->layout = false;
        $items = [];
        $arrName = [];

        $categoryId = Yii::$app->request->getQueryParam(ProductCategoryHelper::PRODUCT_CATEGORY_KEY);
        if ($categoryId) {
            $dataItem = [
                FormBuilderHelper::PRODUCT_EXTEND => [
                    'items' => FormBuilderHelper::buildCategoryAttrForm($categoryId),
                ]
            ];
            if (count($dataItem['product_extend']['items'])) {
                foreach ($dataItem['product_extend']['items'] as $val) {
                    $items[] = $this->render('attrItem.twig', ['item' => $val]);
                    $arrName[] = $val['name'];
                }
            }
        }

        $data['items'] = $items;
        $data['arrName'] = $arrName;
        return json_encode($data);
    }
}