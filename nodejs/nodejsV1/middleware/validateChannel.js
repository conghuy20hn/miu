const { check, body } = require('express-validator/check');

let [minName, maxName] = [5,50];
let [minDescription, maxDescription] = [5,255];

exports.validateAddRelated = [
  check('channel_related_id').not().isEmpty().withMessage('Kênh không tồn tại').trim(),
];

exports.validateGetRelated = [
  check('channel_id').not().isEmpty().withMessage('Vui lòng chọn kênh').trim(),
];

exports.validateGetDetail = [
  check('id').not().isEmpty().withMessage('Vui lòng chọn kênh').trim(),
];

exports.validateUpdate = [
  body('name')
    .not().isEmpty().withMessage('Quý khách vui lòng nhập tên')
    .isLength({ min: minName, max: maxName })
    .withMessage(`Quý khách vui lòng nhập tên từ ${minName} đến ${maxName} ký tự`).trim(),
  body('description')
    .not().isEmpty().withMessage('Quý khách vui lòng nhập mô tả')
    .isLength({ min: minDescription, max: maxDescription })
    .withMessage(`Quý khách vui lòng nhập mô tả từ ${minDescription} đến ${maxDescription} ký tự`).trim(),
];