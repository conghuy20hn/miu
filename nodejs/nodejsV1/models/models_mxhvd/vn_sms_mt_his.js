/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_sms_mt_his', {
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
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mo_his_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sent_time: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    receive_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    channel: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    process_id: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'vn_sms_mt_his'
  });
};
