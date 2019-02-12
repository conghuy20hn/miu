<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\VtUser */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => Yii::t('backend', 'Vt Users'),
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Vt Users'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-user-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
