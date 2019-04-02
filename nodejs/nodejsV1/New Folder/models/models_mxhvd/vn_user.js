/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_user', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    msisdn: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    oauth_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    follow_count: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    otp: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    changed_password: {
      type: DataTypes.INTEGER(1),
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
    video_count: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    is_show_suggest: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    channel_bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    channel_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_notification: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    full_name_slug: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description_slug: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    is_hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    priority: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    view_count: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    google_oauth_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cp_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'vn_user'
  });
};
