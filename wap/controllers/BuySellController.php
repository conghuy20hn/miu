<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 12/5/2015
 * Time: 6:00 PM
 */

namespace wap\controllers;

use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\BuySellHelper;
use common\helpers\FormBuilderHelper;
use common\helpers\Helpers;
use common\helpers\ProductCatUserHelper;
use common\helpers\ProductItemUserHelper;
use common\models\LocationBase;
use common\models\ProductCategoriesBase;
use common\models\ProductCatUserAttributeBase;
use common\models\ProductCatUserBase;
use common\models\ProductItemsBase;
use common\models\ProductItemUserAttributeBase;
use common\models\ProductItemUserBase;
use Yii;
use yii\base\InvalidConfigException;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UploadedFile;

class BuySellController extends Controller
{

    private $constPageConfig = 'video_page';

    /**
     * huync2: action home tim kiem gia mua
     * @return string
     */
    public function actionBuyHome()
    {
        Yii::$app->view->title='Tin mua' . Yii::$app->params['host_title'];
        Yii::$app->session->set('session_actionBuySearch', false);
        $data = [
            'search-form' => [
                'control' => BuySellHelper::buildSearchForm(true),
                'csrf_token' => Yii::$app->security->generateRandomString(32),
                'url' => Url::to(['/v1/classifieds/buy-search']),
            ],
            'data' => [
                'active' => BuySellHelper::BUY_TAB,
                'url' => Url::to(['/v1/classifieds/sell-home']),
                'items' => []
            ]
        ];
        $limit = Yii::$app->params['classifieds_page']['num_of_item'];
        $page = 1;

        $url = false;
        $items = [];
        if (Yii::$app->request->post()) {

        } else {
            $items = self::searchItemBuy($page, $limit, BuySellHelper::BUY_TYPE);
        }

        if (count($items) >= $limit) {
            $url = url::to(['/buy-sell/buy-search-load', 'page' => $page + 1]);
        }
        return $this->render('buy-home.twig', [
            'data' => $data,
            'items' => $items,
            'url' => $url,
        ]);
    }

    /**
     * huync2: ham tim kiem gia mua
     * @param $page
     * @param $limit
     * @return array
     */
    public static function searchItemBuy($page, $limit, $type, $typeLoad = false)
    {
        $items = [];
        if ($typeLoad) {
            $num_of_item = Yii::$app->params['classifieds_page']['num_of_item'];
            $offset = ($page - 1) * $limit - ($limit - $num_of_item);
        } else {
            $offset = ($page - 1) * $limit;
        }
        $sessionSearch = Yii::$app->session->get('session_actionBuySearch');

        if ($sessionSearch) {
            $products = ProductCatUserBase::searchItem(trim($sessionSearch['keyword']), $sessionSearch['province'], $sessionSearch['category_product'], ($sessionSearch['start_time'] != '') ? strtotime(trim($sessionSearch['start_time'])) : false, ($sessionSearch['end_time'] != '') ? strtotime(trim($sessionSearch['end_time'])) : false, $type, $limit, $offset);
        } else {
            $products = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::BUY_TYPE, $limit, $offset);
        }
        if ($products && count($products)) {
            foreach ($products as $item) {
                /* @var ProductCatUserBase $item */
                $items[] = ProductCatUserHelper::generateProductCatUser($item);
            }
        }
        return $items;
    }

    /**
     * huync2: action tim kiem gia mua
     * @return string
     * @throws InvalidConfigException
     */
    public function actionBuySearch()
    {
        $this->layout = false;
        $limit = Yii::$app->params['classifieds_page']['num_of_item'];
        $page = 1;
        $url = false;

        // checkvalidator
        $validator = [];
        $keySearch = trim(Yii::$app->request->getBodyParam(BuySellHelper::TXT_SEARCH));
        if ($keySearch && Helpers::getStrLen($keySearch) > 255) {
            $validator[BuySellHelper::TXT_SEARCH] = [
                'error-control' => BuySellHelper::TXT_SEARCH,
                'error-code' => ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH,
                'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH),
            ];
        }
        $locationIds = null;
        $provinceId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_PROVINCE));
        if ($provinceId) {
            $province = LocationBase::selectByID($provinceId);
            /* @var LocationBase $province */
            if ($province) {
                if ($province->child_list) {
                    $locationIds = explode(',', $province->child_list);
                } else {
                    $locationIds = $provinceId;
                }
            } else {
                $validator[BuySellHelper::CBX_PROVINCE] = [
                    'error-control' => BuySellHelper::CBX_PROVINCE,
                    'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                ];
            }
        }
        $districtId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_DISTRICT));
        if ($districtId) {
            $district = LocationBase::selectByID($districtId);
            /* @var LocationBase $district */
            if ($district) {
                if ($district->location_parent_id) {
                    if ($district->location_parent_id != $provinceId) {
                        $validator[BuySellHelper::CBX_PROVINCE] = [
                            'error-control' => BuySellHelper::CBX_PROVINCE,
                            'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                        ];
                    }
                } else {
                    $validator[BuySellHelper::CBX_PROVINCE] = [
                        'error-control' => BuySellHelper::CBX_PROVINCE,
                        'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                    ];
                }

                $locationIds = $districtId;
            } else {
                $validator[BuySellHelper::CBX_DISTRICT] = [
                    'error-control' => BuySellHelper::CBX_DISTRICT,
                    'error-code' => ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_DISTRICT_INVALID),
                ];
            }
        }
        $categoryIds = null;
        $categoryId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_CATEGORY));
        if ($categoryId) {
            $category = ProductCategoriesBase::selectByID($categoryId);
            /* @var ProductCategoriesBase $category */
            if ($category) {
                if ($category->child_list) {
                    $categoryIds = explode(',', $category->child_list);
                } else {
                    $categoryIds = $categoryId;
                }
            } else {
                $validator[BuySellHelper::PRODUCT_CATEGORY] = [
                    'error-control' => BuySellHelper::PRODUCT_CATEGORY,
                    'error-code' => ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID),
                ];
            }
        }
        $startTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::START_TIME));
        $startTime = null;
        if ($startTimeStr) {
            $startTime = strtotime($startTimeStr);
            if (date('d-m-Y', $startTime) != $startTimeStr) {
                $validator[BuySellHelper::START_TIME] = [
                    'error-control' => BuySellHelper::START_TIME,
                    'error-code' => ApiResponseCode::BUYSELL_STARTTIME_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_STARTTIME_INVALID),
                ];
            }
        }
        $endTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::END_TIME));

        $endTime = null;
        if ($endTimeStr) {
            $endTime = strtotime($endTimeStr);
            if (date('d-m-Y', $endTime) != $endTimeStr) {
                $validator[BuySellHelper::END_TIME] = [
                    'error-control' => BuySellHelper::END_TIME,
                    'error-code' => ApiResponseCode::BUYSELL_ENDTIME_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_ENDTIME_INVALID),
                ];
            }
        }

        $params = Yii::$app->request->getBodyParams();
        $params[BuySellHelper::PRODUCT_CATEGORY] = $categoryIds;
        $params[BuySellHelper::CBX_PROVINCE] = $locationIds;


        Yii::$app->session->set('session_actionBuySearch', $params);

