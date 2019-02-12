function trimTextPricelist() {
    addStyleCutText1($('.cuttext_pricelist_name_type2'), false, numCutPriceType2);
    addStyleCutText1($('.cuttext_pricelist_name_type1'), false, numCutPriceType1);
}
function trimTextBuySell() {
    addStyleCutText($('.cuttext_buysell_title').css("width", winWidth - 10 - 42), true);
    addStyleCutText($('.cuttext_buysell_item'), true);
}

function trimTextArticleHomePage() {
    addStyleCutText1($('.trim_text_article_home_page'), false, numCutArticle);
    addStyleCutText1($('.trim_text_video_home_page'), false, numCutVideo);
}
function trimTextArticleItem() {
    addStyleCutText1($('.cuttext_article_item'), false, numCutArticle);
}

function categoryCutText() {
    addStyleCutText($('.category-cut-text').css("width", winWidth - 10 - 120).css('padding', '0px'), true);
}

function cutOffText() {
    //set width, height
    //winWidth = $(window).width();
    //winHeight = $(window).height();

    // List Topic | 30: padding; 42: icon play;
    //trimTextPricelist();
    //trimTextBuySell();
    //trimTextArticleHomePage();
    //trimTextArticleItem();
    //categoryCutText();
    //cutOffTextCombobox();
}

function addStyleCutText(item, displayInline) {
    if (displayInline) {
        $(item).css('white-space', 'nowrap').
            css('overflow', 'hidden').
            css('text-overflow', 'ellipsis').
            css('display', 'inline-block').
            css('margin-top', '0');
    } else {
        $(item).css('white-space', 'nowrap').
            css('overflow', 'hidden').
            css('text-overflow', 'ellipsis').
            css('margin-top', '0');
    }
    $(item).css('line-height', 'normal');
}

function addStyleCutText1(item, displayInline, numCut) {
    if (displayInline) {
        $(item).css('white-space', 'nowrap').
            css('overflow', 'hidden').
            css('text-overflow', 'ellipsis').
            css('display', 'inline-block').
            css('margin-top', '0');
    } else {
        $(item).css('overflow', 'hidden').
            css('text-overflow', 'ellipsis').
            css('text-align', 'justify').
            css('margin-top', '0');
        $(item).each(function () {
            var strText = $(this).html();
            if (strText.length < numCut) {
                $(this).html(strText);
            } else {
                $(this).html(strText.substring(0, numCut) + "...");
            }

        });
    }
    $(item).css('line-height', 'normal');
}

function cutOffTextCombobox() {
    $("ul.dropdown-menu a.text").each(function () {
        addStyleCutText($(this).css("width", (winWidth / 2) - 0 - 40), true);
    })
}

function resetSearchForm(val) {
    $(':input','#'+val)
        .removeAttr('checked')
        .removeAttr('selected')
        .not(':button, :submit, :reset, :hidden, :radio, :checkbox')
        .val('');
}