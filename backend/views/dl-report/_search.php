<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\DlReportSearch */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="dl-report-search">

    <?php $form = ActiveForm::begin([
        'action' => ['index'],
        'method' => 'get',
    ]); ?>

    <?= $form->field($model, 'id') ?>

    <?= $form->field($model, 'request_id') ?>

    <?= $form->field($model, 'master_id') ?>

    <?= $form->field($model, 'agent_id') ?>

    <?= $form->field($model, 'transaction_id') ?>

    <?php // echo $form->field($model, 'timestamp') ?>

    <?php // echo $form->field($model, 'action') ?>

    <?php // echo $form->field($model, 'orginal_price') ?>

    <?php // echo $form->field($model, 'price') ?>

    <?php // echo $form->field($model, 'promotion') ?>

    <?php // echo $form->field($model, 'charge_count') ?>

    <?php // echo $form->field($model, 'resultcode') ?>

    <?php // echo $form->field($model, 'msisdn') ?>

    <?php // echo $form->field($model, 'product_code') ?>

    <?php // echo $form->field($model, 'channel') ?>

    <?php // echo $form->field($model, 'mo') ?>

    <?php // echo $form->field($model, 'created_at') ?>

    <?php // echo $form->field($model, 'updated_at') ?>

    <div class="form-group">
        <?= Html::submitButton(Yii::t('backend', 'Search'), ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton(Yii::t('backend', 'Reset'), ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
