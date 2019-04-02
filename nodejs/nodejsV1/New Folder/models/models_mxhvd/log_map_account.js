/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_map_account', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id_source: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    msisdn_source: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    msisdn_target: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    user_id_target: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'log_map_account'
  });
};
