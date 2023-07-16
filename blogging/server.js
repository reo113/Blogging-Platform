const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const app = express();
const port = 4000;
const { User, Post, Comment } = require("./models");
require("dotenv").config();

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
const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "You must be logged in to perform this action" });
  }
  next();
};
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

//sign up
app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    req.session.userId = user.id;
    res.status(201).json({
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ error: err.errors.map((e) => e.message) });
    }
    res.status(500).json({
      message: "Error creating user",
      error: err,
    });
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user === null) {
      return res.status(401).json({ message: "Login failed" });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        req.session.userId = user.id;
        res.status(200).json({
          message: "Login successful",
          user: {
            name: user.name,
            email: user.email,
          },
        });
      } else {
        res.status(401).json({ message: "Incorrect Credentials", error: err });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.clearCookie("connect.sid");
    return res.sendStatus(200);
  });
});

//get all post from user
app.get("/posts", authenticateUser, async (req, res) => {
  try {
    const allPosts = await Post.findAll();
    res.status(200).json(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//get specific post from user
app.get("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [Comment],
    });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: `Post with id ${postId} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//create post
app.post("/posts", authenticateUser, async (req, res) => {
  const userId = req.session.userId;
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userID: userId,
    });
    res.status(200).json(post);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ error: err.errors.map((e) => e.message) });
    }
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//update post
app.patch("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    const post = await Post.findOne({ where: { id: postId } });
    if (post && post.userID !== parseInt(req.session.userId, 10)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }
    const [numberOfAfecctedRows, affectedRows] = await Post.update(req.body, {
      where: { id: postId },
      returning: true,
    });
    if (numberOfAfecctedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).json({ message: `Post with id ${postId} not found` });
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ error: err.errors.map((e) => e.message) });
    }
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//delete post
app.delete("/posts/:id", authenticateUser, async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await Post.findOne({ where: { id: postId } });
    if (post && post.userID !== postId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    const deletePost = await Post.destroy({ where: { id: postId } });
    if (deletePost > 0) {
      res.json({ message: `Post with id ${req.params.id} was deleted` });
    } else {
      res.status(404).json({ message: `Post with id ${postId} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//get all comments from a specific post
app.get("/comments/:PostId", authenticateUser, async (req, res) => {
  try {
    const postId = parseInt(req.params.PostId, 10);
    const comments = await Comment.findAll({ where: { PostId: postId } });
    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: `Post with id ${postId} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//create comment to one post
app.post("/post/:id/comments", async (req, res) => {
  try {
    const postId = parseInt(req.params.PostId, 10);
    const content = req.body.content;
    const userId = req.session.userId;
    const newComment = await Comment.create({
      content: content,
      PostId: postId,
      userId: userId,
    });
    res.status(200).json(newComment);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//update comment from a specific post
app.patch("/post/:postId/comments/:commentId", async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (comment && comment.userId !== parseInt(req.session.userId, 10)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment" });
    }
    const [numberOfAfecctedRows, affectedRows] = await Comment.update(
      req.body,
      {
        where: { id: commentId },
        returning: true,
      }
    );
    if (numberOfAfecctedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res
        .status(404)
        .json({ message: `Comment with id ${commentId} not found` });
    }
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//delete comment from a specific post
app.delete("/post/:postId/comments/:commentId", async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  try {
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (comment && comment.userId !== parseInt(req.session.userId, 10)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }
    const deleteComment = await Comment.destroy({ where: { id: commentId } });
    if (deleteComment > 0) {
      res.json({
        message: `Comment with id ${req.params.commentId} was deleted`,
      });
    } else {
      res
        .status(404)
        .json({ message: `Comment with id ${commentId} not found` });
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
