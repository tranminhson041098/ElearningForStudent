'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.Class,{as:'classes'});
      Course.belongsTo(models.Category,{foreignKey:'categoryId',as:'categorybb'});
      Course.belongsToMany(models.User,{through:'UserCourses',foreignKey:'courseId',as:'usera'});
    }
  };
  Course.init({
    courseName: DataTypes.STRING,
    courseStatus: DataTypes.STRING,
    categoryId : DataTypes.INTEGER,
    courseDescription : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};