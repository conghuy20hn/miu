<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\DlServiceSearch */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="dl-service-search">

    <?php $form = ActiveForm::begin([
        'action' => ['index'],
        'method' => 'get',
    ]); ?>

    <?= $form->field($model, 'id') ?>

    <?= $form->field($model, 'sys_id') ?>

    <?= $form->field($model, 'master_id') ?>

    <?= $form->field($model, 'service_code') ?>

    <?= $form->field($model, 'product_code') ?>

    <?php // echo $form->field($model, 'price') ?>

    <?php // echo $form->field($model, 'cycles') ?>

    <?php // echo $form->field($model, 'type') ?>

    <?php // echo $form->field($model, 'commission_type') ?>

    <?php // echo $form->field($model, 'description') ?>

    <?php // echo $form->field($model, 'created_at') ?>

    <?php // echo $form->field($model, 'updated_at') ?>

    <div class="form-group">
        <?= Html::submitButton(Yii::t('backend', 'Search'), ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton(Yii::t('backend', 'Reset'), ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
