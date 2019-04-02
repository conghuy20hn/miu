/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_user_topic', {
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
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    topic_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'vn_user_topic'
  });
};
