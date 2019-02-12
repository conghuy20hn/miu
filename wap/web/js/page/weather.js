$(function () {
    //loadWeather();

    $('.tide_location').click(function () {
        $('.tide_detail').slideToggle();
    });

    /*fix so ban ghi hien thi trong CBB*/
    $('.selectpicker').selectpicker({
        size: 5
    });

});

function fillDataWeather() {
    var province = $('#province').val();
    $.ajax({
        method: "POST",
//        data: {province: province},
        data: $('form#weather').serialize(),
        url: url_weather_search
    }).done(function (data) {
        if (data) {
            //owlWeather.trigger('remove.owl.carousel');
            owlWeather.html(data);
            modifiedWidth();
            //loadWeather();
        } else {
            owlWeather.html("Thông tin thời tiết đang được cập nhật");
            $('.loading').hide();
            $('.view-more').hide();
        }
    });
}

function showDetailWeather(val, select) {
    if ($(select).html() == '-') {
        $('#' + val).slideUp();
        $(select).html('+');
    } else {
        $('#' + val).slideDown();
        $(select).html('-');
    }


}
function loadWeather() {
    //owlWeather.owlCarousel('destroy');
    //if (owlWeather.length) {
    //    var child = owlWeather.children();
    //    if (child.length > 3 && !$(child[0]).hasClass('p_weather')) {
    //        owlWeather.append('<div class="item"></div>');
    //        $.each(owlWeather.children(), function () {
    //            $(this).css('width', (owlWeather.outerWidth() / 3) - 2);
    //        });
    //        $("#slider_weather div.item:not(:first)").css('border-left', '1px solid #f1f1f1');
    //        //owlWeather.owlCarousel('destroy');
    //        owlWeather.owlCarousel({
    //            loop: false,
    //            nav: false,
    //            dots: false,
    //            items: 3,
    //            autoWidth: true,
    //            center: true,
    //            onInitialized: function () {
    //                $('#slider_weather .owl-stage').css('margin-left', 0 - (winWidth - 30) / 3);
    //            }
    //        });
    //    } else {
    //        $.each(owlWeather.children(), function () {
    //            if (!$(this).hasClass('p_weather'))
    //                $(this).css('width', '33%');
    //        });
    //        $('.owl-carousel').css('display', 'block');
    //    }
    //}
}


function loadTab() {
    owlWeather.owlCarousel('destroy');
    owlWeather.owlCarousel({
        loop: false,
        nav: false,
        dots: false,
        items: 3,
        //autoWidth: true,
        center: true,
    });
    //owlWeather.trigger('remove.owl.carousel', 0 );
}

function showWeather(select, last) {
    $('#' + select).toggle();
    if ($('#' + select).css('display') == 'none') {
        //do something
        $('#icon_' + select).html('+').css('font-size', '25px');
    } else {
        $('#icon_' + select).html('–').css('font-size', '25px');
        if (last == 1)
            $('html, body').animate({scrollTop: $("#" + select).offset().top - winHeight + 100}, 'slow');
    }
}

function scrollLast(div) {
    //$("#" + div).animate({scrollTop: $("#" + div).height()}, 1000);
    //$('html, body').animate({ scrollTop: $("#" + div).offset().top-400 }, 'slow');
}