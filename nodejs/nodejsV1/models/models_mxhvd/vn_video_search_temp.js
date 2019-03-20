/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_video_search_temp', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    name_search: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'vn_video_search_temp'
  });
};
