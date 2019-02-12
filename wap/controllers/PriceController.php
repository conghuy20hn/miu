<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12/5/2015
 * Time: 6:00 PM
 */

namespace wap\controllers;

use api\libs\ApiResponseCode;
use common\helpers\BuySellHelper;
use common\helpers\ImageHelper;
use common\helpers\LocationHelper;
use common\helpers\PriceListHelper;
use common\helpers\ProductCategoryHelper;
use common\helpers\WeatherHelper;
use common\models\LocationBase;
use common\models\ProductCategoriesBase;
use common\models\ProductItemPricelistBase;
use common\models\ProductItemsBase;
use Yii;
use yii\helpers\Url;
use yii\web\Controller;

class PriceController extends Controller {

    public function actionHome() {
        Yii::$app->view->title='Giá tôm' . Yii::$app->params['host_title'];
        Yii::$app->session->set('session_province_checked', false);
        Yii::$app->session->set('session_actionSearch_Price_defaultCategory', false);
        $data = [
            'search-form' => [
                'control' => PriceListHelper::buildSearchForm(true),
                'csrf_token' => Yii::$app->security->generateRandomString(32),
                'url' => Url::to(['/v1/price/search']),
            ],
        ];

        Yii::$app->session->set('session_actionSearch_Price', false);
        if (!Yii::$app->session->get('session_actionSearch_Price_defaultCategory')) {
            $listCategory = BuySellHelper::addDefaultItem(false, ProductCategoryHelper::buildComboBoxClient(), 0);
            Yii::$app->session->set('session_actionSearch_Price_defaultCategory', $listCategory[0]['key']);
        }

        $limit = Yii::$app->params['price_list_page']['num_of_item'];
        $dataPricelist = self::searchItem(1, $limit);
        return $this->render('index.twig', [
                    'data' => $data,
                    'dataPricelist' => $dataPricelist['items'],
                    'limit' => $limit,
        ]);
    }

