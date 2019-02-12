<?php

namespace common\models\db;

use Yii;

/**
 * This is the model class for table "dl_dealer".
 *
 * @property string $id
 * @property string $name
 * @property string $code
 * @property string $msisdn
 * @property string $email
 * @property string $dealer_id
 * @property string $master_id
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 */
class DlDealerDB extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dl_dealer';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'code', 'msisdn', 'email', 'dealer_id', 'master_id', 'status', 'created_at', 'updated_at'], 'required'],
            [['dealer_id', 'master_id', 'status'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['name', 'code', 'email'], 'string', 'max' => 255],
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
            'name' => Yii::t('backend', 'Name'),
            'code' => Yii::t('backend', 'Code'),
            'msisdn' => Yii::t('backend', 'Msisdn'),
            'email' => Yii::t('backend', 'Email'),
            'dealer_id' => Yii::t('backend', 'Dealer ID'),
            'master_id' => Yii::t('backend', 'Master ID'),
            'status' => Yii::t('backend', 'Status'),
            'created_at' => Yii::t('backend', 'Created At'),
            'updated_at' => Yii::t('backend', 'Updated At'),
        ];
    }
}
