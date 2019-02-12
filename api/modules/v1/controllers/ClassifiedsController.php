<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 05-Jan-16
 * Time: 08:41
 */

namespace api\modules\v1\controllers;


use api\controllers\ApiController;
use api\libs\ApiHelper;
use api\libs\ApiResponseCode;
use common\helpers\BuySellHelper;
use common\helpers\Helpers;
use common\helpers\FormBuilderHelper;
use common\helpers\ImageHelper;
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
use yii\base\Exception;
use yii\helpers\Url;

class ClassifiedsController extends ApiController
{
    private $constPageConfig = 'classifieds_page';

    public function actionPostItem()
    {
        try {
            $type = Yii::$app->request->getQueryParam('type');
            if (!$type) {
                $type = BuySellHelper::BUY_TYPE;
            }
            $data = [
                'control' => FormBuilderHelper::buildRequestForm($type),
                'csrf_token' => Yii::$app->security->generateRandomString(32),
                'url' => Url::to(['/v1/classifieds/submit-item']),
            ];
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionSubmitItem()
    {
        $data = null;
        $message = null;
        try {
            $type = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::PRODUCT_TYPE));
            if (!$type) {
                $data = [
                    'error-control' => FormBuilderHelper::PRODUCT_TYPE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_TYPE_REQUIRED,
                    $data
                );
            } else if (!in_array($type, [BuySellHelper::SELL_TYPE, BuySellHelper::BUY_TYPE])) {
                $data = [
                    'error-control' => FormBuilderHelper::PRODUCT_TYPE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_TYPE_INVALID,
                    $data
                );
            }
            $title = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_TITLE));
            if (!$title) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_TITLE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_TITLE_REQUIRED,
                    $data
                );
            } else if ($title && Helpers::getStrLen($title) > 255) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_TITLE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_TITLE_MAXLENGTH,
                    $data
                );
            }
            $validDays = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::VALID_DAYS));
            if ($validDays) {
                $listValid = Yii::$app->params['prod_user']['valid_date'];
                if (!in_array($validDays, array_keys($listValid))) {
                    $data = [
                        'error-control' => FormBuilderHelper::VALID_DAYS
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_VALID_DATE_INVALID,
                        $data
                    );
                }
            } else {
                $data = [
                    'error-control' => FormBuilderHelper::VALID_DAYS
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_VALID_DATE_REQUIRED,
                    $data
                );
            }
            $description = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_DESCRIPTION));
            $categoryId = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::PRODUCT_CATEGORY));
            $categoryAttr = [];
            $priceUnitCat = null;
            if ($categoryId) {
                $category = ProductCategoriesBase::selectByID($categoryId);
                /* @var ProductCategoriesBase $category */
                if ($category) {
                    $priceUnitCat = $category->priceUnit;
//                    if ($category->child_list) {
//                        $categoryIds = explode(',', $category->child_list);
//                    } else {
                    $categoryIds = $categoryId;
//                    }
                    $attributes = ProductCatUserAttributeBase::getByCategoryId($categoryIds);

                    if ($attributes) {
                        foreach ($attributes as $attr) {
                            $attrVal = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug));

                            /* @var ProductItemUserAttributeBase $attr */
                            switch ($attr->type) {
                                case ProductItemUserHelper::TYPE_TEXTBOX:
                                    if ($attrVal && Helpers::getStrLen($attrVal) > FormBuilderHelper::MAXLENGTH_ATTR) {
                                        $data = [
                                            'error-control' => FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug
                                        ];
                                        return ApiHelper::formatResponse(
                                            ApiResponseCode::BUYSELL_ATTR_MAXLENGTH,
                                            $data,
                                            'Dữ liệu trường "' . $attr->name . '" vượt quá ' .
                                            FormBuilderHelper::MAXLENGTH_ATTR . ' ký tự.'
                                        );
                                    }
                                    break;
                                case ProductItemUserHelper::TYPE_COMBOBOX:
                                    if ($attr->data && $cbx = json_decode($attr->data, true)) {
                                        if ($attrVal && !in_array($attrVal, array_map('trim',$cbx))) {
                                            $data = [
                                                'error-control' => FormBuilderHelper::ATTRIBUTE_PREFIX . $attr->slug
                                            ];
                                            return ApiHelper::formatResponse(
                                                ApiResponseCode::BUYSELL_ATTR_INVALID,
                                                $data,
                                                'Dữ liệu trường "' . $attr->name . '" không hợp lệ.'
                                            );
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
                    $data = [
                        'error-control' => FormBuilderHelper::PRODUCT_CATEGORY
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                        $data
                    );
                }
            } else {
                $data = [
                    'error-control' => FormBuilderHelper::PRODUCT_CATEGORY
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_REQUIRED,
                    $data
                );
            }
            $price = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_PRICE));
            $regex = Helpers::convertPHPRegex(trim(Yii::$app->params['regex_validation']['price']));
            if (!$price) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_PRICE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PRICE_REQUIRED,
                    $data
                );
            } else if ($price && Helpers::getStrLen($price) > FormBuilderHelper::MAXLENGTH_PRICE) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_PRICE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PRICE_MAXLENGTH,
                    $data
                );
            } else if (!preg_match($regex, $price)) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_PRICE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PRICE_INVALID,
                    $data
                );
            }
            $price = str_replace('.', '', $price);
            $priceUnit = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::PRICE_UNIT));
            if (!$priceUnit) {
                $data = [
                    'error-control' => FormBuilderHelper::PRICE_UNIT
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PRICE_UNIT_REQUIRED,
                    $data
                );
            } else {
                if ($priceUnitCat) {
                    if ($priceUnitCat && $priceUnitCat->data && $cbx = json_decode($priceUnitCat->data, true)) {
                        if (!in_array($priceUnit, $cbx)) {
                            $data = [
                                'error-control' => FormBuilderHelper::PRICE_UNIT
                            ];
                            return ApiHelper::formatResponse(
                                ApiResponseCode::BUYSELL_PRICE_UNIT_INVALID,
                                $data
                            );
                        }
                    }
                }
            }
            if ($categoryAttr) {
                $categoryAttr = json_encode($categoryAttr);
            }
            $contact = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_CONTACT));
            if (!$contact) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_CONTACT
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_CONTACT_REQUIRED,
                    $data
                );
            } else if ($contact && Helpers::getStrLen($contact) > FormBuilderHelper::MAXLENGTH_CONTACT) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_CONTACT
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_CONTACT_MAXLENGTH,
                    $data
                );
            }
            $locationId = null;
            $provinceId = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::CBX_PROVINCE));
            if ($provinceId) {
                $province = LocationBase::selectByID($provinceId);
                /* @var LocationBase $province */
                if ($province) {
                    $locationId = $provinceId;
                } else {
                    $data = [
                        'error-control' => FormBuilderHelper::CBX_PROVINCE
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        $data
                    );
                }
            } else {
                $data = [
                    'error-control' => FormBuilderHelper::CBX_PROVINCE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PROVINCE_REQUIRED,
                    $data
                );
            }
            $districtId = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::CBX_DISTRICT));

            if ($districtId) {
                $district = LocationBase::selectByID($districtId);
                /* @var LocationBase $district */
                if ($district) {
                    if ($district->location_parent_id != $provinceId) {
                        $data = [
                            'error-control' => FormBuilderHelper::CBX_PROVINCE
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            $data
                        );
                    }
                    $locationId = $districtId;
                } else {
                    $data = [
                        'error-control' => FormBuilderHelper::CBX_DISTRICT
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                        $data
                    );
                }
            };
            $address = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_ADDRESS));
            if ($address && Helpers::getStrLen($address) > FormBuilderHelper::MAXLENGTH_ADDRESS) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_ADDRESS
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_ADDRESS_MAXLENGTH,
                    $data
                );
            }
            $phone = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::TXT_PHONE));
            $regex = Helpers::convertPHPRegex(trim(Yii::$app->params['regex_validation']['mem_phone']));
            if (!$phone) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_PHONE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PHONE_REQUIRED,
                    $data
                );
            } else if ($phone && Helpers::getStrLen($phone) > FormBuilderHelper::MAXLENGTH_PHONE) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_PHONE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PHONE_MAXLENGTH,
                    $data
                );
            } else if (!preg_match($regex, $phone)) {
                $data = [
                    'error-control' => FormBuilderHelper::TXT_PHONE
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_PHONE_INVALID,
                    $data
                );
            }
            $imagePath = trim(Yii::$app->request->getBodyParam(FormBuilderHelper::IMAGE_PATH));
            $imageUploaded = '';
            if ($imagePath) {
                $uploadDir = Yii::$app->params['prod_user_img_upload_path'];
                $uploadExt = Yii::$app->params['prod_user_img_upload_ext'];
                $imageUploaded = Yii::$app->params['prod_user_img_upload_prefix'] . DIRECTORY_SEPARATOR .
                    Helpers::generateStructurePath("prod_user_") . '.' . $uploadExt;
                $filePath = $uploadDir . DIRECTORY_SEPARATOR . $imageUploaded;
                $imageContent = base64_decode($imagePath);
                if (strlen($imageContent) > 0 + Yii::$app->params['prod_user']['image_upload']['maxSize']) {
                    $data = [
                        'error-control' => FormBuilderHelper::IMAGE_PATH
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_IMAGE_MAXSIZE,
                        $data
                    );
                }
                $img = imagecreatefromstring($imageContent);
                if (!$img) {
                    $data = [
                        'error-control' => FormBuilderHelper::IMAGE_PATH
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_IMAGE_INVALID,
                        $data
                    );
                }
                $filename = uniqid('tmp_') . '.png';
                imagepng($img, $filename);
                $imgInfo = getimagesize($filename);
                unlink($filename);
                if (!($imgInfo[0] > 0 && $imgInfo[1] > 0 && $imgInfo['mime'])) {
                    $data = [
                        'error-control' => FormBuilderHelper::IMAGE_PATH
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_IMAGE_INVALID,
                        $data
                    );
                }
                $fileName = basename($imageUploaded);
                $folders = explode(DIRECTORY_SEPARATOR, str_replace(DIRECTORY_SEPARATOR . $fileName, '', $imageUploaded));
                $currentFolder = $uploadDir . DIRECTORY_SEPARATOR;
                foreach ($folders as $folder) {
                    $currentFolder .= $folder . DIRECTORY_SEPARATOR;
                    if (!file_exists($currentFolder)) {
                        mkdir($currentFolder, 0775);
                    }
                }
                $success = file_put_contents($filePath, $imageContent);
                if (!$success) {
                    $data = [
                        'error-control' => FormBuilderHelper::IMAGE_PATH
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_IMAGE_UPLOAD_FAILED,
                        $data
                    );
                }
            }
            if ($imageUploaded) {
                $imageUploaded = DIRECTORY_SEPARATOR . $imageUploaded;
            }
            $prodUserItem = new ProductCatUserBase();
            $prodUserItem->category_id = $categoryId;
            $prodUserItem->title = $title;
            $prodUserItem->type = $type;
            if ($description)
                $prodUserItem->description = $description;
            if ($categoryAttr)
                $prodUserItem->attr_values = $categoryAttr;
            $prodUserItem->image_path = $imageUploaded;
            $prodUserItem->price = $price;
            $prodUserItem->price_unit = $priceUnit;
            $prodUserItem->mem_contact = $contact;
            $prodUserItem->mem_location_id = $locationId;
            $prodUserItem->mem_address = $address;
            $prodUserItem->mem_phone = $phone;
            $prodUserItem->status = ProductItemUserHelper::STATUS_NEW;
            $prodUserItem->valid_days = $validDays;
            if ($prodUserItem->save()) {
                $message = Yii::t('api', 'Lưu thành công! Tin của bạn sẽ được ban quản trị phê duyệt trong vòng 30 phút.');
                $data['message'] = $message;
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data,
            $message
        );
    }

    public function actionBuyHome()
    {
        try {
            $data = [
                'search-form' => [
                    'control' => BuySellHelper::buildSearchForm(),
                    'csrf_token' => Yii::$app->security->generateRandomString(32),
                    'url' => Url::to(['/v1/classifieds/buy-search']),
                ],
                'data' => [
                    'active' => BuySellHelper::BUY_TAB,
                    'url' => Url::to(['/v1/classifieds/sell-home']),
                    'post_url' => Url::to(['/v1/classifieds/post-item', 'type' => BuySellHelper::BUY_TYPE]),
                ]
            ];
            // searchItem($keySearch, $locationId, $categoryId, $startTime, $endTime, $type = BuySellHelper::BUY_TYPE, $limit = 0, $offset = 0)
            $limit = Yii::$app->params['classifieds_page']['num_of_item'];
            $items = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::BUY_TYPE, $limit);

            $data['data']['items'] = [];
            foreach ($items as $item) {
                /* @var ProductCatUserBase $item */
                $data['data']['items'][] = ProductCatUserHelper::generateProductCatUser($item);
            }
            if (count($data['data']['items']) >= $limit) {
                $data['data']['load_more'] = Url::to(['/v1/classifieds/buy-search-more', 'page' => 2]);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionSellHome()
    {
        try {
            $data = [
                'search-form' => [
                    'control' => BuySellHelper::buildSearchForm(),
                    'csrf_token' => Yii::$app->security->generateRandomString(16),
                    'url' => Url::to(['/v1/classifieds/sell-search']),
                ],
                'data' => [
                    'active' => BuySellHelper::SELL_TAB,
                    'url' => Url::to(['/v1/classifieds/buy-home']),
                    'post_url' => Url::to(['/v1/classifieds/post-item', 'type' => BuySellHelper::SELL_TYPE]),
                ]
            ];
            // searchItem($keySearch, $locationId, $categoryId, $startTime, $endTime, $type = BuySellHelper::BUY_TYPE, $limit = 0, $offset = 0)
//            $items = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::BUY_TYPE);
            $limit = Yii::$app->params['classifieds_page']['num_of_item'];
            $items = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::SELL_TYPE, $limit);
            $data['data']['items'] = [];
            foreach ($items as $item) {
                /* @var ProductCatUserBase $item */
                $data['data']['items'][] = ProductCatUserHelper::generateProductCatUser($item);
            }
            if (count($data['data']['items']) >= $limit) {
                $data['data']['load_more'] = Url::to(['/v1/classifieds/sell-search-more', 'page' => 2]);
            }
        } catch (Exception $ex) {
            return ApiHelper::errorResponse();
        }
        return ApiHelper::formatResponse(
            ApiResponseCode::SUCCESS,
            $data
        );
    }

    public function actionBuySearch()
    {
        try {
            $data = null;
//            $csrfToken = Yii::$app->request->getBodyParam('csrf_token');
//            if (!$csrfToken) {
//                return ApiHelper::formatResponse(
//                    ApiResponseCode::CSRF_TOKEN_REQUIRED,
//                    $data
//                );
//            }
            $limit = Yii::$app->params[$this->constPageConfig]['num_of_item'];
            $keySearch = trim(Yii::$app->request->getBodyParam(BuySellHelper::TXT_SEARCH));
            if ($keySearch && Helpers::getStrLen($keySearch) > 255) {
                $data = [
                    'error-control' => BuySellHelper::TXT_SEARCH
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH,
                    $data
                );
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
                    $data = [
                        'error-control' => BuySellHelper::CBX_PROVINCE
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        $data
                    );
                }
            }
            $districtId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_DISTRICT));
            if ($districtId) {
                $district = LocationBase::selectByID($districtId);
                /* @var LocationBase $district */
                if ($district) {
                    if ($district->location_parent_id) {
                        if ($district->location_parent_id != $provinceId) {
                            $data = [
                                'error-control' => BuySellHelper::CBX_PROVINCE
                            ];
                            return ApiHelper::formatResponse(
                                ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                                $data
                            );
                        }
                    } else {
                        $data = [
                            'error-control' => BuySellHelper::CBX_PROVINCE
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            $data
                        );
                    }

                    $locationIds = $districtId;
                } else {
                    $data = [
                        'error-control' => BuySellHelper::CBX_DISTRICT
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                        $data
                    );
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
                    $data = [
                        'error-control' => BuySellHelper::PRODUCT_CATEGORY
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                        $data
                    );
                }
            }
