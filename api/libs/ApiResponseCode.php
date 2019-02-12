<?php

/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/20/2015
 * Time: 3:48 PM
 */

namespace api\libs;

use common\helpers\BuySellHelper;
use common\helpers\FormBuilderHelper;
use Yii;

class ApiResponseCode
{

// xxyyzz: xx: function; yy: action; zz: error code in action
    const SUCCESS = '000000';
    const SYSTEM_ERROR = '000001';
    const REQUIRE_LOGIN = '000002';
    const UNKNOWN_METHOD = '000003';
    const AUTHORIZATION_CODE_REQUIRED = '000004';
    const LOGIN_IS_REQUIRED = '000005';  // zz = 08 // need to login
    const CSRF_TOKEN_REQUIRED = '000006'; //
    const CSRF_TOKEN_INVALID = '000007'; //
    const UNKNOWN = '999999';
// xxyyzz: xx = 30: Authenticate & Authorization; yy = 00: GetAuthorizationCode
    const AUTH_INVALID_ID = '300001'; // zz = 01 // invalid client (wrong id and secret)
    const AUTH_INVALID_AUTHORIZATION_CODE = '300002';  // zz = 02 // invalid authorization code
    const AUTH_INVALID_USERNAME_PASSWORD = '300003';  // zz = 03 // invalid username password
    const AUTH_USER_NOT_ACTIVE = '300004';  // zz = 04 // user is not active
    const AUTH_USER_IS_LOCKED = '300005';  // zz = 05 // user is locked
    const AUTH_USER_PASS_IS_REQUIRED = '300006';  // zz = 06 // username and password is required
    const AUTH_CLIENT_ID_SECRET_IS_REQUIRED = '300007';  // zz = 07 // client id and client secret is required
// xxyyzz: xx = 62: Buy&Sell; yy = 00: post item;
    const BUYSELL_TITLE_REQUIRED = '620001';
    const BUYSELL_TITLE_MAXLENGTH = '620002';
    const BUYSELL_STARTTIME_REQUIRED = '620003';
    const BUYSELL_STARTTIME_INVALID = '620004';
    const BUYSELL_ENDTIME_REQUIRED = '620005';
    const BUYSELL_ENDTIME_INVALID = '620006';
    const BUYSELL_STARTTIME_GREATER_ENDTIME = '620007';
    const BUYSELL_PRODUCT_CATEGORY_REQUIRED = '620008';
    const BUYSELL_PRODUCT_CATEGORY_INVALID = '620009';
    const BUYSELL_PRODUCT_ITEM_REQUIRED = '620010';
    const BUYSELL_PRODUCT_ITEM_INVALID = '620011';
    const BUYSELL_PRICE_UNIT_INVALID = '620012';
    const BUYSELL_PRICE_UNIT_REQUIRED = '620013';
    const BUYSELL_CONTACT_REQUIRED = '620014';
    const BUYSELL_CONTACT_INVALID = '620015';
    const BUYSELL_CONTACT_MAXLENGTH = '620016';
    const BUYSELL_PROVINCE_REQUIRED = '620017';
    const BUYSELL_PROVINCE_INVALID = '620018';
    const BUYSELL_DISTRICT_REQUIRED = '620019';
    const BUYSELL_DISTRICT_INVALID = '620020';
    const BUYSELL_PRICE_REQUIRED = '620021';
    const BUYSELL_PRICE_INVALID = '620022';
    const BUYSELL_PRICE_MAXLENGTH = '620023';
    const BUYSELL_ADDRESS_MAXLENGTH = '620024';
    const BUYSELL_ADDRESS_REQUIRED = '620025';
    const BUYSELL_EMAIL_REQUIRED = '620026';
    const BUYSELL_EMAIL_INVALID = '620027';
    const BUYSELL_EMAIL_MAXLENGTH = '620028';
    const BUYSELL_PHONE_REQUIRED = '620029';
    const BUYSELL_PHONE_INVALID = '620030';
    const BUYSELL_PHONE_MAXLENGTH = '620031';
    const BUYSELL_IMAGE_UPLOAD_FAILED = '620032';
    const BUYSELL_TYPE_REQUIRED = '620033';
    const BUYSELL_TYPE_INVALID = '620034';
    const BUYSELL_VALID_DATE_REQUIRED = '620035';
    const BUYSELL_VALID_DATE_INVALID = '620036';
    const BUYSELL_ATTR_MAXLENGTH = '620037';
    const BUYSELL_ATTR_INVALID = '620038';
    const BUYSELL_IMAGE_INVALID = '620039';
    const BUYSELL_IMAGE_MAXSIZE = '620040';
// xxyyzz: xx = 62: Buy&Sell; yy = 01: search item;
    const BUYSELL_SEARCH_MAXLENGTH = '620101';
    #huync2 price
    const PRICE_PRODUCT_CATEGORY_INVALID = '620009';
    const PRICE_PRODUCT_CATEGORY_REQUIRED = '620008';
    const PRICE_PROVINCE_INVALID = '620018';
    const PRICE_PROVINCE_REQUIRED = '620017';
    const PRICE_PRODUCT_ITEM_INVALID = '620011';
    #huync2 weather
    const WEATHER_PROVINCE_REQUIRED = '620017';
    const WEATHER_PROVINCE_INVALID = '620018';
    const SEARCH_MAXLENGTH = '6201011';
    const SEARCH_REQUIRED = '6201012';

