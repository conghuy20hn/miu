/**
 * Created by HoangL on 12/5/2015.
 */
var winWidth;
var winHeight;
var owlWeather;
var dataTypeTopMenu;
var numCutArticle = 70;
var numCutVideo = 70;
var numCutPriceType1 = 50;
var numCutPriceType2 = 50;
var myVideoPlay;

$(function () {
    winWidth = $(window).width();
    winHeight = $(window).height();
    owlWeather = $('#slider_weather');
    modifiedWidth();
    getRouteTHS();

    var heightLeftMenu = totalMenu * 42;
    if (heightLeftMenu < winHeight) {
        $('#footer_left_menu').css('bottom', 0);
    } else {
        $('#footer_left_menu').css('bottom', 'inherit');
    }

    $('#image_path').change(function () {
        var image_path = $("#image_path").val();
        if (image_path) {
            $('#image_path_name').html(image_path);
        } else {
            $('#image_path_name').html(image_path);
        }
    });

});


function getRouteTHS() {
    $('.nav-menu a').removeClass('active');
    if (dataTypeTopMenu && dataTypeTopMenu != '') {
        dataTypeTopMenu = dataTypeTopMenu.split(",");
        var arrTypeMenu = dataTypeTopMenu[0].split("_");
        var typeMenu = arrTypeMenu[0] + '_';
        $.each(dataTypeTopMenu, function (index, value) {
            if (index == 0) {
                if ($('.nav-menu a[data-type="' + value + '"]').length > 0) {
                    $('.nav-menu a[data-type="' + value + '"]').addClass('active');
                    return false;
                }
            } else {
                if ($('.nav-menu a[data-type="' + typeMenu + value + '"]').length > 0) {
                    $('.nav-menu a[data-type="' + typeMenu + value + '"]').addClass('active');
                    return false;
                }
            }
        });
    }
    var scrollLeft = 0;
    $('.nav-menu a.nav-item').each(function () {
        var self = $(this);
        if (self.hasClass('active')) {
            scrollLeft = self.position().left;
            if (self.outerWidth() < winWidth) {
                scrollLeft -= (winWidth - self.parent().outerWidth(true));
            }
            return false;
        }
    });
    $('.nav-menu .inner-scroll-hoz').scrollLeft(scrollLeft);
}

function loadMenuTop() {
    $('.nav-menu').owlCarousel('destroy').css('display', 'block');
    var numItems = $('.nav-menu a.nav-item').length;
    var totalWidth = 0;
    $('.nav-menu a.nav-item').css('padding-left', 0).css('padding-right', 0);
    $('.nav-menu a.nav-item').each(function (index, value) {
        totalWidth += $(value).width();
    });
    var calculatePadding = 5;
    //var calculatePaddingLastOne = 0;
    if (totalWidth < winWidth) {
        calculatePadding = Math.floor((winWidth - totalWidth) / numItems / 2);
        if (calculatePadding < 5) {
            calculatePadding = 5;
        }
        //calculatePaddingLastOne = Math.floor(calculatePadding + (winWidth - totalWidth - calculatePadding * 2 * numItems) / 2);
    } else {
        //
        $('.nav-menu a.nav-item:last').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    $('.nav-menu a.nav-item').css('padding-left', calculatePadding).css('padding-right', calculatePadding);
    //if (calculatePaddingLastOne > calculatePadding) {
    //    $('.nav-menu a.nav-item:last').css('padding-left', calculatePaddingLastOne).css('padding-right', calculatePaddingLastOne);
    //}
    $('.nav-menu').owlCarousel({
        loop: false,
        nav: false,
        dots: false,
        items: 4,
        margin: 0,
        autoWidth: true,
        onInitialized: function () {
            totalWidth = 0;
            $('.nav-menu .owl-item').each(function (index, value) {
                totalWidth += $(value).width();
            });
            $('.nav-menu .owl-stage-outer').css('width', winWidth).css('height', 38);
            $('.nav-menu .owl-stage').css('width', totalWidth + 5).css('height', 38);
        }
    });
}

function datePickMobi() {
    var mpFrom = $(".min-date").mobipick();
    var mpTo = $(".max-date").mobipick();
    mpFrom.on("change", function () {
        mpTo.mobipick("option", "minDate", mpFrom.mobipick("option", "date"));
    });
    mpTo.on("change", function () {
        mpFrom.mobipick("option", "maxDate", mpTo.mobipick("option", "date"));
    });
}
