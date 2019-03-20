/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_award', {
    id: {
      type: DataTypes.INTEGER(13),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    award_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    award_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'vn_award'
  });
};
