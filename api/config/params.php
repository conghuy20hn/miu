<?php

use common\helpers\MenuHelper;

return [
    'home_page' => [
        'main_template' => '[{"type":"banner"},{"type":"news","cat_id":"87","cat_childs":"0"},{"type":"price_list"}]',
        '2nd_template' => '[{"type":"weather"},{"type":"video","cat_id":"43"},{"type":"news","cat_id":"86","cat_childs":"0"},{"type":"news","cat_id":"87","cat_childs":"0"},{"type":"news","cat_id":"1","cat_childs":"1"},{"type":"video","cat_id":"42"}]',
        'num_of_hot_news' => 5,
        'num_of_price_cat_list' => 3,
        'num_of_price_item_list' => 3,
        'num_of_child_cat_article' => 3,
        'num_of_article_in_cat' => 5,
        'num_of_weathers' => 7,
        'num_of_videos' => 2,
    ],
    'article_page' => [
        'num_of_news' => 6,
        'num_of_news_per_page' => 2,
        'num_of_related_article' => 2,
        'num_of_related_article_more' => 2,
    ],
    'video_page' => [
        'num_of_video' => 2,
        'num_of_video_per_page' => 10,
        'num_of_related_video' => 5,
        'num_of_related_video_more' => 4,
    ],
    'top_menu' => [
        [
            'type' => MenuHelper::HOME,
            'title' => 'Trang chủ'
        ],
        [
            'type' => MenuHelper::CLASSIFIEDS_BUY,
            'title' => 'Mua bán'
        ],
        [
            'type' => MenuHelper::PRICE_LIST,
            'title' => 'Giá Tôm'
        ],
        [
            'type' => MenuHelper::NEWS,
            'cat_id' => '1'
        ],
        [
            'type' => MenuHelper::NEWS,
            'cat_id' => '35'
        ],
        [
            'type' => MenuHelper::NEWS,
            'cat_id' => '18'
        ],
    ],
    'product_categories_attr' => [
        1 => "Hiển thị trang chủ"
    ],
    'product_categories_display_type' => [
        1 => "Tôm",
        2 => "Vật tư",
    ],
    'product_items_price_unit' => [
        'đồng / tấn' => 'đồng / tấn',
        'đồng / tạ' => 'đồng / tạ',
        'đồng / yến' => 'đồng / yến',
        'đồng / kg' => 'đồng / kg',
        'đồng / g' => 'đồng / g',
    ],
    'product_items_attr' => [
        1 => "Hiển thị trang chủ"
    ],
    'classifieds_page' => [
        'num_of_item' => 5,
        'num_of_item_more' => 5,
    ],
    'price_list_page' => [
        'num_of_item' => 5,
        'num_of_item_more' => 3,
    ],
    'article_home_weather' => [
        'num_of_item' => 4,
        'category_id' => 88,
    ],
    'weather_limit_day' => 7,

    # huync2 copy cau hinh
    'slug_raise_shrimp' => '',
    'product_cat_user_attribute_attr' => [
        1 => "Hiển thị ở danh sách",
    ],
    'weather_img_template' => 'http://192.168.146.252:9556/data/weather/{weather_code}.png',
    'media_path' => 'http://192.168.146.252:9556/upload',
    'streaming_media_path' => 'http://192.168.146.252:9556/upload',
    'article_default_media_path' => 'http://192.168.146.252:9556/data/4x3.png',
    'video_default_media_path' => 'http://192.168.146.252:9556/data/16x9.png',
    'price1_default_media_path' => 'http://192.168.146.252:9556/data/4x4.png',
    'price2_default_media_path' => 'http://192.168.146.252:9556/data/4x4.png',
    'prod_user_default_media_path' => 'http://192.168.146.252:9556/data/4x4.png',
    'video_default_thumb_path' => '/data/16x9.png',
    'article_default_thumb_path' => '/data/4x3.png',
    'price1_default_thumb_path' => '/data/4x4.png',
    'price2_default_thumb_path' => '/data/4x4.png',
    'prod_user_default_thumb_path' => '/data/4x4.png',
    'article_default_thumb_full_path' => '/home/ths/apps/ths_std/wap/web/data/4x3.png',
    'price1_default_thumb_full_path' => '/home/ths/apps/ths_std/wap/web/data/4x4.png',
    'price2_default_thumb_full_path' => '/home/ths/apps/ths_std/wap/web/data/4x4.png',
    'prod_user_default_thumb_full_path' => '/home/ths/apps/ths_std/wap/web/data/4x4.png',
    'video_default_thumb_full_path' => '/home/ths/apps/ths_std/wap/web/data/16x9.png',
    'image_thumb_path' => '/home/ths/apps/ths_std/wap/web/thumb',
    'media_thumb_path' => 'http://192.168.146.252:9556/thumb',
    'article_img_upload_path' => '/home/ths/apps/ths_std/wap/web/upload',
    'video_img_upload_path' => '/home/ths/apps/ths_std/wap/web/upload',
    'price1_img_upload_path' => '/home/ths/apps/ths_std/wap/web/upload',
    'price2_img_upload_path' => '/home/ths/apps/ths_std/backend/web',
    'prod_user_img_upload_path' => '/home/ths/apps/ths_std/wap/web/upload',
    'prod_user_img_upload_prefix' => 'prod_user',
    'prod_user_img_upload_ext' => 'png',
    'video_upload_path' => '',
    'server_name' => 'http://192.168.146.252:9556',
    'location_default' => 5,
    'media_host_replace' => '{media_host}',
    'path_article_replace' => '/upload/ckfinder/',
    'prod_user' => [
        'valid_date' => [
            '7' => '1 tuần',
            '14' => '2 tuần',
            '21' => '3 tuần',
            '30' => '1 tháng',
            '90' => '3 tháng',
            '180' => '6 tháng',
        ],
        'image_upload' => [
            'ext' => 'gif,jpg,jpeg,png',
            'maxSize' => 5 * 1024 * 1024, //5Mb
            'save_ext' => 'png',
        ]
    ],
    'regex_validation' => [
        'mem_phone' => "^(\\+\\d{2,4})?((\\d?\\.?\\s?){4,15})$",
        'mem_email' => "^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,3})$",
        'price' => "^(\\+\\d{1,3})?((\\d?\\.?\\s?){0,15})$"
    ],
    'search_page' => [
        'num_of_article' => 8,
        'num_of_article_more' => 5,
        'num_of_video' => 10,
        'num_of_video_more' => 10,
    ],
//    'prod_user_img_upload_path' => 'D:\Data\Tom_khoe\trunk\ths-wap-cms\wap\web\upload',
    'upload_prod_user_image' => [
        'maxSize' => 5 * 1024 * 1024,
        'ext' => 'gif,jpg,jpeg,png',
        'save_ext' => 'png',
    ],
    'weather_description' => [
        'clear_sky' => 'Trời nắng',
        'few_clouds' => 'Trời nắng',
        'scattered_clouds' => '<script> alert(1) </script>',
        'overcast_clouds' => 'Nhiều mây khong mua',
        'broken_clouds' => 'Nhiều mây',
        'shower_rain' => 'Có mưa',
        'rain' => 'Có mưa',
        'thunderstorm' => 'Mưa to',
        'snow' => 'Có tuyết',
        'mist' => 'Có sương mù',
        'sky_is_clear' => 'Trời quang mây',
	'light_rain' => 'Mưa nhẹ',
    ],
];
