const mongoose = require('mongoose');


function dbconfig(){
    mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.hkoyi.mongodb.net/${process.env.COLECTION}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('Connected!'));
}

module.exports = dbconfig