//            $items = self::searchItemBuy($page, $limit, BuySellHelper::BUY_TYPE);
        // end validator

        Yii::$app->session->set('session_actionBuySearch', $params);
        $items = self::searchItemBuy($page, $limit, BuySellHelper::BUY_TYPE);
        if (count($items) >= $limit) {
            $url = url::to(['/buy-sell/buy-search-load', 'page' => $page + 1]);
        }
        if (!count($validator)) {
            if (count($items)) {
                $data = $this->render('temp/_search_item.twig', [
                    'items' => $items,
                    'url' => $url,
                    'validator' => $validator,
                ]);
            } else {
                $data = 'Không có dữ liệu';
            }
            $arrReturn = [
                'errorCode' => 0,
                'data' => $data,
                'url' => $url ? 1 : 0,
            ];
        } else {
            $errMessage = '';
            foreach ($validator as $items) {
                $errMessage = $items['error-message'];
                break;
            }
            $arrReturn = [
                'errorCode' => 1,
                'errorMessage' => $errMessage,
                'url' => $url ? 1 : 0,
            ];
        }
        return json_encode($arrReturn);
    }

    /**
     * huync2: action load more
     * @return string
     */
    public function actionBuySearchLoad()
    {
        $this->layout = false;
        $limit = Yii::$app->params['classifieds_page']['num_of_item_more'];
        $page = Yii::$app->request->getQueryParam('page');
        $url = false;
        $items = self::searchItemBuy($page, $limit, BuySellHelper::BUY_TYPE, true);
        if (count($items) >= $limit) {
            $url = url::to(['/buy-sell/buy-search-load', 'page' => $page + 1]);
        }
        /* if (count($items)) {
          return $this->render('temp/_search_item.twig', [
          'items' => $items,
          'url' => $url,
          ]);
          } else {
          return false;
          } */

        if (count($items)) {
            $data = $this->render('temp/_search_item.twig', [
                'items' => $items,
                'url' => $url,
            ]);
        } else {
            $data = '';
        }
        $arrReturn = [
            'errorCode' => 0,
            'data' => $data,
            'url' => $url ? 1 : 0,
        ];
        return json_encode($arrReturn);
    }

    public function actionSellHome()
    {
        Yii::$app->view->title='Tin bán' . Yii::$app->params['host_title'];
        $data = [
            'search-form' => [
                'control' => BuySellHelper::buildSearchForm(true),
                'csrf_token' => Yii::$app->security->generateRandomString(16),
                'url' => Url::to(['/v1/classifieds/sell-search']),
            ],
            'data' => [
                'active' => BuySellHelper::SELL_TAB,
                'url' => Url::to(['/v1/classifieds/buy-home']),
                'items' => []
            ]
        ];

        $limit = Yii::$app->params['classifieds_page']['num_of_item'];
        $page = 1;

        $url = false;
        Yii::$app->session->set('session_actionSellSearch', false);
        $items = self::searchItemSell($page, $limit, BuySellHelper::SELL_TYPE);
        if (count($items) >= $limit) {
            $url = url::to(['/buy-sell/sell-search-load', 'page' => $page + 1]);
        }
        return $this->render('sell-home.twig', [
            'data' => $data,
            'items' => $items,
            'url' => $url,
        ]);
    }

    public static function searchItemSell($page, $limit, $type, $typeLoad = false)
    {
        $items = [];
        if ($typeLoad) {
            $num_of_item = Yii::$app->params['classifieds_page']['num_of_item'];
            $offset = ($page - 1) * $limit - ($limit - $num_of_item);
        } else {
            $offset = ($page - 1) * $limit;
        }
//        $offset = ($page - 1) * $limit;
        $sessionSearch = Yii::$app->session->get('session_actionSellSearch');
        if ($sessionSearch) {
            $products = ProductCatUserBase::searchItem($sessionSearch['keyword'], $sessionSearch['province'], $sessionSearch['category_product'], ($sessionSearch['start_time'] != '') ? strtotime($sessionSearch['start_time']) : false, ($sessionSearch['end_time'] != '') ? strtotime($sessionSearch['end_time']) : false, $type, $limit, $offset);
        } else {
            $products = ProductCatUserBase::searchItem(null, null, null, null, null, $type, $limit, $offset);
        }
        if ($products && count($products)) {
            foreach ($products as $item) {
                /* @var ProductCatUserBase $item */
                $items[] = ProductCatUserHelper::generateProductCatUser($item);
            }
        }
        return $items;
    }

    public function actionSellSearch()
    {
        $this->layout = false;
        $limit = Yii::$app->params['classifieds_page']['num_of_item'];
        $page = 1;
        $url = false;
        $params = Yii::$app->request->getBodyParams();


        // checkvalidator
        $validator = [];
        $keySearch = trim(Yii::$app->request->getBodyParam(BuySellHelper::TXT_SEARCH));
        if ($keySearch && Helpers::getStrLen($keySearch) > 255) {
            $validator[BuySellHelper::TXT_SEARCH] = [
                'error-control' => BuySellHelper::TXT_SEARCH,
                'error-code' => ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH,
                'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH),
            ];
        }
        $locationIds = null;
        $provinceId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_PROVINCE));
        if ($provinceId) {
            $province = LocationBase::selectByID($provinceId);
            /* @var LocationBase $province */
            if ($province) {
                if ($province->child_list) {
                    $locationIds = explode(',', $province->child_list);
                } else {
                    $locationIds = $provinceId;
                }
            } else {
                $validator[BuySellHelper::CBX_PROVINCE] = [
                    'error-control' => BuySellHelper::CBX_PROVINCE,
                    'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                ];
            }
        }
        $districtId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_DISTRICT));
        if ($districtId) {
            $district = LocationBase::selectByID($districtId);
            /* @var LocationBase $district */
            if ($district) {
                if ($district->location_parent_id) {
                    if ($district->location_parent_id != $provinceId) {
                        $validator[BuySellHelper::CBX_PROVINCE] = [
                            'error-control' => BuySellHelper::CBX_PROVINCE,
                            'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                        ];
                    }
                } else {
                    $validator[BuySellHelper::CBX_PROVINCE] = [
                        'error-control' => BuySellHelper::CBX_PROVINCE,
                        'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                    ];
                }

                $locationIds = $districtId;
            } else {
                $validator[BuySellHelper::CBX_DISTRICT] = [
                    'error-control' => BuySellHelper::CBX_DISTRICT,
                    'error-code' => ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_DISTRICT_INVALID),
                ];
            }
        }
        $categoryIds = null;
        $categoryId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_CATEGORY));
        if ($categoryId) {
            $category = ProductCategoriesBase::selectByID($categoryId);
            /* @var ProductCategoriesBase $category */
            if ($category) {
                if ($category->child_list) {
                    $categoryIds = explode(',', $category->child_list);
                } else {
                    $categoryIds = $categoryId;
                }
            } else {

                $validator[BuySellHelper::PRODUCT_CATEGORY] = [
                    'error-control' => BuySellHelper::PRODUCT_CATEGORY,
                    'error-code' => ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID),
                ];
            }
        }
