const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const router = express.Router();
const cloudinary = require("../utils/cloudinery");
const { upload } = require("../utils/multer");

router.post("/register", upload, async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

    const image = await cloudinary.uploader.upload(req.file.path);
    const createUser = await userModel.create({
      email,
      password: hashed,
      userName,
      avatar: image.secure_url,
      avatarID: image.public_id,
      seller: false,
    });
    res.status(201).json({
      message: "Member Created",
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch("/:id/update_member", upload, async (req, res) => {
  try {
    const { userName } = req.body;

    const image = await cloudinary.uploader.upload(req.file.path);
    const createUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        userName,
        avatar: image.secure_url,
        avatarID: image.public_id,
      },
      { new: true }
    );
    res.status(201).json({
      message: "Member Updated",
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/register_join", upload, async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

    const image = await cloudinary.uploader.upload(req.file.path);
    const createUser = await userModel.create({
      email,
      password: hashed,
      userName,
      avatar: image.secure_url,
      avatarID: image.public_id,
      seller: true,
    });
    res.status(201).json({
      message: "Seller Created",
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
