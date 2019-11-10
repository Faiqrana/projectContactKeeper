const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDb Connected...");
  } catch (err) {
    console.error("database is not connected");
    process.exit(1);
  }
};

module.exports = connectDb;
