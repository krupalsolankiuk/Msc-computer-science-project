export type Language = 'en' | 'hi' | 'zh' | 'ko' | 'ja' | 'de' | 'es' | 'fr';

export interface Translation {
  // Common
  welcome: string;
  startCheckin: string;
  starting: string;
  loading: string;
  
  // Steps
  scanID: string;
  verify: string;
  confirm: string;
  complete: string;
  
  // Scan page
  scanTitle: string;
  scanInstruction: string;
  scanDocument: string;
  processing: string;
  scanError: string;
  
  // Verify page
  verifyTitle: string;
  verifyInstruction: string;
  takePhoto: string;
  verifying: string;
  verifyError: string;
  
  // Confirm page
  confirmTitle: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  editName: string;
  lookingUp: string;
  confirmComplete: string;
  finalising: string;
  noReservation: string;
  contactStaff: string;
  
  // Complete page
  checkedIn: string;
  yourRoom: string;
  enjoyStay: string;
  digitalKey: string;
  
  // Voice prompts
  voiceWelcome: string;
  voiceScan: string;
  voiceVerify: string;
  voiceConfirm: string;
  voiceSuccess: string;
  
  // Errors
  errorStart: string;
  errorSession: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    welcome: 'Welcome',
    startCheckin: 'Start Check-In',
    starting: 'Starting...',
    loading: 'Loading...',
    
    scanID: 'Scan ID',
    verify: 'Verify',
    confirm: 'Confirm',
    complete: 'Complete',
    
    scanTitle: 'Scan your ID or passport',
    scanInstruction: 'Hold your document flat and steady in front of the camera.',
    scanDocument: 'Scan Document',
    processing: 'Processing...',
    scanError: 'Could not read the document. Please try scanning again with better lighting.',
    
    verifyTitle: "Verify it's you",
    verifyInstruction: 'Look directly at the camera in good lighting.',
    takePhoto: 'Take Photo',
    verifying: 'Verifying...',
    verifyError: "We couldn't confirm your identity matches your document. Please try again or ask staff for assistance.",
    
    confirmTitle: 'Confirm your booking',
    room: 'Room',
    roomType: 'Room Type',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guestName: 'Guest Name',
    editName: 'Edit Name',
    lookingUp: 'Looking up your reservation…',
    confirmComplete: 'Confirm & Complete Check-In',
    finalising: 'Finalising...',
    noReservation: 'Could not find a matching reservation. Please see the front desk.',
    contactStaff: 'Please speak to a member of staff for assistance.',
    
    checkedIn: "You're checked in!",
    yourRoom: 'Your room is',
    enjoyStay: 'Enjoy your stay!',
    digitalKey: 'A digital key has been sent to your registered contact details.',
    
    voiceWelcome: 'Welcome to our hotel. Please start your check-in by scanning your ID or passport.',
    voiceScan: 'Please scan your ID or passport. Hold your document flat and steady in front of the camera.',
    voiceVerify: 'Please verify your identity. Look directly at the camera in good lighting.',
    voiceConfirm: 'Please confirm your booking details. Check your room number and dates.',
    voiceSuccess: 'Your verification is successful. Welcome to our hotel!',
    
