/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_process', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    process_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    process_id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    process_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    timeout: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lastId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    last_time: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'vn_process'
  });
};
