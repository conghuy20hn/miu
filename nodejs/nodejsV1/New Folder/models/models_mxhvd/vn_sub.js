/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_sub', {
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
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    package_id: {
      type: DataTypes.INTEGER(5),
      allowNull: false
    },
    sub_service_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      defaultValue: '0'
    },
    fee: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    register_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expired_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cancel_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_charge_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_block: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    }
  }, {
    tableName: 'vn_sub'
  });
};
