<?php

namespace common\models\db;

use Yii;

/**
 * This is the model class for table "dl_report".
 *
 * @property string $id
 * @property string $request_id
 * @property string $master_id
 * @property string $agent_id
 * @property string $transaction_id
 * @property string $timestamp
 * @property string $action
 * @property string $orginal_price
 * @property string $price
 * @property string $promotion
 * @property string $charge_count
 * @property string $resultcode
 * @property string $msisdn
 * @property string $product_code
 * @property string $channel
 * @property string $mo
 * @property string $created_at
 * @property string $updated_at
 */
class DlReportDB extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dl_report';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['request_id', 'master_id', 'agent_id', 'transaction_id', 'timestamp', 'action', 'orginal_price', 'price', 'promotion', 'charge_count', 'resultcode', 'msisdn', 'product_code', 'channel', 'mo', 'created_at', 'updated_at'], 'required'],
            [['request_id', 'master_id', 'transaction_id', 'orginal_price', 'price', 'promotion', 'charge_count', 'resultcode'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['agent_id', 'action', 'product_code', 'channel', 'mo'], 'string', 'max' => 255],
            [['timestamp', 'msisdn'], 'string', 'max' => 25]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('backend', 'ID'),
            'request_id' => Yii::t('backend', 'Request ID'),
            'master_id' => Yii::t('backend', 'Master ID'),
            'agent_id' => Yii::t('backend', 'Agent ID'),
            'transaction_id' => Yii::t('backend', 'Transaction ID'),
            'timestamp' => Yii::t('backend', 'Timestamp'),
            'action' => Yii::t('backend', 'Action'),
            'orginal_price' => Yii::t('backend', 'Orginal Price'),
            'price' => Yii::t('backend', 'Price'),
            'promotion' => Yii::t('backend', 'Promotion'),
            'charge_count' => Yii::t('backend', 'Charge Count'),
            'resultcode' => Yii::t('backend', 'Resultcode'),
            'msisdn' => Yii::t('backend', 'Msisdn'),
            'product_code' => Yii::t('backend', 'Product Code'),
            'channel' => Yii::t('backend', 'Channel'),
            'mo' => Yii::t('backend', 'Mo'),
            'created_at' => Yii::t('backend', 'Created At'),
            'updated_at' => Yii::t('backend', 'Updated At'),
        ];
    }
}
