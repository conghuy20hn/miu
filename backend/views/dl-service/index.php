<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
use backend\widgets\AwsGridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\DlServiceSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('backend', 'Dl Services');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="dl-service-index">
                <?php // echo $this->render('_search', ['model' => $searchModel]); ?>
    
    <p>
        <?= Html::a(Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Dl Service',
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
            'sys_id',
            'master_id',
            'service_code',
            'product_code',
            // 'price',
            // 'cycles',
            // 'type',
            // 'commission_type',
            // 'description',
            // 'created_at',
            // 'updated_at',

        ['class' => 'yii\grid\ActionColumn'],
        ],
        ]); ?>
        <?php 
    Pjax::end();
    ?>
</div>
