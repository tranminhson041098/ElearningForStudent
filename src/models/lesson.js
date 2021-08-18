'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lesson.belongsTo(models.Class,{foreignKey:'classId',as:'class'});
      Lesson.hasMany(models.LessonQuestion,{as:'lessonquestions'})
      Lesson.hasMany(models.LessonTest,{as:'lessontests'})
    }
  };
  Lesson.init({
    lessonName: DataTypes.STRING,
    classId: DataTypes.INTEGER,
    linkVideo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};