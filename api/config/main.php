<?php

$params = array_merge(
        require(__DIR__ . '/../../common/config/params.php'), require(__DIR__ . '/../../common/config/params-local.php'), require(__DIR__ . '/params.php')
);
$routing = array_merge(require(__DIR__ . '/routing_v1.php'), require(__DIR__ . '/routing_v2.php'), require(__DIR__ . '/../../wap/config/routing.php'));

return [
    'id' => 'app-api',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'modules' => [
        'v1' => [
            'class' => 'api\modules\v1\Module',
        ],
        'v2' => [
            'class' => 'api\modules\v2\Module',
        ],
    ],
    'controllerNamespace' => 'api\controllers',
    'defaultRoute' => 'site/index',
    'components' => [
        'user' => [
            'identityClass' => 'common\models\User',
        ],
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 9600,
            'database' => 2,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error'],
                    'logFile' => '@logs/api/error.log',
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['warning'],
                    'logFile' => '@logs/api/warning.log',
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['info'],
                    'logFile' => '@logs/api/info.log',
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'categories' => ['yii\db\Command*'],
                    'logVars' => [],
                    'logFile' => '@logs/api/queries.log',
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'api/error',
        ],
        'urlManager' => [
            'class' => 'yii\web\UrlManager',
            // Disable index.php
            'showScriptName' => false,
            // Disable r= routes
            'enablePrettyUrl' => true,
            //chi cho phep chay cac pretty url
            //'enableStrictParsing' => true,
            //'suffix' => '.html',
            'rules' => $routing,
        ]
    ],
    'params' => $params,
];
