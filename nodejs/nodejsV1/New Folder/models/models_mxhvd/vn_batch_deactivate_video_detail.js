/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_batch_deactivate_video_detail', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    request_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    video_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cp_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'vn_batch_deactivate_video_detail'
  });
};
