const {User} =require('../models/index');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransaport = require('nodemailer-sendgrid-transport');
const {UserClass} = require('../models/index');
class userService{
    async checkTeacher(id){
      //Bổ sung block Status là No cho hàm check Teacher 
      const checkTeacher = await User.findOne({
        where:{
          id:id,
          roleName:'teacher',
          blockStatus:'No'
        }
      });
      if(checkTeacher){
        return checkTeacher.get();
      }
      else{
        return false;
      }
    }
    //Kiểm tra xem lớp học có giáo viên tồn tại trong hệ thống không
    async checkTeacherInClass(classId){
      const teacherInClass = await UserClass.findOne({
        where :{
          classId:classId,
          status:'teaching'
        }
      })
      if(teacherInClass){
        return teacherInClass.get();
      }
      else{
        return false;
      }
    }
    //Lấy user khi ta đã có mảng user
    async getUserFromClass(idInfoSet){
        let infoNeed =[];
        let result = await User.findAll({where:{id:idInfoSet,blockStatus:'No'}});
        if(result){
          for(let j =0 ; j<result.length ; j++){
              infoNeed.push(result[j].get());
          }
          return infoNeed;
        }
        else{
          return [];
        }
    }
    async getUserInfoById(id){
      const checkUser = await User.findOne({
        where:{id:id}
      })
      if(checkUser){
        return checkUser.get();
      }
      else{
        return false;
      }
    }
    async getAllStudent(){
      let allStudentInfo = [];
      let getAllStudent = await User.findAll({where:{
        roleName:'user'
      }});
      for(let k = 0 ; k<getAllStudent.length ; k++){
         allStudentInfo.push(getAllStudent[k].get());
      }
      return allStudentInfo;
    }
    async getAllStudentActive(){
      let allStudentInfo = [];
      let getAllStudent = await User.findAll({where:{
        roleName:'user',
        blockStatus:'No'
      }});
      for(let k = 0 ; k<getAllStudent.length ; k++){
         allStudentInfo.push(getAllStudent[k].get());
      }
      return allStudentInfo;
    }
    async getAllStudentBlock(){
      let allStudentInfo = [];
      let getAllStudent = await User.findAll({where:{
        roleName:'user',
        blockStatus:'Yes'
      }});
      for(let k = 0 ; k<getAllStudent.length ; k++){
         allStudentInfo.push(getAllStudent[k].get());
      }
      return allStudentInfo;
    }
    
    checkUserCredentials = async function (formdata) {
        const candidateUser = await User.findOne({
          where: {
            email: formdata.email,
          },
        });
      
        if (!candidateUser) {
          return false;
        }
      
        // if (!bcrypt.compareSync(data.password, candidateUser.password)) {
        //   return false;
        // }
      
        return candidateUser;
    };
    //bổ sung chặn cho block status
    getPassword = async function (formdata) {
      const candidateUser = await User.findOne({
        where: {
          email: formdata.email,
          blockStatus:'No'
        },
      });
    
      if (!candidateUser) {
        return false;
      }
    
      // if (!bcrypt.compareSync(data.password, candidateUser.password)) {
      //   return false;
      // }
    
      return candidateUser.get();
  };
  findUserByPassword= async function (formdata) {
    const candidateUser = await User.findOne({
      where: {
        password: formdata.jamesbond,
      },
    });
  
    if (!candidateUser) {
      return false;
    }
  
    // if (!bcrypt.compareSync(data.password, candidateUser.password)) {
    //   return false;
    // }
  
    return candidateUser.get();
  };
    async hashPassword(formData){
      const saltRounds = 10;
      let encryptedPassword = ''
      await bcrypt.hash(formData.psw, saltRounds).then(function(hash) {
        // Store hash in your password DB.
          encryptedPassword=hash;
      });
      return encryptedPassword;
      
    }

    async hashPasswordSecond(formData){
      const saltRounds = 10;
      let encryptedPassword = ''
      await bcrypt.hash(formData.newPassword, saltRounds).then(function(hash) {
        // Store hash in your password DB.
          encryptedPassword=hash;
      });
      return encryptedPassword;
      
    }
    //verify user exist or not in the database when signup + checkPassword
    async index(formData){
        const candidateUser = await User.findOne({
          where :{
            email:formData.email,
            blockStatus:'No'
          }
        });
        
      if(candidateUser) {
        return false;
      }
      else {
        return true;
      }
    }
    //check password of user when login // Use bcrypt to hash password
    async checkPassword(formData){
        
        const user = await User.findOne({
          where :{
            email:formData.email,
            
          }
        });
        let checkResult = await bcrypt.compare(formData.password, user.password);
        if(checkResult){
             
             return true;
        }
        else{
            return false;
        }
    };
    //check Password for changing password -- check through id of user
    async checkPasswordByIdUser(idUser,formData){
        
      const user = await User.findOne({
        where :{
          id:idUser,
          
        }
      });
      let checkResult = await bcrypt.compare(formData.oldPassword, user.password);
      if(checkResult){
           
           return true;
      }
      else{
          return false;
      }
    };


