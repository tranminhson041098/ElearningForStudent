const {Course} = require('../models/index');
const {UserCourse} = require('../models/index')
class courseService{
    //[Check CourseAvailble in System
    async checkCourseAvailable(courseName){
        const checkResult = await Course.findOne({
            where:{courseName:courseName}
        });
        if(checkResult){
            return checkResult.get();
        }
        else{
            return false;
        }
    }
    //[GET] Use for Admin and Teacher
    async getAllCourse(){
        const dataCourse = await Course.findAll();
        let allCourse = [];
        dataCourse.forEach(course => {
            allCourse.push(course.get());
        });
        return allCourse;
    }
    async createNewCourse(formData){
        await Course.create({
            courseName:formData.courseName,
            categoryId:formData.categoryId,
            courseStatus:formData.courseStatus,
            courseDescription:formData.courseDescription
            
        }).then((newCourse)=>{
            console.log(newCourse.get())
        }).catch((err)=>{
            console.log('there is problem in model')
        })
        return "Đã thêm thành công";
    }
    async addUserToCourse(UserId,idCourse){
        let check = await UserCourse.findOne({where:{
            userId:UserId,
            courseId:idCourse,
        }})
        if(!check){
            await UserCourse.create({
                userId:UserId,
                courseId:idCourse,
            }).then((newUserCourse)=>{
                console.log(newUserCourse.get())
            }).catch((err)=>{
                console.log('there is problem in model')
            })    
            return "Đã thêm trong CSDL"
        }
        else{
            return "";
        }

    }
    async getCourseByIdUser(userId){
        let dataUserCourse = [];
        await UserCourse.findAll({where:{
            UserId:userId
        }}).then((newUserCourse)=>{
            
            for(let i = 0 ; i<newUserCourse.length ; i++){
                dataUserCourse.push(newUserCourse[i].get().courseId);
            }
        }).catch((err)=>{
            console.log('có lỗi nhea')
        })
        return dataUserCourse;
    }
    
    async getUserByIdCourse(courseId){
        let dataUserCourseb = []
        await UserCourse.findAll({
            where:{courseId:courseId}
        }).then((newUserCourse)=>{
            console.log('THông tin mới');
            console.log(newUserCourse);
            for(let i = 0 ; i<newUserCourse.length ; i++){
                dataUserCourseb.push(newUserCourse[i].get().userId);
                
            }
        }).catch((err)=>{
            console.log('có lỗi nhea')
        })
        return dataUserCourseb;
        
    }
    async getCourseById(courseId){
        let courseDetail = await Course.findOne({where:{id:courseId}});
        return courseDetail;
    }
    async getCourseById2(courseId){
        let courseDetail = await Course.findOne({where:{id:courseId}});
        return courseDetail.get();
    }
    async getCourseNameById(courseId){
        let courseDetail = await Course.findOne({where:{id:courseId}});
        return courseDetail.courseName;
    }
    async getNumberUserForDetailCourse(courseId){
        let userCourseInfo = await UserCourse.findAll({where:{courseId:courseId}});
        //Trả về mảng
        return userCourseInfo.length;

    }
    async getCourseByName(courseName){
        let courseInfo = await Course.findOne({where:{courseName:courseName}})
        return courseInfo;
    }
    async processEditCourseById(courseId,formData){
        console.log('Thông tin courseId');
        let foundCourse = await Course.findOne({
            where:{id:courseId}
        });
        console.log('Thông tin foundcourse');
        console.log(foundCourse);
        if(foundCourse){
            foundCourse.courseName = formData.courseName;
            foundCourse.categoryId = formData.categoryId;
            foundCourse.courseStatus = formData.courseStatus;
            foundCourse.courseDescription = formData.courseDescription
            await foundCourse.save();
        }
        else{
            return "";
        }
    }
}
module.exports = new courseService;