<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12-Jan-16
 * Time: 09:19
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\FormBuilderHelper;
use common\helpers\ProductItemHelper;
use common\models\ProductItemsBase;
use common\models\ProductItemUserBase;
use Yii;
use yii\base\Exception;

class ProductItemController extends ApiController
{
    public function actionLoadAttributes()
    {
        $data = null;
        try {
            $productId = Yii::$app->request->getBodyParam(ProductItemHelper::PRODUCT_ITEM_KEY);
            if ($productId) {
                $product = ProductItemsBase::selectByID($productId);
                if ($product) {
                    $data = [
                        FormBuilderHelper::PRODUCT_EXTEND => [
                            'items' => FormBuilderHelper::buildProductAttrForm($productId),
                        ],
                        FormBuilderHelper::PRICE_UNIT => [
                            'items' => FormBuilderHelper::buildProductPriceUnit($product)
                        ]
                    ];
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
}