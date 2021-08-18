const {Lesson} =require('../models/index');
class lessonService{
    async getAllLessonByClassId(classId){
        let dataLesson = [];
        let resultLesson = await Lesson.findAll({where:{
            classId:classId
        }})
        if(resultLesson){
            resultLesson.forEach(element => {
                dataLesson.push(element.get());
            });
        }
        
        return dataLesson;
    }
    async getDataLessonById(idLesson){
        let dataDetailLesson = await Lesson.findOne({where:{
            id:idLesson
        }})
        return dataDetailLesson.get();
    }
    async createLesson(classId,formData){
        
            let resultInfoNewLesson;
            await Lesson.create({
                lessonName: formData.lessonName,
                classId:classId,
                linkVideo : formData.linkVideo
            }).then((newLesson)=>{
                resultInfoNewLesson = newLesson.get();
                console.log(newLesson.get())
            }).catch((err)=>{
                console.log('there is problem in model')
            })
            return resultInfoNewLesson;
        
    }
    async editLesson(idLesson,formData){
        let lessonInfo = await Lesson.findOne({where:{id:idLesson}});
        
        if(!lessonInfo){
            console.log('Không tồn tại class');
        }
        else{
            lessonInfo.lessonName = formData.lessonName;
            lessonInfo.linkVideo = formData.linkVideo;
            
            await lessonInfo.save();
        }
        return "blo";
    }
    async deleteLessonById(lessonId){
        let deleteLessonInfo = await Lesson.destroy({
            where:{id:lessonId}
        });
        return "Delete Successfully";
    }
}
module.exports = new lessonService;