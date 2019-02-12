<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace backend\widgets;

use Yii;
use yii\base\InvalidConfigException;
use yii\base\Widget;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\widgets\LinkSorter;

/**
 * BaseListView is a base class for widgets displaying data from data provider
 * such as ListView and GridView.
 *
 * It provides features like sorting, paging and also filtering the data.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
abstract class AwsBaseListView extends Widget
{
    /**
     * @var array the HTML attributes for the container tag of the list view.
     * The "tag" element specifies the tag name of the container element and defaults to "div".
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $options = [];
    /**
     * @var \yii\data\DataProviderInterface the data provider for the view. This property is required.
     */
    public $dataProvider;
    /**
     * @var array the configuration for the pager widget. By default, [[LinkPager]] will be
     * used to render the pager. You can use a different widget class by configuring the "class" element.
     * Note that the widget must support the `pagination` property which will be populated with the
     * [[\yii\data\BaseDataProvider::pagination|pagination]] value of the [[dataProvider]].
     */
    public $pager = [];
    /**
     * @var array the configuration for the sorter widget. By default, [[LinkSorter]] will be
     * used to render the sorter. You can use a different widget class by configuring the "class" element.
     * Note that the widget must support the `sort` property which will be populated with the
     * [[\yii\data\BaseDataProvider::sort|sort]] value of the [[dataProvider]].
     */
    public $sorter = [];
    /**
     * @var string the HTML content to be displayed as the summary of the list view.
     * If you do not want to show the summary, you may set it with an empty string.
     *
     * The following tokens will be replaced with the corresponding values:
     *
     * - `{begin}`: the starting row number (1-based) currently being displayed
     * - `{end}`: the ending row number (1-based) currently being displayed
     * - `{count}`: the number of rows currently being displayed
     * - `{totalCount}`: the total number of rows available
     * - `{page}`: the page number (1-based) current being displayed
     * - `{pageCount}`: the number of pages available
     */
    public $summary;
    /**
     * @var array the HTML attributes for the summary of the list view.
     * The "tag" element specifies the tag name of the summary element and defaults to "div".
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $summaryOptions = ['class' => 'dataTables_info'];
    /**
     * @var boolean whether to show the list view if [[dataProvider]] returns no data.
     */
    public $showOnEmpty = false;
    /**
     * @var string the HTML content to be displayed when [[dataProvider]] does not have any data.
     */
    public $emptyText;
    /**
     * @var array the HTML attributes for the emptyText of the list view.
     * The "tag" element specifies the tag name of the emptyText element and defaults to "div".
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $emptyTextOptions = ['class' => 'empty'];
    /**
     * @var string the layout that determines how different sections of the list view should be organized.
     * The following tokens will be replaced with the corresponding section contents:
     *
     * - `{summary}`: the summary section. See [[renderSummary()]].
     * - `{items}`: the list items. See [[renderItems()]].
     * - `{sorter}`: the sorter. See [[renderSorter()]].
     * - `{pager}`: the pager. See [[renderPager()]].
     * - `{pageSize}`: the pager. See [[renderPageSize()]].
     */
    public $layout = <<< EOT
        <div class='row'>
            <div class="col-md-8 col-sm-12">
                {pager}{pageSize}{separator}{summary}
            </div>
            <div class="col-md-4 col-sm-12">
            </div>
        </div>
        {items}
        <div class='row'>
            <div class="col-md-8 col-sm-12">
                {pager}{pageSize}{separator}{summary}
            </div>
            <div class="col-md-4 col-sm-12">
            </div>
        </div>
EOT;

    public $pagerTemplate = <<< EOT
        <div class='dataTables_paginate paging_bootstrap_extended' id='datatable_products_paginate'>
            {pager}
        </div>
EOT;


    public $pageSizeTemplate = <<< EOT
        <div class='dataTables_length' id='datatable_products_length'>
            <label>
                {pageSize}
            </label>
        </div>
EOT;

    public $summaryTemplate = <<< EOT
        <div class='dataTables_info' id='datatable_products_info' role='status' aria-live='polite'>
            {summary}
        </div>
EOT;

    public $separatorTemplate = <<< EOT
        <span class='seperator'>|</span>
