'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LessonTest.belongsTo(models.Lesson,{foreignKey:'lessonId',as:'lessonucl'});
      LessonTest.hasMany(models.LessonQuestion,{as:'lessonquestionf'});
      LessonTest.belongsToMany(models.User,{through:'UserLessonTests',foreignKey:'lessonTestId',as:'sta'});
    }
  };
  LessonTest.init({
    lessonTestName: DataTypes.STRING,
    lessonId: DataTypes.INTEGER,
    time: DataTypes.INTEGER,
    testStatus:DataTypes.STRING,
    numberOfQuestions:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LessonTest',
  });
  return LessonTest;
};