//import sequelize model class, datatypes, and sequelize connection
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection").default;

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize: sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
