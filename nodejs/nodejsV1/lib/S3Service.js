const params = require('../config/params');
const config = params.configStr;
const VnHelper = require('../lib/VnHelper');
const utils = require('../lib/Utils');

module.exports = {
    SUCCESS: 0,
    UNSUCCESS: 1,
    VODCDN: 'VODCDN',
    OBJCDN: 'OBJCDN',

    generateStreamURL(video, type = VODCDN, freeData = true) {
    	return new Promise(function(resolve, reject){
    		if (!video){
    			resolve(false);
    		}else{
    			let mapping;
		        if (freeData) {
		            mapping = config.cdn_mapping_freeData;
		        } else {
		            mapping = config.cdn_mapping_lostData;
		        }

		        let bucketName;
		        let path;
		        let encryptPath;
		        let encryptString;
		        let ip;

		        if (!video.file_bucket) {
		            bucketName = video.bucket;
		            // let path = video.bucket . '/' . ltrim($video['path'], '/');
		            path = video.bucket + '/' .video.path;
		        } else {
		            bucketName = video.file_bucket;
		            path = video.file_bucket + '.'+video.file_path; // . '/' . ltrim($video['file_path'], '/');
		        }

		        let expiredTime = new Date() + config.s3_vodcdn_timeout; //strtotime('now') + Yii::$app->params['s3']['vodcdn.timeout'];

		        if (config.s3_vodcdn_encrypt) {

		            if (config.s3_vodcdn_encryptWithIp) {
		                ip = VnHelper.getAgentIp();
		            } else {
		                ip = '';
		            }
		            if (path.endsWith('.m3u8')) { //Cat bo filename trong truong hop generate link re-stream HLS
		                encryptPath = path; // dirname(path);
		            } else {
		                encryptPath = path;
		            }

		            encryptString = ip +config.s3_vodcdn_tokenKey + ':' +expiredTime + ':/' +encryptPath + expiredTime + '/' + path;
		            // let encryptString = md5(ip +config.s3_vodcdn_tokenKey + ':' +expiredTime + ':/' +encryptPath) + expiredTime + '/' + path;
		        } else {
		            encryptString = path;
		        }

		        // $args = array(
		        //     '%domain_name%' => $mapping[$bucketName][$type],
		        //     '%encrypt_string%' => $encryptString,
		        // );

		        // $url = strtr(Yii::$app->params['s3']['vodcdn.template'][$type], $args);
		        // Yii::info('{STREAMING} ' . $url, 'streaming');
				let url = encryptString;
		        resolve(url);
	    	}
    	})        
    }
}