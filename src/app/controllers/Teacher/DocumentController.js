const documentService = require('../../../services/documentService');
const userService = require('../../../services/userService');
const express = require('express');
const {login} = require('../auth/authController');
const classService = require('../../../services/classService');


class documentController{
    async view(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let classId = req.params.id;
        let classInfo = await classService.getDataById(classId);
        let documentInfo = await documentService.getAllDocumentWithClassId(classId);
        res.render('teacherManageDocument',{documentInfo:documentInfo,classId:classId,userInfo:userInfo,classInfo:classInfo});
    }
    async processCreate(req,res,next){
        let formData = req.body;
        console.log('Thông tin formdata');
        console.log(formData);
        console.log(typeof(formData.documentLink));
        //Thông tin class Id của khóa học
        let classId = req.params.id;
        //Trường hợp cập nhật cả link internet
        if((formData.documentLink.length!=0)&&(formData.assignLink.length!=0)){
             let doc1 = await documentService.addDocumentToClass(classId,formData,formData.documentLink);
             let doc2 = await documentService.addDocumentToClass(classId,formData,formData.assignLink);
        }
        //Trường hợp 1 trong 2 nguồn không được cập nhật
        else{
            if(formData.assignLink.length==0){
                
                let link = formData.documentLink;
                let newDocument = await documentService.addDocumentToClass(classId,formData,link);
            }
            else{
                let link = formData.assignLink;
                let newDocument = await documentService.addDocumentToClass(classId,formData,link);
            }
        }
        let documentInfo = await documentService.getAllDocumentWithClassId(classId);
        res.status(200).json({bla:documentInfo});
    }
    async viewDetail(req,res,next){
        let documentId = req.params.id;
        let detailDocument = await documentService.getDocumentByDocumentId(documentId);
        res.status(200).json({bla:detailDocument});
    }
    async viewDocumentAdmin(req,res,next){
        let classId = req.query.courseId;
        let documentInfo = await documentService.getAllDocumentWithClassId(classId);
        let classInfo = await classService.getDataById(classId);
        if(documentInfo.length!=0){
            for(let index = 0 ; index <documentInfo.length ; index++){
                documentInfo[index].createdAt=documentInfo[index].createdAt.getDate()+"/"+documentInfo[index].createdAt.getMonth()+"/"+documentInfo[index].createdAt.getFullYear()+" "+documentInfo[index].createdAt.getHours()+":"+documentInfo[index].createdAt.getMinutes();
            }
        }
        res.render('adminViewDocument',{documentInfo:documentInfo,classId:classId,classInfo:classInfo})
    }

    async processDelete(req,res,next){
        let classId = req.body.classId;
        console.log('tttfdfdf '+classId);
        let documentId = req.params.id;
        let deleteResult = await documentService.deleteDocumentById(documentId);
        let detailDocument = await documentService.getDocumentByDocumentId(documentId);
        let documentInfo = await documentService.getAllDocumentWithClassId(classId);
        res.status(200).json({bla:documentInfo});
    }
    //[POST] Xử lý việc chỉnh sửa tài liệu phương thức POST
    async processEdit(req,res,next){
        let classId = req.params.id;
        let formData = req.body;
        let documentName = formData.documentName;
        let documentLink = formData.documentLink;
        let documentAuthor = formData.documentAuthor;
        let assignLink = formData.assignLink;
        console.log(formData);
        if(assignLink){
            formData.documentLink = assignLink;
        }
        let resultEdit = await documentService.editDocumentById(formData.documentId,formData);
        let documentInfo = await documentService.getAllDocumentWithClassId(classId);
        res.status(200).json({bla:documentInfo});
    }
}
module.exports = new documentController;