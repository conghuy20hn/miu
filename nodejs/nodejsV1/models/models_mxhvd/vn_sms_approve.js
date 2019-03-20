/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_sms_approve', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sms_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    sms_content: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    sms_content_draft: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approve_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vn_sms_approve'
  });
};
