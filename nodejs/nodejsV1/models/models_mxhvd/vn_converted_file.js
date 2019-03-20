/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_converted_file', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    video_id: {
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
    profile_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    encrypted_path: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    is_migrated: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_downloaded: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    file_size_real: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'vn_converted_file'
  });
};
