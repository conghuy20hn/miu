/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('black_list', {
    device_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'black_list'
  });
};
