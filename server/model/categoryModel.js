const mongoose = require("mongoose")
const {Schema} = mongoose

const category = new Schema({
    name:{
        type:String,
        // require:[true, "category name is reauire"],
        // unique: true

    },
    subCategories: [
        {
          type: Schema.Types.ObjectId,
          ref: "SubCategory",
        },
      ],
      product: [
        {
        type: Schema.Types.ObjectId, 
        ref:"Product"
       }
    ]
    
})

module.exports = mongoose.model("Category", category)