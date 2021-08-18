const userService = require('../../../services/userService');
const express = require('express');
const {login} = require('../auth/authController');
const path = require("path");
const fs = require("fs");
const multer = require('multer');
const { isObject } = require('util');
const courseService = require('../../../services/courseService');
const categoryService = require('../../../services/categoryService');
const classService = require('../../../services/classService');

class AdminController{
    // [GET] login admin
    async index(req,res,next){
        
        
        if(req.jwtDecoded){
            // res.locals.Token= req.cookies.Token;
            // // res.render('adminHome');
            // res.redirect('/admin/home');
            next();
        }
        //Vẫn đang fix hỗ trợ đăng nhập
        else{
            if(req.decodedjwt){
                const refreshToken = req.cookies.Token.refreshToken;
                const checkValidateToken = await userService.testValidateRefreshToken(req.decodedjwt.data,refreshToken);
                
                if(checkValidateToken){
                    
                    //generate token moi truyen vao request
                    const userToken2 = await login(req.decodedjwt.data);
                    
                    req.refreshToken=refreshToken;
                    req.userToken2=userToken2.accessToken;
                    req.userToken3={
                        accessToken:req.userToken2,
                        refreshToken:refreshToken
                    }
                    next();
                }
                else{
                    res.send('Kiem tra token sai haha');
                }
    
            }
            else{
                    res.render('login');
             
            }
        }
        
    }
    //Use for both teacher and admin
    //[GET] View user profile
    async viewProfileByUserId(req,res,next){
        let userId = req.params.id;
        let userInfo = await userService.getUserInfoById(userId);
        if(userInfo.address){
            try {
                
             userInfo.address = JSON.parse(userInfo.address);
            } catch (error) {
                userInfo.address = userInfo.address
            }
        }
        res.render('viewProfileBoth',{userInfo:userInfo});
    }

    //[POST] login admin
    async processLogin(req,res,next){
        const formData = req.body;
        const checkValue = await userService.index(formData);
        if(checkValue===false){
            //Đã có user như trên trong hệ thống'
            const checkPassword = await userService.checkPassword(formData);
            const idUser = await userService.getIdUser(formData);
            const candidateUser = await userService.checkUserCredentials(formData);

            // console.log('Thong tun check password:');
            // console.log(checkPassword);

            if (checkPassword){
                //su dung candidateuser de tao ma
                if(candidateUser.roleName=='admin'){
                        
                    const userToken = await login(candidateUser);

                    //Lưu refresh token vào csdl
                    const abc = await userService.addRefreshToken(formData,userToken.refreshToken);
                    res.cookie('iduser',idUser);
                    res.cookie('Token',userToken);
                    // res.redirect(`/home/${idUser}`);
                    res.redirect('/admin/home')
                    // res.send('Trang POST Login sau khi được xử lý');
                }
                else{
                    res.render('login',{warning:'Sai mật khẩu hoặc email'})
                }
            }
            else{
                res.render('login',{warning:'Sai mật khẩu hoặc email'})
            }
        }
        else{
            res.render('login',{warning:'Sai mật khẩu hoặc email'})
        }
    }
    //[GET] Home for Admin
    home(req,res,next){
        if(!req.cookies.Token){
            res.render('login')
        }
        if(req.userToken3){
            
             res.cookie('Token',req.userToken3);
             res.render('adminHome')
        }
        else{
            
            res.render('adminHome');
        }
        // res.send('Đây là home trang chủ GET')
    }
    //[POST] Home for Admin
    processHome(req,res,next){
        res.render('adminHome');
    }
    async logout(req,res,next){
        //Logout experiment
        const deletedRefreshToken = await userService.deleteRefreshToken(req.cookies.iduser,req.cookies.Token.refreshToken);
        res.clearCookie('Token');
        res.clearCookie('iduser');
        
        res.render('login');
        // res.redirect('admin/login');
    }
    //[GET] Profile page
    async getProfile(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let province='';
        let district='';
        let detailAddress='';
        let iduser = req.cookies.iduser;
        if(userInfo.address)
        {
            let address = JSON.parse(userInfo.address);
            
            province = address.province;
            district = address.district;
            detailAddress = address.detailAddress
        }
        
        res.render('profile',{userInfo:userInfo,province:province,district:district,detailAddress:detailAddress});
    }
    async processProfile(req,res,next){
        console.log('chạy vào hàm cập nhật');
        let formData = req.body;
        let userId = req.cookies.iduser;
        console.log(formData);
        let province = formData.province;
        let district = formData.district;
        let detailAddress = formData.detailAddress;
        if((province)&&(district)&&(detailAddress)){
            formData.address = {
                province:province,
                district:district,
                detailAddress:detailAddress
            }
        }
        let changeDataResult = await userService.changeUserInfoById(userId,formData);

        let userInfo = await userService.getUserInfoById(userId);
        
        if(userInfo.address)
        {
            let address = JSON.parse(userInfo.address);
            province = address.province;
            district = address.district;
            detailAddress = address.detailAddress
        }
        res.render('profile',{userInfo:userInfo,province:province,district:district,detailAddress:detailAddress,notification:'Success'});
    }

