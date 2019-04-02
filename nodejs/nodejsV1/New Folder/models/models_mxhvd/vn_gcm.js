/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_gcm', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    register_id: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '0'
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'vn_gcm'
  });
};
