<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model backend\models\VtArticleCategories */

$this->title = Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Vt Article Categories',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Vt Article Categories'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-article-categories-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
