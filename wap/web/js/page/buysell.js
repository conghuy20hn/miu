/**
 * Created by HUYNC2 on 1/6/2016.
 */
$(document).bind("mobileinit", function () {

    $.mobile.ajaxEnabled = false;

});
$(function () {
    /*var mpFrom = $(".min-date").mobipick({
     dateFormat: "dd-MM-yyyy",
     locale: "vi",
     });
     var mpTo = $(".max-date").mobipick({
     dateFormat: "dd-MM-yyyy",
     locale: "vi",
     });

     mpFrom.on("change", function () {
     mpTo.mobipick("option", "minDate", mpFrom.mobipick("option", "date"));
     });
     mpTo.on("change", function () {
     mpFrom.mobipick("option", "maxDate", mpTo.mobipick("option", "date"));
     });


     var pickerWithReset = $("input.mobipick-reset").mobipick();
     $("a.reset").on("tap", function () {
     pickerWithReset.mobipick("option", "date", null).mobipick("updateDateInput");
     });*/


    $(".start_time").datepicker({
        //defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        dateFormat: "dd-mm-yy",
        onClose: function (selectedDate) {
            $(".end_time").datepicker("option", "minDate", selectedDate);
        }
    });
    $(".end_time").datepicker({
        //defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        dateFormat: "dd-mm-yy",
        onClose: function (selectedDate) {
            $(".start_time").datepicker("option", "maxDate", selectedDate);
        }
    });

    cutOffText();
    onloadPrice();

    $('#myBtn').click(function () {
        $('#myModalCompose').modal('show');
    });

    /*fix so ban ghi hien thi trong CBB*/
    $('.selectpicker').selectpicker({
        size: 5
    });
});

// click buy&sell ban phim ao
$(document).keypress(function (e) {
    if (e.which == 13) {
        searchBuyAndSell('ajaxLazyLoadSearchBuySell', true);
    }
});

function setDataCombobox(val, select) {
    var obj = jQuery.parseJSON(val);
    var keyVal = obj.key;
    var nameVal = obj.value;
    $('#a_' + select).html(nameVal + '<i class="glyphicon icon-arrow_down"></i>');
    $('#hd_' + select).val(keyVal);
}

function fillData(option, key, itemName, extend) {
    if (option) {
        //var a = $('#district').html('');
        var obj = jQuery.parseJSON(option);

        // select option target
        //var optionTarget = $('#product_extend');
        var optionTarget = $('#' + obj.target);
        // postion
        var data_postion = optionTarget.attr('data-position');
        // num_per_row
        var data_num_per_row = optionTarget.attr('data-num-per-row');
        if (!data_postion)
            optionTarget.html('');
        //var a = $('#' + obj.target).html('');
        var url = obj.url + "?" + obj.send_name + "=" + key;
        if (!key || key == "") {
            $('.result_extend').html('');
        }

        $.ajax({
            method: "GET",
            url: url
        }).success(function (data) {
            if (data) {
                var objData = jQuery.parseJSON(data);
                if (!extend) {
                    $('#' + obj.target).html('');
                    if (objData.items.length > 0) {
                        $.each(objData.items, function (_key, _value) {
                            $('#' + obj.target).append($('<option>', {
                                value: '' + _value.key + '',
                                text: _value.value
                            })).selectpicker('refresh');
                        })
                    } else {
                        $('#' + obj.target).append($('<option>', {
                            value: '0',
                            text: itemName
                        })).selectpicker('refresh');
                    }
                    resetCombobox();
                } else {
                    if (objData.items.length > 0) {

                        $('.result_extend').html('');
                        var strData = '<div class="result_extend">';
                        if (data_postion == "1")
                            optionTarget.parent().hide();
                        $.each(objData.items, function (_key, _value) {
                            if (data_postion == "1") {

                                strData += '<div class="col-01 item">' + _value + "</div>";
                                if (_key % 2 == 0) {
                                    strData += '<div class="clear"></div>';
                                }
                            } else {
                                if (_key % 2 == 0)
                                    strData += '<div class="row"><div class="col-01 item">' + _value + "</div>";
                                if (_key % 2 != 0)
                                    strData += '<div class="col-01 item">' + _value + "</div></div>";
                            }

                        });
                        strData += "</div>";
                        //optionTarget.parent().append(strData);
                        optionTarget.parent().parent().append(strData);

                        $.each(objData.arrName, function (_key, _value) {
                            $('#' + _value).selectpicker('refresh');
                        });
                    }
                }
            } else {
                if (!data_postion) {
                    var objItem = jQuery.parseJSON(option);
                    $('#' + obj.target).append($('<option>', {
                        value: '0',
                        text: itemName
                    })).selectpicker('refresh');
                } else {
                    optionTarget.html('');
                }
            }
        }).always(function () {
        });
    }
}


