import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./aboutus.css";

const AboutUs = () => {
  const showInMap = (url) => {
    window.open(
      url,
      "_blank",
      "location=yes,height=570,width=765,scrollbars=yes,status=yes,top=50,left=300"
    );
  };

  return (
    <Container className="about-us py-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h2 className="mb-4 text-center" style={{ direction: "rtl" }}>
            مرحبًا بكم في Mister Mobile
          </h2>

          <p className="lead" style={{ direction: "rtl" }}>
            Mister Mobile هو وجهتك المثالية لشراء أحدث الهواتف الذكية
            والإكسسوارات الأصلية، بالإضافة إلى تقديم خدمات صيانة وإصلاح احترافية
            لجميع أنواع الهواتف المحمولة. نحن نؤمن بأهمية توفير منتجات عالية
            الجودة بأسعار تنافسية، مع ضمان أفضل تجربة للعملاء.
          </p>
        </Col>
      </Row>

      <Row className="text-center my-4" style={{ direction: "rtl" }}>
        <Col md={4} className="mb-3 cardBody">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <h5>📱 أحدث الهواتف الذكية</h5>
              <p>نوفر أحدث الأجهزة من العلامات التجارية الموثوقة.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 cardBody">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <h5>🔌 إكسسوارات أصلية</h5>
              <p>كفرات، سماعات، شواحن، وحمايات الشاشة.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 cardBody">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <h5>🛠 صيانة وإصلاح</h5>
              <p>إصلاح احترافي بأيدي خبراء معتمدين.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center" style={{ direction: "rtl" }}>
        <Col>
          <h4 className="fw-bold d-flex align-items-center justify-content-center p-3">
            عناوين الفروع
          </h4>

          <p
            className="fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() =>
              showInMap(
                "https://www.google.com/maps/place/%D9%85%D8%B3%D8%AA%D8%B1+%D9%85%D9%88%D8%A8%D8%A7%D9%8A%D9%84%E2%80%AD/@26.5621073,31.68856,152m/data=!3m1!1e3!4m6!3m5!1s0x144f59332df3fa9d:0x69a5bdc30b4b3c81!8m2!3d26.5621121!4d31.6888872!16s%2Fg%2F11jcml8mbn!5m1!1e4?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
              )
            }
          >
            <i className="fa-solid fa-map-marker-alt"></i>{" "}
            شارع 15, سوهاج
          </p>

          <p
            className="fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() =>
              showInMap(
                "https://www.google.com/maps/place/%D9%85%D8%B3%D8%AA%D8%B1+%D9%85%D9%88%D8%A8%D9%8A%D9%86%D9%8A%D9%84%E2%80%AD/@26.6995991,31.6015581,63m/data=!3m1!1e3!4m6!3m5!1s0x14458aed8f32ff67:0x87ae83ca777fd91c!8m2!3d26.6996719!4d31.6018843!16s%2Fg%2F11jcn2vnfb?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
              )
            }
          >
            <i className="fa-solid fa-map-marker-alt"></i>{" "}
            شارع أحمد بدوي, المراغة
          </p>

          <p
            className="fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() =>
              showInMap(
                "https://www.google.com.eg/maps/search/%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D8%BA%D8%A9+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%B9%D8%A8%D8%AF+%D8%A7%D9%84%D9%85%D9%86%D8%B9%D9%85+%D8%B1%D9%8A%D8%A7%D8%B6%E2%80%AD/@26.6986549,31.6029286,19z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
              )
            }
          >
            <i className="fa-solid fa-map-marker-alt"></i>{" "}
            شارع عبدالمنعم رياض, المراغة
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
