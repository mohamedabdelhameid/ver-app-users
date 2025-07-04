import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Grid,
  Container,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import './login.css';
import BASE_BACKEND_URL from "../../API/config";

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "first_name":
        setFirstName(value);
        break;
      case "last_name":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone_number":
        setPhoneNumber(value);
        break;
      case "city":
        setCity(value);
        break;
      case "area":
        setArea(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "password_confirmation":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    setMessage("");

    const data = {
      email,
      password,
      password_confirmation: confirmPassword,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      country,
      city,
      area,
    };

    try {
      const response = await axios.post(
        // "http://localhost:8000/api/user/register",
        `${BASE_BACKEND_URL}/user/register`,
        data
      );

      if (response.status === 201) {
        setMessage(
          "✅ تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
        );
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;
        let data2 = await error.response.data;
        if (typeof data2 === "string") {
          try {
            data2 = JSON.parse(data2);
          } catch (e) {
            console.error("Error parsing error.response.data:", e);
          }
        }
        if (
          data2.email &&
          data2.email[0] === "The email has already been taken."
        ) {
          setMessage(
            "⚠ الحساب مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر."
          );
        } else if (error.response.status === 400) {
          setMessage("⚠ خطأ في البيانات: " + JSON.stringify(errorMessage));
        } else if (error.response.status === 401) {
          setMessage(
            "🔒 يرجى تأكيد حسابك عبر البريد الإلكتروني المرسل إلى " + email
          );
        } else if (error.response.status === 409) {
          setMessage(
            "⚠ الحساب مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر."
          );
        } else {
          setMessage("❌ فشل الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
        }
      } else {
        setMessage("❌ حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVarification = async () => {
    if (!email) {
      setMessage("⚠ يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        // "http://localhost:8000/api/user/resend-verification",
        `${BASE_BACKEND_URL}/user/resend-verification`,
        { email }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage(
          "✅ تم إعادة إرسال رسالة التأكيد بنجاح! يرجى التحقق من بريدك الإلكتروني."
        );
      }
    } catch (error) {
      setMessage("❌ فشل إعادة الإرسال. حاول مرة أخرى لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#ccc",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
        >
          إنشاء حساب جديد
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          سوف يتم إرسال رسالة عبر البريد الإلكتروني للتأكيد
        </Typography>

        <Box
          component="form"
          onSubmit={handleSignup}
          sx={{ width: "100%", mt: 1 }}
        >
          {/* الاسم الأول والأخير في صف واحد */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="الاسم الأول"
                name="first_name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="الاسم الأخير"
                name="last_name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <TextField
            label="البريد الإلكتروني"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <TextField
            label="رقم الهاتف"
            name="phone_number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          {/* المدينة والشارع في صف واحد */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="المدينة"
                name="city"
                variant="outlined"
                fullWidth
                margin="normal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="العنوان"
                name="area"
                variant="outlined"
                fullWidth
                margin="normal"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </Grid>
          </Grid>


          <TextField
            label="كلمة المرور"
            name="password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />

          <TextField
            label="تأكيد كلمة المرور"
            name="password_confirmation"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2, py: 1.5, direction: "rtl" }}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
          </Button>

          {message && (
            <Typography
              color={message.includes("✅") ? "success.main" : "error.main"}
              textAlign="center"
              sx={{ mt: 2, direction: "rtl" }}
            >
              {message}
            </Typography>
          )}
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            لديك حساب بالفعل؟{" "}
            <Link
              to="/signeup"
              style={{ color: theme.palette.primary.main, fontWeight: "bold" }}
            >
              تسجيل الدخول
            </Link>
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Link
                onClick={handleResendVarification}
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                إعادة ارسال رسالة التأكيد
              </Link>
            )}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FaHome />}
            onClick={() => navigate("/")}
            sx={{
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 1,
              },
            }}
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
