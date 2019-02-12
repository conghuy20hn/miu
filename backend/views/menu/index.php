<?php

use backend\widgets\AwsGridView;
use mdm\admin\models\searchs\Menu;
use yii\data\ActiveDataProvider;
use yii\helpers\Html;
use yii\web\View;
use yii\widgets\Pjax;

/* @var $this View */
/* @var $dataProvider ActiveDataProvider */
/* @var $searchModel Menu */

$this->title = Yii::t('backend', 'Menus');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="menu-index">

    <h1><?= Html::encode($this->title) ?></h1>
    <?php // echo $this->render('_search', ['model' => $searchModel]);  ?>

    <p>
        <?= Html::a(Yii::t('backend', 'Create Menu'), ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php
    Pjax::begin(['formSelector' => 'form', 'enablePushState' => false]);
    echo AwsGridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],
            'name',
            [
                'attribute' => 'menuParent.name',
                'filter' => Html::activeTextInput($searchModel, 'parent_name', [
                    'class' => 'form-control', 'id' => null
                ]),
                'label' => Yii::t('backend', 'Parent'),
            ],
            'route',
            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]);
    Pjax::end();
    ?>

</div>
