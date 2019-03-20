const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require('path');
const common = require('../common/common');



module.exports = (maxSize, validExtension) => {
  maxSize = maxSize || (1024 * 1024 * 5);
  validExtension = validExtension || null;

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = './uploads/'+common.generatePath();
      mkdirp(path, function (err) {
        if(err) {
          console.log('mkdirp upload file error: '+err);
          cb(new Error('Cập nhật thông tin thất bại'), path);
        }else
          cb(null, path)
      });

    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      cb(null, common.generateUniqueFileName(ext))
    }
  });

  const fileFilter = (req, file, cb) => {
    if(validExtension) {
      let ext = path.extname(file.originalname);
      if (validExtension.indexOf(ext) !== -1) {
        cb(null, true)
      } else {
        cb(new Error('Định dạng ảnh upload không đúng'), false)
      }
    }else{
      cb(null, true)
    }
  };

  return multer({
    storage: storage,
    limits:{
      fileSize: maxSize
    },
    fileFilter: fileFilter
  });
};