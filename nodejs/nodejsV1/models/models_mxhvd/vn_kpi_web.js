/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_kpi_web', {
    datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avg_request: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total_request: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    threshold_request: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'vn_kpi_web'
  });
};
