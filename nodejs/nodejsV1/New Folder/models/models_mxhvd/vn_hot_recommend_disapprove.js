/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_hot_recommend_disapprove', {
    id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    video_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    hot_reason: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    recommend_reason: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    receiver_id: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    }
  }, {
    tableName: 'vn_hot_recommend_disapprove'
  });
};
