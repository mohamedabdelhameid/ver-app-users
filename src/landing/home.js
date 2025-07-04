import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../products/productSlice";
import { addToCart } from "../user/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Collapse } from "react-bootstrap";
import BASE_BACKEND_URL from "../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";

export function Footer() {
  return (
    <div className="rtl container text-center mt-4">
      <p>
        &copy;{" "}
        <b>
          <Link
            className="Mo"
            to={"https://www.facebook.com/profile.php?id=100063776365288"}
            target="_blank"
          >
            مستر موبايل
          </Link>
        </b>{" "}
        2025.
      </p>
      <p>*كل ما هو جديد في عالم الهواتف الذكيه*</p>
      <div className="my-1">
        <p className="designed">تم التصميم بواسطة </p>
        <span className="hoverShow">
          <Link
            to="https://api.whatsapp.com/send/?phone=201120203912"
            target="_blank"
            className="fw-bold text-decoration-none"
          >
            {" "}AMM Team{" "}
          </Link>
        </span>
      </div>
    </div>
  );
}


const ProductCard = React.memo(
  ({
    product,
    isFavorite,
    openProductId,
    isLoading,
    currentProduct,
    onFavorite,
    onAddToCart,
    onColorSelect,
    onConfirmAdd,
    onDetails,
    isLoadingColors,
  }) => {
    const [localSelectedColor, setLocalSelectedColor] = useState(
      product.selectedColor
    );

    useEffect(() => {
      setLocalSelectedColor(product.selectedColor);
    }, [product.selectedColor]);

    const handleColorSelection = (color) => {
      setLocalSelectedColor(color);
      onColorSelect(product.id, color);
    };

    return (
      <div className="product-card" style={{ direction: "ltr" }}>
        <div className="product-header">
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product);
            }}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          >
            <FaHeart className={isFavorite ? "favorite-active" : ""} />
          </button>

          <span
            className={`stock-badge ${
              product.total_quantity > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.total_quantity > 0 ? "متوفر" : "غير متوفر"}
          </span>

          <img
            src={
              // `http://localhost:8000${product.image_cover}` ||
              `${BASE_BACKEND_LOCAHOST_URL}${product.image_cover}` ||
              "/placeholder-product.png"
            }
            alt={product.title}
            onError={(e) => (e.target.src = "/placeholder-product.png")}
          />
        </div>

        <div className="product-body">
          <h3>{product.title}</h3>
          <h5 className="rtl-layout">{product.storage} جيجا بايت</h5>
          <p className="price" style={{ direction: "rtl" }}>
            {product.discount ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                    marginLeft: "8px",
                  }}
                >
                  {product.price} جنيه
                </span>
                <br />
                <span style={{ fontWeight: "bold" }}>
                  {product.final_price} جنيه
                </span>
              </>
            ) : (
              <span style={{ fontWeight: "bold" }}>{product.price} جنيه</span>
            )}
          </p>
        </div>

        <div className="product-actions">
          <button className="details-btn" onClick={onDetails}>
            التفاصيل
          </button>
          <button
            className="cart-btn"
            onClick={onAddToCart}
            disabled={isLoading || product.total_quantity <= 0}
          >
            {isLoading && currentProduct === product.id ? (
              "جاري الإضافة..."
            ) : (
              <>
                <FaCartPlus /> إضافة للسلة
              </>
            )}
          </button>
        </div>

        <Collapse
          in={openProductId === product.id}
          style={{ direction: "rtl", backgroundColor: "unset", color: "unset" }}
        >
          <div className="product-id-collapse">
            {isLoadingColors && openProductId === product.id ? (
              <div className="loading-colors">
                <p>جاري تحميل الألوان...</p>
              </div>
            ) : (
              <>
                {product.colors?.length > 0 && (
                  <div className="color-selection" style={{ direction: "rtl" }}>
                    <h6>اختر اللون:</h6>
                    <div className="color-options">
                      {product.colors.map((colorObj) => (
                        <div
                          key={colorObj.id}
                          className={`color-option ${
                            localSelectedColor?.id === colorObj.id ? "selected" : ""
                          }`}
                          onClick={() => handleColorSelection(colorObj)}
                          style={{
                            backgroundColor: colorObj.color?.hex_code || "#ddd",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 5px",
                            cursor: "pointer",
                            border: "1px solid #ddd",
                          }}
                          title={colorObj.color?.name || colorObj.color?.hex_code}
                        >
                          {localSelectedColor?.id === colorObj.id && (
                            <span className="color-check">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              className="confirm-btn"
              onClick={(e) => {
                e.stopPropagation();
                onConfirmAdd({ ...product, selectedColor: localSelectedColor });
              }}
              disabled={
                isLoading || (product.colors?.length > 0 && !localSelectedColor)
              }
            >
              {isLoading && currentProduct === product.id
                ? "جاري التأكيد..."
                : "تأكيد الشراء"}
            </button>
          </div>
        </Collapse>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.selectedColor?.id ===
        nextProps.product.selectedColor?.id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.openProductId === nextProps.openProductId &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.currentProduct === nextProps.currentProduct &&
      prevProps.isLoadingColors === nextProps.isLoadingColors
    );
  }
);

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items || []);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [brands, setBrands] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [openProductId, setOpenProductId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productsWithColors, setProductsWithColors] = useState([]);
  const [randomizedProducts, setRandomizedProducts] = useState([]);

  const FAVORITE_API = `${BASE_BACKEND_URL}/wishlist`;
  const ADD_TO_CART = `${BASE_BACKEND_URL}/cart-items`;
  const BRAND_API = `${BASE_BACKEND_URL}/brands`;
  const MOBILE_API = `${BASE_BACKEND_URL}/mobiles`;

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        await dispatch(fetchProducts());

        const [brandsResponse, favoritesResponse] = await Promise.all([
          fetch(BRAND_API),
          localStorage.getItem("user_token") &&
            fetch(FAVORITE_API, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
              },
            }),
        ]);

        const brandsData = await brandsResponse.json();
        setBrands(Array.isArray(brandsData.data) ? brandsData.data : []);

        if (favoritesResponse) {
          const favoritesData = await favoritesResponse.json();
          setFavorites(
            Array.isArray(favoritesData.data) ? favoritesData.data : []
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showTempMessage("❌ فشل في تحميل البيانات الأولية", 3000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const withEmptyColors = products.map((product) => ({
        ...product,
        colors: [],
        selectedColor: null,
      }));
      setProductsWithColors(withEmptyColors);
    }
  }, [products]);

  useEffect(() => {
    const unique = Array.from(
      new Map(productsWithColors.map((p) => [p.id, p])).values()
    );
    setRandomizedProducts(
      [...unique].sort(() => 0.5 - Math.random()).slice(0, 8)
    );
  }, [productsWithColors.length]);


  const showTempMessage = useCallback((msg, duration, callback) => {
    setMessageText(msg);
    setMessageType(msg.includes("✔") ? "success" : "error");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      if (callback) callback();
    }, duration);
  }, []);

  const handleColorSelect = useCallback((productId, color) => {
    setProductsWithColors((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: color }
          : product
      )
    );
  }, []);


