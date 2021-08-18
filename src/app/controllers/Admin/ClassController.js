const userService = require('../../../services/userService');
const classService = require('../../../services/classService');
const courseService = require('../../../services/courseService');
const lessonService = require('../../../services/lessonService');
const categoryService = require('../../../services/categoryService');
const lessonTestService = require('../../../services/lessonTestService');
const lessonQuestionService = require('../../../services/lessonQuestionService');

class classController{
    //Update 27.05/2021 --Tran Minh Son //redo documentation
    //[GET] get all course
    async getAllCourseByTeacher(req,res,next){
        let idUser = req.cookies.iduser;
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let teachingClassId = await classService.getClassTeachingId(idUser);
        let dataTeacherClass = [];
        for(let j = 0 ; j<teachingClassId.length ; j++){
            
            let classInfo = await classService.getDataById(teachingClassId[j]);
            dataTeacherClass.push(classInfo);
        }
        if(dataTeacherClass.length!=0){
            for(let index = 0 ; index <dataTeacherClass.length ; index++){
                dataTeacherClass[index].dayStart = await classService.formatDate(dataTeacherClass[index].dayStart);
                dataTeacherClass[index].dayEnd = await classService.formatDate(dataTeacherClass[index].dayEnd);
            }
        }
        //console.log('Thông tin teachingId');
        //console.log(teachingClassId);
        //console.log(dataTeacherClass);
        res.render('teacherManageCourse',{dataTeacherClass:dataTeacherClass,userInfo:userInfo});
    }
    //[GET] get course for teacher (use for Student)
    async getAllCourseByTeacherForUser(req,res,next){
        let teacherId = req.params.id;
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let teachingClassId = await classService.getClassTeachingId(teacherId);
        let dataTeacherClass = [];
        for(let j = 0 ; j<teachingClassId.length ; j++){
            
            let classInfo = await classService.getDataById(teachingClassId[j]);
            dataTeacherClass.push(classInfo);
        }
        //console.log('Thông tin teachingId');
        //console.log(teachingClassId);
        //console.log(dataTeacherClass);
        console.log(dataTeacherClass);
        res.render('userTeacherCourse',{layout:'backend',dataTeacherClass:dataTeacherClass,userInfo:userInfo})
    }
    
