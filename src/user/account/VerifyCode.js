import { Box, Button, CircularProgress, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaHome } from "react-icons/fa";
import BASE_BACKEND_URL from "../../API/config";

const VerifyCode = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [password_confirmation, setpassword_confirmation] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // تأكد من أنه يأخذ الـ URL الصحيح
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
    } else {
      setError("⚠️ لم يتم العثور على رمز إعادة التعيين في الرابط.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // بدء التحميل

    try {
      const response = await fetch(
        // "http://127.0.0.1:8000/api/user/password/reset",
        `${BASE_BACKEND_URL}/user/password/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            token: resetToken,
            password,
            password_confirmation,
          }),
        }
      );

      const data = await response.json();
      console.log("🔍 استجابة السيرفر:", data);

      if (response.ok) {
        setSuccess("🎉 تم استعادة كلمة السر بنجاح!");
        setTimeout(() => {
          navigate("/signeup");
        }, 3000);
      } else {
        setError(data.message || "❌ حدث خطأ ما يرجى المحاولة لاحقًا.");
      }
    } catch (err) {
      console.error("❌ خطأ في إرسال الطلب:", err);
      setError("⚠️ حدث خطأ، حاول مرة أخرى.");
    } finally {
      setLoading(false); // إيقاف التحميل
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Box p={4} width={350} bgcolor="white" borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          إعادة تعيين كلمة السر
        </Typography>

        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" textAlign="center">
            {success}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="البريد الإلكتروني"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="كلمة المرور"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />
          <TextField
            label="تأكيد كلمة المرور"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password_confirmation"
            value={password_confirmation}
            onChange={(e) => setpassword_confirmation(e.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FaSignInAlt />
              )
            }
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : "حفظ كلمة السر الجديدة"}
          </Button>
        </form>

        {success && (
          <Typography
            color="success.main"
            textAlign="center"
            sx={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
              fontWeight: "bold",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {success}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VerifyCode;
