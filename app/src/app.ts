import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bearerToken from "express-bearer-token";
import logger from "morgan";
import cors from "cors";
require("./db/mongodb-client");

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import productRouter from "./routes/product";

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(bearerToken());

//App Routes
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);

//For the excercise, always throwing 500 for simplicity
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(400).send(err.message);
});

export default app;
