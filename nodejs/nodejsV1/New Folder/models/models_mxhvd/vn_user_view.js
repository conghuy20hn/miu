/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_user_view', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    first_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vn_user_view'
  });
};
