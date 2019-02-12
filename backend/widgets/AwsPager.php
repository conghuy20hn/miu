<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace backend\widgets;

use Yii;
use yii\base\InvalidConfigException;
use yii\helpers\Html;
use yii\base\Widget;
use yii\data\Pagination;

/**
 * AwsPager displays a list of hyperlinks that lead to different pages of target.
 *
 * LinkPager works with a [[Pagination]] object which specifies the totally number
 * of pages and the current page number.
 *
 * Note that LinkPager only generates the necessary HTML markups. In order for it
 * to look like a real pager, you should provide some CSS styles for it.
 * With the default configuration, LinkPager should look good using Twitter Bootstrap CSS framework.
 *
 * <div class="pagination-panel">
 * Page
 * <a title="Prev" class="btn btn-sm default prev disabled" href="#">
 * <i class="fa fa-angle-left"></i>
 * </a>
 * <input type="text" style="text-align:center; margin: 0 5px;" maxlenght="5"
 * class="pagination-panel-input form-control input-mini input-inline input-sm"
 * sourceindex="14">
 * <a title="Next" class="btn btn-sm default next" href="#">
 * <i class="fa fa-angle-right"></i>
 * </a>
 * of
 * <span class="pagination-panel-total">243</span>
 * </div>
 *
 * @author HoangL <hoangl@viettel.com.vn>
 * @since 2.0
 */
class AwsPager extends Widget
{
    /**
     * @var Pagination the pagination object that this pager is associated with.
     * You must set this property in order to make LinkPager work.
     */
    public $pagination;
    /**
     * @var array HTML attributes for the pager container tag.
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $options = ['class' => 'pagination-panel'];
    /**
     * @var array HTML attributes for the link in a pager container tag.
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $linkOptions = ['class' => 'btn btn-sm default'];
    /**
     * @var array HTML attributes for the input in a pager container tag.
     */
    public $inputOptions = [
        'class' => 'pagination-panel-input form-control input-mini input-inline input-sm aws-pager',
        'type' => 'text',
        'style' => 'text-align:center; margin: 0 5px;',
        'maxlenght' => '5',
        'name' => 'page'
    ];
    /**
     * @var string the CSS class for the "previous" page button.
     */
    public $prevPageCssClass = 'prev';
    /**
     * @var string the CSS class for the "next" page button.
     */
    public $nextPageCssClass = 'next';
    /**
     * @var string the CSS class for the active (currently selected) page button.
     */
    public $activePageCssClass = 'active';
    /**
     * @var string the CSS class for the disabled page buttons.
     */
    public $disabledPageCssClass = 'disabled';
    /**
     * @var string|boolean the label for the "next" page button. Note that this will NOT be HTML-encoded.
     * If this property is false, the "next" page button will not be displayed.
     */
    public $nextPageLabel = '<i class="fa fa-angle-right"></i>';
    /**
     * @var string|boolean the text label for the previous page button. Note that this will NOT be HTML-encoded.
     * If this property is false, the "previous" page button will not be displayed.
     */
    public $prevPageLabel = '<i class="fa fa-angle-left"></i>';
    /**
     * @var boolean whether to register link tags in the HTML header for prev, next, first and last page.
     * Defaults to `false` to avoid conflicts when multiple pagers are used on one page.
     * @see http://www.w3.org/TR/html401/struct/links.html#h-12.1.2
     * @see registerLinkTags()
     */
    public $registerLinkTags = false;

    /**
     * @var string Template. (Defined on init() function)
     */
    public $template;
    /**
     * @var boolean Hide widget when only one page exist.
     */
    public $hideOnSinglePage = true;


    /**
     * Initializes the pager.
     */
    public function init()
    {
        $this->template = Yii::t('backend', 'Page {pager} / {total}');
        if ($this->pagination === null) {
            throw new InvalidConfigException('The "pagination" property must be set.');
        }
    }

