<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\DlDealer */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Dl Dealer',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Dl Dealers'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="dl-dealer-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
