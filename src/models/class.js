'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.belongsTo(models.Course,{foreignKey:'courseId',as:'course'});
      Class.hasMany(models.Lesson,{as:'lessons'});
      Class.hasMany(models.Document,{as:'documents'});
      Class.belongsToMany(models.User,{through:'UserClasses',foreignKey:'classId',as:'userb'});
     
    }
  };
  Class.init({
    className: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
    classStatus : DataTypes.STRING,
    dayStart:DataTypes.DATEONLY,
    dayEnd:DataTypes.DATEONLY,
    classAvatarImg : DataTypes.STRING,
    classDescription : DataTypes.STRING,
    classPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};