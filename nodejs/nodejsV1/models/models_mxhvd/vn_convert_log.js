/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_convert_log', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      primaryKey: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    s_get_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    s_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    s_put_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    c_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    m_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    m_get_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    m_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    m_put_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    },
    s_get_rate: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0'
    },
    s_put_rate: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0'
    },
    m_get_rate: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0'
    },
    m_put_rate: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'vn_convert_log'
  });
};
