const {Class} =require('../models/index');
const {Category} =require('../models/index');
const {Course} =require('../models/index');
let {UserClass}= require('../models/index');
let {Lesson} = require('../models/index');
const userService = require('./userService');
class classService{
    async getAllClass(){
        let dataAllClass = [];
        let resultClass = await Class.findAll();
        resultClass.forEach(element => {
            dataAllClass.push(element.get());
        });
        return dataAllClass;
    }
    //Use Specificly for User // áp dụng cho trang cho học sinh
    async getAllClassSecond(){
        let dataAllClass = [];
        let resultClass = await Class.findAll({where:{classStatus:'active'}});
        resultClass.forEach(element => {
            dataAllClass.push(element.get());
        });
        return dataAllClass;
    }

    async getTeacherInfoByClassId(classId){
        let newInfo = await UserClass.findOne({
            where:{
                classId:classId,
                status:'teaching'
            }
        });
        if(newInfo){
            let teacherInfo = await userService.getUserInfoById(newInfo.get().userId);
            return teacherInfo;
        }
        else{
            return "";
        }
    }

    //checkClassActiveWithID
    async checkClassActiveByClassId(classId){
        let classCheck = Class.findOne({where:{
            id:classId,
            classStatus:'active'
        }})
        if(classCheck){
            return classCheck.get();
        }
        else{
            return false;
        }
    }