//            $productId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_ITEM));
//            if ($productId) {
//                $product = ProductItemsBase::selectByID($productId);
//                /* @var ProductItemsBase $product */
//                if ($product) {
//                    if ($product->category_id != $categoryId) {
//                        $data = [
//                            'error-control' => BuySellHelper::PRODUCT_CATEGORY
//                        ];
//                        return ApiHelper::formatResponse(
//                            ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
//                            $data
//                        );
//                    }
//                } else {
//                    $data = [
//                        'error-control' => BuySellHelper::PRODUCT_ITEM
//                    ];
//                    return ApiHelper::formatResponse(
//                        ApiResponseCode::BUYSELL_PRODUCT_ITEM_INVALID,
//                        $data
//                    );
//                }
//            }
            $startTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::START_TIME));
            $startTime = null;
            if ($startTimeStr) {
                $startTime = strtotime($startTimeStr);
                if (date('Y-m-d', $startTime) != $startTimeStr) {
                    $data = [
                        'error-control' => BuySellHelper::START_TIME
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_STARTTIME_INVALID,
                        $data
                    );
                }
            }
            $endTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::END_TIME));
            $endTime = null;
            if ($endTimeStr) {
                $endTime = strtotime($endTimeStr);
                if (date('Y-m-d', $endTime) != $endTimeStr) {
                    $data = [
                        'error-control' => BuySellHelper::END_TIME
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_ENDTIME_INVALID,
                        $data
                    );
                }
            }
            if ($startTime && $endTime && $startTime > $endTime) {
                $data = [
                    'error-control' => BuySellHelper::END_TIME
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_STARTTIME_GREATER_ENDTIME,
                    $data
                );
            }
            // searchItem($keySearch, $locationId, $categoryId, $startTime, $endTime, $type = BuySellHelper::BUY_TYPE, $limit = 0, $offset = 0)
