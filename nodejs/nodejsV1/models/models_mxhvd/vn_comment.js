/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_comment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ''
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    bad_word_filter: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: ''
    },
    approve_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: ''
    },
    like_count: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comment_count: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'vn_comment'
  });
};
