'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Course,{through:'UserCourses',foreignKey:'userId',as:'coursena'});
      User.belongsToMany(models.Class,{through:'UserClasses',foreignKey:'userId',as:'classa'});
      User.belongsToMany(models.LessonQuestion,{through:'UserLessonQuestions',foreignKey:'userId',as:'questionbbva'});
      User.belongsToMany(models.LessonTest,{through:'UserLessonTests',foreignKey:'userId',as:'stb'});
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    roleName: DataTypes.STRING,
    blockStatus: DataTypes.STRING,
    refreshToken : DataTypes.STRING,
    telephone: DataTypes.STRING,
    knowledge : DataTypes.STRING,
    experience : DataTypes.STRING,
    linkImg : DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};