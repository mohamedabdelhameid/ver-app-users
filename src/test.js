import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productSlice";
import { addToCart } from "./cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { FaCartPlus } from "react-icons/fa";

export function Footer() {
  return (
    <div className="rtl container text-center mt-4">
      <p>
        &copy; {"   "}
        <b>
          <Link className="Mo"
            to={"https://www.facebook.com/profile.php?id=100063776365288"}
            target="_blank"
          >
            مستر موبايل
          </Link>
        </b>
        2025.
      </p>
      <p>*كل ما هو جديد في عالم الهواتف الذكيه*</p>
      <div>
        <p>تم التصميم بواسطه : </p>
          <div className="GRIDING my-3">
          <div className="hoverShow">
          <span className="fw-bold"> عبدالرحمن عبدالسميع </span>
            <div className="socialMedia m-3">
              <Link target="_blank">
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link target="_blank">
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link target="_blank">
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link target="_blank">
                <i className="fa-brands fa-facebook-f m-2"></i>
              </Link>
            </div>
          </div>
          <br />
          <div className="hoverShow">
          <span className="fw-bold"> محمد محمود حامد </span>
            <div className="socialMedia m-3">
              <Link to='https://github.com/mohamedmahmoudhamid' target="_blank">
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link to='https://www.linkedin.com/in/mohamed-mahmoud-hamid-2b1b44313?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' target="_blank">
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link to='https://wa.me/201280538625' target="_blank">
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link to='https://www.facebook.com/profile.php?id=100022375840375&mibextid=ZbWKwL' target="_blank">
                <i className="fa-brands fa-facebook-f m-2"></i>
              </Link>
            </div>
            </div>
          <br />
          <div className="hoverShow">
          <span className="fw-bold"> محمد عبدالحميد </span>
            <div className="socialMedia m-3">
              <Link to='https://github.com/mohamedabdelhameid' target="_blank">
                <i className="fa-brands fa-github m-2"></i>
              </Link>
              <Link to='https://www.linkedin.com/in/mohamed-abdel-hameed-6b36732b8' target="_blank">
                <i className="fa-brands fa-linkedin-in m-2"></i>
              </Link>
              <Link to='https://wa.me/+201120203912' target="_blank">
                <i className="fa-brands fa-whatsapp m-2"></i>
              </Link>
              <Link to='https://www.facebook.com/share/167YmfNBi2/' target="_blank">
                <i className="fa-brands fa-facebook-f m-2"></i>
              </Link>
            </div>
            </div>
          </div>
      </div>
    </div>
  );
}

function Home() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchProducts()).then(() => setIsFetching(false));
  }, [dispatch]);

  const products = useSelector((state) => state.products.items || []);
  const randomProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  const handleAddToCart = async (product) => {
    setIsLoading(true);
    setMessage("جارٍ إضافة المنتج...");
    await dispatch(addToCart(product));
    setIsLoading(false);
    setMessage("✔ تم إضافة المنتج بنجاح! 🎉");
    setTimeout(() => setMessage(""), 5000);
  };

  const navigate = useNavigate();

  return (
    <div className="container randomProduct my-2">
      <div className="flexable">
          <h1 className="text-cente text-ran fw-bold mb-2">منتجات مرشحة</h1>
            <button
                className="btn btn-primary my-3 p-2"
                onClick={()=>{navigate("/products")}}
              >
                رؤية المزيد من المنتجات
              </button>
      </div>

      {isFetching && (
        <div className="loading-products">⏳ جارٍ تحميل المنتجات...</div>
      )}
      {isLoading && <div className="loading-spinner">⏳ جارٍ المعالجة...</div>}
      {message && <div className="message-box">{message}</div>}

      {!isFetching && (
        <div className="product-list div-0">
          {randomProducts.map((product) => (
            <div key={product._id} className="product-card div-1">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.imageCover}
                  width="100%"
                  alt={product.title || "صورة المنتج"}
                  className="imgProduct rounded-3"
                />
              </Link>
              {product.brand?.name && (
                <p className="product-pric text-center fw-800">{product.brand.name}</p>
              )}
              {product.title && (
                <p className="product-title text-center fw-bold">
                  {product.title}
                </p>
              )}
              {product.price && (
                <p className="product-price text-center fw-800">{product.price} جنية</p>
              )}

              <button
                className="btn btn-success w-100 my-3"
                onClick={() => handleAddToCart(product)}
                disabled={isLoading}
              >
                {isLoading ? (
                    <span className="loader"></span>
                ) : (
                    <> أضف الى {<FaCartPlus />}</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    {/* <Footer/> */}
    </div>
  );
}
