const {Class} =require('../models/index');
let {UserClass}= require('../models/index');
let {Document} = require('../models/index');
class documentService{
    async getAllDocumentWithClassId(classId){
        let documentInfo = [];
        let documentResult = await Document.findAll({
            where:{classId:classId}
        });
        if(documentResult){
            documentResult.forEach(element => {
                documentInfo.push(element.get());
            });
            return documentInfo;
        }
        else{
            return [];
        }
    }
    async getDocumentByDocumentId(documentId){
        let documentResult = await Document.findOne({
            where:{id:documentId}
        });
        if(documentResult){
            return documentResult.get();
        }
        else{
            return "Không có tài liệu trong DB";
        }
    }
    async addDocumentToClass(classId,formData,link){
        let newDocument = await Document.create({
            documentLink:link,
            classId:classId,
            documentName:formData.documentName,
            documentAuthor : formData.documentAuthor
         }).then((newDocument)=>{
             console.log('Thông tin về tài liệu mới');
             console.log(newDocument.get());
         }).catch((err)=>{
             console.log('there is problem in model')
         })
         return "Add Document successfully";
    }
    async deleteDocumentById(documentId){
        let deletedDocument = await Document.destroy({
            where:{id:documentId}
        });
        return "Xóa tài liệu thành công"
    }
    async editDocumentById(documentId,formData){
        let editedDocument = await Document.findOne({
            where:{id:documentId}
        });
        editedDocument.documentName = formData.documentName;
        editedDocument.documentLink = formData.documentLink;
        editedDocument.documentAuthor = formData.documentAuthor;
        await editedDocument.save();
        return "Edit Successfully";
    }
}
module.exports = new documentService;