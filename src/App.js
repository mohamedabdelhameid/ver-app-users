import React, { useState, useEffect } from "react";
import Home, { Footer } from './landing/home';
import Slider from "./landing/Slider";
import AboutUs from './landing/aboutus';
import MyNavbar from "./landing/navbar";
import { ScrollToHashElement } from "./landing/Slider";
import SplashScreen from "./components/SplashScreen";

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500); // وقت عرض الاسبلاش (2.5 ثانية)

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <>
            <MyNavbar />
            <Slider />
            <Home />
            <AboutUs />
            <Footer />
            <ScrollToHashElement />
        </>
    );
}

export default App;