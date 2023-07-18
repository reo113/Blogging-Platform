"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comment);
      this.belongsTo(models.User);
    }
  }
  Post.init(
    {
      Content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
          notEmpty: {
            msg: "Content cannot be empty",
            args: true,
          },
        },
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
          notEmpty: {
            msg: "Title cannot be empty",
            args: true,
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
    }
  );
  return Post;
};
