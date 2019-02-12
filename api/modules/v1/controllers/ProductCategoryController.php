<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 17:34
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\BuySellHelper;
use common\helpers\FormBuilderHelper;
use common\helpers\ProductCategoryHelper;
use common\models\ProductCategoriesBase;
use common\models\ProductCatUserAttributeBase;
use common\models\ProductItemsBase;
use Yii;
use yii\base\Exception;

class ProductCategoryController extends ApiController
{
    public function actionLoadProduct()
    {
        try {
            $data = null;
            $categoryId = Yii::$app->request->getBodyParam(ProductCategoryHelper::PRODUCT_CATEGORY_KEY);
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
                    $data['items'] = [];
                    $data['items'] = BuySellHelper::addDefaultItem(false, $data['items'], false, Yii::t('api', 'Sản phẩm'));

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
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionLoadAttribute()
    {
        try {
            $data = null;
            $categoryId = Yii::$app->request->getBodyParam(ProductCategoryHelper::PRODUCT_CATEGORY_KEY);
            if ($categoryId) {
                $data = [
                    FormBuilderHelper::PRODUCT_EXTEND => [
                        'items' => FormBuilderHelper::buildCategoryAttrForm($categoryId),
                    ]
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
}