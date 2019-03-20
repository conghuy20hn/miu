module.exports = {

    //2xx
    SUCCESS: '200',
    UNSUCCESS: '201',

    //21x: khai bao cho VtFlow
    ACCESS_TOKEN_INVALID: '230',
    ACCESS_TOKEN_EXPIRED: '231',
    REFRESH_TOKEN_INVALID: '232',
    REFRESH_TOKEN_EXPIRED: '233',
    INVALID_PARAM: '234',
    INVALID_DATA: '235',
    INVALID_LENGTH: '236',
    INVALID_COMMENT: '237',
    INVALID_CONTENT_COMMENT: '238',
    INVALID_CONTENT_FEEDBACK: '239',
    FEEDBACK_SUCCESS: '240',


    //4xx
    UNAUTHORIZED: '401',
    FORBIDDEN: '403',
    NOT_FOUND: '404',
    LOGIN_FAIL: '410',

    INVALID_OLD_PASSWORD: '411',
    INVALID_NEW_PASSWORD: '412',
    INVALID_MAP_PASSWORD: '413',
    INVALID_MAP_NEW_PASSWORD: '414',

    EMPTY_MSISDN: '440',
    NOT_MEMBER: '444',


    //5xx
    SYSTEM_ERROR: '500',

    //8x

    CAPTCHA_EMPTY: '800',
    CAPTCHA_INVALID: '808',
    LOCK_USER: '888',

    //9xx
    // user chua dang ky
    USER_UNREGISTERED: 900,
    //user bi ha xuong
    USER_INACTIVE: 909,

    getMessage(errorCode) {
        var mess = {
            200: 'Thành công',
            201: 'Thất bại',
            234: 'Thông tin không hợp lệ',
            235: 'Dữ liệu không hợp lệ',
            236: 'Quý khách vui lòng nhập bình luận từ MIN% đến MAX% ký tự.',
            237: 'Thông tin bình luân không hợp lệ. Vui lòng kiểm tra lỗi.',
            238: 'Nội dung bình luận không tồn tại',
            239: 'Nội dung từ MIN đến MAX kí tự',
            240: 'Thực hiện báo cáo thành công, chúng tôi sẽ xem xét và xử lý trong 24h',

            401: 'Mã xác thực không hợp lệ',
            410: 'Đăng nhập không thành công, số điện thoại hoặc mật khẩu không hợp lệ',

            411: 'Mật khẩu cũ không hợp lệ',
            412: 'Mật khẩu mới không hợp lệ. Độ dài mật khẩu từ 8 đến 128 ký tự',
            413: '2 mật khẩu mới không giống nhau',
            414: 'Mật khẩu mới không được trùng mật khẩu cũ',

            403: 'Xác thực không thành công',
            404: 'Đối tượng không tồn tại',

            500: 'Lỗi hệ thống',

        };
        if (mess.hasOwnProperty(errorCode)) {
            return mess[errorCode];
        }
        return '';
    }
}