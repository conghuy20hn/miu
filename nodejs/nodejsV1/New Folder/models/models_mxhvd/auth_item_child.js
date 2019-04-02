/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auth_item_child', {
    parent: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'auth_item',
        key: 'name'
      }
    },
    child: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'auth_item',
        key: 'name'
      }
    }
  }, {
    tableName: 'auth_item_child'
  });
};
