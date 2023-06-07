'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
      allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      allcode.hasMany(models.schedule, { foreignKey: 'timeType', as: 'timeTypeData' })

      allcode.hasMany(models.doctor_infor, { foreignKey: 'priceId', as: 'priceTypeData' })
      allcode.hasMany(models.doctor_infor, { foreignKey: 'provinceId', as: 'provinceTypeData' })
      allcode.hasMany(models.doctor_infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })
      allcode.hasMany(models.booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })

    }
  };
  allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'allcode',
  });
  return allcode;
};