const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("CONNECTION---", connect.connection.host);
    console.log("CONNECTION---", connect.connection.name);
  } catch (error) {
    console.log("ERROR -----");
    process.exit(1);
  }
};

module.exports = connectDb;
