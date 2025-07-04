import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import BASE_BACKEND_URL from '../../API/config';
import BASE_BACKEND_LOCAHOST_URL from '../../API/localhost';

// const API_URL = "http://localhost:8000/api/user/orders";
const API_URL = `${BASE_BACKEND_URL}/user/orders`;

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('فشل في جلب الطلبات');

        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'confirmed': return 'success';
      case 'processing': return 'info';
      case 'cancelled': return 'error';
      case 'shipped': return 'warning';
      default: return 'primary';
    }
  };

  const formatDate = (date) => moment(date).format('YYYY-MM-DD HH:mm');
  const formatPrice = (price) => parseFloat(price).toLocaleString('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleOpenDetails = (order) => setSelectedOrder(order);
  const handleCloseDetails = () => setSelectedOrder(null);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4} className="container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} className="container">
        <Typography color="error" variant="h6">خطأ: {error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box p={3} textAlign="center" className="container">
        <Typography variant="h6">لا توجد طلبات سابقة</Typography>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          تصفح المنتجات
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} className="container">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        طلباتي السابقة
      </Typography>

      {orders.map((order) => (
        <Box key={order.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">طلب #{order.id.split('-')[0]}</Typography>
              <Chip label={order.payment_status} color={getStatusColor(order.payment_status)} size="small" />
            </Box>
            <Typography variant="body2">{formatDate(order.created_at)}</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>المجموع:</Typography>
              <Typography fontWeight="bold">{formatPrice(order.total_price)} ج.م</Typography>
            </Box>
            <Button fullWidth variant="outlined" size="small" onClick={() => handleOpenDetails(order)}>
              عرض التفاصيل
            </Button>
          </CardContent>
        </Box>
      ))}

      <Dialog open={!!selectedOrder} onClose={handleCloseDetails} fullWidth maxWidth="md" dir='rtl'>
        <DialogTitle>تفاصيل الطلب</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography variant="subtitle1" gutterBottom>المستخدم: {selectedOrder.user.first_name} {selectedOrder.user.last_name}</Typography>
              <Typography variant="subtitle2" gutterBottom>الهاتف: {selectedOrder.user.phone_number}</Typography>
              <Typography variant="subtitle2" gutterBottom>المدينة: {selectedOrder.user.city} - {selectedOrder.user.area}</Typography>
              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>المنتجات:</Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <img
                        // src={`http://localhost:8000${item.product.image || item.product.image_cover}`}
                        src={`${BASE_BACKEND_LOCAHOST_URL}${item.product.image || item.product.image_cover}`}
                        alt={item.product.title}
                        style={{ width: '100%', borderRadius: 8 }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="subtitle1">{item.product.title}</Typography>
                      <Typography variant="body2" gutterBottom>{item.product.description}</Typography>
                      <Typography>النوع: {item.product_type === 'mobile' ? 'موبايل' : 'إكسسوار'}</Typography>
                      <Typography>اللون: {item.color?.name}</Typography>
                      <Typography>الكمية: {item.quantity}</Typography>
                      <Typography>السعر: {formatPrice(item.price)} ج.م</Typography>
                      <Typography>الإجمالي: {formatPrice(item.total_price)} ج.م</Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Typography>طريقة الدفع: {selectedOrder.payment_method}</Typography>
              <Typography>الملاحظة: {selectedOrder.note || 'لا يوجد'}</Typography>
              <Typography>تم الإنشاء: {formatDate(selectedOrder.created_at)}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserOrders;
