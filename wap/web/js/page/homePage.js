/**
 * Created by HoangL on 02-Jan-16.
 */

$(function () {
    prettyPage();
    /*fix so ban ghi hien thi trong CBB*/
    $('.selectpicker').selectpicker({
        size: 5
    });
});

function fillDataWeather() {
    var province = $('#province').val();
    $.ajax({
        method: "POST",
        data: $('form#weather').serialize(),
        url: url_weather_search
    }).done(function (data) {
        if (data) {
            //owlWeather.trigger('remove.owl.carousel');
            owlWeather.html(data);
            modifiedWidth();
            //loadHomeWeather();
        } else {
            owlWeather.html("Thông tin thời tiết đang được cập nhật");
            $('.loading').hide();
            $('.view-more').hide();
        }
    });
}

function loadHomeWeather() {
    if (owlWeather.length) {
        owlWeather.owlCarousel('destroy');
        var child = owlWeather.children();
        if (child.length > 3 && !$(child[0]).hasClass('p_weather')) {
            $("#slider_weather div.item:not(:first)").css('border-left', '1px solid #f1f1f1');
            if (!isWindowResized) {
                owlWeather.append('<div class="item"></div>');
            }
            $.each(owlWeather.children(), function () {
                $(this).css('width', (owlWeather.outerWidth() / 3) - 2);
            });
            owlWeather.owlCarousel('destroy');
            owlWeather.owlCarousel({
                loop: false,
                nav: false,
                dots: false,
                items: 3,
                autoWidth: true,
                center: true,
                onInitialized: function () {
                    $('#slider_weather .owl-stage').css('margin-left', 0 - (winWidth - 30) / 3);
                }
            });
        } else {
            $.each(owlWeather.children(), function () {
                if (!$(this).hasClass('p_weather'))
                    $(this).css('width', '33%');
            });
        }
    }
}

function prettyPage() {
    $('#mainBanner').owlCarousel('destroy');
    $('#mainBanner').owlCarousel({
        loop: true,
        nav: false,
        autoplay: true,
        center: true,
        dots: true,
        items: 1
    });
    $('.banner-cut-text').each(function () {
        var self = $(this);
        if (!self.hasClass('pretty-long-text'))
            self.addClass('pretty-long-text');
        // padding left-right: 10 + 10
        self.css('max-width', winWidth - 40);
    });

    $('.main-cat-cut-text').each(function () {
        var self = $(this);
        if (!self.hasClass('pretty-long-text'))
            self.addClass('pretty-long-text');
        // padding left-right: 15 + 15
        self.css('max-width', winWidth - 30);
    });
}

function showTab(tab_id, tab_group, head_group, item) {
    $('.' + tab_group).hide();
    $('#' + tab_id).show();
    $('.' + head_group).parent().removeClass('active-2');
    $('#' + item).parent().addClass('active-2');
}

function ajaxDataPrice() {
    $.ajax({
        method: "POST",
//        data: {province: province},
        data: $('form#price-select').serialize(),
        url: $('form#price-select').attr('action')
    }).done(function (data) {
        if (data) {
            // fill data
            $('#divHomePrice').html(data);
            prettyPage();
            modifiedWidth();
        } else {
            $('#divHomePrice').html("<p class='p_weather' style='color: #888'>Thông tin giá cả đang được cập nhật</p>");
            $('.loading').hide();
            $('.view-more').hide();
        }
    });
}