<?php

use common\helpers\MenuHelper;
?>
<div class="row">
    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        <div class="dashboard-stat blue">
            <div class="visual">
                <i class="fa fa-comments"></i>
            </div>
            <div class="details">
                <div class="number">
                    <span data-value="<?php echo $productItemCount; ?>" data-counter="counterup"><?php echo $productItemCount; ?></span>
                </div>
                <div class="desc"> Sản phẩm </div>
            </div>
            <a href="/product-items/index" class="more"> Xem thêm
                <i class="m-icon-swapright m-icon-white"></i>
            </a>
        </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        <div class="dashboard-stat red">
            <div class="visual">
                <i class="fa fa-bar-chart-o"></i>
            </div>
            <div class="details">
                <div class="number">
                    <span data-value="<?php echo $buySellCount; ?>" data-counter="counterup"><?php echo $buySellCount; ?></span></div>
                <div class="desc"> Tin mua/bán </div>
            </div>
            <a href="/product-cat-user/index" class="more"> Xem thêm
                <i class="m-icon-swapright m-icon-white"></i>
            </a>
        </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        <div class="dashboard-stat green">
            <div class="visual">
                <i class="fa fa-shopping-cart"></i>
            </div>
            <div class="details">
                <div class="number">
                    <span data-value="<?php echo $news; ?>" data-counter="counterup"><?php echo $news; ?></span>
                </div>
                <div class="desc"> Tin tức </div>
            </div>
            <a href="/vt-article-items/index" class="more"> Xem thêm
                <i class="m-icon-swapright m-icon-white"></i>
            </a>
        </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        <div class="dashboard-stat purple">
            <div class="visual">
                <i class="fa fa-globe"></i>
            </div>
            <div class="details">
                <div class="number">
                    <span data-value="<?php echo $videos; ?>" data-counter="counterup"><?php echo $videos; ?></span> </div>
                <div class="desc"> Video </div>
            </div>
            <a href="/video/index" class="more"> Xem thêm
                <i class="m-icon-swapright m-icon-white"></i>
            </a>
        </div>
    </div>
</div>