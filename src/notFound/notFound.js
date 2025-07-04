import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./notFound.css";
import img from '../img/notFound.png';
import Logo from '../img/mobileLogo.svg';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <img src={Logo} alt="" width='100px' style={{position:'absolute',top:'10px',left:'30px'}}/>
      <Box className="notFound" display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" textAlign="center">
        <img src={img} alt=""/>
        <Typography variant="h5" mb={2}>
          الصفحة غير موجودة
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3} maxWidth="400px">
          يبدو أنك وصلت إلى صفحة غير صحيحة. تأكد من العنوان أو عد إلى الصفحة الرئيسية.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate("/")}>العودة إلى الصفحة الرئيسية</Button>
      </Box>
    </>
  );
};

export default NotFound;
