const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinery");
const verfy = require("../utils/autorize");
const { image } = require("../utils/multer");
const contentModel = require("../model/contentModel");
const userModel = require("../model/userModel");

router.post("/content", verfy, image, async (req, res) => {
  try {
    if (req.user.seller === true) {
      const { description, title, price, catrgory } = req.body;
      const cloudImage = await cloudinary.uploader.upload(req.file.path);
      const getUser = await userModel.findById(req.params.id);
      const postContent = new contentModel({
        title,
        description,
        price,
        catrgory,
        image: cloudImage.secure_url,
        imageId: cloudImage.public_id,
      });

      postContent.user = getUser;
      postContent.save();

      getUser.content.push(postContent);
      getUser.save();

      res.status(201).json({
        status: "Content Created",
        data: postContent,
      });
    } else {
      res.status(500).json({
        message: "You Cannot carry out this Poeration",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: res.status(404).json({
        message: error.message,
        status: "Failed to carry out Operation",
      }),
    });
  }
});

module.exports = router;
