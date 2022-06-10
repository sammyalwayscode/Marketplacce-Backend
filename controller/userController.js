const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      const passCheck = await bcrypt.compare(password, findUser.password);
      if (passCheck) {
        const token = jwt.sign(
          {
            _id: findUser._id,
            email: findUser.email,
            userName: findUser.userName,
            seller: findUser.seller,
            avatar: findUser.avatar,
          },
          "AjeGUNLRSELlerMARKETplACe",
          { expiresIn: "1d" }
        );
        const { password, ...info } = findUser._doc;
        res.status(201).json({
          status: `Welcome Back ${findUser.userName}`,
          data: { token, ...info },
        });
      } else {
        res.status(500).json({
          status: "Password is Incorrect",
        });
      }
    } else {
      res.status(500).json({
        status: "User Not in Our DATABASE",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteuser = await userModel.findByIdAndDelete();
    res.status(200).json({
      status: "Success",
      data: deleteuser,
    });
  } catch (error) {
    res.status(500).json({
      status: error.message,
    });
  }
};

module.exports = { signInUser, getUser, getUsers, deleteUser };
