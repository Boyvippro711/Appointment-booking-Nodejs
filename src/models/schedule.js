'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      schedule.belongsTo(models.allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' })
      schedule.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' })

    }
  };
  schedule.init({
    doctorId: DataTypes.INTEGER,
    currentNumber: DataTypes.STRING,
    maxNumber: DataTypes.STRING,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'schedule',
  });
  return schedule;
};