    async getAllClassByCourseId(courseId){
        let dataClass = [];
        let resultClass = await Class.findAll({where:{
            courseId:courseId
        }})
        resultClass.forEach(element => {
            dataClass.push(element.get());
        });
        return dataClass;
    }
    //Dùng cho việc hiển thị // Chỉ hiển thị những khóa học đang active
    async getAllClassByCourseIdSecond(courseId){
        let dataClass = [];
        let resultClass = await Class.findAll({where:{
            courseId:courseId,
            classStatus:'active'
        }})
        resultClass.forEach(element => {
            dataClass.push(element.get());
        });
        return dataClass;
    }
    //Hàm chạy phía user 
    async getAllClassDataWithCategoryId(categoryId){
        //Thử nghiệm lấy dữ liệu từ quan hệ n-n trong sequelize
        let courseId = [];
        let dataCourse = [];
        let dataClass = [];
        let dataClassSecond = [];
        await Category.findByPk(categoryId,{include:['coursebb']}).then((category)=>{
             dataCourse = category.get().coursebb;
            
        }).catch((err)=>{console.log("Có lỗi xáy ra trong hệ thống")});
        dataCourse.forEach((element)=>{
            courseId.push(element.get().id);
        })
        console.log("Thông tin courseId");
        //console.log(courseId);
        await Course.findAll({where:{id:courseId,courseStatus:'active'},include:['classes']}).then((course)=>{
            course.forEach((newCourse)=>{
                let tempData = newCourse.get().classes;
                tempData.forEach((elementTempData)=>{
                    dataClass.push(elementTempData.get());
                })
            })
        })
        console.log('Thông tin dataClass khi load dữ liệu từ user');
        console.log(dataClass);
        if(dataClass.length!=0){
            for(let i =0 ; i<dataClass.length ; i++){
                if(dataClass[i].classStatus=='active'){
                    dataClassSecond.push(dataClass[i]);
                }
            }
        }
        return dataClassSecond;
    }
    //Get all class on Processing status
    async getAllClassOnProcessing(){
        let dataOnProcessingClass = [];
        let onProcessingResult = await UserClass.findAll({
            where:{
                status:'onProcessing'
            }
        })
        onProcessingResult.forEach((element)=>{
            dataOnProcessingClass.push(element.get());
        })
        return dataOnProcessingClass;
    }
    //Create Class
    async createClass(courseId,formData){
        let resultInfoClass;
        await Class.create({
            className: formData.className,
            courseId:courseId,
            classStatus:formData.classStatus,
            dayStart : formData.dayStart,
            dayEnd : formData.dayEnd,
            classDescription : formData.classDescription,
            classAvatarImg : formData.assignLink,
            classPrice : 0
        }).then((newClass)=>{
            resultInfoClass = newClass.get();
            console.log(newClass.get())
        }).catch((err)=>{
            console.log('there is problem in model 3')
        })
        return resultInfoClass;
    }
    //Edit Class
    async editClass(idClass,formData){
        let classInfo = await Class.findOne({where:{id:idClass}});
        
        if(!classInfo){
            console.log('Không tồn tại class');
        }
        else{
            classInfo.className = formData.className;
            classInfo.classStatus = formData.classStatus;
            classInfo.dayStart = formData.dayStart;
            classInfo.dayEnd = formData.dayEnd;
            
            if(formData.assignLink){
                
                classInfo.classAvatarImg = formData.assignLink;
            }
            classInfo.classDescription = formData.classDescription;
            await classInfo.save();
        }
        return "blo";
    }
    async getIdClassByCourseId(courseId){
        let dataId = [];
        let resultClass = await Class.findAll({where:{
            courseId:courseId
        }})
        resultClass.forEach(element => {
            dataId.push(element.get().id);
        });
        return dataId;
    }
    async checkIdClassOnProcessing(dataId,userId){
        let resultId = [];
        for(let i=0;i<dataId.length;i++ ){
            try {
                let classInfo = await UserClass.findOne({
                    where:{
                        userId:userId,
                        classId:dataId[i],
                        status:'onProcessing'
                    }
                })
                if(classInfo){
                    resultId.push(dataId[i]);
                }
                
            } catch (error) {
                console.log('Có lỗi xảy ra khi xử lý dữ liệu')
            }
        }
        return resultId;
    }
    async checkIdClassRefused(dataId,userId){
        let resultId = [];
        for(let i=0;i<dataId.length;i++ ){
            try {
                let classInfo = await UserClass.findOne({
                    where:{
                        userId:userId,
                        classId:dataId[i],
                        status:'refused'
                    }
                })
                if(classInfo){
                    resultId.push(dataId[i]);
                }
                
            } catch (error) {
                console.log('Có lỗi xảy ra khi xử lý dữ liệu')
            }
        }
        return resultId;
    }
    async getDataById(idClass){
        let dataDetailClass = await Class.findOne({where:{
            id:idClass
        }})
        if(dataDetailClass){
            
            return dataDetailClass.get();
        }
        else{
            return false;
        }
    }
    //for admin when refused request in class
    async refuseRequestById(idRequest){
        let detailRequest = await UserClass.findOne({where:{
            id:idRequest
        }})
        if(detailRequest){
            detailRequest.status = 'refused';
            await detailRequest.save();
        }
        return "DeleteSuccessfully";
    }
    async acceptRequestById(idRequest){
        let detailRequest = await UserClass.findOne({where:{
            id:idRequest
        }})
        if(detailRequest){
            detailRequest.status = 'active';
            await detailRequest.save();
        }
        return "DeleteSuccessfully";
    }
    async getMyClassInfoId(userId){
        let myClassInfoId = [];
        let result = await UserClass.findAll({
            where:{
                userId:userId,
                status:'active'
            }
        })
        result.forEach((element)=>{
            myClassInfoId.push(element.get().classId);
        })
        return result;
    }
    async getMyClassInfoStatistic(userId){
        let myClassInfo = [];
        let result = await UserClass.findAll({
            where:{
                userId:userId,
                status:'active'
            }
        })
        if(result){
            for(let i =0 ; i<result.length ; i++){
                myClassInfo.push(result[i].get())
            }
            return myClassInfo;
        }
        else{
            return [];
        }
    }
    //Thống kê người học trong lớp học ở trạng thái active
    async getUserFromClass(classId){
        let userInfoSet = [];
        let result = await UserClass.findAll({
            where:{
                classId:classId,
                status:'active'
            }
        })
        if(result){
            for(let m = 0 ; m <result.length ; m++){
                userInfoSet.push(result[m].get().userId);
            }
            return userInfoSet;
        }
        else{
            return [];
        }
    }
    //Lấy toàn bộ người học ở trạng thái block trong hệ thống
    async getUserFromClassSecond(classId){
        let userInfoSet = [];
        let result = await UserClass.findAll({
            where:{
                classId:classId,
                status:'block'
            }
        })
        if(result){
            for(let m = 0 ; m <result.length ; m++){
                userInfoSet.push(result[m].get().userId);
            }
            return userInfoSet;
        }
        else{
            return [];
        }
    }

