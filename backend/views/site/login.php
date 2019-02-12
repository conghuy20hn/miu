<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */

use yii\captcha\Captcha;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = Yii::t('backend', 'Login');
$this->params['breadcrumbs'][] = $this->title;
?>

<?php $form = ActiveForm::begin(['id' => 'login-form']); ?>
    <h3 class="form-title"><?= Html::encode($this->title) ?></h3>
    <!--    <div class="alert alert-danger display-hide">-->
    <!--        <button class="close" data-close="alert"></button>-->
    <!--			<span>-->
    <!--			Enter any username and password. </span>-->
    <!--    </div>-->
    <div class="form-group">
        <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
        <label class="control-label visible-ie8 visible-ie9"><?= Html::encode(Yii::t('backend', "Username")) ?></label>
        <?= $form->field($model, 'username')->textInput([
            "class" => "form-control form-control-solid placeholder-no-fix",
            "autocomplete" => "off",
            "placeholder" => Html::encode(Yii::t('backend', "Username"))
        ])->label(false) ?>
    </div>
    <div class="form-group">
        <label class="control-label visible-ie8 visible-ie9"><?= Html::encode(Yii::t('backend', "Password")) ?></label>
        <?= $form->field($model, 'password')->passwordInput([
            "class" => "form-control form-control-solid placeholder-no-fix",
            "autocomplete" => "off",
            "placeholder" => Html::encode(Yii::t('backend', "Password"))
        ])->label(false); ?>
    </div>
    <div class="form-group">
        <?= $form->field($model, 'captcha')->widget(Captcha::className(), [
            'template' => '{input} {image}',
            'options' => [
                "class" => 'form-control form-control-solid placeholder-no-fix',
                "autocomplete" => "off",
                "placeholder" => Html::encode(Yii::t('backend', "Captcha")),
                "style" => "float:left; width: 50%;"
            ],
        ])->label(false); ?>
    </div>
    <div class="form-actions">
        <?= Html::submitButton('Login', ['class' => 'btn btn-success uppercase', 'name' => 'login-button']) ?>
        <label class="rememberme check" style="margin-top: 0; float: right;">
            <?= $form->field($model, 'rememberMe')->checkbox() ?>
        </label>
    </div>
<?php ActiveForm::end(); ?>