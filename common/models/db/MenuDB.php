<?php

namespace common\models\db;

use Yii;

/**
 * This is the model class for table "menu".
 *
 * @property integer $id
 * @property string $name
 * @property integer $parent
 * @property string $route
 * @property integer $order
 * @property string $data
 * @property string $icon
 * @property integer $is_active
 *
 * @property MenuDB[] $menuDBs
 */
class MenuDB extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'menu';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['parent', 'order', 'is_active'], 'integer'],
            [['data', 'icon'], 'string'],
            [['name'], 'string', 'max' => 128],
            [['route'], 'string', 'max' => 256]
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
            'parent' => Yii::t('backend', 'Parent'),
            'route' => Yii::t('backend', 'Route'),
            'order' => Yii::t('backend', 'Order'),
            'data' => Yii::t('backend', 'Data'),
            'icon' => Yii::t('backend', 'Icon'),
            'is_active' => Yii::t('backend', 'Is Active'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMenuDBs()
    {
        return $this->hasMany(MenuDB::className(), ['parent' => 'id']);
    }
}
