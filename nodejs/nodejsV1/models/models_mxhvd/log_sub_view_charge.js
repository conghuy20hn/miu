/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_sub_view_charge', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    msisdn: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    video_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sub_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    package_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cp_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    package_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    first_charge: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cp_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    other_info: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    error_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    log_sub_view_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'log_sub_view_charge'
  });
};
