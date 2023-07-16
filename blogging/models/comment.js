"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Post);
      this.belongsTo(models.User);

    }
  }
  Comment.init(
    {
      content: { type: DataTypes.STRING, allowNull: false, validate: { len: [1, 255] } },
      PostId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "posts", key: "id" } },
      UserId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
    }
  );
  return Comment;
};
