/**
 * Created by HoangL on 10/28/2015.
 */
var myVideoPlayer,
    videoPlayerProcess,
    myVideoPlayerData,
    video_fixFlash_mp4, // Flag: The m4a and m4v Flash player gives some old currentTime values when changed.
    video_fixFlash_mp4_id, // Timeout ID used with video_fixFlash_mp4
    video_ignore_timeupdate, // Flag used with video_fixFlash_mp4
    imageBlurVideo,
    qualityPathVideo,
    imagePathVideo,
    titleVideo,
    currentVideoQuality,
    itemVideoPlaying,
    isVideoPlaying = false,
    isFullScreen = false,
    progressValue,
    isHideControlBar = false,
    lastBgBlurImg = '/images/defaultBgBlurVideo.jpg',
    showToolbarIimeout;

$(document).ready(function () {
    initVideoContent();
});

function initVideoContent() {
    if ($('#videoDetailPopup').length > 0) {
        myVideoPlayer = $("#playerVideoPopup");
        videoPlayerProcess = document.getElementById('videoPlayerProcess');
        videoPlayerProcess.innerHTML = '';
        // bind event
        noUiSlider.create(videoPlayerProcess, {
            start: 0,
            step: 0.1,
            range: {
                'min': 0,
                'max': 100
            }
        });
        bindImageBgBlur('#videoDetailPopup', imageBlurVideo);
        $('#body_content').removeClass('enable-scroll').addClass('disable-scroll');
        disableOverScroll($('#body_content'));
        $('#videoDetailPopup').show().removeClass('disable-scroll').addClass('enable-scroll').animate({scrollTop: 0}, 400);
        enableOverScroll($('#videoDetailPopup'));
        // bind video
        qualityPathVideo = $.base64Decode(qualityPathVideo);
        qualityPathVideo = $.parseJSON(qualityPathVideo);
        var isVideoPlaying = false;
        var selectedFile;
        $.each(qualityPathVideo, function (k, v) {
            if (k == currentVideoQuality) {
                selectedFile = v;
            }
        });
        if (selectedFile) {
            itemVideoPlaying = [];
            itemVideoPlaying[selectedFile.format] = selectedFile.url;
            itemVideoPlaying['title'] = titleVideo;
            itemVideoPlaying['poster'] = imagePathVideo;
            myVideoPlayer.jPlayer({
                ready: function () {
                    $('#playerVideoPopup img').attr('src', imagePathVideo).show();
                },
                play: function () {
                    $(this).jPlayer("pauseOthers"); // pause all players except this one.
                    isVideoPlaying = true;
                    if (isFullScreen) {
                        clearTimeout(showToolbarIimeout);
                        showToolbarIimeout = setTimeout(hideProgressBar, 5 * 1000); // 5s
                    }
                },
                timeupdate: function (event) {
                    //videoPlayerProcess.noUiSlider.set([null, Math.round(event.jPlayer.status.currentPercentAbsolute * 10) / 10]);
                    setTimeout(function () {
                        progressValue = event.jPlayer.status.currentPercentAbsolute;
                        //videoPlayerProcess.noUiSlider.set([null, progressValue]);
                        $('#videoPlayerProcess .noUi-origin').css('left', '' + progressValue + '%');
                    }, 0);
                },
                cssSelectorAncestor: "#videoDetailPopup",
                swfPath: "/js",
                supplied: "m4v",
                size: {
                    width: "" + winWidth + "px",
                    height: "auto"
                },
                useStateClassSkin: true
            });

            // A pointer to the jPlayer data object
            myVideoPlayerData = myVideoPlayer.data("jPlayer");
            videoPlayerProcess.noUiSlider.on('update', function (values, handle) {
                //input.value = values[handle];
                if (isFullScreen) {
                    clearTimeout(showToolbarIimeout);
                    showToolbarIimeout = setTimeout(hideProgressBar, 5 * 1000); // 5s
                }
                var sp = myVideoPlayerData.status.seekPercent;
                if (sp > 0) {
                    // Apply a fix to mp4 formats when the Flash is used.
                    if (video_fixFlash_mp4) {
                        video_ignore_timeupdate = true;
                        clearTimeout(video_fixFlash_mp4_id);
                        video_fixFlash_mp4_id = setTimeout(function () {
                            video_ignore_timeupdate = false;
                        }, 1000);
                    }
                    // Move the play-head to the value and factor in the seek percent.
                    myVideoPlayer.jPlayer("playHead", values[handle] * (100 / sp));
                } else {
                    // Create a timeout to reset this slider to zero.
                    setTimeout(function () {
                        $('#videoPlayerProcess .noUi-origin').css('left', '0%');
                    }, 0);
                }
            });

            $('.selectVideoQualityOption').unbind('click').bind('click', function () {
                var self = $(this);
                var quality = self.attr('data-value');
                $('.selectVideoQualityOption').removeClass('disabled');
                $(this).addClass('disabled');
                if (currentVideoQuality != quality) {
                    currentVideoQuality = quality;
                    var textDisplay = $(this).attr('data-text');
                    if (textDisplay) {
                        $('#iconQualityVideo').text(textDisplay).css('display', 'inline-block');
                    } else {
                        $('#iconQualityVideo').text(textDisplay).hide();
                    }
                    var currentTime = 0;
                    if (myVideoPlayer.data("jPlayer").status.paused === true) {
                        //$(this.cssSelector.).jPlayer("setMedia", newItem[1]);
                        currentTime = myVideoPlayer.data("jPlayer").status.currentTime;
                        setVideoPlayer();
                        myVideoPlayer.jPlayer("pause", currentTime);
                    } else if (myVideoPlayer.data("jPlayer").status.paused === false &&
                        myVideoPlayer.data("jPlayer").status.currentTime > 0) {
                        myVideoPlayer.jPlayer("pause");
                        currentTime = myVideoPlayer.data("jPlayer").status.currentTime;
                        setVideoPlayer();
                        myVideoPlayer.jPlayer("play", currentTime);
                    } else {
                        setVideoPlayer();
                    }
                }
            });

            $('#btnVideoFullScreen').unbind('click').bind('click', function () {
                var childItem = $(this).children()[0];
                if (!$(childItem).hasClass('glyphicon-resize-small')) {
                    // fullscreen
                    isFullScreen = true;
                    if (isVideoPlaying) {
                        clearTimeout(showToolbarIimeout);
                        showToolbarIimeout = setTimeout(hideProgressBar, 5 * 1000);
                    }
                    $("#playerVideoPopup").unbind("tap").bind("tap", function () {
                        if (isHideControlBar) {
                            clearTimeout(showToolbarIimeout);
                            $('#videoProccessBar').show();
                            showToolbarIimeout = setTimeout(hideProgressBar, 5 * 1000); // 5s
                        } else {
                            clearTimeout(showToolbarIimeout);
                            showToolbarIimeout = setTimeout(hideProgressBar, 5 * 1000); // 5s
                        }
                    });
                    $("#videoProccessBar").unbind("tap").bind("tap", function () {
                        clearTimeout(showToolbarIimeout);
                        showToolbarIimeout = setTimeout(hideProgressBar, 5 * 1000); // 5s
                    });
                    $('#videoProccessBar').addClass('proccess-bar-full');
                    $(childItem).removeClass('glyphicon-fullscreen').addClass('glyphicon-resize-small');
                    $('#videoDetailPopup').scrollTop(0).removeClass('enable-scroll').addClass('disable-scroll');
                    disableOverScroll($('#videoDetailPopup'));
                    $('#videoPlayerControl').css('height', winHeight);
                    $('#btnBackVideoPlayer').hide();
                    myVideoPlayer.jPlayer("option", "size", {
                        width: "" + winWidth + "px",
                        height: "" + winHeight + "px"
                    });
                    //$($('#playerVideoPopup').children()).each(function () {
                    //    $(this).css('height', winHeight);
                    //});
                    if (isVideoPlaying) {
                        $('#playerVideoPopup img').css('display', 'none');
                        $('#playerVideoPopup video').css('height', winHeight);
                    } else {
                        if ($('#playerVideoPopup video').height() > 0) {
                            $('#playerVideoPopup img').css('display', 'none');
                        } else {
                            $('#playerVideoPopup img').css('display', 'inherit');
                        }
                    }
                } else {
                    // return
                    isFullScreen = false;
                    $("#playerVideoPopup").unbind("tap");
                    $("#videoProccessBar").show().removeClass('proccess-bar-full');
                    clearTimeout(showToolbarIimeout);
                    $(childItem).removeClass('glyphicon-resize-small').addClass('glyphicon-fullscreen');
                    $('#videoDetailPopup').removeClass('disable-scroll').addClass('enable-scroll');
                    enableOverScroll($('#videoDetailPopup'));
                    $('#videoPlayerControl').css('height', 'auto');
                    $('#btnBackVideoPlayer').show();
                    myVideoPlayer.jPlayer("option", "size", {
                        width: "" + winWidth + "px",
                        height: "auto"
                    });
                    //$($('#playerVideoPopup').children()).each(function () {
                    //    $(this).css('height', 'auto');
                    //});
                    if (isVideoPlaying) {
                        $('#playerVideoPopup img').css('display', 'none');
                        $('#playerVideoPopup video').css('height', 'auto');
                    } else {
                        if ($('#playerVideoPopup video').height() > 0) {
                            $('#playerVideoPopup img').css('display', 'none');
                        } else {
                            $('#playerVideoPopup img').css('display', 'inline');
                        }
                    }
                }

            });

            $('.btnPlayVideo').unbind('click').bind('click', function () {
                if (!isVideoPlaying) {
                    myVideoPlayer.jPlayer("setMedia", itemVideoPlaying).jPlayer("play");
                } else {
                    myVideoPlayer.jPlayer("play");
                }
            });
        }
    }
}

