/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    Host: {
      type: DataTypes.CHAR(60),
      allowNull: false,
      defaultValue: '',
      primaryKey: true
    },
    User: {
      type: DataTypes.CHAR(80),
      allowNull: false,
      defaultValue: '',
      primaryKey: true
    },
    Password: {
      type: DataTypes.CHAR(41),
      allowNull: false,
      defaultValue: ''
    },
    Select_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Insert_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Update_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Delete_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Create_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Drop_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Reload_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Shutdown_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Process_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    File_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Grant_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    References_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Index_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Alter_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Show_db_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Super_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Create_tmp_table_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Lock_tables_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Execute_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Repl_slave_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Repl_client_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Create_view_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Show_view_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Create_routine_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Alter_routine_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Create_user_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Event_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Trigger_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    Create_tablespace_priv: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    ssl_type: {
      type: DataTypes.ENUM('','ANY','X509','SPECIFIED'),
      allowNull: false,
      defaultValue: ''
    },
    ssl_cipher: {
      type: "BLOB",
      allowNull: false
    },
    x509_issuer: {
      type: "BLOB",
      allowNull: false
    },
    x509_subject: {
      type: "BLOB",
      allowNull: false
    },
    max_questions: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    max_updates: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    max_connections: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    max_user_connections: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    plugin: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      defaultValue: ''
    },
    authentication_string: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password_expired: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    is_role: {
      type: DataTypes.ENUM('N','Y'),
      allowNull: false,
      defaultValue: 'N'
    },
    default_role: {
      type: DataTypes.CHAR(80),
      allowNull: false,
      defaultValue: ''
    },
    max_statement_time: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.000000'
    }
  }, {
    tableName: 'user'
  });
};
