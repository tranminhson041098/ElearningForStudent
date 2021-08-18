const categoryService = require('../../../services/categoryService');
const courseService = require('../../../services/courseService');
const classService = require('../../../services/classService');
const userService = require('../../../services/userService');


class courseController{
    //[GET] Get all courses in User
    async getAll(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let finalAllCourse = [];
        const allCategory = await categoryService.getAllCategory();
        const dataAllClass = await classService.getAllClass();
        if(dataAllClass.length!=0){
            for(let j = 0 ; j<dataAllClass.length;j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataAllClass[j].id);
                dataAllClass[j].infoTeacher = infoTeacher;
            }
        }
        const allCourse = await courseService.getAllCourse();
        res.render('userAllCourse',{layout:'backend',dataAllClass:dataAllClass,allCategory:allCategory,allCourse:allCourse,userInfo:userInfo});
    }
    processGetAll(req,res,next){
        console.log('Thông tin form gửi lên')
        console.log(req.body);
        res.send('Đây là trang process cho việc get all');
    }
    //[GET] Manage courses for admin
    async manageCourses(req,res,next){
        
        if(req.cookies.bla){
            res.clearCookie('bla');
            const allCourse = await courseService.getAllCourse(); 
            
            if(allCourse.length!=0){
                for(let index = 0 ; index <allCourse.length ; index++){
                    allCourse[index].createdAt=allCourse[index].createdAt.getDate()+"/"+allCourse[index].createdAt.getMonth()+"/"+allCourse[index].createdAt.getFullYear()+" "+allCourse[index].createdAt.getHours()+":"+allCourse[index].createdAt.getMinutes();
                }
            }

            res.render('adminManageCourses',{allCourse:allCourse,notification:'notification'});
        }
        else{
            console.log('case2');
            const allCourse = await courseService.getAllCourse();  
            if(allCourse.length!=0){
                for(let index = 0 ; index <allCourse.length ; index++){
                    allCourse[index].createdAt=allCourse[index].createdAt.getDate()+"/"+allCourse[index].createdAt.getMonth()+"/"+allCourse[index].createdAt.getFullYear()+" "+allCourse[index].createdAt.getHours()+":"+allCourse[index].createdAt.getMinutes();
                }
            }  
            res.render('adminManageCourses',{allCourse:allCourse});
        }
    }
    //[GET] create New Course get Page
    async create(req,res,next){
        if(req.query.err==1&&req.cookies.bla){
            const allCategory = await categoryService.getAllCategory();
            res.clearCookie('bla');
            res.render('adminCreateCourse',{allCategory:allCategory,notification:'noti'});
        }
        else{
            const allCategory = await categoryService.getAllCategory();
        
            res.render('adminCreateCourse',{allCategory:allCategory});
        }
        
    }
    //[POST] create New Course Post Page
    async processCreate(req,res,next){
        const formData = req.body;
        
        if(formData.courseName==''||formData.categoryId=='Chọn chủ đề'||formData.courseStatus=='Chọn trạng thái'||formData.courseDescription==''){
            const allCategory = await categoryService.getAllCategory();
            res.render('adminCreateCourse',{allCategory:allCategory,warning:'warning'});
        }
        else{
            let checkResult = await courseService.checkCourseAvailable(formData.courseName);

            let courseInfo = await courseService.getCourseByName(formData.courseName);
            if(!checkResult){
                
                if(courseInfo){
                    const allCategory = await categoryService.getAllCategory();
                    res.render('adminCreateCourse',{allCategory:allCategory,warning:'warning'});
                }
                else{
                    
                    let signal = await courseService.createNewCourse(formData); 
                    res.cookie('bla',{bla:'1'})
                    
                    res.redirect('/admin/manage-courses/create?err=1');
                }
            }
            
            else{
                //Trường hợp môn học bị trùng trong hệ thống
                const allCategory = await categoryService.getAllCategory();
                res.render('adminCreateCourse',{allCategory:allCategory,warning:'warning'});
            }
        }
    }
    async edit(req,res,next){
        let id = req.params.id;
        console.log('thông tin id');
        
        console.log(id);
        const allCategory = await categoryService.getAllCategory();
        let dataCourse = await courseService.getCourseById2(id);

        let dataCategory = await categoryService.getCategoryInfoById2(dataCourse.categoryId);
        let categoryName = dataCategory.categoryName;
        let dataClass = await classService.getAllClassByCourseId(id);
       
        res.render('adminEditCourse',{dataCourse:dataCourse,dataCategory:dataCategory,dataClass:dataClass,id:id,allCategory:allCategory,categoryName:categoryName});
    }
    async processEditCourse(req,res,next){
        let formData = req.body;
        let courseId = req.params.id;
        let courseName = formData.courseName;
        let checkResult = await courseService.checkCourseAvailable(courseName);
        console.log('thông tin courseID');
        console.log(courseId);
        
            if(!checkResult){
                if(formData.courseStatus=='notactive'){
                    console.log('chạy vào đây')
                    let changeAllClassStatus = await classService.changeStatusOfAllClass(courseId);
                }
                //Hàm thay đổi nội dung môn học
                await courseService.processEditCourseById(courseId,formData);
                const allCategory = await categoryService.getAllCategory();
                let dataCourse = await courseService.getCourseById2(courseId);
        
                let dataCategory = await categoryService.getCategoryInfoById2(dataCourse.categoryId);
                let categoryName = dataCategory.categoryName;
                let dataClass = await classService.getAllClassByCourseId(courseId);
               
                res.render('adminEditCourse',{dataCourse:dataCourse,dataClass:dataClass,id:courseId,allCategory:allCategory,categoryName:categoryName,notification:'success'});
            }
            else{
                if(checkResult.id==courseId){
                    if(formData.courseStatus=='notactive'){
                        console.log('chạy vào đây')
                        let changeAllClassStatus = await classService.changeStatusOfAllClass(courseId);
                    }
                    //Hàm thay đổi nội dung môn học
                    await courseService.processEditCourseById(courseId,formData);
                    const allCategory = await categoryService.getAllCategory();
                    let dataCourse = await courseService.getCourseById2(courseId);
            
                    let dataCategory = await categoryService.getCategoryInfoById2(dataCourse.categoryId);
                    let categoryName = dataCategory.categoryName;
                    let dataClass = await classService.getAllClassByCourseId(courseId);
                   
                    res.render('adminEditCourse',{dataCourse:dataCourse,dataClass:dataClass,id:courseId,allCategory:allCategory,categoryName:categoryName,notification:'success'});
                }
                else{
                    const allCategory = await categoryService.getAllCategory();
                    let dataCourse = await courseService.getCourseById2(courseId);
            
                    let dataCategory = await categoryService.getCategoryInfoById2(dataCourse.categoryId);
                    let categoryName = dataCategory.categoryName;
                    let dataClass = await classService.getAllClassByCourseId(courseId);
                   
                    res.render('adminEditCourse',{dataCourse:dataCourse,dataClass:dataClass,id:courseId,allCategory:allCategory,categoryName:categoryName,warning:'wrong'});
                }
            }
        
      
    }
    //[DELETE===disable]
    async disableCourse(req,res,next){
        let idCourse = req.params.id;
        //Disable all course
        
        //Disable all class in course
    }
    
}
module.exports = new courseController;