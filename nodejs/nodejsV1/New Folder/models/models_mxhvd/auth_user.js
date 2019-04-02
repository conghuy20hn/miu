/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auth_user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    auth_key: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '10'
    },
    created_at: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    updated_at: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    num_login_fail: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    last_time_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_first_login: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '1'
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cp_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'auth_user'
  });
};
