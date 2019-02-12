<?php

return [
    //home
    '/' => 'site/index',
    'home/load-weather' => 'weather/home',
    'article-detail/<slug>' => 'article/article-detail',
    'article/load-related-detail/<page>/<slug>' => 'article/load-related-detail',
    'article/download-file/<slug>/<pos>' => 'article/download-file',
    'article/view-file-image/<slug>/<pos>' => 'article/view-file-image',
    'category-article/<slug>' => 'article/category-article',
    'article/load-category-article/<page>/<slug>' => 'article/load-category-article',
    'video-category/<slug>' => 'video/load-in-category',
    'video/load-video-category/<page>/<slug>' => 'video/load-more-in-category',
    'video-detail/<slug>' => 'video/video-detail',
    'video/load-related-video-detail/<page>/<slug>' => 'video/load-related-video-detail',
    # mua ban
    'buy-sell/buy' => 'buy-sell/buy-home',
    'buy-sell/buy-search' => 'buy-sell/buy-search',
    'buy-sell/buy-search-load/<page>' => 'buy-sell/buy-search-load',
    'buy-sell/sell' => 'buy-sell/sell-home',
    'buy-sell/sell-search' => 'buy-sell/sell-search',
    'buy-sell/sell-search-load/<page>' => 'buy-sell/sell-search-load',
    'load-district' => 'common/get-district',
    'product-category/load-product' => 'common/load-product',

    # gia ca
    'price' => 'price/home',
    'price-select' => 'price/home-select',
    'price/price-search' => 'price/search',
    'price/load-price-search/<page>' => 'price/load-search',
    'price/pricelist-detail/<price_id>' => 'price/price-detail',
    // page search
    'search' => 'search/index',
    'search/load-articles/<page>' => 'search/load-articles',
    'search/load-videos/<page>' => 'search/load-videos',
    'weather-home-search' => 'weather/home-search',
    'weather-detail/<location_id>/<date>' => 'weather/load-detail',
    'weather' => 'weather/index',
    'weather/<location_id>' => 'weather/index',
    'load-category-article-more-weather/<slug>/<page>' => 'article/load-more-in-category-weather',
    'buy-sell/compose' => 'buy-sell/compose',
    'buy-sell/compose-submit' => 'buy-sell/compose-submit',
    'product-category/load-attribute' => 'common/load-product-attr',

];
