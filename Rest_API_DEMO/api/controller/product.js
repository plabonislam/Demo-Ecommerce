const Product = require("../models/product");
const mongoose = require("mongoose");

exports.all_products = (req, res, next) => {
  const id = req.params.ProductId;
  Product.find({})
    .select("_id name price productImage")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((product) => {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            productImage: product.productImage,
            url: {
              Type: "GET",
              url: "http://localhost:3000/products/" + product._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mess: err,
      });
    });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);

      res.status(201).json({
        mess: "Product Created Successfully ",
        created: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mess: err,
      });
    });
};

exports.find_productById = (req, res, next) => {
  const id = req.params.ProductId;
  Product.findById(id)
    .exec()
    .then((result) => {
      console.log(result);

      if (result) {
        res.status(200).json(result);
      } else {
        res.status(200).json({
          mess: "Not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        mess: err,
      });
    });
};

exports.update_product = (req, res, next) => {
  const id = req.params.ProductId;
  const updateops = {};

  for (const it of req.body) {
    updateops[it.propName] = it.value;
  }
  console.log(updateops);
  Product.updateOne({ _id: id }, { $set: updateops })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        mess: "Product Updated Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.ProductId;

  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        mess: "Product Removed",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
