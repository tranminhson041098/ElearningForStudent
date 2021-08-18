const lessonQuestionService = require('../../../services/lessonQuestionService');
class lessonQuestionController{
    async index(req,res,next){
        let allLessonQuestion = await lessonQuestionService.getAllQuestionByLessonId(req.params.id);
        res.render('adminManageLessonQuestion',{allLessonQuestion:allLessonQuestion,idLesson:req.params.id});
    }
    async create(req,res,next){
        let data = req.body;
        let id = await lessonQuestionService.addLessonQuestion(data);
        res.status(200).json({via:data,id:id});
    }
    async getDetailQuestion(req,res,next){
        let questionId = req.params.id;
        let questionInfo = await lessonQuestionService.getDetailQuestion(questionId);
        
        res.status(200).json({bla:questionInfo});
    }
    async processEdit(req,res,next){
        let formData = req.body;
        let questionInfo = await lessonQuestionService.editQuestion(formData.id,formData);
        let questionInfoSecond = await lessonQuestionService.getAllQuestionByLessonId(formData.lessonId);
        console.log('Thông tin questionInfoSecond');
        console.log(questionInfoSecond);
        res.status(200).json({bla:questionInfoSecond});
    }
    async processDelete(req,res,next){
        let idQuestion = req.params.id;
        let lessonId = req.body.lessonId;
        let questionInfoDelete = await lessonQuestionService.deleteQuestion(idQuestion);
        let questionInfoSecond = await lessonQuestionService.getAllQuestionByLessonId(lessonId);
        res.status(200).json({bla:questionInfoSecond});
    }

}
module.exports = new lessonQuestionController;