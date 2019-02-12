// JavaScript Document
$(function () {

    //************ MMENU *************	
    $(function () {
        $('nav#menu').mmenu({
            slidingSubmenus: false
        });
    });

    //************ BOXSEARH *************
    $(".btn-search").click(function () {
        $(".popup-search").toggle(20);
        $('#keyword').val('').focus();
    });

    $("#closeBox").click(function () {
        $(".popup-search").hide(20);
    });

    $(".ipt-search").focus(function () {
        $(".box-search-suggess").toggle(50);
    });

    $("#clearSuggess").click(function () {
        $(".box-search-suggess").hide();
    });


    //************ SETMENU *************
    function setMenu() {
        var heightWin = innerHeight;
        if (heightWin > 441) {
            $(".txt-footer").css("position", "absolute");
        };
    }

    setMenu();

    $(window).resize(function () {
        setMenu();
    });

}(jQuery, window));
