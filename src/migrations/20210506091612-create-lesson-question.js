'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LessonQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questionContent: {
        type: Sequelize.STRING
      },
      optionA: {
        type: Sequelize.STRING
      },
      optionB: {
        type: Sequelize.STRING
      },
      optionC: {
        type: Sequelize.STRING
      },
      optionD: {
        type: Sequelize.STRING
      },
      rightAnswer: {
        type: Sequelize.STRING
      },
      lessonId:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references :{
          model:'Lessons',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LessonQuestions');
  }
};