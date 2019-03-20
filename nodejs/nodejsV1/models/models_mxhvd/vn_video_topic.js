/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_video_topic', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    topic_id: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    }
  }, {
    tableName: 'vn_video_topic'
  });
};
