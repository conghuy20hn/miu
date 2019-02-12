<?php
/* @var $this \yii\web\View */
/* @var $content string */

use backend\assets\AppAsset;
use backend\widgets\LayoutMenu;
use backend\components\common\MenuHelper;
use yii\helpers\Html;
use yii\widgets\Breadcrumbs;
use common\widgets\Alert;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<!--[if IE 8]>
<html lang="<?= Yii::$app->language ?>" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]>
<html lang="<?= Yii::$app->language ?>" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="<?= Yii::$app->language ?>" class="no-js">
    <!--<![endif]-->
    <!-- BEGIN HEAD -->
    <head>
        <meta charset="<?= Yii::$app->charset ?>">
        <!--        <meta http-equiv="X-UA-Compatible" content="IE=edge">-->
        <meta http-equiv="X-UA-Compatible" content="IE=11; IE=10; IE=9; IE=8; IE=7; IE=EDGE" />
        <meta content="width=device-width, initial-scale=1" name="viewport"/>
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>
        <?php $this->head() ?>
        <link rel="shortcut icon" href="favicon.ico"/>
    </head>
    <!-- END HEAD -->
    <!-- BEGIN BODY -->
    <!-- DOC: Apply "page-header-fixed-mobile" and "page-footer-fixed-mobile" class to body element to force fixed header or footer in mobile devices -->
    <!-- DOC: Apply "page-sidebar-closed" class to the body and "page-sidebar-menu-closed" class to the sidebar menu element to hide the sidebar by default -->
    <!-- DOC: Apply "page-sidebar-hide" class to the body to make the sidebar completely hidden on toggle -->
    <!-- DOC: Apply "page-sidebar-closed-hide-logo" class to the body element to make the logo hidden on sidebar toggle -->
    <!-- DOC: Apply "page-sidebar-hide" class to body element to completely hide the sidebar on sidebar toggle -->
    <!-- DOC: Apply "page-sidebar-fixed" class to have fixed sidebar -->
    <!-- DOC: Apply "page-footer-fixed" class to the body element to have fixed footer -->
    <!-- DOC: Apply "page-sidebar-reversed" class to put the sidebar on the right side -->
    <!-- DOC: Apply "page-full-width" class to the body element to have full width page without the sidebar menu -->
    <body class="page-md page-header-fixed page-quick-sidebar-over-content page-sidebar-closed-hide-logo ">
        <?php $this->beginBody() ?>
        <!-- BEGIN HEADER -->
        <div class="page-header md-shadow-z-1-i navbar navbar-fixed-top">
            <!-- BEGIN HEADER INNER -->
            <div class="page-header-inner">
                <!-- BEGIN LOGO -->
                <div class="page-logo" style="padding-right: 0;">
                    <a href="/">
                        <img src="/img/logo.png" alt="logo" class="logo-default"/>
                    </a>
                    <div class="page-sidebar sidebar-toggler-container">
                        <div class="sidebar-toggler">
                        </div>
                    </div>
                </div>
                <!-- END LOGO -->
                <!-- BEGIN RESPONSIVE MENU TOGGLER -->
                <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"></a>
                <!-- END RESPONSIVE MENU TOGGLER -->
                <!-- BEGIN TOP NAVIGATION MENU -->
                <div class="top-menu">
                    <ul class="nav navbar-nav pull-right">
                        <!-- BEGIN USER LOGIN DROPDOWN -->
                        <!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->
                        <li class="dropdown dropdown-user">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                <img alt="" class="img-circle" src="/img/avatar3_small.jpg"/>
                                <span class="username username-hide-on-mobile">
                                    <?php echo (!Yii::$app->user->isGuest) ? Html::encode(Yii::$app->user->identity->username) : 'Guest'; ?> 
                                </span>
                                <i class="fa fa-angle-down"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-default">
                                <?php if (!\Yii::$app->user->isGuest) { ?>
                                    <li>
                                        <a href="/user/view?id=<?php echo Yii::$app->user->identity->id; ?>">
                                            <i class="icon-user"></i> My Profile </a>
                                    </li>
                                <?php } ?>
                                <li class="divider"></li>
                                <li>
                                    <?php if (!\Yii::$app->user->isGuest) { ?>
                                        <a href="/logout">
                                            <i class="icon-key"></i> Log Out
                                        </a>
                                    <?php } else { ?>
                                        <a href="/login">
                                            <i class="icon-key"></i> Sign In
                                        </a>
                                    <?php } ?>
                                </li>
                            </ul>
                        </li>
                        <!-- END USER LOGIN DROPDOWN -->
                    </ul>
                </div>
                <!-- END TOP NAVIGATION MENU -->
            </div>
            <!-- END HEADER INNER -->
        </div>
        <!-- END HEADER -->
        <div class="clearfix">
        </div>

        <!-- BEGIN CONTAINER -->
        <div class="page-container">
            <!-- BEGIN LEFT MENU -->
            <div class="page-sidebar-wrapper">
                <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
                <!-- DOC: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
                <div class="page-sidebar navbar-collapse collapse">
                    <!-- BEGIN SIDEBAR MENU -->
                    <!-- DOC: Apply "page-sidebar-menu-light" class right after "page-sidebar-menu" to enable light sidebar menu style(without borders) -->
                    <!-- DOC: Apply "page-sidebar-menu-hover-submenu" class right after "page-sidebar-menu" to enable hoverable(hover vs accordion) sub menu mode -->
                    <!-- DOC: Apply "page-sidebar-menu-closed" class right after "page-sidebar-menu" to collapse("page-sidebar-closed" class must be applied to the body element) the sidebar sub menu mode -->
                    <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
                    <!-- DOC: Set data-keep-expand="true" to keep the submenues expanded -->
                    <!-- DOC: Set data-auto-speed="200" to adjust the sub menu slide up/down speed -->
                    <ul class="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true"
                        data-slide-speed="200">
                        <!-- DOC: To remove the sidebar toggler from the sidebar you just need to completely remove the below "sidebar-toggler-wrapper" LI element -->
                        <!--                    <li class="sidebar-toggler-wrapper">-->
                        <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
                        <!--                        <div class="sidebar-toggler">-->
                        <!--                        </div>-->
                        <!-- END SIDEBAR TOGGLER BUTTON -->
                        <!--                    </li>-->
                        <?php
                        if (!Yii::$app->user->isGuest) {
                            $callback = function ($menu) {
                                if ($menu['route'])
                                    return [
                                        'label' => $menu['name'],
                                        'url' => [$menu['route']],
                                        'items' => $menu['children'],
                                        'visible' => $menu['is_active'],
                                        'icon' => $menu['icon'],
                                        'parent' => $menu['parent']
                                    ];
                                return [
                                    'label' => $menu['name'],
                                    'items' => $menu['children'],
                                    'visible' => $menu['is_active'],
                                    'icon' => $menu['icon'],
                                    'parent' => $menu['parent']
                                ];
                            };
                            $items = MenuHelper::getAssignedMenu(Yii::$app->user->id, null, $callback);
                            //var_dump($items); die;
                            echo LayoutMenu::widget([
                                'items' => $items,
                            ]);
                        }
                        ?>
                    </ul>
                    <!-- END SIDEBAR MENU -->
                </div>
            </div>
            <!-- END LEFT MENU -->
            <!-- BEGIN CONTENT -->
            <div class="page-content-wrapper">
                <div class="page-content">
                    <div class="page-bar">
                        <?=
                        Breadcrumbs::widget([
                            'itemTemplate' => "<li>{link}<i class='fa fa-angle-right'></i></i></li>\n", // template for all links
                            'activeItemTemplate' => "<li>{link}</li>\n", // template for all links
                            'options' => [
                                'class' => 'page-breadcrumb'
                            ],
                            'homeLink' => [
                                'label' => Yii::t('backend', 'Home'),
                                'url' => Yii::$app->homeUrl,
                                'template' => "<li><i class='fa fa-home'></i>{link}<i class='fa fa-angle-right'></i></li>\n",
                            ],
                            'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
                        ])
                        ?>
                    </div>
                    <?= Alert::widget() ?>
                    <?= $content ?>
                </div>
            </div>
            <!-- END CONTENT -->
        </div>
        <!-- END CONTAINER -->

        <!-- BEGIN FOOTER -->
        <div class="page-footer">
            <div class="page-footer-inner">
                2015 &copy; Suppertheme by VASIN.
            </div>
            <div class="scroll-to-top">
                <i class="icon-arrow-up"></i>
            </div>
        </div>
        <!-- END FOOTER -->
        <?php $this->endBody() ?>
        <script>
            jQuery(document).ready(function () {
                Metronic.init(); // init metronic core components
                Layout.init(); // init current layout
            });
        </script>
    </body>
</html>
<?php $this->endPage() ?>