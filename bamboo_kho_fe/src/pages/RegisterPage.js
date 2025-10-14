import React, { useState } from "react";
import { register } from "../services/authService";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token"); // token của admin
      if (!token) {
        setError("Vui lòng đăng nhập bằng tài khoản admin trước.");
        return;
      }

      await register(username, password, phone, 1, token);
      setSuccess("✅ Đăng ký nhân viên thành công!");
      setUsername("");
      setPassword("");
      setPhone("");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content">
        <div className="container">
          <div className="row align-items-center justify-content-center height-self-center">
            <div className="col-lg-8">
              <div className="card auth-card">
                <div className="card-body p-0">
                  <div className="d-flex align-items-center auth-content">
                    {/* Form bên trái */}
                    <div className="col-lg-7 align-self-center">
                      <div className="p-3">
                        <h2 className="mb-2">Đăng ký nhân viên</h2>
                        <p>Tạo tài khoản nhân viên mới.</p>

                        <form onSubmit={handleRegister}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder=" "
                                  required
                                />
                                <label>Tên đăng nhập</label>
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder=" "
                                  required
                                />
                                <label>Mật khẩu</label>
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="text"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder=" "
                                  required
                                />
                                <label>Số điện thoại</label>
                              </div>
                            </div>
                          </div>

                          {error && (
                            <p className="text-danger text-sm mb-2">{error}</p>
                          )}
                          {success && (
                            <p className="text-success text-sm mb-2">
                              {success}
                            </p>
                          )}

                          <button type="submit" className="btn btn-primary">
                            Đăng ký
                          </button>

                          <p className="mt-3">
                            Đã có tài khoản?{" "}
                            <a href="/" className="text-primary">
                              Đăng nhập
                            </a>
                          </p>
                        </form>
                      </div>
                    </div>

                    {/* Ảnh bên phải */}
                    <div className="col-lg-5 content-right">
                      <img
                        src="/assets/images/login/01.png"
                        className="img-fluid image-right"
                        alt="register"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
