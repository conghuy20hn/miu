<?php

use yii\helpers\Html;
//use yii\widgets\ActiveForm;

use kartik\widgets\Select2;
use kartik\widgets\DateTimePicker;
use dosamigos\ckeditor\CKEditor;
use yii\web\JsExpression;
use xj\uploadify\Uploadify;
use yii\helpers\Url;
use kartik\widgets\ActiveForm;
use kartik\builder\Form;
use zxbodya\yii2\galleryManager\GalleryManager;
use kartik\file\FileInput;

/* @var $this yii\web\View */
/* @var $model backend\models\DlSpamSms */
/* @var $form yii\widgets\ActiveForm */

$listProduct = [];
$listDealer = [];
?>

<div class="dl-spam-sms-form">

    <?php $form = ActiveForm::begin(); ?>

        <?= $form->field($model, 'name')->textInput(['maxlength' => 255])->label('Tên chương trình') ?>

    <?= //$form->field($model, 'product_code')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'product_id')->textInput(['maxlength' => 20])->label('Chọn gói cước') ?>

    <?= $form->field($model, 'dealer_id')->textInput(['maxlength' => 255])->label('Chọn Dealer') ?>

    <?= //$form->field($model, 'dealer_name')->textInput(['maxlength' => 255]) ?>

    <?= $form->field($model, 'start_time')->textInput(['maxlength' => 20])->label('Thời gian bắt đầu') ?>

    <?= $form->field($model, 'end_time')->textInput(['maxlength' => 20])->label('Thời gian kết thúc') ?>

    <?= $form->field($model, 'time_wait')->textInput(['maxlength' => 20])->label('Thời gian chờ') ?>

    <?= $form->field($model, 'file_path')->textInput(['maxlength' => 255])->label('File import') ?>

    <?= $form->field($model, 'status')->textInput(['maxlength' => 20])->label('Trạng thái') ?>

    <?= $form->field($model, 'list_msisdn_test')->textInput(['maxlength' => 255])->label('Danh sách số test') ?>

    <?= //$form->field($model, 'created_at')->textInput() ?>

    <?= //$form->field($model, 'updated_at')->textInput() ?>

    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? Yii::t('backend', 'Create') : Yii::t('backend', 'Update'), ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
