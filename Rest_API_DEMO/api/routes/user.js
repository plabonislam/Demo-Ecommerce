const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const check = require("../middleware/check-auth");
const admin=require("../middleware/check-admin");
const Usercontroller = require("../controller/user");
const user = require("../models/user");

router.post("/signup", Usercontroller.create_user);
router.get("/", Usercontroller.all_users);
router.patch("/:userId", Usercontroller.update_user);

router.get("/activity", Usercontroller.all_activity);





router.post("/signin", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        res.status(404).json({
          err: "Auth faild",
        });
      } else {
        
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
          if (err) {
            return res.status(500).json({
              err: "Password failed",
            });
          }
          if (result) {
            //for match

            const UserInfo = {
              email: req.body.email,
              _id: users[0]._id,
              name:users[0].name
            };

            const token = jwt.sign(
              {
                email: req.body.email,
                _id: users[0]._id,
              },
              process.env.JWT_secret,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              mess: "Log in",
              token: token,
              UserInfo: UserInfo,
            });
          } else {
            //for nat password match
            return res.status(500).json({
              err: "Auth failed",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: "Auth Faild!!",
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.remove({ _id: userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        mess: "user Removed",
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = router;
