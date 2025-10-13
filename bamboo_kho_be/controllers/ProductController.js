const Product = require("../models/Product");
const ProductValidator = require("../validators/ProductValidator");
const { Op } = require("sequelize");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
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
exports.getProducts = async (req, res) => {
  try {
    const { keyword, brand, category } = req.query;

    // --- Where cho Product ---
    const productConditions = {};
    if (keyword) {
      productConditions[Op.or] = [
        { BarcodeProduct: { [Op.like]: `%${keyword}%` } },
        { ProductName: { [Op.like]: `%${keyword}%` } },
      ];
    }

    // --- Where cho Brand ---
    const brandConditions = {};
    if (brand) {
      brandConditions.BrandName = { [Op.like]: `%${brand}%` };
    }

    // --- Where cho Category ---
    const categoryConditions = {};
    if (category) {
      categoryConditions.CategoryName = { [Op.like]: `%${category}%` };
    }

    // --- Truy vấn ---
    const products = await Product.findAll({
      where: productConditions,
      include: [
        {
          model: Brand,
          attributes: ["BrandName"],
          where: Object.keys(brandConditions).length
            ? brandConditions
            : undefined,
          required: false,
        },
        {
          model: Category,
          attributes: ["CategoryName"],
          where: Object.keys(categoryConditions).length
            ? categoryConditions
            : undefined,
          required: false,
        },
      ],
      order: [["CreateAt", "DESC"]],
    });

    if (products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "product_not_found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "fetch_success",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      status: "error",
      message: "server_error",
    });
  }
};
