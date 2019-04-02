const db = require('.');
const VnVideoBase = require('./models_mxhvd/vn_video');
const Utils = require('../lib/Utils');
const VnVideo = VnVideoBase(db.sequelize, db.DataTypes);
const VnUserBase = require('../models/models_mxhvd/vn_user');
const VnUser = VnUserBase(db.sequelize, db.DataTypes);

const VnUploadFeedBackBase = require('../models/models_mxhvd/vn_upload_feedback');
const VnUploadFeedBack = VnUploadFeedBackBase(db.sequelize, db.DataTypes);
const Sequelize = require('sequelize');
const vnVideoEnum = require('../services/lib/vnVideoEnum');
const Obj = require('../lib/Obj');
const VnConfigBase = require('../models/config.model');
const params = require('../config/params');
const config = params.configStr;
const VnVideoRecommendBase = require('../models/VnVideoReCommend.model');

VnUser.hasMany(VnVideo, { foreignKey: 'id', as: 'v' });
VnVideo.belongsTo(VnUser, { foreignKey: 'created_by', as: 'u' });

VnVideo.hasMany(VnUploadFeedBack, { foreignKey: 'id', as: 'v' });
VnUploadFeedBack.belongsTo(VnVideo, { foreignKey: 'video_id', as: 'u' });

exports.VnHotKeywordBase = VnVideo;
exports.VnVideo = VnVideo;
// exports.VnUser = VnUser;
const Op = db.sequelize.Op;

const VOD_FILTER = 'VOD_FILTER';
const MUSIC_FILTER = 'MUSIC_FILTER';

