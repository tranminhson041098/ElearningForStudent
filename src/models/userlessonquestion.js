'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLessonQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * 
     */
    static associate(models) {
      // define association here
      UserLessonQuestion.belongsTo(models.User,{foreignKey:'userId'});
      UserLessonQuestion.belongsTo(models.LessonQuestion,{foreignKey:'lessonQuestionId'})
    }
  };
  UserLessonQuestion.init({
    userId: DataTypes.INTEGER,
    lessonQuestionId : DataTypes.INTEGER,
    result: DataTypes.INTEGER,
    choosenAnswer : DataTypes.STRING
   
  }, {
    sequelize,
    modelName: 'UserLessonQuestion',
  });
  return UserLessonQuestion;
};