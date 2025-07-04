import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../../landing/navbar";
import "./favourite.css";
import { Footer } from "../../landing/home";
import BASE_BACKEND_URL from "../../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../../API/localhost";

// const API_URL = "http://localhost:8000/api/wishlist";
const API_URL = `${BASE_BACKEND_URL}/wishlist`;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [clearAll, setClearAll] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      setSnackbarMessage("يجب تسجيل الدخول أولاً!");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/singeup"), 3000);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();

        // تصفية العناصر الفارغة والتحقق من وجود المنتج
        const validFavorites = (data.data || []).filter(
          (fav) => fav.product !== null && fav.product !== undefined
        );

        setFavorites(validFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setSnackbarMessage("حدث خطأ أثناء جلب قائمة المفضلة");
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleRemoveFavorite = (product) => {
    setSelectedProduct(product);
    setClearAll(false);
    setOpenDialog(true);
  };

  const handleClearFavorites = () => {
    setClearAll(true);
    setOpenDialog(true);
  };

  const confirmRemove = async () => {
    try {
      const userToken = localStorage.getItem("user_token");
      const url = clearAll ? API_URL : `${API_URL}/${selectedProduct.id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.ok) {
        if (clearAll) {
          setFavorites([]);
          setSnackbarMessage("تم حذف جميع المنتجات من المفضلة");
        } else {
          setFavorites(
            favorites.filter((fav) => fav.id !== selectedProduct.id)
          );
          setSnackbarMessage("تم الإزالة من المفضلة بنجاح");
        }
      } else {
        const data = await response.json();
        throw new Error(data.message || "فشل الحذف");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      setSnackbarMessage(error.message || "❌ حدث خطأ أثناء الحذف!");
    } finally {
      setOpenSnackbar(true);
      setOpenDialog(false);
    }
  };

  const getProductImage = (product) => {
    if (!product.product) return "/placeholder-product.png";

    return product.product_type === "mobile"
      ? product.product.image_cover
        // ? `http://localhost:8000${product.product.image_cover}`
        ? `${BASE_BACKEND_LOCAHOST_URL}${product.product.image_cover}`
        : "/placeholder-mobile.png"
      : product.product.image
      // ? `http://localhost:8000${product.product.image}`
      ? `${BASE_BACKEND_LOCAHOST_URL}${product.product.image}`
      : "/placeholder-accessory.png";
  };

  const getProductTitle = (product) => {
    return product.product?.title || "منتج غير معروف";
  };

  const getProductPrice = (product) => {
    const originalPrice = product.product?.price;
    const final_price = product.product?.final_price;

    if (!originalPrice) return "غير متوفر";

    if (final_price && final_price < originalPrice) {
      return (
        <>
          <span
            style={{
              textDecoration: "line-through",
              color: "#888",
              marginLeft: "8px",
            }}
          >
            {originalPrice} جنيه
          </span>
          <span style={{ color: "red", fontWeight: "bold" }}>
            {final_price} جنيه
          </span>
        </>
      );
    }

    return `${originalPrice} جنيه`;
  };

  return (
    <div className="favorites-page">
      <MyNavbar />

      <Box
        sx={{
          mt: 10,
          mb: 10,
          mx: "auto",
          maxWidth: "1200px",
          px: 2,
          direction: "rtl",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h4" textAlign="center" mb={3} color="primary">
          المفضلة <span className="heart-icon">❤️</span>
        </Typography>

        {!isAuthenticated ? (
          <Typography
            textAlign="center"
            color="error"
            sx={{ minHeight: "30vh" }}
          >
            يجب تسجيل الدخول أولاً للوصول إلى المفضلة!
          </Typography>
        ) : isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "30vh" }}
          >
            <Typography>جاري تحميل قائمة المفضلة...</Typography>
          </Box>
        ) : favorites.length === 0 ? (
          <Typography textAlign="center" sx={{ minHeight: "30vh" }}>
            لا توجد منتجات مفضلة حالياً.
          </Typography>
        ) : (
          <>
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearFavorites}
                disabled={favorites.length === 0}
              >
                حذف الكل
              </Button>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              }}
              gap={3}
            >
              {favorites.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "inherit",
                    color: "inherit",
                    boxShadow: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getProductImage(product)}
                    alt={getProductTitle(product)}
                    sx={{
                      objectFit: "contain",
                      cursor: "pointer",
                      p: 2,
                    }}
                    onClick={() =>
                      navigate(
                        `/${
                          product.product_type === "mobile"
                            ? "mobiles"
                            : "accessories"
                        }/${product.product_id}`
                      )
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {getProductTitle(product)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      {product.product?.final_price &&
                      product.product.final_price <
                        product.product.price ? (
                        <>
                          <Typography
                            color="textSecondary"
                            style={{ textDecoration: "line-through" }}
                          >
                            {product.product.price} جنيه
                          </Typography>
                          <Typography color="error" fontWeight="bold">
                            {product.product.final_price} جنيه
                          </Typography>
                        </>
                      ) : (
                        <Typography color="primary" fontWeight="bold">
                          السعر: {product.product?.price} جنيه
                        </Typography>
                      )}
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveFavorite(product)}
                      sx={{ mt: "auto" }}
                    >
                      حذف من المفضلة
                    </Button>
                  </CardContent>
                </div>
              ))}
            </Box>
          </>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbarMessage.includes("❌") ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: "300px",
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center" }}>تأكيد الحذف</DialogTitle>
          <DialogContent sx={{ textAlign: "center", py: 2 }}>
            {clearAll
              ? "هل أنت متأكد أنك تريد حذف جميع المنتجات من المفضلة؟"
              : "هل أنت متأكد أنك تريد إزالة هذا المنتج من المفضلة؟"}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmRemove}
              color="error"
              variant="contained"
              sx={{ mx: 1 }}
            >
              تأكيد الحذف
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Footer />
    </div>
  );
};

export default Favorites;
