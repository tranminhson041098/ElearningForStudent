
const categoryService = require('../../../services/categoryService');
class categoryController{
    async index(req,res,next){
        const allCategory = await categoryService.getAllCategory();
        if(allCategory.length!=0){
            for(let index =0 ; index<allCategory.length ; index++){
                allCategory[index].createdAt = allCategory[index].createdAt.getDate()+"/"+allCategory[index].createdAt.getMonth()+"/"+allCategory[index].createdAt.getFullYear()+" "+allCategory[index].createdAt.getHours()+":"+allCategory[index].createdAt.getMinutes();
            }
        }
        if(!req.cookies.bla){
            console.log('Hello world 1')
            res.render('adminManageCategory',{allCategory:allCategory});
        }
        else{
            //Đang sử dụng phương án script trong notification
            console.log('Hello world')
            res.clearCookie('bla');
            res.render('adminManageCategory',{allCategory:allCategory,notification:'notification'});
            
        }
        
    }
    //[GET] create New category get Page
    create(req,res,next){
        res.render('adminCreateCategory');
    }
    //[POST] create category post page
    async processCreate(req,res,next){
        const formData = req.body;
        let categoryName = formData.categoryName;
        let categoryDescription = formData.categoryDescription;
        let checkResult = await categoryService.checkCategoryAvailable(categoryName);
        //Trường hợp chưa có chủ đề trùng trong hệ thống
        if(!checkResult)
        {
            if (categoryName.length==0||categoryDescription.length==0) {
                res.render('adminCreateCategory',{warning:'warning'});
            }
            else{
                let signal = await categoryService.createNewCategory(formData);
                res.render('adminCreateCategory',{notification:'success'});
            }
        }
        else
        {
            res.render('adminCreateCategory',{warning:'warning'});
        }
    }
    //[GET] Get page for editting category page
    async editCategory(req,res,next){
        let resultData = await categoryService.getCategoryInfoById(req.params.id);
        console.log(resultData.get());
        res.render('adminEditCategory',{resultDataCategory:resultData.get(),id:req.params.id});
    }
    //[PUT] UpdateCategoryWith id
    async updateCategory(req,res,next){
        const formData = req.body;
        let categoryName = formData.categoryName;
        let categoryDescription = formData.categoryDescription;
        let checkResult = await categoryService.checkCategoryAvailable(categoryName);
        let categoryId = req.params.id;
        if(!checkResult){
            if (categoryName.length==0||categoryDescription.length==0) {
            
                let resultData = await categoryService.getCategoryInfoById(req.params.id);
                
                res.render('adminEditCategory',{resultDataCategory:resultData.get(),id:req.params.id,warning:'warning'});
            }
            else{
                    
                let categoryUpdate = await categoryService.updateCategoryInfoById(categoryId,formData);
                res.cookie('bla',{bla:'1'})
                res.redirect('/admin/manage-category');
            }
        }
        else{
            if(checkResult.id==categoryId){
                if (categoryName.length==0||categoryDescription.length==0) {
            
                    let resultData = await categoryService.getCategoryInfoById(req.params.id);
                    
                    res.render('adminEditCategory',{resultDataCategory:resultData.get(),id:req.params.id,warning:'warning'});
                }
                else{
                        
                    let categoryUpdate = await categoryService.updateCategoryInfoById(categoryId,formData);
                    res.cookie('bla',{bla:'1'})
                    res.redirect('/admin/manage-category');
                }
            }
            else{
                let resultData = await categoryService.getCategoryInfoById(req.params.id);
                
                res.render('adminEditCategory',{resultDataCategory:resultData.get(),id:req.params.id,warning:'warning'});
            }
           
        }
    }
}
module.exports = new categoryController;