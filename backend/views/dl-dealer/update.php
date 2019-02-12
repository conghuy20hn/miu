<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\DlDealer */

$this->title = Yii::t('backend', 'Update {modelClass}: ', [
    'modelClass' => 'Dl Dealer',
]) . ' ' . $model->name;
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Dl Dealers'), 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->name, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = Yii::t('backend', 'Update');
?>
<div class="dl-dealer-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
