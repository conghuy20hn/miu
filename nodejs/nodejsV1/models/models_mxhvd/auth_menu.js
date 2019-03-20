/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auth_menu', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    parent: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'auth_menu',
        key: 'id'
      }
    },
    route: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1'
    },
    multilang: {
      type: DataTypes.STRING(4000),
      allowNull: true
    }
  }, {
    tableName: 'auth_menu'
  });
};
