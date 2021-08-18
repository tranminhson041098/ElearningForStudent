/**
 * 
 * Verify token and generate token
 */
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
/**
 * function used for generate token
 * @param {*} user 
 * @param {*} secretSignature 
 * @param {*} tokenLife 
 */
const generateToken= (user,secretSignature,tokenLife) =>{
  return new Promise((resolve,reject)=>{
    //Luu nhung thong tin ca nhan ma ta muon luu trong token
    const userData = {
      id:user.userId,
      name:user.name,
      roleName:user.roleName,
      email:user.email
    }
    //Thuc hien ky va tao token
    jwt.sign(
      {data:userData},
      secretSignature,
      {
        algorithm:"HS256",
        expiresIn: tokenLife,
      },
      (error,token)=>{
          if(error){
            return reject(error);
          }
          resolve(token);
      }
    )
  })
}
/**
 * function used for verify token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

let verifyToken =  (token,secretkey) =>{
  return new Promise ((resolve,reject) =>{
    jwt.verify(token,secretkey,(error,decoded)=>{
      if(error){
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
module.exports={
    generateToken: generateToken,
    verifyToken: verifyToken,
}
