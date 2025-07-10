const mongoose = require("mongoose")
const {Schema} = mongoose

const brand = new Schema({
    photo: {
        type: String, // Make photo an array of strings
      },
    title:{
        type:String,
        unique: true,
        required: [true, "title is required"],
        
    },
    color:{
        type: String,
        required: [true, "color is required"],
    },
    description:{
        type: String
    },
    product: [
        {
        type: Schema.Types.ObjectId, 
        ref:"Product"
       }
    ]
})

module.exports = mongoose.model("Brand", brand)