'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LessonQuestion.belongsTo(models.Lesson,{foreignKey:'lessonId',as:'lesson'});
      LessonQuestion.belongsTo(models.LessonTest,{foreignKey:'lessonTestId',as:'lessontesta'});
      LessonQuestion.belongsToMany(models.User,{through:'UserLessonQuestions',foreignKey:'lessonQuestionId',as:'userbbvb'});
    }
  };
  LessonQuestion.init({
    questionContent: DataTypes.STRING,
    optionA: DataTypes.STRING,
    optionB: DataTypes.STRING,
    optionC: DataTypes.STRING,
    optionD: DataTypes.STRING,
    rightAnswer: DataTypes.STRING,
    lessonId: DataTypes.INTEGER,
    lessonTestId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LessonQuestion',

  });
  return LessonQuestion;
};