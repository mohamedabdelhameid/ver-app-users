import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from 'react-redux';
import store from './products/store';
import Ffetch from './products/products';
import ProductDetails from './products/productDetails';
import Cart from './user/cart/cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Contact from "./user/contact/contact";
import SearchComponent from './products/search/searchItem';
import NotFound from './notFound/notFound';
import Singup from './user/account/singeup'
import Forgot from './user/account/forgot-password'
import Login from './user/account/login'
import VerifyCode from './user/account/VerifyCode';
import Favorites from './user/favourite/fouvrit';
import Accountinformation from './user/account/account';
import AccessoryDetails from "./products/accessoryDetails";
import SearchResult from './products/search/searchItem';
import * as serviceWorkerRegistration from './serviceWorker';
import OrderDetails from './user/orders/ordersDetail';
import MyNavbar from './landing/navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* <MyNavbar /> */}
        <Routes>

          <Route path="/" element={<App />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Products" element={<Ffetch />} />
          <Route path="/searchProducts" element={<SearchResult />} />
          <Route path="/yourCart" element={<Cart />} />
          <Route path="/mobiles/:id" element={<ProductDetails />} />
          <Route path="/accessories/:id" element={<AccessoryDetails />} />
          <Route path="/searchresult" element={<SearchComponent />} />
          <Route path="/signeup" element={<Singup />} />
          <Route path="/forgot-password" element={< Forgot/>} />
          <Route path="/login" element={< Login/>} />
          <Route path="/resetPassword" element={< VerifyCode/>} />
          <Route path="/fouvrit" element={< Favorites/>} />
          <Route path="/account" element={< Accountinformation/>} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();