<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace backend\widgets;

use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\Menu;

/**
 * Menu displays a multi-level menu using nested HTML lists.
 *
 * The main property of Menu is [[items]], which specifies the possible items in the menu.
 * A menu item can contain sub-items which specify the sub-menu under that menu item.
 *
 * Menu checks the current route and request parameters to toggle certain menu items
 * with active state.
 *
 * Note that Menu only renders the HTML tags about the menu. It does do any styling.
 * You are responsible to provide CSS styles to make it look like a real menu.
 *
 * The following example shows how to use Menu:
 *
 * ~~~
 * echo Menu::widget([
 *     'items' => [
 *         // Important: you need to specify url as 'controller/action',
 *         // not just as 'controller' even if default action is used.
 *         ['label' => 'Home', 'url' => ['site/index']],
 *         // 'Products' menu item will be selected as long as the route is 'product/index'
 *         ['label' => 'Products', 'url' => ['product/index'], 'items' => [
 *             ['label' => 'New Arrivals', 'url' => ['product/index', 'tag' => 'new']],
 *             ['label' => 'Most Popular', 'url' => ['product/index', 'tag' => 'popular']],
 *         ]],
 *         ['label' => 'Login', 'url' => ['site/login'], 'visible' => Yii::$app->user->isGuest],
 *     ],
 * ]);
 * ~~~
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class LayoutMenu extends Menu
{
    /**
     * @var array list of menu items. Each menu item should be an array of the following structure:
     *
     * - label: string, optional, specifies the menu item label. When [[encodeLabels]] is true, the label
     *   will be HTML-encoded. If the label is not specified, an empty string will be used.
     * - encode: boolean, optional, whether this item`s label should be HTML-encoded. This param will override
     *   global [[encodeLabels]] param.
     * - url: string or array, optional, specifies the URL of the menu item. It will be processed by [[Url::to]].
     *   When this is set, the actual menu item content will be generated using [[linkTemplate]];
     *   otherwise, [[labelTemplate]] will be used.
     * - visible: boolean, optional, whether this menu item is visible. Defaults to true.
     * - items: array, optional, specifies the sub-menu items. Its format is the same as the parent items.
     * - active: boolean, optional, whether this menu item is in active state (currently selected).
     *   If a menu item is active, its CSS class will be appended with [[activeCssClass]].
     *   If this option is not set, the menu item will be set active automatically when the current request
     *   is triggered by `url`. For more details, please refer to [[isItemActive()]].
     * - template: string, optional, the template used to render the content of this menu item.
     *   The token `{url}` will be replaced by the URL associated with this menu item,
     *   and the token `{label}` will be replaced by the label of the menu item.
     *   If this option is not set, [[linkTemplate]] or [[labelTemplate]] will be used instead.
     * - submenuTemplate: string, optional, the template used to render the list of sub-menus.
     *   The token `{items}` will be replaced with the rendered sub-menu items.
     *   If this option is not set, [[submenuTemplate]] will be used instead.
     * - options: array, optional, the HTML attributes for the menu container tag.
     */
    public $items = [];
    /**
     * @var array list of HTML attributes shared by all menu [[items]]. If any individual menu item
     * specifies its `options`, it will be merged with this property before being used to generate the HTML
     * attributes for the menu item tag. The following special options are recognized:
     *
     * - tag: string, defaults to "li", the tag name of the item container tags. Set to false to disable container tag.
     *
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $itemOptions = [];
    /**
     * @var string the template used to render the body of a menu which is a link.
     * In this template, the token `{url}` will be replaced with the corresponding link URL;
     * while `{label}` will be replaced with the link text.
     * This property will be overridden by the `template` option set in individual menu items via [[items]].
     */
    public $linkTemplate = '<a href="{url}" class="nav-link"><i class="{icon}"></i> <span class="title">{label}</span></a>';
    /**
     * @var string the template used to render the body of a active menu which is a link.
     * In this template, the token `{url}` will be replaced with the corresponding link URL;
     * while `{label}` will be replaced with the link text.
     * This property will be overridden by the `template` option set in individual menu items via [[items]].
     */
    public $activeLinkTemplate = '<a href="{url}" class="nav-link nav-toggle"><i class="{icon}"></i> <span class="title">{label}</span><span class="selected"></a>';
    /**
     * @var string the template used to render the body of a menu which is NOT a link.
     * In this template, the token `{label}` will be replaced with the label of the menu item.
     * This property will be overridden by the `template` option set in individual menu items via [[items]].
     */
    public $labelTemplate = '<a href="javascript:;" class="nav-link"><i class="{icon}"></i> <span class="title">{label}</span><span class="arrow "></span></a>';
    /**
     * @var string the template used to render the body of a menu which is NOT a link.
     * In this template, the token `{label}` will be replaced with the label of the active menu item.
     * This property will be overridden by the `template` option set in individual menu items via [[items]].
     */
    public $activeLabelTemplate = '<a href="javascript:;" class="nav-link nav-toggle"><i class="{icon}"></i> <span class="title">{label}</span><span class="selected"></span><span class="arrow open"></span></span></a>';
    /**
     * @var string the template used to render a list of sub-menus.
     * In this template, the token `{items}` will be replaced with the rendered sub-menu items.
     */
    public $submenuTemplate = "\n<ul class='sub-menu'>\n{items}\n</ul>\n";
    /**
     * @var boolean whether the labels for menu items should be HTML-encoded.
     */
    public $encodeLabels = true;
    /**
     * @var string the CSS class to be appended to the active menu item.
     */
    public $activeCssClass = 'active open';
    /**
     * @var boolean whether to automatically activate items according to whether their route setting
     * matches the currently requested route.
     * @see isItemActive()
     */
    public $activateItems = true;
    /**
     * @var boolean whether to activate parent menu items when one of the corresponding child menu items is active.
     * The activated parent menu items will also have its CSS classes appended with [[activeCssClass]].
     */
    public $activateParents = true;
    /**
     * @var boolean whether to hide empty menu items. An empty menu item is one whose `url` option is not
     * set and which has no visible child menu items.
     */
    public $hideEmptyItems = true;
    /**
     * @var array the HTML attributes for the menu's container tag. The following special options are recognized:
     *
     * - tag: string, defaults to "ul", the tag name of the item container tags. Set to false to disable container tag.
     *
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $options = [
        'tag' => false
    ];
    /**
     * @var string the CSS class that will be assigned to the first item in the main menu or each submenu.
     * Defaults to null, meaning no such CSS class will be assigned.
     */
    public $firstItemCssClass;
    /**
     * @var string the CSS class that will be assigned to the last item in the main menu or each submenu.
     * Defaults to null, meaning no such CSS class will be assigned.
     */
    public $lastItemCssClass;
    /**
     * @var string the route used to determine if a menu item is active or not.
     * If not set, it will use the route of the current request.
     * @see params
     * @see isItemActive()
     */
    public $route;
    /**
     * @var array the parameters used to determine if a menu item is active or not.
     * If not set, it will use `$_GET`.
     * @see route
     * @see isItemActive()
     */
    public $params;

    /**
     * Renders the content of a menu item.
     * Note that the container and the sub-menus are not rendered here.
     * @param array $item the menu item to be rendered. Please refer to [[items]] to see what data might be in the item.
     * @return string the rendering result
     */
    protected function renderItem($item)
    {
        if (isset($item['url'])) {
            $template = ArrayHelper::getValue($item, 'template', $this->linkTemplate);
            if (!$item['parent'] && $item['active']) {
                $template = ArrayHelper::getValue($item, 'template', $this->activeLinkTemplate);
            }
            return strtr($template, [
                '{url}' => Html::encode(Url::to($item['url'])),
                '{label}' => $item['label'],
                '{icon}' => $item['icon'],
            ]);
        } else {
            $template = ArrayHelper::getValue($item, 'template', $this->labelTemplate);
            if (!$item['parent'] && $item['active']) {
                $template = ArrayHelper::getValue($item, 'template', $this->activeLabelTemplate);
            }
            return strtr($template, [
                '{label}' => $item['label'],
                '{icon}' => $item['icon'],
            ]);
        }
    }
}
