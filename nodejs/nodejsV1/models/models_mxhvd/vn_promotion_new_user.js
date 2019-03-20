/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_promotion_new_user', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    msisdn: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    sub_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    package_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_send_first_mt: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_sent_after_10_day: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_sent_after_20_day: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_sent_before_3_day_expire: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    send_first_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sent_10_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sent_20_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sent_before_3_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vn_promotion_new_user'
  });
};
