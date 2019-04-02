/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_playlist', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
      defaultValue: '0'
    },
    category_id: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    // attributes: {
    //   type: DataTypes.INTEGER(6),
    //   allowNull: true
    // },
    price_play: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    priority: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    approved_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_recommend: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    like_count: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    play_times: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    name_slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description_slug: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    syn_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    suggest_package_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    multilang: {
      type: DataTypes.STRING(4000),
      allowNull: true
    }
  }, {
    tableName: 'vn_playlist'
  });
};
