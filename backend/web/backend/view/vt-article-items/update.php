<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model backend\models\VtArticleItems */

$this->title = Yii::t('backend', 'Update {modelClass}: ', [
    'modelClass' => 'Vt Article Items',
]) . ' ' . $model->title;
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Vt Article Items'), 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->title, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = Yii::t('backend', 'Update');
?>
<div class="vt-article-items-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
