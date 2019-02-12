<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\DlSpamSms */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Dl Spam Sms',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Dl Spam Sms'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="dl-spam-sms-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
