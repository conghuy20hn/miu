<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model backend\models\VtUser */

$this->title = $model->id;
$this->params['breadcrumbs'][] = ['label' => Yii::t('backend', 'Vt Users'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="vt-user-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a(Yii::t('backend', 'Update'), ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?=
        Html::a(Yii::t('backend', 'Delete'), ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => Yii::t('backend', 'Are you sure you want to delete this item?'),
                'method' => 'post',
            ],
        ])
        ?>
    </p>

    <?=
    DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'username',
            'email:email',
            [
                'label' => 'status',
                'value' => ($model->status == \common\models\User::STATUS_ACTIVE) ? Yii::t('backend', 'Actived') : Yii::t('backend', 'Inactive'),
            ],
            [
                'label' => 'created_at',
                'value' => date('H:i:s d/m/Y', $model->created_at),
            ],
            [
                'label' => 'updated_at',
                'value' => date('H:i:s d/m/Y', $model->updated_at),
            ],
        ],
    ])
    ?>

</div>
