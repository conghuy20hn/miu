<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\DlService */

$this->title = Yii::t('backend', 'Update {modelClass}: ', [
    'modelClass' => 'Dl Service',
]) . ' ' . $model->id;
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Dl Services'), 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->id, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = Yii::t('backend', 'Update');
?>
<div class="dl-service-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