    errorStart: 'Could not start check-in. Please try again or ask staff for help.',
    errorSession: 'Missing session data — please restart check-in.',
  },
  
  hi: {
    welcome: 'स्वागत',
    startCheckin: 'चेक-इन शुरू करें',
    starting: 'शुरू हो रहा है...',
    loading: 'लोड हो रहा है...',
    
    scanID: 'आईडी स्कैन करें',
    verify: 'सत्यापित करें',
    confirm: 'पुष्टि करें',
    complete: 'पूर्ण',
    
    scanTitle: 'अपना आईडी या पासपोर्ट स्कैन करें',
    scanInstruction: 'अपने दस्तावेज़ को कैमरे के सामने सीधा और स्थिर रखें।',
    scanDocument: 'दस्तावेज़ स्कैन करें',
    processing: 'प्रक्रिया जारी है...',
    scanError: 'दस्तावेज़ नहीं पढ़ा जा सका। कृपया बेहतर रोशनी में दोबारा स्कैन करें।',
    
    verifyTitle: 'सत्यापित करें कि यह आप हैं',
    verifyInstruction: 'अच्छी रोशनी में सीधे कैमरे की ओर देखें।',
    takePhoto: 'फोटो लें',
    verifying: 'सत्यापन हो रहा है...',
    verifyError: 'हम आपकी पहचान की पुष्टि नहीं कर सके। कृपया पुनः प्रयास करें या कर्मचारी से सहायता लें।',
    
    confirmTitle: 'अपनी बुकिंग की पुष्टि करें',
    room: 'कमरा',
    roomType: 'कमरे का प्रकार',
    checkIn: 'चेक-इन',
    checkOut: 'चेक-आउट',
    guestName: 'अतिथि का नाम',
    editName: 'नाम संपादित करें',
    lookingUp: 'आपका आरक्षण खोजा जा रहा है…',
    confirmComplete: 'पुष्टि करें और चेक-इन पूरा करें',
    finalising: 'अंतिम रूप दिया जा रहा है...',
    noReservation: 'मिलान करने वाला आरक्षण नहीं मिला। कृपया फ्रंट डेस्क देखें।',
    contactStaff: 'कृपया सहायता के लिए कर्मचारी से बात करें।',
    
    checkedIn: 'आपका चेक-इन हो गया है!',
    yourRoom: 'आपका कमरा है',
    enjoyStay: 'अपने प्रवास का आनंद लें!',
    digitalKey: 'आपके पंजीकृत संपर्क विवरण पर एक डिजिटल कुंजी भेजी गई है।',
    
    voiceWelcome: 'हमारे होटल में आपका स्वागत है। कृपया अपना आईडी या पासपोर्ट स्कैन करके अपना चेक-इन शुरू करें।',
    voiceScan: 'कृपया अपना आईडी या पासपोर्ट स्कैन करें। अपने दस्तावेज़ को कैमरे के सामने सीधा और स्थिर रखें।',
    voiceVerify: 'कृपया अपनी पहचान सत्यापित करें। अच्छी रोशनी में सीधे कैमरे की ओर देखें।',
    voiceConfirm: 'कृपया अपनी बुकिंग का विवरण पुष्टि करें। अपना कमरा नंबर और तारीखें जांचें।',
    voiceSuccess: 'आपका सत्यापन सफल है। हमारे होटल में आपका स्वागत है!',
    
    errorStart: 'चेक-इन शुरू नहीं हो सका। कृपया पुनः प्रयास करें या कर्मचारी से सहायता लें।',
    errorSession: 'सत्र डेटा गायब है — कृपया चेक-इन पुनः प्रारंभ करें।',
  },
  
  zh: {
    welcome: '欢迎',
    startCheckin: '开始办理入住',
    starting: '正在启动...',
    loading: '加载中...',
    
    scanID: '扫描证件',
    verify: '验证',
    confirm: '确认',
    complete: '完成',
    
    scanTitle: '扫描您的身份证或护照',
    scanInstruction: '将您的证件平放在摄像头前保持稳定。',
    scanDocument: '扫描证件',
    processing: '处理中...',
    scanError: '无法读取证件。请在更好的光线下重新扫描。',
    
    verifyTitle: '验证您的身份',
    verifyInstruction: '在良好的光线下直视摄像头。',
    takePhoto: '拍照',
    verifying: '验证中...',
    verifyError: '我们无法确认您的身份与证件匹配。请重试或寻求工作人员帮助。',
    
    confirmTitle: '确认您的预订',
    room: '房间',
    roomType: '房型',
    checkIn: '入住',
    checkOut: '退房',
    guestName: '客人姓名',
    editName: '编辑姓名',
    lookingUp: '正在查找您的预订…',
    confirmComplete: '确认并完成入住',
    finalising: '正在完成...',
    noReservation: '找不到匹配的预订。请前往前台。',
    contactStaff: '请与工作人员联系寻求帮助。',
    
    checkedIn: '您已办理入住！',
    yourRoom: '您的房间是',
    enjoyStay: '祝您入住愉快！',
    digitalKey: '数字钥匙已发送至您的注册联系方式。',
    
    voiceWelcome: '欢迎光临我们的酒店。请扫描您的身份证或护照开始办理入住。',
    voiceScan: '请扫描您的身份证或护照。将您的证件平放在摄像头前保持稳定。',
    voiceVerify: '请验证您的身份。在良好的光线下直视摄像头。',
    voiceConfirm: '请确认您的预订详情。检查您的房间号和日期。',
    voiceSuccess: '验证成功。欢迎光临我们的酒店！',
    
    errorStart: '无法开始办理入住。请重试或寻求工作人员帮助。',
    errorSession: '缺少会话数据 — 请重新开始办理入住。',
  },
  
  ko: {
    welcome: '환영합니다',
    startCheckin: '체크인 시작',
    starting: '시작 중...',
    loading: '로딩 중...',
    
    scanID: '신분증 스캔',
    verify: '확인',
    confirm: '예약 확인',
    complete: '완료',
    
    scanTitle: '신분증 또는 여권을 스캔하세요',
    scanInstruction: '카메라 앞에서 서류를 평평하고 안정적으로 유지하세요.',
    scanDocument: '서류 스캔',
    processing: '처리 중...',
    scanError: '서류를 읽을 수 없습니다. 더 나은 조명에서 다시 스캔해주세요.',
    
    verifyTitle: '본인 확인',
    verifyInstruction: '좋은 조명에서 카메라를 직접 바라보세요.',
    takePhoto: '사진 찍기',
    verifying: '확인 중...',
    verifyError: '신원 확인에 실패했습니다. 다시 시도하거나 직원에게 도움을 요청하세요.',
    
    confirmTitle: '예약 확인',
    room: '객실',
    roomType: '객실 유형',
    checkIn: '체크인',
    checkOut: '체크아웃',
    guestName: '투숙객 이름',
    editName: '이름 수정',
    lookingUp: '예약을 찾는 중…',
    confirmComplete: '확인 및 체크인 완료',
    finalising: '완료 중...',
    noReservation: '일치하는 예약을 찾을 수 없습니다. 프런트 데스크로 가주세요.',
    contactStaff: '도움을 받으려면 직원에게 문의하세요.',
    
    checkedIn: '체크인이 완료되었습니다!',
    yourRoom: '귀하의 객실은',
    enjoyStay: '즐거운 숙박 되세요!',
    digitalKey: '디지털 키가 등록된 연락처로 전송되었습니다.',
    
    voiceWelcome: '저희 호텔에 오신 것을 환영합니다. 신분증이나 여권을 스캔하여 체크인을 시작하세요.',
    voiceScan: '신분증 또는 여권을 스캔하세요. 카메라 앞에서 서류를 평평하고 안정적으로 유지하세요.',
    voiceVerify: '본인 확인을 진행하세요. 좋은 조명에서 카메라를 직접 바라보세요.',
    voiceConfirm: '예약 세부 정보를 확인하세요. 객실 번호와 날짜를 확인하세요.',
    voiceSuccess: '확인이 성공적으로 완료되었습니다. 저희 호텔에 오신 것을 환영합니다!',
    
    errorStart: '체크인을 시작할 수 없습니다. 다시 시도하거나 직원에게 도움을 요청하세요.',
    errorSession: '세션 데이터가 없습니다 — 체크인을 다시 시작하세요.',
  },
  
  ja: {
    welcome: 'ようこそ',
    startCheckin: 'チェックイン開始',
    starting: '開始中...',
    loading: '読み込み中...',
    
    scanID: 'ID スキャン',
    verify: '確認',
    confirm: '予約確認',
    complete: '完了',
    
    scanTitle: 'IDまたはパスポートをスキャン',
    scanInstruction: 'カメラの前で書類を平らに安定させて保持してください。',
    scanDocument: '書類をスキャン',
    processing: '処理中...',
    scanError: '書類を読み取れませんでした。より良い照明で再度スキャンしてください。',
    
    verifyTitle: '本人確認',
    verifyInstruction: '良い照明の下でカメラを直接見てください。',
    takePhoto: '写真を撮る',
    verifying: '確認中...',
    verifyError: '本人確認ができませんでした。もう一度お試しいただくか、スタッフにお尋ねください。',
    
    confirmTitle: '予約の確認',
    room: '客室',
    roomType: '客室タイプ',
    checkIn: 'チェックイン',
    checkOut: 'チェックアウト',
    guestName: 'ゲスト名',
    editName: '名前を編集',
    lookingUp: '予約を検索中…',
    confirmComplete: '確認してチェックイン完了',
    finalising: '完了中...',
    noReservation: '一致する予約が見つかりませんでした。フロントデスクにお越しください。',
    contactStaff: 'スタッフにお尋ねください。',
    
    checkedIn: 'チェックイン完了！',
    yourRoom: 'お部屋は',
    enjoyStay: 'ご滞在をお楽しみください！',
    digitalKey: 'デジタルキーが登録連絡先に送信されました。',
    
    voiceWelcome: '当ホテルへようこそ。IDまたはパスポートをスキャンしてチェックインを開始してください。',
    voiceScan: 'IDまたはパスポートをスキャンしてください。カメラの前で書類を平らに安定させて保持してください。',
    voiceVerify: '本人確認を行ってください。良い照明の下でカメラを直接見てください。',
    voiceConfirm: '予約詳細を確認してください。客室番号と日付を確認してください。',
    voiceSuccess: '確認が成功しました。当ホテルへようこそ！',
    
    errorStart: 'チェックインを開始できませんでした。もう一度お試しいただくか、スタッフにお尋ねください。',
    errorSession: 'セッションデータがありません — チェックインを再開してください。',
  },
  
  de: {
    welcome: 'Willkommen',
    startCheckin: 'Check-in starten',
    starting: 'Startet...',
    loading: 'Lädt...',
    
    scanID: 'Ausweis scannen',
    verify: 'Überprüfen',
    confirm: 'Bestätigen',
    complete: 'Fertig',
    
    scanTitle: 'Scannen Sie Ihren Ausweis oder Reisepass',
    scanInstruction: 'Halten Sie Ihr Dokument flach und ruhig vor die Kamera.',
    scanDocument: 'Dokument scannen',
    processing: 'Verarbeitung...',
    scanError: 'Das Dokument konnte nicht gelesen werden. Bitte scannen Sie erneut bei besserer Beleuchtung.',
    
    verifyTitle: 'Bestätigen Sie Ihre Identität',
    verifyInstruction: 'Schauen Sie bei guter Beleuchtung direkt in die Kamera.',
    takePhoto: 'Foto aufnehmen',
    verifying: 'Überprüfung...',
    verifyError: 'Wir konnten Ihre Identität nicht bestätigen. Bitte versuchen Sie es erneut oder wenden Sie sich an das Personal.',
    
    confirmTitle: 'Bestätigen Sie Ihre Buchung',
    room: 'Zimmer',
    roomType: 'Zimmertyp',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guestName: 'Gästename',
    editName: 'Name bearbeiten',
    lookingUp: 'Ihre Reservierung wird gesucht…',
    confirmComplete: 'Bestätigen & Check-in abschließen',
    finalising: 'Wird abgeschlossen...',
    noReservation: 'Es konnte keine passende Reservierung gefunden werden. Bitte wenden Sie sich an die Rezeption.',
    contactStaff: 'Bitte wenden Sie sich an einen Mitarbeiter.',
    
    checkedIn: 'Sie sind eingecheckt!',
    yourRoom: 'Ihr Zimmer ist',
    enjoyStay: 'Genießen Sie Ihren Aufenthalt!',
    digitalKey: 'Ein digitaler Schlüssel wurde an Ihre registrierten Kontaktdaten gesendet.',
    
    voiceWelcome: 'Willkommen in unserem Hotel. Bitte scannen Sie Ihren Ausweis oder Reisepass, um mit dem Check-in zu beginnen.',
    voiceScan: 'Bitte scannen Sie Ihren Ausweis oder Reisepass. Halten Sie Ihr Dokument flach und ruhig vor die Kamera.',
    voiceVerify: 'Bitte bestätigen Sie Ihre Identität. Schauen Sie bei guter Beleuchtung direkt in die Kamera.',
    voiceConfirm: 'Bitte bestätigen Sie Ihre Buchungsdetails. Überprüfen Sie Ihre Zimmernummer und Daten.',
    voiceSuccess: 'Ihre Überprüfung war erfolgreich. Willkommen in unserem Hotel!',
    
    errorStart: 'Check-in konnte nicht gestartet werden. Bitte versuchen Sie es erneut oder wenden Sie sich an das Personal.',
    errorSession: 'Sitzungsdaten fehlen — bitte starten Sie den Check-in neu.',
  },
  
  es: {
    welcome: 'Bienvenido',
    startCheckin: 'Iniciar registro',
    starting: 'Iniciando...',
    loading: 'Cargando...',
    
    scanID: 'Escanear ID',
    verify: 'Verificar',
    confirm: 'Confirmar',
    complete: 'Completo',
    
    scanTitle: 'Escanea tu identificación o pasaporte',
    scanInstruction: 'Mantén tu documento plano y estable frente a la cámara.',
    scanDocument: 'Escanear documento',
    processing: 'Procesando...',
    scanError: 'No se pudo leer el documento. Intenta escanear nuevamente con mejor iluminación.',
    
    verifyTitle: 'Verifica tu identidad',
    verifyInstruction: 'Mira directamente a la cámara con buena iluminación.',
    takePhoto: 'Tomar foto',
    verifying: 'Verificando...',
    verifyError: 'No pudimos confirmar que tu identidad coincida con tu documento. Intenta nuevamente o pide ayuda al personal.',
    
    confirmTitle: 'Confirma tu reserva',
    room: 'Habitación',
    roomType: 'Tipo de habitación',
    checkIn: 'Entrada',
    checkOut: 'Salida',
    guestName: 'Nombre del huésped',
    editName: 'Editar nombre',
    lookingUp: 'Buscando tu reserva…',
    confirmComplete: 'Confirmar y completar registro',
    finalising: 'Finalizando...',
    noReservation: 'No se pudo encontrar una reserva coincidente. Por favor acude a recepción.',
    contactStaff: 'Por favor habla con un miembro del personal para obtener ayuda.',
    
    checkedIn: '¡Ya estás registrado!',
    yourRoom: 'Tu habitación es',
    enjoyStay: '¡Disfruta tu estancia!',
    digitalKey: 'Se ha enviado una llave digital a tus datos de contacto registrados.',
    
    voiceWelcome: 'Bienvenido a nuestro hotel. Por favor inicia tu registro escaneando tu identificación o pasaporte.',
    voiceScan: 'Por favor escanea tu identificación o pasaporte. Mantén tu documento plano y estable frente a la cámara.',
    voiceVerify: 'Por favor verifica tu identidad. Mira directamente a la cámara con buena iluminación.',
    voiceConfirm: 'Por favor confirma los detalles de tu reserva. Verifica tu número de habitación y fechas.',
    voiceSuccess: 'Tu verificación fue exitosa. ¡Bienvenido a nuestro hotel!',
    
    errorStart: 'No se pudo iniciar el registro. Intenta nuevamente o pide ayuda al personal.',
    errorSession: 'Faltan datos de sesión — por favor reinicia el registro.',
  },
  
  fr: {
    welcome: 'Bienvenue',
    startCheckin: "Commencer l'enregistrement",
    starting: 'Démarrage...',
    loading: 'Chargement...',
    
    scanID: 'Scanner ID',
    verify: 'Vérifier',
    confirm: 'Confirmer',
    complete: 'Terminé',
    
    scanTitle: 'Scannez votre pièce d\'identité ou passeport',
    scanInstruction: 'Tenez votre document à plat et stable devant la caméra.',
    scanDocument: 'Scanner le document',
    processing: 'Traitement...',
    scanError: 'Impossible de lire le document. Veuillez réessayer avec un meilleur éclairage.',
    
    verifyTitle: 'Vérifiez votre identité',
    verifyInstruction: 'Regardez directement la caméra avec un bon éclairage.',
    takePhoto: 'Prendre une photo',
    verifying: 'Vérification...',
    verifyError: 'Nous n\'avons pas pu confirmer que votre identité correspond à votre document. Veuillez réessayer ou demander l\'aide du personnel.',
    
    confirmTitle: 'Confirmez votre réservation',
    room: 'Chambre',
    roomType: 'Type de chambre',
    checkIn: 'Arrivée',
    checkOut: 'Départ',
    guestName: 'Nom du client',
    editName: 'Modifier le nom',
    lookingUp: 'Recherche de votre réservation…',
    confirmComplete: 'Confirmer et terminer l\'enregistrement',
    finalising: 'Finalisation...',
    noReservation: 'Aucune réservation correspondante trouvée. Veuillez vous adresser à la réception.',
    contactStaff: 'Veuillez parler à un membre du personnel pour obtenir de l\'aide.',
    
    checkedIn: 'Vous êtes enregistré !',
    yourRoom: 'Votre chambre est',
    enjoyStay: 'Profitez de votre séjour !',
    digitalKey: 'Une clé numérique a été envoyée à vos coordonnées enregistrées.',
    
    voiceWelcome: 'Bienvenue dans notre hôtel. Veuillez commencer votre enregistrement en scannant votre pièce d\'identité ou passeport.',
    voiceScan: 'Veuillez scanner votre pièce d\'identité ou passeport. Tenez votre document à plat et stable devant la caméra.',
    voiceVerify: 'Veuillez vérifier votre identité. Regardez directement la caméra avec un bon éclairage.',
    voiceConfirm: 'Veuillez confirmer les détails de votre réservation. Vérifiez votre numéro de chambre et vos dates.',
    voiceSuccess: 'Votre vérification a réussi. Bienvenue dans notre hôtel !',
    
    errorStart: 'Impossible de commencer l\'enregistrement. Veuillez réessayer ou demander l\'aide du personnel.',
    errorSession: 'Données de session manquantes — veuillez redémarrer l\'enregistrement.',
  },
};

export function getTranslation(lang: Language): Translation {
  return translations[lang] || translations.en;
}