//            $items = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::BUY_TYPE);

            $items = ProductCatUserBase::searchItem($keySearch, $locationIds, $categoryIds, $startTime, $endTime, BuySellHelper::BUY_TYPE, $limit);
            $data['items'] = [];
            if ($items && is_array($items) && count($items)) {
                foreach ($items as $item) {
                    /* @var ProductCatUserBase $item */
                    $data['items'][] = ProductCatUserHelper::generateProductCatUser($item);
                }
                if (count($items) >= $limit) {
                    $data['load_more'] = Url::to(['/v1/classifieds/buy-search-more', 'page' => 2]);
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

    public function actionBuySearchMore()
    {
        try {
            $data = null;
//            $csrfToken = Yii::$app->request->getBodyParam('csrf_token');
//            if (!$csrfToken) {
//                return ApiHelper::formatResponse(
//                    ApiResponseCode::CSRF_TOKEN_REQUIRED,
//                    $data
//                );
//            }
            $limit = Yii::$app->params[$this->constPageConfig]['num_of_item_more'];
            $num_of_item = Yii::$app->params[$this->constPageConfig]['num_of_item'];
            $pageNo = Yii::$app->request->getQueryParam('page');
            $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$this->constPageConfig]['num_of_item']);
            $keySearch = trim(Yii::$app->request->getBodyParam(BuySellHelper::TXT_SEARCH));
            if ($keySearch && Helpers::getStrLen($keySearch) > 255) {
                $data = [
                    'error-control' => BuySellHelper::TXT_SEARCH
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH,
                    $data
                );
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
                    $data = [
                        'error-control' => BuySellHelper::CBX_PROVINCE
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        $data
                    );
                }
            }
            $districtId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_DISTRICT));
            if ($districtId) {
                $district = LocationBase::selectByID($districtId);
                /* @var LocationBase $district */
                if ($district) {
                    if ($district->location_parent_id != $provinceId) {
                        $data = [
                            'error-control' => BuySellHelper::CBX_PROVINCE
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            $data
                        );
                    }
                    $locationIds = $districtId;
                } else {
                    $data = [
                        'error-control' => BuySellHelper::CBX_DISTRICT
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                        $data
                    );
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
                    $data = [
                        'error-control' => BuySellHelper::PRODUCT_CATEGORY
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                        $data
                    );
                }
            }
