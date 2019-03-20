/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_sms_mo_his', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    command: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    param: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    channel: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    receive_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'vn_sms_mo_his'
  });
};
