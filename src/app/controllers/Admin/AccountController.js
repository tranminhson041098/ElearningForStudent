const userService = require('../../../services/userService');
const express = require('express');
const {login} = require('../auth/authController');
let sgMail = require('@sendgrid/mail');
const classService = require('../../../services/classService');

class AccountController{
    //[GET] CREATE new user account to system
    createNewUserAccount(req,res,next){
        res.render('adminCreateUserAccount');
    }
    createTeacherAccount(req,res,next){
        res.send('Đây là trang thêm teacher ACCOUNT');
    }
    //[GET] change Account Password
    changeAccountPassword(req,res,next){
        res.render('forgotPassword',{layout:'backend'});
    }
    //[POST] change Account Password
    async processChangePassword(req,res,next){
        const formData = req.body;
        let email = formData.email;
        let checkResult = await userService.checkExistOfEmail(formData);
        let userInfo = await userService.getPassword(formData);
        let password = userInfo.password;
        if(checkResult==false){
            res.render('forgotPassword',{layout:'backend',notification:'wrongMessage'});

        }
        else{
            //hustFinalProject
            //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
            const sendgridApiKey = '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';
            let link = `http://localhost:3000/reset-password?valToken=${password}`
            sgMail.setApiKey(sendgridApiKey);
            let sendEmail = (email)=>
            {
              sgMail.send({
                  to:email,
                  from:'son.tm168463@sis.hust.edu.vn',
                  subject:'Hệ thống học trực tuyến_Xử lý quên mật khẩu',
                  html: `<h4>Chúng tôi đã nhận được phản hồi quên mật khẩu của bạn </h4><p>Hãy click vào link sau để tiến hành reset mật khẩu</p><a href='http://localhost:3000/reset-password?valToken=${password}'>http://localhost:3000/reset-password</a>`
              })
            }
            sendEmail(email);

            //sendgrid using for password -- API Key
            res.render('confirmSendingEmail',{layout:'backend'});
            // onlineSchool
        }

    }
    //[GET] reset Password via email
    resetPassword(req,res,next){
        if(req.query.valToken){
            res.render('resetPassword',{layout:'backend',valToken:req.query.valToken});
        }
        else{
            res.send('Trang web không tồn tại');
        }
    }
    async processResetPassword(req,res,next){
        let formData = req.body;
        let passwordfirst =formData.psw;
        let passwordsecond = formData.passwordsecond;
        if(passwordfirst==passwordsecond){
            let encryptedPassword = await userService.hashPassword(formData);
            let userInfo = await userService.findUserByPassword(formData);
            if(userInfo){
                let result =await userService.changePassword(userInfo.id,encryptedPassword);
                res.send('reset password thành công');
            }
            else{
                res.send('Đã có lỗi xảy ra rồi');
            }
        }
        else{
            res.render('resetPassword',{layout:'backend'});
        }
    }
    //[POST] reset Password via email
    //[GET] get all course participate by an user
    async getAllCourseParticipate(req,res,next){
        let userId = req.params.id;
        let userInfo = await userService.getUserInfoById(userId);
        let classOfUser = await classService.getMyClassInfoStatistic(userId);
        if(classOfUser.length!=0){
            for(let i =0 ; i<classOfUser.length;i++){
                let classInfo = await classService.getDataById(classOfUser[i].classId);
                classOfUser[i].classInfo = classInfo;
            }
        }
        if(classOfUser.length!=0){
            for(let index =0 ; index<classOfUser.length ; index++){
                classOfUser[index].createdAt = classOfUser[index].createdAt.getDate()+"/"+classOfUser[index].createdAt.getMonth()+"/"+classOfUser[index].createdAt.getFullYear()+" "+classOfUser[index].createdAt.getHours()+":"+classOfUser[index].createdAt.getMinutes();
            }
        }
        res.render('listCourseUserParticipate',{userInfo:userInfo,classOfUser:classOfUser});
    }

    //Lấy tất cả giáo viên đang có trên hệ thống
    async getAllTeacher(req,res,next)
    {
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let dataTeacher = await userService.showAllTeacherInSystem();
        res.render('userGetAllTeacher',{layout:'backend',dataTeacher:dataTeacher,userInfo:userInfo});
    }
    async replyByMail(req,res,next){
        if(req.cookies.bla&&req.query.state){
            res.clearCookie('bla');
            console.log('chạy vào đây');
            let userId = req.cookies.iduser;
            let userInfo = await userService.getUserInfoById(userId);
    
            res.render('userReplyToAdmin',{layout:'backend',userInfo:userInfo,notification:'success'});
        }
        else{
            let userId = req.cookies.iduser;
            let userInfo = await userService.getUserInfoById(userId);
    
            res.render('userReplyToAdmin',{layout:'backend',userInfo:userInfo});
        }
       
    }
    async processReplyByEmail(req,res,next){
        let formData = req.body;
        let email = formData.email;
        let message = formData.message;
        let name = formData.name;
        let userId = req.cookies.iduser;
        console.log(formData);
        let userInfo = await userService.getUserInfoById(userId);
        //hustFinalProject
            //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
            const sendgridApiKey = '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';
            
            sgMail.setApiKey(sendgridApiKey);
            let sendEmail = (email)=>
            {
              sgMail.send({
                  to:'anhnangphuongmai98@gmail.com',
                  from:email,
                  subject:'Hệ thống học trực tuyến_Phản hồi của người học',
                  html: `<h3>Phản hồi của người học ${name}</h3><br><h4>${message}</h4>`
              })
            }
            sendEmail(email);

            res.cookie('bla',{bla:'1'})
            //sendgrid using for password -- API Key
            res.redirect('/user/replyToAdmin?state=success');
            // onlineSchool

    }
}
module.exports = new AccountController;