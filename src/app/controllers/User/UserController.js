const userService = require('../../../services/userService');
const classService = require('../../../services/classService');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {login} = require('../auth/authController');
const lessonService = require('../../../services/lessonService');
const courseService = require('../../../services/courseService');
const categoryService = require('../../../services/categoryService');
const lessonTestService = require('../../../services/lessonTestService');
let geographyVietnam = require('../../../enums/geography');
let subjects = require('../../../enums/subjects');
let documentService = require('../../../services/documentService');

//Tất cả vị trí render userHome để hiện thị khóa học thì ta tạm thời tìm ByName , sau này sẽ chèn hàm tìm theo Id
//vào sau


class UserController{
    //[GET] main screen when access port 3000
    async main(req,res,next){
        // res.render('index',{layout:'backend'});
        if(!req.cookies.Token){
            console.log('Case1');
            //Load ra thêm chủ đề cho trang index
            const allCategory = await categoryService.getAllCategoryFilter();
             //Thử nghiệm trong th ít dữ liệu
             let dataClassOne = await classService.getAllClassByCourseId(subjects[0]);
             //Thử nghiệm trong th ít dữ liệu
             let dataClassTwo = await classService.getAllClassByCourseId(subjects[1]);
             //Thử nghiệm trong th ít dữ liệu
             let dataClassThree = await classService.getAllClassByCourseId(subjects[2]);

             let courseDataOne = await courseService.getCourseById2(subjects[0]);
              let courseDataTwo = await courseService.getCourseById2(subjects[1]);
              let courseDataThree = await courseService.getCourseById2(subjects[2]);
            for(let j =0 ; j<dataClassOne.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassOne[j].id);
                dataClassOne[j].infoTeacher = infoTeacher;
            }
            for(let j =0 ; j<dataClassTwo.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassTwo[j].id);
                dataClassTwo[j].infoTeacher = infoTeacher;
            }
            for(let j =0 ; j<dataClassThree.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassThree[j].id);
                dataClassThree[j].infoTeacher = infoTeacher;
            }

            res.render('index',{layout:'backend',allCategory:allCategory,dataClassOne:dataClassOne,dataClassTwo:dataClassTwo,dataClassThree:dataClassThree,courseDataOne:courseDataOne,courseDataTwo:courseDataTwo,courseDataThree:courseDataThree});
        }
        else{
            if(req.userToken3){
                console.log('Case2');
                const allCategory = await categoryService.getAllCategoryFilter();
                
                
                //Thử nghiệm trong th ít dữ liệu
                let dataClassOne = await classService.getAllClassByCourseIdSecond(subjects[0]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassTwo = await classService.getAllClassByCourseIdSecond(subjects[1]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassThree = await classService.getAllClassByCourseIdSecond(subjects[2]);

                let courseDataOne = await courseService.getCourseById2(subjects[0]);
                 let courseDataTwo = await courseService.getCourseById2(subjects[1]);
                 let courseDataThree = await courseService.getCourseById2(subjects[2]);

                for(let j =0 ; j<dataClassOne.length ; j++){
                    let infoTeacher = await classService.getTeacherInfoByClassId(dataClassOne[j].id);
                    dataClassOne[j].infoTeacher = infoTeacher;
                }
                for(let j =0 ; j<dataClassTwo.length ; j++){
                    let infoTeacher = await classService.getTeacherInfoByClassId(dataClassTwo[j].id);
                    dataClassTwo[j].infoTeacher = infoTeacher;
                }
                for(let j =0 ; j<dataClassThree.length ; j++){
                    let infoTeacher = await classService.getTeacherInfoByClassId(dataClassThree[j].id);
                    dataClassThree[j].infoTeacher = infoTeacher;
                }
    
                console.log('thông tin userToken3')
                console.log(req.userToken3);
                res.cookie('Token',req.userToken3);
                res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory,dataClassTwo:dataClassTwo,dataClassThree:dataClassThree,courseDataOne:courseDataOne,courseDataTwo:courseDataTwo,courseDataThree:courseDataThree});
           }
           else{
               //Trường hợp ko phải trả về token3
                console.log('Case3');
                //Thử nghiệm load userInfo;
                let userId = req.cookies.iduser;
                let userInfo = await userService.getUserInfoById(userId);
                const allCategory = await categoryService.getAllCategoryFilter();
                console.log(allCategory);
                let dataClassOne = await classService.getAllClassByCourseIdSecond(subjects[0]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassTwo = await classService.getAllClassByCourseIdSecond(subjects[1]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassThree = await classService.getAllClassByCourseIdSecond(subjects[2]);
                
                let courseDataOne = await courseService.getCourseById2(subjects[0]);
                let courseDataTwo = await courseService.getCourseById2(subjects[1]);
                let courseDataThree = await courseService.getCourseById2(subjects[2]);
                for(let j =0 ; j<dataClassOne.length ; j++){
                    let infoTeacher = await classService.getTeacherInfoByClassId(dataClassOne[j].id);
                    dataClassOne[j].infoTeacher = infoTeacher;
                }
                for(let j =0 ; j<dataClassTwo.length ; j++){
                    let infoTeacher = await classService.getTeacherInfoByClassId(dataClassTwo[j].id);
                    dataClassTwo[j].infoTeacher = infoTeacher;
                }
                for(let j =0 ; j<dataClassThree.length ; j++){
                    let infoTeacher = await classService.getTeacherInfoByClassId(dataClassThree[j].id);
                    dataClassThree[j].infoTeacher = infoTeacher;
                }
    
                res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory,dataClassTwo:dataClassTwo,dataClassThree:dataClassThree,userInfo:userInfo,courseDataOne:courseDataOne,courseDataTwo:courseDataTwo,courseDataThree:courseDataThree});
           }
        }
        
    }

    // [GET] login admin
    
    async index(req,res,next){
        // console.log('Thong tin jwt decoded');
        // console.log(req.jwtDecoded);
        if(req.jwtDecoded){
            // res.locals.Token= req.cookies.Token;
            // // res.render('adminHome');
            // res.redirect('/admin/home');
            next();
        }
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
                    res.send('Hệ thống Kiểm tra Xác thực có lỗi');
                }
    
            }
            else{
                res.render('userLogin',{layout:'backend'});
            }
        }
        
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
                if(candidateUser.roleName=='user'){
                    
                    const userToken = await login(candidateUser);
                    //Lưu refresh token vào csdl
                    const abc = await userService.addRefreshToken(formData,userToken.refreshToken);

                    res.cookie('iduser',idUser);
                    res.cookie('Token',userToken);
                    // res.redirect(`/home/${idUser}`);
                    res.redirect('/user/home')
                    // res.send('Trang POST Login sau khi được xử lý');
                }
                else{
                    //Trường hợp đúng tài khoản nhưng không được quyền truy cập trên hệ thống
                    res.render('userLogin',{layout:'backend',warning2:'warning2'})
                }
            }
            else{
                //Trường hợp nhập mật khẩu sai
                res.render('userLogin',{layout:'backend',warning:'warning'})
            }
        }
        else{
            //Trường hợp chưa có người dùng trên hệ thống hoặc tài khoản đã bị chặn
            res.render('userLogin',{layout:'backend',warning:'warning'});
        }

    }
    //[GET] Home page for user
    async home(req,res,next){
        if(!req.cookies.Token){
            res.render('userLogin',{layout:'backend'});
        }
        if(req.userToken3){
            
             let allCategory = await categoryService.getAllCategoryFilter();
             //chỉ đang thử nghiệm trong trường hợp course có id = 1 do có ít dữ liệu
             let dataClassOne = await classService.getAllClassByCourseIdSecond(subjects[0]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassTwo = await classService.getAllClassByCourseIdSecond(subjects[1]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassThree = await classService.getAllClassByCourseIdSecond(subjects[2]);

                let courseDataOne = await courseService.getCourseById2(subjects[0]);
                let courseDataTwo = await courseService.getCourseById2(subjects[1]);
                let courseDataThree = await courseService.getCourseById2(subjects[2]);
             res.cookie('Token',req.userToken3);
             console.log('usertoken3 phía dưới');
             console.log(req.userToken3);
             for(let j =0 ; j<dataClassOne.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassOne[j].id);
                dataClassOne[j].infoTeacher = infoTeacher;
            }
            for(let j =0 ; j<dataClassTwo.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassTwo[j].id);
                dataClassTwo[j].infoTeacher = infoTeacher;
            }
            for(let j =0 ; j<dataClassThree.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassThree[j].id);
                dataClassThree[j].infoTeacher = infoTeacher;
            }

             res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory,dataClassTwo:dataClassTwo,dataClassThree:dataClassThree,courseDataOne:courseDataOne,courseDataTwo:courseDataTwo,courseDataThree:courseDataThree});
        }
        else{
            let allCategory = await categoryService.getAllCategoryFilter();
            
            
                //Thử nghiệm load userInfo;
                let userId = req.cookies.iduser;
                let userInfo = await userService.getUserInfoById(userId);
                let dataClassOne = await classService.getAllClassByCourseIdSecond(subjects[0]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassTwo = await classService.getAllClassByCourseIdSecond(subjects[1]);
                //Thử nghiệm trong th ít dữ liệu
                let dataClassThree = await classService.getAllClassByCourseIdSecond(subjects[2]);
                let courseDataOne = await courseService.getCourseById2(subjects[0]);
                let courseDataTwo = await courseService.getCourseById2(subjects[1]);
                let courseDataThree = await courseService.getCourseById2(subjects[2]);
            for(let j =0 ; j<dataClassOne.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassOne[j].id);
                dataClassOne[j].infoTeacher = infoTeacher;
            }
            for(let j =0 ; j<dataClassTwo.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassTwo[j].id);
                dataClassTwo[j].infoTeacher = infoTeacher;
            }
            for(let j =0 ; j<dataClassThree.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClassThree[j].id);
                dataClassThree[j].infoTeacher = infoTeacher;
            }

            res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory,dataClassTwo:dataClassTwo,dataClassThree:dataClassThree,userInfo:userInfo,courseDataThree:courseDataThree,courseDataTwo:courseDataTwo,courseDataOne:courseDataOne});
        }
        // res.send('Đây là home trang chủ GET')
    }
    //[POST] Home page for user
    async processHome(req,res,next){
        let allCategory = await categoryService.getAllCategory();
        let dataClassOne = await classService.getAllClassByCourseIdSecond(subjects[0]);
                //Thử nghiệm trong th ít dữ liệu
        let dataClassTwo = await classService.getAllClassByCourseIdSecond(subjects[1]);
                //Thử nghiệm trong th ít dữ liệu
        let dataClassThree = await classService.getAllClassByCourseIdSecond(subjects[2]);

        let courseDataOne = await courseService.getCourseById2(subjects[0]);
        let courseDataTwo = await courseService.getCourseById2(subjects[1]);
        let courseDataThree = await courseService.getCourseById2(subjects[2]);

        for(let j =0 ; j<dataClassOne.length ; j++){
            let infoTeacher = await classService.getTeacherInfoByClassId(dataClassOne[j].id);
            dataClassOne[j].infoTeacher = infoTeacher;
        }
        for(let j =0 ; j<dataClassTwo.length ; j++){
            let infoTeacher = await classService.getTeacherInfoByClassId(dataClassTwo[j].id);
            dataClassTwo[j].infoTeacher = infoTeacher;
        }
        for(let j =0 ; j<dataClassThree.length ; j++){
            let infoTeacher = await classService.getTeacherInfoByClassId(dataClassThree[j].id);
            dataClassThree[j].infoTeacher = infoTeacher;
        }

        res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory,dataClassTwo:dataClassTwo,dataClassThree:dataClassThree,courseDataOne:courseDataOne,courseDataTwo:courseDataTwo,courseDataThree:courseDataThree});
    }
    async logout(req,res,next){
        //Logout experiment
        //Logout experiment
        const deletedRefreshToken = await userService.deleteRefreshToken(req.cookies.iduser,req.cookies.Token.refreshToken);
        res.clearCookie('Token');
        res.clearCookie('iduser');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('userLogin',{layout:'backend'});
        // res.redirect('admin/login');
    }
    //[GET] Register page for user
    register(req,res,next){
        res.render('userRegister',{layout:'backend'});
    }
    //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

    async processRegister(req,res,next){
        //Phần toast hiển thị ra thông báo đăng nhập thành công hay không sẽ xử lý sau
        const formData = req.body;
        let checkValidateRegister = await userService.checkValidateRegister(formData);
        if(checkValidateRegister){
            let password = await userService.hashPassword(formData);
            //thêm password đã được hash vào database
            formData.password = password;
            let newUser = await userService.addUser(formData);
            
            // res.send('This is POST for Register page ')
            res.render('userLogin',{layout:'backend',notification:'success'});
        }
        else{
            //Mẫu đăng kí chưa hợp lệ
            // res.render('userRegister');

            res.render('userRegister',{layout:'backend',warning:'Không hợp lệ'});
        }
    }
    //Lấy trang chi tiết lớp học khi chưa đăng kí
    async getNotRegisterCourseDetailPage(req,res,next){
                
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let idClass = req.params.id;
        let dataClassp = await classService.getDataById(idClass);
        //Hàm xử lý ngày
        dataClassp.dayStart = classService.formatDate(dataClassp.dayStart);
        dataClassp.dayEnd = classService.formatDate(dataClassp.dayEnd);
        //
        let lessonData = await lessonService.getAllLessonByClassId(req.params.id);
        res.render('userNotRegisteredCourseDetail',{layout:'backend',id:req.params.id,lessonData:lessonData,dataClassp:dataClassp,userInfo:userInfo})
    }
    async viewNotRegisterClassDetailPage(req,res,next){
        
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let idClass = req.params.id;
        let dataClassp = await classService.getDataById(idClass);
        //Hàm xử lý ngày
        dataClassp.dayStart = classService.formatDate(dataClassp.dayStart);
        dataClassp.dayEnd = classService.formatDate(dataClassp.dayEnd);
        //
        let lessonData = await lessonService.getAllLessonByClassId(req.params.id);
        res.render('viewNotRegisterClassDetail',{layout:'backend',id:req.params.id,lessonData:lessonData,dataClassp:dataClassp,userInfo:userInfo})
    }

    //Append more 
    async viewNotLoginRegisterClassDetailPage(req,res,next){
        let idClass = req.params.id;
        let dataClassp = await classService.getDataById(idClass);
        //Hàm xử lý ngày
        dataClassp.dayStart = classService.formatDate(dataClassp.dayStart);
        dataClassp.dayEnd = classService.formatDate(dataClassp.dayEnd);
        //
        let lessonData = await lessonService.getAllLessonByClassId(req.params.id);
        res.render('viewNotLoginNotRegisterClassDetail',{layout:'backend',id:req.params.id,lessonData:lessonData,dataClassp:dataClassp});
    }
    async enrollClass(req,res,next){
        let idUser = req.cookies.iduser;
        let idClass = req.params.id;
        let dataDetailClass = await classService.getDataById(idClass);
        let courseId = dataDetailClass.courseId;
        let a = await courseService.addUserToCourse(idUser,courseId);
        
        let b = await classService.addUserToClass(idUser,idClass);
        res.cookie('blo',{blo:'2'})
        res.redirect('/user/onprocessing-class?err=2')
    }
    //Lấy tất cả thông tin các lớp học mà người dùng đã đăng kí hoặc mua thành công
    async getMyClass(req,res,next){
        let idUser = req.cookies.iduser;
        let data = [];
        let userInfo = await userService.getUserInfoById(idUser);
        let resultId = await classService.getMyClassInfoId(idUser);
        if(resultId.length!=0){
            //Xét thêm trường hợp người học bị block trong khóa học
            for(let m = 0 ; m<resultId.length ; m++){
                try {
                    let dataDetailClass = await classService.getDataById(resultId[m].get().classId);
                    data.push(dataDetailClass);
                } catch (error) {
                    console.log('Đã có lỗi xảy ra');
                }
            }
            for(let j =0 ; j<data.length ; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(data[j].id);
                data[j].infoTeacher = infoTeacher;
            }

            //Thử nghiệm User my Class
            console.log('Thông tin gửi về Mycourse');
            console.log(data);
            res.render('userMyCourse',{layout:'backend',data:data,userInfo:userInfo});
        }
        else{
            res.render('userMyCourse',{layout:'backend',data:data,userInfo:userInfo});
        }
    }
    async getOnprocessingClass(req,res,next){
        if(req.query.err==2&&req.cookies.blo){
            console.log('Xảy ra th1...');
            //GEt all course ID from user
            let onprocessingClass = [];
            let userId = req.cookies.iduser;
            
            let userInfo = await userService.getUserInfoById(userId);
            let dataUserCourse = await courseService.getCourseByIdUser(userId);
            //Đã lấy được id của data user course
            //Đang tạm thởi thử nghiệm thêm courseId =2
            for(let i = 0;i<dataUserCourse.length;i++){
                try {
                let tempData = {};
                let courseName = await courseService.getCourseNameById(dataUserCourse[i]);
                let dataClassId =  await classService.getIdClassByCourseId(dataUserCourse[i]);
                //Thêm userId
                let resultId = await classService.checkIdClassOnProcessing(dataClassId,userId);
                let dataClass = [];
                for(let m = 0 ; m<resultId.length;m++){
                        let classy = await classService.getDataById(resultId[m]);
                        dataClass.push(classy);
                }
                //    let dataClass =  await classService.getClassOnprocessingByCourseId(dataUserCourse[i]);
                console.log('Thông tin data class');
                console.log(dataClass);
                for(let j = 0 ; j<dataClass.length;j++){
                    tempData.cate = courseName;
                    let bla = 'key'+j;
                    tempData[bla] = dataClass[j];
                }
                onprocessingClass.push(tempData);
                } catch (error) {
                    console.log('Đang có lỗi');
                }
            }
            console.log('Thông tin onprocessing class');
            console.log(onprocessingClass);
            let clara = [{name:'Hoa'},{name:'Hiệu'}];
            res.clearCookie('blo');
            res.render('userOnprocessingCourse',{layout:'backend',onprocessingClass:onprocessingClass,clara:clara,notifications:'success',userInfo:userInfo});  

        }
        else
        {
            console.log('xảy ra th2');
                //GEt all course ID from user
            let onprocessingClass = [];
            let userId = req.cookies.iduser;
            
            let userInfo = await userService.getUserInfoById(userId);
            let dataUserCourse = await courseService.getCourseByIdUser(userId);
            //Đã lấy được id của data user course
            //Đang tạm thởi thử nghiệm thêm courseId =2
            for(let i = 0;i<dataUserCourse.length;i++){
                try {
                let tempData = {};
                let courseName = await courseService.getCourseNameById(dataUserCourse[i]);
                let dataClassId =  await classService.getIdClassByCourseId(dataUserCourse[i]);
                let resultId = await classService.checkIdClassOnProcessing(dataClassId,userId);
                let dataClass = [];
                for(let m = 0 ; m<resultId.length;m++){
                        let classy = await classService.getDataById(resultId[m]);
                        dataClass.push(classy);
                }
                //    let dataClass =  await classService.getClassOnprocessingByCourseId(dataUserCourse[i]);
                console.log('Thông tin data class');
                console.log(dataClass);
                for(let j = 0 ; j<dataClass.length;j++){
                    tempData.cate = courseName;
                    let bla = 'key'+j;
                    tempData[bla] = dataClass[j];
                }
                onprocessingClass.push(tempData);
                } catch (error) {
                    console.log('Đang có lỗi');
                }
            }
            let clara = [{name:'Hoa'},{name:'Hiệu'}];
            
            res.render('userOnprocessingCourse',{layout:'backend',onprocessingClass:onprocessingClass,clara:clara,userInfo:userInfo});  

        }
        
    }
    //Show profile of user
    async showProfile(req,res,next){
        let province='';
        let district='';
        let detailAddress='';
        let iduser = req.cookies.iduser;
        let checkUser = await userService.getUserInfoById(iduser);
        console.log(checkUser);
        
        
        if(checkUser.address)
        {
            let address = JSON.parse(checkUser.address);
            
            province = address.province;
            district = address.district;
            detailAddress = address.detailAddress
        }
        
        res.render('userProfile',{layout:'backend',checkUser:checkUser,province:province,district:district,detailAddress:detailAddress});
    }
    async processEditProfile(req,res,next){
        console.log('chạy vào hàm cập nhật');
        let formData = req.body;
        let iduser = req.cookies.iduser;
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
        let changeDataResult = await userService.changeUserInfoById(iduser,formData);
        
        //Đẩy lại trang get profile
        let checkUser = await userService.getUserInfoById(iduser);
        if(checkUser.address)
        {
            let address = JSON.parse(checkUser.address);
            console.log(address);
            province = address.province;
            district = address.district;
            detailAddress = address.detailAddress
        }
        console.log(detailAddress);
        res.render('userProfile',{layout:'backend',checkUser:checkUser,province:province,district:district,detailAddress:detailAddress,notification:'Success'});
    }
    //Yêu cầu phải lấy thêm về bài luyện tập và bổ sung Jquery để xem tiết học chi tiết -- đã thực hiện
    async getRegisterCourseDetailPage(req,res,next){
        //Lấy Id của khóa học
        let idClass = req.params.id;
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let dataClassp = await classService.getDataById(idClass);
        //Sử dụng cho việc format ngày
        dataClassp.dayStart = classService.formatDate(dataClassp.dayStart);
        dataClassp.dayEnd = classService.formatDate(dataClassp.dayEnd);
        //
        let courseDocument = await documentService.getAllDocumentWithClassId(idClass);

        let lessonData = await lessonService.getAllLessonByClassId(req.params.id);
        console.log('Thông tin của lesson data');
        //Lấy thông tin từ các bài kiểm tra trong tiết học
        //console.log(lessonData);
        let lessonTest = [];
        for(let k = 0 ; k<lessonData.length ; k++){
            let resultActiveLesson = await lessonTestService.getTestActiveInLesson(lessonData[k].id);
            let check = await lessonTestService.getTestResultByTestId(userId,lessonData[k].id);
            if((check)&&(resultActiveLesson)){
                resultActiveLesson.check = 'bla';
            }
            lessonTest.push(resultActiveLesson);
        }
        console.log(lessonTest);
        //console.log(lessonTest);
        //Lấy thông tin môn xử lý khóa học liên quan---Hàm lấy các khóa học xử lý của môn học liên quan
        let dataRelatedClass = await classService.getAllClassByCourseId(dataClassp.courseId);
        
        
        while(dataRelatedClass.length>6){
            dataRelatedClass.pop();
        }
        res.render('userRegisteredCourseDetail',{layout:'backend',id:req.params.id,lessonData:lessonData,dataClassp:dataClassp,lessonTest:lessonTest,userInfo:userInfo,dataRelatedClass:dataRelatedClass,courseDocument:courseDocument})
    }
    


    //[GET] Method for changing password    //Phương thức GET cho quá trình thay đổi mật khẩu
    changePassword(req,res,next){
        res.render('adminChangingPassword');
    }

    //[POST] Method for changing password // Phương thức POST cho quá trình thay đổi mật khẩu
    async processChangePassword(req,res,next){
        let formData = req.body;
        let oldPassword = formData.oldPassword;
        let newPassword = formData.newPassword;
        let confirmNewPassword = formData.confirmNewPassword;
        
        let iduser = req.cookies.iduser;
        let checkPasswordResult = await userService.checkPasswordByIdUser(iduser,formData);
        if(!checkPasswordResult){
            res.render('adminChangingPassword',{warning:'Mật khẩu cũ không tồn tại hoặc xác nhận sai mật khẩu'});
        }
        else{
            if(newPassword==confirmNewPassword){
                let encryptedPassword = await userService.hashPasswordSecond(formData);
                //Lấy về kết quả thay đổi mật khẩu
                let changeResult = await userService.changePassword(iduser,encryptedPassword);
                res.render('adminChangingPassword',{notification:'Bạn đã sửa đổi mật khẩu thành công'});
            }
            else{
                res.render('adminChangingPassword',{warning:'Mật khẩu cũ không tồn tại hoặc xác nhận sai mật khẩu'});
            }
        }
    }

    //User Change password
    async userChangePassword(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);

        res.render('userChangePassword',{layout:'backend',userInfo:userInfo});
    }
    //User Change password --POST method
    async processUserChangePassword(req,res,next){
        let formData = req.body;
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let oldPassword = formData.oldPassword;
        let newPassword = formData.newPassword;
        let confirmNewPassword = formData.confirmNewPassword;
        let iduser = req.cookies.iduser;
        let checkPasswordResult = await userService.checkPasswordByIdUser(iduser,formData);

        if(!checkPasswordResult){
            res.render('userChangePassword',{layout:'backend',warning:'Mật khẩu cũ không tồn tại hoặc xác nhận sai mật khẩu',userInfo:userInfo});
        }
        else{
            if(newPassword==confirmNewPassword){
                let encryptedPassword = await userService.hashPasswordSecond(formData);
                //Lấy về kết quả thay đổi mật khẩu
                let changeResult = await userService.changePassword(iduser,encryptedPassword);
                res.render('userChangePassword',{layout:'backend',notification:'Bạn đã sửa đổi mật khẩu thành công',userInfo:userInfo});
            }
            else{
                res.render('userChangePassword',{layout:'backend',warning:'Mật khẩu cũ không tồn tại hoặc xác nhận sai mật khẩu',userInfo:userInfo});
            }
        }
    }
    getAssistant(req,res,next){
        res.send('Đây là trang hỗ trợ thông tin của hệ thống học trực tuyến , Liên hệ Admin :0385853267');
    }
    
    //Hàm này điều hướng về khóa học đã đăng kí hoặc khóa học chưa đăng kí
    async checkStatus(req,res,next) {
        //Điều hướng thêm vấn đề khóa học có bị chặn trên hệ thống hay không
        let userId = req.cookies.iduser;
        let classId = req.params.id;
        let checkResult = await classService.checkUserInClass(userId,classId);
        if(checkResult){
            //Trường hợp tìm thấy mối liên quan
            if(checkResult.status=='active'){
                res.redirect(`/user/registeredCourseDetail/${classId}`);
            }
            if(checkResult.status=='onProcessing'){
                console.log('Hệ thống chạy vào đây');
                res.redirect('/user/onprocessing-class');
            }
            if(checkResult.status=='refused'){
                res.redirect('/user/onprocessing-class');
            }
        }
        //Trường hợp không tìm thấy mối liên quan giữa người dùng và lớp học trong hệ thống
        else{
            console.log(' case eleven case eleven ');
            if(classService.checkClassActiveByClassId(classId)){
                res.redirect(`/user/not-register-coursedetail/${classId}`)
            }
            else{
                res.send('Khóa học đang không nhận học viên mới , vui lòng tìm chọn khóa học khác');
            }
        }
    
    }
    //Hàm phục vụ lấy tỉnh thành phố từ enums có sẵn
    getDistrict(req,res,next){
        let resultNotProcess = [];
        let districtResult = [];
        let idProvice = req.params.id;
        for(let j = 0 ; j<geographyVietnam.length;j++){
            if(geographyVietnam[j].id==idProvice){
                resultNotProcess = geographyVietnam[j].results;
            }
        }
        for(let i = 0 ; i<resultNotProcess.length;i++){
            districtResult.push(resultNotProcess[i].name);
        }
        
        res.status(200).json({bla:districtResult});
    }

    //Hàm lấy ra các khóa học bị từ chối
    async getRefusedCourse(req,res,next){
        if(req.query.err==2&&req.cookies.blo){
            console.log('Xảy ra th1...');
            //GEt all course ID from user
            let refusedClass = [];
            let userId = req.cookies.iduser;
            
            let userInfo = await userService.getUserInfoById(userId);
            let dataUserCourse = await courseService.getCourseByIdUser(userId);
            //Đã lấy được id của data user course
            //Đang tạm thởi thử nghiệm thêm courseId =2
            for(let i = 0;i<dataUserCourse.length;i++){
                try {
                let tempData = {};
                let courseName = await courseService.getCourseNameById(dataUserCourse[i]);
                let dataClassId =  await classService.getIdClassByCourseId(dataUserCourse[i]);
                //Thêm userId
                let resultId = await classService.checkIdClassRefused(dataClassId,userId);
                let dataClass = [];
                for(let m = 0 ; m<resultId.length;m++){
                        let classy = await classService.getDataById(resultId[m]);
                        dataClass.push(classy);
                }
                //    let dataClass =  await classService.getClassOnprocessingByCourseId(dataUserCourse[i]);
                console.log('Thông tin data class');
                console.log(dataClass);
                for(let j = 0 ; j<dataClass.length;j++){
                    tempData.cate = courseName;
                    let bla = 'key'+j;
                    tempData[bla] = dataClass[j];
                }
                refusedClass.push(tempData);
                } catch (error) {
                    console.log('Đang có lỗi');
                }
            }
            console.log('Thông tin onprocessing class');
            console.log(onprocessingClass);
            let clara = [{name:'Hoa'},{name:'Hiệu'}];
            res.clearCookie('blo');
            res.render('userRefusedCourse',{layout:'backend',onprocessingClass:onprocessingClass,clara:clara,notifications:'success',userInfo:userInfo});  

        }
        else
        {
            console.log('xảy ra th2');
                //GEt all course ID from user
            let refusedClass = [];
            let userId = req.cookies.iduser;
            
            let userInfo = await userService.getUserInfoById(userId);
            let dataUserCourse = await courseService.getCourseByIdUser(userId);
            //Đã lấy được id của data user course
            //Đang tạm thởi thử nghiệm thêm courseId =2
            for(let i = 0;i<dataUserCourse.length;i++){
                try {
                let tempData = {};
                let courseName = await courseService.getCourseNameById(dataUserCourse[i]);
                let dataClassId =  await classService.getIdClassByCourseId(dataUserCourse[i]);
                let resultId = await classService.checkIdClassRefused(dataClassId,userId);
                let dataClass = [];
                for(let m = 0 ; m<resultId.length;m++){
                        let classy = await classService.getDataById(resultId[m]);
                        dataClass.push(classy);
                }
                //    let dataClass =  await classService.getClassOnprocessingByCourseId(dataUserCourse[i]);
                console.log('Thông tin data class');
                console.log(dataClass);
                for(let j = 0 ; j<dataClass.length;j++){
                    tempData.cate = courseName;
                    let bla = 'key'+j;
                    tempData[bla] = dataClass[j];
                }
                refusedClass.push(tempData);
                } catch (error) {
                    console.log('Đang có lỗi');
                }
            }
            let clara = [{name:'Hoa'},{name:'Hiệu'}];
            
            res.render('userRefusedCourse',{layout:'backend',onprocessingClass:refusedClass,clara:clara,userInfo:userInfo});  

        }
    }
}
module.exports = new UserController;