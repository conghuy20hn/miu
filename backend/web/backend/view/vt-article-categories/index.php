<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
use backend\widgets\AwsGridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\VtArticleCategoriesSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('backend', 'Vt Article Categories');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-article-categories-index">
                <?php // echo $this->render('_search', ['model' => $searchModel]); ?>
    
    <p>
        <?= Html::a(Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Vt Article Categories',
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
            'name',
            'slug',
            'description:ntext',
            'parent_id',
            // 'is_active',
            // 'priority',
            // 'author',
            // 'attr',

        ['class' => 'yii\grid\ActionColumn'],
        ],
        ]); ?>
        <?php 
    Pjax::end();
    ?>
</div>
