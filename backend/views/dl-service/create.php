<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\DlService */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Dl Service',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Dl Services'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="dl-service-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
