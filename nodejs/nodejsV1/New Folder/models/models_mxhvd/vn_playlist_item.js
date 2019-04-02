/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_playlist_item', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    playlist_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    alias: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'vn_playlist_item'
  });
};
