const { check } = require('express-validator/check');

let [minName, maxName] = [5,50];
let [minDescription, maxDescription] = [5,255];

exports.validateCreate = [
  check('name').isLength({ min: minName, max: maxName }).withMessage(`Vui lòng nhập tên từ ${minName} đến ${maxName} ký tự`).trim(),
  check('description').custom( description => {
    return new Promise((resolve, reject) => {
      if (description && (description.length > maxDescription || description.length < minDescription)) {
        return reject(new Error(`Vui lòng nhập mô tả từ ${minDescription} đến ${maxDescription} ký tự`))
      }else{
        return resolve();
      }
    });
  }),
];

exports.validateUpdate = [
  check('id').not().isEmpty().withMessage('Không tìm thấy thông tin').trim(),
  check('name').isLength({ min: minName, max: maxName }).withMessage(`Vui lòng nhập tên từ ${minName} đến ${maxName} ký tự`).trim(),
  check('description').custom( description => {
    return new Promise((resolve, reject) => {
      if (description && (description.length > maxDescription || description.length < minDescription)) {
        return reject(new Error(`Vui lòng nhập mô tả từ ${minDescription} đến ${maxDescription} ký tự`))
      }else{
        return resolve();
      }
    });
  }),
];

exports.validateDelete = [
  check('id').not().isEmpty().withMessage('Không tìm thấy thông tin').trim(),
];

exports.validateToggleAddVideo = [
  check('id').not().isEmpty().withMessage('Không tìm thấy thông tin playlist').trim(),
  check('video_id').not().isEmpty().withMessage('Không tìm thấy thông tin video').trim(),
];