//            $productId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_ITEM));
//            if ($productId) {
//                $product = ProductItemsBase::selectByID($productId);
//                /* @var ProductItemsBase $product */
//                if ($product) {
//                    if ($product->category_id != $categoryId) {
//                        $data = [
//                            'error-control' => BuySellHelper::PRODUCT_CATEGORY
//                        ];
//                        return ApiHelper::formatResponse(
//                            ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
//                            $data
//                        );
//                    }
//                } else {
//                    $data = [
//                        'error-control' => BuySellHelper::PRODUCT_ITEM
//                    ];
//                    return ApiHelper::formatResponse(
//                        ApiResponseCode::BUYSELL_PRODUCT_ITEM_INVALID,
//                        $data
//                    );
//                }
//            }
            $startTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::START_TIME));
            $startTime = null;
            if ($startTimeStr) {
                $startTime = strtotime($startTimeStr);
                if (date('Y-m-d', $startTime) != $startTimeStr) {
                    $data = [
                        'error-control' => BuySellHelper::START_TIME
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_STARTTIME_INVALID,
                        $data
                    );
                }
            }
            $endTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::END_TIME));
            $endTime = null;
            if ($endTimeStr) {
                $endTime = strtotime($endTimeStr);
                if (date('Y-m-d', $endTime) != $endTimeStr) {
                    $data = [
                        'error-control' => BuySellHelper::END_TIME
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_ENDTIME_INVALID,
                        $data
                    );
                }
            }

            // searchItem($keySearch, $locationId, $categoryId, $startTime, $endTime, $type = BuySellHelper::BUY_TYPE, $limit = 0, $offset = 0)
