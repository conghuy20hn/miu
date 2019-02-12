/**
 * Created by HoangL on 12/5/2015.
 */

$(document).on('pjax:clicked', function () {

});

$(document).on('pjax:send', function () {
    $('.loading').show();
});

$(document).on('pjax:popstate', function (event) {
    if (event.direction == "back" || event.direction == "forward") {
    }
});

$(document).on('pjax:success', function () {

});

$(document).on('pjax:complete', function () {
    /**
     * coding here
     */
});

$(document).on('pjax:end', function () {
    $('.loading').hide();
});

$(document).on('pjax:error', function () {
    $('.loading').hide();
});

//if (window.history && window.history.pushState) {
//    $(window).on('popstate', function () {
//        setTimeout(getRouteTHS(), 500);
//    });
//}

window.addEventListener("orientationchange", function () {
    rtimeResizeend = new Date();
    if (timeoutResizeend === false) {
        timeoutResizeend = true;
        setTimeout(resizeend, deltaResizeend);
    }
}, false);

window.addEventListener("resize", function () {
    rtimeResizeend = new Date();
    if (timeoutResizeend === false) {
        timeoutResizeend = true;
        setTimeout(resizeend, deltaResizeend);
    }
}, false);
