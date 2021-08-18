
const classService = require('../../../services/classService');
const lessonService = require('../../../services/lessonService');
class lessonController{
    async edit(req,res,next){
        //This is id of class
        let idLesson = req.params.id;
        let dataLesson = await lessonService.getDataLessonById(idLesson);
        res.render('adminEditLesson',{idLesson:idLesson,dataLesson:dataLesson,classId:dataLesson.classId})
        // res.render('adminEditClass',{dataClass:dataClass,dataLesson:dataLesson,idClass:idClass});
        
    }
    async processEdit(req,res,next){
        console.log('idLesson lag');
        console.log(req.params.id);
        let idLesson = req.params.id;
        let formData = req.body;
        let lessonNameh = formData.lessonName;
        let linkVideoh = formData.linkVideo;
        
        let dataLessonb = await lessonService.getDataLessonById(idLesson);
        
        if(lessonNameh.length==0||linkVideoh.length==0){
            console.log('TRƯỜNG HỢP 1');
            let dataLesson2 = await lessonService.getDataLessonById(idLesson);
            res.render('adminEditLesson',{dataLesson:dataLesson2,warning:'fail',idLesson:idLesson,classId:dataLesson2.classId});
        }
        else{
            //Trong trường hợp có dữ liệu thay đổi
            if(dataLessonb.lessonName!=lessonNameh||dataLessonb.linkVideo!=linkVideoh){
                let dataLessonfa = await lessonService.editLesson(idLesson,formData);
                console.log('TRƯỜNG HỢP 2');
                let dataLesson2 = await lessonService.getDataLessonById(idLesson);
                console.log('Thông tin dataclass2');
                // console.log(dataClass2);
                res.render('adminEditLesson',{dataLesson:dataLesson2,notification:'success',idLesson:idLesson,classId:dataLesson2.classId});
            }
            else{
                console.log('TRƯỜNG HỢP 3');
                let dataLesson2 = await lessonService.getDataLessonById(idLesson);
                res.render('adminEditLesson',{dataLesson:dataLesson2,notificationsecond:'success',idLesson:idLesson,classId:dataLesson2.classId});
            }
            
        }
        
    }
    //[POST] Phương thức xóa tiết học post
    async delete(req,res,next){
        let classId = req.body.classId;
        let lessonId = req.params.id;
        let deleteData = await lessonService.deleteLessonById(lessonId);
        let dataLesson = await lessonService.getAllLessonByClassId(classId);
        res.status(200).json({bla:dataLesson});
    }
    //[GET] create new class get page
    async create(req,res,next){
        //This is course id
        let idClass = req.params.id;
        res.render('adminCreateLesson',{idClass:idClass});
        // res.render('adminCreateClass',{idCourse:idCourse});
    }
    async processCreate(req,res,next){
        let idClass = req.params.id;
        let formData = req.body;
        console.log('THông tin form Data');
        console.log(formData);
        console.log('Thông tin lessonName');
        let lessonName = formData.lessonName;
        let linkVideo = formData.linkVideo;
 
        if(lessonName.length==0||linkVideo.length==0){
            res.render('adminCreateLesson',{idClass:idClass,warning:'wrong notification'})
        }
        else{
            let resultInfoLesson = await lessonService.createLesson(idClass,formData);

            res.render('adminCreateLesson',{idClass:idClass,notification:'sucess',resultInfoLesson:resultInfoLesson});
        }
        // let idCourse = req.params.id;
        // let formData = req.body;
        // let className = formData.className;
        // let classStatus = formData.classStatus;
        // let dayStart = formData.dayStart;
        // let dayEnd = formData.dayEnd;
        // let assignLink = formData.assignLink;
        // let classDescription = formData.classDescription;
        // if(className.length==0||classStatus=='Chọn trạng thái'||assignLink.length==0||classDescription.length==0){
        //     res.render('adminCreateClass',{idCourse:idCourse,warning:'wrong notification'});
        // }
        // else{
        //     let resultInfoClass = await classService.createClass(idCourse,formData);
            
        //     console.log(resultInfoClass.id);
        //     res.render('adminCreateClass',{idCourse:idCourse,notification:'sucess'});
        // }
    }
    
}
module.exports = new lessonController;