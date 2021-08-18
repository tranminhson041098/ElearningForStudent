/**
 * Created by SontranMinh 18/01/2021
 * Created isAuth function for save middleware
 */
const jwtHelper = require('../helpers/jwt.helper');
const userService = require('../services/userService');


 // Mã secretKey này phải được bảo mật tuyệt đối
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-tranminhson.com-green-cat-a@";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-example-tranminhson.com-green-cat-a@";
const accessTokenLife ='10000000s';
const refreshTokenLife ='300d';
 
let isAuth = async (req,res,next)=>{
       // Lấy token được gửi lên từ phía client
     const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]||req.cookies.Token;
     console.log(tokenFromClient);
     if(tokenFromClient){
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient.accessToken,accessTokenSecret);
            console.log('Vị trí thử nghiệm');
            if(decoded.data.roleName=='user'){
                  
              req.jwtDecoded = decoded;
              next();
            }
            else{
                res.send('Yêu cầu không hợp lệ');
            }
        } 
        catch (error) {
            //Kiểm tra refresh token để trả lại
            try {
                const decode = await jwtHelper.verifyToken(tokenFromClient.refreshToken,refreshTokenSecret);
                req.decodedjwt = decode;

                next();
            } catch (error) {
                res.send('Đang bị lỗi token')
             }
            // res.send('Đang bị lỗi token')
            // res.redirect('/admin/login')
        }
     }
     else{
         console.log('Đang ở vị trí next');
         next();
        //  res.send('Đang bị lỗi token 2');
        // //  res.redirect('/admin/login');
     }
}
let isAuth2 = async (req,res,next)=>{
    // Lấy token được gửi lên từ phía client
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]||req.cookies.Token;
  console.log(tokenFromClient);
  if(tokenFromClient){
     try {
        const decoded = await jwtHelper.verifyToken(tokenFromClient.accessToken,accessTokenSecret);
        console.log('Vị trí thử nghiệm');
        if(decoded.data.roleName=='teacher'){
              
          req.jwtDecoded = decoded;
          next();
        }
        else{
            res.send('Yêu cầu không hợp lệ');
        }
     } 
     catch (error) {
         //Kiểm tra refresh token để trả lại
         try {
             const decode = await jwtHelper.verifyToken(tokenFromClient.refreshToken,refreshTokenSecret);
             req.decodedjwt = decode;

             next();
         } catch (error) {
             res.send('Đang bị lỗi token')
          }
         // res.send('Đang bị lỗi token')
         // res.redirect('/admin/login')
     }
  }
  else{
      console.log('Đang ở vị trí next');
      next();
     //  res.send('Đang bị lỗi token 2');
     // //  res.redirect('/admin/login');
  }
}
let isAuth3 = async (req,res,next)=>{
    // Lấy token được gửi lên từ phía client
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]||req.cookies.Token;
  console.log(tokenFromClient);
  if(tokenFromClient){
     try {
        const decoded = await jwtHelper.verifyToken(tokenFromClient.accessToken,accessTokenSecret);
        console.log('Vị trí thử nghiệm');
        if(decoded.data.roleName=='admin'){
              
          req.jwtDecoded = decoded;
          next();
        }
        else{
            res.send('Yêu cầu không hợp lệ3');
        }
     } 
     catch (error) {
         //Kiểm tra refresh token để trả lại
         try {
             const decode = await jwtHelper.verifyToken(tokenFromClient.refreshToken,refreshTokenSecret);
             req.decodedjwt = decode;

             next();
         } catch (error) {
             res.send('Đang bị lỗi token')
          }
         // res.send('Đang bị lỗi token')
         // res.redirect('/admin/login')
     }
  }
  else{
      console.log('Đang ở vị trí next');
      next();
     //  res.send('Đang bị lỗi token 2');
     // //  res.redirect('/admin/login');
  }
}
//Use for user
let checkApp = async (req,res,next)=>{
    
    if(req.cookies.Token.refreshToken){
        const checkSecurity = await userService.checkSecurity(req.cookies.Token.refreshToken,req.cookies.iduser);
        const validateRole = await userService.checkRoleUser(req.cookies.iduser);
        if(checkSecurity&&validateRole){

            next();
        }
        
        else{
            res.send('Yêu cầu đưa ra không hợp lệ')
        }
    }
    else{
        
        console.log('Hello');
        res.send('Yêu cầu ko hợp lệ')
    }
}
//Use for teacher
let checkApp2 = async (req,res,next)=>{
    
    if(req.cookies.Token.refreshToken){
        const checkSecurity = await userService.checkSecurity(req.cookies.Token.refreshToken,req.cookies.iduser);
        const validateRole = await userService.checkRoleTeacher(req.cookies.iduser);
        if(checkSecurity&&validateRole){

            next();
        }
        
        else{
            res.send('Yêu cầu đưa ra không hợp lệ')
        }
    }
    else{
        
        console.log('Hello');
        res.send('Yêu cầu ko hợp lệ')
    }
}
//Use for admin
let checkApp3 = async (req,res,next)=>{
    console.log('chạy qua checkapp3')
    if(req.cookies.Token.refreshToken){
        const checkSecurity = await userService.checkSecurity(req.cookies.Token.refreshToken,req.cookies.iduser);
        const validateRole = await userService.checkRoleAdmin(req.cookies.iduser);
        if(checkSecurity&&validateRole){

            next();
        }
        
        else{
            res.send('Yêu cầu đưa ra không hợp lệ')
        }
    }
    else{
        
        console.log('Hello');
        res.send('Yêu cầu ko hợp lệ')
    }
}
module.exports = {
     isAuth:isAuth,
     isAuth2:isAuth2,
     isAuth3:isAuth3,
     checkApp:checkApp,
     checkApp2:checkApp2,
     checkApp3:checkApp3,
}