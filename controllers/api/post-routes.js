const router = require("express").Router();
import { Post, User, Comment } from "../../models";
import authorized from "../../utils/authorization";

// api/post-routes

//All posts
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

//This creates a new post to the blog
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

//This updates a posts title and content.
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
        res
          .status(404)
          .json({ message: "Post with this specific id not found." });
        return;
      }

      res.json(dbUpdatedData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//delete a post based on id
router.delete("/:id", authorized, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res
          .status(404)
          .json({ message: "There is no blog post associated with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

export default router;
