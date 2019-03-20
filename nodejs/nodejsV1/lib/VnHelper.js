const utils = require('../lib/Utils');
const cdn = require('../lib/CDNService');
const Obj = require('../lib/Obj');

exports.getThumbUrl = function (bucket, path, size, isFullUrl = true, isDemo = false) {
    let sizeDetail = this.getSize(size);

    let pos = utils.strpos(path, '.');

    if (pos !== false) {
        basename = path.substr(0, pos);
        extension = path.substr(pos + 1);
        let thumbName = "";
        if (!utils.isset(sizeDetail.width && !utils.isset(sizeDetail.height))) {
            thumbName = basename + "." + extension;
        } else if (!utils.isset(sizeDetail.width)) {
            thumbName = basename + '_auto_' + sizeDetail.height + '.' + extension;
        } else if (!utils.isset(sizeDetail.height)) {
            thumbName = basename + '_' + sizeDetail.width + '_auto.' + extension;
        } else {
            thumbName = basename + '_' + sizeDetail.width + '_' + sizeDetail.height + '.' + extension;
        }

        if (isDemo) {
            switch (size) {
                case Obj.SIZE_VIDEO:
                    thumbName = basename + '_416_234_ql100.' + extension;
                    break;
                case Obj.SIZE_VIDEO_WEB_HOME:
                    thumbName = basename + '_255_145_ql100.' + extension;
                    break;
            }
        }

        if (isFullUrl) {
            return cdn.generateWebUrl(bucket, thumbName);
        } else {
            return thumbName;
        }
    } else {
        return '';
    }
}
exports.getSize = function (size) {
    switch (size) {
        case Obj.SIZE_BANNER:
            width = 720;
            height = 405;
            break;
        case Obj.IZE_COVER:
            width = 640;
            height = 360;
            break;
        case Obj.SIZE_FILM:
            width = 192;
            height = 285;
            break;
        case Obj.SIZE_AVATAR:
            width = 180;
            height = 180;
            break;
        case Obj.SIZE_VIDEO:
            width = 320;
            height = 180;
            break;
        case Obj.SIZE_VIDEO_WEB_HOME:
            width = 255;
            height = 145;
            break;
        case Obj.SIZE_VIDEO_WAP_HOME:
            width = 375;
            height = 210;
            break;
        case Obj.SIZE_VIDEO_LIST_DETAIL:
            width = 160;
            height = 90;
            break;

        case Obj.SIZE_CHANNEL:
            width = 750;
            height = 220;
            break;
        case Obj.SIZE_CHANNEL2:
            width = 1080;
            height = 180;
            break;
        case Obj.SIZE_CHANNEL3:
            width = 420;
            height = 70;
            break;
        case Obj.SIZE_CHANNEL_LOGO_LIST:
            width = 32;
            height = 32;
            break;
        case Obj.SIZE_CHANNEL_LOGO_DETAIL:
            width = 80;
            height = 80;
            break;

        case Obj.SIZE_CATEGORY:
            width = 949;
            height = 157;
            break;

        default:
            width = null;
            height = null;
    }

    return {
        width: width,
        height: height
    }
}
exports.getThumbAnimationImg = function getThumbAnimationImg(bucket, path, size) {
    let sizeDetail = [];
    if (size == Obj.SIZE_VIDEO) {
        sizeDetail.width = 350;
        sizeDetail.height = 210;
    } else {
        sizeDetail.width = 255;
        sizeDetail.height = 145;
    }

    pos = utils.strrpos(path, '.');

    if (pos !== false) {
        basename = path.substr(0, pos);
        extension = "webp";

        if (!utils.isset(sizeDetail.width) && !utils.isset(sizeDetail.height)) {
            thumbName = basename + '.' + extension;
        } else if (!utils.isset(sizeDetail.width)) {
            thumbName = basename + '_auto_' + sizeDetail.height + '.' + extension;
        } else if (!utils.isset(sizeDetail.height)) {
            thumbName = basename + '_' + sizeDetail.width + '_auto.' + extension;
        } else {
            thumbName = basename + '_' + sizeDetail.width + 'x' + sizeDetail.height + '.' + extension;
        }

        return cdn.generateWebUrl(bucket, thumbName);
    }
}