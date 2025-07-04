import { Box, Button, CircularProgress, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaHome } from "react-icons/fa";
import BASE_BACKEND_URL from "../../API/config";

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // بدء التحميل

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("📧 البريد الإلكتروني غير صالح.");
      setLoading(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("🔒 كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      setLoading(false);
      return;
    }

    try {
      // const response = await fetch("http://127.0.0.1:8000/api/user/login", {
      const response = await fetch(`${BASE_BACKEND_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_token", data.access_token);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_name", data.user.first_name);

        setSuccess(
          `مرحبًا، ${data.user.first_name + " " + data.user.last_name}! 🎉`
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(
          data.message || "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة."
        );
      }
    } catch (err) {
      setError("⚠️ حدث خطأ في الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false); // إيقاف التحميل سواء نجح أو فشل
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
      <Box p={4} width={350} bgcolor="#ccc" borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={2} color="primary">
          تسجيل الدخول
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
            value={email}
            name="email"
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
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography>
            <Link
              to="/forgot-password"
              style={{ color: theme.palette.primary.main }}
            >
              هل نسيت كلمة المرور؟
            </Link>
          </Typography>
          <Typography
            mt={1}
            style={{ color: theme.palette.text.primary, marginLeft: 5 }}
          >
            ليس لديك حساب؟
            <Link
              to="/login"
              style={{ color: theme.palette.primary.main, marginLeft: 5 }}
            >
              إنشاء حساب جديد
            </Link>
          </Typography>
        </Box>

        {/* زر العودة إلى الصفحة الرئيسية */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FaHome />}
            onClick={() => navigate("/")}
            sx={{
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </Box>
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

export default Signup;
