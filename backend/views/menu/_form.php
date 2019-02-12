<?php

use kartik\widgets\Select2;
use mdm\admin\AutocompleteAsset;
use mdm\admin\models\Menu;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\JsExpression;
use yii\web\View;
use yii\widgets\ActiveForm;

/* @var $this View */
/* @var $model Menu */
/* @var $form ActiveForm */
?>

<?php
$menuIcons = Yii::$app->params['menu-icon'];
$dataIcon = [];
foreach ($menuIcons as $icon) {
    $dataIcon[$icon] = $icon;
}
?>

<div class="menu-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'name')->textInput(['maxlength' => 128]) ?>

    <?= $form->field($model, 'parent_name')->textInput(['id' => 'parent_name']) ?>

    <?= $form->field($model, 'route')->textInput(['id' => 'route']) ?>

    <?= $form->field($model, 'order')->input('number') ?>

    <div class="form-group">
        <?php
        $format = <<< SCRIPT
function format(state) {
    if (!state.id) return state.text; // optgroup
    return '<i class="' + state.id + '"></i> ' + state.text;
}
SCRIPT;
        $escape = new JsExpression("function(m) { return m; }");
        $this->registerJs($format, View::POS_HEAD);
        ?>
        <?=
        Select2::widget([
            'name' => 'Menu[icon]',
            'data' => $dataIcon,
            'options' => ['placeholder' => 'Chọn icon menu ...'],
            'pluginOptions' => [
                'templateResult' => new JsExpression('format'),
                'templateSelection' => new JsExpression('format'),
                'escapeMarkup' => $escape,
                'allowClear' => true
            ],
        ]);
        ?>
    </div>

    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? Yii::t('backend', 'Create') : Yii::t('backend', 'Update'), ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
<?php
AutocompleteAsset::register($this);

$options1 = Json::htmlEncode([
            'source' => Menu::find()->select(['name'])->column()
        ]);
$this->registerJs("$('#parent_name').autocomplete($options1);");

$options2 = Json::htmlEncode([
            'source' => Menu::getSavedRoutes()
        ]);
$this->registerJs("$('#route').autocomplete($options2);");
