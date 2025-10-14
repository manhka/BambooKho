import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.roleID === 2;

  if (!isAdmin) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <h3 className="text-danger mb-3">Bạn không có quyền truy cập</h3>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {/* Nội dung chính */}
      <main className="main-content">
        <div className="position-relative iq-banner">
          <div className="iq-navbar-header" style={{ height: 120 }}>
            <h4 className="text-white ms-3 mt-4">Chào mừng, {user.username}</h4>
          </div>
        </div>

        <div className="container-fluid p-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Trang quản trị Admin</h4>
              <p className="text-muted">
                Bạn có thể tạo tài khoản nhân viên tại đây.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="btn btn-primary"
              >
                <i className="ri-user-add-line me-1"></i> Đăng ký nhân viên
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHomePage;
