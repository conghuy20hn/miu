/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_user_upload', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    local_path: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    server_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    retry_times: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    published_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vn_user_upload'
  });
};
