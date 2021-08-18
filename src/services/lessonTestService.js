const {LessonTest} =require('../models/index');
const lesson = require('../models/lesson');
const {LessonQuestion} = require('../models/index');
const {UserLessonTest} = require('../models/index');
class lessonTestService{
    async getAllTestByLessonId(lessonId){
        let lessonTestInfo = [];
        let resultLessonTest = await LessonTest.findAll({where:{
            lessonId:lessonId
        }});
        resultLessonTest.forEach(element => {
            lessonTestInfo.push(element.get());
        });
        return lessonTestInfo;
    }
    //Lấy tất cả mã đề theo tiết học
    async getAllTestIdByLessonId(lessonId){
        let lessonTestIdInfo = [{lessonId:lessonId}];
        let resultLessonTest = await LessonTest.findAll({where:{
            lessonId:lessonId
        }});
        if(resultLessonTest){
            resultLessonTest.forEach(element => {
                lessonTestIdInfo.push(element.get().id);
            });
            return lessonTestIdInfo;
        }
        
    }
    async getTestResultByTestId(userId,historyIdInfo){
        let resultInfo = []
        let result = await UserLessonTest.findAll({where:{
            userId:userId,
            lessonTestId:historyIdInfo
        }});
        if(result){
            for(let k = 0 ; k<result.length; k++){
                resultInfo.push(result[k].get());
            }
            return resultInfo;
        }
        else{
            return "";
        }
    }
    async getTestByTestId(testId){
        let lessonTest = await LessonTest.findOne({where:{
            id:testId
        }})
        return lessonTest.get();
    }
    async getTestActiveInLesson(lessonId){
        let lessonTest = await LessonTest.findOne({where:{
            lessonId:lessonId,
            testStatus:'active'
        }})
        if(lessonTest){
            
            return lessonTest.get();
        }
        else{
            return "";
        }
    }
    //create new Lesson test with lesson id
    async createNewLessonTest(lessonId,formData){
        let result = LessonTest.findOne({where:{
            lessonId:lessonId,
            testStatus : 'active'
        }})
        if(result){
            await LessonTest.create({
                lessonTestName:formData.lessonTestName,
                lessonId:lessonId,
                testStatus:'notactive',
                time:formData.time,
                numberOfQuestions:formData.numberOfQuestions
            }).then((newLessonTest)=>{
                console.log(newLessonTest.get())
            }).catch((err)=>{
                console.log('there is problem in model')
            })
            return "Hello";
        }
        else{
            return "Bye";
        }
        
    }
    // async deleteLessonTestById(lessonId){
    //     await LessonTest.destroy({where:{
    //         id:lessonId
    //      }
    //     })
    //     return "Delete Successfully";
    // }
    async editLessonTestById(testId,formData){
        let resultTest =await LessonTest.findOne({
            where:{id:testId}
        })
        resultTest.lessonTestName = formData.lessonTestName;
        resultTest.time = formData.time;
        resultTest.numberOfQuestions = formData.numberOfQuestions;
        await resultTest.save();
        return "Edit Successfully";
    }
    async deleteLessonTestById(lessonTestId){
        let result = await LessonTest.destroy({
            where:{id:lessonTestId}
        })
        return "Delete Successfully"
    }
    async checkStatusOfTest(testId){
        let result = await LessonTest.findOne({
            where:{id:testId,testStatus:'active'}
        })
        if(result){
            return true;
        }
        else{
            return false;
        }
    }
    async changeStatusByTestId(testId1,testId2,lessonId){
        
        let resultTest = await LessonTest.findOne({
            where:{testStatus:'active',id:testId1}
        });
        if(resultTest){
            resultTest.testStatus='notactive';
            
            await resultTest.save();
        }
        let resultLessonQuestion = await LessonQuestion.findAll({
            where:{lessonTestId:testId1}
        });
        //console.log(resultLessonQuestion); //Lấy được một chuỗi mảng đối tượng json
        let resultTestNeed = await LessonTest.findOne({
            where:{id:testId2}
        });
        if(resultTestNeed){
            resultTestNeed.testStatus='active';
            await resultTestNeed.save();
        }
        
        return resultTestNeed.get();
    }
    async changeTestIdForQuestion(lessonId,lessonTestId){
        //sau khi thay đổi mã đề thi , ta đính kèm mã đề thi theo số câu hỏi mới

        let mpResult = await LessonQuestion.findAll({where:{
            lessonId:lessonId,
        }});
        if(mpResult.length!==0){
            for(let k = 0 ; k<mpResult.length ; k++){
                mpResult[k].lessonTestId = lessonTestId;
                await mpResult[k].save();
            }
        }
        return "Hello";
    }
    getRandom(arr, n) {
        if (arr.length<n){
            return [];
        }
        else{
            var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
            if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = arr[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            return result;
        }
    }
    async addResultForUser(userId,lessonTestId,score){
        await UserLessonTest.create({
            result:score,
            userId:userId,
            lessonTestId:lessonTestId
        }).then((newUserLessonTest)=>{
            console.log(newUserLessonTest.get());
        }).catch((err)=>{
            console.log("có sự sai sót trong dữ liệu")
        })

       return "Đã thêm kết quả thành công";
    }
}
module.exports = new lessonTestService;