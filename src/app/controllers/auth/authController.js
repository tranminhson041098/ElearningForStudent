/**
 * Login - thuc hien chuc nang dang nhap , tap token
 * refresh token - lam moi lai khi token het han
 */
 const userService = require('../../../services/userService');
 const jwtHelper = require('../../../helpers/jwt.helper');
 
 //Luu tru tam thoi danh sach token
 let tokenList = {};
 //Thoi gian song cua token
//  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
const accessTokenLife ='100000000s';
 //Ma secretkey cua token phai duoc bao mat tuyet doi
 const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-tranminhson.com-green-cat-a@"
 //Thoi gian song cua refreshToken
//  const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '1h';
 const refreshTokenLife ='300d';
 //Ma refresh token phai duoc bao mat tuyet doi
 const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-example-tranminhson.com-green-cat-a@";
 exports.login = async (candidateUser) => {
   // const user = await userService.checkUserCredentials({
   //   email: req.body.email,
   //   password: req.body.password,
   // });
   
     const userData = {
         name:candidateUser.name,
         roleName:candidateUser.roleName,
         email:candidateUser.email,
         userId :candidateUser.id,
     }
     //Bat dau thuc hien tao token thui
     const accessToken = await jwtHelper.generateToken(userData,accessTokenSecret,accessTokenLife);
     const refreshToken = await jwtHelper.generateToken(userData,refreshTokenSecret,refreshTokenLife);
     
     tokenList [refreshToken] = {
       accessToken,refreshToken
     }
     return tokenList[refreshToken];
 
   // if (!user) {
   //   return res.render('auth/login', { message: 'Email or password was wrong' });
   // }
 
   // req.session.user = user;
   // res.redirect('/dashboard');
 };
 
 exports.logout = async (req, res, next) => {
   await req.session.destroy();
   res.redirect('/login');
 };
 