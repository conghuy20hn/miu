/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_channel_related', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    channel_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    channel_related_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'vn_channel_related'
  });
};
