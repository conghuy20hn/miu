/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_video_hot_category', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    video_ids: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'vn_video_hot_category'
  });
};
