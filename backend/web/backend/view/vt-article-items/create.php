<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\VtArticleItems */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Vt Article Items',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Vt Article Items'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-article-items-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
