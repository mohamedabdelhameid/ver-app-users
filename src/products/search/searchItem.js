import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./search.css";
import { FaCartPlus, FaHeart, FaTimes, FaSpinner } from "react-icons/fa";
import { Collapse } from "react-bootstrap";
import MyNavbar from "../../landing/navbar";
import { Footer } from "../../landing/home";
import { ScrollToHashElement } from "../../landing/Slider";
import BASE_BACKEND_URL from "../../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../../API/localhost";

export default function SearchResult() {
  const ACCESSORIES_API = `${BASE_BACKEND_URL}/accessories`;
  const BRAND_API = `${BASE_BACKEND_URL}/brands`;
  const WISHLIST_API = `${BASE_BACKEND_URL}/wishlist`;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [brands, setBrands] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openProductId, setOpenProductId] = useState(null);
  const [loadingColors, setLoadingColors] = useState(false);
  const [productsLoadingColors, setProductsLoadingColors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [productsRes, accessoriesRes, brandsRes] = await Promise.all([
          fetch(`${BASE_BACKEND_URL}/mobiles`),
          fetch(ACCESSORIES_API),
          fetch(BRAND_API),
        ]);

        if (!productsRes.ok || !accessoriesRes.ok || !brandsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const accessoriesData = await accessoriesRes.json();
        const brandsData = await brandsRes.json();

        // نحمّل المنتجات بدون الألوان أولاً
        const productsWithoutColors = (productsData.data || []).map(
          (product) => ({
            ...product,
            colors: null,
            selectedColor: null,
          })
        );

        setProducts(productsWithoutColors);
        setFilteredProducts(productsWithoutColors);

        const accessoriesWithType = (accessoriesData.data || []).map(
          (item) => ({
            ...item,
            product_type: "accessory",
          })
        );

        setAccessories(accessoriesWithType);
        setFilteredAccessories(accessoriesWithType);

        const brandMap = {};
        (brandsData.data || []).forEach((brand) => {
          brandMap[brand.id] = {
            name: brand.name,
            // image: brand.image ? `http://localhost:8000${brand.image}` : null,
            image: brand.image
              ? `${BASE_BACKEND_LOCAHOST_URL}${brand.image}`
              : null,
          };
        });
        setBrands(brandMap);

        // جلب المفضلة إذا كان المستخدم مسجل الدخول
        const userToken = localStorage.getItem("user_token");
        if (userToken) {
          const wishlistRes = await fetch(WISHLIST_API, {
            headers: { Authorization: `Bearer ${userToken}` },
          });

          if (wishlistRes.ok) {
            const wishlistData = await wishlistRes.json();
            setFavorites(wishlistData.data || []);
          }
        }
      } catch (error) {
        showTempMessage("❌ فشل في تحميل البيانات!", 3000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  // دالة لتحميل ألوان منتج معين
  const loadProductColors = async (productId) => {
    setLoadingColors(true);
    setProductsLoadingColors((prev) => ({ ...prev, [productId]: true }));

    try {
      const token = localStorage.getItem("user_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${BASE_BACKEND_URL}/mobiles/${productId}`, {
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch product colors");

      const data = await response.json();
      const colors = data.data?.colors || [];

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, colors } : p))
      );

      setFilteredProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, colors } : p))
      );

      return colors;
    } catch (error) {
      console.error("Error loading colors:", error);
      return [];
    } finally {
      setLoadingColors(false);
      setProductsLoadingColors((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredProds = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        brands[product.brand_id]?.name?.toLowerCase().includes(query)
    );

    const filteredAccs = accessories.filter(
      (accessory) =>
        accessory.title.toLowerCase().includes(query) ||
        brands[accessory.brand_id]?.name?.toLowerCase().includes(query)
    );

    setFilteredProducts(filteredProds);
    setFilteredAccessories(filteredAccs);
  };

  const handleColorSelect = (productId, color) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: color }
          : product
      )
    );

    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: color }
          : product
      )
    );
  };

  // عند الضغط على زر إضافة للسلة
  const handleAddToCart = async (product) => {
    // إذا كان القسم مفتوح بالفعل، نغلقه
    if (openProductId === product.id) {
      setOpenProductId(null);
      return;
    }

    // إذا كان المنتج موبايل وليس لديه ألوان محملة بعد
    const isMobile = !product.image;
    if (isMobile && product.colors === null) {
      await loadProductColors(product.id);
    }

    // فتح قسم إضافة للسلة
    setOpenProductId(product.id);
  };

  const confirmAddToCart = async (product) => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
        navigate("/signeup")
      );
      return;
    }

    const isMobile = !product.image;
    const requiresColor =
      isMobile && product.colors && product.colors.length > 0;

    if (requiresColor && !product.selectedColor) {
      showTempMessage("❌ يجب اختيار لون للمنتج أولاً!", 3000);
      return;
    }

    setIsLoading(true);
    setCurrentProduct(product.id);

    try {
      const productType = isMobile ? "mobile" : "accessory";
      const requestBody = {
        product_id: product.id,
        product_type: productType,
        quantity: 1,
      };

      if (requiresColor && product.selectedColor) {
        requestBody.product_color_id = product.selectedColor.id;
      }

      const response = await fetch(`${BASE_BACKEND_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (response.ok) {
        showTempMessage("✔ تمت الإضافة إلى السلة بنجاح!", 3000);
        setOpenProductId(null);
      } else {
        showTempMessage("❌   يرجى مراجعة تسجيل دخولك!", 3000, () =>
          navigate("/signeup")
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
  };

  const handleFavorite = async (product) => {
    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");

    if (!userToken || !userId) {
      showTempMessage("❌ يجب تسجيل الدخول أولاً!", 3000, () =>
        navigate("/signeup")
      );
      return;
    }

    const productType = product.image ? "accessory" : "mobile";
    const existingFavorite = favorites.find(
      (fav) => fav.product_id === product.id && fav.product_type === productType
    );

    try {
      if (existingFavorite) {
        const response = await fetch(
          `${BASE_BACKEND_URL}/wishlist/${existingFavorite.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        if (response.ok) {
          setFavorites(
            favorites.filter((fav) => fav.id !== existingFavorite.id)
          );
          showTempMessage("❌ تمت الإزالة من المفضلة!", 2000);
        }
      } else {
        const response = await fetch(WISHLIST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product.id,
            product_type: productType,
          }),
        });

        if (response.ok) {
          const newFavorite = await response.json();
          setFavorites([...favorites, newFavorite.data]);
          showTempMessage("✔ تمت الإضافة إلى المفضلة!", 2000);
        }
      }
    } catch (error) {
      showTempMessage("❌ خطأ أثناء الاتصال بالسيرفر!", 2000);
    }
  };

  const showTempMessage = (message, duration, callback) => {
    setMessageText(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      if (callback) callback();
    }, duration);
  };

  const renderProductCard = (product) => {
    const isAccessory = !!product.image;
    const isFavorite = favorites.some(
      (fav) =>
        fav.product_id === product.id &&
        fav.product_type === (isAccessory ? "accessory" : "mobile")
    );

    const imageUrl = isAccessory
      ? // ? `http://localhost:8000${product.image}`
        `${BASE_BACKEND_LOCAHOST_URL}${product.image}`
      : // : `http://localhost:8000${product.image_cover}`;
        `${BASE_BACKEND_LOCAHOST_URL}${product.image_cover}`;

    return (
      <div
        className="product-card"
        key={`${isAccessory ? "acc-" : "prod-"}${product.id}`}
        style={{ direction: "ltr" }}
      >
        <div className="product-header">
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite(product);
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
            src={imageUrl}
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
          <button
            className="details-btn"
            onClick={() =>
              navigate(
                `/${isAccessory ? "accessories" : "mobiles"}/${product.id}`
              )
            }
          >
            التفاصيل
          </button>
          <button
            className="cart-btn"
            onClick={() => handleAddToCart(product)}
            disabled={isLoading || product.total_quantity <= 0}
            aria-disabled={isLoading || product.total_quantity <= 0}
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
            {/* عرض حالة التحميل إذا كانت الألوان قيد التحميل */}
            {!isAccessory && productsLoadingColors[product.id] && (
              <div className="colors-loading">
                <FaSpinner className="spinner" />
                <span>جاري تحميل الألوان...</span>
              </div>
            )}

            {/* عرض الألوان إذا كانت متوفرة */}
            {!isAccessory && product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <h6>اختر اللون:</h6>
                <div className="color-options">
                  {product.colors
                    .filter(
                      (c) =>
                        c.color &&
                        typeof c.color.hex_code === "string" &&
                        c.color.hex_code.startsWith("#")
                    )
                    .map((colorOption) => {
                      const hex = colorOption.color.hex_code;
                      return (
                        <div
                          key={colorOption.id}
                          className={`color-option ${
                            product.selectedColor?.id === colorOption.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleColorSelect(product.id, colorOption)
                          }
                          style={{
                            backgroundColor: hex,
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
                          title={colorOption.color.name || hex}
                        >
                          {product.selectedColor?.id === colorOption.id && (
                            <span
                              className="color-check"
                              style={{
                                color: getContrastColor(hex),
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            <button
              className="confirm-btn"
              onClick={(e) => {
                e.stopPropagation();
                confirmAddToCart(product);
              }}
              disabled={
                isLoading ||
                (!isAccessory &&
                  product.colors?.length > 0 &&
                  !product.selectedColor)
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
  };

  const getContrastColor = (hexColor) => {
    const safeColor = typeof hexColor === "string" ? hexColor : "#ffffff";
    const r = parseInt(safeColor.substr(1, 2), 16);
    const g = parseInt(safeColor.substr(3, 2), 16);
    const b = parseInt(safeColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  return (
    <>
      <MyNavbar />
      <ScrollToHashElement />

      <main className="products-page" style={{ direction: "rtl" }}>
        <div className="search-container mb-4">
          <input
            type="text"
            placeholder="ابحث عن منتج أو ماركة..."
            className="form-control"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <h2 className="fw-bold">
          {searchQuery ? `نتائج البحث عن "${searchQuery}"` : "جميع المنتجات"}
        </h2>

        {filteredProducts.length === 0 && filteredAccessories.length === 0 ? (
          <div className="no-products">لا توجد منتجات مطابقة للبحث</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => renderProductCard(product))}
            {filteredAccessories.map((accessory) =>
              renderProductCard(accessory)
            )}
          </div>
        )}

        {showMessage && (
          <div
            className={`notification ${
              messageText.includes("✔") ? "success" : "error"
            }`}
          >
            <span>{messageText}</span>
            <button onClick={() => setShowMessage(false)} aria-label="إغلاق">
              <FaTimes />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
