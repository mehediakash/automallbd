const express = require("express")
const _ = express.Router()
const { Createcategory, subCategoryController, DeleteCategory, DeleteSubcategory, updateCategory, getCategory, getAllCategory, getAllSubCategories, getSubCategory, updateSubCategory } = require("../../Controller/CategoryController")

_.post('/createCategory',Createcategory)
_.get('/getCategory',getAllCategory)
_.get('/getCategory/:id',getCategory)
_.delete('/deleteCategory/:id',DeleteCategory)
_.put('/UpdateCategory/:id',updateCategory)


_.post('/subCategory',subCategoryController)
_.get('/getSubCategory',getAllSubCategories)
_.get('/getSubCategory/:id',getSubCategory)
_.delete('/deleteSubCategory/:id',DeleteSubcategory)
_.put('/UpdateSubCategory/:id',updateSubCategory)


module.exports = _