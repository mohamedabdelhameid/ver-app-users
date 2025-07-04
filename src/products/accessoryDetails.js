// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchProducts } from "./productSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { Footer } from "../landing/home";
// import MyNavbar from "../landing/navbar";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   CircularProgress,
//   Chip,
//   Divider,
//   Grid,
//   Paper,
//   Avatar,
//   IconButton,
//   TextField,
//   Snackbar,
//   Alert,
//   Badge,
//   useTheme,
//   Tooltip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import Swal from "sweetalert2";
// import { selectAllCartItems } from "../user/cart/cartSlice";
// import { Cancel } from "@mui/icons-material";
// import BASE_BACKEND_URL from "../API/config";
// import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";

// const IMAGE_COVER_API = `${BASE_BACKEND_URL}/accessories`;
// //  "http://localhost:8000/api/accessories"
// const ADD_TO_USER_CART = `${BASE_BACKEND_URL}/cart-items`;
// // "http://localhost:8000/api/cart-items"
// const GET_CART_ITEMS_API = `${BASE_BACKEND_URL}/cart`;
// //  "http://localhost:8000/api/cart"

// function AccessoryDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   // const theme = useTheme(); // لم يتم استخدام theme بشكل مباشر، يمكن إزالته إذا لم يكن له استخدام آخر

//   const [isLoading, setIsLoading] = useState(true);
//   const [showMessage, setShowMessage] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [colors, setColors] = useState([]);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [mainImage, setMainImage] = useState(null);
//   const [imageCover, setImageCover] = useState(null); // لتخزين الصورة الأساسية للمنتج
//   const [productDetails, setProductDetails] = useState(null);
//   const [messageText, setMessageText] = useState("");
//   const [cartQuantity, setCartQuantity] = useState(0);

//   const cartItems = useSelector(selectAllCartItems);
//   const products = useSelector((state) => state.products.items || []);
//   const data = products.find((p) => p.id.toString() === id) || productDetails;


//     const showMessageAndRedirect = (text, duration, callback) => {
//           setMessageText(text);
//           setTimeout(() => {
//             callback();
//           }, duration);
//         };

        
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         // جلب جميع المنتجات إذا لم تكن محملة
//         if (products.length === 0) {
//           await dispatch(fetchProducts());
//         }

//         // جلب تفاصيل المنتج المحدد
//         const response = await fetch(`${IMAGE_COVER_API}/${id}`);
//         const json = await response.json();

      

//         if (json.data) {
//           setProductDetails(json.data);
//           setColors(json.data.colors || []);

//           // تعيين الصورة الرئيسية إلى image_cover أو image إذا لم يكن هناك image_cover
//           if (json.data.image_cover) {
//             // setImageCover(`http://localhost:8000${json.data.image_cover}`);
//             setImageCover(
//               `${BASE_BACKEND_LOCAHOST_URL}${json.data.image_cover}`
//             );
//             // setMainImage(`http://localhost:8000${json.data.image_cover}`);
//             setMainImage(
//               `${BASE_BACKEND_LOCAHOST_URL}${json.data.image_cover}`
//             );
//           } else if (json.data.image) {
//             // setImageCover(`http://localhost:8000${json.data.image}`);
//             setImageCover(`${BASE_BACKEND_LOCAHOST_URL}${json.data.image}`);
//             // setMainImage(`http://localhost:8000${json.data.image}`);
//             setMainImage(`${BASE_BACKEND_LOCAHOST_URL}${json.data.image}`);
//           }

//           // لا تقم بتحديد لون افتراضي هنا
//           setSelectedColor(null); // تأكد من أنه لا يوجد لون محدد تلقائياً
//         } else {
//           setMessageText("المنتج غير موجود");
//           setShowMessage(true);
//           navigate("/products");
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//         setMessageText("❌ فشل في تحميل بيانات المنتج");
//         setShowMessage(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, dispatch, products.length, navigate]);

//   // حساب الكمية في السلة للون المحدد
//   useEffect(() => {
//     if (cartItems.length > 0 && data) {
//       const currentProductInCart = cartItems.filter(
//         (item) =>
//           item.product_id.toString() === id &&
//           item.product_type === "accessory" &&
//           item.product_color_id === (selectedColor?.id || null)
//       );

//       const totalQuantity = currentProductInCart.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );

