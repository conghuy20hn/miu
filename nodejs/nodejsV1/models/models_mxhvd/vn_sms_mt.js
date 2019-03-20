/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_sms_mt', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mo_his_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receive_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    channel: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    process_id: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    process_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    retry: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'vn_sms_mt'
  });
};
