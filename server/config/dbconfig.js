const mongoose = require("mongoose");

function dbconfig() {
  mongoose
    .connect(
      `mongodb+srv://automallbdltd_db_user:jqkCqEy7MaaHemrC@cluster0.ol5pm8g.mongodb.net/?appName=Cluster0`,
    )
    .then(() => console.log("Connected!"));
}

module.exports = dbconfig;
