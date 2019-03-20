/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_slideshow', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    position: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '0'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    href: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    begin_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
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
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'vn_slideshow'
  });
};
