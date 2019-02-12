<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\DlReport */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="dl-report-form">

    <?php $form = ActiveForm::begin(); ?>

        <?= $form->field($model, 'request_id')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'master_id')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'agent_id')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'transaction_id')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'timestamp')->textInput(['maxlength' => 25]) ?>

    <?= $form->field($model, 'action')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'orginal_price')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'price')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'promotion')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'charge_count')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'resultcode')->textInput(['maxlength' => 20]) ?>

    <?= $form->field($model, 'msisdn')->textInput(['maxlength' => 25]) ?>

    <?= $form->field($model, 'product_code')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'channel')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'mo')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'created_at')->textInput() ?>

    <?= $form->field($model, 'updated_at')->textInput() ?>

    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? Yii::t('backend', 'Create') : Yii::t('backend', 'Update'), ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
