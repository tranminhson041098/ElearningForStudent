const models = require('./models');
const Category = models.Category;
const Course = models.Course;
const Class = models.Class;
const Lesson = models.Lesson;
const LessonQuestion = models.LessonQuestion;
const LessonTest = models.LessonTest;
const Document = models.Document;
function test(){
    
   Document.create({
       documentLink:'https://sachcuatui.net/sach-giao-khoa-vat-li-lop-11-co-ban/',
       classId:1
    }).then((newDocument)=>{
        console.log('Thông tin về tài liệu mới');
        console.log(newDocument.get());
    }).catch((err)=>{
        console.log('there is problem in model')
    })

}

module.exports = test;