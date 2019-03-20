let configStr = {} //Make this global to use all over the application


configStr.cache_enabled = false
configStr.video_limit_n_box_home = process.env.APP || '1';
configStr.app_cate_limit = '1';
configStr.acceptLostDataTimeout = 10800;
configStr.listPackageInfoMessage = 'Xin chào MSISDN, Quý khách đang sử dụng PACKAGENAME.';
configStr.listPackageCancelConfirm = 'Bạn có muốn Hủy dịch vụ MyClip PACKAGENAME?'
configStr.listPackageConfirm = 'Xem không giới hạn Data 3G các nội dung đặc sắc, hấp dẫn với dịch vụ MyClip, PACKAGENAME. Đăng ký ngay PRICEđ/CYCLE.'
configStr.MOBILESIMPLE = '09x';
configStr.MOBILEGLOBAL = '84x';
configStr.country = '84';
configStr.hiddenLength = 7; // so ky tu can an
configStr.videoLimitNboxHome = 4;
configStr.appCategoryLimit = 12;
configStr.appHotKeywordLimit = 10;
configStr.objectType = ['VOD', 'FILM', 'PLAYLIST'];
configStr.commentMinlength = 3;
configStr.commentMaxlength = 1000;
configStr.commentLimit = 10;
configStr.feedbackLimit = 10;
let randomAvatarChannel = [
    { "bucket": "image1", "path": "banner_random/avatarfd01.jpg" },
    { "bucket": "image2", "path": "banner_random/avatarfd02.jpg" }
];



// define array
let settingQuality = [
    { name: '360p', vod_profile_id: "7", live_profile_id: 12 },
    { name: '480p', vod_profile_id: "20", live_profile_id: 11 },
    { name: '720p', vod_profile_id: "21", live_profile_id: 19 },
];
let settingFeedback = [
    {
        id: 6,
        content: 'Nội dung khiêu dâm'
    },
    {
        id: 7,
        content: 'Vi phạm quyền của tôi'
    },
    {
        id: 8,
        content: 'Chất lượng video kém, mờ'
    },
    {
        id: 9,
        content: 'Mạng kém, bị loading và chập chờn'
    },
    {
        id: 10,
        content: 'Nội dung bạo lực hoặc phản cảm'
    },
    {
        id: 11,
        content: 'Nội dung kích động thù địch hoặc lạm dụng'
    }
];
module.exports = {
    configStr,
    settingQuality,
    settingFeedback,
    randomAvatarChannel
}