const express = require("express");
const router = express.Router();
//Router is sub pacakage of router

const check_auth = require("../middleware/check-auth");

const ProductController = require("../controller/product");

const multer = require("multer");

//set up storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

//calliing storage method and limit file and its type
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, //check size
  fileFilter: function (req, file, cb) {
    check(file, cb);
  },
});

//checking exten
function check(file, cb) {
  //allow ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check est
  const extname = filetypes.test(file.originalname.toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error("ot matched"), "typ not matched");
  }
}

router.get("/", ProductController.all_products);

router.post(
  "/",
  check_auth,
  upload.single("productImage"),
  ProductController.create_product
);

router.post("/:ProductId", ProductController.find_productById);
router.patch("/:ProductId", check_auth, ProductController.update_product);

router.delete("/:ProductId", check_auth, ProductController.delete_product);

module.exports = router;
