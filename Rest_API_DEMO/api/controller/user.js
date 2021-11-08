const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Activity = require("../models/activity");
exports.all_users = (req, res, next) => {
  User.find({})
    .select("_id name email phone role gender")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        users: doc.map((user) => {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            // phone: user.phone,
            // role: user.role,
            // gender: user.gender,
            url: {
              Type: "GET",
              url: "http://localhost:3000/users/" + user._id,
            },
          };
        }),
      };

      //for activity

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mess: err,
      });
    });
};

exports.create_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {

            let info = {
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              // phone: req.body.phone,
              // gender: req.body.gender,
              name: req.body.name,
            };
            if (req.body.email === "plabonislamcse@gmail.com") {
              info.role = true;
            }
            const user = new User(info);
            user
              .save()
              .then((result) => {
                console.log(result);

                //for activity
                const activity = new Activity({
                  _id: new mongoose.Types.ObjectId(),
                  userid: result._id,
                  activityName: "user created",
                });
                activity
                  .save()
                  .then((result) => {
                    console.log(" user activity recorded");
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: err,
                    });
                  });
                //end of activity

                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.update_user = (req, res, next) => {

  const id = req.params.userId;
  console.log(id);
  const updateops = {};

  for (const it of req.body) {
    updateops[it.propName] = it.value;
  }
  console.log(updateops);
  User.updateOne({ _id: id }, { $set: updateops })
    .exec()
    .then((result) => {
      console.log(result);

      //for activity
      const activity = new Activity({
        _id: new mongoose.Types.ObjectId(),
        userid: id,
        activityName: "user updated",
      });
      activity
        .save()
        .then((result) => {
          console.log(" user activity recorded");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
      //end of activity

      res.status(200).json({
        mess: "User Updated Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};


exports.all_activity = (req, res, next) => {
  console.log("heroooooo");

  Activity.find({})
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        activities: doc.map((act) => {
          return act
        }),
      };

      //for activity

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mess: err,
      });
    });
};