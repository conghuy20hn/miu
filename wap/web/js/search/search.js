/**
 * Created by khanhnq16 on 27-Oct-15.
 */

var lastQuery = "";
var searchValue ="";
var timer = null;

$(function ($, win) {
    initSearch();
});

function initSearch(){
    $('#keyword').keyup(function (event) {
        searchValue = $(this).val();
        searchValue = $.trim(searchValue);
        var timerCallback = function () {
            suggesstionFunc();
        };
        clearTimeout(timer);
        timer = setTimeout(timerCallback, 200);
    });

    $('#search-form').submit(function(event){
        event.preventDefault();
        $('.loading').show();
        isPjaxLoading = true;
        $.pjax.submit(event, '#ajaxBodyContent');
        $('#closeBox').click();
        $('.loading').hide();
    });

    //************ BOXSEARH *************
    $(".btn-search").click(function () {
        $(".popup-search").toggle(20);
        $("#keyword").val('').focus();
        $(".box-search-suggess").hide();
    });

    $("#closeBox").click(function () {
        //$("#keyword").val('');
        $(".popup-search").hide(20);
        //$(".box-search-suggess").hide();
    });

    $("#clearSuggess").click(function () {
        $(".box-search-suggess").hide();
        $("#keyword").val('').focus();
    });
}


function suggesstionFunc() {
    if (searchValue.length < 2) {
        $('#box-search-suggest').fadeOut(100);
    } else {
        if (lastQuery == "") {
            lastQuery = searchValue;
        } else if (lastQuery == searchValue) {
            $('#box-search-suggest').fadeIn(100);
            return;
        } else {
            lastQuery = $('#keyword').val();
        }
        //lấy dữ liệu từ ajax
        //currentRequest = generateGuid();
        //isFinishRequest = false;
        var link = "/search-suggest?k="+searchValue;
//    var link = "/ajax/suggestionQuery?q=" + Base64.encode(searchValue);
        $.ajax({
            type:"GET",
            url:link,
            cache:false,
            //container: '#ajaxBodyContent',
            success:function (data) {
                $('#contentSuggess').html(data);
                $(".box-search-suggess").show(20);
            },
            error:function (request, status, err) {

            },
            complete:function () {

            }
        });
    }
}
/**
 * KhanhNQ16
 * @param url
 */
function goDetail(url){
    $('#closeBox').click();
    $('.loading').show();
    //var csrfToken = $('meta[name="csrf-token"]').attr("content");
    isPjaxLoading = true;
    $.pjax({
        type: "GET",
        url: url,
        data: {

        },
        container: '#ajaxBodyContent',
        success: function (data) {
            $('.loading').hide();
        },
        error: function (request, status, err) {
            $('.loading').hide();
        },
        complete: function () {
            $('.loading').hide();
        },
    });
}