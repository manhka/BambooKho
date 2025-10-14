const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/ProductRoutes");
const variantRoutes = require("./routes/VariantRoutes");
const customerReturnRoutes = require("./routes/CustomerReturn");
const sequelize = require("./configs/db");

const app = express();
app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/customer-return", customerReturnRoutes);
// connect DB
sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