    public static function getMessage($errorCode)
    {
        $mess = [
            self::SUCCESS => Yii::t('api', 'Successful'),
            self::SYSTEM_ERROR => Yii::t('api', 'Hệ thống đang bận, vui lòng thử lại sau.'),
            self::UNKNOWN_METHOD => Yii::t('api', 'Unknown method'),
            self::UNKNOWN => Yii::t('api', 'Unknown Error'),
            self::AUTHORIZATION_CODE_REQUIRED => Yii::t('api', 'Authorization code is required'),
            self::LOGIN_IS_REQUIRED => Yii::t('api', 'You are not authorized to perform this action'),
            self::CSRF_TOKEN_REQUIRED => Yii::t('api', 'CSRF token is required'),
            self::CSRF_TOKEN_INVALID => Yii::t('api', 'CSRF token is invalid'),
            self::REQUIRE_LOGIN => Yii::t('api', 'Require login.'),
            // Authenticate & Authorization
            self::AUTH_INVALID_ID => Yii::t('api', 'Wrong client id and client secret'),
            self::AUTH_INVALID_AUTHORIZATION_CODE => Yii::t('api', 'Invalid authorization code'),
            self::AUTH_INVALID_USERNAME_PASSWORD => Yii::t('api', 'Invalid username password'),
            self::AUTH_USER_NOT_ACTIVE => Yii::t('api', 'Your account is not active'),
            self::AUTH_USER_IS_LOCKED => Yii::t('api', 'Your account is locked'),
            self::AUTH_USER_PASS_IS_REQUIRED => Yii::t('api', 'Username and Password is required'),
            self::AUTH_CLIENT_ID_SECRET_IS_REQUIRED => Yii::t('api', 'Client id and Client secret is required'),
            // Buy & Sell
            self::BUYSELL_TITLE_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Tiêu đề"'),
            self::BUYSELL_TITLE_MAXLENGTH => Yii::t('api', 'Dữ liệu trường "Tiêu đề" vượt quá ' .
                FormBuilderHelper::MAXLENGTH_TITLE . ' ký tự'),
            self::BUYSELL_STARTTIME_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Ngày bắt đầu"'),
            self::BUYSELL_STARTTIME_INVALID => Yii::t('api', 'Dữ liệu trường "Ngày bắt đầu" không hợp lệ'),
            self::BUYSELL_ENDTIME_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Ngày kết thúc"'),
            self::BUYSELL_ENDTIME_INVALID => Yii::t('api', 'Dữ liệu trường "Ngày kết thúc" không hợp lệ'),
            self::BUYSELL_STARTTIME_GREATER_ENDTIME => Yii::t('api', '"Ngày bắt đầu" không được lớn hơn "Ngày kết thúc"'),
            self::BUYSELL_PRODUCT_CATEGORY_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Danh mục"'),
            self::BUYSELL_PRODUCT_CATEGORY_INVALID => Yii::t('api', 'Dữ liệu trường "Danh mục" không hợp lệ'),
            self::BUYSELL_PRODUCT_ITEM_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Sản phẩm"'),
            self::BUYSELL_PRODUCT_ITEM_INVALID => Yii::t('api', 'Dữ liệu trường "Sản phẩm" không hợp lệ'),
            self::BUYSELL_PRICE_UNIT_INVALID => Yii::t('api', 'Dữ liệu trường "Đơn vị tính" không hợp lệ'),
            self::BUYSELL_PRICE_UNIT_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn "Đơn vị tính"'),
            self::BUYSELL_CONTACT_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Tên liên hệ"'),
            self::BUYSELL_CONTACT_INVALID => Yii::t('api', 'Dữ liệu trường "Tên liên hệ" không hợp lệ'),
            self::BUYSELL_CONTACT_MAXLENGTH => Yii::t('api', 'Dữ liệu trường "Tên liên hệ" vượt quá ' .
                FormBuilderHelper::MAXLENGTH_CONTACT . ' ký tự'),
            self::BUYSELL_PROVINCE_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn "Tỉnh/thành"'),
            self::BUYSELL_PROVINCE_INVALID => Yii::t('api', 'Dữ liệu trường "Tỉnh/thành" không hợp lệ'),
            self::BUYSELL_DISTRICT_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn "Quận/huyện/TP"'),
            self::BUYSELL_DISTRICT_INVALID => Yii::t('api', 'Dữ liệu trường "Quận/huyện/TP" không hợp lệ'),
            self::BUYSELL_PRICE_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Giá"'),
            self::BUYSELL_PRICE_INVALID => Yii::t('api', 'Dữ liệu trường "Giá" không hợp lệ. Bạn chỉ được nhập ký tự số và ký tự "."'),
            self::BUYSELL_PRICE_MAXLENGTH => Yii::t('api', 'Dữ liệu trường "Giá" vượt quá ' .
                FormBuilderHelper::MAXLENGTH_PRICE . ' ký tự'),
            self::BUYSELL_ADDRESS_MAXLENGTH => Yii::t('api', 'Dữ liệu trường "Địa chỉ" vượt quá ' .
                FormBuilderHelper::MAXLENGTH_ADDRESS . ' ký tự'),
            self::BUYSELL_ADDRESS_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Địa chỉ"'),
            self::BUYSELL_EMAIL_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Email"'),
            self::BUYSELL_EMAIL_INVALID => Yii::t('api', 'Dữ liệu trường "Email" không hợp lệ'),
            self::BUYSELL_EMAIL_MAXLENGTH => Yii::t('api', 'Dữ liệu trường "Email" vượt quá ' .
                FormBuilderHelper::MAXLENGTH_EMAIL . ' ký tự'),
            self::BUYSELL_PHONE_REQUIRED => Yii::t('api', 'Bạn vui lòng nhập dữ liệu cho trường "Số điện thoại"'),
            self::BUYSELL_PHONE_INVALID => Yii::t('api', 'Dữ liệu "Số điện thoại" không hợp lệ'),
            self::BUYSELL_PHONE_MAXLENGTH => Yii::t('api', 'Dữ liệu "Số điện thoại" vượt quá ' .
                FormBuilderHelper::MAXLENGTH_PHONE . ' ký tự'),
            self::BUYSELL_IMAGE_UPLOAD_FAILED => Yii::t('api', 'Ảnh bạn đưa lên server bị lỗi.'),
            self::BUYSELL_TYPE_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn loại mua hay loại bán'),
            self::BUYSELL_TYPE_INVALID => Yii::t('api', 'Dữ liệu loại đưa tin không hợp lệ'),
            self::BUYSELL_SEARCH_MAXLENGTH => Yii::t('api', 'Dữ liệu tìm kiếm vượt quá ' .
                BuySellHelper::MAXLENGTH_SEARCH . ' ký tự'),
            self::BUYSELL_VALID_DATE_REQUIRED => Yii::t('api', 'Bạn chưa chọn trường "Hạn đăng tin"'),
            self::BUYSELL_VALID_DATE_INVALID => Yii::t('api', 'Dữ liệu trường "Hạn đăng tin" không hợp lệ'),
            self::BUYSELL_ATTR_MAXLENGTH => Yii::t('api', 'Bạn nhập trường thuộc tính dài hơn ' .
                FormBuilderHelper::MAXLENGTH_ATTR . ' ký tự'),
            self::BUYSELL_ATTR_INVALID => Yii::t('api', 'Dữ liệu thuộc tính không hợp lệ'),
            self::BUYSELL_IMAGE_INVALID => Yii::t('api', 'File ảnh không hợp lệ'),
            self::BUYSELL_IMAGE_MAXSIZE => Yii::t('api', 'File ảnh không đúng dung lượng, ảnh upload không quá ' .
                    Yii::$app->params['prod_user']['image_upload']['maxSize']) / 1024 / 1024 . ' MB',
            #huync2 price
            self::PRICE_PRODUCT_CATEGORY_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn "Danh mục"'),
            self::PRICE_PRODUCT_CATEGORY_INVALID => Yii::t('api', 'Dữ liệu trường "Danh mục" không hợp lệ'),
            self::PRICE_PROVINCE_INVALID => Yii::t('api', 'Dữ liệu trường "Tỉnh/thành" không hợp lệ'),
            self::PRICE_PROVINCE_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn "Tỉnh/thành"'),
            self::PRICE_PRODUCT_ITEM_INVALID => Yii::t('api', 'Dữ liệu trường "Sản phẩm" không hợp lệ'),
            #HUYNC2 WEATHER
            self::WEATHER_PROVINCE_REQUIRED => Yii::t('api', 'Bạn vui lòng chọn "Tỉnh/thành"'),
            self::WEATHER_PROVINCE_INVALID => Yii::t('api', 'Dữ liệu trường "Tỉnh/thành" không hợp lệ'),
            self::SEARCH_REQUIRED => Yii::t('api', 'Bạn phải nhập từ khóa'),
            self::SEARCH_MAXLENGTH => Yii::t('api', 'Dữ liệu tìm kiếm vượt quá ' .
                BuySellHelper::MAXLENGTH_SEARCH . ' ký tự'),
        ];
        if ($mess[$errorCode]) {
            return $mess[$errorCode];
        }
        return '';
    }

}
