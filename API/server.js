const express = require("express");
const router = express.Router();
const session = require("express-session");
const app = express();
const port = 4000;
const cors = require("cors");
const { User, Post, Comment } = require("./models");
const authRouter = require("./routes/auth");
const commentsRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");
const {
  forbiddenErrorHandler,
  notFoundErrorHandler,
} = require("./middleware/errorHandlers");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);


app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    console.log(`${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);

app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler);

// routes
app.use("/api/auth", authRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
