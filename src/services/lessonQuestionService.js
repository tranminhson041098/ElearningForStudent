const {LessonQuestion} =require('../models/index');
const {UserLessonQuestion} =require('../models/index');
class lessonQuestionService{
    async getAllQuestionByLessonId(lessonId){
        let dataLessonQuestion = [];
        let resultLessonQuestion = await LessonQuestion.findAll({where:{
            lessonId:lessonId
        }})
        resultLessonQuestion.forEach(element => {
            dataLessonQuestion.push(element.get());
        });
        return dataLessonQuestion;
    }

    async getAllQuestionIdByLessonId(lessonId){
        let lessonQuestionIdInfo = [{lessonId:lessonId}];
        let resultLessonQuestion = await LessonQuestion.findAll({where:{
            lessonId:lessonId
        }});
        if(resultLessonQuestion){
            resultLessonQuestion.forEach(element => {
                lessonQuestionIdInfo.push(element.get().id);
            });
            return lessonQuestionIdInfo;
        }
    }

    async getFalseQuestion(userId,falseQuestionInfo){
        let resultInfo = [];
        let result = await UserLessonQuestion.findAll({
            where:{
                userId:userId,
                lessonQuestionId : falseQuestionInfo,
                result: 0
            }
        });
        if(result){
            for(let i = 0 ; i<result.length;i++){
                resultInfo.push(result[i].get());
            }
            return resultInfo;
        }
        else{
            return [];
        }
    }
    async addLessonQuestion(data){
        let id ;
        LessonQuestion.create({
            questionContent:data.questionContent,
            optionA:data.optionA,
            optionB:data.optionB,
            optionC:data.optionC,
            optionD:data.optionC,
            rightAnswer :data.rightAnswer,
            lessonId:data.lessonId
        }).then((newLessonQuestion)=>{
            id=newLessonQuestion.get().id;
            console.log(newLessonQuestion.get())
        }).catch((err)=>{
            console.log('there is problem in model')
        })
        return id;
    }
    async getDetailQuestion(questionId){
        let questionResult = await LessonQuestion.findOne({where:{
            id:questionId
        }});
        return questionResult.get();
    }
    async editQuestion(questionId,formData){
        let questionResult = await LessonQuestion.findOne({where:{
            id:questionId
        }});
        if(questionResult){
            questionResult.questionContent = formData.questionContent;
            questionResult.optionA = formData.optionA;
            questionResult.optionB = formData.optionB;
            questionResult.optionC = formData.optionC;
            questionResult.optionD = formData.optionD;
            questionResult.rightAnswer = formData.rightAnswer;
            await questionResult.save();
        }
        return 'Edit Question Successfully';

    }
    async deleteQuestion(questionId){
        let questionResult = await LessonQuestion.destroy({
            where:{id:questionId}
        });
        return 'Delete successfully';
    }
    //Hàm ghi lại lịch sử làm bài
    async recordRightLessonQuestionForUser(userId,lessonQuestionId){
        let RightLessonQuestion = await UserLessonQuestion.create({
            userId:userId,
            lessonQuestionId:lessonQuestionId,
            result:1
        });
        return RightLessonQuestion.get();
    }
    async recordWrongLessonQuestionForUser(userId,lessonQuestionId,choosenAnswer){
        let WrongLessonQuestion = await UserLessonQuestion.create({
            userId:userId,
            lessonQuestionId:lessonQuestionId,
            result:0,
            choosenAnswer:choosenAnswer
        });
        return WrongLessonQuestion.get();
    }

}
module.exports = new lessonQuestionService;