function searchBuyAndSell(select2, reset) {

    // lay link load item last
    var ajaxLazyLoad2 = $('.' + select2).last();
    // url load
    var urlPajax = ajaxLazyLoad2.data('url-ajax');
    // cac ham se goi sau khi call success
    var callback1 = ajaxLazyLoad2.data('callback-ajax1');
    var callback2 = ajaxLazyLoad2.data('callback-ajax2');
    // class fill data
    var container = ajaxLazyLoad2.attr('container');

    if (reset) {
        $('.loading').hide();
        $('.' + container).html('');
    }
    // reset item last
    $(this).removeAttr('data-url-ajax');


    if (urlPajax) {
        $.ajax({
            method: "POST",
            data: $('form#buy-sell').serialize(),
            url: urlPajax
        }).done(function (data) {
            var objData = jQuery.parseJSON(data);
            if (objData.errorCode == 0) {
                // fill data
                $('.' + container).last().html(objData.data);
                if (objData.url == 1)
                    $('.loading').show();
                else
                    $('.loading').hide();
            } else {
                $('.' + container).last().html('');
                alert(objData.errorMessage);
                $('.loading').hide();
            }
        }).always(function () {
            $('#buy-sell').active();
            callFunctionName(callback1);
            callFunctionName(callback2);
        });
    }
    // Remove data
    ajaxLazyLoad2.removeAttr('data-url-ajax');
    ajaxLazyLoad2.removeAttr('data-callback-ajax1');
    ajaxLazyLoad2.removeAttr('data-callback-ajax2');
    ajaxLazyLoad2.removeClass('ajaxLazyLoad');
}


