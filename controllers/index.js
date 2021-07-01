const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes");
const mainpageRoutes = require("./mainpage-routes");

router.use("/api", apiRoutes);

router.use("/mainpage", mainpageRoutes);

router.use("/", homeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
