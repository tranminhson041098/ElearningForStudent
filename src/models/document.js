'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Document.belongsTo(models.Class,{foreignKey:'classId',as:'classbbva'});
    }
  };
  Document.init({
    documentLink: DataTypes.STRING,
    documentName:DataTypes.STRING,
    classId: DataTypes.INTEGER,
    documentAuthor:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};