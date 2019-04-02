/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_user_token', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    token_expired_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    imei: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login_type: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  }, {
    tableName: 'vn_user_token'
  });
};
