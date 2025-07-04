import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './productSlice';
import ProductCard from './productCard';
import Spinner from 'react-bootstrap/Spinner';

function ProductList() {
  const dispatch = useDispatch();
  const datas = useSelector(state => state.datas.items || []);

  console.log("Fetched Products from Redux:", datas); // تحقق من البيانات في الـ Console

  useEffect(() => {
    console.log("Fetching products...");
    dispatch(fetchProducts());
  }, [dispatch]);

  let content;

  if (!datas || datas.length === 0) {
    content = (
      <div style={{ width: "100%", margin: 'auto', textAlign: 'center', padding: '15px' }}>
        <Spinner animation="border" variant="success" />
        <p>Loading products...</p>
      </div>
    );
  } else {
    content = datas.map((data, index) => {
      console.log(`Data at index ${index}:`, data);
      return data ? <ProductCard key={data.id} data={data} /> : null;
    });
  }

  return (
    <div className="product-list">
      <div className="div-0 container" id="pproducct">
        {content}
      </div>
    </div>
  );
}

export default ProductList;
