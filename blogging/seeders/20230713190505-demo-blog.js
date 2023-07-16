"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Aha!",
          email: "at@gmail.com",
          password: await bcrypt.hash("password", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bha!",
          email: "meagain@gmail.com",
          password: await bcrypt.hash("password", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const users = await queryInterface.sequelize.query(`SELECT id FROM users`);
    const userID = users[0][0].id;

    await queryInterface.bulkInsert(
      "posts",
      [
        {
          title: "First Post",
          content: "This is my first post",
          UserId: userID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Second Post",
          content: "This is my second post",
          UserId: userID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    const posts = await queryInterface.sequelize.query(`SELECT id FROM posts`);
    const postID = posts[0][0].id;
  

    await queryInterface.bulkInsert(
      "comments",
      [
        {
          content: "This is my first comment",
          PostId: postID,
          UserId: userID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "This is my second comment",
          PostId: postID,
          UserId: userID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("comments", null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
