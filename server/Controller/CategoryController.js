const categoryModel = require("../model/categoryModel")
const subCategoryModel = require("../model/subCategoryModel")

async function Createcategory(req,res){
  try{

      await categoryModel.create(req.body)
      return  res.status(200).json({success:"category create successfully"})

  }catch(error){
    return  res.status(500).send({error})
  }
  
}

async function getCategory(req, res) {
  try {
      const { id } = req.params; // Get category ID from the request parameters

      const category = await categoryModel.findById(id).populate("product"); // Find category by ID

      if (!category) {
          return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({ success: true, category });
  } catch (error) {
      res.status(500).json({ message: "Failed to get category", error: error.message });
  }
}

async function getAllCategory(req, res) {
  try {
      const Categories = await categoryModel.find().populate("subCategories").populate("product"); // Fetch all subcategories

      if (!Categories || Categories.length === 0) {
          return res.status(404).json({ message: "No Category found" });
      }

      res.status(200).json({ success: true, Categories });
  } catch (error) {
      res.status(500).json({ message: "Failed to get Category", error: error.message });
  }
}

async function subCategoryController(req,res){

    try{
        const subCategory = await subCategoryModel.create(req.body)
        await categoryModel.findOneAndUpdate({_id: subCategory.category},{$push:{subCategories:subCategory._id}},{ new: true })

        return res.status(200).json({success:"Sub category create successfully"})

    }catch(error){
      return  console.log({error})
    }
}

async function getAllSubCategories(req, res) {
  try {
      const subCategories = await subCategoryModel.find().populate("product"); // Fetch all subcategories

      if (!subCategories || subCategories.length === 0) {
          return res.status(404).json({ message: "No subcategories found" });
      }

      res.status(200).json({ success: true, subCategories });
  } catch (error) {
      res.status(500).json({ message: "Failed to get subcategories", error: error.message });
  }
}

async function getSubCategory(req, res) {
  try {
      const { id } = req.params; // Get subcategory ID from the request parameters

      const subCategory = await subCategoryModel.findById(id).populate("product");; // Find subcategory by ID

      if (!subCategory) {
          return res.status(404).json({ message: "Subcategory not found" });
      }

      res.status(200).json({ success: true, subCategory });
  } catch (error) {
      res.status(500).json({ message: "Failed to get subcategory", error: error.message });
  }
}

async function DeleteCategory(req,res){
  try{
    const {id} = req.params
  const category = await categoryModel.findByIdAndDelete(id)

  if(!category){
    return res.status(404).json({massage:"category not found"})
  }
  res.status(200).json({massage: "Delete category succesfully"})

  }catch(error){
    return res.status(500).json({massage: "server error"})
  }
  


}

async function DeleteSubcategory(req,res){
  try{

    const {id} = req.params
    const subCategories = await subCategoryModel.findByIdAndDelete(id)
    if(!subCategories){
      return res.status(404).json({message:"sub Categories not found"})
    }
    res.status(200).json({message:"successfully deleted subCategory"})
  }catch(error){
    res.status(500).json({message: "server error 500"})
  }
 
}

async function updateCategory(req, res) {
  try {
      const { id } = req.params; // Get category ID from the request parameters
      const { name } = req.body; // Get new category title from the request body

      // Ensure title is provided
      if (!name) {
          return res.status(400).json({ message: "Category name is required" });
      }

      // Find category by ID and update the title
      const updatedCategory = await categoryModel.findByIdAndUpdate(
          id,
          { name },
          { new: true } // Return the updated category document
      );

      // If the category is not found, return an error
      if (!updatedCategory) {
          return res.status(404).json({ message: "Category not found" });
      }

      // Return the updated category in the response
      res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
      res.status(500).json({ message: "Failed to update category", error: error.message });
  }
}

async function updateSubCategory(req, res) {
  try {
      const { id } = req.params; // Get subcategory ID from the request parameters
      const { name } = req.body; // Get new subcategory title from the request body

      if (!name) {
          return res.status(400).json({ message: "Subcategory name is required" });
      }

      const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
          id,
          { name },
          { new: true } // Return the updated subcategory document
      );

      if (!updatedSubCategory) {
          return res.status(404).json({ message: "Subcategory not found" });
      }

      res.status(200).json({ message: "Subcategory updated successfully", subCategory: updatedSubCategory });
  } catch (error) {
      res.status(500).json({ message: "Failed to update subcategory", error: error.message });
  }
}


module.exports = {Createcategory,updateCategory,subCategoryController,DeleteCategory,DeleteSubcategory,updateSubCategory, getCategory, getSubCategory , getAllSubCategories , getAllCategory}