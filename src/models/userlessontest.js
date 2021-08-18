'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLessonTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserLessonTest.belongsTo(models.User,{foreignKey:'userId'});
      UserLessonTest.belongsTo(models.LessonTest,{foreignKey:'lessonTestId'})
    }
  };
  UserLessonTest.init({
    userId: DataTypes.INTEGER,
    lessonTestId: DataTypes.INTEGER,
    result: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserLessonTest',
  });
  return UserLessonTest;
};