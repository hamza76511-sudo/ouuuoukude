// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const captchaPassed = localStorage.getItem('captchaPassed') === 'true';
  
  // منع الرجوع إلى الصفحة السابقة بشكل كامل
  useEffect(() => {
    if (captchaPassed) {
      // إضافة حالة جديدة في تاريخ المتصفح
      history.pushState(null, '', window.location.href);
      
      // منع حدث الرجوع
      const preventBack = (event) => {
        event.preventDefault();
        // إعادة إضافة الحالة لمنع الرجوع
        history.pushState(null, '', window.location.href);
      };
      
      // منع حدث popstate (زر الرجوع)
      window.addEventListener('popstate', preventBack);
      
      // منع زر الرجوع في المتصفح (mouse back button)
      window.onbeforeunload = function() {
        return null;
      };
      
      return () => {
        window.removeEventListener('popstate', preventBack);
        window.onbeforeunload = null;
      };
    }
  }, [captchaPassed]);
  
  return captchaPassed ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;