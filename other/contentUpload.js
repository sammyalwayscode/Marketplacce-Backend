const express = require("express");
const contentModel = require("../model/contentModel");
const verification = require("../utils/autorize");
const router = express.Router();
const cloudinary = require("../utils/cloudinery");
const { image } = require("../utils/multer");

router.get("/contents", async (req, res) => {
  try {
    const getContent = await contentModel.find();
    res.status(200).json({
      message: "Success",
      data: getContent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id/content", async (req, res) => {
  try {
    const getContent = await contentModel.findById(req.params.id);
    res.status(200).json({
      message: "Success",
      data: getContent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/contents", verification, image, async (req, res) => {
  if (req.user.seller) {
    try {
      const { title, description, price, category } = req.body;
      const myImage = await cloudinary.uploader.upload(req.file.path);
      const postContent = await contentModel.create({
        title,
        description,
        price,
        category,
        image: myImage.secure_url,
        imageID: myImage.public_id,
      });
      res.status(200).json({
        message: "Success",
        data: postContent,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(200).json({
      message: "You cannot carry out this Operation",
    });
  }
});

router.patch("/:id/updatecontent", verification, image, async (req, res) => {
  if (req.user.seller) {
    try {
      const newContent = await contentModel.findById(req.params.id);

      if (newContent) {
        const { description, title, price, category } = req.body;
        await cloudinary.uploader.destroy(newContent.imageID);
        const myImage = await cloudinary.uploader.upload(req.file.path);

        const updateContent = await contentModel.findByIdAndUpdate(
          req.params.id,
          {
            description,
            title,
            price,
            category,
            image: myImage.secure_url,
            imageID: myImage.public_id,
          },
          { new: true }
        );

        res.status(200).json({
          message: "Success",
          data: updateContent,
        });
      }
    } catch (error) {}
  } else {
    res.status(500).json({
      message: "You cannot Carry out this Operation",
    });
  }
});

router.delete("/:id/deletecontent", verification, async (req, res) => {
  if (req.user.seller === true) {
    try {
      const deletetUser = await contentModel.findByIdAndDelete(req.params.id);
      res.status(201).json({
        message: "Deleted",
        data: deletetUser,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(200).json({
      message: "You cannot carry out this Operation",
    });
  }
});

module.exports = router;
