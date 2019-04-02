let configStr = {} //Make this global to use all over the application


configStr.cache_enabled = true;
configStr.appIdApi = 'app-api';
configStr.appIdWap = 'app-wap';
configStr.appIdWeb = 'app-web';

configStr.videoLimitNboxHome = '1';
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
configStr.appSearchFirstPageLimit = 10;
configStr.refreshTokenTimeout = 1296000; //15 days
configStr.accessTokenTimeout = 3600; //1 hours
configStr.userAgentSecretCode = 'dH3$sYf#dDl';
configStr.loginCaptchaShowCount = 3;
configStr.loginLockCount = 5;
//config captcha
configStr.captchaLength = 1;
//config elasticsearch
configStr.urlElasticSearch = 'http://localhost:9080';
configStr.authBearer = '^Bearer\\s+(.*?)$';
configStr.msisdnRegex = '[0-9]';

configStr.publicKey = "./config/key/public.pem";
configStr.privateKey = "./config/key/private.pem";

configStr.otpMsisdnPerDay = 3;
configStr.otpIpPerDay = 5;
configStr.otpTimeout = 600; //x seconds
configStr.otpLength = 6;
configStr.optFailToDestroy = 3;
configStr.otpLockCount = 5;

configStr.passMaxLength = 128;
configStr.passMinLength = 8;

configStr.categoryHotLimit = 1;
configStr.videoHotRandomlimit = 8;
configStr.appHomeHotchannellimit = 8;

configStr.slideshowHomeLimit = 12;
configStr.categoryLoadMoreLimit=12;
//huync2
configStr.errAuth = "Bạn chưa đăng nhập.";
configStr.quota_free_n_day = 2;
configStr.quota_video_free_n_day = 2;
configStr.CACHE_1DAY = 86400;
configStr.num_video_viewfree_waitregister = 3;
configStr.whitelist_userupload = 3;
configStr.app_source = 3;
configStr.popup_confirm_registersub = 3;
configStr.popup_confirm_buyvideo = 3;
configStr.popup_confirm_buyplaylist = 3;
configStr.popup_confirm_000 = 'Không có quyền xem nội dung';
// Confim mua sub
configStr.popup_confirm_100 = 'Chọn "Đăng Ký" để tiếp tục xem toàn bộ video không giới hạn Data tốc độ cao - #subPriceđ/#cycle.';
// Confim mua sub va video
configStr.popup_confirm_110 = 'Xem hàng #cycle Phim Hot, Clip đặc sắc hoàn toàn miễn cước 3G/4G tốc độ cao chỉ với #subPriceđ/#cycle hoặc mua lẻ với giá #feeđ';
// Confim mua sub va playlist
configStr.popup_confirm_101 = 'Xem hàng #cycle Phim Hot, Clip đặc sắc hoàn toàn miễn cước 3G/4G tốc độ cao chỉ với #subPriceđ/#cycle hoặc mua playlist #playlistName với giá #playlistPriceđ ';
// Confim mua sub va video va playlist
configStr.popup_confirm_111 = 'Xem hàng #cycle Phim Hot, Clip đặc sắc hoàn toàn miễn cước 3G/4G tốc độ cao chỉ với #subPriceđ/#cycle hoặc mua lẻ với giá #feeđ hoặc mua playlist #playlistName với giá #playlistPriceđ';
// Confim mua playlist
configStr.popup_confirm_001 = 'Để xem #videoName, quý khách vui lòng mua playlist #playlistName với giá #playlistPriceđ ';
// Confim mua  video va playlist
configStr.popup_confirm_011 = 'Để xem #videoName, quý khách vui lòng mua lẻ với giá #feeđ hoặc mua playlist #playlistName với giá #playlistPriceđ ';
// Confim mua  video
configStr.popup_confirm_010 = 'Để xem #videoName, quý khách vui lòng mua lẻ với giá #feeđ';
configStr.popup_suggestion_confirm = "";
configStr.popup_suggestion_register_sub = "";
configStr.category_list_watch = "category_list_watch_[userId]";
configStr.free_watch_count = "free_watch_count_[msisdn]";
configStr.popup_confirm_accept_loss_data = "free_watch_count_[msisdn]";
configStr.cdn_mapping_freeData = 1;
configStr.cdn_mapping_lostData = 1;
configStr.s3_vodcdn_timeout = 1;
configStr.s3_vodcdn_encrypt = 1;
configStr.s3_vodcdn_encryptWithIp = 1;
configStr.s3_vodcdn_tokenKey = 1;
configStr.status_GetVideoStream = [0, 1, -1];
configStr.status_actionToggleLikeVideo = [0, 1, -1];
configStr.VnFavouriteVideoBase_STATUS_REMOVE = 0;
configStr.VnFavouriteVideoBase_STATUS_DISLIKE = -1;
configStr.VnFavouriteVideoBase_STATUS_LIKE = 1;
configStr.recommendation_enable = 1;
configStr.RecommendationService_BOX_RELATED = 1;
configStr.max_related_video = 1;
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