//       setCartQuantity(totalQuantity);

//       // التحقق من الحد الأقصى للمخزون
//       const maxQuantity = selectedColor
//         ? selectedColor.stock_quantity
//         : data.total_quantity;

//       if (totalQuantity >= maxQuantity) {
//         setMessageText(
//           `⚠️ لقد وصلت للحد الأقصى لهذا المنتج (${maxQuantity} قطعة)`
//         );
//         setShowMessage(true);
//       }
//     } else {
//       setCartQuantity(0);
//     }
//   }, [cartItems, data, id, selectedColor]);

//   const handleQuantityChange = (e) => {
//     const newQuantity = parseInt(e.target.value, 10);
//     if (isNaN(newQuantity) || !data) return;

//     // حساب الكمية المتاحة بناءً على اللون المحدد
//     const maxQuantity = selectedColor
//       ? selectedColor.stock_quantity - cartQuantity
//       : data.total_quantity - cartQuantity;

//     if (newQuantity >= 1 && newQuantity <= maxQuantity) {
//       setQuantity(newQuantity);
//     } else if (newQuantity > maxQuantity) {
//       setQuantity(maxQuantity);
//       Swal.fire(
//         "تنبيه",
//         `الحد الأقصى للكمية المتاحة هو ${maxQuantity}`,
//         "info"
//       );
//     }
//   };

//   const handleAddToCart = async () => {
//     const token = localStorage.getItem("user_token");
//     const userId = localStorage.getItem("user_id");

//     if (!data) {
//       // setMessageText("❌ حدث خطأ في تحميل بيانات المنتج");
//       showMessageAndRedirect("❌   يرجى مراجعة تسجيل دخولك!", 3000, () =>
//         navigate("/signeup")
//       );
//       setShowMessage(true);
//       return;
//     }

//     // التحقق من اختيار اللون إذا كان متاحًا
//     if (colors.length > 0 && !selectedColor) {
//       setMessageText("❌ يرجى اختيار لون أولاً");
//       setShowMessage(true);
//       return;
//     }

//     // حساب الكمية المتاحة بناءً على اللون المحدد
//     const maxQuantity = selectedColor
//       ? selectedColor.stock_quantity
//       : data.total_quantity;

//     if (quantity + cartQuantity > maxQuantity) {
//       Swal.fire(
//         "تنبيه",
//         `لقد وصلت للحد الأقصى لهذا المنتج (${maxQuantity} قطعة)`,
//         "info"
//       );
//       return;
//     }

//     if (!token || !userId) {
//       setMessageText("❌ يجب تسجيل الدخول أولاً!");
//       setShowMessage(true);
//       setTimeout(() => setShowMessage(false), 3000);
//       setTimeout(() => navigate("/signeup"), 3000);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(ADD_TO_USER_CART, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           product_id: id,
//           product_type: "accessory",
//           product_color_id: selectedColor?.id || null,
//           quantity: quantity,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("فشل في إضافة المنتج إلى السلة");
//       }

//       const responseData = await response.json();
//       setMessageText("✅ تم إضافة المنتج إلى العربة بنجاح!");
//       setShowMessage(true);
//       setCartQuantity((prev) => prev + quantity);
//     } catch (error) {
//       console.error("خطأ في إضافة المنتج:", error);
//       // setMessageText("❌ حدث خطأ أثناء إضافة المنتج");
//       showMessageAndRedirect("❌   يرجى مراجعة تسجيل دخولك!", 3000, () =>
//         navigate("/signeup")
//       );
//       setShowMessage(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseMessage = () => {
//     setShowMessage(false);
//   };

//   const handleColorSelect = (color) => {
//     if (!color.is_available) {
//       setMessageText("هذا اللون غير متوفر حالياً");
//       setShowMessage(true);
//       return;
//     }

//     setSelectedColor(color);
//     setQuantity(1);

//     // تحديث الصورة الرئيسية بناءً على اللون المختار
//     if (color.images?.[0]?.image) {
//       // setMainImage(`http://localhost:8000${color.images[0].image}`);
//       setMainImage(`${BASE_BACKEND_LOCAHOST_URL}${color.images[0].image}`);
//     } else if (imageCover) {
//       // إذا لم يكن للون صور خاصة به، عد إلى الصورة الرئيسية للمنتج
//       setMainImage(imageCover);
//     } else {
//       setMainImage(null); // لا توجد صورة خاصة باللون ولا صورة أساسية
//     }
//   };

