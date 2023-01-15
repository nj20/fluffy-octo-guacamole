import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

mongoose.connection.on("open", () => {
  console.log(`Connected to Mongodb URI ${uri}`);
});

const connect = async () => {
  if (!uri) {
    console.error(
      "No Mongodb url was passed to environment. Please set environment variable MONGODB_URI"
    );
    return;
  }
  console.log(`Connecting to Mongodb URI ${uri}`);
  await mongoose.connect(uri);
};

connect();