    /**
     * Executes the widget.
     * This overrides the parent implementation by displaying the generated page buttons.
     */
    public function run()
    {
        if ($this->registerLinkTags) {
            $this->registerLinkTags();
        }
        $content = preg_replace_callback("/{\\w+}/", function ($matches) {
            $content = $this->renderSection($matches[0]);

            return $content === false ? $matches[0] : $content;
        }, $this->template);
        echo Html::tag('div', $content, $this->options);
    }

    public function renderSection($name)
    {
        switch ($name) {
            case '{pager}':
                return $this->renderPageButtons();
                break;
            case '{total}':
                return Html::tag('span', $this->pagination->getPageCount(), ['class' => 'pagination-panel-total']);
                break;
        }
    }

    /**
     * Registers relational link tags in the html header for prev, next, first and last page.
     * These links are generated using [[\yii\data\Pagination::getLinks()]].
     * @see http://www.w3.org/TR/html401/struct/links.html#h-12.1.2
     */
    protected function registerLinkTags()
    {
        $view = $this->getView();
        foreach ($this->pagination->getLinks() as $rel => $href) {
            $view->registerLinkTag(['rel' => $rel, 'href' => $href], $rel);
        }
    }

    /**
     * Renders the page buttons.
     * @return string the rendering result
     */
    protected function renderPageButtons()
    {
        $pageCount = $this->pagination->getPageCount();
        if ($pageCount < 2 && $this->hideOnSinglePage) {
            return '';
        }

        $buttons = [];
        $currentPage = $this->pagination->getPage();

        // prev page
        if ($this->prevPageLabel !== false) {
            if (($page = $currentPage - 1) < 0) {
                $page = 0;
            }
            $buttons[] = $this->renderPageButton($this->prevPageLabel, $page, $this->prevPageCssClass, $currentPage <= 0, false);
        }

        // internal pages
        $buttons[] = Html::tag('input', '', array_merge($this->inputOptions, ['value' => $currentPage + 1]));
        //$this->renderPageButton($i + 1, $i, null, false, $i == $currentPage);


        // next page
        if ($this->nextPageLabel !== false) {
            if (($page = $currentPage + 1) >= $pageCount - 1) {
                $page = $pageCount - 1;
            }
            $buttons[] = $this->renderPageButton($this->nextPageLabel, $page, $this->nextPageCssClass, $currentPage >= $pageCount - 1, false);
        }

        return implode("\n", $buttons);
    }

    /**
     * Renders a page button.
     * You may override this method to customize the generation of page buttons.
     * @param string $label the text label for the button
     * @param integer $page the page number
     * @param string $class the CSS class for the page button.
     * @param boolean $disabled whether this page button is disabled
     * @param boolean $active whether this page button is active
     * @return string the rendering result
     */
    protected function renderPageButton($label, $page, $class, $disabled, $active)
    {
        //$options = ['class' => $class === '' ? null : $class];
        $linkOptions = $this->linkOptions;
        Html::addCssClass($linkOptions, $class);
        if ($active) {
            Html::addCssClass($linkOptions, $this->activePageCssClass);
        }
        if ($disabled) {
            Html::addCssClass($linkOptions, $this->disabledPageCssClass);
        }
        //$linkOptions['data-page'] = $page;

        return Html::a($label, $this->pagination->createUrl($page), $linkOptions);
    }

    /**
     * @return array the begin and end pages that need to be displayed.
     */
    protected function getPageRange()
    {
        $currentPage = $this->pagination->getPage();
        $pageCount = $this->pagination->getPageCount();

        $beginPage = max(0, $currentPage - (int)($this->maxButtonCount / 2));
        if (($endPage = $beginPage + $this->maxButtonCount - 1) >= $pageCount) {
            $endPage = $pageCount - 1;
            $beginPage = max(0, $endPage - $this->maxButtonCount + 1);
        }

        return [$beginPage, $endPage];
    }
}
