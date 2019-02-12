<?php

return [
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'components' => [
        'i18n' => [
            'translations' => [
                'frontend*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@common/messages',
                ],
                'wap*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@common/messages',
                ],
                'api*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@common/messages',
                ],
                'backend*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@common/messages',
                ],
            ],
        ],
    ],
    'modules' => [
        // Yii2 Articles
        'articles' => [
            'class' => 'cinghie\articles\Articles',
            // Select Languages allowed
            'languages' => [
                "vi-VN" => "vi-VN",
            ],
            // Select Editor: no-editor, ckeditor, imperavi, tinymce, markdown
            'editor' => 'ckeditor',
            // Select Image Name: categoryname, original, casual
            'imageNameType' => 'categoryname',
            // Select Image Types allowed
            'imageType' => 'jpg,jpeg,gif,png',
            // Thumbnails Options
            'thumbOptions' => [
                'small' => ['quality' => 100, 'width' => 150, 'height' => 100],
                'medium' => ['quality' => 100, 'width' => 200, 'height' => 150],
                'large' => ['quality' => 100, 'width' => 300, 'height' => 250],
                'extra' => ['quality' => 100, 'width' => 400, 'height' => 350],
            ],
            // Select Path To Upload Category Image
            'categoryImagePath' => '@backend/web/img/articles/categories/',
            // Select URL To Upload Category Image
            'categoryImageURL' => '/img/articles/categories/',
            // Select Path To Upload Category Thumb
            'categoryThumbPath' => '@backend/web/img/articles/categories/thumb/',
            // Select URL To Upload Category Image
            'categoryThumbURL' => '/img/articles/categories/thumb/',
            // Select Path To Upload Item Image
            'itemImagePath' => '@backend/web/img/articles/items/',
            // Select URL To Upload Item Image
            'itemImageURL' => '/img/articles/items/',
            // Select Path To Upload Item Thumb
            'itemThumbPath' => '@backend/web/img/articles/items/thumb/',
            // Select URL To Upload Item Thumb
            'itemThumbURL' => '/img/articles/items/thumb/',
        ],
        'filemanager' => [
            'class' => 'pendalf89\filemanager\Module',
            // Upload routes
            'routes' => [
                // Base absolute path to web directory
                'baseUrl' => '',
                // Base web directory url
                'basePath' => '@frontend/web',
                // Path for uploaded files in web directory
                'uploadPath' => 'uploads',
            ],
            // Thumbnails info
            'thumbs' => [
                'small' => [
                    'name' => 'small',
                    'size' => [100, 100],
                ],
                'medium' => [
                    'name' => 'medium',
                    'size' => [300, 200],
                ],
                'large' => [
                    'name' => 'large',
                    'size' => [500, 400],
                ],
            ],
        ],
        // Module Kartik-v Grid
        'gridview' => [
            'class' => '\kartik\grid\Module',
        ],
        // Module Kartik-v Markdown Editor
        'markdown' => [
            'class' => 'kartik\markdown\Module',
        ],
        'gii' => [
            'class' => 'yii\gii\Module',
        ],
    ]
];
