import { useState, useEffect } from "react";
import styles from "./AccountInformation.module.css"; // ✅ الآن هو CSS Module
import { useNavigate } from "react-router-dom"; // لاستخدام التوجيه بعد تسجيل الخروج
import MyNavbar from "../../landing/navbar";
import UserOrders from "../orders/orders";
import { Footer } from "../../landing/home";
import BASE_BACKEND_URL from "../../API/config";

function AccountInformation() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook للتوجيه بين الصفحات
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token"); // جلب التوكين من localStorage

    if (!userToken) {
      setError("لم يتم العثور على التوكين. الرجاء تسجيل الدخول.");
      setLoading(false);
      return;
    }

    // fetch("http://localhost:8000/api/user/getaccount", {
    fetch(`${BASE_BACKEND_URL}/user/getaccount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`, // إرسال التوكين مع الطلب
      },
    })
      .then((response) => {
        if (!response.ok) {

          setTimeout(() => {
            navigate('/signeup');
          }, 3000);
          throw new Error("فشل في جلب البيانات، يرجى مراجعة تسجيل دخولك.");
        }
        return response.json();
      })
      .then((data) => {
        setAccount(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    setLogoutLoading(true); // بدء التحميل
    const userToken = localStorage.getItem("user_token");

    // fetch("http://localhost:8000/api/user/logout", {
    fetch(`${BASE_BACKEND_URL}/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("فشل تسجيل الخروج");
        return response.json();
      })
      .then(() => {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_id");
        navigate("/"); // التوجيه إلى الصفحة الرئيسية بدلاً من /login
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLogoutLoading(false); // إيقاف التحميل سواء نجح أو فشل
      });
  };

  if (loading)
    return (
      <>
        <MyNavbar />
        <div className={styles.container1}>
          <div className={styles.card}>
            <h1 className={styles.loading}>جارٍ تحميل البيانات...</h1>
          </div>
        </div>
      </>
    );
  if (error)
    return (
      <>
        <MyNavbar />
        <div className={styles.container1}>
          <div className={styles.card}>
            <h1 className={styles.error}>{error}</h1>
          </div>
        </div>
      </>
    );

  return (
    <>
      <MyNavbar />
      <div className={styles.container1}>
        <div className={styles.card}>
          <h1 className={styles.title}>معلومات الحساب</h1>
          <p>
            <strong>👤 الاسم:</strong>{" "}
            {account.first_name + " " + account.last_name}
          </p>
          <p>
            <strong>📧 البريد الإلكتروني:</strong> {account.email}
          </p>
          <p>
            <strong>📞 رقم الهاتف:</strong> {account.phone_number}
          </p>
          <p>
            <strong>📍 العنوان:</strong> {account.area + " " + account.city}
          </p>

          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                جاري تسجيل الخروج...
              </>
            ) : (
              "🚪 تسجيل الخروج"
            )}
          </button>
        </div>
      </div>
        <div style={{direction:'rtl'}}>
          <UserOrders />
        </div>
        <Footer />
    </>
  );
}

export default AccountInformation;