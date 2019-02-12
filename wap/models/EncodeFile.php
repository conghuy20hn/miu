<?php

namespace wap\models;

use Yii;
use yii\behaviors\TimestampBehavior;

class EncodeFile extends \common\models\EncodeFileBase {
    public function behaviors() {
        return [
            TimestampBehavior::className(),
        ];
    }
}