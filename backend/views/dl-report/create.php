<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\DlReport */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Dl Report',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Dl Reports'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="dl-report-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
