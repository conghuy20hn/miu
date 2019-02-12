<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/27/2015
 * Time: 10:40 AM
 */

namespace api\modules\v1\models;


use api\models\ApiClient;
use Yii;

class ApiClientV1 extends ApiClient
{
    static function getClientBySecret($client_id, $client_secret)
    {
        $cache = Yii::$app->cache;
        $key = "ApiClient_getClientBySecret_" . $client_id . "_" . $client_secret;
        $data = $cache->get($key);
        if (!$data) {
            $data = ApiClientV1::find()
                ->where([
                    'client_id' => $client_id,
                    'client_secret' => $client_secret
                ])->one();
            if ($data) {
                $dependency = new \yii\caching\FileDependency(['fileName' => \Yii::$aliases['@common'] . '\cache\api_client.txt']);
                $cache->set($key, $data, CACHE_TIMEOUT, $dependency);
            }
        }
        return $data;
    }
}