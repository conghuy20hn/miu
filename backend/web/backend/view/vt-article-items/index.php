<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
use backend\widgets\AwsGridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\VtArticleItemsSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('backend', 'Vt Article Items');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-article-items-index">
                <?php // echo $this->render('_search', ['model' => $searchModel]); ?>
    
    <p>
        <?= Html::a(Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Vt Article Items',
]), ['create'], ['class' => 'btn btn-success']) ?>
    </p>
    <?php 
    Pjax::begin(['formSelector' => 'form', 'enablePushState' => false]);
    ?>
            <?= AwsGridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
        ['class' => 'yii\grid\SerialColumn'],

                    'id',
            'title',
            'slug',
            'category_id',
            'userid',
            // 'introtext:ntext',
            // 'fulltext:ntext',
            // 'is_active',
            // 'priority',
            // 'hits',
            // 'image:ntext',
            // 'image_caption',
            // 'created_at',
            // 'created_by',
            // 'updated_at',
            // 'updated_by',
            // 'metadesc:ntext',
            // 'metakey:ntext',
            // 'author',
            // 'published_time',
            // 'attr',

        ['class' => 'yii\grid\ActionColumn'],
        ],
        ]); ?>
        <?php 
    Pjax::end();
    ?>
</div>