    //[GET] Admin EditClass
    async edit(req,res,next){
        //This is id of class
        let idClass = req.params.id;
        let dataClass = await classService.getDataById(idClass);
        //Check xem trước là teacher có tồn tại trong class hay không?
        let teacherInClass = await userService.checkTeacherInClass(idClass);
        if(!teacherInClass){
            console.log(dataClass.courseId);
            let dataTeacher = await courseService.getUserByIdCourse(dataClass.courseId);
            console.log('Check data Teacher');
            console.log(dataTeacher);
            let resultTeacher = [];
            let infoTeacher = [];
            for(let i = 0 ; i<dataTeacher.length;i++){
                let result = await userService.checkTeacher(dataTeacher[i]);
                if(result){
                    resultTeacher.push(dataTeacher[i])
                }
            }
            for (let j=0;j<resultTeacher.length;j++){
                let newOne = await userService.getUserInfoById(resultTeacher[j]);
                infoTeacher.push(newOne);
            }
            console.log('TN2');
            let dataLesson = await lessonService.getAllLessonByClassId(idClass);
            res.render('adminEditClass',{dataClass:dataClass,dataLesson:dataLesson,idClass:idClass,infoTeacher:infoTeacher});
        }
        //Nếu có hiển thị teacher //Nếu không -->Show hết các lựa chọn ra
        else{
            let dataTeacher = await courseService.getUserByIdCourse(dataClass.courseId);
            let resultTeacher = [];
            let infoTeacher = [];
            for(let i = 0 ; i<dataTeacher.length;i++){
                let result = await userService.checkTeacher(dataTeacher[i]);
                if(result){
                    resultTeacher.push(dataTeacher[i])
                }
            }
            for (let j=0;j<resultTeacher.length;j++){
                let newOne = await userService.getUserInfoById(resultTeacher[j]);
                infoTeacher.push(newOne);
            }

            let infoExistTeacher = await userService.checkTeacher(teacherInClass.userId);
            let dataLesson = await lessonService.getAllLessonByClassId(idClass);
            res.render('adminEditClass',{dataClass:dataClass,dataLesson:dataLesson,idClass:idClass,infoExistTeacher:infoExistTeacher,infoTeacher:infoTeacher});
        }
        
    }
    async processEdit(req,res,next){
        let formData = req.body;
        let classNameh = formData.className;
        let classStatush = formData.classStatus;
        let dayStart = formData.dayStart;
        let dayEnd = formData.dayEnd;
        let assignLinkh = formData.assignLink;
        //Lấy link của giáo viên
        let idTeacher = formData.classTeacher;

        console.log('Thông tin của idTeacher');
        console.log(idTeacher);
        console.log('thông tin assignlink');
        let classDescriptionh = formData.classDescription;
        let idClass = req.params.id;
        let dataClass = await classService.getDataById(idClass);
        let dataTeacher = await courseService.getUserByIdCourse(dataClass.courseId);
        let resultTeacher = [];
        let infoTeacher = [];
        for(let i = 0 ; i<dataTeacher.length;i++){
            let result = await userService.checkTeacher(dataTeacher[i]);
            if(result){
                resultTeacher.push(dataTeacher[i])
            }
        }
        //Xử lý thông tin teacher
        for (let j=0;j<resultTeacher.length;j++){
            let newOne = await userService.getUserInfoById(resultTeacher[j]);
            infoTeacher.push(newOne);
        }
        let dataClassb = await classService.getDataById(idClass);
        let dataLesson = await lessonService.getAllLessonByClassId(idClass);
        //Trường hợp có 1 số trường trống
        if(classNameh.length==0||classStatush=='Chọn trạng thái'||classDescriptionh.length==0){
            console.log('TRƯỜNG HỢP 1');
            let dataClass2 = await classService.getDataById(idClass);
            res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,warning:'fail'});
        }
        else{
            //Trong trường hợp có dữ liệu thay đổi
            if(dataClassb.className!=classNameh||dataClassb.classStatus!=classStatush||dataClassb.assignLink!=assignLinkh||dataClassb.classDescription!=classDescriptionh){
                let dataClassfa = await classService.editClass(idClass,formData);
                let checkResult = await classService.checkTeacherWithClass(idClass);
                if(!checkResult){
                    if(idTeacher){
                        console.log('sai ở đây');
                        let addTeacher = await classService.addTeacherToClass(idTeacher,idClass);
                    }
                   
                }
                else{
                    console.log('wrong here');
                    
                    console.log(idTeacher);
                    let changeTeacher = await classService.changeTeacherToClass(idTeacher,idClass);
                }
                console.log('fdjksfhsk');
                let checkResult2 = await classService.checkTeacherWithClass(idClass);
                let infoExistTeacher;
                if(checkResult2){
                     infoExistTeacher = await userService.checkTeacher(checkResult2.userId);
                }
               
                console.log('TRƯỜNG HỢP 2');
                let dataClass2 = await classService.getDataById(idClass);
                console.log('Thông tin dataclass2');
                //console.log(dataClass2);
                if(infoExistTeacher){
                    res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,notification:'success',infoTeacher:infoTeacher,infoExistTeacher:infoExistTeacher});
                }
                else{
                    res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,notification:'success',infoTeacher:infoTeacher});
                }
                
            }
            //Trường hợp không có dữ liệu thay đổi
            else{
                console.log('TRƯỜNG HỢP 3');
                let dataClass2 = await classService.getDataById(idClass);
                res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,notificationsecond:'success'});
            }
            
        }
        
    }
    //[GET] create new class get page
    async create(req,res,next){
        //This is course id
        let idCourse = req.params.id;
        res.render('adminCreateClass',{idCourse:idCourse});
    }
    async processCreate(req,res,next){
        let idCourse = req.params.id;
        let formData = req.body;
        let className = formData.className;
        let classStatus = formData.classStatus;
        let dayStart = formData.dayStart;
        let dayEnd = formData.dayEnd;
        let assignLink = formData.assignLink;
        let classDescription = formData.classDescription;
        if(className.length==0||classStatus=='Chọn trạng thái'||assignLink.length==0||classDescription.length==0){
            res.render('adminCreateClass',{idCourse:idCourse,warning:'wrong notification'});
        }
        else{
            let resultInfoClass = await classService.createClass(idCourse,formData);
            
            console.log(resultInfoClass.id);
            res.render('adminCreateClass',{idCourse:idCourse,notification:'sucess'});
        }
    }
    async getAllInfoClassTeacher(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let idClass = req.params.id;
        let classInfo = await classService.getDataById(idClass);
        let dataLesson = await lessonService.getAllLessonByClassId(idClass);
        if(dataLesson.length!=0){
            for(let index = 0 ; index <dataLesson.length ; index++){
                dataLesson[index].createdAt=dataLesson[index].createdAt.getDate()+"/"+dataLesson[index].createdAt.getMonth()+"/"+dataLesson[index].createdAt.getFullYear()+" "+dataLesson[index].createdAt.getHours()+":"+dataLesson[index].createdAt.getMinutes();
            }
        }
        res.render('teacherManageLesson',{dataLesson:dataLesson,userInfo:userInfo,classInfo:classInfo})
    }
    
    //[POST] Delete request to a class
    async deleteRequestToClass(req,res,next){
        console.log('Hello mottr');
        let idRequest = req.params.id;
        let refusedResult = await classService.refuseRequestById(idRequest);

           //Yêu cầu lấy tất cả khóa học ở trạng thái Onprocessing
           let dataOnProcessingClass = await classService.getAllClassOnProcessing();
           let dataInvoice = []
           for(let j = 0; j<dataOnProcessingClass.length;j++){
               let invoiceElement = {};
               invoiceElement.idInvoice = dataOnProcessingClass[j].id;
               let foundUser = await userService.getUserInfoById(dataOnProcessingClass[j].userId);
               let foundClass = await classService.getDataById(dataOnProcessingClass[j].classId);
               invoiceElement.className=foundClass.className;
               invoiceElement.email=foundUser.email;
               invoiceElement.userId = foundUser.id;
                invoiceElement.classId = foundClass.id;
                if(foundUser.birthday){
                    invoiceElement.birthday = await classService.formatDate(foundUser.birthday);
                }
                if(foundUser.address){
                    console.log('chạy vào 1');
                    invoiceElement.address = JSON.parse(foundUser.address).detailAddress+","+JSON.parse(foundUser.address).district+","+JSON.parse(foundUser.address).province;
                }
                else{
                    console.log('chạy vào 2');
                    invoiceElement.address=foundUser.address;
                }
                invoiceElement.classPrice=foundClass.classPrice;
                dataInvoice.push(invoiceElement);
           }
           console.log('Thông tin data invoice');
           //console.log(dataInvoice);
           res.status(200).json({bla:dataInvoice})
           
    }
    //[POST] Confirm request to class
    async confirmRequestToClass(req,res,next){
        let idRequest = req.params.id;
        let refusedResult = await classService.acceptRequestById(idRequest);

           //Yêu cầu lấy tất cả khóa học ở trạng thái Onprocessing
           let dataOnProcessingClass = await classService.getAllClassOnProcessing();
           let dataInvoice = []
           for(let j = 0; j<dataOnProcessingClass.length;j++){
               let invoiceElement = {};
               invoiceElement.idInvoice = dataOnProcessingClass[j].id;
               let foundUser = await userService.getUserInfoById(dataOnProcessingClass[j].userId);
               let foundClass = await classService.getDataById(dataOnProcessingClass[j].classId);
               invoiceElement.className=foundClass.className;
               invoiceElement.email=foundUser.email;
               invoiceElement.userId = foundUser.id;
                invoiceElement.classId = foundClass.id;
                if(foundUser.birthday){
                    invoiceElement.birthday = await classService.formatDate(foundUser.birthday);
                }
                if(foundUser.address){
                    console.log('chạy vào 1');
                    invoiceElement.address = JSON.parse(foundUser.address).detailAddress+","+JSON.parse(foundUser.address).district+","+JSON.parse(foundUser.address).province;
                }
                else{
                    console.log('chạy vào 2');
                    invoiceElement.address=foundUser.address;
                }
                invoiceElement.classPrice=foundClass.classPrice;
                dataInvoice.push(invoiceElement);
           }
           console.log('Thông tin data invoice');
           //console.log(dataInvoice);
           res.status(200).json({bla:dataInvoice})
    }
    //Hàm xử lý cho việc xóa khóa học --actually lớp học trong hệ thống
    async processDelete(req,res,next){
        let courseId = req.body.courseId;
        let classId = req.params.id;
        //Thực hiện xóa toàn bộ class trong hệ thống
        let classDeleteResult = await classService.deleteClassByClassId(classId);
        //Thực hiện lấy toàn bộ class trong hệ thống
        let classInfo = await classService.getAllClassByCourseId(courseId);
        res.status(200).json({bla:classInfo});
    }

    //Hàm xử lý cho trang chủ của người dùng user
    async getAllClassByCategoryId(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let categoryId = req.params.id;
        let allCategory = await categoryService.getAllCategory();
        let dataClass = await classService.getAllClassDataWithCategoryId(categoryId);
        if(dataClass.length!=0){
            for(let j = 0 ; j<dataClass.length;j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClass[j].id);
                dataClass[j].infoTeacher = infoTeacher;
            }
        }
        const allCourse = await courseService.getAllCourse();
        res.render('userGetCourseByCategory',{layout:'backend',dataClass:dataClass,allCategory:allCategory,userInfo:userInfo,allCourse:allCourse});
    }

    async getAllReload(req,res,next){
        
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let allCategory = await categoryService.getAllCategory();
        const allCourse = await courseService.getAllCourse();
        res.render('userAllCourse',{layout:'backend',allCategory:allCategory,allCourse:allCourse,userInfo:userInfo});
    }
    //Lấy dữ liệu khóa học theo môn
    async fetchDataCourse(req,res,next){
        let courseId = req.params.id;
        let dataClass = await classService.getAllClassByCourseId(courseId);
        if(dataClass.length!=0){
            for(let j = 0 ; j<dataClass.length;j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(dataClass[j].id);
                dataClass[j].infoTeacher = infoTeacher;
            }
        }
        res.status(200).json({bla:dataClass});
    }
    //Hàm xử lý cho việc tìm kiếm khóa học từ user
    async getClassByClassName(req,res,next){
        let formData = req.body;
        let foundCourse;
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        //Kí tự chạy từ 1 đến 3 có thế phù hợp
        if(formData.findCourse.length>=4){
         foundCourse = formData.findCourse.slice(1,4);
        }
        if(formData.findCourse.length<4){
            foundCourse = formData.findCourse.slice(1,3);
        }
        if(formData.findCourse.length==0){
            foundCourse = '';
        }
        let re = new RegExp(foundCourse,"i");
        let resultFoundClass = [];
        let dataAllClass = await classService.getAllClassSecond();

        dataAllClass.forEach((element)=>{
            if(re.test(element.className.toLowerCase())){
                resultFoundClass.push(element);
            }
        })
        //Append thêm thông tin giáo viên
        if(resultFoundClass.length!=0){
            for( let j =0 ; j<resultFoundClass.length; j++){
                let infoTeacher = await classService.getTeacherInfoByClassId(resultFoundClass[j].id);
                resultFoundClass[j].infoTeacher = infoTeacher;
            }
        }
        console.log('Thông tin');
        console.log(resultFoundClass);
        let allCategory = await categoryService.getAllCategory();
        const allCourse = await courseService.getAllCourse();
        res.render('userAllCourse',{layout:'backend',dataAllClass:resultFoundClass,allCategory:allCategory,allCourse:allCourse,userInfo:userInfo});
    }
    //Xem vấn đề lịch sử của khóa học khi biết mã khóa học
    async viewOverallHistory(req,res,next){
                
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let classId = req.params.id;
        let dataClassp = await classService.getDataById(classId);
        let allLesson = await lessonService.getAllLessonByClassId(classId);
        let lessonIdResult = await classService.getIdLessonByClassId(classId);
        console.log('thông tin lesson Id');
        
        //Hơi thừa khi xử lý dl
        let data = [];
        //Lấy tất cả các mã đề theo tiết
        let lessonTestIdInfoSet = [];
        let lessonQuestionIdInfoSet = [];
        
        //Hàm lấy mã đề trong tiết học
        if(lessonIdResult.length!==0){
            for(let k = 0 ; k<lessonIdResult.length ; k++){
                let lessonTestIdInfo = await lessonTestService.getAllTestIdByLessonId(lessonIdResult[k]);
                console.log("Thông tin trả về");
                lessonTestIdInfoSet.push(lessonTestIdInfo);
            }
        }
        //Hàm lấy mã câu hỏi trong tiết học
        if(lessonIdResult.length!==0){
            for(let k = 0 ; k<lessonIdResult.length ; k++){
                let lessonQuestionIdInfo = await lessonQuestionService.getAllQuestionIdByLessonId(lessonIdResult[k]);
                console.log("Thông tin trả về");
                lessonQuestionIdInfoSet.push(lessonQuestionIdInfo);
            }
        }
        //Hàm lấy mã câu hỏi theo tiết học
        //console.log('Thông tin lesson Test theo lesson là');
        // console.log(lessonTestIdInfoSet);
        //console.log('Thông tin MÃ CÂU HỎI theo tiết học là');
        // console.log(lessonQuestionIdInfoSet);
       //Use query parameter for pagination    
       const page = parseInt(req.query.page)||1; //number of page
       const perPage = 4; //element for each page
       const start = (page-1)*perPage;
       const end = page*perPage;
        allLesson = allLesson.slice(start,end);
       let previousPage = page-1;
       if(previousPage<=0){
           previousPage =1;
       }
       const nextPage = page+1;

        res.render('userHistoryOverall',{layout:'backend',userInfo:userInfo,allLesson:allLesson,dataClassp:dataClassp,previousPage:previousPage,nextPage:nextPage});
    }
    
    async viewDetailHistoryLesson(req,res,next){
        let lessonId = req.params.id;
        let lessonInfo = await lessonService.getDataLessonById(lessonId);
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let historyIdInfo = []
        //Lấy id test từ lessonId
        let lessonTestIdInfo = await lessonTestService.getAllTestIdByLessonId(lessonId);
        if(lessonTestIdInfo.length>1){
            for(let i =1 ; i<lessonTestIdInfo.length ; i++){
               
                historyIdInfo.push(lessonTestIdInfo[i]);
            }
        }
        console.log(lessonTestIdInfo);
        let resultInfo = await lessonTestService.getTestResultByTestId(userId,historyIdInfo);
        const page = parseInt(req.query.page)||1; //number of page
        const perPage = 8; //element for each page
        const start = (page-1)*perPage;
        const end = page*perPage;
            resultInfo = resultInfo.slice(start,end);
        let previousPage = page-1;
        if(previousPage<=0){
            previousPage =1;
        }
        const nextPage = page+1;
        res.render('userHistoryDetailResultLesson',{layout:'backend',resultInfo:resultInfo,userInfo:userInfo,lessonName:lessonTestIdInfo[0],lessonId:lessonId,lessonInfo:lessonInfo,previousPage:previousPage,nextPage:nextPage});
    }
    //view falseQuestion of User
    async viewFalseQuestion(req,res,next){
        let lessonId = req.params.id;
        console.log(lessonId);
        let userId = req.cookies.iduser;
        let lessonInfo = await lessonService.getDataLessonById(lessonId);
        let falseQuestionInfo = [];
        let userInfo = await userService.getUserInfoById(userId);
        let lessonQuestionIdInfo = await lessonQuestionService.getAllQuestionIdByLessonId(lessonId);
        if(lessonQuestionIdInfo.length>1){
            for (let j =1 ; j<lessonQuestionIdInfo.length ; j++){
                falseQuestionInfo.push(lessonQuestionIdInfo[j]);
            }
        }
        let resultFalseQuestion = await lessonQuestionService.getFalseQuestion(userId,falseQuestionInfo);
        if(resultFalseQuestion.length!==0){
            for (let m = 0 ; m<resultFalseQuestion.length;m++){
                let questionInfo = await lessonQuestionService.getDetailQuestion(resultFalseQuestion[m].lessonQuestionId);
                resultFalseQuestion[m].moreInfo = questionInfo;
            }
        }

        const page = parseInt(req.query.page)||1; //number of page
        const perPage = 8; //element for each page
        const start = (page-1)*perPage;
        const end = page*perPage;
            resultFalseQuestion = resultFalseQuestion.slice(start,end);
        let previousPage = page-1;
        if(previousPage<=0){
            previousPage =1;
        }
        const nextPage = page+1;
       

        res.render('userViewFalseQuestion',{layout:'backend',resultFalseQuestion:resultFalseQuestion,userInfo:userInfo,lessonInfo:lessonInfo,previousPage:previousPage,nextPage:nextPage,lessonId:lessonId})
    }

    //Hiển thị những người học hiện có trong khóa học
    async viewStudentActiveInCourse(req,res,next){
        let idClass = req.params.id;
        let allStudentInfo = [];
        let studentActive = []
        let dataClass = await classService.getDataById(idClass);
         allStudentInfo = await classService.getUserFromClass(idClass);
        if(allStudentInfo.length!=0){
            for(let i =0 ; i<allStudentInfo.length ; i++){
                let newOne = await userService.getUserInfoById(allStudentInfo[i]);
                studentActive.push(newOne);
            }
        }
        res.render('adminViewStudentActiveInCourse',{dataClass:dataClass,studentActive:studentActive,idClass:idClass});
    }
    async viewStudentBlockInCourse(req,res,next){
        let idClass = req.params.id;
        let allStudentInfo = [];
        let studentBlock = []
        let dataClass = await classService.getDataById(idClass);
         allStudentInfo = await classService.getUserFromClassSecond(idClass);
        if(allStudentInfo.length!=0){
            for(let i =0 ; i<allStudentInfo.length ; i++){
                let newOne = await userService.getUserInfoById(allStudentInfo[i]);
                studentBlock.push(newOne);
            }
        }
        res.render('adminViewStudentBlockInCourse',{dataClass:dataClass,studentBlock:studentBlock,idClass:idClass});
    }
    //Manage Student in course -- Quản lý học sinh trong khóa học
    //[GET] Add students to course page
    async addStudentsToCourse(req,res,next){
        //Lấy id của khóa học
        let classId = req.params.id;
        let classInfo = await classService.getDataById(classId);
        let allStudentTemp1 = [];
        let allStudentResult = [];
        let allStudentActive = await userService.getAllStudentActive();
        //Lấy toàn bộ người active trong khóa học
        let allUserActiveInClass = await classService.getUserFromClass(classId);
        //Lấy toàn bộ người bị block trong khóa học
        let allUserBlockInClass = await classService.getUserFromClassSecond(classId);
        console.log(allStudentActive);
        console.log(allUserActiveInClass);
        console.log(allUserBlockInClass);
        if(allUserActiveInClass.length!=0){
                for(let j = 0 ; j<allStudentActive.length ; j++ )
                {
                    let flag = false;
                    for(let i = 0 ; i <allUserActiveInClass.length ; i++){
                        if(allStudentActive[j].id==allUserActiveInClass[i]){
                            flag = true;
                        }
                    }
                    if(!flag){
                        allStudentTemp1.push(allStudentActive[j])
                    }
                }
        }
        if((allUserBlockInClass.length!=0)&&(allStudentTemp1.length!=0)){
            for(let j = 0 ; j<allStudentTemp1.length ; j++ )
            {
                let flag = false;
                for(let i = 0 ; i <allUserBlockInClass.length ; i++){
                    if(allStudentTemp1[j].id==allUserBlockInClass[i]){
                        flag = true;
                    }
                }
                if(!flag){
                    allStudentResult.push(allStudentTemp1[j]);
                }
            }
        }
        else{
            allStudentResult=allStudentTemp1;
        }
        
        res.render('adminAddStudentsToCourse',{allStudentResult:allStudentResult,idClass:classId,classInfo:classInfo});
    }
    //[POST] Đây là trang xử lý việc thêm người học vào khóa
    async processAddStudentsToCourse(req,res,next){
        //Lấy ra được id của môn học từ class
        let classId = req.body.classId;
        console.log('Thông tin classId');
        console.log(classId);
        let userId = req.params.id;
        console.log('Thông tin userId');
        console.log(userId);
        let classInfo = await classService.getDataById(classId);
        let subjectId = classInfo.courseId;
        
        let checkUserSubjectResult = await courseService.addUserToCourse(userId,subjectId);
        let userAddToCourse = await classService.addUserToClassDirect(userId,classId);
        
        //Lấy ra dữ liệu người chưa tham gia khóa học
        let allStudentTemp1 = [];
        let allStudentResult = [];
        let allStudentActive = await userService.getAllStudentActive();
        //Lấy toàn bộ người active trong khóa học
        let allUserActiveInClass = await classService.getUserFromClass(classId);
        //Lấy toàn bộ người bị block trong khóa học
        let allUserBlockInClass = await classService.getUserFromClassSecond(classId);
        console.log('Hiện đang ở vị trí này');
        if(allUserActiveInClass.length!=0){
                for(let j = 0 ; j<allStudentActive.length ; j++ )
                {
                    let flag = false;
                    for(let i = 0 ; i <allUserActiveInClass.length ; i++){
                        if(allStudentActive[j].id==allUserActiveInClass[i]){
                            flag = true;
                        }
                    }
                    if(!flag){
                        allStudentTemp1.push(allStudentActive[j])
                    }
                }
        }
        if((allUserBlockInClass.length!=0)&&(allStudentTemp1.length!=0)){
            for(let j = 0 ; j<allStudentTemp1.length ; j++ )
            {
                let flag = false;
                for(let i = 0 ; i <allUserBlockInClass.length ; i++){
                    if(allStudentTemp1[j].id==allUserBlockInClass[i]){
                        flag = true;
                    }
                }
                if(!flag){
                    allStudentResult.push(allStudentTemp1[j]);
                }
            }
        }
        else{
            allStudentResult=allStudentTemp1;
        }
        console.log('Thông tin student Result');
        res.status(200).json({bla:allStudentResult});
    }
    //[GET] Block Students to Course
    async blockStudentToCourse(req,res,next){
        let idClass = req.body.classId;
        let userId = req.params.id;
        let blockStudentInClass = await classService.blockUserInClass(userId,idClass);
        let allStudentInfo = [];
        let studentActive = []
        let dataClass = await classService.getDataById(idClass);
         allStudentInfo = await classService.getUserFromClass(idClass);
        if(allStudentInfo.length!=0){
            for(let i =0 ; i<allStudentInfo.length ; i++){
                let newOne = await userService.getUserInfoById(allStudentInfo[i]);
                studentActive.push(newOne);
            }
        }
        res.status(200).json({bla:studentActive});
    }

    async unblockStudentToCourse(req,res,next){
        let idClass = req.body.classId;
        let userId = req.params.id;
        let blockStudentInClass = await classService.unblockUserInClass(userId,idClass);
        let allStudentInfo = [];
        let studentBlock = [];
         allStudentInfo = await classService.getUserFromClassSecond(idClass);
        if(allStudentInfo.length!=0){
            for(let i =0 ; i<allStudentInfo.length ; i++){
                let newOne = await userService.getUserInfoById(allStudentInfo[i]);
                studentBlock.push(newOne);
            }
        }
        res.status(200).json({bla:studentBlock});
    }
}
module.exports = new classController;