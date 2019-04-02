/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('my_video_log', {
    _id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    current_time: {
      type: "DOUBLE",
      allowNull: true
    },
    duration_buffer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    duration_watching: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msisdn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pause_times: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    video_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    wait_times: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msisdn_videoid_date: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'my_video_log'
  });
};
