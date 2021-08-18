const adminLoginRouter = require('../routes/Admin/loginAdmin');
const adminHomeRouter = require('../routes/Admin/homeAdmin');
const adminLogoutRouter = require('../routes/Admin/logoutAdmin');
const adminProfileRouter = require('../routes/Admin/profileAdmin');
const manageStudentsAccountRouter = require('../routes/Admin/manageStudentsAccount');
const manageTeachersAccountRouter = require('../routes/Admin/manageTeachersAccount');
const manageCoursesRouter = require('../routes/Admin/manageCourses')
const manageNewregisterRouter = require('../routes/Admin/manageNewregister');
const manageNotificationsRouter = require('../routes/Admin/manageNotifications');
const createUserAccountRouter = require('../routes/Admin/createUserAccount');
const createTeacherAccountRouter = require('../routes/Admin/createTeacherAccount');
const manageCategoryRouter = require('../routes/Admin/manageCategory');
const manageClassRouter = require('../routes/Admin/manageClass');
const manageLessonQuestionRouter = require('../routes/Admin/manageLessonQuestion');
const manageLessonRouter = require('../routes/Admin/manageLesson');
const getAllCourseParticipateRouter = require('../routes/Admin/getAllCourseParticipate');
const changePasswordRouter = require('../routes/Admin/changePassword');
const viewUserProfileRouter = require('../routes/Admin/viewUserProfile');
const adminViewDocumentRouter = require('../routes/Admin/adminViewDocument');

//Declaration for teacher
const teacherLoginRouter = require('../routes/Teacher/loginTeacher');
const teacherHomeRouter = require('../routes/Teacher/homeTeacher');
const teacherLogoutRouter = require('../routes/Teacher/logoutTeacher');
const teacherManageCourseRouter = require('../routes/Teacher/manageCourseTeacher');
const teacherManageLessonRouter = require('../routes/Teacher/manageLessonTeacher');
const manageLessonTestRouter = require('../routes/Teacher/manageLessonTest');
const statisticRouter = require('../routes/Teacher/statistic');
const teacherProfileRouter = require('../routes/Teacher/teacherProfile');

const manageDocumentRouter = require('../routes/Teacher/manageDocument');

//Declaration for user
const indexRouter = require('../routes/User/indexUser');
const userLoginRouter = require('../routes/User/loginUser');
const userHomeRouter = require('../routes/User/homeUser');
const userLogoutRouter = require('../routes/User/logoutUser');
const userRegisterRouter = require('../routes/User/registerUser');
const userNotRegisterCourseDetailRouter = require('../routes/User/NotRegisterCourseDetailUser');
const userEnrollCourseRouter = require('../routes/User/enrollCourseUser');
const userMyClassRouter = require('../routes/User/myClassUser');
const userOnprocessingClassRouter = require('../routes/User/onprocessingClassUser');
const userProfileRouter = require('../routes/User/profileUser');
const forgotPasswordRouter = require('../routes/User/forgotPassword');
const resetPasswordRouter = require('../routes/User/resetPassword');
const userAllCourseRouter = require('../routes/User/allCourseUser');
const userReplyMailRouter = require('../routes/User/reply');

//Use for changing Password of User
const userChangePasswordRouter = require('../routes/User/changePasswordUser');
const teacherHistoryRouter = require('../routes/Teacher/teacherHistory');

const userRegisterCourseDetailRouter = require('../routes/User/registeredCourseUser');
const userDoLessonTestRouter = require('../routes/User/userDoLessonTest');
const refusedCourseRouter = require('../routes/User/refuseCourseUser');

const historyRouter = require('../routes/User/history');
const assistantRouter = require('../routes/User/assistant');

const notLoginRouter = require('../routes/User/notLogin');
const logedCourseDetailRouter = require('../routes/User/logedCourseDetail');
const getDistrictRouter = require('../routes/User/getDistrict');
//getSubjectCourseRouter = require('../routes/User/getSubjectCourse');
const getAllTeacherRouter = require('../routes/Teacher/getAllTeacher');

const {isAuth} = require('../middleware/AuthMiddleware');
const {isAuth2} = require('../middleware/AuthMiddleware');
const {isAuth3} = require('../middleware/AuthMiddleware');
const {checkApp} = require('../middleware/AuthMiddleware');
const {checkApp2} = require('../middleware/AuthMiddleware');
const {checkApp3} = require('../middleware/AuthMiddleware');

