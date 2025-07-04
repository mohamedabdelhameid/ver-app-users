import React, { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import imgInsta from "./images/Instapay.jpg";
import BASE_BACKEND_URL from "../../API/config";

function PaymentModal({ open, onClose, orderId }) {
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [paymentProof, setPaymentProof] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePaymentSubmit = async () => {
    setError("");
    setSuccessMsg("");

    const token = localStorage.getItem("user_token");
    if (!token) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }

    if (paymentMethod === "instapay" && !paymentProof) {
      setError("يرجى رفع صورة إثبات الدفع");
      return;
    }

    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("payment_method", paymentMethod);
    if (paymentMethod === "instapay") {
      formData.append("payment_proof", paymentProof);
    }
    formData.append("note", note);

    try {
      setLoading(true);
      const response = await fetch(`${BASE_BACKEND_URL}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("حدث خطأ أثناء إرسال البيانات");

      setSuccessMsg("تم إرسال بيانات الدفع بنجاح");
      setTimeout(() => {
        onClose();
        // إعادة التهيئة
        setPaymentMethod("instapay");
        setPaymentProof(null);
        setNote("");
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        direction: "rtl",
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: { xs: "90%", md: "600px" },
            p: 4,
            position: "relative",
            outline: "none",
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "text.secondary",
            }}
          >
            <CloseOutlinedIcon />
          </IconButton>

          <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            إتمام الدفع
          </Typography>

          {/* اختيار طريقة الدفع */}
          {/* <RadioGroup
            row
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ justifyContent: "center", mb: 2 }}
          >
            <FormControlLabel
              value="instapay"
              control={<Radio />}
              label="InstaPay"
            />
          </RadioGroup>
          */}

          <RadioGroup
            row
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ justifyContent: "center", mb: 2 }}
          >
            <FormControlLabel
              value="instapay"
              control={<Radio />}
              label="InstaPay"
            />
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label="الدفع عند الاستلام"
            />
          </RadioGroup>

          {/* QR Code */}
          {/* <Box textAlign="center" mb={2}>
            <img
              src={imgInsta}
              alt="QR Code"
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          </Box> */}

          {/* رفع صورة إثبات الدفع */}
          {/* <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              صورة إثبات الدفع
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentProof(e.target.files[0])}
            />
          </Box> */}

          {paymentMethod === "instapay" && (
            <>
              {/* QR Code */}
              <Box textAlign="center" mb={2}>
                <img
                  src={imgInsta}
                  alt="QR Code"
                  style={{ width: 200, height: 200, objectFit: "contain" }}
                />
              </Box>

              {/* رفع صورة إثبات الدفع */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  صورة إثبات الدفع
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentProof(e.target.files[0])}
                />
              </Box>
            </>
          )}

          {/* ملاحظات */}
          <TextField
            fullWidth
            label="ملاحظات (اختياري)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />

          {/* رسائل التنبيه */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMsg}
            </Alert>
          )}

          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handlePaymentSubmit}
              disabled={loading}
              sx={{ px: 4, py: 1.5 }}
            >
              {loading ? "جاري الإرسال..." : "إرسال"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default PaymentModal;
