const userService = require('../../../services/userService');
const express = require('express');
const {login} = require('../auth/authController');
const classService = require('../../../services/classService');
const lessonService = require('../../../services/lessonService');
const lessonTestService = require('../../../services/lessonTestService');
const lessonQuestionService = require('../../../services/lessonQuestionService');

class teacherController{
    // [GET] login admin
    async index(req,res,next){
        
        if(req.jwtDecoded){
            // res.locals.Token= req.cookies.Token;
            // // res.render('adminHome');
            // res.redirect('/admin/home');
            next();
        }
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
            
             res.render('teacherLogin');
        }
    }
    //[POST] login admin
    async processLogin(req,res,next){
        const formData = req.body;

        console.log('Thông tin formData :')
        console.log(formData);
        
        const checkValue = await userService.index(formData);
        if(checkValue===false){
            //Đã có user như trên trong hệ thống'
            const checkPassword = await userService.checkPassword(formData);
            const idUser = await userService.getIdUser(formData);
            const candidateUser = await userService.checkUserCredentials(formData);

            console.log('Thông tin candidate user');
            console.log(candidateUser);
            // console.log('Thong tun check password:');
            // console.log(checkPassword);

            if (checkPassword){
                //su dung candidateuser de tao ma
                if(candidateUser.roleName=='teacher'){
                    
                    const userToken = await login(candidateUser);
                    //Lưu refresh token vào csdl
                    const abc = await userService.addRefreshToken(formData,userToken.refreshToken);
                    res.cookie('iduser',idUser);
                    res.cookie('Token',userToken);
                    // res.redirect(`/home/${idUser}`);
                    // res.redirect('/use/home')
                    res.redirect('/teacher/home');
                    // res.send('Trrang POST Login sau khi được xử lý');
                }
                else{
                    res.render('teacherLogin',{warning:'Sai mật khẩu hoặc email'})
                }
            }
            else{
                res.render('teacherLogin',{warning:'Sai mật khẩu hoặc email'})
            }
        }
        else{
            res.render('teacherLogin',{warning:'Sai mật khẩu hoặc email'})
        }

    }
    async home(req,res,next){
        if(!req.cookies.Token){
            res.render('teacherLogin')
        }
        if(req.userToken3){
             let userId = req.cookies.iduser;
             let userInfo = await userService.getUserInfoById(userId);
             res.cookie('Token',req.userToken3);
             res.render('teacherHome',{userInfo:userInfo});
        }
        else{
             let userId = req.cookies.iduser;
             let userInfo = await userService.getUserInfoById(userId);
             res.render('teacherHome',{userInfo:userInfo});
        }
        // res.send('Đây là home trang chủ GET')
    }
    async processHome(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        res.render('teacherHome',{userInfo:userInfo});
    }
    async getAllStudentFromCourse(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let classId = req.params.id;
        let dataClass = await classService.getDataById(classId);
        //Lấy danh sách học sinh tham gia khóa học
        let idInfoSet = await classService.getUserFromClass(classId);
        //console.log("thông tin id info set là:")
        let listOfUser = await userService.getUserFromClass(idInfoSet);
        console.log("thông tin list of user");
        if(listOfUser.length!==0){
            for (let m = 0 ; m<listOfUser.length;m++){
                listOfUser[m].classId = classId;
            }
        }
        console.log(listOfUser);
        res.render('teacherDetailCourse',{dataClass:dataClass,listOfUser:listOfUser,classId:classId,userInfo:userInfo});
    }
    async viewAllLessonOfCourse(req,res,next){
        let userId2 = req.cookies.iduser;
        let teacherInfo = await userService.getUserInfoById(userId2);
        let userId = req.query.userValue;
        let userInfo = await userService.getUserInfoById(userId);
        let classId = req.query.classId;
        let allLesson = await lessonService.getAllLessonByClassId(classId);
        if(allLesson.length!==0){
            for (let m =0 ;m <allLesson.length;m++){
                allLesson[m].userId = userId;
            }
        }
        res.render('teacherDetailLesson',{allLesson:allLesson,userInfo:userInfo,teacherInfo:teacherInfo})
    }
    async viewDetailResultLessonExam(req,res,next){
        let userId2 = req.query.userId;
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let lessonId = req.params.id;
        let userInfo2 = await userService.getUserInfoById(userId2);
        let historyIdInfo = [];
        //Lấy id test từ lessonId
        let lessonTestIdInfo = await lessonTestService.getAllTestIdByLessonId(lessonId);
        if(lessonTestIdInfo.length>1){
            for(let i =1 ; i<lessonTestIdInfo.length ; i++){
                historyIdInfo.push(lessonTestIdInfo[i]);
            }
        }
        let resultInfo = await lessonTestService.getTestResultByTestId(userId,historyIdInfo);
        // console.log('Thông tin result Info là : ');
        // console.log(resultInfo);
        res.render('teacherHistoryScore',{resultInfo:resultInfo,userInfo2:userInfo2,lessonName:lessonTestIdInfo[0],userInfo:userInfo})
    }
    async viewFalseQuestionByTeacher(req,res,next){
        let teacherInfo = await userService.getUserInfoById(req.cookies.iduser);
        let userId = req.query.userId;
        let lessonId = req.params.id;

        let falseQuestionInfo = [];
        let userInfo = await userService.getUserInfoById(userId);
        let lessonQuestionIdInfo = await lessonQuestionService.getAllQuestionIdByLessonId(lessonId);
        if(lessonQuestionIdInfo.length>1){
            for (let j =1 ; j<lessonQuestionIdInfo.length ; j++){
                falseQuestionInfo.push(lessonQuestionIdInfo[j]);
            }
        }
        let resultFalseQuestion = await lessonQuestionService.getFalseQuestion(userId,falseQuestionInfo);
        if(resultFalseQuestion.length!==0){
            for (let m = 0 ; m<resultFalseQuestion.length;m++){
                let questionInfo = await lessonQuestionService.getDetailQuestion(resultFalseQuestion[m].lessonQuestionId);
                resultFalseQuestion[m].moreInfo = questionInfo;
            }
        }

        res.render('teacherFalseQuestion',{resultFalseQuestion:resultFalseQuestion,userInfo:userInfo,teacherInfo:teacherInfo});
    }
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
        
        res.render('teacherProfile',{userInfo:userInfo,province:province,district:district,detailAddress:detailAddress});

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
        res.render('teacherProfile',{userInfo:userInfo,province:province,district:district,detailAddress:detailAddress,notification:'Success'});
    }

    async logout(req,res,next){
        //Logout experiment
        const deletedRefreshToken = await userService.deleteRefreshToken(req.cookies.iduser,req.cookies.Token.refreshToken);
        res.clearCookie('Token');
        res.clearCookie('iduser');
        res.render('teacherLogin');
        // res.redirect('admin/login');
    }
    
}
module.exports = new teacherController;