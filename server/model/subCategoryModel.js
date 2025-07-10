const mongoose = require("mongoose")
const {Schema} = mongoose

const subCategory = new Schema({
    name:{
        type:String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        // required: [true, "Category is required to create sub-category"],
      },
      product: [
        {
        type: Schema.Types.ObjectId, 
        ref:"Product"
       }
    ]
})

module.exports = mongoose.model("SubCategory", subCategory)