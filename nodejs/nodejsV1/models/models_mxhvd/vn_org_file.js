/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_org_file', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    progress: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    bucket: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mime: {
      type: DataTypes.STRING(63),
      allowNull: true
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    dimensions: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    conversion_times: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
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
      allowNull: true,
      references: {
        model: 'sf_guard_user',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'sf_guard_user',
        key: 'id'
      }
    },
    duration: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '0'
    },
    checksum: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'vn_org_file'
  });
};
