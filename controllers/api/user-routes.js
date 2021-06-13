const router = require("express").Router();
import { User } from "../../models";

// api/user-routes

//All db users
router.get("/", (req, res) => {
  User.findAll({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(500).json(err));
});

//Single db user
router.get("/:id", (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "User not found in database" });
      } else {
        res.json(dbUserData);
      }
    })
    .catch(err => res.status(500).json(err));
});

//New db user
router.post("/", (req, res) => {
  const { username, password } = req.body;

  User.create({
    username,
    password,
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.username = dbUserData.username;
        req.session.user_id = dbUserData.id;
        req.session.loggedIn = true;

        console.log(req.session);
        res.redirect("/");
      });
    })
    .catch(err => res.status(500).json(err));
});

//Login for the user
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      username,
    },
  })
    .then(dbUserData => {
      //No account found if no data
      if (!dbUserData) {
        res.status(404).json({ message: "Account not found." });
        return;
      }

      const validPassword = dbUserData.validatePassword(password);

      if (!validPassword) {
        res.status(404).json({ message: "Wrong password." });
        return;
      }

      //Saves the session if all login info is correct
      req.session.save(() => {
        req.session.username = dbUserData.username;
        req.session.user_id = dbUserData.id;
        req.session.loggedIn = true;

        console.log(req.session);
        res.redirect("/");
      });
    })
    .catch(err => res.status(500).json(err));
});

//Logout
router.post("/logout", (req, res) => {
  //Destroy session only when logged out
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  //
  else {
    res.status(204).end();
  }
});

export default router;
