<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 11/26/2015
 * Time: 4:41 PM
 */

namespace api\models\auth;

use Yii;
use yii\redis\ActiveRecord;

/**
 * This is the model class for table "Client" in redis.
 *
 * @property string $id
 * @property string $client_id
 * @property string $authorization_code
 * @property integer $permission
 */
class Client extends ActiveRecord
{
    public function attributes()
    {
        return ['id', 'client_id', 'authorization_code', 'permission'];
    }

    public static function primaryKey() {
        return ['id'];
    }

    /**
     * @param $authorization_code
     * @return array|null|ActiveRecord
     */
    public static function checkAuthorizationCode($authorization_code) {
        return Client::find()->where(['authorization_code' => $authorization_code])->one();
    }

    public static function getAuthorizationCode($client_id, $permission) {
        $item = Client::find()->where(['client_id' => $client_id])->one();
        /* @var Client $item */
        if ($item) {
            $item->permission = $permission;
            $item->save();
            return $item->authorization_code;
        } else {
            $authorization_code = Yii::$app->security->generateRandomString();
            $item = new Client;
            $item->client_id = $client_id;
            $item->permission = $permission;
            $item->authorization_code = $authorization_code;
            $item->insert();
            return $authorization_code;
        }
    }
}