//            $items = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::BUY_TYPE);

            $items = ProductCatUserBase::searchItem($keySearch, $locationIds, $categoryIds, $startTime, $endTime, BuySellHelper::BUY_TYPE, $limit, $offset);
            $data['items'] = [];
            if ($items && is_array($items) && count($items)) {
                foreach ($items as $item) {
                    /* @var ProductCatUserBase $item */
                    $data['items'][] = ProductCatUserHelper::generateProductCatUser($item);
                }
                if (count($items) >= $limit) {
                    $data['load_more'] = Url::to(['/v1/classifieds/buy-search-more', 'page' => $pageNo + 1]);
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

    public function actionSellSearch()
    {
        try {
            $data = null;
//            $csrfToken = Yii::$app->request->getBodyParam('csrf_token');
//            if (!$csrfToken) {
//                return ApiHelper::formatResponse(
//                    ApiResponseCode::CSRF_TOKEN_REQUIRED,
//                    $data
//                );
//            }
            $limit = Yii::$app->params[$this->constPageConfig]['num_of_item'];
            $keySearch = trim(Yii::$app->request->getBodyParam(BuySellHelper::TXT_SEARCH));
            if ($keySearch && Helpers::getStrLen($keySearch) > 255) {
                $data = [
                    'error-control' => BuySellHelper::TXT_SEARCH
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH,
                    $data
                );
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
                    $data = [
                        'error-control' => BuySellHelper::CBX_PROVINCE
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                        $data
                    );
                }
            }
            $districtId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_DISTRICT));
            if ($districtId) {
                $district = LocationBase::selectByID($districtId);
                /* @var LocationBase $district */

                if ($district) {
                    if ($district->location_parent_id) {
                        if ($district->location_parent_id != $provinceId) {
                            $data = [
                                'error-control' => BuySellHelper::CBX_PROVINCE
                            ];
                            return ApiHelper::formatResponse(
                                ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                                $data
                            );
                        }
                    } else {
                        $data = [
                            'error-control' => BuySellHelper::CBX_PROVINCE
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            $data
                        );
                    }
                    $locationIds = $districtId;
                } else {
                    $data = [
                        'error-control' => BuySellHelper::CBX_DISTRICT
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                        $data
                    );
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
                    $data = [
                        'error-control' => BuySellHelper::PRODUCT_CATEGORY
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                        $data
                    );
                }
            }
            $productId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_ITEM));
            if ($productId) {
                $product = ProductItemsBase::selectByID($productId);
                /* @var ProductItemsBase $product */
                if ($product) {
                    if ($product->category_id != $categoryId) {
                        $data = [
                            'error-control' => BuySellHelper::PRODUCT_CATEGORY
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                            $data
                        );
                    }
                } else {
                    $data = [
                        'error-control' => BuySellHelper::PRODUCT_ITEM
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_PRODUCT_ITEM_INVALID,
                        $data
                    );
                }
            }
            $startTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::START_TIME));
            $startTime = null;
            if ($startTimeStr) {
                $startTime = strtotime($startTimeStr);
                if (date('Y-m-d', $startTime) != $startTimeStr) {
                    $data = [
                        'error-control' => BuySellHelper::START_TIME
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_STARTTIME_INVALID,
                        $data
                    );
                }
            }
            $endTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::END_TIME));
            $endTime = null;
            if ($endTimeStr) {
                $endTime = strtotime($endTimeStr);
                if (date('Y-m-d', $endTime) != $endTimeStr) {
                    $data = [
                        'error-control' => BuySellHelper::END_TIME
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_ENDTIME_INVALID,
                        $data
                    );
                }
            }
            if ($startTime && $endTime && $startTime > $endTime) {
                $data = [
                    'error-control' => BuySellHelper::END_TIME
                ];
                return ApiHelper::formatResponse(
                    ApiResponseCode::BUYSELL_STARTTIME_GREATER_ENDTIME,
                    $data
                );
            }
            // searchItem($keySearch, $locationId, $categoryId, $startTime, $endTime, $type = BuySellHelper::BUY_TYPE, $limit = 0, $offset = 0)
