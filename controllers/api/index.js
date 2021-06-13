//import router and route files
const router = require("express").Router();
import userRoutes from "./user-routes";
import postRoutes from "./post-routes";
import commentRoutes from "./comment-routes";

//direct the router to use our routes
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

export default router;
