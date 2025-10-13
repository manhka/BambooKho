const db = require("../configs/db");

const User = {
  findByUsername: (username, callback) => {
    db.query("SELECT * FROM User WHERE Username = ?", [username], callback);
  },

  create: (newUser, callback) => {
    db.query(
      "INSERT INTO User (Username, Password, Phone, Status, RoleID, WarehouseID) VALUES (?, ?, ?, ?, ?, ?)",
      [
        newUser.Username,
        newUser.Password,
        newUser.Phone,
        newUser.Status,
        newUser.RoleID,
        newUser.WarehouseID,
      ],
      callback
    );
  },
};

module.exports = User;