    public function actionHomeSelect() {
        $this->layout = false;
        $provinceId = Yii::$app->request->getBodyParam(PriceListHelper::CBX_PROVINCE);
        $province = LocationBase::selectByProvinceID($provinceId);
        if ($province) {
            // select cat list
            $data = [];
            LocationHelper::setDefaultLocationClassified($provinceId);
            $catList = ProductCategoriesBase::getHomePriceList(Yii::$app->params['home_page']['num_of_price_cat_list']);
            if ($catList) {
                foreach ($catList as $cat) {
                    /* @var ProductCategoriesBase $cat */
                    // select all price items in categories
                    $items = ProductItemsBase::getHomePriceList($cat->id, $provinceId, Yii::$app->params['home_page']['num_of_price_item_list']);
                    if (is_array($items) && count($items)) {
                        $catItem = [];
                        $catItem['name'] = $cat->name;
                        $catItem['display_type'] = $cat->display_type;
                        $catItem['items'] = [];
                        if ($cat->display_type == 2) {
                            foreach ($items as $item) {
                                $catItem['items'][] = [
                                    'name' => $item['name'],
                                    'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 0, 'price' . $cat->display_type),
                                    'price' => [
                                        'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit'],
                                    ],
                                    'state' => $item['state'],
                                ];
                            }
                        } else {
                            foreach ($items as $item) {
                                $catItem['items'][] = [
                                    'name' => $item['name'],
                                    'price' => [
                                        'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit'],
                                    ],
                                    'state' => $item['state'],
                                ];
                            }
                        }
                        $data[] = $catItem;
                    }
                }
            }
            return $this->render('home_price_select.twig', [
                        'data' => $data
            ]);
        }
        return $this->render('empty.twig');
    }

    public function actionSearch() {
        $this->layout = false;
        $limit = Yii::$app->params['price_list_page']['num_of_item'];
        $page = 1;
        $url = false;
        $params = Yii::$app->request->getBodyParams();
        Yii::$app->session->set('session_actionSearch_Price', $params);
        $items = self::searchItem($page, $limit);
        if (count($items['validator'])) {
            $message = '';
            foreach ($items['validator'] as $valid) {
                $message = $valid['error-message'];
                break;
            }
            $arrReturn = [
                'errorCode' => 1,
                'errMessage' => $message,
                'url' => $url ? 1 : 0,
            ];
        } else {
            if ($items['items']['load_more']) {
                $url = url::to(['/price/load-search', 'page' => $page + 1]);
            }

            if (count($items['items']['items'])) {
                $data = $this->render('temp/_search_item.twig', [
                    'data' => $items['items'],
                    'url' => $url,
                ]);
            } else {
                $data = 'Không có dữ liệu';
            }
            $arrReturn = [
                'errorCode' => 0,
                'data' => $data,
                'url' => $url ? 1 : 0,
            ];
        }
        return json_encode($arrReturn);
    }

    public function searchItem($page, $limit, $limit_num_of_item = false) {
        $items = [];
        $sessionSearch = Yii::$app->session->get('session_actionSearch_Price');
        $validator = [];
        $locationIds = $locationId = trim($sessionSearch[PriceListHelper::CBX_PROVINCE]);
        if ($locationId) {
            Yii::$app->session->set('session_province_checked', $locationId);
            $province = LocationBase::selectByID($locationId);
            /* @var LocationBase $province */
            if ($province) {
                if ($province->child_list) {
                    $locationIds = explode(',', $province->child_list);
                } else {
                    $locationIds = $locationId;
                }
            } else {
                $validator[PriceListHelper::CBX_PROVINCE] = [
                    'error-control' => PriceListHelper::CBX_PROVINCE,
                    'error-code' => ApiResponseCode::PRICE_PRODUCT_CATEGORY_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::PRICE_PRODUCT_CATEGORY_INVALID),
                ];
            }
        }
        $categoryId = $sessionSearch[PriceListHelper::PRODUCT_CATEGORY];
        if($categoryId)
            Yii::$app->session->set('session_actionSearch_Price_defaultCategory', $categoryId);

        if ($categoryId) {
            $category = ProductCategoriesBase::selectByID($categoryId);
            /* @var ProductCategoriesBase $category */
            if (!$category) {
                $validator[PriceListHelper::PRODUCT_CATEGORY] = [
                    'error-control' => PriceListHelper::PRODUCT_CATEGORY,
                    'error-code' => ApiResponseCode::PRICE_PRODUCT_CATEGORY_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::PRICE_PRODUCT_CATEGORY_INVALID),
                ];
            }
        }
        $itemId = $sessionSearch[PriceListHelper::PRODUCT_ITEM];
        Yii::$app->session->set('session_product_checked', $itemId);
        if ($itemId) {
            $productItem = ProductItemsBase::selectByID($itemId);
            /* @var ProductCategoriesBase $category */
            if (!$productItem) {
                $validator[PriceListHelper::PRODUCT_ITEM] = [
                    'error-control' => PriceListHelper::PRODUCT_ITEM,
                    'error-code' => ApiResponseCode::PRICE_PRODUCT_ITEM_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::PRICE_PRODUCT_ITEM_INVALID),
                ];
            }
        }
        if (!count($validator)) {
            if ($sessionSearch) {
                $items = ProductItemPricelistBase::searchPricelistNew($locationIds, $categoryId, $itemId, $limit, $page, $limit_num_of_item);
            } else {
                $categoryId = Yii::$app->session->get('session_actionSearch_Price_defaultCategory');
                if ($page > 1) {
                    $items = ProductItemPricelistBase::searchPricelistNew(false, $categoryId, false, $limit, $page, $limit_num_of_item);
                } else {
                    $items = ProductItemPricelistBase::searchPricelistNew(false, $categoryId, false, $limit, $page);
                }
            }
        }
        $arrReturn = [
            'items' => $items,
            'validator' => $validator,
        ];
        return $arrReturn;
    }

    public function actionLoadSearch() {
        $this->layout = false;
        $limit = Yii::$app->params['price_list_page']['num_of_item_more'];
        $limit_num_of_item = Yii::$app->params['price_list_page']['num_of_item'];
        $page = Yii::$app->request->getQueryParam('page');
        $url = false;
        $items = self::searchItem($page, $limit, $limit_num_of_item);
        if ($items['items']['load_more']) {
            $url = url::to(['/price/load-search', 'page' => $page + 1]);
        }
        $data = '';
        if (count($items['items']['items'])) {
            $data = $this->render('temp/_search_item.twig', [
                'data' => $items['items'],
                'url' => $url,
            ]);
        }
        $arrReturn = [
            'errorCode' => 0,
            'data' => $data,
            'url' => $url ? 1 : 0,
        ];
        return json_encode($arrReturn);
    }

    public function actionPriceDetail() {
        $data = [];
        $data['item'] = [];
        $price_id = Yii::$app->request->getQueryParam('price_id');
        $pricelist = ProductItemPricelistBase::getProductPricelistById($price_id);
        $cat = ProductCategoriesBase::selectByID($pricelist['category_id']);
        Yii::$app->view->title=$pricelist['name'] . Yii::$app->params['host_title'];
        if ($pricelist) {
            $data['item'] = self::generatePriceItem($pricelist, $cat->display_type);
            // lay danh sach vung mien
            $pricelists = ProductItemPricelistBase::getPricelistLocationByItemId($pricelist['item_id'], $price_id, $pricelist['location_id']);
            $data['price'] = [];
            if ($pricelists) {
                foreach ($pricelists as $price) {
                    $data['price'][] = [
                        'location' => [
                            'title' => 'Tại:',
                            'value' => $price['location_full'],
                        ],
                        'price' => [
                            'title' => Yii::t('api', 'Giá'),
                            'value' => number_format($price['price'], 0, ',', '.') . ' ' . $price['price_unit']
                        ],
                    ];
                }
            }
        }

        return $this->render('price_detail.twig', [
                    'data' => $data,
        ]);
    }

    public static function generatePriceItem($item, $display_type) {
        $location = \wap\models\Location::find()->where(['location_id' => $item['location_id']])->one();
        return [
            'name' => $item['name'],
            'image_path' => ImageHelper::imagePathThumb($item['image_path'], 90, 126, 'price' . $display_type),
            'price' => [
                'title' => Yii::t('api', 'Giá'),
                'value' => number_format($item['price'], 0, ',', '.') . ' ' . $item['price_unit']
            ],
            'location' => [
                'title' => 'Tại:',
                'value' => $location->location_full,
            ],
            'feature' => $item['feature'],
            'date' => $item['updated_at'],
        ];
    }

}
