const mongoose = require("mongoose")
const {Schema} = mongoose

const banner = new Schema({
    photo:[{
        type: String
    }],
    position:{
        type: String,
        require: [true, "position must be seleted"],
        enum: ["MainBanner","SecondBannerLeft","SecondBannerRight","ServiceBanner"]
        

    },
    link: {
        type: String,
      }
})

module.exports = mongoose.model("Banner", banner)