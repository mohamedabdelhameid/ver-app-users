import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./products.css";
import { Footer } from "../landing/home";
import { FaCartPlus, FaHeart, FaTimes } from "react-icons/fa";
import { Collapse } from "react-bootstrap";
import MyNavbar from "../landing/navbar";
import { ScrollToHashElement } from "../landing/Slider";
import BASE_BACKEND_URL from "../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [openProductId, setOpenProductId] = useState(null);

  const BRAND_API = `${BASE_BACKEND_URL}/brands`;
  const WISHLIST_API = `${BASE_BACKEND_URL}/wishlist`;
  const ACCESSORIES_API = `${BASE_BACKEND_URL}/accessories`;

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

        // هنا نجيب المنتجات بدون الألوان (colors: null)
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

  useEffect(() => {
    if (selectedCategory === "الكل") {
      setFilteredProducts(products);
      setFilteredAccessories(accessories);
    } else {
      // **التعديل هنا:** الوصول إلى brand.id بدلاً من brand_id
      setFilteredProducts(
        products.filter((p) => p.brand?.id == selectedCategory)
      );
      setFilteredAccessories(
        accessories.filter((a) => a.brand?.id == selectedCategory)
      );
    }
  }, [selectedCategory, products, accessories]);

  // دالة لتحميل ألوان المنتج عند الضغط على "أضف للسلة"
  const loadColorsForProduct = async (productId) => {
    try {
      const token = localStorage.getItem("user_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const detailsRes = await fetch(
        `${BASE_BACKEND_URL}/mobiles/${productId}`,
        {
          headers,
        }
      );
      if (!detailsRes.ok) throw new Error("Failed to fetch product details");
      const detailsData = await detailsRes.json();

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                colors: detailsData.data?.colors || [],
                selectedColor: null,
              }
            : product
        )
      );
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                colors: detailsData.data?.colors || [],
                selectedColor: null,
              }
            : product
        )
      );
    } catch (error) {
      // لا تعرض رسالة خطأ هنا
    }
  };

  // عند الضغط على زر "أضف للسلة" نحمل الألوان (لو مش محملة) ثم نفتح اختيار اللون
  const handleAddToCart = async (product) => {
    if (openProductId === product.id) {
      setOpenProductId(null);
    } else {
      if (!product.colors) {
        await loadColorsForProduct(product.id);
      }
      setOpenProductId(product.id);
    }
  };

  const confirmAddToCart = async (product) => {
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
      const productType = product.product_type || "mobile";
      const response = await fetch(`${BASE_BACKEND_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          product_type: productType,
          quantity: 1,
          product_color_id: product.selectedColor?.id || null,
        }),
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

    const productType = product.product_type || "mobile";
    const existingFavorite = favorites.find(
      (fav) => fav.product_id === product.id && fav.product_type === productType
    );

    try {
      if (existingFavorite) {
        const response = await fetch(`${WISHLIST_API}/${existingFavorite.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        });

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

  const handleColorSelect = (productId, color, isAccessory = false) => {
    if (isAccessory) {
      setFilteredAccessories((prevAccessories) =>
        prevAccessories.map((accessory) =>
          accessory.id === productId
            ? { ...accessory, selectedColor: color }
            : accessory
        )
      );
    } else {
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, selectedColor: color }
            : product
        )
      );
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

  // Render product card
  const renderProductCard = (product, isAccessory = false) => {
    const isFavorite = favorites.some(
      (fav) =>
        fav.product_id === product.id &&
        fav.product_type === (isAccessory ? "accessory" : "mobile")
    );

    const imageUrl = isAccessory
      ? product.image
        ? // ? `http://localhost:8000${product.image}`
          `${BASE_BACKEND_LOCAHOST_URL}${product.image}`
        : "/placeholder-product.png"
      : product.image_cover
      ? // ? `http://localhost:8000${product.image_cover}`
        `${BASE_BACKEND_LOCAHOST_URL}${product.image_cover}`
      : "/placeholder-product.png";

    return (
      <div
        className="product-card"
        key={`${isAccessory ? "acc-" : "prod-"}${product.id}`}
        style={{ direction: "rtl" }}
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
          {product.storage && (
            <h5 className="rtl-layout">{product.storage} جيجا بايت</h5>
          )}
          <div className="price" style={{ direction: "rtl" }}>
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
          </div>
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
            {/* عرض الألوان إذا كانت متوفرة */}
            {product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <h6>اختر اللون:</h6>
                <div className="color-options">
                  {product.colors
                    .filter(
                      (color) => color.is_available && color.stock_quantity > 0
                    )
                    .map((color) => (
                      <div
                        key={color.id}
                        className={`color-option ${
                          product.selectedColor?.id === color.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleColorSelect(product.id, color, isAccessory)
                        }
                        title={color.color.name}
                        style={{
                          backgroundColor: color.color.hex_code,
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      >
                        {product.selectedColor?.id === color.id && (
                          <span className="color-check">✓</span>
                        )}
                      </div>
                    ))}
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
                (product.colors?.length > 0 && !product.selectedColor)
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

  return (
    <>
      <MyNavbar />
      <ScrollToHashElement />

      <main className="products-page">
        <div className="brand-filter">
          <div
            className={`brand-circle ${
              selectedCategory === "الكل" ? "selected" : ""
            }`}
            onClick={() => setSelectedCategory("الكل")}
          >
            <p>الكل</p>
          </div>
          {Object.keys(brands).map((brandId) => (
            <div
              key={brandId}
              className={`brand-circle ${
                selectedCategory === brandId ? "selected" : ""
              }`}
              // **التغيير هنا (الوحيد):** لا حاجة لـ Number() طالما أن brandId في "brands" هو نفس النوع (نص) الذي يأتي من API للماركات
              onClick={() => setSelectedCategory(brandId)}
            >
              {brands[brandId].image ? (
                <img
                  src={brands[brandId].image}
                  alt={brands[brandId].name}
                  className="brand-image"
                />
              ) : (
                <p>{brands[brandId].name}</p>
              )}
            </div>
          ))}
        </div>

        {/* Products Section */}
        <section className="products-section" style={{ direction: "rtl" }}>
          <h2>موبايلات</h2>
          <div className="products-grid">
            {isFetching ? (
              <div className="loading">جاري التحميل...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => renderProductCard(product))
            ) : (
              <div className="no-products">لا توجد منتجات متاحة</div>
            )}
          </div>
        </section>

        {/* Accessories Section */}
        <section className="products-section" style={{ direction: "rtl" }}>
          <h2>إكسسوارات</h2>
          <div className="products-grid">
            {isFetching ? (
              <div className="loading">جاري التحميل...</div>
            ) : filteredAccessories.length > 0 ? (
              filteredAccessories.map((accessory) =>
                renderProductCard(accessory, true)
              )
            ) : (
              <div className="no-products">لا توجد إكسسوارات متاحة</div>
            )}
          </div>
        </section>

        {/* Message Notification */}
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
