const lesson = require('../../../models/lesson');
const lessonquestion = require('../../../models/lessonquestion');
const classService = require('../../../services/classService');
const lessonQuestionService = require('../../../services/lessonQuestionService');
const lessonService = require('../../../services/lessonService');
const lessonTestService = require('../../../services/lessonTestService');
const userService = require('../../../services/userService');

class lessonTestController{
    async getAllTest(req,res,next){
        let userId = req.cookies.iduser;
        let userInfo = await userService.getUserInfoById(userId);
        let lessonId = req.params.id;
        let lessonInfo = await lessonService.getDataLessonById(lessonId);
        let lessonTestInfo = await lessonTestService.getAllTestByLessonId(lessonId);
        let testInfo = await lessonTestService.getTestActiveInLesson(lessonId);
        
        let testIdActive = testInfo.id;
        res.render('teacherManageLessonTest',{testIdActive:testIdActive,lessonTestInfo:lessonTestInfo,idLesson:lessonId,userInfo:userInfo,lessonInfo:lessonInfo});
    }
    async processCreate(req,res,next){
        let lessonId = req.params.id;
        let formData = req.body;
        let result = await lessonTestService.createNewLessonTest(lessonId,formData);
        //Cho thêm 1 hàm chèn vào câu hỏi
        let lessonTestInfo = await lessonTestService.getAllTestByLessonId(lessonId);
        res.status(200).json({bla:lessonTestInfo});
    }
    async viewDetail(req,res,next){
        let testId = req.params.id;
        let data = await lessonTestService.getTestByTestId(testId);
       
        res.status(200).json({bla:data});
    }
    async processEdit(req,res,next){
        let lessonId = req.body.lessonId;
        let formData= req.body;
        console.log('lessonId la : ' +lessonId);
        let testId= req.params.id;
        console.log('testId la : ' +testId);
        let editResult = await lessonTestService.editLessonTestById(testId,formData);
        let lessonTestInfo = await lessonTestService.getAllTestByLessonId(lessonId);
        res.status(200).json({bla:lessonTestInfo});
    }
    //Hàm chuyển đổi trạng thái mã đề
    async changeStatus(req,res,next){
        
        let testId = req.params.id;
        let lessonId = req.query.lessonId;

        console.log('Kiểm tra thông tin testId');
        console.log(testId);
        let formData = req.body;
        //Xử lý trường hợp chưa có mã đề nào trong hệ thống cho tiết học

        console.log(formData);
        if(testId){
            let resultInfo = await lessonTestService.changeStatusByTestId(testId,formData.codese,lessonId);
            let changeTestIdQuestion =  await lessonTestService.changeTestIdForQuestion(lessonId,resultInfo.id)
        }
        else{
            let changeTestIdQuestion =  await lessonTestService.changeTestIdForQuestion(lessonId,formData.codese)
        }
        //console.log(resultInfo)
        //
        res.redirect('/teacher/manage-courses');
        
    }
    //Hàm xử lý xóa đề luyện tập
    async processDeleteTest(req,res,next){
        //Không thể xóa đề luyện tập ở trạng thái active  , bạn phải đổi mã đề
        let lessonId = req.body.lessonId;
        let testId = req.params.id;
        let resultCheck = await lessonTestService.checkStatusOfTest(testId);
        if(resultCheck){
            res.status(200).json({bla:'NoData'});
        }
        else{
            let result = await lessonTestService.deleteLessonTestById(testId);
            let lessonTestInfo = await lessonTestService.getAllTestByLessonId(lessonId);
            res.status(200).json({bla:lessonTestInfo});
        }
    }
    changeStatusNotAvailble(req,res,next){
        res.send('Vui Lòng tạo mã đề trước khi gửi lên hệ thống');
    }
    async getTestForLesson(req,res,next){
        let userId = req.cookies.iduser;
        
        let userInfo = await userService.getUserInfoById(userId);
        let numberOfQuestions = req.query.codese;
        let lessonId = req.params.id;
        let lessonInfo = await lessonService.getDataLessonById(lessonId);
        let classInfo = await classService.getDataById(lessonInfo.classId);
        let dataLessonQuestion = await lessonQuestionService.getAllQuestionByLessonId(lessonId);
        //cho chạy qua hàm random lấy random câu hỏi
        let dataTest = await lessonTestService.getTestActiveInLesson(lessonId);
        let lessonTestId = dataTest.id;
        let userTestResult = lessonTestService.getRandom(dataLessonQuestion,numberOfQuestions);
        console.log(userTestResult);
        // console.log(lessonTestService.getRandom(arr,n));
        //res.send('Trang làm bài bla của người dùng');
        res.render('userDoTest',{layout:'backend',userTestResult:userTestResult,dataTest:dataTest,lessonTestId:lessonTestId,userInfo:userInfo,classId:lessonInfo.classId,classInfo:classInfo,lessonInfo:lessonInfo});
    }

    //Xử lý điểm cho User khi làm xong bài kiểm tra
    async processScore(req,res,next){
        let userId = req.cookies.iduser;
        let lessonTestId = req.params.id;
        let formData = req.body;
        let numberOfRightAnswer = parseInt(formData.numberOfRightAnswer);
        let numberOfWrongAnswer = parseInt(formData.numberOfWrongAnswer);
        let rightAnswer = formData.rightAnswer;
        let wrongAnswer = formData.wrongAnswer;
        
        console.log(rightAnswer);
        console.log(wrongAnswer);
        //Xử lý điểm cho phần User test
        let score = Math.floor((100*numberOfRightAnswer)/(numberOfRightAnswer+numberOfWrongAnswer));
        console.log(score);
        //Hàm ghi điểm vào kết quả UserTest
        let addResult = await lessonTestService.addResultForUser(userId,lessonTestId,score); 
        //Hàm lưu lịch sử câu hỏi đúng / sai result = 0 -> sai result =1 ->đúng
        if(wrongAnswer.length!==0){
            for(let j = 0 ; j<wrongAnswer.length ; j++){
                await lessonQuestionService.recordWrongLessonQuestionForUser(userId,wrongAnswer[j].questionId,wrongAnswer[j].choosenAnswer)
            }
        }
        if(rightAnswer.length!==0){
            for (let k = 0 ; k<rightAnswer.length ; k++){
                await lessonQuestionService.recordRightLessonQuestionForUser(userId,rightAnswer[k].questionId)
            }
        }
        

        res.status(200).json({bla:"Hello motto"});
    }

}
module.exports = new lessonTestController;