//   // حساب الكمية المتاحة بناءً على اللون المحدد
//   const availableQuantity = selectedColor
//     ? selectedColor.stock_quantity - cartQuantity
//     : data?.total_quantity
//     ? data.total_quantity - cartQuantity
//     : 0;

//   if (!data && !productDetails) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           flexDirection: "column",
//         }}
//       >
//         <CircularProgress />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           جاري تحميل بيانات المنتج...
//         </Typography>
//       </Box>
//     );
//   }

//   if (!data) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           flexDirection: "column",
//         }}
//       >
//         <Typography variant="h4" color="error">
//           المنتج غير موجود
//         </Typography>
//         <Button
//           variant="contained"
//           sx={{ mt: 2 }}
//           onClick={() => navigate("/products")}
//         >
//           العودة لقائمة المنتجات
//         </Button>
//       </Box>
//     );
//   }

//   // تحديد الصور المعروضة في المعاينة
//   const previewImages =
//     selectedColor?.images?.length > 0
//       ? selectedColor.images
//       : data.images?.length > 0
//       ? data.images
//       : imageCover
//       ? [{ image: imageCover }]
//       : [];

//   return (
//     <>
//       <MyNavbar />
//       <div
//         sx={{
//           marginTop: "85px",
//           direction: "rtl",
//           minHeight: "80vh",
//           justifyContent: "center",
//           alignContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div
//           sx={{
//             m: 3,
//             position: "relative",
//             marginTop: "85px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <IconButton
//             onClick={() => navigate(-1)}
//             sx={{
//               position: "absolute",
//               top: 15,
//               right: 15,
//               zIndex: 100,
//               color: "error.main",
//               backgroundColor: "rgba(255, 255, 255, 0.7)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//               },
//               border: "1px solid #ddd",
//             }}
//           >
//             <CloseIcon fontSize="large" />
//           </IconButton>

//           <div
//             container
//             spacing={3}
//             style={{ alignItems: "center" }}
//             sx={{ maxWidth: "1200px" }}
//           >
//             <div item xs={12} md={6}>
//               <div
//                 elevation={3}
//                 sx={{
//                   p: 2,
//                   textAlign: "center",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 {mainImage ? (
//                   <div
//                     component="img"
//                     src={mainImage}
//                     alt={data.title}
//                     sx={{
//                       maxWidth: "100%",
//                       maxHeight: "400px",
//                       borderRadius: 2,
//                       objectFit: "contain",
//                     }}
//                   />
//                 ) : (
//                   <Avatar
//                     variant="rounded"
//                     sx={{
//                       width: "100%",
//                       height: 300,
//                       fontSize: "3rem",
//                     }}
//                   >
//                     لا توجد صورة
//                   </Avatar>
//                 )}

//                 {previewImages.length > 0 && (
//                   <div
//                     sx={{
//                       display: "flex",
//                       gap: 2,
//                       mt: 2,
//                       overflowX: "auto",
//                       justifyContent: "center",
//                       width: "100%",
//                     }}
//                   >
//                     {previewImages.map((img, index) => {
//                       const imgUrl = img.image
//                         ? img.image.startsWith("http")
//                           ? img.image
//                           : `http://localhost:8000${img.image}`
//                         : img;
//                       return (
//                         <Box
//                           key={index}
//                           onClick={() => setMainImage(imgUrl)}
//                           sx={{
//                             width: 80,
//                             height: 80,
//                             borderRadius: 1,
//                             overflow: "hidden",
//                             cursor: "pointer",
//                             border:
//                               imgUrl === mainImage
//                                 ? "2px solid primary.main"
//                                 : "1px solid #ddd",
//                           }}
//                         >
//                           <img
//                             src={imgUrl}
//                             alt={`Preview ${index + 1}`}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         </Box>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div item xs={12} md={6}>
//               <div sx={{ height: "100%" }}>
//                 <CardContent>
//                   <Typography variant="h4" gutterBottom>
//                     {data.title}
//                   </Typography>