function hideProgressBar() {
    $('#videoProccessBar').hide();
    isHideControlBar = true;
}

function setVideoPlayer() {
    var selectedFile;
    $.each(qualityPathVideo, function (k, v) {
        if (k == currentVideoQuality) {
            selectedFile = v;
        }
    });
    if (selectedFile) {
        itemVideoPlaying = [];
        itemVideoPlaying[selectedFile.format] = selectedFile.url;
        itemVideoPlaying['title'] = titleVideo;
        itemVideoPlaying['poster'] = imagePathVideo;
        myVideoPlayer.jPlayer("setMedia", itemVideoPlaying);
    }
}

function rotateVideoPlayer() {
    if ($('#videoDetailPopup').css('display') != 'none') {
        if ($('#videoPlayerControl') && $('#videoPlayerControl').length > 0) {
            if (isFullScreen) {
                //$('#videoDetailPopup .proccess-bar').addClass('proccess-bar-full');
                $('#videoPlayerControl').css('height', winHeight);
                myVideoPlayer.jPlayer("option", "size", {
                    width: "" + winWidth + "px",
                    height: "" + winHeight + "px"
                });
                //$($('#playerVideoPopup').children()).each(function () {
                //    $(this).css('height', winHeight);
                //});
                if (isVideoPlaying) {
                    $('#playerVideoPopup img').css('display', 'none');
                    $('#playerVideoPopup video').css('height', winHeight);
                } else {
                    if ($('#playerVideoPopup video').height() > 0) {
                        $('#playerVideoPopup img').css('display', 'none');
                    } else {
                        $('#playerVideoPopup img').css('display', 'inherit');
                    }
                }
            } else {
                //$('#videoDetailPopup .proccess-bar').removeClass('proccess-bar-full');
                $('#videoPlayerControl').css('height', 'auto');
                myVideoPlayer.jPlayer("option", "size", {
                    width: "" + winWidth + "px",
                    height: "auto"
                });
                //$($('#playerVideoPopup').children()).each(function () {
                //    $(this).css('height', 'auto');
                //});
                if (isVideoPlaying) {
                    $('#playerVideoPopup img').css('display', 'none');
                    $('#playerVideoPopup video').css('height', 'auto');
                } else {
                    if ($('#playerVideoPopup video').height() > 0) {
                        $('#playerVideoPopup img').css('display', 'none');
                    } else {
                        $('#playerVideoPopup img').css('display', 'inline');
                    }
                }
            }
        }
    }
}