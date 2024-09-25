const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  // .connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@twitter.vz9ss.mongodb.net/twitter-db`, {
  .connect("mongodb://localhost:27017/twitter-db", {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('\x1b[32m%s\x1b[0m', "Database connected");
  })
  .catch((err) => {
    console.log("Database connect error: ", err);
  });

module.exports = mongoose;