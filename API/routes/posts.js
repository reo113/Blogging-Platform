const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { User, Post, Comment } = require("../models");


const authorizePostEdit = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot edit someone else's post");
  }
};
const authorizePostDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot delete someone else's post");
  }
};
const handleErrors = (err, res) => {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    return res.status(422).json({ errors: err.errors.map((e) => e.message) });
  }
  res.status(500).send({ message: err.message });
};

const getPost = async (id) => {
  const post = await Post.findByPk(parseInt(id, 10), { include: [Comment] });

  if (!post) {
    throw new NotFoundError("Post not found");
  }
  return post;
};

//get all post 
router.get("/", authenticateUser, async (req, res) => {
  try {
   const whereClause ={UserID: req.session.userId};
   if(req.query.status){
     whereClause.status = req.query.status;
    }
    console.log(whereClause);
    const allPosts = await Post.findAll({where: whereClause});
    res.status(200).json(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//get all posts from user
router.get("/:id/posts", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const posts = await Post.findAll({
      where: { UserId: userId },
    });

    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//get specific post from user
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const post = await getPost(req.params.id);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//create post
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.session.userId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    handleErrors(err, res);
  }
});

//update post
router.patch("/:id", authenticateUser, async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    await authorizePostEdit(req.session, post);
    const updatedPost = await post.update(req.body);
    res.status(200).json(updatedPost);
  } catch (err) {
    handleErrors(err, res);
  }
});

//delete post
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    await authorizePostDelete(req.session, post);
    await Post.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
