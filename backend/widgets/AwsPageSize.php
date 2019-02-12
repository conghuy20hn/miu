<?php

/**
 * @copyright Copyright &copy; Saranga Abeykoon, nterms.com, 2014
 * @package yii2-pagesize-widget
 * @version 1.0.0
 */

namespace backend\widgets;

use Yii;
use yii\helpers\Html;
use nterms\pagesize\PageSize;

/**
 * PageSize widget is an addition to the \yii\grid\GridView that enables
 * changing the size of a page on GridView.
 *
 * To use this widget with a GridView, add this widget to the page:
 *
 * ~~~
 * <?php echo \backend\widgets\PageSize::widget(); ?>
 * ~~~
 *
 * and set the `filterSelector` property of GridView as shown in
 * following example.
 *
 * ~~~
 * <?= GridView::widget([
 *      'dataProvider' => $dataProvider,
 *      'filterModel' => $searchModel,
 * 		'filterSelector' => 'select[name="per-page"]',
 *      'columns' => [
 *          ...
 *      ],
 *  ]); ?>
 * ~~~
 *
 * Please note that `per-page` here is the string you use for `pageSizeParam` setting of the PageSize widget.
 *
 * @author Saranga Abeykoon <amisaranga@gmail.com>
 * @since 1.0
 */
class AwsPageSize extends PageSize {

    /**
     * @var string the label1 text. (defined in run function)
     */
    public $label1;

    /**
     * @var string the label2 text. (defined in run function)
     */
    public $label2;

    /**
     * @var string the template to be used for rendering the output.
     */
    public $template = '{label1} {list} {label2}';

    /**
     * @var array the list of options for the drop down list.
     */
    public $options = [
        'class' => 'form-control input-xsmall input-sm input-inline'
    ];

    /**
     * @var array the list of options for the label
     */
    public $label1Options;

    /**
     * @var array the list of options for the label
     */
    public $label2Options;

    /**
     * Runs the widget and render the output
     */
    public function run() {
        if (empty($this->options['id'])) {
            $this->options['id'] = $this->id;
        }

        $this->label1 = Yii::t('backend', 'View');
        $this->label2 = Yii::t('backend', 'records');
        if ($this->encodeLabel) {
            $this->label1 = Html::encode($this->label1);
            $this->label2 = Html::encode($this->label2);
        }

        $perPage = !empty($_GET[$this->pageSizeParam]) ? $_GET[$this->pageSizeParam] : $this->defaultPageSize;

//        $listHtml = Html::dropDownList('per-page', $perPage, $this->sizes, $this->options);
        $pageSize = (Yii::$app->params['page_sizes']) ? Yii::$app->params['page_sizes'] : $this->sizes;
        $listHtml = Html::dropDownList('per-page', $perPage, $pageSize, $this->options);
        $label1Html = Html::label($this->label1, $this->options['id'], $this->label1Options);
        $label2Html = Html::label($this->label2, $this->options['id'], $this->label2Options);

        $output = str_replace(['{list}', '{label1}', '{label2}'], [$listHtml, $label1Html, $label2Html], $this->template);

        return $output;
    }

}
