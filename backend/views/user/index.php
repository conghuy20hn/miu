<?php

use backend\models\UserSearch;
use backend\widgets\AwsGridView;
use common\models\User;
use yii\data\ActiveDataProvider;
use yii\helpers\Html;
use yii\web\View;

/* @var $this View */
/* @var $searchModel UserSearch */
/* @var $dataProvider ActiveDataProvider */

$this->title = Yii::t('backend', 'Vt Users');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-user-index">

    <!--h1><?= Html::encode($this->title) ?></h1-->
    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <p>
        <?=
        Html::a(Yii::t('backend', 'Create {modelClass}', [
                    'modelClass' => $this->title,
                ]), ['create'], ['class' => 'btn btn-success'])
        ?>
    </p>

    <?=
    AwsGridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            //['class' => 'yii\grid\SerialColumn'],
            'id',
            'username',
            'email:email',
            [
                'attribute' => 'status',
                'format' => 'raw', //raw, html
                'content' => function($data) {
                    return ($data->status == User::STATUS_ACTIVE) ? Yii::t('backend', 'Actived') : Yii::t('backend', 'Inactive');
                }
            ],
            [
                'attribute' => 'created_at',
                'format' => 'raw', //raw, html
                'content' => function($data) {
                    return date('H:i:s d/m/Y', $data->created_at);
                }
            ],
            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]);
    ?>

</div>
