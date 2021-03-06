/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_group_category', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    positions: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    play_times: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    play_times_real: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    avatar_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar_bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    multilang: {
      type: DataTypes.STRING(4000),
      allowNull: true
    }
  }, {
    tableName: 'vn_group_category'
  });
};
