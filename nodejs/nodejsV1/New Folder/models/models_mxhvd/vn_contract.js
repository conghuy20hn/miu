/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vn_contract', {
    id: {
      type: DataTypes.INTEGER(13),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    contract_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    bucket: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_card_image_frontside: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_card_image_backside: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    msisdn: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    payment_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tax_code: {
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
    account_number: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bank_department: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    },
    msisdn_pay: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      defaultValue: '0'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER(13),
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    sync_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vn_contract'
  });
};
