//import sequelize model class, datatypes, sequelize connection, and bcrypt for password hashing
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import { compareSync, hash } from "bcrypt";

class User extends Model {
  //check the provided password again the user password and authenticate the user
  validatePassword(loginPassword) {
    const valid = compareSync(loginPassword, this.password);
    return valid;
  }
}

//Define the model's fields and config
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
        newUserData.password = await hash(newUserData.password, 10);
        return newUserData;
      },
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

export default User;
