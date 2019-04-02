/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auth_assignment', {
    item_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'auth_item',
        key: 'name'
      }
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'auth_assignment'
  });
};
