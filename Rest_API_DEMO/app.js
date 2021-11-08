//helps to handle req  easier
const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketIo = require("socket.io");


// mongoose.connect("mongodb://localhost:27017/Insta", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://root:987654321@cluster0.wyhaq.mongodb.net/Rest?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("yes");
  });

//log request url
app.use(morgan("dev"));

//making a folder static so it is accessable for everyone

app.use(express.static("uploads"));

//for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());






//for cors
app.use((req, res, next) => {
  //* means all domain  can  access now you can also specify domain here
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type, Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
const post=40000;
//routes which should handle request
const ProductRoutes = require("./api/routes/products");
const UserRoutes = require("./api/routes/user");
const PostRoutes =require("./api/routes/post")
app.use("/products", ProductRoutes);

app.use("/users", UserRoutes);

app.use("/posts",PostRoutes);
//if req doesnot matched with  above two router
//than meet below middleware which creates error and forward it via next function
app.use((req, res, next) => {
  const err = new Error("not found");
  err.status = 404;
  next(err);
});

//if an  error found in  database operation or any error forward here
//than below function works
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error.message);

  res.json({
    error: {
      mess: error.message,
      status: error.status,
    },
  });
});




const port = process.env.PORT || 3000;
//when a req came run the server
//run the function that pass via create Server
const server = http.createServer(app);
//listen the server function on  port




const io = socketIo(server); // < Interesting!




io.on("connection", (socket) => {
  console.log("New client connected");
  
  socket.on("join",(data)=>{
console.log("JOin",data);
socket.broadcast.emit("join","chill");
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

console.log(post);

server.listen(port);
module.exports = app;
