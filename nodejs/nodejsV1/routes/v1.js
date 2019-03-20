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
router.route('/default/get-home').get(DefaultController.getHome);
router.route('/default/get-setting').get(DefaultController.getSetting);
router.route('/default/list-package').get(DefaultController.getListPackage);
router.route('/default/search').get(DefaultController.search);
router.route('/default/search-suggestion').get(DefaultController.searchSuggestion);
router.route('/default/get-keywords').get(DefaultController.getKeywords);
router.route('/default/toggle-like-comment').post(DefaultController.toggleLikeComment);
router.route('/default/post-comment').post(DefaultController.postComment);

router.route('/default/feed-back').post(DefaultController.feedBack);
router.route('/default/get-home-web').get(DefaultController.getHomeWeb);
router.route('/default/get-list-comment').get(DefaultController.getListComment);
router.route('/default/get-more-content').get(DefaultController.getMoreContent);
router.route('/default/get-film').get(DefaultController.getFilm);

// router.post('/users/login', UserController.login);
// router.get('/dash', passport.authenticate('jwt', {session: false}), HomeController.Dashboard)

/***************** PLAYLIST ***************************/
router.post('/playlist/create', ValidatePlaylist.validateCreate, PlaylistController.create);

router.post('/playlist/update', ValidatePlaylist.validateUpdate, PlaylistController.update);

router.post('/playlist/delete', ValidatePlaylist.validateDelete, PlaylistController.delete);

router.post('/playlist/toggle-add-video', ValidatePlaylist.validateToggleAddVideo, PlaylistController.toggleAddVideo);

router.post('/playlist/toggle-like-playlist', ValidatePlaylist.validateDelete, PlaylistController.toggleLikePlaylist);

router.get('/playlist/get-detail', PlaylistController.getDetail);

/***************** CHANNEL ***************************/
router.post('/channel/add-channel-related', ValidateChannel.validateAddRelated, ChannelController.addChannelRelated);

router.post('/channel/remove-channel-related', ValidateChannel.validateAddRelated, ChannelController.removeChannelRelated);

router.post('/channel/update', uploadImageChannel.fields(
  [
    { name: 'file_avatar', maxCount: 1 },
    { name: 'file_banner', maxCount: 1 }
  ]
), ChannelController.update);

router.get('/channel/get-channel-related', ValidateChannel.validateGetRelated, ChannelController.getChannelRelated);

router.get('/channel/get-channel-recommend', ChannelController.getChannelRecommend);

router.get('/channel/get-detail', ValidateChannel.validateGetDetail, ChannelController.getDetail);

/* huync2 video */
router.post('/video/toggle-watch-later', VideoController.actionToggleWatchLater);
//router.post('/video/get-trending-video', VideoController.)
router.post('/video/get-friends-video', VideoController.actionGetFriendsVideo);
router.post('/video/get-new-video', VideoController.actionGetNewVideo);
router.post('/video/get-video-stream', VideoController.actionGetVideoStream);
router.post('/video/toggle-like-video', VideoController.actionToggleLikeVideo);
router.post('/video/get-relation', VideoController.actionToggleLikeVideo);
router.post('/video/toggle-like-video', VideoController.actionToggleLikeVideo);
router.post('/video/download-video', VideoController.actionDownloadVideo);
router.post('/video/related-video-box', VideoController.actionRelatedVideoBox);
/* huync2 video */

//********* API DOCUMENTATION **********
// router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
// router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
