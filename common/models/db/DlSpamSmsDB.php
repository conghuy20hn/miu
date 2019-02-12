<?php

namespace common\models\db;

use Yii;

/**
 * This is the model class for table "dl_spam_sms".
 *
 * @property string $id
 * @property string $name
 * @property string $product_code
 * @property string $product_id
 * @property string $dealer_id
 * @property string $dealer_name
 * @property string $start_time
 * @property string $end_time
 * @property string $time_wait
 * @property string $file_path
 * @property string $status
 * @property string $list_msisdn_test
 * @property string $created_at
 * @property string $updated_at
 */
class DlSpamSmsDB extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dl_spam_sms';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'product_code', 'product_id', 'dealer_id', 'dealer_name', 'start_time', 'end_time', 'time_wait', 'file_path', 'status', 'list_msisdn_test', 'created_at', 'updated_at'], 'required'],
            [['product_id', 'start_time', 'end_time', 'time_wait', 'status'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['name', 'product_code', 'dealer_id', 'dealer_name', 'file_path', 'list_msisdn_test'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('backend', 'ID'),
            'name' => Yii::t('backend', 'Name'),
            'product_code' => Yii::t('backend', 'Product Code'),
            'product_id' => Yii::t('backend', 'Product ID'),
            'dealer_id' => Yii::t('backend', 'Dealer ID'),
            'dealer_name' => Yii::t('backend', 'Dealer Name'),
            'start_time' => Yii::t('backend', 'Start Time'),
            'end_time' => Yii::t('backend', 'End Time'),
            'time_wait' => Yii::t('backend', 'Time Wait'),
            'file_path' => Yii::t('backend', 'File Path'),
            'status' => Yii::t('backend', 'Status'),
            'list_msisdn_test' => Yii::t('backend', 'List Msisdn Test'),
            'created_at' => Yii::t('backend', 'Created At'),
            'updated_at' => Yii::t('backend', 'Updated At'),
        ];
    }
}