function searchPrice(select2, reset) {

    // lay link load item last
    var ajaxLazyLoad2 = $('.' + select2).last();
    // url load
    var urlPajax = ajaxLazyLoad2.data('url-ajax');
    // cac ham se goi sau khi call success
    var callback1 = ajaxLazyLoad2.data('callback-ajax1');
    //var callback2 = ajaxLazyLoad2.data('callback-ajax2');
    // class fill data
    var container = ajaxLazyLoad2.attr('container');

    if (reset) {
        $('.' + container).html('');
    }
    // reset item last
    $(this).removeAttr('data-url-ajax');

    if (urlPajax) {
        $.ajax({
            method: "POST",
            data: $('form#price-search').serialize(),
            url: urlPajax
        }).done(function (data) {
            if (data) {
                // fill data
                $('.' + container).last().html(data);
                $('.view-more').show();
            } else {
                $('.' + container).last().html("Không có dữ liệu");
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


function onloadPrice() {

    $('.info_select_ajax_load').each(function () {
        // url load
        var urlPajax = $(this).attr('data-url');
        var data_target = $(this).attr('data-target');
        var data_select = $(this).attr('data-select');
        var send_name = $(this).attr('send_name');
        var itemName = $(this).attr('data_name');
        var key = $('#' + data_select).val();
        // cac ham se goi sau khi call success
        // class fill data

        if (urlPajax) {
            var url = urlPajax + "?" + send_name + "=" + key;
            $.ajax({
                method: "GET",
                url: url
            }).success(function (data) {
                if (data) {
                    $('#' + data_target).html('');
                    var objData = jQuery.parseJSON(data);
                    if (objData.items.length > 0) {
                        $.each(objData.items, function (_key, _value) {
                            $('#' + data_target).append($('<option>', {
                                value: '' + _value.key + '',
                                text: _value.value
                            })).selectpicker('refresh');
                        })
                    } else {
                        $('#' + data_target).append($('<option>', {
                            value: '0',
                            text: itemName
                        })).selectpicker('refresh');
                    }
                } else {
                    var objItem = jQuery.parseJSON(option);
                    $('#' + data_target).append($('<option>', {
                        value: '0',
                        text: itemName
                    })).selectpicker('refresh');
                }
            }).always(function () {
            });
        }
    });
}

function submitCompose() {

    var frmData = new FormData();

    frmData.append('image_path', $('#image_path')[0].files[0]);
    var arrfrm = $('form#buy-sell-compose').serialize().split('&');
    for (var a in arrfrm) {
        var b = arrfrm[a].split('=');
        frmData.append(b[0], b[1]);
    }
    console.log('1');
    $.ajax({
        url: '/buy-sell/compose-submit',
        type: 'POST',
        data: frmData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'text',
        success: function (data) {
            var objData = jQuery.parseJSON(data);
            if (objData.errCode == 1) {
                $('#show_result').html();
                $('#show_result').hide();
                $('#myModalCompose').modal('hide');
                alert(objData.errMessage);
                $('form#buy-sell-compose button').css('border', 'none');
                $('form#buy-sell-compose input').css('border', 'none');
                $('form#buy-sell-compose textarea').css('border', 'none');

                $('form#buy-sell-compose button').each(function () {
                    if ($(this).attr('data-id') == objData.control) {
                        $(this).css('border', '1px solid red').focus();
                    }
                });

                $('form#buy-sell-compose input').each(function () {
                    if ($(this).attr('data-id') == objData.control) {
                        $(this).css('border', '1px solid red').focus();
                    }
                });

                $('form#buy-sell-compose textarea').each(function () {
                    if ($(this).attr('data-id') == objData.control) {
                        $(this).css('border', '1px solid red').focus();
                    }
                });

            } else if (objData.errCode == 0) {
                //$('#show_result').show();
                //$('#show_result').html(objData.errMessage);
                $('.result_compose').html(objData.errMessage);
                $('#myModalCompose').modal('show');
                //$('.btn-cancel').click();
            }
        }
    });


    //$("form#buy-sell-compose").submit(function (event) {
    //    //event.preventDefault();
    //    var formData = new FormData(this);
    //    $.ajax({
    //        url: '/buy-sell/compose-submit',
    //        type: 'POST',
    //        data: formData,
    //        async: false,
    //        cache: false,
    //        contentType: false,
    //        processData: false,
    //        success: function (returndata) {
    //            return false;
    //        }
    //    });
    //
    //});


    /*$.ajax({
     method: "POST",
     data: $('form#buy-sell-compose').serialize(),
     url: '/buy-sell/compose-submit',
     }).done(function (data) {
     if (data) {
     console.log('123');
     } else {
     console.log('123');
     }
     }).always(function () {
     });*/
    return false;
}

function showBuySell(val, last) {
    $('#' + val).toggle();

    if ($('#' + val).css('display') == 'none') {
        //do something
        $('#icon_' + val).html('+');
    } else {
        $('#icon_' + val).html('-');
        if (last == 1)
            $('html, body').animate({scrollTop: $("#" + val).offset().top - winHeight + 100}, 'slow');
    }
}

function resetCombobox() {
    $('ul.dropdown-menu').each(function () {
        var a = $(this + ' li').length;
        alert(a);
    });
}