//            $items = ProductCatUserBase::searchItem(null, null, null, null, null, BuySellHelper::BUY_TYPE);
            $items = ProductCatUserBase::searchItem($keySearch, $locationIds, $categoryIds, $startTime, $endTime, BuySellHelper::SELL_TYPE, $limit);
            $data['items'] = [];
            if ($items && is_array($items) && count($items)) {
                foreach ($items as $item) {
                    /* @var ProductCatUserBase $item */
                    $data['items'][] = ProductCatUserHelper::generateProductCatUser($item);
                }
                if (count($items) >= $limit) {
                    $data['load_more'] = Url::to(['/v1/classifieds/sell-search-more', 'page' => 2]);
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

    public function actionSellSearchMore()
    {
        try {
            $data = null;
//            $csrfToken = Yii::$app->request->getBodyParam('csrf_token');
//            if (!$csrfToken) {
//                return ApiHelper::formatResponse(
//                    ApiResponseCode::CSRF_TOKEN_REQUIRED,
//                    $data
//                );
//            }
            $pageNo = Yii::$app->request->getQueryParam('page');
            if ($pageNo > 1) {
                $limit = Yii::$app->params[$this->constPageConfig]['num_of_item_more'];
                $offset = ($pageNo - 1) * $limit - ($limit - Yii::$app->params[$this->constPageConfig]['num_of_item']);
                $keySearch = trim(Yii::$app->request->getBodyParam(BuySellHelper::TXT_SEARCH));
                if ($keySearch && Helpers::getStrLen($keySearch) > 255) {
                    $data = [
                        'error-control' => BuySellHelper::TXT_SEARCH
                    ];
                    return ApiHelper::formatResponse(
                        ApiResponseCode::BUYSELL_SEARCH_MAXLENGTH,
                        $data
                    );
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
                        $data = [
                            'error-control' => BuySellHelper::CBX_PROVINCE
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                            $data
                        );
                    }
                }
                $districtId = trim(Yii::$app->request->getBodyParam(BuySellHelper::CBX_DISTRICT));
                if ($districtId) {
                    $district = LocationBase::selectByID($districtId);
                    /* @var LocationBase $district */
                    if ($district) {
                        if ($district->location_parent_id != $provinceId) {
                            $data = [
                                'error-control' => BuySellHelper::CBX_PROVINCE
                            ];
                            return ApiHelper::formatResponse(
                                ApiResponseCode::BUYSELL_PROVINCE_INVALID,
                                $data
                            );
                        }
                        $locationIds = $districtId;
                    } else {
                        $data = [
                            'error-control' => BuySellHelper::CBX_DISTRICT
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_DISTRICT_INVALID,
                            $data
                        );
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
                        $data = [
                            'error-control' => BuySellHelper::PRODUCT_CATEGORY
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                            $data
                        );
                    }
                }
                $productId = trim(Yii::$app->request->getBodyParam(BuySellHelper::PRODUCT_ITEM));
                if ($productId) {
                    $product = ProductItemsBase::selectByID($productId);
                    /* @var ProductItemsBase $product */
                    if ($product) {
                        if ($product->category_id != $categoryId) {
                            $data = [
                                'error-control' => BuySellHelper::PRODUCT_CATEGORY
                            ];
                            return ApiHelper::formatResponse(
                                ApiResponseCode::BUYSELL_PRODUCT_CATEGORY_INVALID,
                                $data
                            );
                        }
                    } else {
                        $data = [
                            'error-control' => BuySellHelper::PRODUCT_ITEM
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_PRODUCT_ITEM_INVALID,
                            $data
                        );
                    }
                }
                $startTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::START_TIME));
                $startTime = null;
                if ($startTimeStr) {
                    $startTime = strtotime($startTimeStr);
                    if (date('Y-m-d', $startTime) != $startTimeStr) {
                        $data = [
                            'error-control' => BuySellHelper::START_TIME
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_STARTTIME_INVALID,
                            $data
                        );
                    }
                }
                $endTimeStr = trim(Yii::$app->request->getBodyParam(BuySellHelper::END_TIME));
                $endTime = null;
                if ($endTimeStr) {
                    $endTime = strtotime($endTimeStr);
                    if (date('Y-m-d', $endTime) != $endTimeStr) {
                        $data = [
                            'error-control' => BuySellHelper::END_TIME
                        ];
                        return ApiHelper::formatResponse(
                            ApiResponseCode::BUYSELL_ENDTIME_INVALID,
                            $data
                        );
                    }
                }
                $items = ProductCatUserBase::searchItem($keySearch, $locationIds, $categoryIds, $startTime, $endTime, BuySellHelper::SELL_TYPE, $limit, $offset);

                $data['items'] = [];
                if ($items && is_array($items) && count($items)) {
                    foreach ($items as $item) {
                        /* @var ProductCatUserBase $item */
                        $data['items'][] = ProductCatUserHelper::generateProductCatUser($item);
                    }
                    if (count($items) >= $limit) {
                        $data['load_more'] = Url::to(['/v1/classifieds/sell-search-more', 'page' => $pageNo + 1]);
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

    /**
     * @param ProductItemUserBase $item
     * @return array
     */
    private static function generateProductItemUser($item)
    {
        $arr = [
            'title' => $item->title,
            'image_path' => ImageHelper::imagePathThumb($item->image_path, 89, 89, 'prod_user'),
            'price' => [
                'title' => Yii::t('api', 'Giá'),
                'value' => $item->price . ' ' . $item->price_unit
            ],
            'item' => [
                'title' => Yii::t('api', 'Loại'),
                'value' => $item->item ? $item->item->name : ""
            ],
            'location' => [
                'title' => Yii::t('api', 'Tại'),
                'value' => $item->memLocation ? $item->memLocation->location_full : ""
            ],
        ];
        if (date('Y', strtotime($item->start_at)) == date('Y', strtotime($item->expires_at))) {
            $arr['time'] = [
                'title' => Yii::t('api', 'Thời gian'),
                'value' => date('d/m', strtotime($item->start_at)) . '-' . date('d/m/Y', strtotime($item->expires_at))
            ];
        } else {
            $arr['time'] = [
                'title' => Yii::t('api', 'Thời gian'),
                'value' => date('d/m/Y', strtotime($item->start_at)) . '-' . date('d/m/Y', strtotime($item->expires_at))
            ];
        }
        $arr['detail'] = [
            'description' => $item->description,
            'mem_contact' => [
                'title' => Yii::t('api', 'Liên hệ'),
                'value' => $item->mem_contact
            ],
            'mem_address' => [
                'title' => Yii::t('api', 'Địa chỉ'),
                'value' => $item->mem_address
            ],
            'mem_phone' => [
                'title' => Yii::t('api', 'Điện thoại'),
                'value' => $item->mem_phone
            ],
            'mem_email' => [
                'title' => Yii::t('api', 'Email'),
                'value' => $item->mem_email
            ]
        ];
        return $arr;
    }
}