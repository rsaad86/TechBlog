//import sequelize model class, datatypes, sequelize connection, and bcrypt for password hashing
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

class User extends Model {
  //check the provided password again the user password and authenticate the user
  validatePassword(loginPassword) {
    const valid = bcrypt.compareSync(loginPassword, this.password);
    return valid;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
