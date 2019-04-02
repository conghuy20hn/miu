/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_promotion_winner', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'vn_promotion_winner'
  });
};
