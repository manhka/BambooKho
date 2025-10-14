import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user.roleID === 2) {
        navigate("/adminHomePage");
      } else {
        navigate("/staffHomePage");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
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
                        <h2 className="mb-2">Đăng nhập</h2>
                        <p>Vui lòng nhập thông tin tài khoản.</p>

                        <form onSubmit={handleLogin}>
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

                            <div className="col-lg-6">
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="remember"
                                />
                                <label
                                  className="custom-control-label control-label-1"
                                  htmlFor="remember"
                                >
                                  Ghi nhớ đăng nhập
                                </label>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <a
                                href="#"
                                className="text-primary float-right"
                              >
                                Quên mật khẩu?
                              </a>
                            </div>
                          </div>

                          {error && (
                            <p className="text-danger text-sm mb-2">{error}</p>
                          )}

                          <button type="submit" className="btn btn-primary">
                            Đăng nhập
                          </button>

                          <p className="mt-3">
                            Chưa có tài khoản?{" "}
                            <a href="#" className="text-primary">
                              Đăng ký
                            </a>
                          </p>
                        </form>
                      </div>
                    </div>

                    {/* Ảnh minh họa bên phải */}
                    <div className="col-lg-5 content-right">
                      <img
                        src="/assets/images/login/01.png"
                        className="img-fluid image-right"
                        alt="login"
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

export default LoginPage;
