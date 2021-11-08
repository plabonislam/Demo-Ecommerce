const jwt = require("jsonwebtoken");
const User=require("../models/user");
module.exports =async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const tok = token.split(" ");
    const length = tok.length;
    const maintoken=tok[length-1];

    console.log(maintoken);
    const decode = jwt.verify(maintoken, process.env.JWT_secret);
    console.log(decode.email);
    console.log("BOSSSSSS");
    await User.findOne({ email: decode.email}).exec().then(result=>{
      req.user=result;
      console.log(result);
    
    }).catch(resu=>{
      console.log("my bad luck");
    })
    console.log("now");
    console.log(req.user);
    next();
  } catch (err) {
    console.log("HELLLLLLLLLL")
    res.status(401).json({
      
      error:err,
      mess:"failed"
    });
  }
};
