import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Footer } from "../../landing/home";
import MyNavbar from "../../landing/navbar";
import BASE_BACKEND_URL from "../../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../../API/localhost";

// const API_URL = "http://localhost:8000/api/orders";
const API_URL = `${BASE_BACKEND_URL}/orders`;
// const CART_API = "http://localhost:8000/api/cart";
const CART_API = `${BASE_BACKEND_URL}/cart`;
// const MOBILES_API = "http://localhost:8000/api/mobiles";
const MOBILES_API = `${BASE_BACKEND_URL}/mobiles`;
// const ACCESSORIES_API = "http://localhost:8000/api/accessories";
const ACCESSORIES_API = `${BASE_BACKEND_URL}/accessories`;
// const BRANDS_API = "http://localhost:8000/api/brands";
const BRANDS_API = `${BASE_BACKEND_URL}/brands`;

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [brands, setBrands] = useState([]);
  const theme = useTheme(); // للحصول على وضع الـ theme الحالي

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          navigate("/login");
          return;
        }

        // جلب بيانات الطلب والمنتجات في نفس الوقت
        const [orderResponse, mobilesRes, accessoriesRes] = await Promise.all([
          fetch(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
          fetch(MOBILES_API),
          fetch(ACCESSORIES_API),
        ]);

        if (!orderResponse.ok) {
          throw new Error("فشل في جلب تفاصيل الطلب");
        }

        const orderData = await orderResponse.json();
        const mobilesData = await mobilesRes.json();
        const accessoriesData = await accessoriesRes.json();

        setOrder(orderData.data);
        setMobiles(mobilesData.data || []);
        setAccessories(accessoriesData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      case "cancelled":
        return "error";
      case "shipped":
        return "warning";
      default:
        return "primary";
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD HH:mm");
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("ar-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getProductImage = (item) => {
    // إذا كان المنتج من نوع mobile
    if (item.product_type === "mobile") {
      const mobile = mobiles.find((m) => m.id === item.product_id);
      if (!mobile) return { image: "", color: "غير محدد" };

      // البحث عن اللون المحدد في الطلب
      const selectedColor = mobile.colors?.find(c => c.color === item.color);
      const imageUrl = selectedColor?.image || mobile.image_cover || mobile.image;

      return {
        // image: imageUrl ? `http://localhost:8000${imageUrl}` : "",
        image: imageUrl ? `${BASE_BACKEND_LOCAHOST_URL}${imageUrl}` : "",
        color: item.color || "غير محدد",
      };
    }
    
    // إذا كان المنتج من نوع accessory
    if (item.product_type === "accessory") {
      const accessory = accessories.find((a) => a.id === item.product_id);
      if (!accessory) return { image: "", color: "غير محدد" };

      return {
        // image: accessory.image ? `http://localhost:8000${accessory.image}` : "",
        image: accessory.image ? `${BASE_BACKEND_LOCAHOST_URL}${accessory.image}` : "",
        color: item.color || accessory.color || "غير محدد",
      };
    }

    return { image: "", color: "غير محدد" };
  };

  if (loading) {
    return (
      <>
        <MyNavbar />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="50vh" 
          mt={4} 
          className="container"
        >
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <MyNavbar />
        <Box 
          p={3} 
          className="container"
        >
          <Typography color="error" variant="h6">
            خطأ: {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            العودة
          </Button>
        </Box>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <MyNavbar />
        <Box 
          p={3} 
          textAlign="center" 
          className="container"
          
        >
          <Typography variant="h6">لا يوجد طلب بهذا الرقم</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/orders")}
            sx={{ mt: 2 }}
          >
            العودة إلى قائمة الطلبات
          </Button>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MyNavbar />

      <Box 
        sx={{ 
          p: 3, 
          mt: 10, 
          direction: "rtl",
          minHeight: '100vh'
        }} 
        className="container"
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          color="primary"
        >
          العودة
        </Button>

        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          تفاصيل الطلب #{order.id.split("-")[0]}
        </Typography>

        <Grid container spacing={3} style={{ direction: "ltr" }}>
          <Grid item xs={12} md={8}>
            <div  sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  المنتجات
                </Typography>
                <TableContainer style={{color: 'unset'}}>
                  <Table style={{color: 'unset'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{color: 'unset'}}>المنتج</TableCell>
                        <TableCell align="right" style={{color: 'unset'}}>السعر</TableCell>
                        <TableCell align="right" style={{color: 'unset'}}>الكمية</TableCell>
                        <TableCell align="right" style={{color: 'unset'}}>المجموع</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{color: 'unset'}}>
                      {order.order_items.map((item) => {
                        const { image, color } = getProductImage(item);
                        return (
                          <TableRow key={item.id} style={{color: 'unset'}}>
                            <TableCell style={{color: 'unset'}}>
                              <Box sx={{ display: "flex", alignItems: "center" }} style={{color: 'unset'}}>
                                {image ? (
                                  <img
                                    src={image}
                                    alt={item.product?.title}
                                    style={{ 
                                      width: "65px", 
                                      height: "65px", 
                                      marginRight: "10px",
                                      objectFit: 'cover',
                                      borderRadius: '4px'
                                    }}
                                  />
                                ) : (
                                  <Avatar 
                                    sx={{ 
                                      width: 65, 
                                      height: 65, 
                                      mr: 1,
                                      backgroundColor: theme.palette.grey[300]
                                    }}
                                  >
                                    لا يوجد صورة
                                  </Avatar>
                                )}
                                <Box>
                                  <Typography variant="subtitle1">
                                    {item.product?.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    
                                  >
                                    {item.product?.storage && `${item.product.storage} GB`}
                                    
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{direction:'rtl'}}
                                    >
                                    {item.product?.speed && ` الشاحن: ${item.product?.speed} watt`}
                                    {item.product?.battery && ` البطارية: ${item.product?.battery} mah`}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{direction:'rtl'}}
                                  >
                                    النوع: {item.product_type}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right" style={{color: 'unset'}}>
                              {formatPrice(item.price)} ج.م
                            </TableCell>
                            <TableCell align="right" style={{color: 'unset'}}>{item.quantity}</TableCell>
                            <TableCell align="right" style={{color: 'unset'}}>
                              {formatPrice(item.price * item.quantity)} ج.م
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <div sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ملخص الطلب
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="رقم الطلب" />
                    <Typography>#{order.id.split("-")[0]}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="تاريخ الطلب" />
                    <Typography>{formatDate(order.created_at)}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="حالة الطلب" />
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText primary="المجموع الفرعي" />
                    <Typography>
                      {formatPrice(order.total_price)} ج.م
                    </Typography>
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText
                      primary="المجموع الكلي"
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {formatPrice(order.total_price)} ج.م
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default OrderDetails;