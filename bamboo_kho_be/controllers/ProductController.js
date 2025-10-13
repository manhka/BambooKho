const Product = require("../models/Product");
const ProductValidator = require("../validators/ProductValidator");

exports.createProduct = async (req, res) => {
  const data = req.body;
  const { isValid, errors } = ProductValidator.validate(data, false); // false = create

  if (!isValid) {
    return res.status(400).json({
      status: "error",
      message: "invalid_input",
      errors,
    });
  }

  try {
    const existing = await Product.findByPk(data.BarcodeProduct);
    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "product_already_exists",
      });
    }

    const product = await Product.create(data);
    res.status(201).json({
      status: "success",
      message: "product_created",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "server_error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { barcode } = req.params;
  const data = req.body;
  const { isValid, errors } = ProductValidator.validate(data, true); // true = update

  if (!isValid) {
    return res.status(400).json({
      status: "error",
      message: "invalid_input",
      errors,
    });
  }

  try {
    const product = await Product.findByPk(barcode);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "product_not_found",
      });
    }

    await product.update(data);
    res.status(200).json({
      status: "success",
      message: "product_updated",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "server_error",
    });
  }
};