//                   <Box display="flex" alignItems="center" mb={2}>
//                     {data.discount ? (
//                       <>
//                         <Typography
//                           variant="h5"
//                           color="textSecondary"
//                           sx={{ textDecoration: "line-through", mr: 1 }}
//                         >
//                           {data.price} جنيه
//                         </Typography>
//                         <Typography variant="h4" color="primary">
//                           {data.final_price} جنيه
//                         </Typography>
//                       </>
//                     ) : (
//                       <Typography variant="h4" color="primary">
//                         {data.price} جنيه
//                       </Typography>
//                     )}
//                   </Box>

//                   <Typography variant="body1" paragraph>
//                     {data.description}
//                   </Typography>

//                   <Divider sx={{ my: 2 }} />

//                   <div container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography variant="subtitle1">
//                         <strong>الشركة:</strong>{" "}
//                         {data.brand?.name || "غير معروف"}
//                       </Typography>
//                     </Grid>
//                     {data.storage && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>المساحة:</strong> {data.storage} جيجا بايت
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.display && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الشاشة:</strong> {data.display}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.camera && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الكاميرا:</strong> {data.camera} ميجا بايت
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.processor && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>المعالج:</strong> {data.processor}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.operating_system && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>نظام التشغيل:</strong> {data.operating_system}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.network_support && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الشبكة:</strong> {data.network_support}
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.battery && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>البطارية:</strong> {data.battery} مللي أمبير
//                         </Typography>
//                       </Grid>
//                     )}
//                     {data.speed && (
//                       <Grid item xs={6}>
//                         <Typography variant="subtitle1">
//                           <strong>الشاحن :</strong> {data.speed} watt
//                         </Typography>
//                       </Grid>
//                     )}
//                   </div>

//                   {/* عرض الألوان */}
//                   {colors.length > 0 && (
//                     <Box sx={{ mt: 3 }}>
//                       <Typography variant="h6" gutterBottom>
//                         الألوان المتاحة
//                       </Typography>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           gap: 2,
//                           flexWrap: "wrap",
//                           justifyContent: "flex-end",
//                         }}
//                       >
//                         {colors.map((color) => (
//                           <Tooltip
//                             key={color.id}
//                             title={`${color.color?.name || "بدون اسم"}${
//                               !color.is_available ? " (غير متوفر)" : ""
//                             }`}
//                             arrow
//                           >
//                             <Badge
//                               color="primary"
//                               badgeContent={
//                                 selectedColor?.id === color.id ? "✓" : ""
//                               }
//                               overlap="circular"
//                             >
//                               <Box
//                                 onClick={() => handleColorSelect(color)}
//                                 sx={{
//                                   width: 40,
//                                   height: 40,
//                                   borderRadius: "50%",
//                                   backgroundColor:
//                                     color.color?.hex_code || "#ccc",
//                                   border:
//                                     selectedColor?.id === color.id
//                                       ? "2px solid #1976d2"
//                                       : "1px solid #ddd",
//                                   "&:hover": {
//                                     transform: "scale(1.1)",
//                                     cursor: color.is_available
//                                       ? "pointer"
//                                       : "not-allowed",
//                                   },
//                                   opacity: color.is_available ? 1 : 0.5,
//                                   transition: "all 0.2s ease-in-out",
//                                 }}
//                               />
//                             </Badge>
//                           </Tooltip>
//                         ))}
//                       </Box>
//                     </Box>
//                   )}

//                   {availableQuantity > 0 ? (
//                     <Chip
//                       label="متاح"
//                       color="success"
//                       icon={<CheckCircleIcon />}
//                       variant="outlined"
//                       sx={{
//                         fontWeight: "bold",
//                         fontSize: "1rem",
//                         mt: 2,
//                       }}
//                     />
//                   ) : (
//                     <Chip
//                       label="غير متوفر"
//                       color="error"
//                       icon={<Cancel />}
//                       variant="outlined"
//                       sx={{
//                         fontWeight: "bold",
//                         fontSize: "1rem",
//                         mt: 2,
//                       }}
//                     />
//                   )}

