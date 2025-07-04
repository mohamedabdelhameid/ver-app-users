import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../user/cart/cartSlice";
import { Footer } from "../landing/home";
import MyNavbar from "../landing/navbar";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Badge,
  useTheme,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Swal from "sweetalert2";
import { selectAllCartItems } from "../user/cart/cartSlice";
import { Cancel } from "@mui/icons-material";
import BASE_BACKEND_URL from "../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";

// const IMAGE_COVER_API = "http://localhost:8000/api/mobiles";
const IMAGE_COVER_API = `${BASE_BACKEND_URL}/mobiles`;
// const ADD_TO_USER_CART = "http://localhost:8000/api/cart-items";
const ADD_TO_USER_CART = `${BASE_BACKEND_URL}/cart-items`;
// const GET_CART_ITEMS_API = "http://localhost:8000/api/cart";
const GET_CART_ITEMS_API = `${BASE_BACKEND_URL}/cart`;

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [imageCover, setImageCover] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);

  const cartItems = useSelector(selectAllCartItems);
  const products = useSelector((state) => state.products.items || []);
  const data = products.find((p) => p.id.toString() === id) || null;

  const showMessageAndRedirect = (text, duration, callback) => {
  setMessageText(text);
  setTimeout(() => {
    callback();
  }, duration);
};


  // حساب الكمية في السلة للون المحدد
  useEffect(() => {
    if (cartItems.length > 0 && data) {
      const currentProductInCart = cartItems.filter(
        (item) =>
          item.product_id.toString() === id &&
          item.product_type === "mobile" &&
          item.product_color_id === (selectedColor?.id || null)
      );

      const totalQuantity = currentProductInCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartQuantity(totalQuantity);

      // التحقق من الحد الأقصى للمخزون
      const maxQuantity = selectedColor
        ? selectedColor.stock_quantity
        : data.total_quantity;

      if (totalQuantity >= maxQuantity) {
        setMessageText(
          `⚠️ لقد وصلت للحد الأقصى لهذا المنتج (${maxQuantity} قطعة)`
        );
        setShowMessage(true);
      }
    } else {
      setCartQuantity(0);
    }
  }, [cartItems, data, id, selectedColor]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || !data) return;

    // حساب الكمية المتاحة بناءً على اللون المحدد
    const maxQuantity = selectedColor
      ? selectedColor.stock_quantity - cartQuantity
      : data.total_quantity - cartQuantity;

    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    } else if (newQuantity > maxQuantity) {
      setQuantity(maxQuantity);
      Swal.fire(
        "تنبيه",
        `الحد الأقصى للكمية المتاحة هو ${maxQuantity}`,
        "info"
      );
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // جلب تفاصيل المنتج والألوان
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${IMAGE_COVER_API}/${id}`);
        const json = await response.json();

        if (json.data) {
          setProductDetails(json.data);
          setColors(json.data.colors || []);

          if (json.data.image_cover) {
            // setImageCover(`http://localhost:8000${json.data.image_cover}`);
            setImageCover(
              `${BASE_BACKEND_LOCAHOST_URL}${json.data.image_cover}`
            );
          }

          // تم إزالة تحديد اللون الأول المتاح افتراضيًا
        }
      } catch (error) {
        console.error("خطأ في جلب بيانات المنتج:", error);
      }
    };

    fetchProductData();
  }, [id]);

  // تحديد الصورة الرئيسية
  useEffect(() => {
    if (selectedColor?.images?.[0]?.image) {
      // setMainImage(`http://localhost:8000${selectedColor.images[0].image}`);
      setMainImage(
        `${BASE_BACKEND_LOCAHOST_URL}${selectedColor.images[0].image}`
      );
    } else if (imageCover) {
      setMainImage(imageCover);
    } else if (data?.images?.length > 0) {
      setMainImage(data.images[0]);
    }
  }, [data, imageCover, selectedColor]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!data) {
      // setMessageText("❌ حدث خطأ في تحميل بيانات المنتج");
      showMessageAndRedirect("❌   يرجى مراجعة تسجيل دخولك!", 3000, () =>
        navigate("/signeup")
      );
      setShowMessage(true);
      return;
    }

    // التحقق من اختيار اللون إذا كان متاحًا
    if (colors.length > 0 && !selectedColor) {
      setMessageText("❌ يرجى اختيار لون أولاً");
      setShowMessage(true);
      return;
    }

    // حساب الكمية المتاحة بناءً على اللون المحدد
    const maxQuantity = selectedColor
      ? selectedColor.stock_quantity
      : data.total_quantity;

    if (quantity + cartQuantity > maxQuantity) {
      Swal.fire(
        "تنبيه",
        `لقد وصلت للحد الأقصى لهذا المنتج (${maxQuantity} قطعة)`,
        "info"
      );
      return;
    }

    if (!token || !userId) {
      setMessageText("❌ يجب تسجيل الدخول أولاً!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setTimeout(() => navigate("/signeup"), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(ADD_TO_USER_CART, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: id,
          product_type: "mobile",
          product_color_id: selectedColor?.id || null,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إضافة المنتج إلى السلة");
      }

      setMessageText("✅ تم إضافة المنتج إلى العربة بنجاح!");
      setShowMessage(true);

      // تحديث كمية السلة بعد الإضافة
      fetchCartQuantity();
    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);
      // setMessageText("❌ حدث خطأ أثناء إضافة المنتج");
      showMessageAndRedirect("❌   يرجى مراجعة تسجيل دخولك!", 3000, () =>
        navigate("/signeup")
      );
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleColorSelect = (color) => {
    if (!color.is_available) return;

    setSelectedColor(color);
    setQuantity(1); // إعادة تعيين الكمية عند تغيير اللون

    // تغيير الصورة الرئيسية لأول صورة في اللون الجديد
    if (color.images?.[0]?.image) {
      // setMainImage(`http://localhost:8000${color.images[0].image}`);
      setMainImage(`${BASE_BACKEND_LOCAHOST_URL}${color.images[0].image}`);
    }
  };

  // جلب كمية السلة عند تحميل المكون
  useEffect(() => {
    fetchCartQuantity();
  }, [id, selectedColor]);

  const fetchCartQuantity = async () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setCartQuantity(0);
      return;
    }

    try {
      const response = await fetch(GET_CART_ITEMS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("user_token");
          setCartQuantity(0);
          return;
        }
        throw new Error("Failed to fetch cart items");
      }

      const responseData = await response.json();

      if (
        responseData.data &&
        responseData.data.cart_items &&
        Array.isArray(responseData.data.cart_items)
      ) {
        const cartItem = responseData.data.cart_items.find(
          (item) =>
            item.product_id.toString() === id &&
            item.product_color_id === (selectedColor?.id || null)
        );
        setCartQuantity(cartItem ? cartItem.quantity : 0);
      } else {
        setCartQuantity(0);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartQuantity(0);
    }
  };

  // حساب الكمية المتاحة بناءً على اللون المحدد
  const availableQuantity = selectedColor
    ? selectedColor.stock_quantity - cartQuantity
    : data?.total_quantity
    ? data.total_quantity - cartQuantity
    : 0;

  if (!data) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // تحديد الصور المعروضة في المعاينة
  const previewImages = selectedColor?.images || data.images || [];

  return (
    <>
      <MyNavbar />
      <Box
        sx={{
          marginTop: "85px",
          direction: "rtl",
          minHeight: "80vh",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            m: 3,
            position: "relative",
            marginTop: "85px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 100,
              color: "error.main",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
              border: "1px solid #ddd",
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>

          <Grid
            container
            spacing={3}
            style={{ alignItems: "center" }}
            sx={{ maxWidth: "1200px" }}
          >
            <Grid item xs={12} md={6}>
              <Paper
                style={{ color: "unset", backgroundColor: "unset" }}
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {mainImage ? (
                  <Box
                    component="img"
                    src={mainImage}
                    alt={data.title}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: 2,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: 300,
                      fontSize: "3rem",
                    }}
                  >
                    لا توجد صورة
                  </Avatar>
                )}

                {previewImages.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      overflowX: "auto",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {previewImages.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() =>
                          setMainImage(
                            img.image
                              ? // ? `http://localhost:8000${img.image}`
                                `${BASE_BACKEND_LOCAHOST_URL}${img.image}`
                              : img
                          )
                        }
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            // (img.image ? `http://localhost:8000${img.image}` : img) === mainImage
                            (img.image
                              ? `${BASE_BACKEND_LOCAHOST_URL}${img.image}`
                              : img) === mainImage
                              ? "2px solid #1976d2"
                              : "1px solid #ddd",
                        }}
                      >
                        <img
                          // src={img.image ? `http://localhost:8000${img.image}` : img}
                          src={
                            img.image
                              ? `${BASE_BACKEND_LOCAHOST_URL}${img.image}`
                              : img
                          }
                          alt={`صورة ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                style={{ color: "unset", backgroundColor: "unset" }}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {data.title}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    {data.discount ? (
                      <>
                        <Typography
                          variant="h5"
                          color="textSecondary"
                          sx={{ textDecoration: "line-through", mr: 1 }}
                        >
                          {data.price} جنيه
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {data.final_price} جنيه
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h4" color="primary">
                        {data.price} جنيه
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body1" paragraph>
                    {data.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        <strong>الشركة:</strong>{" "}
                        {data.brand?.name || "غير معروف"}
                      </Typography>
                    </Grid>
                    {data.storage && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>المساحة:</strong> {data.storage} جيجا بايت
                        </Typography>
                      </Grid>
                    )}
                    {data.display && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشاشة:</strong> {data.display}
                        </Typography>
                      </Grid>
                    )}
                    {data.camera && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الكاميرا:</strong> {data.camera} ميجا بايت
                        </Typography>
                      </Grid>
                    )}
                    {data.processor && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>المعالج:</strong> {data.processor}
                        </Typography>
                      </Grid>
                    )}
                    {data.operating_system && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>نظام التشغيل:</strong> {data.operating_system}
                        </Typography>
                      </Grid>
                    )}
                    {data.network_support && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشبكة:</strong> {data.network_support}
                        </Typography>
                      </Grid>
                    )}
                    {data.battery && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>البطارية:</strong> {data.battery} مللي أمبير
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {/* عرض الألوان */}
                  {colors.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        الألوان المتاحة
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        {colors.map((color) => (
                          <Tooltip
                            key={color.id}
                            title={`${color.color?.name || "بدون اسم"}${
                              !color.is_available ? " (غير متوفر)" : ""
                            }`}
                            arrow
                          >
                            <Badge
                              color="primary"
                              badgeContent={
                                selectedColor?.id === color.id ? "✓" : ""
                              }
                              overlap="circular"
                            >
                              <Box
                                onClick={() => handleColorSelect(color)}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  backgroundColor:
                                    color.color?.hex_code || "#ccc",
                                  border:
                                    selectedColor?.id === color.id
                                      ? "2px solid #1976d2"
                                      : "1px solid #ddd",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                    cursor: color.is_available
                                      ? "pointer"
                                      : "not-allowed",
                                  },
                                  opacity: color.is_available ? 1 : 0.5,
                                  transition: "all 0.2s ease-in-out",
                                }}
                              />
                            </Badge>
                          </Tooltip>
                        ))}
                      </Box>
                      {!selectedColor && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          ⚠️ يرجى اختيار لون
                        </Typography>
                      )}
                    </Box>
                  )}

                  {availableQuantity > 0 ? (
                    <Chip
                      label="متاح"
                      color="success"
                      icon={<CheckCircleIcon />}
                      variant="outlined"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginTop: "15px",
                      }}
                    />
                  ) : (
                    <Chip
                      label="غير متوفر"
                      color="error"
                      icon={<Cancel />}
                      variant="outlined"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginTop: "15px",
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextField
                      type="number"
                      size="small"
                      label="الكمية"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{
                        min: 1,
                        max: availableQuantity,
                        style: {
                          textAlign: "center",
                          color: "green",
                        },
                      }}
                      sx={{
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "green",
                          },
                          "&:hover fieldset": {
                            borderColor: "darkgreen",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "green",
                        },
                        "& .Mui-focused": {
                          color: "darkgreen",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      disabled={
                        isLoading ||
                        (colors.length > 0 && !selectedColor) ||
                        availableQuantity <= 0 ||
                        quantity > availableQuantity
                      }
                      sx={{ flexGrow: 1 }}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {availableQuantity <= 0
                        ? "غير متوفر"
                        : isLoading
                        ? "جاري الإضافة..."
                        : "إضافة إلى عربة التسوق"}
                    </Button>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      <strong>الكمية المتاحة:</strong>{" "}
                      <span
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        {availableQuantity} قطعة
                      </span>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Snackbar
            open={showMessage}
            autoHideDuration={3000}
            onClose={handleCloseMessage}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseMessage}
              severity={
                messageText.includes("✅")
                  ? "success"
                  : messageText.includes("❌")
                  ? "error"
                  : "warning"
              }
              sx={{ width: "100%" }}
              icon={
                messageText.includes("✅") ? (
                  <CheckCircleIcon fontSize="inherit" />
                ) : messageText.includes("❌") ? (
                  <Cancel fontSize="inherit" />
                ) : null
              }
            >
              {messageText}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default ProductDetails;
