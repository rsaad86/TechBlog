const router = require("express").Router();
import apiRoutes from "./api";
import homeRoutes from "./home-routes";
import mainpageRoutes from "./mainpage-routes";

router.use("/api", apiRoutes);

router.use("/mainpage", mainpageRoutes);

router.use("/", homeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

export default router;
