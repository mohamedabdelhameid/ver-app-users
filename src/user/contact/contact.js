import React, { useState } from "react";
import { FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Footer } from "../../landing/home";
import MyNavbar from "../../landing/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import BASE_BACKEND_URL from "../../API/config";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("user_token");
    if (!token) {
      setMessage("⚠ يرجى تسجيل الدخول أولًا قبل إرسال الرسالة.");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      // const response = await fetch("http://localhost:8000/api/contact-us", {
      const response = await fetch(`${BASE_BACKEND_URL}/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept :"application/json"
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json(); // ⬅️ تحليل الاستجابة دائماً
      console.log("Server Response:", responseData); // ⬅️ تسجيل الاستجابة

      if (response.ok) {
        setMessage("✅ تم إرسال رسالتك بنجاح!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setMessage(responseData.message || "❌ حدث خطأ أثناء إرسال الرسالة");
      }
    } catch (error) {
      console.error("Error details:", error); // ⬅️ تسجيل الخطأ بالتفصيل
      setMessage("⚠ لا يمكن الاتصال بالخادم. حاول لاحقًا.");
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <MyNavbar />
      <div
        style={{
          marginTop: "85px",
          padding: "10px",
          direction: "rtl",
          maxWidth: "800px",
        }}
        className="container"
      >
        <h2 className="mb-4">تواصل معنا</h2>
        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-warning">
          {" "}
          نشكرك على تواصلك، وسنقوم بالرد عليك عبر البريد الإلكتروني في غضون ٤٨
          ساعة{" "}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">الاسم</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">رسالتك</label>
            <textarea
              className="form-control"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                جارٍ الإرسال...
              </>
            ) : (
              "إرسال"
            )}
          </button>
        </form>

        <div className="mt-4">
          <p>
            <FaMapMarkerAlt /> شارع 15، سوهاج
          </p>
          <p>
            <FaMapMarkerAlt /> شارع أحمد بدوي، المراغة
          </p>
          <p>
            <FaMapMarkerAlt /> شارع عبد المنعم رياض، المراغة
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
