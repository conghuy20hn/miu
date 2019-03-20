module.exports = {
    VIDEO: 'VIDEO',
    FILM: 'FILM',
    MUSIC: 'MUSIC',
    VOD: 'VOD',
    CATEGORY: 'CATEGORY',
    CATEGORY_GROUP: 'category_group_',
    TOPIC_GROUP: 'topic_group_',
    VIDEO_OF_USER: 'video_of_user_',

    BANNER: 'banner',
    FOCUS: 'focus',
    NEWSFEED: 'NEWSFEED',
    VIDEO_SEARCH: 'video_search',
    VIDEO_NEWSFEED: 'video_newsfeed',
    VIDEO_NEW: 'video_new',
    VIDEO_HOT: 'video_hot',
    VIDEO_HISTORY: 'video_history',
    VIDEO_RECOMMEND: 'video_recommend',
    VIDEO_FREE: 'video_free',
    VIDEO_RELATE: 'video_relate',
    VIDEO_MOST_RELATE: 'video_most_relate',
    VIDEO_FOLLOW: 'video_follow',
    VIDEO_OWNER: 'video_owner',
    VIDEO_WATCH_LATER: 'video_watch_later',
    VIDEO_OF_PLAYLIST: 'video_playlist_',
    VIDEO_CHANNEL_FOLLOW: 'video_channel_follow',
    LIST_CHANNEL_FOLLOW: 'list_channel_follow',
    LIST_CHANNEL_FOLLOW_WITH_HOT: 'list_channel_follow_with_hot',
    VIDEO_MOST_VIEW_OF_CHANNEL: 'video_most_view_of_channel_',
    VIDEO_NEW_OF_CHANNEL: 'video_new_of_channel_',
    VIDEO_OLD_OF_CHANNEL: 'video_old_of_channel_',
    MUSIC_NEW: 'music_new',
    MUSIC_RECOMMEND: 'music_recommend',
    MUSIC_HISTORY: 'music_history',
    MUSIC_FREE: 'music_free',

    PLAYLIST_SEARCH: 'playlist_search',
    USER_FOLLOW: 'user_follow',
    USER_FOLLOW_VIDEO: 'user_follow_video',
    USER_FOLLOW_MUSIC: 'user_follow_music',

    FILM_HOT: 'film_hot',
    FILM_RECOMMEND: 'film_recommend',
    FILM_NEW: 'film_new',
    FILM_FREE: 'film_free',
    FILM_RELATE: 'film_relate',

    MEMBER: 'member',
    MEMBER_FOLLOW: 'member_follow',
    MEMBER_FOLLOW_VIEW: 'member_follow_',


    VIDEO_USER_LIKE: 'video_user_like_',

    // config key redis
    promotion_popup_firsttime: 'promotion.popup.firsttime',
    promotion_: 'promotion_',

    //config cycle
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH',

    // size image
    SIZE_COVER: 'cover',
    SIZE_VIDEO: 'video',

    SIZE_VIDEO_WEB_HOME: 'video_web_home',
    SIZE_VIDEO_WAP_HOME: 'video_wap_home',
    SIZE_VIDEO_LIST_DETAIL: 'video_list_detail',

    SIZE_FILM: 'film',
    SIZE_BANNER: 'banner',
    SIZE_AVATAR: 'avatar',
    SIZE_CHANNEL: 'channel',
    SIZE_CHANNEL2: 'channel2',
    SIZE_CHANNEL3: 'channel3',

    SIZE_CHANNEL_LOGO_LIST: 'channel_logo_list',
    SIZE_CHANNEL_LOGO_DETAIL: 'channel_logo_detail',
    HOME_VIDEO_V2: 'home_video_v2',
    SIZE_CATEGORY: 'category',
    CATEGORY_PARENT: 'category_parent',
    VIDEO_HOT_2: 'video_hot_2',

    MUSIC_FILTER: 'MUSIC_FILTER',
    VOD_FILTER: 'VOD_FILTER',
    getName(name) {
        var obj = {
            banner: 'Banner',
            video_search: 'Tìm kiếm video',
            video_newsfeed: 'News feed',
            video_new: 'Video mới cập nhật',
            music_new: 'Nhạc mới cập nhật',
            music_recommend: 'Có thể bạn thích',
            video_hot: 'Video hot',
            video_history: 'Xem gần đây',
            video_recommend: 'Có thể bạn thích',
            video_free: 'Video miễn phí',
            playlist_search: 'Tìm kiếm Phim',
            film_hot: 'Hot nhất tuần',
            film_recommend: 'Phim đề xuất',
            film_new: 'Phim mới nhất',
            film_free: 'Phim miễn phí',
            category_group_: 'Thể loại',
            member: 'Thành viên',
            member_follow: 'Đang theo dõi',
            user_follow: 'Theo dõi',
            user_follow_video: 'Theo dõi',
            user_follow_music: 'Theo dõi',
            music_history: 'Xem gần đây',
            film_free: 'Nhạc miễn phí',
            DAY: 'Ngày',
            WEEK: 'Tuần',
            MONTH: 'Tháng',

        };
        if (obj.hasOwnProperty(name)) {
            return obj[name];
        }
        return '';
    }
}