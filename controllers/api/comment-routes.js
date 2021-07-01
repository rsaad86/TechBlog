const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

//Comments Routes

//All comments
router.get("/", (req, res) => {
  Comment.findAll({
    include: [
      {
        model: Post,
        attributes: ["title"],
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(500).json(err));
});

//Single comment
router.get("/:id", (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["title"],
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({ message: "Comment not found in database" });
      } else {
        res.json(dbCommentData);
      }
    })
    .catch(err => res.status(500).json(err));
});

//Create comment
router.post("/", (req, res) => {
  const { text, post_id } = req.body;

  if (req.session.loggedIn) {
    var user_id = req.session.user_id;
  } else {
    var user_id = req.body.user_id;
  }

  Comment.create({
    text,
    post_id,
    user_id,
  })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
