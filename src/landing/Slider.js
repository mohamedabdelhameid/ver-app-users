import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../user/cart/cartSlice";
import Carousel from "react-bootstrap/Carousel";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";

import banner1 from "../img/banner_home1.png";
import banner2 from "../img/banner_home2.png";
import banner3 from "../img/banner_box1.jpg";

import "./home.css";
import { fetchProducts } from "../products/productSlice";
import "./slider.css";

import { useLocation } from "react-router-dom";

export const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // تأخير بسيط للتأكد من تحميل العنصر
    }
  }, [location]);

  return null;
};


function ControlledCarousel() {
  const navigate = useNavigate();
  return (
    <Carousel interval={3000} className="slider">
      <Carousel.Item
        onClick={() => {
          window.location.href = "/Products#accessory";
        }}
        
      >
        <img
          src={banner1}
          className="imgSlider d-block w-100"
          alt="First slide"
          loading="lazy"
        />
      </Carousel.Item>
      <Carousel.Item
        onClick={() => {
          navigate("/Products");
        }}
      >
        <img
          src={banner3}
          className="imgSlider d-block w-100"
          alt="Second slide"
          loading="lazy"
        />
      </Carousel.Item>
      <Carousel.Item
        onClick={() => {
          window.location.href = "/Products#accessory";
        }}
      
      >
        <img
          src={banner2}
          className="imgSlider d-block w-100"
          alt="Third slide"
          loading="lazy"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
