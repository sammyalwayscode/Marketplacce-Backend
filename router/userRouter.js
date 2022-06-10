const express = require("express");
const router = express.Router();
const {
  getUser,
  getUsers,
  deleteUser,
  signInUser,
} = require("../controller/userController");

router.route("/users").get(getUsers);
router.route("/user/signin").post(signInUser);
router.route("/user/:id").get(getUser).delete(deleteUser);

module.exports = router;