const handleAddToCartClick = async (clickedProduct) => {
  const product = productsWithColors.find(p => p.id === clickedProduct.id);
  setOpenProductId(prev => prev === product.id ? null : product.id);

  if (product.colors && product.colors.length > 0) return;

  setIsLoadingColors(true);
  try {
    const res = await fetch(`${MOBILE_API}/${product.id}`);
    if (!res.ok) throw new Error("Failed to fetch colors");
    const data = await res.json();

    setProductsWithColors(prevProducts =>
      prevProducts.map(p =>
        p.id === product.id
          ? { 
              ...p, 
              colors: data.data?.colors?.filter(c => c.is_available) || [], 
              selectedColor: null 
            }
          : p
      )
    );
  } catch (error) {
    console.error("Error fetching colors:", error);
    showTempMessage("❌ فشل تحميل ألوان المنتج!", 3000);
  } finally {
    setIsLoadingColors(false);
  }
};

  const confirmAddToCart = useCallback(
  async (product) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
        navigate("/signeup")
      );
      return;
    }

    setIsLoading(true);
    setCurrentProduct(product.id);

    try {
      const body = {
        product_id: product.id,
        product_type: "mobile",
        quantity: 1,
      };

      if (product.colors?.length > 0) {
        if (!product.selectedColor) {
          showTempMessage("❌ يجب اختيار لون للمنتج!", 3000);
          setIsLoading(false);
          return;
        }
        
        // هنا نرسل الـ ID الخاص باللون المتاح (product_color_id)
        body.product_color_id = product.selectedColor.id;
      }

      const response = await fetch(ADD_TO_CART, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok) {
        showTempMessage("✔ تمت الإضافة إلى السلة بنجاح!", 3000);
        setOpenProductId(null);
      } else {
        showTempMessage(
          `❌ ${result.message || "حدث خطأ أثناء الإضافة!"}`,
          3000
        );
      }
    } catch (error) {
      showTempMessage("❌   يرجى مراجعة تسجيل دخولك!", 3000, () =>
          navigate("/signeup")
        );
    } finally {
      setIsLoading(false);
      setCurrentProduct(null);
    }
  },
  [navigate, showTempMessage]
);


  const handleFavorite = useCallback(
    async (product) => {
      const userToken = localStorage.getItem("user_token");
      const userId = localStorage.getItem("user_id");
      if (!userToken || !userId) {
        showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
          navigate("/signeup")
        );
        return;
      }

      const exists = favorites.find((fav) => fav.product_id === product.id);

      try {
        if (exists) {
          const res = await fetch(`${FAVORITE_API}/${exists.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` },
          });

          if (res.ok) {
            setFavorites(favorites.filter((f) => f.id !== exists.id));
            showTempMessage("✔ تمت الإزالة من المفضلة!", 2000);
          }
        } else {
          const res = await fetch(FAVORITE_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              user_id: userId,
              product_id: product.id,
              product_type: "mobile",
            }),
          });

          if (res.ok) {
            const newFav = await res.json();
            setFavorites([...favorites, newFav.data]);
            showTempMessage("✔ تمت الإضافة إلى المفضلة!", 2000);
          }
        }
      } catch (err) {
        showTempMessage("❌ خطأ أثناء الاتصال بالسيرفر!", 2000);
      }
    },
    [favorites, navigate, showTempMessage]
  );

  return (
    <div className="container randomProduct my-2" style={{ direction: "rtl" }}>
      <div className="flexable">
        <h1 className="text-center text-ran fw-bold mb-2">منتجات مرشحة</h1>
        <button
          className="btn btn-primary my-3 p-2"
          onClick={() => navigate("/products")}
        >
          رؤية المزيد من المنتجات
        </button>
      </div>

      {isFetching ? (
        <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
      ) : (
        <div className="products-grid">
          {randomizedProducts.map((product) => {
            const productWithColors =
              productsWithColors.find((p) => p.id === product.id) || product;

            return (
              <ProductCard
                key={productWithColors.id}
                product={productWithColors}
                isFavorite={favorites.some(
                  (fav) => fav.product_id === productWithColors.id
                )}
                openProductId={openProductId}
                isLoading={isLoading}
                isLoadingColors={isLoadingColors && openProductId === productWithColors.id}
                currentProduct={currentProduct}
                onFavorite={handleFavorite}
                onAddToCart={() => handleAddToCartClick(productWithColors)}
                onColorSelect={handleColorSelect}
                onConfirmAdd={confirmAddToCart}
                onDetails={() => navigate(`/mobiles/${productWithColors.id}`)}
              />
            );
          })}
        </div>
      )}

      <Snackbar
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity={messageType}
          sx={{ width: "100%" }}
        >
          {messageText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;