const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const authorized = require("../../utils/authorization");

//API Posts

//get all posts
router.get("/", (req, res) => {
  Post.findAll({
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => res.status(500).json(err));
});

//Single Post
router.get("/:id", (req, res) => {
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
      if (!dbPostData) res.status(404).json({ message: "Post was not found." });
      else res.json(dbPostData);
    })
    .catch(err => res.status(500).json(err));
});

//New Post
router.post("/", authorized, (req, res) => {
  const { title, content } = req.body;

  if (req.session.loggedIn) {
    var user_id = req.session.user_id;
  } else {
    var user_id = req.body.user_id;
  }

  Post.create({
    title,
    content,
    user_id,
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => res.status(500).json(err));
});

router.put("/:id", authorized, (req, res) => {
  const { title, content } = req.body;

  Post.update(
    {
      title,
      content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then(dbUpdatedData => {
      if (!dbUpdatedData) {
        res.status(404).json({ message: "Post with specified id not found." });
        return;
      }

      res.json(dbUpdatedData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", authorized, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: "No blog post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
