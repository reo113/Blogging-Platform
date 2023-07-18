const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { User, Post, Comment } = require("../models");

//authorize comment edit
const authorizeCommentEdit = (session, comment) => {
  if (parseInt(session.userId, 10) !== comment.UserId) {
    throw new ForbiddenError("You cannot edit someone else's comment");
  }
};
//authorize comment delete
const authorizeCommentDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== comment.UserId) {
    throw new ForbiddenError("You cannot delete someone else's comment");
  }
};
// handle errors
const handleErrors = (err, res) => {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    return res.status(422).json({ errors: err.errors.map((e) => e.message) });
  }
  res.status(500).send({ message: err.message });
};
//get all comments from user
router.get("/:id/comments", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const comments = await Comment.findAll({
      where: { UserId: userId },
    });

    if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//get specific comment from user
router.get("/:id/comments", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const comments = await Comment.findAll({
      where: {
        PostId: postId,
      },
    });

    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).send({ message: "No comments" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//create comment
router.post("/:id/comments", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const content = req.body.content;
  const userId = req.session.userId;

  try {
    const newComment = await Comment.create({
      content: content,
      UserId: userId,
      PostId: postId,
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (err) {
    handleErrors(err, res);
  }
});
//edit comment
router.patch("/:postId/comments/:commentId",authenticateUser,async (req, res) => {
    try {
      const comment = await Comment.findOne({
        where: { id: req.params.commentId },
      });
      await authorizeCommentEdit;
      const updatedComment = await comment.update(req.body);
      res.status(200).json(updatedComment);
    } catch (err) {
      handleErrors(err, res);
    }
  }
);
//delete comment
router.delete("/:postId/comments/:commentId",authenticateUser,async (req, res) => {
    try {
      const comment = await Comment.findOne({
        where: { id: req.params.commentId },
      });
      await authorizeCommentDelete;
      await comment.destroy();
      res.status(204).end();
    } catch (err) {
      handleErrors(err, res);
    }
  }
);

