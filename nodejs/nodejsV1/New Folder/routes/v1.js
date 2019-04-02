const express = require('express');
const router = express.Router();

const DefaultController = require('../controllers/default.controller');
const UserController = require('../controllers/user.controller');
const HomeController = require('../controllers/home.controller');
const PlaylistController = require('../controllers/playlist.controller');
const ValidatePlaylist = require('../middleware/validatePlaylist');

const ChannelController = require('../controllers/channel.controller');
const ValidateChannel = require('../middleware/validateChannel');
const VideoController	= require('../controllers/video.controller');

const passport = require('passport');
const path = require('path');

const maxSizeImageUpload = 1024 * 1024 * 5;
const extensionUploadImage = ['.jpg', '.jpeg', '.png', '.gif'];
const uploadImageChannel = require('../middleware/uploadFile')(maxSizeImageUpload, extensionUploadImage);

require('./../middleware/passport')(passport)
router.get('/', function (req, res, next) {
  res.json({ status: "success", message: "Parcel Pending API", data: { "version_number": "v1.0.0" } })
});
//dungld route
router.route('/common/get-home').get(DefaultController.getHome);
router.route('/common/get-setting').get(DefaultController.getSetting);
router.route('/common/list-package').get(DefaultController.getListPackage);
router.route('/common/search').get(DefaultController.search);
router.route('/common/search-suggestion').get(DefaultController.searchSuggestion);
router.route('/common/get-keywords').get(DefaultController.getKeywords);
router.route('/common/toggle-like-comment').post(DefaultController.toggleLikeComment);
router.route('/common/post-comment').post(DefaultController.postComment);

router.route('/common/feed-back').post(DefaultController.feedBack);
router.route('/common/get-home-web').get(DefaultController.getHomeWeb);
router.route('/common/get-list-comment').get(DefaultController.getListComment);
router.route('/common/get-more-content').get(DefaultController.getMoreContent);
router.route('/common/get-film').get(DefaultController.getFilm);

router.route('/auth/authorize').post(UserController.authorize);
router.route('/auth/get-captcha').get(UserController.getCaptcha);
router.route('/auth/logout').post(UserController.logout);
router.route('/auth/push-otp').post(UserController.createdOpt);
router.route('/auth/change-password').post(UserController.changePassword);
router.route('/auth/sign-up-by-msisdn').post(UserController.sign);


// router.post('/users/login', UserController.login);
// router.get('/dash', passport.authenticate('jwt', {session: false}), HomeController.Dashboard)

/***************** PLAYLIST ***************************/
router.post('/playlist/create', ValidatePlaylist.validateCreate, PlaylistController.create);

router.post('/playlist/update', ValidatePlaylist.validateUpdate, PlaylistController.update);

router.post('/playlist/delete', ValidatePlaylist.validateDelete, PlaylistController.delete);

router.post('/playlist/toggle-add-video', ValidatePlaylist.validateToggleAddVideo, PlaylistController.toggleAddVideo);

router.post('/playlist/toggle-like', ValidatePlaylist.validateDelete, PlaylistController.toggleLikePlaylist);

router.get('/playlist/get-detail', PlaylistController.getDetail);

/***************** CHANNEL ***************************/
router.post('/channel/add-related', ValidateChannel.validateAddRelated, ChannelController.addChannelRelated);

router.post('/channel/delete-related', ValidateChannel.validateAddRelated, ChannelController.removeChannelRelated);

router.post('/channel/update', uploadImageChannel.fields(
  [
    { name: 'file_avatar', maxCount: 1 },
    { name: 'file_banner', maxCount: 1 }
  ]
), ChannelController.update);

router.get('/channel/get-related', ValidateChannel.validateGetRelated, ChannelController.getChannelRelated);

router.get('/channel/get-recommend', ChannelController.getChannelRecommend);

router.get('/channel/get-detail', ValidateChannel.validateGetDetail, ChannelController.getDetail);

/* huync2 video */
router.post('/video/toggle-watch-later', VideoController.actionToggleWatchLater);
//router.post('/video/get-trending-video', VideoController.)
router.post('/video/get-friends', VideoController.actionGetFriendsVideo);
router.post('/video/get-new', VideoController.actionGetNewVideo);
router.post('/video/get-stream', VideoController.actionGetVideoStream);
router.post('/video/toggle-like', VideoController.actionToggleLikeVideo);
router.post('/video/get-relation', VideoController.actionToggleLikeVideo);
router.post('/video/toggle-like', VideoController.actionToggleLikeVideo);
// router.post('/video/download-video', VideoController.actionDownloadVideo);
router.post('/video/related-box', VideoController.actionRelatedVideoBox);
/* huync2 video */

//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
