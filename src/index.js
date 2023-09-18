import express from "express";
import mongoose from "mongoose";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validation/validation.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controlers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controlers/PostController.js";

mongoose
  .connect("mongodb://localhost/blog")
  .then(() => {
    console.log("DB Ok");
  })
  .catch((err) => {
    console.error("DB ERROR", err);
  });

const app = express();

app.use(express.json()); // чтобы читать json

app.post("/auth/register", registerValidation, register);
app.post("/auth/login", loginValidation, login);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, update);

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server OK. Port: http://localhost:4444");
});
