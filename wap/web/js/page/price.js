/**
 * Created by HUYNC2 on 1/6/2016.
 */
$(function () {
    //$('.datepicker').datepicker({
    //    format: 'dd/mm/yyyy',
    //});

    $(".start_time").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function (selectedDate) {
            $(".end_time").datepicker("option", "minDate", selectedDate);
        }
    });
    $(".end_time").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function (selectedDate) {
            $(".start_time").datepicker("option", "maxDate", selectedDate);
        }
    });

    cutOffText();
    onloadPrice();
    /*fix so ban ghi hien thi trong CBB*/
    $('.selectpicker').selectpicker({
        size: 5
    });

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
        $('.loading').hide();
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
            var objData = jQuery.parseJSON(data);
            if (objData.errorCode == 0) {
                // fill data
                $('.' + container).last().html(objData.data);
                if (objData.url == 1) {
                    $('.loading').show();
                    $('.view-more').show();
                }
                else {
                    $('.loading').hide();
                    $('.view-more').hide();
                }
            } else {
                $('.' + container).last().html('');
                alert(objData.errorMessage);
                $('.loading').hide();
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
                    var objData = jQuery.parseJSON(data);
                    if (objData.items.length > 0) {
                        $.each(objData.items, function (_key, _value) {
                            if (product_selected > 0 && product_selected == _value.key) {
                                $('#' + data_target).append($('<option>', {
                                    value: '' + _value.key + '',
                                    selected: "true",
                                    text: _value.value
                                })).selectpicker('refresh');
                            } else {
                                $('#' + data_target).append($('<option>', {
                                    value: '' + _value.key + '',
                                    text: _value.value
                                })).selectpicker('refresh');
                            }
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
                resetCombobox();
            }).always(function () {
            });
        }
    });
}


function resetCombobox() {
    $('ul.dropdown-menu .inner').each(function () {
        var a = $(this + ' li');
        alert(a);
    });
}