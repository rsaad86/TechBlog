const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const authorized = require("../utils/authorization");

//Routes mainpage

router.get("/", authorized, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));

      res.render("mainpage", { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => res.status(500).json(err));
});

//New Post
router.get("/create", authorized, (req, res) => {
  res.render("mainpage-create", { loggedIn: req.session.loggedIn });
});

router.get("/edit/:id", authorized, (req, res) => {
  res.render("mainpage-update-delete", { loggedIn: req.session.loggedIn });
});

module.exports = router;
