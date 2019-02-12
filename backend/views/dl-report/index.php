<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
use backend\widgets\AwsGridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\DlReportSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('backend', 'Dl Reports');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="dl-report-index">
                <?php // echo $this->render('_search', ['model' => $searchModel]); ?>
    
    <p>
        <?= Html::a(Yii::t('backend', 'Create {modelClass}', [
    'modelClass' => 'Dl Report',
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
            'request_id',
            'master_id',
            'agent_id',
            'transaction_id',
            // 'timestamp',
            // 'action',
            // 'orginal_price',
            // 'price',
            // 'promotion',
            // 'charge_count',
            // 'resultcode',
            // 'msisdn',
            // 'product_code',
            // 'channel',
            // 'mo',
            // 'created_at',
            // 'updated_at',

        ['class' => 'yii\grid\ActionColumn'],
        ],
        ]); ?>
        <?php 
    Pjax::end();
    ?>
</div>
