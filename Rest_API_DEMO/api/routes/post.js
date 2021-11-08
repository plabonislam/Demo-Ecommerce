const express= require("express");
const router= express.Router();
const mongoose = require("mongoose");
const Post=require("../models/post");

const check=require("../middleware/check-auth");
router.post("/",check,(req,res,next)=>{
    let info = {
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      body: req.body.body,
      image: req.body.image,
      postedBy: req.user._id,
    };
    const post = new Post(info);
    post.save().then((response)=>{
        console.log(response);
        res
          .status(201)
          .json({
            mess: "created Post",
          })
        })
          .catch((err) => {
            res.status(500).json({
              err: err
            });
          });            

});




router.get("/all",(req, res, next) => {
  Post.find({})
    .populate("postedBy", "email name")
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          mess: "order not found",
        });
      }
      res.status(200).json({
        doc: doc,
        response: {
          url: "GET",
          path: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        mess: err,
      });
    });
});





router.get("/byuser",check, (req, res, next) => {
  console.log("BRO");
  console.log(req.user._id);
  Post.find({postedBy : req.user._id}).then(doc=>{
    res.status(200).json({
      doc: doc,
      response: {
        url: "GET",
        path: "http://localhost:3000/orders",
      },
    });
  }).catch(err=>{
    res.status(500).json({
      errr:err
    })
  })
 
});






router.put("/like", check, (req, res, next) => {
  console.log("BRO");
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec().then(response=>{
    console.log(response);
    res.status(201).json(response)
  }).catch(err=>{
    res.status(505).json({
      err:err
    })
  })
  
});



router.put("/dislike", check, (req, res, next) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .exec()
    .then((response) => {
      console.log(response);
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(505).json({
        err: err,
      });
    });
});

module.exports = router;