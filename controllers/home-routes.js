const router = require("express").Router();
const sequelize = require("sequelize");
const { User, Post, Comment } = require("../models");

// Home routes

//Home page
router.get("/", (req, res) => {
  Post.findAll({
    order: [["updated_at", "DESC"]],
    include: User,
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));

      res.render("home", { loggedIn: req.session.loggedIn, posts });
    })
    .catch(err => res.status(500).json(err));
});

//Login page
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

//Signup page
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

//Single Post Page
router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: ["username", "createdAt", "updatedAt"],
      },
      {
        model: Comment,
        attributes: ["text", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: "Post was not found." });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("post-page", { post, loggedIn: req.session.loggedIn });
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
