require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || '103.7.43.26';
CONFIG.db_port      = process.env.DB_PORT       || '8306';
CONFIG.db_name      = process.env.DB_NAME       || 'vn_video';
CONFIG.db_user      = process.env.DB_USER       || 'mxhvideo';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'Abc@1234';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

CONFIG.elasticsearch_host = 'http://localhost:9810/myvideo_v/_search';

module.exports = CONFIG;
