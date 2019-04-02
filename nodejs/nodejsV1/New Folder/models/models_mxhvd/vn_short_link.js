/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_short_link', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    short_link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    route: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    params: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    full_link: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    other_info: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'vn_short_link'
  });
};
