//import models
import User, { hasMany } from "./User";
import Post, { belongsTo, hasMany as _hasMany } from "./Post";
import Comment from "./Comment";

//User has many posts, a post belongs to a single user
hasMany(Post, { foreignKey: "user_id" });
belongsTo(User, { foreignKey: "user_id" });

//A user has many comments but a comment belongs to a single user
hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

//A post has many comments but a comment belongs to one post
_hasMany(Comment, { foreignKey: "post_id" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

export default { User, Post, Comment };
