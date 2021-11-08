

module.exports=(req,res,next)=>{

console.log(req.user);
console.log("super");
next();
}