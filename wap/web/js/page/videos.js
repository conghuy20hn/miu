var videoPlayer = null;
$(document).ready(function () {
    winWidth = $(window).width();
    winHeight = $(window).height();
    videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.width = winWidth - 30;
});

function PlayJplayer() {

    myVideoPlay = $("#myVideoPlay").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: title_video,
                m4v: file_path,
                poster: image_path,
            });
        },
        play: function () { // To avoid multiple jPlayers playing together.
            $(this).jPlayer("pauseOthers");
        },
        swfPath: "../../dist/jplayer",
        supplied: "webmv, ogv, m4v",
        globalVolume: true,
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        size: {
            width: winWidth - 30,
            //height: "320px",
        },
    });
    $('.jp-video-270p').css('width', 'auto');
    $('.jp-controls-holder').css('top', '0px');
}

window.addEventListener("resize", function () {
    winWidth = $(window).width();
    winHeight = $(window).height();
    if (videoPlayer) {
        videoPlayer.width = winWidth - 30;
    }
}, false);