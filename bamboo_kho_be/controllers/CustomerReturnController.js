const CustomerReturnOrder = require("../models/CustomerReturnOrder");
const CustomerReturnDetail = require("../models/CustomerReturnDetail");
const ExportDetail = require("../models/ExportDetail");
const Product = require("../models/Product");
const {
  validateCustomerReturnInput,
} = require("../validators/CustomerReturnValidator");

exports.createCustomerReturn = async (req, res) => {
  const transaction = await CustomerReturnOrder.sequelize.transaction();

  try {
    // ===== 1. Validate input =====
    const { isValid, errors } = await validateCustomerReturnInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const { ReturnDate, Reason, UserID, ExportID, Details } = req.body;

    // ===== 2. Tạo CustomerReturnOrder =====
    const returnOrder = await CustomerReturnOrder.create(
      { ReturnDate, Reason: Reason || null, UserID, ExportID },
      { transaction }
    );

    // ===== 3. Duyệt từng sản phẩm trong danh sách trả =====
    for (const detail of Details) {
      const exportDetail = await ExportDetail.findOne({
        where: { ExportID, BarcodeProduct: detail.BarcodeProduct },
        transaction,
      });

      if (!exportDetail) {
        await transaction.rollback();
        return res.status(404).json({
          message: `Product ${detail.BarcodeProduct} not found in export order.`,
        });
      }

      // ===== 4. Kiểm tra hạn bảo hành (nếu có) =====
      if (exportDetail.warranty_time && exportDetail.warranty_start_date) {
        const start = new Date(exportDetail.warranty_start_date);
        const end = new Date(start);
        end.setMonth(end.getMonth() + exportDetail.warranty_time);
        const today = new Date(ReturnDate);

        if (today > end) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Warranty expired for product ${detail.BarcodeProduct}.`,
          });
        }
      }

      // ===== 5. Kiểm tra số lượng trả hợp lệ =====
      const maxReturnable =
        exportDetail.Quantity - (exportDetail.ReturnedQuantity || 0);

      if (detail.Quantity > maxReturnable) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Invalid return quantity for product ${detail.BarcodeProduct}. You can only return up to ${maxReturnable} more.`,
        });
      }

      // ===== 6. Tạo CustomerReturnDetail =====
      await CustomerReturnDetail.create(
        {
          CustomerReturnOrderID: returnOrder.ReturnID,
          BarcodeProduct: detail.BarcodeProduct,
          Quantity: detail.Quantity,
          Reason: detail.Reason || null,
        },
        { transaction }
      );

      // ===== 7. Cập nhật ReturnedQuantity trong ExportDetail =====
      const newReturnedQty = exportDetail.ReturnedQuantity + detail.Quantity;
      await exportDetail.update(
        { ReturnedQuantity: newReturnedQty },
        { transaction }
      );

      // ===== 8. Cập nhật lại số lượng kho =====
      const product = await Product.findOne({
        where: { BarcodeProduct: detail.BarcodeProduct },
        transaction,
      });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          message: `Product ${detail.BarcodeProduct} not found in warehouse.`,
        });
      }

      const newQuantity = product.Quantity + detail.Quantity;
      await product.update({ Quantity: newQuantity }, { transaction });
    }

    // ===== 9. Commit transaction =====
    await transaction.commit();

    res.status(201).json({
      message:
        "Customer return order created successfully. Stock and return history updated.",
      returnOrder,
    });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: "Server error", error });
  }
};