    async getClassTeachingId(userId){
        let teachingClassId = [];
        let result = await UserClass.findAll({
            where:{
                userId:userId,
                status:'teaching'
            }
        })
        result.forEach((element)=>{
            teachingClassId.push(element.get().classId)
        })
        return teachingClassId;
    }
    async addUserToClass(UserId,idClass){
        await UserClass.create({
            userId:UserId,
            classId:idClass,
            status :"onProcessing"
        }).then((newUserClass)=>{
            console.log(newUserClass.get())
        }).catch((err)=>{
            console.log('there is problem in model 1')
        })    
    }
    async addUserToClassDirect(UserId,idClass){
        await UserClass.create({
            userId:UserId,
            classId:idClass,
            status :"active"
        }).then((newUserClass)=>{
            console.log(newUserClass.get())
        }).catch((err)=>{
            console.log('there is problem in model 1')
        })    
    }
    async addTeacherToClass(userId,idClass){
        await UserClass.create({
            userId:userId,
            classId:idClass,
            status :"teaching"
        }).then((newUserClass)=>{
            console.log(newUserClass.get())
        }).catch((err)=>{
            console.log('there is problem in model 2')
        })    
        return "Đã thêm giáo viên thành công";
    }
    async checkTeacherWithClass(idClass){
        let checkResult = await UserClass.findOne({where:{
            
            classId:idClass,
            status:'teaching'
        }})
        if(checkResult){
            return checkResult.get();
        }
        else{
            return false;
        }
    }
    async changeTeacherToClass(userId,idClass){
        let checkResult = await UserClass.findOne({where:{
            
            classId:idClass,
            status:'teaching'
        }});
        if(checkResult){
                
            checkResult.userId=userId;
            await checkResult.save();
        }
        else{
            return "";
        }
    }
    async deleteClassByClassId(classId){
        let classDeleteResult = await Class.destroy({
            where:{id:classId}
        });
        return "Delete Class successfully";
    }
    async checkUserInClass(userId,classId){
        let checkResult = await UserClass.findOne({
            where:{
                userId:userId,
                classId:classId
            }
        });
        if(checkResult){
            return checkResult.get();
        }
        else{
            return false;
        }
    }
    async getIdLessonByClassId(classId){
        let lessonId = [];
        let lessonInfo = await Lesson.findAll({
            where:{
                classId:classId
            }
        });
        lessonInfo.forEach((element)=>{
            lessonId.push(element.get().id);
        })
        return lessonId;
    }
    async changeStatusOfAllClass(courseId){
        let allClass = await Class.findAll({
            where:{courseId:courseId,classStatus:'active'}
        });
        console.log('Thoognt in all class');
        if(allClass){
            for(let i = 0 ; i<allClass.length;i++){
                allClass[i].classStatus='notactive';
                await allClass[i].save();
            }
        }
        else{
            return "";
        }
    }
    //BLock user in class--courses
    async blockUserInClass(userId,classId){
        let userInClass = await UserClass.findOne({
            where:{
                userId:userId,
                classId:classId,
                status:'active'
            }
        });
        userInClass.status='block';
        await userInClass.save();
        return 'Block User successfully';
    }
    async unblockUserInClass(userId,classId){
        let userInClass = await UserClass.findOne({
            where:{
                userId:userId,
                classId:classId,
                status:'block'
            }
        });
        userInClass.status='active';
        await userInClass.save();
        return 'UNBlock User successfully';
    }
    formatDate (input) {
        var datePart = input.match(/\d+/g),
        year = datePart[0].substring(2), // get only two digits
        month = datePart[1], day = datePart[2];
      
        return day+'/'+month+'/'+year;
    }
}
module.exports = new classService;