const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const CustomerReturnOrder = require("./CustomerReturnOrder");
const Product = require("./Product");

const CustomerReturnDetail = sequelize.define(
  "CustomerReturnDetail",
  {
    CustomerReturnDetailID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    CustomerReturnOrderID: {
      type: DataTypes.INTEGER,
      references: {
        model: "CustomerReturnOrder",
        key: "ReturnID",
      },
    },
    BarcodeProduct: {
      type: DataTypes.STRING(100),
      references: {
        model: "Product",
        key: "BarcodeProduct",
      },
    },
  },
  {
    tableName: "CustomerReturnDetail",
    timestamps: false,
  }
);

CustomerReturnDetail.belongsTo(CustomerReturnOrder, {
  foreignKey: "CustomerReturnOrderID",
});
CustomerReturnDetail.belongsTo(Product, { foreignKey: "BarcodeProduct" });

module.exports = CustomerReturnDetail;
