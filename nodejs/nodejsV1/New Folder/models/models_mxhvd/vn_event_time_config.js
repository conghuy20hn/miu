/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_event_time_config', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    from_date: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    to_date: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    month: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    week: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'vn_event_time_config'
  });
};
