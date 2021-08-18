
const {Category} =require('../models/index');
const {Course} =require('../models/index');
const {Class} =require('../models/index');
class categoryService{
    async checkCategoryAvailable(categoryName){
        let resultData = await Category.findOne({where:{
            categoryName:categoryName
        }})
        if(resultData){
            return resultData.get();
        }
        else{
            return false;
        }
    }
    async getAllCategory(){
        const dataCategory = await Category.findAll();
        let allCategory = [];
        dataCategory.forEach(category => {
            allCategory.push(category.get());
        });
        return allCategory;
    }
    async getAllCategoryFilter(){
        const dataCategory = await Category.findAll();
        let allCategory1 = [];
        dataCategory.forEach(category => {
            allCategory1.push(category.get());
        });
        let allCategory = [];
        for(let j =0 ; j<6 ; j++){
            allCategory.push(allCategory1[j]);
        }
        return allCategory;
    }
    async createNewCategory(formData){
        await Category.create({
            categoryName:formData.categoryName,
            categoryDescription:formData.categoryDescription
        }).then((newCategory)=>{
            console.log(newCategory.get())
        }).catch((err)=>{
            console.log('there is problem in model')
        })
        return "Đã thêm thành công";
    }
    async getCategoryInfoById(id){
        let resultData = await Category.findOne({where:{
            id:id
        }})
        return resultData;
    }
    async getCategoryInfoById2(id){
        let resultData = await Category.findOne({where:{
            id:id
        }})
        return resultData.get();
    }
    async updateCategoryInfoById(id,formData){
        let category = await Category.findOne({where:{id:id}});
        if(!category){
          console.log('Không tồn tại category');
          
        }
        else{
          category.categoryName=formData.categoryName;
          category.categoryDescription = formData.categoryDescription;

          await category.save();
        }
        return "deleteRefreshToken";
      }
    
}
module.exports = new categoryService;