<?php

namespace common\models\db;

use Yii;

/**
 * This is the model class for table "dl_service".
 *
 * @property string $id
 * @property string $sys_id
 * @property string $master_id
 * @property string $service_code
 * @property string $product_code
 * @property string $price
 * @property string $cycles
 * @property string $type
 * @property string $commission_type
 * @property string $description
 * @property string $created_at
 * @property string $updated_at
 */
class DlServiceDB extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dl_service';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['sys_id', 'master_id', 'service_code', 'product_code', 'price', 'cycles', 'type', 'commission_type', 'description', 'created_at', 'updated_at'], 'required'],
            [['sys_id', 'master_id', 'price', 'cycles', 'type', 'commission_type'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['service_code', 'product_code', 'description'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('backend', 'ID'),
            'sys_id' => Yii::t('backend', 'Sys ID'),
            'master_id' => Yii::t('backend', 'Master ID'),
            'service_code' => Yii::t('backend', 'Service Code'),
            'product_code' => Yii::t('backend', 'Product Code'),
            'price' => Yii::t('backend', 'Price'),
            'cycles' => Yii::t('backend', 'Cycles'),
            'type' => Yii::t('backend', 'Type'),
            'commission_type' => Yii::t('backend', 'Commission Type'),
            'description' => Yii::t('backend', 'Description'),
            'created_at' => Yii::t('backend', 'Created At'),
            'updated_at' => Yii::t('backend', 'Updated At'),
        ];
    }
}