//                   <Box
//                     sx={{
//                       mt: 3,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       justifyContent: "flex-end",
//                     }}
//                   >
//                     <TextField
//                       type="number"
//                       size="small"
//                       label="الكمية"
//                       value={quantity}
//                       onChange={handleQuantityChange}
//                       inputProps={{
//                         min: 1,
//                         max: availableQuantity,
//                         style: {
//                           textAlign: "center",
//                           color: "green",
//                         },
//                       }}
//                       sx={{
//                         width: 100,
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": {
//                             borderColor: "green",
//                           },
//                           "&:hover fieldset": {
//                             borderColor: "darkgreen",
//                           },
//                         },
//                         "& .MuiInputLabel-root": {
//                           color: "green",
//                         },
//                         "& .Mui-focused": {
//                           color: "darkgreen",
//                         },
//                       }}
//                     />
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleAddToCart}
//                       disabled={
//                         isLoading ||
//                         (colors.length > 0 && !selectedColor) || // يجب اختيار لون إذا كانت الألوان متاحة
//                         availableQuantity <= 0 ||
//                         quantity > availableQuantity
//                       }
//                       sx={{ flexGrow: 1 }}
//                       startIcon={
//                         isLoading ? (
//                           <CircularProgress size={20} color="inherit" />
//                         ) : null
//                       }
//                     >
//                       {availableQuantity <= 0
//                         ? "غير متوفر"
//                         : isLoading
//                         ? "جاري الإضافة..."
//                         : "إضافة إلى عربة التسوق"}
//                     </Button>
//                   </Box>
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle1">
//                       <strong>الكمية المتاحة:</strong>{" "}
//                       <span
//                         style={{
//                           color: "green",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {availableQuantity} قطعة
//                       </span>
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </div>
//             </div>
//           </div>

//           <Snackbar
//             open={showMessage}
//             autoHideDuration={3000}
//             onClose={handleCloseMessage}
//             anchorOrigin={{ vertical: "top", horizontal: "center" }}
//           >
//             <Alert
//               onClose={handleCloseMessage}
//               severity={
//                 messageText.includes("✅")
//                   ? "success"
//                   : messageText.includes("❌")
//                   ? "error"
//                   : "warning"
//               }
//               sx={{ width: "100%" }}
//               icon={
//                 messageText.includes("✅") ? (
//                   <CheckCircleIcon fontSize="inherit" />
//                 ) : messageText.includes("❌") ? (
//                   <Cancel fontSize="inherit" />
//                 ) : null
//               }
//             >
//               {messageText}
//             </Alert>
//           </Snackbar>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
// export default AccessoryDetails;







import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productSlice";
import { useParams, useNavigate } from "react-router-dom";
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

const IMAGE_COVER_API = `${BASE_BACKEND_URL}/accessories`;
//  "http://localhost:8000/api/accessories"
const ADD_TO_USER_CART = `${BASE_BACKEND_URL}/cart-items`;
// "http://localhost:8000/api/cart-items"
const GET_CART_ITEMS_API = `${BASE_BACKEND_URL}/cart`;
//  "http://localhost:8000/api/cart"

function AccessoryDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const theme = useTheme(); // لم يتم استخدام theme بشكل مباشر، يمكن إزالته إذا لم يكن له استخدام آخر

  const [isLoading, setIsLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [imageCover, setImageCover] = useState(null); // لتخزين الصورة الأساسية للمنتج
  const [productDetails, setProductDetails] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);

  const cartItems = useSelector(selectAllCartItems);
  const products = useSelector((state) => state.products.items || []);
  const data = products.find((p) => p.id.toString() === id) || productDetails;


    const showMessageAndRedirect = (text, duration, callback) => {
          setMessageText(text);
          setTimeout(() => {
            callback();
          }, duration);
        };

        
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // جلب جميع المنتجات إذا لم تكن محملة
        if (products.length === 0) {
          await dispatch(fetchProducts());
        }

        // جلب تفاصيل المنتج المحدد
        const response = await fetch(`${IMAGE_COVER_API}/${id}`);
        const json = await response.json();

      

        if (json.data) {
          setProductDetails(json.data);
          setColors(json.data.colors || []);

          // تعيين الصورة الرئيسية إلى image_cover أو image إذا لم يكن هناك image_cover
          if (json.data.image_cover) {
            // setImageCover(`http://localhost:8000${json.data.image_cover}`);
            setImageCover(
              `${BASE_BACKEND_LOCAHOST_URL}${json.data.image_cover}`
            );
            // setMainImage(`http://localhost:8000${json.data.image_cover}`);
            setMainImage(
              `${BASE_BACKEND_LOCAHOST_URL}${json.data.image_cover}`
            );
          } else if (json.data.image) {
            // setImageCover(`http://localhost:8000${json.data.image}`);
            setImageCover(`${BASE_BACKEND_LOCAHOST_URL}${json.data.image}`);
            // setMainImage(`http://localhost:8000${json.data.image}`);
            setMainImage(`${BASE_BACKEND_LOCAHOST_URL}${json.data.image}`);
          }

          // لا تقم بتحديد لون افتراضي هنا
          setSelectedColor(null); // تأكد من أنه لا يوجد لون محدد تلقائياً
        } else {
          setMessageText("المنتج غير موجود");
          setShowMessage(true);
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setMessageText("❌ فشل في تحميل بيانات المنتج");
        setShowMessage(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, products.length, navigate]);

  // حساب الكمية في السلة للون المحدد
  useEffect(() => {
    if (cartItems.length > 0 && data) {
      const currentProductInCart = cartItems.filter(
        (item) =>
          item.product_id.toString() === id &&
          item.product_type === "accessory" &&
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
          product_type: "accessory",
          product_color_id: selectedColor?.id || null,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إضافة المنتج إلى السلة");
      }

      const responseData = await response.json();
      setMessageText("✅ تم إضافة المنتج إلى العربة بنجاح!");
      setShowMessage(true);
      setCartQuantity((prev) => prev + quantity);
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
    if (!color.is_available) {
      setMessageText("هذا اللون غير متوفر حالياً");
      setShowMessage(true);
      return;
    }

    setSelectedColor(color);
    setQuantity(1);

    // تحديث الصورة الرئيسية بناءً على اللون المختار
    if (color.images?.[0]?.image) {
      // setMainImage(`http://localhost:8000${color.images[0].image}`);
      setMainImage(`${BASE_BACKEND_LOCAHOST_URL}${color.images[0].image}`);
    } else if (imageCover) {
      // إذا لم يكن للون صور خاصة به، عد إلى الصورة الرئيسية للمنتج
      setMainImage(imageCover);
    } else {
      setMainImage(null); // لا توجد صورة خاصة باللون ولا صورة أساسية
    }
  };

  // حساب الكمية المتاحة بناءً على اللون المحدد
  const availableQuantity = selectedColor
    ? selectedColor.stock_quantity - cartQuantity
    : data?.total_quantity
    ? data.total_quantity - cartQuantity
    : 0;

  if (!data && !productDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل بيانات المنتج...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" color="error">
          المنتج غير موجود
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/products")}
        >
          العودة لقائمة المنتجات
        </Button>
      </Box>
    );
  }

  // تحديد الصور المعروضة في المعاينة
  const previewImages =
    selectedColor?.images?.length > 0
      ? selectedColor.images
      : data.images?.length > 0
      ? data.images
      : imageCover
      ? [{ image: imageCover }]
      : [];

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
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor:'unset',
                  color:'unset'
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

                {previewImages.length > 0 && (
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
                    {previewImages.map((img, index) => {
                      const imgUrl = img.image
                        ? img.image.startsWith("http")
                          ? img.image
                          : `http://localhost:8000${img.image}`
                        : img;
                      return (
                        <Box
                          key={index}
                          onClick={() => setMainImage(imgUrl)}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 1,
                            overflow: "hidden",
                            cursor: "pointer",
                            border:
                              imgUrl === mainImage
                                ? "2px solid primary.main"
                                : "1px solid #ddd",
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%",bgcolor:'unset',color:'unset' }}>
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
                    {data.speed && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          <strong>الشاحن :</strong> {data.speed} watt
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
                    </Box>
                  )}

                  {availableQuantity > 0 ? (
                    <Chip
                      label="متاح"
                      color="success"
                      icon={<CheckCircleIcon />}
                      variant="outlined"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        mt: 2,
                      }}
                    />
                  ) : (
                    <Chip
                      label="غير متوفر"
                      color="error"
                      icon={<Cancel />}
                      variant="outlined"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        mt: 2,
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
                        (colors.length > 0 && !selectedColor) || // يجب اختيار لون إذا كانت الألوان متاحة
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
                    <Typography variant="subtitle1">
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
export default AccessoryDetails;
