const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { User, Post, Comment } = require("../models");

const authorizeEdit = (session, blog) => {
  if (parseInt(session.userId, 10) !== blog.UserId) {
    throw new ForbiddenError("You are not authorized to edit this job");
  }
};

const authorizeDelete = (session, blog) => {
  if (parseInt(session.userId, 10) !== blog.UserId) {
    throw new ForbiddenError("You are not authorized to delete this job");
  }
};

const handleErrors = (err, res) => {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    return res.status(422).json({ errors: err.errors.map((e) => e.message) });
  }
  res.status(500).send({ message: err.message });
};

//get all post from user
router.get("/posts", authenticateUser, async (req, res) => {
  try {
    const allPosts = await Post.findAll();
    res.status(200).json(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//get specific post from user
router.get("/posts/:id", authenticateUser, async (req, res) => {
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
router.post("/posts", authenticateUser, async (req, res) => {
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
router.patch("/posts/:id", authenticateUser, async (req, res) => {
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
router.delete("/posts/:id", authenticateUser, async (req, res) => {
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
router.get("/comments/:PostId", authenticateUser, async (req, res) => {
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
router.post("/post/:id/comments", async (req, res) => {
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
router.patch("/post/:postId/comments/:commentId", async (req, res) => {
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
router.delete("/post/:postId/comments/:commentId", async (req, res) => {
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


module.exports = router;