exports.getVideoHomePage = async function (limit, isX4 = false) {
    var recommendIds = [];
    let x = isX4 ? 4 : 2;

    let where = {
        id: {
            [Op.notIn]: recommendIds,
        },
        type: vnVideoEnum.TYPE_VOD,
        status: vnVideoEnum.STATUS_APPROVE,
        is_active: vnVideoEnum.ACTIVE,
        is_hot: 1,
        is_no_copyright: 0,
        published_time: {
            [Op.lte]: new Date()
        }
    };

    let query = {
        where: where,
        order: [
            ['published_time', 'DESC']
        ],
        limit: x * limit
    };
    return query;
}
exports.getAllVideo = async function (ids) {
    let query = {
        where: {
            id: ids,
            type: vnVideoEnum.TYPE_VOD,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date()
            }
        },
        attributes: ['vn_video.*'],
        include: {
            model: VnUser, as: 'u',
            attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
        },
        order: Sequelize.literal("FIELD(vn_video.id," + Utils.implode(",", ids) + ")")
    }

    return query;
}
exports.getHotVideoWithOutIds = function (ids, limit = null, offset = null) {
    let query = {
        where: {
            id: {
                $notIn: ids
            },
            type: vnVideoEnum.TYPE_VOD,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date()
            },
            is_hot: 1

        },
        attributes: ['vn_video.*'],
        include: {
            model: VnUser, as: 'u',
            attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
        },
        order: Sequelize.literal("FIELD(vn_video.id," + ids.toString() + ")"),
        limit: limit,
        offset: offset
    }


    return query;
}
getDetail = function (id, type = "", isObject = false, includeDraft = false) {
    return new Promise(function (resolve, reject) {
        let where = {
            id: id,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0
        };

        if (includeDraft) {
            where.status = [vnVideoEnum.STATUS_APPROVE, vnVideoEnum.STATUS_DRAFT, vnVideoEnum.STATUS_DELETE];
        } else {
            where.status = vnVideoEnum.STATUS_APPROVE;
        }

        if (type) {
            where.type = type;
        }

        let query = VnVideo.findOne({
            where: where
        }).then(function (objVideo) {
            if (objVideo != null) {
                resolve(objVideo.dataValues);
            } else {
                resolve(null);
            }

        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    })

}
module.exports.getDetail = getDetail;

exports.getNewVideo = function (filterType = '', limit = 10, offset = 0) {
    return new Promise(async function (resolve, reject) {
        let where = {
            type: vnVideoEnum.TYPE_VOD,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date()
            }
        };
        let filterList = '';
        switch (filterType) {
            case Obj.MUSIC_FILTER:
                // const VnConfigBase = require('../models/config.model');
                filterList = await VnConfigBase.getConfigKey('music.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
            case Obj.VOD_FILTER:
                filterList = await VnConfigBase.getConfigKey('video.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
        }
        VnVideo.findAll({
            where: where,
            attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            },
            order: [
                ['id', 'DESC'],
            ],
            limit: limit,
            offset: offset
        }).then(function (videos) {
            // console.log('new qr 1');
            if (videos.length>0) {
                resolve(videos);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });
}
exports.getRecommendVideo = async function (recommend = 1, limit = null, offset = null) {
    return new Promise(function (resolve, reject) {
        let where = {
            type: vnVideoEnum.TYPE_VOD,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            is_recommend: recommend,
            published_time: {
                [Op.lte]: new Date()
            }
        };
        let query = VnVideo.findAll({
            where: where,
            attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            },
            order: [
                ['published_time', 'DESC'],
            ],
            limit: limit,
            offset: offset
        }).then(function (videos) {
            if (videos != null) {
                // console.log(videos);
                resolve(videos);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });
}

exports.getByIdsQuery = async function (filterType = '', ids, limit = null, offset = null) {

    return new Promise(function (resolve, reject) {
        let where = {
            id: ids,
            type: vnVideoEnum.TYPE_VOD,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date()
            }
        };
        let filterList = '';
        switch (filterType) {
            case Obj.MUSIC_FILTER:
                const VnConfigBase = require('../models/config.model');
                filterList = VnConfigBase.getConfigKey('music.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
            case Obj.VOD_FILTER:
                filterList = VnConfigBase.getConfigKey('video.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
        }

        VnVideo.findAll({
            where: where,
            attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            },
            order: [
                ['published_time', 'DESC'],
            ],
            limit: limit,
            offset: offset
        }).then(function (videos) {
            if (videos != null) {
                console.log(videos);
                resolve(videos);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });
}

exports.getRecommendVideoMixQuery = async function (limit = null, offset = null) {
    let limit40Percent = Math.ceil(limit * 40 / 100);
    let offset40Percent = Math.ceil(offset * 40 / 100);

    let limit30Percent = Math.ceil(limit * 30 / 100);
    let offset30Percent = Math.ceil(offset * 30 / 100);

    let recommend1 = await this.getRecommendVideo(vnVideoEnum.RECOMMEND_DYNAMIC, limit40Percent, offset40Percent);
    let recommend2 = Utils.arrayColumn(await this.getRecommendVideo(vnVideoEnum.RECOMMEND_FIX, limit30Percent, offset30Percent), 'id');
    let recommend3 = Utils.arrayColumn(await VnVideoRecommendBase.getByActiveQuery(limit30Percent, offset30Percent), 'video_id');

    let ids = [];
    for (let i = 0; i < recommend1.lenght; i++) {

        j = i * 3 + 1;

        ids.push(recommend1[i]);
    }

    for (let i = 0; i < recommend1.lenght; i++) {

        j = i * 3 + 2;

        ids.push(recommend2[i]);
    }


    for (let i = 0; i < recommend1.lenght; i++) {

        j = i * 3;

        ids.push(recommend3[i]);
    }

    let idsort = Utils.ksort(ids);
    idsort = Utils.array_slice(idsort, 0, limit);

    return await this.getByIdsQuery(null, ids, limit);

}
exports.getAllVideosByUser = async function (filterType = '', userId, limit, offset, type = 'VOD') {
    return new Promise(function (resolve, reject) {
        let where = {
            type: type,
            status: {
                $in: [vnVideoEnum.STATUS_APPROVE, vnVideoEnum.STATUS_DRAFT, vnVideoEnum.STATUS_DELETE]
            },
            created_by: userId,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date()
            }
        };
        let filterList = '';
        switch (filterType) {
            case Obj.MUSIC_FILTER:
                const VnConfigBase = require('../models/config.model');
                filterList = VnConfigBase.getConfigKey('music.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
            case Obj.VOD_FILTER:
                filterList = VnConfigBase.getConfigKey('video.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
        }

        VnVideo.findAll({
            where: where,
            attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            },
            order: [
                ['published_time', 'DESC'],
            ],
            limit: limit,
            offset: offset
        }).then(function (videos) {
            if (videos != null) {
                console.log(videos);
                resolve(videos);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}


getVideosByUser = function (filterType = '', userId, limit = 10, offset = 0, type = 'VOD') {
    console.log('getVideosByUser')
    return new Promise(async function (resolve, reject) {
        let where = {
            created_by: userId,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            type: type,
            published_time: {
                [Op.lt]: new Date(), // date('Y-m-d H:i:s')
            }
        };
        let checkLimit = true;
        let filterList;
        switch (filterType) {
            case MUSIC_FILTER:
                let cfMusic = await VnConfigBase.getConfigKey('music.category.list');
                filterList = (cfMusic.trim());
                //Neu khong cau hinh the loai thi khong tra ve ket qua
                if (filterList) {
                    where.category_id = filterList.split(',');
                } else {
                    checkLimit = false;
                }
                break;
            case VOD_FILTER:
                let cfVideo = await VnConfigBase.getConfigKey('video.category.list');
                filterList = (cfVideo.trim());
                if (filterList) {
                    where.category_id = filterList.split(',');
                } else {
                    checkLimit = false;
                }
                break;
        }
        //if(checkLimit !== false){
        VnVideo.findAll({
            where: where,
            //attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            }, limit: limit, offset: offset
        }).then(function (vnVideo) {
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(err);
            resolve(false);
        });
    })
}

exports.getVideosByUser = getVideosByUser;

exports.getNewVideoQuery = function (filterType = '', limit = 10, offset = 0) {
    return new Promise(async function (resolve, reject) {
        let where = {
            type: vnVideoEnum.TYPE_VOD,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date()
            }
        };
        let filterList = '';
        switch (filterType) {
            case Obj.MUSIC_FILTER:
                // const VnConfigBase = require('../models/config.model');
                filterList = await VnConfigBase.getConfigKey('music.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
            case Obj.VOD_FILTER:
                filterList = await VnConfigBase.getConfigKey('video.category.list').trim();
                if (Utils.isEmpty(filterList)) {
                    where.category_id = filterList.split(",");
                } else {
                    limit = 0;
                }
                break;
        }
        let querry = {
            where: where,
            attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            },
            order: [
                ['id', 'DESC'],
            ],
            limit: limit,
            offset: offset
        };
        resolve(querry);
    });
}

updateLikeVsDisLikeCount = function (id, like, dislike) {
    return new Promise(function (resolve, reject) {
        VnVideo.update(
            {
                dislike_count: db.sequelize.literal('dislike_count + ' + dislike),
                like_count: db.sequelize.literal('dislike_count + ' + like)
            },
            {
                where: { id: id }
            }
        ).then(function (video) {
            // console.log('getConfig',configs);
            if (video != null) {
                resolve(video);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('updateItem', err);
            resolve(false);
        });
    });
}

exports.updateLikeVsDisLikeCount = updateLikeVsDisLikeCount;

getVideoRelatedQuery = async function (distinctVideo, categoryId, userId, limit, offset = 0, videoTime = null, isFilm = false, video = []) {
    return new Promise(async function (resolve, reject) {
        let maxRelatedVideo = (config.max_related_video) ? config.max_related_video : 50;
        let arrCateVideo = await getVideoIdInCategoryNotContainChannelQuery(categoryId, maxRelatedVideo, 0, videoTime, userId);
        let filmRelated = [];
        if (isFilm) {
            let videoName = video.name;
            let numberInVideoName = videoName.replace("/[^0-9]/", "");
            let videoNameWithoutNumber = videoName.replace("/[0-9]/", "");
            let filmRelated = {
                id: video.id,
                numberInVideoName: numberInVideoName,
                name: videoName
            };

            let searchResults = await searchRelatedVideo(videoNameWithoutNumber);
            let relate = [];
            for (let i = 0; i < searchResults.length; i++) {
                //foreach ($searchResults as $rs) {
                let rs = searchResults[i];
                relate.push({
                    id: rs._source.id,
                    numberInVideoName: rs._source.name.replace("/[^0-9]/", ""), // => preg_replace("/[^0-9]/","",$rs['_source']['name']),
                    name: rs._source.name
                });
            }

            // uasort($relate, function($a,$b){

            //     $rs = $a['numberInVideoName'] - $b['numberInVideoName'];

            //     return $rs;
            // });
            //print_r($relate);die();
        }
        let arrChannelVideo = await getVideoIdInChannelQuery(userId, maxRelatedVideo, 0, videoTime);
        let arrMerger = [];
        let cCate = 0;
        let cUser = 0;

        for (let i = 0; i < arrChannelVideo.length; i++) {
            let cvItem = arrChannelVideo[i];
            if (cvItem.id == distinctVideo) {
                let keyDistinct = i;
                //array_splice(arrChannelVideo, 0, keyDistinct+1);
                arrChannelVideo.splice(0, keyDistinct + 1);
                break;
            }
        }

        //Lay video theo ty le 6:4
        for (let i = 0; i < (arrCateVideo.length + arrChannelVideo.length); i++) {
            if (i % 10 <= 3 && arrChannelVideo.cUser) {
                arrMerger.push(arrChannelVideo.cUser.id);
                cUser++;
            } else {
                arrMerger.push(arrCateVideo.cCate.id);
                cCate++;
            }
        }

        // let arrMerger = array_unique($arrMerger);
        // if (($key = array_search($distinctVideo, $arrMerger)) !== false) {
        //     unset($arrMerger[$key]);
        // }
        let arrSlide = arrMerger.slice(offset, limit); // array_slice($arrMerger, $offset, $limit);
        //shuffle($arrSlide);
        let where = {};
        if (arrSlide) {
            where.id = arrSlide;
            where.type = "VOD";
            where.status = STATUS_APPROVE;
            where.is_active = ACTIVE;
            where.is_no_copyright = 0;
            where.published_time = {
                [Op.lt]: Utils.currentCacheTime() // date('Y-m-d H:i:s')
            };

            VnVideo.findAll({
                where: where,
                limit: limit, offset: offset
            }).then(function (vnVideo) {
                //vnVideo.forEach(function(vi){
                //    console.log(vi.id);
                //})
                resolve(vnVideo);
            }).catch(function (err) {
                console.log(err);
                resolve(false);
            });
        } else {
            resolve([]);
        }
    });
}
module.exports.getVideoRelatedQuery = getVideoRelatedQuery;

getVideoByType = function (arrSlide, type = "VOD") {
    return new Promise(function (resolve, reject) {
        where.id = arrSlide;
        where.type = "VOD";
        where.status = STATUS_APPROVE;
        where.is_active = ACTIVE;
        where.is_no_copyright = 0;
        where.published_time = {
            [Op.lt]: new Date() // date('Y-m-d H:i:s')
        };

        let where = {
            id: arrSlide,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lt]: new Date(), // date('Y-m-d H:i:s')
                [Op.lt]: videoTime, // date('Y-m-d H:i:s')
            },
            created_by: {
                [Op.ne]: notContainChannel
            }
        };

        VnVideo.findAll({
            where: where,
            order: [
                ['published_time', 'DESC'],
            ],
            limit: limit, offset: offset
        }).then(function (vnVideo) {
            //vnVideo.forEach(function(vi){
            //    console.log(vi.id);
            //})
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(err);
            resolve(false);
        });
    })
}

getVideoIdInCategoryNotContainChannelQuery = function (categoryId, limit = 10, offset = 0, videoTime = null, notContainChannel) {
    return new Promise(async function (resolve, reject) {
        let where = {
            category_id: categoryId,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lt]: new Date(), // date('Y-m-d H:i:s')
                [Op.lt]: videoTime, // date('Y-m-d H:i:s')
            },
            created_by: {
                [Op.ne]: notContainChannel
            }
        };

        VnVideo.findAll({
            where: where,
            order: [
                ['published_time', 'DESC'],
            ],
            limit: limit, offset: offset
        }).then(function (vnVideo) {
            //vnVideo.forEach(function(vi){
            //    console.log(vi.id);
            //})
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(err);
            resolve(false);
        });
    })

}

searchRelatedVideo = function (name) {
    return "";
}
module.exports.getVideoIdInCategoryNotContainChannelQuery = getVideoIdInCategoryNotContainChannelQuery;

getVideoIdInChannelQuery = function (userId, limit = 10, offset = 0, videoTime = null) {
    return new Promise(async function (resolve, reject) {
        let where = {
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            published_time: {
                [Op.lt]: new Date(), // date('Y-m-d H:i:s')
                [Op.lt]: videoTime, // date('Y-m-d H:i:s')
            },
            created_by: userId
        };
        VnVideo.findAll({
            where: where,
            order: [
                ['published_time', 'DESC'],
            ],
            limit: limit, offset: offset
        }).then(function (vnVideo) {
            //vnVideo.forEach(function(vi){
            //    console.log(vi.id);
            //})
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(err);
            resolve(false);
        });
    })
}
exports.getVideosByIdsQuery = function (ids, limit = 10, offset = null, type = 'VOD') {
    return new Promise(async function (resolve, reject) {
        let where = {
            id: ids,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            type: type,
            is_no_copyright: 0,
            published_time: {
                [Op.lte]: new Date() // date('Y-m-d H:i:s')
            },
            created_by: userId
        };
        VnVideo.findAll({
            where: where,
            attributes: ['vn_video.*'],
            include: {
                model: VnUser, as: 'u',
                attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
            },
            order: Sequelize.literal("FIELD(vn_video.id," + ids.toString() + ")"),
            limit: limit, offset: offset
        }).then(function (vnVideo) {
            //vnVideo.forEach(function(vi){
            //    console.log(vi.id);
            //})
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(err);
            resolve(false);
        });
    })
}

exports.getVideosByCate = function (cateId, limit = 10, offset = 0, order = 'NEW', isGroupChannel = false) {
    let where = {
        category_id: cateId,
        status: vnVideoEnum.STATUS_APPROVE,
        is_active: vnVideoEnum.ACTIVE,
        is_no_copyright: 0,
        published_time: {
            [Op.lte]: Utils.getCurrentCacheTime() // date('Y-m-d H:i:s')
        },
        type: "VOD"
    }
    if (isGroupChannel) {
        let arrChannelVideo = this.getMaxPublishTime();
    }
    let orderQ = null;
    if (order == "NEW") {
        orderQ = [
            ['published_time', 'DESC'],
        ]
    } else if (order == "MOSTVIEW") {
        orderQ = [
            ['play_times', 'DESC'],
        ]
    } else if (order == "MOSTTRENDING") {
        where.view_time = {
            [Op.lte]: Utils.getCurrentCacheTime(), // date('Y-m-d H:i:s')
            [Op.gte]: Utils.dateSub(false, "7 day"), // date('Y-m-d H:i:s')
        }
        orderQ = [
            ['play_times', 'DESC'],
        ]
    }
    let query = {
        where: where,
        order: orderQ,
        limit: limit,
        offset: offset
    }

    return query;
}
exports.getMaxPublishTime = function () {
    let where = {
        category_id: cateId,
        status: vnVideoEnum.STATUS_APPROVE,
        is_active: vnVideoEnum.ACTIVE,
        is_no_copyright: 0,
        published_time: {
            [Op.lte]: Utils.getCurrentCacheTime() // date('Y-m-d H:i:s')
        },
        published_time: {
            [Op.gte]: new Date() // date('Y-m-d H:i:s')
        },
        type: vnVideoEnum.TYPE_VOD
    }
    let query = {
        where: where,
        // attributes: [['max(published_time)', 'mp'], 'v.created_by'],
        // include: {
        //     model: VnUser, as: 'u',
        // },
        // group: ['created_by'],
        // // order: Sequelize.literal("max(published_time"),
        // limit: limit,
        // offset: offset,
    }
    return this.getVideosFindAllQuery(query, "getMaxPublishTime");
}
exports.getVideoByCategory = function (categoryid = null, type = null, offset = null, limit = null) {

    let where = {
        status: vnVideoEnum.STATUS_APPROVE,
        is_active: vnVideoEnum.ACTIVE,
        is_no_copyright: 0,
        published_time: {
            [Op.lte]: Utils.getCurrentCacheTime() // date('Y-m-d H:i:s')
        },
    };
    if (type != null) {
        where.type = type;
    }
    if (categoryid != null) {
        where.category_id = categoryid;
    }
    let query = {
        where: where,
        attributes: ['vn_video.*'],
        include: {
            model: VnUser, as: 'u',
            attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
        },
        limit: limit,
        offset: offset,
        order: [
            ['published_time', 'DESC'],
        ],

    }
    return this.getVideosFindAllQuery(query, "getVideoByCategory");
}
exports.getVideosByChannel = function (channelId, limit, offset, order = 'NEW') {

    let where = {
        status: vnVideoEnum.STATUS_APPROVE,
        is_active: vnVideoEnum.ACTIVE,
        is_no_copyright: 0,
        published_time: {
            [Op.lte]: Utils.getCurrentCacheTime() // date('Y-m-d H:i:s')
        },
        type: vnVideoEnum.TYPE_VOD,
        created_by: channelId
    };

    if (order == 'NEW') {
        order = [
            ['published_time', 'DESC'],
        ]
    } else if (order == 'MOSTVIEW') {
        order = [
            ['play_times', 'DESC'],
        ];
    }

    let query = {
        where: where,
        attributes: ['vn_video.*'],
        include: {
            model: VnUser, as: 'u',
            attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
        },
        limit: limit,
        offset: offset,
        order: order

    }
    return query;
}

exports.getVideosFindAllQuery = function (query, func = "getVideosFindAllQuery") {
    return new Promise(async function (resolve, reject) {
        query.raw = true;
        console.log(query);
        
        VnVideo.findAll(query).then(function (vnVideo) {
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(func, err);
            resolve(null);
        });
    })
}