//        $productId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_ITEM));
//        if ($productId) {
//            $product = ProductItemsBase::selectByID($productId);
//            /* @var ProductItemsBase $product */
//            if ($product) {
//                if ($product->category_id != $categoryId) {
//                    $validator[BuySellHelper::PRODUCT_CATEGORY] = [
//                        'error-control' => BuySellHelper::PRODUCT_CATEGORY,
//                        'error-code' => ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
//                        'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID),
//                    ];
//                }
//            } else {
//                $validator[BuySellHelper::PRODUCT_ITEM] = [
//                    'error-control' => BuySellHelper::PRODUCT_ITEM,
//                    'error-code' => ApiResponseCode::BUYSELL_PRODUCT_ITEM_INVALID,
//                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRODUCT_ITEM_INVALID),
//                ];
//            }
//        }
        $startTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::START_TIME));
        $startTime = null;
        if ($startTimeStr) {
            $startTime = strtotime($startTimeStr);
            if (date('d-m-Y', $startTime) != $startTimeStr) {
                $validator[BuySellHelper::START_TIME] = [
                    'error-control' => BuySellHelper::START_TIME,
                    'error-code' => ApiResponseCode::BUYSELL_STARTTIME_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_STARTTIME_INVALID),
                ];
            }
        }
        $endTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::END_TIME));
        $endTime = null;
        if ($endTimeStr) {
            $endTime = strtotime($endTimeStr);
            if (date('d-m-Y', $endTime) != $endTimeStr) {
                $validator[BuySellHelper::END_TIME] = [
                    'error-control' => BuySellHelper::END_TIME,
                    'error-code' => ApiResponseCode::BUYSELL_ENDTIME_INVALID,
                    'error-message' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_ENDTIME_INVALID),
                ];
            }
        }

        $params = Yii::$app->request->getBodyParams();
        $params[BuySellHelper::PRODUCT_CATEGORY] = $categoryIds;
        $params[BuySellHelper::CBX_PROVINCE] = $locationIds;

        Yii::$app->session->set('session_actionSellSearch', $params);

        // end validator

        $items = self::searchItemSell($page, $limit, BuySellHelper::SELL_TYPE);

        if (count($items) >= $limit) {
            $url = url::to(['/buy-sell/sell-search-load', 'page' => $page + 1]);
        }
        if (!count($validator)) {
            if (count($items)) {
                $data = $this->render('temp/_search_item.twig', [
                    'items' => $items,
                    'url' => $url,
                    'validator' => $validator,
                ]);
            } else {
                $data = 'Không có dữ liệu';
            }
            $arrReturn = [
                'errorCode' => 0,
                'data' => $data,
                'url' => $url ? 1 : 0,
            ];
        } else {
            $errMessage = '';
            foreach ($validator as $items) {
                $errMessage = $items['error-message'];
                break;
            }
            $arrReturn = [
                'errorCode' => 1,
                'errorMessage' => $errMessage,
                'url' => $url ? 1 : 0,
            ];
        }
        return json_encode($arrReturn);
    }

    public function actionSellSearchLoad()
    {
        $this->layout = false;
        $limit = Yii::$app->params['classifieds_page']['num_of_item_more'];
        $page = trim(Yii::$app->request->getQueryParam('page'));
        $url = false;
        $items = self::searchItemSell($page, $limit, BuySellHelper::SELL_TYPE, true);
        if (count($items) >= $limit) {
            $url = url::to(['/buy-sell/sell-search-load', 'page' => $page + 1]);
        }

        if (count($items)) {
            $data = $this->render('temp/_search_item.twig', [
                'items' => $items,
                'url' => $url,
            ]);
        } else {
            $data = '';
        }
        $arrReturn = [
            'errorCode' => 0,
            'data' => $data,
            'url' => $url ? 1 : 0,
        ];

        return json_encode($arrReturn);
    }

    public function actionCompose()
    {
        Yii::$app->view->title='Đăng tin' . Yii::$app->params['host_title'];
        $type = Yii::$app->request->getQueryParam('type');
        if (!$type) {
            $type = BuySellHelper::BUY_TYPE;
        }
        $data = [
            'control' => FormBuilderHelper::buildRequestForm($type, true),
            'url' => Url::to(['/buy-sell/compose-submit']),
        ];

        return $this->render('compose.twig', [
            'data' => $data,
        ]);
    }

    public function actionComposeSubmit()
    {
        if (!Yii::$app->getRequest()->validateCsrfToken(urldecode(Yii::$app->request->getBodyParam('_csrf')))) {
            return json_encode([
                'errCode' => 1,
                'errMessage' => 'Phiên làm việc không hợp lệ',
                'control' => '',
            ]);
        }
        $dataValid = [];
        $type = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::PRODUCT_TYPE)));
        if (!$type) {
            $dataValid[FormBuilderHelper::PRODUCT_TYPE] = [
                'error-control' => FormBuilderHelper::PRODUCT_TYPE,
                'error-code' => ApiResponseCode::BUYSELL_TYPE_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_TYPE_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::PRODUCT_TYPE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::PRODUCT_TYPE]['error-control'],
            ]);

        } else if (!in_array($type, [BuySellHelper::SELL_TYPE, BuySellHelper::BUY_TYPE])) {
            $dataValid[FormBuilderHelper::PRODUCT_TYPE] = [
                'error-control' => FormBuilderHelper::PRODUCT_TYPE,
                'error-code' => ApiResponseCode::BUYSELL_TYPE_INVALID,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_TYPE_INVALID),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::PRODUCT_TYPE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::PRODUCT_TYPE]['error-control'],
            ]);
        }
        $title = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_TITLE)));
        if (!$title) {
            $dataValid[FormBuilderHelper::TXT_TITLE] = [
                'error-control' => FormBuilderHelper::TXT_TITLE,
                'error-code' => ApiResponseCode::BUYSELL_TITLE_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_TITLE_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_TITLE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_TITLE]['error-control'],
            ]);
        } else if ($title && Helpers::getStrLen($title) > 255) {
            $dataValid[FormBuilderHelper::TXT_TITLE] = [
                'error-control' => FormBuilderHelper::TXT_TITLE,
                'error-code' => ApiResponseCode::BUYSELL_TITLE_MAXLENGTH,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_TITLE_MAXLENGTH),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_TITLE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_TITLE]['error-control'],
            ]);
        }
        $validDays = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::VALID_DAYS)));
        if ($validDays) {
            $listValid = Yii::$app->params['prod_user']['valid_date'];
            if (!in_array($validDays, array_keys($listValid))) {
                $dataValid[FormBuilderHelper::VALID_DAYS] = [
                    'error-control' => FormBuilderHelper::VALID_DAYS,
                    'error-code' => ApiResponseCode::BUYSELL_VALID_DATE_INVALID,
                    'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_VALID_DATE_INVALID),
                ];
                return json_encode([
                    'errCode' => 1,
                    'errMessage' => $dataValid[FormBuilderHelper::VALID_DAYS]['error-mess'],
                    'control' => $dataValid[FormBuilderHelper::VALID_DAYS]['error-control'],
                ]);
            }
        } else {
            $dataValid[FormBuilderHelper::VALID_DAYS] = [
                'error-control' => FormBuilderHelper::VALID_DAYS,
                'error-code' => ApiResponseCode::BUYSELL_VALID_DATE_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_VALID_DATE_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::VALID_DAYS]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::VALID_DAYS]['error-control'],
            ]);
        }


        $image_path = UploadedFile::getInstanceByName('image_path');
        $uploadExt = Yii::$app->params['upload_prod_user_image']['ext'];
        $uploadDir = Yii::$app->params['prod_user_img_upload_path'];
        $maxSize = Yii::$app->params['upload_prod_user_image']['maxSize'];
        $arrExt = explode(',', $uploadExt);
        $dirFileSave='';

        if ($image_path) {

            $extension = pathinfo($image_path->name, PATHINFO_EXTENSION);

            if (in_array($extension, $arrExt)) {
                $fileSize = $image_path->size;
                if ($fileSize > $maxSize) {
                    $dataValid[FormBuilderHelper::IMAGE_PATH] = [
                        'error-control' => FormBuilderHelper::IMAGE_PATH,
                        'error-code' => ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED,
                        'error-mess' => 'File vượt quá giới hạn cho phép: ' . $maxSize . 'bytes',
//                        'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED),
                    ];
                    return json_encode([
                        'errCode' => 1,
                        'errMessage' => $dataValid[FormBuilderHelper::IMAGE_PATH]['error-mess'],
                        'control' => $dataValid[FormBuilderHelper::IMAGE_PATH]['error-control'],
                    ]);
                } else {
                    // image dir
                    $imageUploaded = Yii::$app->params['prod_user_img_upload_prefix'] . DIRECTORY_SEPARATOR .
                        Helpers::generateStructurePath();
                    // duong dan luu file
                    $filePath = $uploadDir . DIRECTORY_SEPARATOR . $imageUploaded;
                    if (!is_dir($filePath)) {
                        mkdir($filePath, 0777, true);
                    }
                    // file name
                    $fileName = md5($image_path->name) . '.' . $extension;
                    // duong dan upload
                    $dirFileUpload = $filePath . DIRECTORY_SEPARATOR . $fileName;
                    // duong dan luu DB
                    $dirFileSave = DIRECTORY_SEPARATOR . $imageUploaded . DIRECTORY_SEPARATOR . $fileName;
                    if (!move_uploaded_file($image_path->tempName, $dirFileUpload)) {
                        $dataValid[FormBuilderHelper::IMAGE_PATH] = [
                            'error-control' => FormBuilderHelper::IMAGE_PATH,
                            'error-code' => ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED,
                            'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED),
                        ];
                        return json_encode([
                            'errCode' => 1,
                            'errMessage' => $dataValid[FormBuilderHelper::IMAGE_PATH]['error-mess'],
                            'control' => $dataValid[FormBuilderHelper::IMAGE_PATH]['error-control'],
                        ]);
                    }
                }
            } else {
                $dataValid[FormBuilderHelper::IMAGE_PATH] = [
                    'error-control' => FormBuilderHelper::IMAGE_PATH,
                    'error-code' => ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED,
                    'error-mess' => 'File không đúng định dạng: ' . implode(', ', $arrExt),
//                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED),
                ];
                return json_encode([
                    'errCode' => 1,
                    'errMessage' => $dataValid[FormBuilderHelper::IMAGE_PATH]['error-mess'],
                    'control' => $dataValid[FormBuilderHelper::IMAGE_PATH]['error-control'],
                ]);
            }
        }

        $description = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_DESCRIPTION)));
        $categoryId = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::PRODUCT_CATEGORY)));
        $categoryAttr = [];
        $priceUnitCat = null;
        if ($categoryId) {
            $category = ProductCategoriesBase::selectByID($categoryId);
            /* @var ProductCategoriesBase $category */
            if ($category) {
                if ($category->child_list) {
                    $categoryIds = explode(',', $category->child_list);
                } else {
                    $categoryIds = $categoryId;
                }
                $attributes = ProductCatUserAttributeBase::getByCategoryId($categoryId);

                if ($attributes) {
                    foreach ($attributes as $attr) {
                        $attrVal = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug)));
                        /* @var ProductItemUserAttributeBase $attr */
                        switch ($attr->type) {
                            case ProductItemUserHelper::TYPE_TEXTBOX:
                                if ($attrVal && Helpers::getStrLen($attrVal) > FormBuilderHelper::MAXLENGTH_ATTR) {
                                    $dataValid[FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug] = [
                                        'error-control' => FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug,
                                        'error-code' => ApiResponseCode::BUYSELL_ATTR_MAXLENGTH,
                                        'error-mess' => 'Dữ liệu trường "' . $attr->name . '" vượt quá ' .
                                            FormBuilderHelper::MAXLENGTH_ATTR . ' ký tự.',
                                    ];
                                    return json_encode([
                                        'errCode' => 1,
                                        'errMessage' => $dataValid[FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug]['error-mess'],
                                        'control' => $dataValid[FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug]['error-control'],
                                    ]);
                                }
                                break;
                            case ProductItemUserHelper::TYPE_COMBOBOX:
                                if ($attr->data && $cbx = json_decode($attr->data, true)) {
                                    if ($attrVal && !in_array($attrVal, array_map('trim',$cbx))) {
                                        $dataValid[FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug] = [
                                            'error-control' => FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug,
                                            'error-code' => ApiResponseCode::BUYSELL_ATTR_INVALID,
                                            'error-mess' => 'Dữ liệu trường "' . $attr->name . '" không hợp lệ.',
                                        ];
                                        return json_encode([
                                            'errCode' => 1,
                                            'errMessage' => $dataValid[FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug]['error-mess'],
                                            'control' => $dataValid[FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug]['error-control'],
                                        ]);
                                    }
                                }
                                break;
                        }
                        $categoryAttr[] = [
                            "id" => $attr->id,
                            "value" => $attrVal
                        ];
                    }
                }
            } else {
                $dataValid[FormBuilderHelper::PRODUCT_CATEGORY] = [
                    'error-control' => FormBuilderHelper::PRODUCT_CATEGORY,
                    'error-code' => ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                    'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID),
                ];
                return json_encode([
                    'errCode' => 1,
                    'errMessage' => $dataValid[FormBuilderHelper::PRODUCT_CATEGORY]['error-mess'],
                    'control' => $dataValid[FormBuilderHelper::PRODUCT_CATEGORY]['error-control'],
                ]);
            }
        } else {
            $dataValid[FormBuilderHelper::PRODUCT_CATEGORY] = [
                'error-control' => FormBuilderHelper::PRODUCT_CATEGORY,
                'error-code' => ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::PRODUCT_CATEGORY]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::PRODUCT_CATEGORY]['error-control'],
            ]);
        }
        $price = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_PRICE)));
        $regex = Helpers::convertPHPRegex(trim(Yii::$app->params['regex_validation']['price']));
        if (!$price) {
            $dataValid[FormBuilderHelper::TXT_PRICE] = [
                'error-control' => FormBuilderHelper::TXT_PRICE,
                'error-code' => ApiResponseCode::BUYSELL_PRICE_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRICE_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_PRICE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_PRICE]['error-control'],
            ]);
        } else if ($price && Helpers::getStrLen($price) > FormBuilderHelper::MAXLENGTH_PRICE) {
            $dataValid[FormBuilderHelper::TXT_PRICE] = [
                'error-control' => FormBuilderHelper::TXT_PRICE,
                'error-code' => ApiResponseCode::BUYSELL_PRICE_MAXLENGTH,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRICE_MAXLENGTH),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_PRICE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_PRICE]['error-control'],
            ]);
        } else if (!preg_match($regex, $price)) {
            $dataValid[FormBuilderHelper::TXT_PRICE] = [
                'error-control' => FormBuilderHelper::TXT_PRICE,
                'error-code' => ApiResponseCode::BUYSELL_PRICE_INVALID,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRICE_INVALID),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_PRICE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_PRICE]['error-control'],
            ]);
        }
        $price = str_replace('.', '', $price);

        $priceUnit = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::PRICE_UNIT)));
        if (!$priceUnit) {
            $dataValid[FormBuilderHelper::PRICE_UNIT] = [
                'error-control' => FormBuilderHelper::PRICE_UNIT,
                'error-code' => ApiResponseCode::BUYSELL_PRICE_UNIT_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PRICE_UNIT_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::PRICE_UNIT]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::PRICE_UNIT]['error-control'],
            ]);
        }
        if ($categoryAttr) {
            $categoryAttr = json_encode($categoryAttr);
        }
        $contact = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_CONTACT)));
        if (!$contact) {
            $dataValid[FormBuilderHelper::TXT_CONTACT] = [
                'error-control' => FormBuilderHelper::TXT_CONTACT,
                'error-code' => ApiResponseCode::BUYSELL_CONTACT_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_CONTACT_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_CONTACT]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_CONTACT]['error-control'],
            ]);
        } else if ($contact && Helpers::getStrLen($contact) > FormBuilderHelper::MAXLENGTH_CONTACT) {
            $dataValid[FormBuilderHelper::TXT_CONTACT] = [
                'error-control' => FormBuilderHelper::TXT_CONTACT,
                'error-code' => ApiResponseCode::BUYSELL_CONTACT_MAXLENGTH,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_CONTACT_MAXLENGTH),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_CONTACT]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_CONTACT]['error-control'],
            ]);
        }
        $locationId = null;
        $provinceId = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::CBX_PROVINCE)));
        if ($provinceId) {
            $province = LocationBase::selectByID($provinceId);
            /* @var LocationBase $province */
            if ($province) {
                $locationId = $provinceId;
            } else {
                $dataValid[FormBuilderHelper::CBX_PROVINCE] = [
                    'error-control' => FormBuilderHelper::CBX_PROVINCE,
                    'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                    'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                ];
                return json_encode([
                    'errCode' => 1,
                    'errMessage' => $dataValid[FormBuilderHelper::CBX_PROVINCE]['error-mess'],
                    'control' => $dataValid[FormBuilderHelper::CBX_PROVINCE]['error-control'],
                ]);
            }
        } else {
            $dataValid[FormBuilderHelper::CBX_PROVINCE] = [
                'error-control' => FormBuilderHelper::CBX_PROVINCE,
                'error-code' => ApiResponseCode::BUYSELL_PROVINCE_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::CBX_PROVINCE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::CBX_PROVINCE]['error-control'],
            ]);
        }
        $districtId = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::CBX_DISTRICT)));
        if ($districtId) {
            $district = LocationBase::selectByID($districtId);
            /* @var LocationBase $district */
            if ($district) {
                if ($district->location_parent_id != $provinceId) {
                    $dataValid[FormBuilderHelper::CBX_PROVINCE] = [
                        'error-control' => FormBuilderHelper::CBX_PROVINCE,
                        'error-code' => ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PROVINCE_INVALID),
                    ];
                    return json_encode([
                        'errCode' => 1,
                        'errMessage' => $dataValid[FormBuilderHelper::CBX_DISTRICT]['error-mess'],
                        'control' => $dataValid[FormBuilderHelper::CBX_DISTRICT]['error-control'],
                    ]);
                }
                $locationId = $districtId;
            } else {
                $dataValid[FormBuilderHelper::CBX_DISTRICT] = [
                    'error-control' => FormBuilderHelper::CBX_DISTRICT,
                    'error-code' => ApiResponseCode::BUYSELL_DISTRICT_REQUIRED,
                    'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_DISTRICT_REQUIRED),
                ];
                return json_encode([
                    'errCode' => 1,
                    'errMessage' => $dataValid[FormBuilderHelper::CBX_DISTRICT]['error-mess'],
                    'control' => $dataValid[FormBuilderHelper::CBX_DISTRICT]['error-control'],
                ]);
            }
        }
        $address = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_ADDRESS)));
        if ($address && Helpers::getStrLen($address) > FormBuilderHelper::MAXLENGTH_ADDRESS) {
            $dataValid[FormBuilderHelper::TXT_ADDRESS] = [
                'error-control' => FormBuilderHelper::TXT_ADDRESS,
                'error-code' => ApiResponseCode::BUYSELL_ADDRESS_MAXLENGTH,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_ADDRESS_MAXLENGTH),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_ADDRESS]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_ADDRESS]['error-control'],
            ]);
        }
        $phone = trim(urldecode(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_PHONE)));
        $regex = Helpers::convertPHPRegex(trim(Yii::$app->params['regex_validation']['mem_phone']));
        if (!$phone) {
            $dataValid[FormBuilderHelper::TXT_PHONE] = [
                'error-control' => FormBuilderHelper::TXT_PHONE,
                'error-code' => ApiResponseCode::BUYSELL_PHONE_REQUIRED,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PHONE_REQUIRED),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_PHONE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_PHONE]['error-control'],
            ]);
        } else if ($phone && Helpers::getStrLen($phone) > FormBuilderHelper::MAXLENGTH_PHONE) {
            $dataValid[FormBuilderHelper::TXT_PHONE] = [
                'error-control' => FormBuilderHelper::TXT_PHONE,
                'error-code' => ApiResponseCode::BUYSELL_PHONE_MAXLENGTH,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PHONE_MAXLENGTH),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_PHONE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_PHONE]['error-control'],
            ]);
        } else if (!preg_match($regex, $phone)) {
            $dataValid[FormBuilderHelper::TXT_PHONE] = [
                'error-control' => FormBuilderHelper::TXT_PHONE,
                'error-code' => ApiResponseCode::BUYSELL_PHONE_INVALID,
                'error-mess' => ApiResponseCode::getMessage(ApiResponseCode::BUYSELL_PHONE_INVALID),
            ];
            return json_encode([
                'errCode' => 1,
                'errMessage' => $dataValid[FormBuilderHelper::TXT_PHONE]['error-mess'],
                'control' => $dataValid[FormBuilderHelper::TXT_PHONE]['error-control'],
            ]);
        }


        $prodUserItem = new ProductCatUserBase();
        $prodUserItem->category_id = $categoryId;
        $prodUserItem->title = $title;
        $prodUserItem->type = $type;
        if ($description)
            $prodUserItem->description = $description;
        if ($categoryAttr)
            $prodUserItem->attr_values = $categoryAttr;
        $prodUserItem->image_path = $dirFileSave;
        $prodUserItem->price = $price;
        $prodUserItem->price_unit = $priceUnit;
        $prodUserItem->mem_contact = $contact;
        $prodUserItem->mem_location_id = $locationId;
        $prodUserItem->mem_address = $address;
        $prodUserItem->mem_phone = $phone;
        $prodUserItem->status = ProductItemUserHelper::STATUS_NEW;
        $prodUserItem->valid_days = $validDays;

        if (count($dataValid)) {
            $message = '';
            $control = '';
            foreach ($dataValid as $key => $val) {
                $control = $val['error-control'];
                $message .= $val['error-mess'];
                break;
            }
            return json_encode([
                'errCode' => 1,
                'errMessage' => $message,
                'control' => $control,
            ]);
        } else {
            if ($prodUserItem->save()) {
                $data['message'] = Yii::t('api', 'Tin của bạn sẽ được ban quản trị phê duyệt trong vòng 30 phút..');
            }
            return json_encode([
                'errCode' => 0,
                'errMessage' => Yii::t('api', 'Tin của bạn sẽ được ban quản trị phê duyệt trong vòng 30 phút.'),
            ]);
        }
    }
}