EOT;


    /**
     * Renders the data models.
     * @return string the rendering result.
     */
    abstract public function renderItems();

    /**
     * Initializes the view.
     */
    public function init()
    {
        if ($this->dataProvider === null) {
            throw new InvalidConfigException('The "dataProvider" property must be set.');
        }
        if ($this->emptyText === null) {
            $this->emptyText = Yii::t('yii', 'No results found.');
        }
        if (!isset($this->options['id'])) {
            $this->options['id'] = $this->getId();
        }
    }

    /**
     * Runs the widget.
     */
    public function run()
    {
        $count = $this->dataProvider->getCount();
        if ($this->showOnEmpty || $count > 0) {
            $content = preg_replace_callback("/{\\w+}/", function ($matches) {
                $content = $this->renderSection($matches[0]);

                return $content === false ? $matches[0] : $content;
            }, $this->layout);
        } else {
            $content = $this->renderEmpty();
        }

        $options = $this->options;
        $tag = ArrayHelper::remove($options, 'tag', 'div');
        echo Html::tag($tag, $content, $options);
    }

    /**
     * Renders a section of the specified name.
     * If the named section is not supported, false will be returned.
     * @param string $name the section name, e.g., `{summary}`, `{items}`.
     * @return string|boolean the rendering result of the section, or false if the named section is not supported.
     */
    public function renderSection($name)
    {
        switch ($name) {
            case '{summary}':
                return str_replace($name, $this->renderSummary(), $this->summaryTemplate);
            case '{items}':
                return $this->renderItems();
            case '{pager}':
                if (($pagination = $this->dataProvider->getPagination()) !== false && $pagination->getPageCount() > 1) {
                    return str_replace($name, $this->renderPager(), $this->pagerTemplate) . $this->separatorTemplate;
                }
                return '';
            case '{pageSize}':
                return str_replace($name, $this->renderPageSize(), $this->pageSizeTemplate);
            case '{sorter}':
                return $this->renderSorter();
            case '{separator}':
                return $this->separatorTemplate;
            default:
                return false;
        }
    }

    /**
     * Renders the HTML content indicating that the list view has no data.
     * @return string the rendering result
     * @see emptyText
     */
    public function renderEmpty()
    {
        $options = $this->emptyTextOptions;
        $tag = ArrayHelper::remove($options, 'tag', 'div');
        return Html::tag($tag, ($this->emptyText === null ? Yii::t('yii', 'No results found.') : $this->emptyText), $options);
    }

    /**
     * Renders the summary text.
     */
    public function renderSummary()
    {
        $count = $this->dataProvider->getCount();
        if ($count <= 0) {
            return '';
        }
        $totalCount = $this->dataProvider->getTotalCount();
        $summaryContent = Yii::t('backend', 'Found total {total} records');
        return str_replace('{total}', $totalCount, $summaryContent);
    }

    /**
     * Renders the pager.
     * @return string the rendering result
     */
    public function renderPager()
    {
        $pagination = $this->dataProvider->getPagination();
        if ($pagination === false || $this->dataProvider->getCount() <= 0) {
            return '';
        }
        /* @var $class AwsPager */
        $pager = $this->pager;
        $class = ArrayHelper::remove($pager, 'class', AwsPager::className());
        $pager['pagination'] = $pagination;
        $pager['view'] = $this->getView();

        return $class::widget($pager);
    }

    /**
     * Renders the page size.
     * @return string the rendering result
     */
    public function renderPageSize()
    {
        $pagination = $this->dataProvider->getPagination();
        if ($pagination === false || $this->dataProvider->getCount() <= 0) {
            return '';
        }
        $pageSize = $this->dataProvider->getPagination()->getPageSize();
        return AwsPageSize::widget([
            'defaultPageSize' => $pageSize
        ]);
    }

    /**
     * Renders the sorter.
     * @return string the rendering result
     */
    public function renderSorter()
    {
        $sort = $this->dataProvider->getSort();
        if ($sort === false || empty($sort->attributes) || $this->dataProvider->getCount() <= 0) {
            return '';
        }
        /* @var $class LinkSorter */
        $sorter = $this->sorter;
        $class = ArrayHelper::remove($sorter, 'class', LinkSorter::className());
        $sorter['sort'] = $sort;
        $sorter['view'] = $this->getView();

        return $class::widget($sorter);
    }
}