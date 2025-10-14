const db = require("../configs/db");

const User = {
  findByUsername: (username, callback) => {
    db.query("SELECT * FROM User WHERE Username = ?", [username], callback);
  },

  create: (newUser, callback) => {
    db.query(
      "INSERT INTO User (Username, Password, Phone, Status, RoleID) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.Username,
        newUser.Password,
        newUser.Phone,
        newUser.Status,
        newUser.RoleID,
      ],
      callback
    );
  },
};

module.exports = User;
