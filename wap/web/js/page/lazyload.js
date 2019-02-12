/**
 * Created by HUYNC2 on 1/5/2016.
 */

function lazyLoadAjax2(select2) {
    // lay link load item last
    var ajaxLazyLoad2 = $('.' + select2).last();
    // url load
    var urlPajax = ajaxLazyLoad2.data('url-ajax');
    // cac ham se goi sau khi call success
    var callback1 = ajaxLazyLoad2.data('callback-ajax1');
    //var callback2 = ajaxLazyLoad2.data('callback-ajax2');
    // class fill data
    var container = ajaxLazyLoad2.attr('container');
    var loadMoreHide = ajaxLazyLoad2.attr('load-more-hide');
    // reset item last
    $(this).removeAttr('data-url-ajax');

    $('.loading').hide();
    $('.view-more').hide();
    $('.' + loadMoreHide).hide();
    if (container && urlPajax) {
        $.ajax({
            method: "GET",
            url: urlPajax
        }).done(function (data) {
            var objData = jQuery.parseJSON(data);
            if (objData) {
                // fill data
                $('.' + container).last().html(objData.data);
                if (objData.url) {
                    $('.loading').show();
                    $('.view-more').show();
                    $('.' + loadMoreHide).show();
                }
            } else {
                $('.loading').hide();
                $('.view-more').hide();
                $('.' + loadMoreHide).hide();
            }
        }).always(function () {
            callFunctionName(callback1);
            //callFunctionName(callback2);
        });
    }
    // Remove data
    ajaxLazyLoad2.removeAttr('data-url-ajax');
    ajaxLazyLoad2.removeAttr('data-callback-ajax1');
    ajaxLazyLoad2.removeAttr('data-callback-ajax2');
    ajaxLazyLoad2.removeClass('ajaxLazyLoad');
}

function lazyLoadAjax3(select2) {
    $('.loading').hide();
    $('.view-more').hide();
    // lay link load item last
    var ajaxLazyLoad2 = $('.' + select2).last();
    // url load
    var urlPajax = ajaxLazyLoad2.data('url-ajax');
    // cac ham se goi sau khi call success
    var callback1 = ajaxLazyLoad2.data('callback-ajax1');
    //var callback2 = ajaxLazyLoad2.data('callback-ajax2');
    // class fill data
    var container = ajaxLazyLoad2.attr('container');
    var loadMoreHide = ajaxLazyLoad2.attr('load-more-hide');
    // reset item last
    $(this).removeAttr('data-url-ajax');
    if (container && urlPajax) {
        $.ajax({
            method: "GET",
            url: urlPajax
        }).done(function (data) {
            var objData = jQuery.parseJSON(data);
            if (objData.errorCode == 0) {
                // fill data
                $('.' + container).last().html(objData.data);
                if (objData.url == 1) {
                    $('.view-more').show();
                    $('.loading').show();
                }
                else {
                    $('.loading').hide();
                    $('.view-more').hide();
                }
            } else {
                alert(objData.errorMessage);
                $('.loading').hide();
                $('.view-more').hide();
            }
        }).always(function () {
            callFunctionName(callback1);
            //callFunctionName(callback2);
        });
    }
    // Remove data
    ajaxLazyLoad2.removeAttr('data-url-ajax');
    ajaxLazyLoad2.removeAttr('data-callback-ajax1');
    ajaxLazyLoad2.removeAttr('data-callback-ajax2');
    ajaxLazyLoad2.removeClass('ajaxLazyLoad');
}

function callFunctionName(functionName) {
    if (functionName) {
        var funcfunctionName = window[functionName];
        if (typeof funcfunctionName === 'function') {
            funcfunctionName();
        }
    }
}