const { changePassword } = require('../services/userService');
const { view } = require('../app/controllers/Teacher/DocumentController');
function route(app){
    app.use('/user/getAllTeacher',checkApp,getAllTeacherRouter);
    //experiment for back
    app.use('/back1',(req,res,next)=>{
        res.redirect('/admin/manage-students-account');
    })
    app.use('/introduce',(req,res,next)=>{
        res.render('userIntroduce');
    })
    app.use('/getDistrict',getDistrictRouter);
    //app.use('/getSubjectCourse',checkApp,getSubjectCourseRouter);
    app.use('/admin/getAllParticipateCourseOfUser',checkApp3,getAllCourseParticipateRouter);
    //Configuration for all systems
    app.use('/forgot-password',forgotPasswordRouter);
    app.use('/reset-password',resetPasswordRouter);
    //Router for admin
    app.use('/admin/home',isAuth3,adminHomeRouter);
    app.use('/admin/login',isAuth3,adminLoginRouter,adminHomeRouter);
    app.use('/admin/logout',adminLogoutRouter);
    app.use('/admin/profile',adminProfileRouter);
    app.use('/admin/manage-courses',checkApp3,manageCoursesRouter);
    app.use('/admin/manage-students-account',checkApp3,manageStudentsAccountRouter);
    //Use for both teacher and admin
    app.use('/viewUserProfile',viewUserProfileRouter);
    app.use('/admin/manage-teachers-account',checkApp3,manageTeachersAccountRouter);
    app.use('/admin/manage-newregister',checkApp3,manageNewregisterRouter);
    app.use('/admin/manage-notifications',checkApp3,manageNotificationsRouter);
    app.use('/admin/create-user-account',checkApp3,createUserAccountRouter);
    app.use('/admin/create-teacher-account',checkApp3,createTeacherAccountRouter);
    app.use('/admin/manage-category',checkApp3,manageCategoryRouter);
    app.use('/admin/manage-class',checkApp3,manageClassRouter);
    app.use('/admin/manage-lesson',checkApp3,manageLessonRouter);
    app.use('/admin/manage-lessonquestion',manageLessonQuestionRouter);
    app.use('/admin/viewDocument',checkApp3,adminViewDocumentRouter);

    //Use only for teacher
    app.use('/teacher/history/loginCourse/lessonDetail',checkApp2,teacherHistoryRouter);

    //Use only for admin and teacher
    app.use('/changePassword',changePasswordRouter);
    //Use for all
    app.use('/history',checkApp,historyRouter);
    app.use('/assistant',assistantRouter);
    app.use('/teacher/profile',checkApp2,teacherProfileRouter);
    //Router for teacher
    app.use('/teacher/home',isAuth2,teacherHomeRouter);
    app.use('/teacher/login',isAuth2,teacherLoginRouter,teacherHomeRouter);
    app.use('/teacher/logout',teacherLogoutRouter);
    app.use('/teacher/manage-courses',checkApp2,teacherManageCourseRouter);
    app.use('/teacher/manage-lesson',checkApp2,teacherManageLessonRouter);
    app.use('/teacher/manage-lessonquestion',checkApp2,manageLessonQuestionRouter);
    app.use('/teacher/manage-lessontest',checkApp2,manageLessonTestRouter);
    app.use('/teacher/manage-document',checkApp2,manageDocumentRouter);
    app.use('/teacher/statistic',checkApp2,statisticRouter);

    //Router for user
//Configuration routing first
    app.use('',isAuth,indexRouter,userHomeRouter);
    app.use('/user/notlogin',notLoginRouter);
    app.use('/user/home',isAuth,userHomeRouter);
    app.use('/user/login',isAuth,userLoginRouter,userHomeRouter);
    app.use('/user/logout',checkApp,userLogoutRouter);
    app.use('/user/all-courses',checkApp,userAllCourseRouter);
    app.use('/user/register',userRegisterRouter);
    app.use('/user/not-register-coursedetail',checkApp,userNotRegisterCourseDetailRouter);
    app.use('/user/registeredCourseDetail',checkApp,userRegisterCourseDetailRouter);
    app.use('/user/user-profile',checkApp,userProfileRouter);
    //chỉnh sửa thành enroll-class
    app.use('/user/enroll-course',checkApp,userEnrollCourseRouter);
    app.use('/user/my-class',checkApp,userMyClassRouter);
    app.use('/user/onprocessing-class',checkApp,userOnprocessingClassRouter);
    app.use('/user/do-lessontest',checkApp,userDoLessonTestRouter);
    app.use('/user/changePassword',checkApp,userChangePasswordRouter);
    app.use('/user/loged-CourseDetail',checkApp,logedCourseDetailRouter);
    //Yêu cầu khóa học bị từ chối
    app.use('/user/refused-course',checkApp,refusedCourseRouter);
    app.use('/user/replyToAdmin',checkApp,userReplyMailRouter);
}
module.exports = route;