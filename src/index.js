import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validation/validation.js";
import { PostController, UserController } from "./controlers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

dotenv.config();

// "mongodb://localhost/blog"
console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Ok");
  })
  .catch((err) => {
    console.error("DB ERROR", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); // чтобы читать json

app.use(cors());

app.use("/uploads", express.static("uploads")); //отображение статичных файлов

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register,
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login,
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create,
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server OK. Port: http://localhost:4444");
});
