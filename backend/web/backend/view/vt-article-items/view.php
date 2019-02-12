<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model backend\models\VtArticleItems */

$this->title = $model->title;
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Vt Article Items'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-article-items-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a(Yii::t('backend', 'Update'), ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a(Yii::t('backend', 'Delete'), ['delete', 'id' => $model->id], [
        'class' => 'btn btn-danger',
        'data' => [
        'confirm' => Yii::t('backend', 'Are you sure you want to delete this item?'),
        'method' => 'post',
        ],
        ]) ?>
    </p>

    <?= DetailView::widget([
    'model' => $model,
    'attributes' => [
                'id',
            'title',
            'slug',
            'category_id',
            'userid',
            'introtext:ntext',
            'fulltext:ntext',
            'is_active',
            'priority',
            'hits',
            'image:ntext',
            'image_caption',
            'created_at',
            'created_by',
            'updated_at',
            'updated_by',
            'metadesc:ntext',
            'metakey:ntext',
            'author',
            'published_time',
            'attr',
    ],
    ]) ?>
    <p>
        <?= Html::a(Yii::t('backend', 'Update'), ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a(Yii::t('backend', 'Delete'), ['delete', 'id' => $model->id], [
        'class' => 'btn btn-danger',
        'data' => [
        'confirm' => Yii::t('backend', 'Are you sure you want to delete this item?'),
        'method' => 'post',
        ],
        ]) ?>
    </p>
</div>
