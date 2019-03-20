/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_report_sub', {
    id: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    package_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    package_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active_sub: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    report_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'vn_report_sub'
  });
};
