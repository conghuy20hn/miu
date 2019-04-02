/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_profile_detail', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    profile_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    pro_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pro_value: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'vn_profile_detail'
  });
};
