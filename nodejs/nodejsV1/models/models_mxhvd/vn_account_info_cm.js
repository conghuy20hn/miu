/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_account_info_cm', {
    id: {
      type: DataTypes.INTEGER(13),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    id_card_number: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    id_card_created_at: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    id_card_created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    },
    is_confirm: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '0'
    },
    id_card_image_frontside: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_card_image_backside: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    msisdn: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(2000),
      allowNull: true
    }
  }, {
    tableName: 'vn_account_info_cm'
  });
};
