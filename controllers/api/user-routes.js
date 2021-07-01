const router = require("express").Router();
const { User } = require("../../models");

//API User Routes

//All db users
router.get("/", (req, res) => {
  User.findAll({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(500).json(err));
});

//Get a single user
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

//New DB User
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

//Login User
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      username,
    },
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "Account not found." });
        return;
      }

      const validPassword = dbUserData.validatePassword(password);

      if (!validPassword) {
        res.status(404).json({ message: "Incorrect password." });
        return;
      }

      //Save Session if login is good
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
  //Destroy session only if logout is successful
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