    //[GET] Manage Teachers Account
    async manageTeachersAccount(req,res,next){
        
        let dataTeacher = await userService.showAllTeacherInSystem(); 
        res.render('adminManageTeachers',{dataTeacher:dataTeacher})
    }
    //[GET] Manage Teachers Account // CREATE
    async createTeacherAccount(req,res,next){
        let allCourse = await courseService.getAllCourse();
        res.render('adminCreateTeacherAccount',{allCourse:allCourse});
    }
    //[POST] Process create teacher Account
    async processCreateTeacherAccount(req,res,next){
        let formData = req.body;
        let password = formData.psw;
        let passwordSecond = formData.passwordSecond;
        let email = formData.email;
        let name = formData.name;
        let allCourse = await courseService.getAllCourse();
        if(password!==passwordSecond||formData.subjectName==''||email==''||name==''){
            res.render('adminCreateTeacherAccount',{warning:'warning',allCourse:allCourse});
        }
        else{
            let passwordEncrypted = await userService.hashPassword(formData);
            formData.psw = passwordEncrypted;
            let newTeacher = await userService.addTeacher(formData);
            let subjectName = formData.subjectName;
            if(subjectName.length!=0){
                for(let i = 0 ; i < subjectName.length ; i++){
                    await courseService.addUserToCourse(newTeacher.id,subjectName[i]);
                }
            }
            
            res.render('adminCreateTeacherAccount',{notification:'success',allCourse:allCourse});
        }
    }
     //[GET] Manage Students Active Account
    async manageStudentsAccount(req,res,next){
        let allStudentInfo = await userService.getAllStudentActive();
        res.render('adminManageStudents',{allStudentInfo:allStudentInfo});
    }
    //[GET] Manage Students Block Account
    async manageStudentBlockAccount(req,res,next){
        let allStudentInfo = await userService.getAllStudentBlock();
        res.render('adminManageBlockStudents',{allStudentInfo:allStudentInfo});
    }
    //[POST] Process for block student
    async processBlockStudent(req,res,next){
        let userId = req.params.id;
        let blockStudent = await userService.changeToBlockStatus(userId);
        let allStudentInfo = await userService.getAllStudentActive();
        res.status(200).json({bla:allStudentInfo});
    }
    //[POST] Process for unblock student
    async processUnblockStudent(req,res,next){
        let userId = req.params.id;
        let activeStudent = await userService.changeToActiveStatus(userId);
        let allStudentInfo = await userService.getAllStudentBlock();
        res.status(200).json({bla:allStudentInfo});
    }
    //[GET] Manage new register
    async manageNewregister(req,res,next){
        //Yêu cầu lấy tất cả khóa học ở trạng thái Onprocessing
        let dataOnProcessingClass = await classService.getAllClassOnProcessing();
        let dataInvoice = []
        for(let j = 0; j<dataOnProcessingClass.length;j++){
            let invoiceElement = {};
            invoiceElement.idInvoice = dataOnProcessingClass[j].id;
            let foundUser = await userService.getUserInfoById(dataOnProcessingClass[j].userId);
            let foundClass = await classService.getDataById(dataOnProcessingClass[j].classId);
            invoiceElement.className=foundClass.className;
            invoiceElement.email= foundUser.email;
            invoiceElement.userId = foundUser.id;
            invoiceElement.classId = foundClass.id;
            if(foundUser.birthday){
                 invoiceElement.birthday = await classService.formatDate(foundUser.birthday);
            }
            if(foundUser.address){
                console.log('chạy vào 1');
                invoiceElement.address = JSON.parse(foundUser.address)
            }
            else{
                console.log('chạy vào 2');
                invoiceElement.address=foundUser.address;
            }
            invoiceElement.classPrice=foundClass.classPrice;
            console.log('Thông tin invoice');
            console.log(invoiceElement);
            dataInvoice.push(invoiceElement);
        }
        console.log('Thông tin data invoice');
        //console.log(dataInvoice);
        let allCourse = await courseService.getAllCourse();
        res.render('adminNewregister',{allCourse:allCourse,dataInvoice:dataInvoice,waitingNumber:dataOnProcessingClass.length});
    }

    //[GET] Manage Notification
    manageNotifications(req,res,next){
        res.send('Đây là trang manage notification')
    }
    

    
}
module.exports = new AdminController;