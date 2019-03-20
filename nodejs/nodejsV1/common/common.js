const numeral = require('numeral');

function convertPlayTimes(number){
    return numeral(number).format('0a');
}

async function mergeById(array1, array2, key, limit = null) {
  let keyExists = [];
  let result = [];
  array1.map(arr => {
    result.push(arr);
    keyExists.push(arr.dataValues[key]);
  });

  array2.map(arr => {
    if (keyExists.indexOf(arr.dataValues[key]) === -1) {
      result.push(arr);
    }
  });

  if (limit) {
    return result.slice(0,limit);
  } else {
    return result;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function uidGenerator() {
  let num1 = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  let num2 = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  let num3 = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  let num4 = (((1+Math.random())*0x10000)|0).toString(16).substring(1);

  return num1+num2+num3+num4;
}

function generateUniqueFileName(ext){
  return `${uidGenerator()}${ext}`
}

function generatePath() {
  let date = new Date();
  let now = date.getTime()+getRandomInt(0,999);
  let day = date.getDay();
  let month = date.getMonth();
  let year = date.getFullYear();

  return `${year}/${month}/${day}/${now}/`;
}

module.exports = {
  mergeById,
  getRandomInt,
  uidGenerator,
  generateUniqueFileName,
  generatePath,
  convertPlayTimes
};