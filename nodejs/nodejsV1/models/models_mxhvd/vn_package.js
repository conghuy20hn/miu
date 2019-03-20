/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_package', {
    id: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sub_service_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    short_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    group_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    fee: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    charge_range: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    package_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    is_display_frontend: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    cp_data_percentage: {
      type: "DOUBLE(20,4)",
      allowNull: true
    },
    is_block_check: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    quota_views: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    distribution_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    multilang: {
      type: DataTypes.STRING(4000),
      allowNull: true
    }
  }, {
    tableName: 'vn_package'
  });
};
