const mongoose = require("mongoose");
const mongoose_uri = "mongodb://localhost/AjBusiness";
mongoose.connect(mongoose_uri);
mongoose.connection
  .on("open", () => {
    console.log("Connected to Database Sucessssfuly");
  })
  .once("error", () => {
    console.log("Failed to Connect to Database");
  });

module.exports = mongoose;
