/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auth_rule', {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'auth_rule'
  });
};
