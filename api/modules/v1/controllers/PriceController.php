<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 16:39
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\BuySellHelper;
use common\helpers\ImageHelper;
use common\helpers\LocationHelper;
use common\helpers\PriceListHelper;
use common\helpers\ProductCategoryHelper;
use common\models\LocationBase;
use common\models\ProductCategoriesBase;
use common\models\ProductItemPricelistBase;
use common\models\ProductItemsBase;
use Yii;
use yii\base\Exception;
use yii\helpers\Url;

class PriceController extends ApiController
{
    /**
     * @return array
     */
    public function actionHome()
    {
//        try {
        $data = [
            'search-form' => [
                'control' => PriceListHelper::buildSearchForm(),
                'csrf_token' => Yii::$app->security->generateRandomString(32),
                'url' => Url::to(['/v1/price/search']),
            ],
        ];
        $listCategory = BuySellHelper::addDefaultItem(false, ProductCategoryHelper::buildComboBoxClient(), 0);


        $limit = Yii::$app->params['price_list_page']['num_of_item'];

        $dataPricelist = ProductItemPricelistBase::searchPricelistNew(false, $listCategory[0]['key'], false, $limit, 1);
        $data['data'] = $dataPricelist;
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }


    public function actionSearch()
    {
        try {
            $data = null;
            $limit = Yii::$app->params['price_list_page']['num_of_item'];

            $locationIds = $locationId = trim(Yii::$app->request->getBodyParam(PriceListHelper::CBX_PROVINCE));
            if ($locationId) {
                $province = LocationBase::selectByID($locationId);
                /* @var LocationBase $province */
                if ($province) {
//                    if ($province->child_list) {
//                        $locationIds = explode(',', $province->child_list);
//                    } else {
                    $locationIds = $locationId;
//                    }
                } else {
                    $data = [
                        'error-control' => PriceListHelper::CBX_PROVINCE,
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::PRICE_PRODUCT_CATEGORY_INVALID,
                        $data
                    );
                }
            }

            $categoryId = trim(Yii::$app->request->getBodyParam(PriceListHelper::PRODUCT_CATEGORY));
            if ($categoryId) {
                $category = ProductCategoriesBase::selectByID($categoryId);
                /* @var ProductCategoriesBase $category */
                if (!$category) {
                    $data = [
                        'error-control' => PriceListHelper::PRODUCT_CATEGORY,
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::PRICE_PRODUCT_CATEGORY_INVALID,
                        $data
                    );
                }
            } else {
                $data = [
                    'error-control' => PriceListHelper::PRODUCT_CATEGORY,
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::PRICE_PRODUCT_CATEGORY_REQUIRED,
                    $data
                );
            }

            $itemId = trim(Yii::$app->request->getBodyParam(PriceListHelper::PRODUCT_ITEM));

            if ($itemId) {
                $productItem = ProductItemsBase::selectByID($itemId);
                /* @var ProductCategoriesBase $category */
                if (!$productItem) {
                    $data = [
                        'error-control' => PriceListHelper::PRODUCT_ITEM,
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::PRICE_PRODUCT_ITEM_INVALID,
                        $data
                    );
                }
            }

            $dataPricelist = ProductItemPricelistBase::searchPricelistNew($locationIds, $categoryId, $itemId, $limit, 1);
            $data = $dataPricelist;

        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionLoadSearch()
    {
        try {
            $data = null;
            $limit = Yii::$app->params['price_list_page']['num_of_item_more'];
            $limit_num_of_item = Yii::$app->params['price_list_page']['num_of_item'];

            $locationId = trim(Yii::$app->request->getBodyParam(PriceListHelper::CBX_PROVINCE));
//            if (!$locationId) {
//                $locationId = LocationHelper::getDefaultLocation();
//            }
            $categoryId = trim(Yii::$app->request->getBodyParam(PriceListHelper::PRODUCT_CATEGORY));
            $itemId = trim(Yii::$app->request->getBodyParam(PriceListHelper::PRODUCT_ITEM));

            $page = intval(trim(Yii::$app->request->getQueryParam('page')));
            if ($page > 1) {
                $dataPricelist = ProductItemPricelistBase::searchPricelistNew($locationId, $categoryId, $itemId, $limit, $page, $limit_num_of_item);

                $data = $dataPricelist;
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionPricelistDetail()
    {
        try {
            $data = [];
            // lay thong tin san pham
            $price_id = Yii::$app->request->getQueryParam('price_id');
            $pricelist = ProductItemPricelistBase::getProductPricelistById($price_id);
            $cat = ProductCategoriesBase::selectByID($pricelist['category_id']);
            $data['item'] = [];
            if ($pricelist) {
                $data['item'] = self::generatePriceItem($pricelist, $cat->display_type);
                // lay danh sach vung mien
                $pricelists = ProductItemPricelistBase::getPricelistLocationByItemId($pricelist['item_id'], $price_id, $pricelist['location_id']);
                $data['title'] = "Giá sản phẩm ở các vùng miền khác";
                $data['price'] = [];
                foreach ($pricelists as $price) {
                    if ($cat->display_type == 2) {
                        $data['price'][] = [
                            'location' => [
                                'title' => 'Tại',
                                'value' => $price['location_full'],
                            ],
                            'price' => [
                                'title' => Yii::t('api', 'Giá'),
                                'value' => number_format($price['price'], 0, ',', '.') . ' ' . $price['price_unit']
                            ],
                        ];
                    } else {
                        $data['price'][] = [
                            'location' => [
                                'title' => 'Tại',
                                'value' => $price['location_full'],
                            ],
                            'price' => [
//                            'title' => Yii::t('api', 'Giá'),
                                'value' => number_format($price['price'], 0, ',', '.') . ' ' . $price['price_unit']
                            ],
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
        // lay thong tin gia lien quan theo ngay gan nhat
    }

    public static function generatePriceItem($item, $display_type)
    {
        if ($display_type == 2) {
            return [
                'name' => $item['name'],
                'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 0, 'price' . $display_type),
                'location' => [
                    'title' => 'Tại',
                    'value' => $item['location_full'],
                ],
                'price' => [
                    'title' => Yii::t('api', 'Giá'),
                    'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit']
                ],
                'feature' => $item['feature'],
                'date' => $item['feature'],
            ];
        }

        return [
            'name' => $item['name'],
            'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 0, 'price' . $display_type),
            'location' => [
                'title' => 'Tại',
                'value' => $item['location_full'],
            ],
            'price' => [
//                'title' => Yii::t('api', 'Giá'),
                'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit']
            ],
            'feature' => $item['feature'],
            'date' => $item['feature'],
        ];
    }

    public function actionGetPricelistProvince()
    {
        try {
            $locationIds = $locationId = trim(Yii::$app->request->getBodyParam(PriceListHelper::CBX_PROVINCE));
            if ($locationId) {
                $province = LocationBase::selectByID($locationId);
                /* @var LocationBase $province */
                if ($province) {
//                    if ($province->child_list) {
//                        $locationIds = explode(',', $province->child_list);
//                    } else {
                    $locationIds = $locationId;
//                    }
                } else {
                    $data = [
                        'error-control' => PriceListHelper::CBX_PROVINCE,
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::PRICE_PROVINCE_INVALID,
                        $data
                    );
                }
            } else {
                $data = [
                    'error-control' => PriceListHelper::CBX_PROVINCE,
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::PRICE_PROVINCE_REQUIRED,
                    $data
                );
            }

            $data['data'] = [];
            if ($locationIds) {
                // select cat list
                $catList = ProductCategoriesBase::getHomePriceList(Yii::$app->params['home_page']['num_of_price_cat_list']);
                if ($catList) {
                    foreach ($catList as $cat) {
                        /* @var ProductCategoriesBase $cat */
                        // select all price items in categories
                        $items = ProductItemsBase::getHomePriceList($cat->id, $locationIds, Yii::$app->params['home_page']['num_of_price_item_list']);
                        if (is_array($items) && count($items)) {
                            $catItem = [];
                            $catItem['name'] = $cat->name;
                            $catItem['display_type'] = $cat->display_type;
                            $catItem['items'] = [];
                            foreach ($items as $item) {
                                if ($cat->display_type == 2) {
                                    $catItem['items'][] = [
                                        'name' => $item['name'],
                                        'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 0, 'price' . $cat->display_type),
                                        'price' => [
                                            'title' => 'Giá',
                                            'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit'],
                                        ],
                                        'state' => $item['state'],
                                    ];
                                } else {
                                    $catItem['items'][] = [
                                        'name' => $item['name'],
                                        'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 0, 'price' . $cat->display_type),
                                        'price' => [
//                                        'title' => 'Giá',
                                            'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit'],
                                        ],
                                        'state' => $item['state'],
                                    ];
                                }
                            }
                            $data['data'][] = $catItem;
                        }
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
}