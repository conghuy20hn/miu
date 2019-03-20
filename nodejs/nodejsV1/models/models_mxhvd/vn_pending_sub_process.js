/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_pending_sub_process', {
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
    sub_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    package_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    send_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vn_pending_sub_process'
  });
};
