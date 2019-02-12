<?php

namespace common\models\db;

use Yii;

/**
 * This is the model class for table "dl_spam_sms_msisdn".
 *
 * @property string $id
 * @property string $msisdn
 * @property string $spam_sms_id
 * @property string $transaction_id
 * @property string $have_commission
 * @property string $status
 * @property string $result
 * @property string $created_at
 * @property string $updated_at
 */
class DlSpamSmsMsisdnDB extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dl_spam_sms_msisdn';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['msisdn', 'spam_sms_id', 'transaction_id', 'have_commission', 'status', 'result', 'created_at', 'updated_at'], 'required'],
            [['spam_sms_id', 'transaction_id', 'have_commission', 'status'], 'integer'],
            [['result'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['msisdn'], 'string', 'max' => 25]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('backend', 'ID'),
            'msisdn' => Yii::t('backend', 'Msisdn'),
            'spam_sms_id' => Yii::t('backend', 'Spam Sms ID'),
            'transaction_id' => Yii::t('backend', 'Transaction ID'),
            'have_commission' => Yii::t('backend', 'Have Commission'),
            'status' => Yii::t('backend', 'Status'),
            'result' => Yii::t('backend', 'Result'),
            'created_at' => Yii::t('backend', 'Created At'),
            'updated_at' => Yii::t('backend', 'Updated At'),
        ];
    }
}
