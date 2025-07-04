import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoImg from "../img/mobileLogo.svg";
import "./nav_stayel.css";
import {
  FaHome,
  FaStore,
  FaPhoneAlt,
  FaSignInAlt,
  FaHeart,
  FaUser,
} from "react-icons/fa";
import BASE_BACKEND_URL from "../API/config";

const MyNavbar = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user_token"));
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // تحديث العدادات عند تغيير المسار أو عند تغيير حالة تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      fetchCounts(token);
    }
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // تحديث الوضع الداكن
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // جلب عدد العناصر في السلة والمفضلة
  const fetchCounts = async (token) => {
    try {
      // جلب عدد عناصر السلة
      // "http://localhost:8000/api/cart"
      const cartResponse = await fetch(`${BASE_BACKEND_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        const newCartCount = cartData.total_quantity || cartData.data?.total_quantity || 0;
        if (newCartCount !== cartCount) {
          setCartAnimate(true);
          setCartCount(newCartCount);
        }
      }

      // جلب عدد عناصر المفضلة
      // "http://localhost:8000/api/wishlist"
      const wishlistResponse = await fetch(`${BASE_BACKEND_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        const newWishlistCount = wishlistData.length || wishlistData.data?.length || wishlistData.count || 0;
        if (newWishlistCount !== wishlistCount) {
          setWishlistAnimate(true);
          setWishlistCount(newWishlistCount);
        }
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // البحث عن المنتجات
  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      // "http://localhost:8000/api/mobiles"
      const response = await fetch(`${BASE_BACKEND_URL}/mobiles`);
      const data = await response.json();
      if (data && data.data) {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        const filteredResults = data.data.filter((product) =>
          product.title?.toLowerCase().includes(normalizedSearchTerm)
        );

        if (filteredResults.length > 0) {
          navigate(`/products?search=${searchTerm}`, {
            state: { results: filteredResults },
          });
        } else {
          alert("❌ لم يتم العثور على منتجات بهذا الاسم!");
        }
      }
    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error);
    }
  };

  return (
    <Navbar expand="lg" className={`navLink custom-navbar ${darkMode ? "dark" : "light"}`} expanded={expanded}>
      <Container className="d-flex align-items-center justify-content-between w-100">
        <img 
          className="logoM" 
          src={LogoImg} 
          alt="Logo" 
          onClick={() => navigate("/")} 
          loading="lazy" 
        />

        <div className="d-flex align-items-center order-lg-2">
          {/* زر تغيير الوضع */}
          <span id="theme_switch" className="me-3">
            <input 
              type="checkbox" 
              id="checkbox" 
              hidden 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)} 
            />
            <label htmlFor="checkbox" className="checkbox-label">
              <i className="fas fa-moon"></i>
              <i className="fas fa-sun"></i>
              <span className="ball"></span>
            </label>
          </span>

          {/* أيقونة المفضلة مع العداد */}
          <Link 
            to="/fouvrit" 
            className={`position-relative cart-icon me-3 ${wishlistAnimate ? "animate" : ""}`} 
            onAnimationEnd={() => setWishlistAnimate(false)}
          >
            <FaHeart className="fs-1 text-danger" />
            {/* {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>} */}
          </Link>

          {/* أيقونة السلة مع العداد */}
          <Link 
            to="/yourCart" 
            className={`position-relative cart-icon me-3 ${cartAnimate ? "animate" : ""}`} 
            onAnimationEnd={() => setCartAnimate(false)}
          >
            <ShoppingCartIcon className="fs-1" />
            {/* {cartCount > 0 && <span className="cart-badge">{cartCount}</span>} */}
          </Link>

          {/* زر البحث للجوال */}
          <button 
            className="search-toggle d-lg-none" 
            onClick={() => navigate("/searchProducts")}
          >
            <i className="fas fa-search"></i>
          </button>

          {/* زر القائمة للجوال */}
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="Toogless" 
            onClick={() => setExpanded(!expanded)} 
          />
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="nav-links d-flex gap-4">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`befor ${activeTab === "/" ? "active" : ""}`} 
              onClick={() => { 
                setActiveTab("/"); 
                setExpanded(false); 
              }}
            >
              <FaHome className="nav-icon" /> الصفحة الرئيسية
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/products" 
              className={`befor ${activeTab === "/products" ? "active" : ""}`} 
              onClick={() => { 
                setActiveTab("/products"); 
                setExpanded(false); 
              }}
            >
              <FaStore className="nav-icon" /> المنتجات
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={`befor ${activeTab === "/contact" ? "active" : ""}`} 
              onClick={() => { 
                setActiveTab("/contact"); 
                setExpanded(false); 
              }}
            >
              <FaPhoneAlt className="nav-icon" /> تواصل معنا
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to={isLoggedIn ? "/account" : "/signeup"} 
              className={`sing ${activeTab === "/signeup" ? "active" : ""}`} 
              onClick={() => { 
                setActiveTab("/signeup"); 
                setExpanded(false); 
              }}
            >
              {isLoggedIn ? <FaUser className="nav-icon singg" /> : <FaSignInAlt className="nav-icon singg" />}
              {isLoggedIn ? "حسابي" : "تسجيل الدخول"}
            </Nav.Link>
          </Nav>

          <Form 
            className="d-lg-flex search-form" 
            onSubmit={handleSearch} 
            style={{ direction: "rtl" }}
          >
            <Button 
              variant="outline-success" 
              onClick={() => navigate("/searchProducts")}
            >
              بحث
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;