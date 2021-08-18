'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LessonTests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lessonTestName: {
        type: Sequelize.STRING
      },
      lessonId: {
        allowNull:false,
        type:Sequelize.INTEGER,
        references :{
          model:'Lessons',
          key:'id'
        }
      },
      testStatus:Sequelize.STRING,
      time: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('LessonTests');
  }
};