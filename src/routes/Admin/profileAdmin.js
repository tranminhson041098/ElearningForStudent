const express = require('express');
const router = express.Router();
const AdminController = require('../../app/controllers/Admin/AdminController');
const multer = require('multer');

const path = require("path");

// let storage = multer.diskStorage({
//     //add đường dẫn của file upload
//     destination:function (req,file,cb) {
//         cb(null,'uploads')
//     },
//     //add file lên
//     filename:function (req,file,cb) {
//         cb(null,file.originalname)
//     }

// })
// let upload = multer({ storage: storage})

// router.post('/uploadPictureProfile',upload.single('myFile'),(req,res,next)=>{
//     const file = req.body.fd;
//     if(!file){
//         const error = new Error('Please upload a file');
//         error.httpStatusCode = 400;
//         return next(error)
//     }
//     console.log('upload sucessfully');
//     res.send('upload suc')

// });
//Line for document
router.post('/uploadPictureProfile/viewDocument',(req,res)=>{
    console.log('chạy vào đây');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname,'../../uploads'));
        },
        filename: function (req, file, cb) {
            console.log('thông tin referer');
        console.log(req.get('Referrer'));
          cb(null,req.cookies.iduser+'-'+ file.fieldname + '-' + Date.now()+'.docx')
        }
    })
       
    var upload = multer({ storage: storage }).array('myfile',4);
    
    upload(req,res,function(err){
        if(err){
            console.log('Error happens')
            res.send('Error happens');
        }
        else{
            console.log('Thong tin cua filename');
            let analog = req.files;
            console.log(analog[0].filename);
            res.status(200).json({filename:analog[0].filename});
        }

    })
});


router.post('/uploadPictureProfile',(req,res)=>{
    
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname,'../../uploads'));
        },
        filename: function (req, file, cb) {
            console.log('thông tin referer');
        console.log(req.get('Referrer'));
          cb(null,req.cookies.iduser+'-'+ file.fieldname + '-' + Date.now()+'.png')
        }
    })
       
    var upload = multer({ storage: storage }).array('myfile',4);
    
    upload(req,res,function(err){
        if(err){
            console.log('Error happens')
            res.send('Error happens');
        }
        else{
            console.log('Thong tin cua filename');
            let analog = req.files;
            console.log(analog[0].filename);
            res.status(200).json({filename:analog[0].filename});
        }

    })
});
router.get('',AdminController.getProfile);
router.post('',AdminController.processProfile);

module.exports = router;