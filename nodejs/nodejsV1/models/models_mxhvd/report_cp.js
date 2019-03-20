/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('report_cp', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    datetime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cp_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    package_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    new_package_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total_view_sub_cp: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    total_view_sub: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    total_view_fee: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    revenue_sub: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    revenue_renew: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    revenue_fee: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    view_sub_first_charge_cp: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    view_sub_renew_cp: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    total_view_sub_first_charge: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    total_view_sub_renew: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'report_cp'
  });
};
