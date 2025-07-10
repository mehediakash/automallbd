const mongoose = require("mongoose")
const {Schema} = mongoose

const user = new Schema({
    email:{
        type: String
    },
    password:{
        type: String
    }
})

module.exports = mongoose.model("User",user)