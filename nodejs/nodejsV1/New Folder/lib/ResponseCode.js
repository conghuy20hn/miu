module.exports = {

    //2xx
    SUCCESS: '200',
    UNSUCCESS: '201',
    SUCCESS_LOGOUT: '202',
    SUCCESS_CHANGE_PASS: '203',

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
    INVALID_CONTENT_SEARCH: '241',
    INVALID_CONTENT_EMPTY: '242',
    INVALID_USERNAME_PWD_EMPTY: '243',
    INVALID_TOKEN: '245',
    INVALID_ACCESS_TOKEN_EMPTY: '246',
    INVALID_REFRESH_TOKEN: '247',
    FAIL_LOGOUT: '248',
    FAIL_LOGIN: '249',
    FAIL_OTP: '250',
    INVALID_MSISDN: '251',
    INVALID_PARAM_EMPTY: '252',
    INVALID_PARAM_LENGTH: '253',
    USER_EXITS: '254',
    OTP_EXPIRED: '255',
    INVALID_OTP: '256',

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
            202: 'Đăng xuất thành công',
            203: 'Đổi mật khẩu thành công!',


            234: 'Thông tin không hợp lệ',
            235: 'Dữ liệu không hợp lệ',
            236: 'Quý khách vui lòng nhập bình luận từ MIN% đến MAX% ký tự.',
            237: 'Thông tin bình luân không hợp lệ. Vui lòng kiểm tra lỗi.',
            238: 'Nội dung bình luận không tồn tại',
            239: 'Nội dung từ MIN đến MAX kí tự',
            240: 'Thực hiện báo cáo thành công, chúng tôi sẽ xem xét và xử lý trong 24h',
            241: 'Nội dung tìm kiếm không hợp lệ. Tối đa 255 kí tự',
            242: 'Vui lòng nhập nhập nội dung tìm kiếm',
            243: 'Quý khách vui lòng nhập Số thuê bao và Mật khẩu',
            245: 'accessToken không hợp lệ',
            246: 'Access Token không được để trống',
            247: 'Dữ liệu không hợp lệ, thiếu refresh_token',
            248: 'Đăng xuất thất bại',
            249: 'Khách hàng chưa đăng nhập',
            250: 'Quý khách đã nhận quá số lượng tin nhắn xác thực trong ngày',
            251: 'Số điện thoại không hợp lệ. Quý khách vui lòng nhập định dạng số điện thoại',
            252: 'Yêu cầu nhập dữ liệu',
            253: 'Độ dài mật khẩu từ MIN đến MAX kí tự',
            254: 'Đăng ký không thành công, số thuê bao đã tồn tại',
            255: 'Mã OTP không đúng hoặc đã hết hạn',
            256: 'Mã OTP không đúng hoặc đã hết hạn',

            401: 'Mã xác thực không hợp lệ',
            410: 'Đăng nhập không thành công, số điện thoại hoặc mật khẩu không hợp lệ',

            411: 'Mật khẩu cũ không hợp lệ',
            412: 'Mật khẩu mới không hợp lệ. Độ dài mật khẩu từ 8 đến 128 ký tự',
            413: '2 mật khẩu mới không giống nhau',
            414: 'Mật khẩu mới không được trùng mật khẩu cũ',

            403: 'Xác thực không thành công',
            404: 'Đối tượng không tồn tại',

            500: 'Lỗi hệ thống',
            808: 'Mã xác nhận không hợp lệ',
            800: 'Quý khách vui lòng nhập mã xác nhận',
            888: 'Quý khách đăng nhập lỗi nhiều lần, xin vui lòng thử lại sau 10 phút!',

        };
        if (mess.hasOwnProperty(errorCode)) {
            return mess[errorCode];
        }
        return '';
    }
}