'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      markdown.belongsTo(models.User, {foreignKey: 'doctorId'})
    }
  };
  markdown.init({
    doctorId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    contentHTML: DataTypes.TEXT('LONG'),
    contentMarkdown: DataTypes.TEXT('LONG'),
    description: DataTypes.TEXT('LONG'),

  }, {
    sequelize,
    modelName: 'markdown',
  });
  return markdown;
};