    //Get the id of user when login
    async getIdUser(formData){
        const user = await User.findOne({
          where :{
            email:formData.email,
            
          }
        });
        return user.id;
    }
    async checkExistOfEmail(formData){
      let user = await User.findOne({
        where:{
          email:formData.email
        }
      })
      if(user){
        return user.get();
      }
      else{
        return false;
      }
    }

    async testValidateRefreshToken(data,refreshToken){
        const user = await User.findOne({
          where:{
            id:data.id
          }
        })
        if(user.refreshToken==refreshToken){
          return true;
        }
        else{
          return false;
        }

    }
    //Add refresh token into database when login
    async addRefreshToken(formData,refreshToken){
      const user = await User.findOne({where:{email:formData.email}});
      if(!user){
        console.log('Không tồn tại user');
        
      }
      else{
        user.refreshToken=refreshToken;
        user.save();
      }
      return "addRefreshToken";
    }
    //Delete refresh token of database when sign out
    async deleteRefreshToken(id,refreshToken){
      const user = await User.findOne({where:{id:id}});
      if(!user){
        console.log('Không tồn tại user');
        
      }
      else{
        user.refreshToken=null;
        await user.save();
      }
      return "deleteRefreshToken";
    }

    //change password of User
    async changePassword(id,encryptedPassword){
      const user = await User.findOne({where:{id:id}});
      if(!user){
        console.log('Không tồn tại user');
        
      }
      else{
        user.password=encryptedPassword;
        await user.save();
      }
      return "Password thành công";
    }
    //check app for all other request
    async checkSecurity(refreshToken,id){
      const user = await User.findOne({where:{id:id}});
      if(refreshToken==user.refreshToken){
        return true;
      }
      else{
        return false;
      }
    }

    //Check validate of User register form in the database
    async checkValidateRegister(formData){
      const user = await User.findOne({where:{email:formData.email}});
      if(user){
        return false;
      }
      else{
        if(formData.psw == formData.pswrepeat){
          return true;
        }
        else{
          return false;
        }
      }
    }
    //Add user into User Table after register
    async addUser(formData){
        
        const newUser = await User.create({
            email:formData.email,
            password:formData.password, //cần được hash đã //dự kiến dùng md5 hoặc bcrypt
            name:formData.name,
            roleName:"user",
            blockStatus:"No"

          });
        

        return newUser;


    }
    async addTeacher(formData){
      const newTeacher = await User.create({
        email:formData.email,
        password:formData.psw, //cần được hash đã //dự kiến dùng md5 hoặc bcrypt
        name:formData.name,
        telephone:formData.telephone,
        roleName:"teacher",
        blockStatus:"No"

      });
      return newTeacher.get();
    }
    async showAllTeacherInSystem(){
      let dataTeacher = [];
      let resultTeacher = await User.findAll({where:{
        roleName:'teacher'
      }})
      resultTeacher.forEach(element => {
          dataTeacher.push(element.get());        
      });
      return dataTeacher;
    }
    
    //POST change UserInfo By Id
    async changeUserInfoById(idUser,formData){
      let userResult = await User.findOne({
        where:{id:idUser}
      })
      console.log(formData.myFile);
      if(userResult){
        userResult.name=formData.name;
        userResult.address = JSON.stringify(formData.address);
        userResult.telephone = formData.telephone;
        userResult.birthday = formData.birthday;
        userResult.gender = formData.gender
        userResult.knowledge = formData.knowledge;
        if(!formData.myFile){
          
          userResult.linkImg = formData.assignLink;
        }
        else{
          userResult.linkImg = formData.assignLink;
        }
        await userResult.save();
        return "ChangeUserInfo Successfully";
      }
      else{
        return "changeUserInfo Failed";
      }
    }

    //[POST] Change block Status of User
    async changeToBlockStatus(userId){
      let foundUser = await User.findOne({where:{
          id:userId,
          blockStatus :'No'
        }
      })
      if(foundUser){
        foundUser.blockStatus = 'Yes'
        await foundUser.save();
      }
      return "";
    } 
    //[POST] Change active Status of User
    async changeToActiveStatus(userId){
      let foundUser = await User.findOne({where:{
          id:userId,
          blockStatus :'Yes'
        }
      })
      if(foundUser){
        foundUser.blockStatus = 'No'
        await foundUser.save();
      }
      return "";
    } 
    
    //Use for validate //checkRole
    async checkRoleUser(userId){
      let user = await User.findOne({
        where:{
          id:userId,
          roleName :'user'
        }
      })
      if(user){
        return true;
      }
      else{
        return false;
      }
    }

    async checkRoleTeacher(userId){
      let user = await User.findOne({
        where:{
          id:userId,
          roleName :'teacher'
        }
      })
      if(user){
        return true;
      }
      else{
        return false;
      }
    }

    async checkRoleAdmin(userId){
      let user = await User.findOne({
        where:{
          id:userId,
          roleName :'admin'
        }
      })
      if(user){
        return true;
      }
      else{
        return false;
      }
    }
}
module.exports = new userService;