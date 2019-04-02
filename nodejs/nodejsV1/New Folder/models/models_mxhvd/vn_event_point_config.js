/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_event_point_config', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    point: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    max_per_day: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    max_per_week: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    max_per_month: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    max_per_campaign: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'vn_event_point_config'
  });
};
