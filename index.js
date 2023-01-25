import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path"; // already installed with node
import { fileURLToPath } from "url"; // already installed with node
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/authorization.js";

/* middleware config */
dotenv.config();
const __filename = fileURLToPath(import.meta.url); // to allow us grab the file URL when we use "type module"
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const PORT = process.env.PORT || 6001;

/* file storage */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* mongoDB setup LOCAL */
/*
if (process.env.NODE_ENV === "dev") {
  mongoose
    .connect(process.env.MONGO_URI_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () =>
        console.log(
          `Successfully connected to MongoDB Compass! Server Running On Port: ${PORT}`
        )
      );
    })
    .catch((error) =>
      console.log(`Server did not connect to MongoDB Compass: ${error.message}`)
    );
}
*/

/* mongoDB Setup PRODUCTION */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_PROD);

    console.log(
      `Production Server Connected MongoDB Atlas: ${conn.connection.host}`
    );
  } catch (error) {
    console.log(
      `Error! Production Server unable to connect to MongoDB Atlas: ${error.message}`
    );
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT} for requests`);
  });
});

/* routes with file, this route is not inside routes/auth bcz we have to use upload function */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/*test Routes*/
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "test succesfull",
  });
});
