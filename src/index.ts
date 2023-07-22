import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import compression from 'compression';
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
  })
);

// app.use(compression())
app.use(express.json());
app.use(cookieParser());

app.use("/", router());

server.listen(8080, () => {
  console.log("Server running on http//localhost:8080/");
});

const MONGO_URL =
  "mongodb+srv://gausnoori07:restapiwts@cluster0.xlu1gnq.mongodb.net/?retryWrites=true&w=majority";

// mongoose.Promise = Promise
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
// mongoose.connection.on('error', (error: Error) => console.log(error))
